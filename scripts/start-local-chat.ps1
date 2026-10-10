# Copyright 2026 Ahmad Ali Parr. All rights reserved.
$ErrorActionPreference='Stop'
$siteRoot=(Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$chatEnv=Join-Path $siteRoot '.local/chat.env'
$tunnelToken=Join-Path $siteRoot '.local/tunnel-token'
$connector=Join-Path $siteRoot '.local/tools/cloudflared.exe'
if(!(Test-Path -LiteralPath $chatEnv) -or !(Test-Path -LiteralPath $tunnelToken) -or !(Test-Path -LiteralPath $connector)){throw 'Configure the local bridge secrets and tunnel connector first.'}
foreach($line in Get-Content -LiteralPath $chatEnv){$pair=$line -split '=',2;if($pair.Length -eq 2){[Environment]::SetEnvironmentVariable($pair[0],$pair[1],'Process')}}
$bridge=Start-Process -FilePath (Get-Command node).Source -ArgumentList 'bridge/server.mjs' -WorkingDirectory $siteRoot -WindowStyle Hidden -RedirectStandardOutput (Join-Path $siteRoot '.local/bridge.log') -RedirectStandardError (Join-Path $siteRoot '.local/bridge-error.log') -PassThru
[Environment]::SetEnvironmentVariable('LOCAL_CHAT_TOKEN',$null,'Process')
$tunnel=Start-Process -FilePath $connector -ArgumentList @('--no-autoupdate','tunnel','run','--token-file',$tunnelToken) -WorkingDirectory $siteRoot -WindowStyle Hidden -RedirectStandardOutput (Join-Path $siteRoot '.local/tunnel.log') -RedirectStandardError (Join-Path $siteRoot '.local/tunnel-error.log') -PassThru
@{bridgePid=$bridge.Id;tunnelPid=$tunnel.Id} | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $siteRoot '.local/runtime.json')
Write-Output 'Local bridge and named tunnel started. Keep LM Studio and trust-nemotron running.'
