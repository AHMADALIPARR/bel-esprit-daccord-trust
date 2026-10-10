# Bel Esprit d’Accord Trust

A responsive static website for the trust's research, projects, and contact information.
Only `public/` is deployed. Commercial application source, model weights, credentials, and local databases are excluded.

## Cloudflare Pages + GitHub

1. In Cloudflare, open Workers & Pages and create a Pages project using Git integration.
2. Connect `AHMADALIPARR/bel-esprit-daccord-trust`, production branch `main`.
3. Framework: None. Build command: leave empty. Output directory: `public`.
4. Deploy and verify the Pages URL.
5. Add the confirmed domain in Pages → Custom domains. Let Cloudflare configure DNS after checking for existing records.

Git pushes to `main` trigger production deployments after this integration is connected. Do not replace existing apex DNS without selecting that domain deliberately.

Official guides:
- https://developers.cloudflare.com/pages/configuration/git-integration/
- https://developers.cloudflare.com/pages/configuration/custom-domains/

## Local preview

From this repository: `python -m http.server 8080 --directory public`
Then visit http://localhost:8080.

## Content and rights

The website does not assert charity registration, tax deductibility, or production certification. Linked work is described within its stated scope. Original website content is all rights reserved; linked projects retain their respective licenses.
