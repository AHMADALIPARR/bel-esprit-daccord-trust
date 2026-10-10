# Bel Esprit d’Accord Trust

A responsive static website for the trust's research, projects, and contact information.
Only `public/` is deployed. Commercial application source, model weights, credentials, and local databases are excluded.

## Cloudflare Pages + GitHub

1. In Cloudflare, open Workers & Pages and create a Pages project using Git integration.
2. Connect `AHMADALIPARR/bel-esprit-daccord-trust`, production branch `main`.
3. Framework: None. Build command: leave empty. Output directory: `public`.
4. Deploy and verify the Pages URL.
5. Add `belespritdaccord.uk` in Pages → Custom domains. Let Cloudflare configure DNS after checking for existing records. Optionally add `www.belespritdaccord.uk` and redirect it to the apex.

Git pushes to `main` trigger production deployments after this integration is connected. This site uses its own domain and Pages project, separate from SnapKitty infrastructure. Do not modify collectivekitty.com or its Cloudflare resources.

Official guides:
- https://developers.cloudflare.com/pages/configuration/git-integration/
- https://developers.cloudflare.com/pages/configuration/custom-domains/

## Local preview

From this repository: `python -m http.server 8080 --directory public`
Then visit http://localhost:8080.

## Content and rights

The website does not assert charity registration, tax deductibility, or production certification. Linked work is described within its stated scope. Original website content is all rights reserved; linked projects retain their respective licenses.

## Brand assets

- `public/brand/linkedin-cover.png`: generated cover artwork; use LinkedIn’s crop preview when uploading.
- `public/brand/logo-transparent.png`: square logo with transparency.
- `BRAND-PROMPTS.md`: generation prompts and design intent.

Domain configuration is prepared; DNS activation must be verified in Cloudflare.

## Principal intellectual property project

ORTHO32 is the trust’s principal intellectual property project, as designated by the owner. The homepage prominently links its public architecture site and trust-holdings repository. Summaries describe the published project materials; this website update does not independently certify hardware or relicense ORTHO32.

https://bel-esprit-d-accord-trust-holdings.github.io/ORTHO32/
