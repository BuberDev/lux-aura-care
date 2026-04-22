import { Resend } from "resend";

const resend = new Resend(process.env.EMAIL_API_KEY);

export { resend };

export async function sendWelcomeEmail(email: string) {
  try {
    const result = await resend.emails.send({
      from: "Lux Aura Care <onboarding@resend.dev>",
      to: email,
      subject: "Your 15% Off Code is Inside ✨",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1a1a1a; margin: 0; font-size: 28px;">Welcome to Lux Aura Care ✨</h1>
          </div>

          <div style="background: linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%); border-radius: 16px; padding: 24px; margin-bottom: 24px; border: 1px solid rgba(212, 175, 55, 0.2);">
            <p style="color: #666; margin: 0 0 16px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Your Exclusive Offer</p>
            <h2 style="color: #d4af37; margin: 0 0 12px 0; font-size: 24px;">15% OFF Your First Bundle</h2>
            <p style="color: #333; margin: 0; font-size: 16px; line-height: 1.5;">
              Use this exclusive discount on any bundle when you shop through Lux Aura Care.
            </p>
          </div>

          <div style="background: #f5f5f5; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <h3 style="color: #1a1a1a; margin: 0 0 12px 0; font-size: 16px;">What You'll Get:</h3>
            <ul style="color: #666; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.8;">
              <li>Curated ritual guides each Friday morning</li>
              <li>New product picks before Instagram (exclusive access)</li>
              <li>Exclusive bundle discounts (15-25% off)</li>
              <li>Abandoned routine recovery emails (never miss a beat)</li>
              <li>Early access to new launches</li>
            </ul>
          </div>

          <div style="text-align: center; margin-bottom: 24px;">
            <a href="https://luxaura.care/favorites" style="display: inline-block; background: #d4af37; color: #000; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; transition: background 0.3s;">
              Explore Ritual Bundles →
            </a>
          </div>

          <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;">

          <div style="background: #fafafa; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
            <h4 style="color: #1a1a1a; margin: 0 0 8px 0; font-size: 14px;">💡 Pro Tip:</h4>
            <p style="color: #666; margin: 0; font-size: 13px; line-height: 1.6;">
              Our <strong>Sleep Reset Bundle</strong> is trending on Pinterest this week. 4 products, complete sleep protocol, save $75-90 when bought together.
            </p>
          </div>

          <div style="color: #999; font-size: 12px; text-align: center; line-height: 1.6;">
            <p style="margin: 0;">We send ritual guides Friday mornings only.</p>
            <p style="margin: 8px 0 0 0;">Unsubscribe anytime—no hard feelings.</p>
            <p style="margin: 12px 0 0 0; color: #bbb;">
              © 2026 Lux Aura Care | Professional Ritual Guides
            </p>
          </div>
        </div>
      `,
      text: `Welcome to Lux Aura Care!

Your 15% OFF code is ready.
Use it on any bundle for exclusive savings.

What you'll get:
- Curated ritual guides each Friday morning
- New product picks before Instagram
- Exclusive bundle discounts (15-25% off)
- Abandoned routine recovery emails
- Early access to new launches

Explore bundles: https://luxaura.care/favorites

We send Friday mornings only. Unsubscribe anytime.`,
    });

    return result;
  } catch (error) {
    console.error("Failed to send welcome email:", error);
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
      from: "Lux Aura Care <onboarding@resend.dev>",
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
