// Copyright 2026 Ahmad Ali Parr. All rights reserved.
const json=(data,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
const email='A.parr@belespritdaccord.uk';
export async function readBody(request,max=16000){
 const len=Number(request.headers.get('content-length')||0);if(len>max)throw new Error('Request is too large.');
 const reader=request.body?.getReader();if(!reader)throw new Error('Request body is required.');
 let size=0;const chunks=[];try{while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>max){await reader.cancel();throw new Error('Request is too large.');}chunks.push(value);}}finally{reader.releaseLock();}
 const bytes=new Uint8Array(size);let offset=0;for(const c of chunks){bytes.set(c,offset);offset+=c.byteLength;}return new TextDecoder().decode(bytes);
}
export function validMessages(messages){return Array.isArray(messages)&&messages.length>0&&messages.length<=9&&messages.at(-1)?.role==='user'&&messages.every(m=>m&&['user','assistant'].includes(m.role)&&typeof m.content==='string'&&m.content.trim().length>0&&m.content.length<=(m.role==='user'?700:1200));}
export async function handle(request,env,fetcher=fetch){
 const url=new URL(request.url);
 if(url.pathname==='/api/health')return json({service:'bel-esprit-daccord-trust',contact:'email-draft',chat:env.LOCAL_CHAT_URL&&env.LOCAL_CHAT_TOKEN?'configured':'not-configured'});
 if(!url.pathname.startsWith('/api/'))return env.ASSETS.fetch(request);
 if(!['/api/contact','/api/chat'].includes(url.pathname))return json({error:'Route not found.'},404);
 if(request.method!=='POST')return json({error:'Use POST for this endpoint.'},405);
 const origin=request.headers.get('origin');const expected=env.SITE_ORIGIN||'https://belespritdaccord.uk';if(origin!==expected&&origin!==url.origin)return json({error:'Request origin is not allowed.'},403);
 if(!env.API_LIMITER)return json({error:'Service configuration is incomplete. Please contact '+email+'.'},503);
 const key=request.headers.get('CF-Connecting-IP')||'unknown';const result=await env.API_LIMITER.limit({key:url.pathname+':'+key});if(!result.success)return json({error:'Too many requests. Please wait a minute.'},429);
 let data;try{const text=await readBody(request);const type=request.headers.get('content-type')||'';if(type.includes('application/json'))data=JSON.parse(text);else if(url.pathname==='/api/contact'&&type.includes('application/x-www-form-urlencoded'))data=Object.fromEntries(new URLSearchParams(text));else return json({error:'Unsupported request format.'},415);}catch{return json({error:'Invalid or oversized request.'},400);}
 if(!data||typeof data!=='object'||Array.isArray(data))return json({error:'Invalid request.'},400);
 if(url.pathname==='/api/contact'){
  if(data.website)return json({error:'Unable to prepare this request.'},400);
  const fields=['name','email','subject','message'];if(fields.some(k=>typeof data[k]!=='string'||!data[k].trim()))return json({error:'Complete all contact fields.'},400);
  if(data.name.length>120||data.email.length>254||data.subject.length>160||data.message.length>4000||/[\r\n]/.test(data.email+data.subject)||!/^\S+@\S+\.\S+$/.test(data.email))return json({error:'Check the contact fields and their lengths.'},400);
  const body=`Name: ${data.name}\nReply email: ${data.email}\n\n${data.message}`;const mailto=`mailto:${email}?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(body)}`;
  if(!(request.headers.get('content-type')||'').includes('application/json'))return new Response(`<!doctype html><html lang="en"><meta charset="utf-8"><title>Email draft</title><p>Your message has not been sent.</p><p><a href="${mailto.replaceAll('&','&amp;')}">Open your email draft</a></p><p><a href="/contact/">Back to Contact us</a></p></html>`,{headers:{'Content-Type':'text/html;charset=utf-8','Cache-Control':'no-store','Content-Security-Policy':"default-src 'none'; base-uri 'none'"}});
  return json({mailto,delivered:false});
 }
 if(!validMessages(data.messages))return json({error:'Use up to nine short user or assistant messages.'},400);
 if(!env.LOCAL_CHAT_URL||!env.LOCAL_CHAT_TOKEN)return json({error:'The local assistant is not connected yet. Please contact '+email+'.'},503);
 let target;try{target=new URL(env.LOCAL_CHAT_URL);if(target.protocol!=='https:'||target.username||target.password)throw new Error();}catch{return json({error:'The assistant connection is not configured correctly.'},503);}
 try{
  const upstream=await fetcher(target,{method:'POST',redirect:'error',headers:{'Content-Type':'application/json','Authorization':'Bearer '+env.LOCAL_CHAT_TOKEN,...(env.ACCESS_CLIENT_ID&&env.ACCESS_CLIENT_SECRET?{'CF-Access-Client-Id':env.ACCESS_CLIENT_ID,'CF-Access-Client-Secret':env.ACCESS_CLIENT_SECRET}:{})},body:JSON.stringify({messages:data.messages}),signal:AbortSignal.timeout(125000)});
  if(!upstream.ok)return json({error:'The local assistant is busy or offline. Please try again later.'},upstream.status===429?429:503);
  const answer=await upstream.json();if(typeof answer.answer!=='string'||!answer.answer.trim()||answer.answer.length>12000)throw new Error();return json({answer:answer.answer});
 }catch{return json({error:'The local assistant is unavailable. Please try again later.'},503);}
}
export default {fetch(request,env){return handle(request,env);}};
