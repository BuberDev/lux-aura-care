import { NextResponse, type NextRequest } from "next/server";
import { sendContactEmail } from "@/lib/resend-client";
import { defaultLocale, isLocale } from "@/lib/i18n/config";
import { translateText } from "@/lib/i18n/messages";

export const runtime = "nodejs";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;
    const locale = isLocale(body.locale) ? body.locale : defaultLocale;

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: translateText(locale, "All fields are required") },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: translateText(locale, "Invalid email address") },
        { status: 400 }
      );
    }

    // Send email via Resend
    await sendContactEmail({
      name,
      email: email.toLowerCase().trim(),
      subject,
      message,
    });

    return NextResponse.json(
      { success: true, message: translateText(locale, "Your message has been sent successfully!") },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
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
