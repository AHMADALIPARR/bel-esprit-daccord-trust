# Bel Esprit d’Accord Trust

Plain HTML and CSS website, a Cloudflare Worker for API routes, and a separate local-model bridge. Owner: Ahmad Ali Parr · حمد علي بار. Contact: A.parr@belespritdaccord.uk.

## Pages

- `/`: factual introduction, portfolio counts, ORTHO32, and featured preprint.
- `/portfolio/`: one project table with status, license, and source links.
- `/projects/<slug>/`: problem, approach, verification limits, license, and contact.
- `/company/`: ownership, supplied photograph, licensing, and security.
- `/contact/`: contact form routed through `/api/contact`.
- `/privacy/`: website, contact, and chat processing details.

`content/projects.json` and `content/knowledge.json` are generated from the reviewed summaries in `scripts/build.py`. Review descriptions and license terms before changing them. The holdings repository review was performed on 10 October 2026; it was not a compiler or hardware audit.

## Commands

```text
npm ci
npm run build
npm test
npm run dev
npm run deploy
```

`wrangler.json` targets the existing `bel-esprit-daccord-trust` Worker in account `7ffe914771ff2f13c35b86f9645b8b42`. Static assets are `public/`; `/api/*` executes Worker code first. GitHub integration must deploy with Wrangler for these APIs. A static-only Pages deployment will serve the pages but not these Worker endpoints.

Do not change the domain's iCloud MX, DKIM, SPF, or Apple verification records. This deployment is separate from collectivekitty.com and SnapKitty infrastructure.

## Contact

`POST /api/contact` validates fields and prepares a mailto draft addressed to A.parr@belespritdaccord.uk. It returns `delivered: false`. The visitor reviews and sends it in their own mail client. Direct inbox submission is not configured; it requires an authorized mail delivery service. There is no contact database.

## Local-model chat

`POST /api/chat` forwards only bounded conversation messages to a configured HTTPS local bridge; arbitrary visitor targets and system messages are rejected. No paid cloud inference provider is configured. The Worker must have its rate-limit binding; it fails closed if that binding is absent.

The bridge uses an OpenAI-compatible local LM Studio endpoint with a Nemotron or DAVID model identifier. If DAVID uses another API contract, it requires an adapter; do not pretend that its endpoint is OpenAI-compatible without testing it.

1. Set a random private `LOCAL_CHAT_TOKEN` (at least 32 characters) in ignored `.local/chat.env`.
2. Set `LOCAL_MODEL_ID` to the installed local Nemotron or DAVID identifier. Ensure the model server is running.
3. Run `docker compose up -d --build`, or use `npm run bridge` with those environment variables for a native local bridge.
4. The container exposes only loopback port 8788. LM Studio must be reachable from the container at `host.docker.internal:1234`; configure its bind/firewall deliberately. The native bridge uses `127.0.0.1:1234`.
5. Connect only the bridge through a named Cloudflare Tunnel. Do not expose LM Studio, the supervisor, desktop tools, or general DAVID administrative routes.
6. Add an Access service-token policy for the tunnel hostname where available. Put `LOCAL_CHAT_URL`, `LOCAL_CHAT_TOKEN`, and optional `ACCESS_CLIENT_ID` / `ACCESS_CLIENT_SECRET` in Worker secrets. Never put secrets in GitHub source or browser JavaScript.
7. Verify `/api/health` and an actual `/api/chat` request on the production domain.

Without a connected bridge, chat returns an explicit 503 message. It does not substitute fabricated responses or a paid provider. A rate limit is approximate per Cloudflare location; the bridge also admits one inference request at a time. No conversation persistence is implemented.

## Validation

Worker tests cover correct contact address, no false delivery claims, cross-origin rejection, message-role restrictions, request size limits, rate-limit behavior, upstream secret isolation, sanitized errors, and asset dispatch. Internal HTML files and fragments are checked before release. Browser visual QA and Docker execution require their corresponding installed tools.

## Design and rights

The information hierarchy draws on the supplied Zurich Instruments reference. Its product images, brand, copy, specifications, and trade dress are not reproduced. The supplied company photograph is preserved as uploaded.

Original website materials are proprietary and publicly visible; linked repositories keep their own terms. `LICENSE` does not relicense any holdings project.
