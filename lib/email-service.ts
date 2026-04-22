export type EmailProvider = "resend" | "mailchimp" | "convertkit";

export type SubscriberData = {
  email: string;
  source: "newsletter" | "article" | "product-page" | "bundle" | "pinterest-pin";
  segment?: "skincare" | "self-care" | "body-glow" | "spa-relax";
  metadata?: Record<string, string>;
};

export async function subscribeToNewsletter(data: SubscriberData): Promise<{
  success: boolean;
  error?: string;
  subscriberId?: string;
}> {
  const provider = (process.env.EMAIL_PROVIDER || "resend") as EmailProvider;

  if (!process.env.EMAIL_API_KEY) {
    return {
      success: false,
      error: "Email service not configured",
    };
  }

  switch (provider) {
    case "resend":
      return subscribeViaResend(data);
    case "mailchimp":
      return subscribeViaMailchimp(data);
    case "convertkit":
      return subscribeViaConvertKit(data);
    default:
      return {
        success: false,
        error: "Unknown email provider",
      };
  }
}

async function subscribeViaResend(data: SubscriberData) {
  try {
    const response = await fetch("https://api.resend.com/contacts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.EMAIL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        audience_id: process.env.EMAIL_AUDIENCE_ID,
        tags: [data.source, data.segment].filter(Boolean),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || "Failed to subscribe",
      };
    }

    const result = await response.json();
    return {
      success: true,
      subscriberId: result.id,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function subscribeViaMailchimp(data: SubscriberData) {
  try {
    const dc = process.env.MAILCHIMP_DC || "us1";
    const listId = process.env.MAILCHIMP_LIST_ID;

    if (!listId) {
      return {
        success: false,
        error: "Mailchimp list ID not configured",
      };
    }

    const response = await fetch(
      `https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`anystring:${process.env.EMAIL_API_KEY}`).toString("base64")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_address: data.email,
          status: "pending",
          tags: [data.source, data.segment].filter(Boolean),
          merge_fields: {
            SOURCE: data.source,
            SEGMENT: data.segment,
          },
        }),
      }
    );

    if (!response.ok && response.status !== 400) {
      const error = await response.json();
      return {
        success: false,
        error: error.detail || "Failed to subscribe",
      };
    }

    const result = await response.json();

    if (response.status === 400 && result.title === "Member Exists") {
      return {
        success: true,
        subscriberId: result.id,
      };
    }

    return {
      success: true,
      subscriberId: result.id,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function subscribeViaConvertKit(data: SubscriberData) {
  try {
    const response = await fetch("https://api.convertkit.com/v3/subscribers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: process.env.EMAIL_API_KEY,
        email: data.email,
        fields: {
          source: data.source,
          segment: data.segment,
        },
        tags: [data.source, data.segment].filter(Boolean),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || "Failed to subscribe",
      };
    }

    const result = await response.json();
    return {
      success: true,
      subscriberId: String(result.subscriber?.id),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
