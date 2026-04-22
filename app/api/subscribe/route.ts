import { NextResponse, type NextRequest } from "next/server";

import { subscribeToNewsletter, type SubscriberData } from "@/lib/email-service";
import { sendWelcomeEmail, sendProductRecommendationEmail } from "@/lib/resend-client";

export const runtime = "nodejs";

type SubscribeRequest = {
  email: string;
  source?: SubscriberData["source"];
  segment?: SubscriberData["segment"];
};

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SubscribeRequest;

    if (!body.email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (!isValidEmail(body.email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    const email = body.email.toLowerCase().trim();

    const subscriptionResult = await subscribeToNewsletter({
      email,
      source: body.source || "newsletter",
      segment: body.segment,
    });

    if (!subscriptionResult.success) {
      console.warn(`Subscription failed for ${email}:`, subscriptionResult.error);
      return NextResponse.json(
        { error: subscriptionResult.error || "Subscription failed" },
        { status: 400 }
      );
    }

    let emailSent = false;
    let emailError: string | null = null;

    try {
      await sendWelcomeEmail(email);
      emailSent = true;
      console.log(`Welcome email sent to ${email}`);
    } catch (error) {
      emailError = error instanceof Error ? error.message : "Unknown error";
      console.error(`Failed to send welcome email to ${email}:`, error);
    }

    if (body.segment && emailSent) {
      try {
        setTimeout(
          () => {
            sendProductRecommendationEmail(email, body.segment as any).catch((error) =>
              console.error(`Failed to send recommendation email to ${email}:`, error)
            );
          },
          5000
        );
      } catch (error) {
        console.error(`Failed to schedule recommendation email for ${email}:`, error);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: emailSent
          ? "Check your email for your welcome gift!"
          : "Subscribed, but welcome email delayed",
        subscriberId: subscriptionResult.subscriberId,
        emailSent,
        emailError,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    }
  );
}
