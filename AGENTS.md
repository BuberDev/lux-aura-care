<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:lux-aura-care-quality-standard -->
# Lux Aura Care quality standard

This is a premium ecommerce store. Treat every product page as a high-trust,
high-conversion shopping experience, not as a content mockup.

- Interactive affordances must do exactly what they suggest. If an element shows
  a play icon, it must play video directly or open an obvious video player.
- Avoid placeholder-like labels such as numbered "video 01" captions in customer
  facing UI. Use polished, benefit-led labels that explain what the shopper will
  see or learn.
- Product media must help the shopper evaluate the product: real use, scale,
  finish, what is included, and how the product fits into skincare.
- Polish locale copy must sound natural for a Polish beauty customer. Use
  concrete language such as "masaz twarzy", "pielegnacja", "roller", "gua sha",
  and "serum/olejek"; use "rytual" sparingly.
- Preserve a premium visual hierarchy: no decorative filler, no fake buttons,
  no amateur labels, no UI that looks clickable but is not.
- Owner-managed exception: do not change product ratings, review counts, review
  content, or the customer-avatar/rating component. The owner maintains these.
- Shipping is a customer offer, separate from supplier fulfillment costs.
  Preserve the free-standard-delivery component in the product hero. Shopify
  audit on 2026-10-03: general profile, Poland standard 0 PLN with no minimum,
  Poland express 65 PLN, International 71 PLN. The owner's intended worldwide
  free-standard policy differs from the current International rate; approval
  to change that rate is pending. Until changed, qualify free delivery as "to
  Poland" in both locales. Never infer a destination from interface language.
  Include supplier shipping in product pricing so the PLN 80 floor remains
  after that cost; never promise 24–48 h dispatch or express transit without
  verifying the supplier's actual service. Do not remove a confirmed offer
  because the merchant pays the delivery cost.
- Pricing floor for non-affiliate products: at least PLN 80 above the verified
  supplier product and delivery cost for the selected variant. This is an
  absolute amount, not an 80% margin. Do not lower an already higher price.
  Verify destination, currency and pack quantity before applying the floor;
  do not claim the floor is enforced for a product with unverified costs.
  For expensive AliExpress shipping, the owner requests doubling that minimum
  contribution to PLN 160 after product and shipping costs. Use the actual
  supplier quote, never Shopify's customer-facing delivery rate, to assess
  that case. The owner has not specified a numeric high-shipping threshold;
  do not invent an automatic cutoff. Never reduce a higher existing margin.
- Fulfillment exception confirmed by the owner: the branded "Lux Aura Face
  Roller & Gua Sha Set" (`lux-aura-face-roller-gua-sha-set`, Shopify product
  `15816997568860`, both black-stone and rose-quartz variants) is owned stock,
  purchased in China and shipped personally by the owner from home. Keep its
  Shopify checkout, but do not assign a DSers/AliExpress supplier, enable
  DSers fulfillment, or apply supplier-based pricing automation to it. Do not
  describe its delivery as dropshipping. Verify actual stock, dispatch times
  and the owner's costs instead of inventing them. A listing in DSers without
  a supplier mapping is not evidence that DSers fulfills this product.
- Other products outside the Amazon affiliate collection are sold through Shopify
  with DSers fulfillment from AliExpress suppliers. Treat configured shop
  products and requested supplier variants as available; never show
  "coming soon" merely because Shopify currently exposes a single base
  variant. Keep the storefront choice actionable and map it to the available
  DSers-backed checkout flow.
<!-- END:lux-aura-care-quality-standard -->

<!-- BEGIN:model-orchestration -->
# Coding orchestration requested by the owner

- Act as architect/orchestrator for software tasks; use the lowest sufficient
  implementation lane: Luna low (small), Luna medium (medium), Luna high (high),
  then Sol high only when evidence justifies escalation.
- Jev is only a bounded decision aid for routing, retries, escalation,
  continuation and completion; never use it to write code or design architecture.
- Use `TYPESAFE_API_KEY` only for authenticated TypeSafe requests. Never store
  its value in this repository, print it, or include it in telemetry/prompts.
- After each implementation cycle inspect the diff and run applicable tests,
  type checking, lint and build. Ask Jev only about remaining judgment, not
  facts those tools can determine. Report any unavailable or failed check.
- Do not declare completion while required behavior or verification is missing.
- Persist until the agreed outcome is implemented and verified. A status or
  cost question is not cancellation: answer it, then resume the pending work.
  Do not stop at a plan or partial report while safe, authorized work remains.
  Stop only for an explicit user stop/pause, a required approval, or a genuine
  blocker that cannot be resolved with available safe checks; state the exact
  missing input and preserve a resumable record. Do not expand authority or
  claim unverified completion in the name of persistence.
- Prefer one bounded implementation worker at a time; classify with Jev before
  delegation, and avoid repeated broad file, tool-schema, or page dumps.
<!-- END:model-orchestration -->

<!-- BEGIN:store-handoff -->
# Store implementation handoff

Before store implementation or deployment, read `docs/store-operations-handoff.md`.
It records verified production versus local-only work, unfinished tasks, evidence
locations and mistakes to avoid. Load detailed audits only for the task in scope;
do not repeat completed catalog-wide discovery. Treat dated prices, supplier costs
and availability as historical evidence, not as live values. Update the handoff
after material verified changes, without credentials or verbose tool transcripts.
<!-- END:store-handoff -->
