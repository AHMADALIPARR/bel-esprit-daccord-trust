# Website security

Report issues to A.parr@belespritdaccord.uk. Do not include credentials or private records in public issues.

The Cloudflare Worker rejects other origins, validates request size and message roles, requires a rate-limit binding, and only forwards chat to its configured HTTPS gateway. No paid model API, shell tools, file upload, or administrative action is exposed. Origin checks are not user authentication; public chat is intentionally anonymous and rate-limited.

The bridge requires a private bearer token and accepts a single inference at a time. Its model endpoint is restricted to localhost or the Docker host. Deployment requires a private tunnel and preferably a Cloudflare Access service token. Do not expose the general local model API or DAVID control plane.

The assistant's factual scope is enforced through a reviewed knowledge file and prompt, not a formal guarantee against hallucinations. Check source documentation before relying on a response. HTML output uses textContent for chat responses.

The contact API prepares a draft and does not claim email delivery. No database or message persistence is included. Default Worker observability is disabled; upstream infrastructure may still process technical logs.
