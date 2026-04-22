import { Resend } from "resend";

const resend = new Resend(process.env.EMAIL_API_KEY);

export { resend };

export async function sendWelcomeEmail(email: string) {
  try {
    console.log(`[RESEND] Sending welcome email to: ${email}`);

    const result = await resend.emails.send({
      from: "Lux Aura Care <hello@luxauracare.com>",
      to: email,
      subject: "Welcome to Lux Aura Care - Weekly Ritual Guides",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1a1a1a;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 600;">Welcome to Lux Aura Care</h1>
            <p style="margin: 8px 0 0 0; color: #666; font-size: 14px;">Professional Ritual Guides for a Polished Life</p>
          </div>

          <div style="background: #f9f9f9; border-left: 4px solid #d4af37; padding: 20px; margin-bottom: 24px;">
            <h2 style="margin: 0 0 8px 0; font-size: 18px; color: #1a1a1a;">You're Part of an Exclusive Community</h2>
            <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.6;">
              Join 500+ subscribers who receive carefully curated ritual guides and product recommendations every Friday morning.
            </p>
          </div>

          <div style="background: #ffffff; border: 1px solid #e5e5e5; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <h3 style="margin: 0 0 12px 0; font-size: 14px; color: #1a1a1a; font-weight: 600;">What You'll Receive:</h3>
            <ul style="margin: 0; padding-left: 20px; color: #666; font-size: 13px; line-height: 1.8;">
              <li>Weekly ritual guides (Friday mornings only)</li>
              <li>Curated product recommendations for your interests</li>
              <li>Exclusive access to bundle deals</li>
              <li>Early announcements of new products</li>
              <li>Helpful tips from our editorial team</li>
            </ul>
          </div>

          <div style="text-align: center; margin-bottom: 24px;">
            <a href="https://www.luxauracare.com/favorites" style="display: inline-block; background: #d4af37; color: #000; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-weight: 600; font-size: 14px;">
              Explore Our Collections
            </a>
          </div>

          <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;">

          <div style="color: #666; font-size: 12px; line-height: 1.6;">
            <p style="margin: 0;">We send emails Friday mornings (Polish time).</p>
            <p style="margin: 8px 0 0 0;">You can unsubscribe anytime by clicking the link at the bottom of any email.</p>
            <p style="margin: 12px 0 0 0; color: #999;">
              © 2026 Lux Aura Care | www.luxauracare.com
            </p>
          </div>
        </div>
      `,
      text: `Welcome to Lux Aura Care

You're now part of an exclusive community of 500+ subscribers who receive carefully curated ritual guides and product recommendations every Friday morning.

What You'll Receive:
- Weekly ritual guides (Friday mornings only)
- Curated product recommendations
- Exclusive access to bundle deals
- Early announcements of new products
- Helpful tips from our editorial team

Explore our collections: https://www.luxauracare.com/favorites

We send emails Friday mornings (Polish time). You can unsubscribe anytime.

© 2026 Lux Aura Care
www.luxauracare.com`,
      headers: {
        "List-Unsubscribe": `<mailto:unsubscribe@luxauracare.com?subject=unsubscribe>`,
      },
    });

    console.log(`[RESEND] Email sent successfully:`, result);
    return result;
  } catch (error) {
    console.error("[RESEND] Failed to send welcome email:", error);
    throw error;
  }
}

export async function sendProductRecommendationEmail(
  email: string,
  segment: "skincare" | "self-care" | "body-glow" | "spa-relax"
) {
  const recommendations: Record<string, { products: string; title: string }> = {
    skincare: {
      title: "Complete Glass Skin Routine",
      products: "Niacinamide Toner + Gua Sha Set + Sheet Mask",
    },
    "self-care": {
      title: "Nervous System Reset",
      products: "Magnesium Supplement + Weighted Blanket + Aroma Diffuser",
    },
    "body-glow": {
      title: "Body Glow Protocol",
      products: "Dry Brush + Body Oil + Aveeno Oil Mist",
    },
    "spa-relax": {
      title: "At-Home Spa Sanctuary",
      products: "Bath Salts + Candle Set + Essential Oils",
    },
  };

  const rec = recommendations[segment];

  try {
    const result = await resend.emails.send({
      from: "Lux Aura Care <hello@luxauracare.com>",
      to: email,
      subject: `Based on Your Interest: ${rec.title}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1a1a1a; font-size: 24px;">We Found Your Next Favorite Bundle</h1>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Based on your interest in <strong>${segment}</strong> products, we curated this collection just for you.
          </p>

          <div style="background: #f9f9f9; border-left: 4px solid #d4af37; padding: 20px; margin: 24px 0; border-radius: 8px;">
            <h2 style="color: #d4af37; margin: 0 0 8px 0;">${rec.title}</h2>
            <p style="color: #666; margin: 0; font-size: 14px;">${rec.products}</p>
            <p style="color: #999; margin: 12px 0 0 0; font-size: 13px;">Save 15-40% when bought together</p>
          </div>

          <div style="text-align: center;">
            <a href="https://luxaura.care/favorites" style="display: inline-block; background: #d4af37; color: #000; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 14px;">
              View Bundle →
            </a>
          </div>

          <p style="color: #999; font-size: 12px; text-align: center; margin-top: 24px;">
            Not interested? No problem. Reply to let us know.
          </p>
        </div>
      `,
    });

    return result;
  } catch (error) {
    console.error("Failed to send recommendation email:", error);
    throw error;
  }
}
