import { NextResponse } from "next/server";
import { unsubscribe } from "@/lib/db";
import { verifyToken } from "@/lib/unsubscribe";

/**
 * Processes an opt-out. Used both by email-provider one-click unsubscribe
 * (RFC 8058 List-Unsubscribe-Post sends a POST here) and by the confirm
 * button on the /unsubscribe page. The email + signed token come from the
 * query string; the POST body is ignored.
 */
export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("e") ?? "";
  const token = searchParams.get("t") ?? "";

  if (!verifyToken(email, token)) {
    return NextResponse.json(
      { error: "Invalid or expired unsubscribe link." },
      { status: 400 },
    );
  }

  try {
    await unsubscribe(email);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Failed to process unsubscribe:", err);
    return NextResponse.json(
      { error: "Could not process your request. Please try again." },
      { status: 500 },
    );
  }
}
