import nodemailer, { type Transporter } from "nodemailer";
import {
  adminNotificationEmail,
  subscriberConfirmationEmail,
} from "@/lib/email-templates";
import { recordSignup } from "@/lib/db";
import { buildUnsubscribeUrl, buildOneClickUrl } from "@/lib/unsubscribe";

let cachedTransporter: Transporter | null = null;

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getTransporter(): Transporter {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  cachedTransporter = nodemailer.createTransport({
    host: requireEnv("SMTP_HOST"),
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: requireEnv("SMTP_USER"),
      pass: requireEnv("SMTP_PASS"),
    },
  });

  return cachedTransporter;
}

/**
 * Sends the waitlist notification to the admins and a confirmation to the
 * subscriber. Throws if SMTP env vars are missing or the send fails.
 */
export async function sendWaitlistEmails(email: string): Promise<void> {
  const transporter = getTransporter();
  const from = requireEnv("SMTP_FROM");
  const notify = requireEnv("WAITLIST_NOTIFY")
    .split(",")
    .map((addr) => addr.trim())
    .filter(Boolean);

  // Durably record the signup (also re-subscribes a previously opted-out
  // address — submitting the form is fresh express consent).
  await recordSignup(email);

  // 1. Notify admins of the new signup (internal mail — no unsubscribe).
  const adminMail = adminNotificationEmail(email);
  await transporter.sendMail({
    from,
    to: notify,
    replyTo: email,
    subject: adminMail.subject,
    text: adminMail.text,
    html: adminMail.html,
  });

  // 2. Confirm to the subscriber, with a working unsubscribe link + one-click
  //    headers (CAN-SPAM / CASL; required by Gmail/Yahoo bulk senders).
  const unsubscribeUrl = buildUnsubscribeUrl(email);
  const subscriberMail = subscriberConfirmationEmail(email, unsubscribeUrl);
  await transporter.sendMail({
    from,
    to: email,
    subject: subscriberMail.subject,
    text: subscriberMail.text,
    html: subscriberMail.html,
    headers: {
      "List-Unsubscribe": `<${buildOneClickUrl(email)}>, <mailto:${requireEnv(
        "SMTP_USER",
      )}?subject=unsubscribe>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  });
}
