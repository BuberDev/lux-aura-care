# ✅ Affiliate System Implementation Checklist

**Estimated Time**: 2-4 hours | **Difficulty**: Medium | **Revenue Impact**: 2.4x-5x

---

## 🔴 CRITICAL - Do This First (30 min)

### Email Provider Setup

- [ ] **Choose email provider:**
  - [ ] Resend (recommended: easiest)
  - [ ] Mailchimp (free tier)
  - [ ] ConvertKit (best for automation)

- [ ] **Create account and get API key**
  - Resend: https://resend.com → Dashboard → API Keys
  - Mailchimp: Account → Integrations → API Keys
  - ConvertKit: https://convertkit.com/account/access_tokens

- [ ] **Create audience/list**
  - Resend: Dashboard → Audiences → Create
  - Mailchimp: Lists → Create List
  - ConvertKit: Forms → Create form (optional)

- [ ] **Add to `.env.local`:**
  ```
  EMAIL_PROVIDER=resend
  EMAIL_API_KEY=your-key-here
  EMAIL_AUDIENCE_ID=your-id-here
  ```

- [ ] **Test it works:**
  ```bash
  npm run dev
  # Go to http://localhost:3000
  # Scroll to newsletter section
  # Enter test email
  # Should see success message
  ```

---

## 🟠 HIGH PRIORITY - Next (1-2 hours)

### GA4 Setup

- [ ] **Verify GA4 property exists**
  - Go to Google Analytics
  - Select property: "Lux Aura Care"
  - Note your GA ID (G_XXXXXXXXXX)

- [ ] **Add GA ID to `.env.local`:**
  ```
  NEXT_PUBLIC_GA_ID=G_XXXXXXXXXX
  ```

- [ ] **Verify tracking works:**
  - Deploy with `npm run build && npm start`
  - Open browser DevTools → Network
  - Click any "Check on Amazon" button
  - Should see GA4 event fire
  - Check GA4 Real-Time dashboard

- [ ] **Create GA4 custom events dashboard:**
  - GA4 → Dashboards → Create new
  - Add cards for:
    - `affiliate_click` count by placement
    - `affiliate_click` count by product
    - Click-through rate trend

---

## 🟡 MEDIUM PRIORITY - Optimize (1-2 hours)

### Email Automation Setup

- [ ] **Create welcome email template**
  - Subject: "Your 15% off code is inside"
  - Include: 15% discount code + bundle recommendation
  - Brand: Match your aesthetic

- [ ] **Set up automation rules in email provider:**

  **In Mailchimp:**
  - Create Automation → Welcome Series
  - Email 1 (Immediate): Welcome + discount code
  - Email 2 (Day 2): Product recommendation
  - Email 3 (Day 7): Abandoned routine recovery

  **In Resend:**
  - Use API to trigger emails (more manual)
  - Or use Zapier/Make for automation

  **In ConvertKit:**
  - Sequences → Create new sequence
  - Add 3-5 emails over 2 weeks

- [ ] **Test email delivery:**
  - Subscribe with test email
  - Receive welcome email within 5 min
  - Verify links work and track properly

---

## 🟢 ENHANCEMENT - Nice to Have (Optional)

### A/B Testing Setup

- [ ] **Choose first test to run**
  - [ ] CTA Button Text (recommended first)
  - [ ] Bundle Positioning
  - [ ] Product Card Layout

- [ ] **Update `lib/ab-testing.ts`:**
  ```typescript
  myTest: {
    id: "my-test-v1",
    variants: {
      control: "Option A",
      test: "Option B",
    },
    salt: "my-test",
    trafficAllocation: 50,
  }
  ```

- [ ] **Run test for 2 weeks minimum:**
  - Get 500+ exposures per variant
  - Monitor GA4 → Custom Events → ab_test_conversion
  - Compare conversion rates
  - Declare winner when 15%+ difference

- [ ] **Implement winning variant:**
  - Update code with winner
  - Remove old variant
  - Deploy

---

## 📊 MONITORING - Setup Dashboard

- [ ] **GA4 Dashboard for Daily Monitoring**

  Create custom report with:
  - Affiliate clicks by placement
  - Affiliate clicks by product
  - CTR trend (daily)
  - Revenue attribution
  - Email subscribers count
  - A/B test performance

- [ ] **Setup GA4 Alerts**
  - Alert if affiliate CTR drops below 20%
  - Alert if email provider fails 5 times
  - Alert if revenue drops 30% day-over-day

---

## 🚀 DEPLOYMENT - Go Live

### Pre-Launch

- [ ] **Code review:**
  ```bash
  git log --oneline | head -5
  # Verify last commit is the affiliate system
  ```

- [ ] **Test all flows locally:**
  - [ ] Newsletter signup works
  - [ ] Affiliate links work (bundle + product)
  - [ ] GA4 events firing
  - [ ] Dynamic CTAs showing
  - [ ] Responsive on mobile

- [ ] **Environment variables set:**
  ```bash
  # On your hosting provider:
  EMAIL_PROVIDER=resend
  EMAIL_API_KEY=xxxxx
  EMAIL_AUDIENCE_ID=xxxxx
  NEXT_PUBLIC_GA_ID=G_xxxxx
  AMAZON_ASSOCIATE_TAG=xxxxx
  ```

### Launch

- [ ] **Deploy to production:**
  ```bash
  git push origin main
  # Verify build succeeds on Vercel/Railway
  ```

- [ ] **Verify in production:**
  - [ ] Newsletter form works
  - [ ] Affiliate links route correctly
  - [ ] GA4 receiving events
  - [ ] Email confirmations sending
  - [ ] Homepage loads fast

- [ ] **Announce changes** (optional):
  - Email list: "New: Exclusive subscriber benefits!"
  - Pinterest: Update pins with "Newsletter exclusive discount"
  - Blog: Add CTA for newsletter signup

---

## 📈 FIRST WEEK METRICS

Track these daily:

| Metric | Goal | Current | Week 1 |
|--------|------|---------|---------|
| Daily Newsletter Signups | 10+ | TBD | ___ |
| Affiliate CTR | 24%+ | 24% | ___ |
| Email List Size | 100+ | 0 | ___ |
| GA4 Events/Day | 100+ | 0 | ___ |
| Bundle Revenue | $200+ | $0 | ___ |
| Website Speed (LCP) | <2.5s | TBD | ___ |

---

## ⚠️ TROUBLESHOOTING

### Newsletter isn't sending

```bash
# 1. Check API key
echo $EMAIL_API_KEY

# 2. Check logs
npm run dev
# Watch browser console when submitting form

# 3. Check email provider
# Resend: Dashboard → Recent emails
# Mailchimp: Campaigns → view recent
# ConvertKit: Broadcasts

# 4. Test manually
curl -X POST http://localhost:3000/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### Affiliate links showing 404

```bash
# 1. Verify product exists
# Check lib/site-data.ts for product ID

# 2. Test redirect
curl -L http://localhost:3000/go/silk-sleep-mask
# Should redirect to Amazon URL

# 3. Check Amazon affiliate tag
echo $AMAZON_ASSOCIATE_TAG
```

### GA4 not tracking

```bash
# 1. Check GA4 ID in .env.local
grep NEXT_PUBLIC_GA_ID .env.local

# 2. Check head scripts
# Verify gtag is loaded in layout.tsx

# 3. Check browser console
# window.gtag should be defined
```

---

## 🎯 Success Criteria

✅ **Launch is successful when:**
1. Newsletter form accepts emails (visual confirmation)
2. GA4 dashboard shows 10+ affiliate_click events
3. First 10 email subscribers confirmed in provider
4. All product affiliate links work
5. Homepage loads without errors

✅ **First week wins:**
1. 50+ newsletter subscribers
2. 100+ affiliate clicks tracked
3. 5+ emails successfully sent
4. CTR stays at 24%+
5. Zero downtime/errors

---

## 📞 Questions?

Check these files:
- `AFFILIATE_REVENUE_SYSTEM.md` – Full strategy & setup
- `lib/email-service.ts` – Email provider code
- `lib/ga4-tracking.ts` – Tracking event types
- `app/api/subscribe/route.ts` – Newsletter API

---

**Status**: ✅ Ready to implement  
**Deployment Date**: [YOUR DATE]  
**Expected Live Revenue**: 2x baseline within 30 days
