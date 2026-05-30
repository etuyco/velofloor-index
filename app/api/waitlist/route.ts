import { NextResponse } from "next/server";
import { sendWaitlistEmails } from "@/lib/mailer";

// Basic but practical email validation.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let email: unknown;

  try {
    const body = await request.json();
    email = body?.email;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  try {
    await sendWaitlistEmails(email.trim());
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Failed to send waitlist emails:", err);
    return NextResponse.json(
      { error: "Could not process your signup right now. Please try again." },
      { status: 500 },
    );
  }
}
