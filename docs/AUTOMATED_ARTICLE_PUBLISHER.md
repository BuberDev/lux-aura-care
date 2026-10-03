# Lux Aura Care automated journal publisher

The Lux Aura Care journal uses the same two-stage local publishing flow as IT Finance, adapted for evidence-led skincare, beauty, body care, healthy aging, and wellbeing content.

## What runs

- A macOS LaunchAgent checks four times each day for an unpublished Monday, Wednesday, or Friday editorial slot.
- The TypeScript content engine researches current sources, rejects unreachable or repeated sources, selects a non-duplicate topic, writes and critiques the article, and runs deterministic quality checks.
- Every article must include 4–6 contextual links to at least three different live Lux Aura Care products.
- Codex Imagegen creates one cover and 2–3 inline editorial visuals. All visuals must pass the local review threshold before publication.
- The authenticated `/api/cron/weekly-article` endpoint validates the payload, stores images in Vercel Blob, and saves the article and idempotent run record in Postgres.
- Published database articles are merged with the existing static journal on the blog index, article route, metadata, structured data, and sitemap.

## Editorial safety

The writer is instructed to distinguish cosmetic or wellness guidance from medical advice, avoid diagnosis and treatment claims, use cautious language for evidence strength, and recommend professional care for red-flag symptoms. The full rules live in `content-engine/prompts/style-guide.md`.

The live product-link catalog lives in `content-engine/config/services.ts`. Update it whenever a store product is added, renamed, or removed.

## Required configuration

The Vercel project needs `CRON_SECRET`, `DATABASE_URL`, and `ARTICLE_BLOB_READ_WRITE_TOKEN`. The article token must belong to a public Blob store because published covers and figures are rendered directly on public article pages; it intentionally remains separate from a connected private `BLOB_READ_WRITE_TOKEN`. The local runtime also needs `DEEPSEEK_API_KEY` and `OPENROUTER_API_KEY`; Telegram variables are optional.

Pull the endpoint secret to the dedicated ignored file:

```bash
npx vercel@latest env pull .env.publisher --environment=development --yes
```

## Verification and installation

```bash
npm run lint
npm run build
npm run content:test
npm run content:typecheck
npm run publisher:install
```

Install the LaunchAgent only after the application containing the publishing endpoint has reached production. The installer copies a minimal runtime outside Desktop, installs locked dependencies, and enables `com.luxauracare.article-publisher`.

Runtime logs:

```text
~/Library/Logs/LuxAuraCarePublisher.log
~/Library/Logs/LuxAuraCarePublisher.error.log
```
