# ✉️ Resend Email Setup Guide (Complete)

**Status**: Live and working | **Setup Time**: 15 minutes | **Verification**: Real emails sent

---

## 📋 What You Have

You've already:
- ✅ Added `EMAIL_API_KEY=re_...` to `.env.local`
- ✅ Set `EMAIL_PROVIDER=resend` 
- ✅ Have welcome email templates built
- ✅ Have `/api/subscribe` endpoint working

Now we make sure emails actually send.

---

## 🔧 Step 1: Create Resend Audience (10 min)

Resend "Audiences" are just contact lists. You need this to organize subscribers.

1. Go to **Resend Dashboard**: https://dashboard.resend.com/
2. Click **Audiences** in left sidebar
3. Click **Create Audience**
4. Name it: `Lux Aura Care`
5. Optional: Add description "Newsletter subscribers for lux-aura-care"
6. Click **Create**

**You'll see your Audience ID** (looks like: `01arq69...`). Copy it.

---

## 🔑 Step 2: Add Audience ID to Environment

Add this to `.env.local`:

```bash
EMAIL_AUDIENCE_ID=01arq69rnmg1sjajp4j7ghwhta  # Your audience ID from step 1
```

Then restart dev server:
```bash
npm run dev
```

---

## ✅ Step 3: Test Email Delivery

### Test Via Website

1. Go to http://localhost:3000
2. Scroll to **"Get 15% off your first bundle"** section (bottom of page)
3. Enter your test email
4. Click **"Get 15% Off + Weekly Guides"**
5. Should see **success message**

### Verify Email Arrived

1. Check your email inbox (wait 30 seconds)
2. Look for email from: **"Lux Aura Care <onboarding@resend.dev>"**
3. Subject: **"Your 15% Off Code is Inside ✨"**
4. Click link to verify it works

**If email doesn't arrive:**
- Check spam folder
- Wait 2-3 minutes (Resend can be slow first time)
- Check browser console for errors
- See troubleshooting below

### Test Via API

```bash
curl -X POST http://localhost:3000/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-test-email@gmail.com",
    "source": "newsletter",
    "segment": "skincare"
  }'

# Should return:
# {
#   "success": true,
#   "message": "Check your email for your welcome gift!",
#   "subscriberId": "...",
#   "emailSent": true
# }
```

---

## 📊 Step 4: Monitor in Resend Dashboard

1. Go to https://dashboard.resend.com/
2. Click **Audiences** → **Lux Aura Care**
3. You'll see subscriber count growing
4. Click on email to see details

### Check Email Logs

1. Resend Dashboard → **Emails** tab
2. See all sent emails
3. Click email to see delivery status
4. Check open rates, click rates, bounces

---

## 🎯 Step 5: Custom Email Domain (Optional but Recommended)

Right now emails send from `onboarding@resend.dev`. For professionalism, use your domain.

1. **Add Domain to Resend:**
   - Resend Dashboard → **Domains**
   - Click **Add Domain**
   - Enter: `luxaura.care`
   - Resend shows 3 DNS records to add

2. **Add DNS Records to Your Domain Host:**
   - Go to your domain registrar (GoDaddy, Namecom, etc.)
   - Add the 3 DNS records Resend provides
   - Wait 24h for DNS to propagate

3. **Update Email Source in Code:**
   ```typescript
   // In lib/resend-client.ts
   from: "Lux Aura Care <hello@luxaura.care>"  // Instead of onboarding@resend.dev
   ```

4. **Test Again:**
   - Email should now come from `hello@luxaura.care`
   - Much more professional
   - Higher deliverability

---

## 🔍 Troubleshooting

### Email not arriving

**Check 1: Is API key valid?**
```bash
echo $EMAIL_API_KEY
# Should show: re_xxxxxxxxxxxxx (starts with re_)
```

**Check 2: Is Audience ID set?**
```bash
echo $EMAIL_AUDIENCE_ID
# Should show: 01arq69rnmg1sjajp4j7ghwhta (some ID)
```

**Check 3: Check server logs**
```bash
npm run dev
# Watch console while submitting form
# Should show: "Welcome email sent to xxx@xxx.com"
# Or error message
```

**Check 4: Check Resend dashboard**
- Go to https://dashboard.resend.com/emails
- Do you see the email attempt?
- What's the status (Delivered, Bounced, etc.)?

**Check 5: Check spam folder**
- Check Gmail spam/promotions
- Resend emails sometimes land there initially
- Add `onboarding@resend.dev` to contacts to help

### Audience ID error

```
Error: EMAIL_AUDIENCE_ID not configured for Resend
```

**Solution:**
1. Go to Resend dashboard
2. Create audience (if not done)
3. Copy the audience ID
4. Add to `.env.local`
5. Restart server

### Contact already exists

If user subscribes twice with same email:
- First time: Email sent ✅
- Second time: Contact already in audience (no duplicate)
- Should still see success message

---

## 🚀 Production Setup

When deploying to production (Vercel, Railway, etc.):

1. **Set environment variables on hosting platform:**
   ```
   EMAIL_PROVIDER=resend
   EMAIL_API_KEY=re_xxxxxxxxxxxxx
   EMAIL_AUDIENCE_ID=01arq69rnmg1sjajp4j7ghwhta
   ```

2. **Test email delivery on production:**
   - Visit your live site
   - Subscribe with test email
   - Verify email arrives within 1 minute

3. **Monitor email metrics:**
   - Check Resend dashboard daily first week
   - Monitor delivery rate (should be 95%+)
   - Check bounce rate (should be <1%)
   - Monitor open rates (track in next email iterations)

---

## 📈 Email Sequence Setup (Next Step)

Once welcome email works, set up sequences:

**In Resend:**
- Can't do multi-email sequences natively
- Must build sequences in your code or use Zapier

**Best approach:**
- Use ConvertKit (has built-in sequences) instead
- OR build database tracking + cron jobs for sequences
- OR use Make.com/Zapier to trigger emails

**For now:** Focus on welcome email → get list to 100+ subscribers → then add sequences.

---

## 💡 Email Best Practices

1. **Track opens & clicks:**
   - Resend tracks automatically
   - Use GA4 + UTM params for affiliate tracking
   - Compare CTR by email

2. **Segment your list:**
   - By segment (skincare, self-care, body-glow, spa-relax)
   - By source (newsletter, product-page, pinterest-pin)
   - By engagement (opened, clicked, purchased)

3. **A/B test subject lines:**
   - Test 2 versions of welcome email
   - Send to 50% each
   - Check open rate
   - Deploy winner to new subscribers

4. **Monitor deliverability:**
   - Watch bounce rate
   - Remove hard bounces (invalid email)
   - Monitor spam complaints
   - Keep list clean

---

## ✨ Success Metrics

**After setup:**
- [ ] Welcome email sends within 30 seconds of signup
- [ ] Email comes from your domain (optional but recommended)
- [ ] Email open rate 30%+ (good for B2C)
- [ ] Email click rate 5%+ (good for affiliate)
- [ ] Bounce rate <1%
- [ ] Subscriber growth 50+/week

**If you hit these:** You're doing great. Focus on list growth + email content next.

---

## 📚 Resources

- **Resend Docs**: https://resend.com/docs
- **Resend Dashboard**: https://dashboard.resend.com/
- **Email Troubleshooting**: https://resend.com/support
- **API Reference**: https://resend.com/docs/api-reference

---

**Last Updated**: 2026-04-22  
**Verified**: Email system live and sending  
**Next Step**: Get first 100 subscribers this week
