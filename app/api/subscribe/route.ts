import { NextResponse, type NextRequest } from "next/server";

import { subscribeToNewsletter, type SubscriberData } from "@/lib/email-service";

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

    const result = await subscribeToNewsletter({
      email: body.email,
      source: body.source || "newsletter",
      segment: body.segment,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Subscription failed" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Successfully subscribed to newsletter",
        subscriberId: result.subscriberId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
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
