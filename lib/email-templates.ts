/**
 * Branded HTML email templates for Velofloor waitlist mail.
 *
 * Email clients are not browsers: layout uses tables, all styling is inline,
 * and only widely-supported CSS is used. Each template returns the `subject`,
 * a plain-text `text` fallback, and the `html` body.
 */

export const LAUNCH_DATE = "June 15, 2026";

const BRAND = {
  paper: "#fdfaf4",
  ink: "#0d0e10",
  forest: "#047857",
  emerald: "#22c55e",
  sand: "#e5dcc8",
  slate: "#334155",
  muted: "#6b7280",
};

const FONT_BODY =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const FONT_DISPLAY = "Georgia,'Times New Roman',serif";

/** Sender identity + physical mailing address (required by CAN-SPAM / CASL). */
function company(): { name: string; address: string } {
  return {
    name: process.env.COMPANY_NAME || "Velofloor Inc.",
    address: process.env.COMPANY_ADDRESS || "Alberta, Canada",
  };
}

/** Escape user-supplied values before interpolating into HTML. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Hidden preview text shown in the inbox list before the body. */
function preheader(text: string): string {
  return `<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;font-size:1px;line-height:1px;color:${BRAND.paper};">${escapeHtml(
    text,
  )}</div>`;
}

/** Velofloor logo lockup: green rounded mark + wordmark. */
function logo(): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="vertical-align:middle;padding-right:10px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td width="40" height="40" align="center" valign="middle"
                  style="width:40px;height:40px;background-color:${BRAND.forest};border-radius:10px;color:#ffffff;font-family:${FONT_DISPLAY};font-size:22px;font-weight:bold;line-height:40px;">
                V
              </td>
            </tr>
          </table>
        </td>
        <td style="vertical-align:middle;font-family:${FONT_DISPLAY};font-size:24px;font-weight:bold;color:${BRAND.ink};letter-spacing:-0.5px;">
          Velofloor
        </td>
      </tr>
    </table>`;
}

/** Standard footer: sender identification + physical mailing address. */
function brandFooter(): string {
  const c = company();
  return `
    &copy; 2026 ${escapeHtml(c.name)} &nbsp;&bull;&nbsp; ${escapeHtml(c.address)}<br>
    SOC 2 Type II Ready &nbsp;&bull;&nbsp; End-to-End Encrypted`;
}

/**
 * Compliance footer for subscriber-facing mail: why they're receiving it, a
 * clear unsubscribe link, sender identity, and physical mailing address.
 */
function complianceFooter(recipientEmail: string, unsubscribeUrl: string): string {
  const c = company();
  const safe = escapeHtml(recipientEmail);
  return `
    You're receiving this because you joined the Velofloor waitlist with ${safe}.<br>
    <a href="${escapeHtml(unsubscribeUrl)}" style="color:${BRAND.forest};text-decoration:underline;">Unsubscribe</a>
    from these emails at any time.<br><br>
    ${escapeHtml(c.name)} &nbsp;&bull;&nbsp; ${escapeHtml(c.address)}`;
}

/** Shared responsive shell: paper background + centered white card. */
function layout(opts: {
  preheaderText: string;
  content: string;
  footer?: string;
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="x-apple-disable-message-reformatting">
</head>
<body style="margin:0;padding:0;background-color:${BRAND.paper};">
  ${preheader(opts.preheaderText)}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${BRAND.paper};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:100%;">
          <!-- Header -->
          <tr>
            <td style="padding:8px 8px 24px 8px;">
              ${logo()}
            </td>
          </tr>
          <!-- Card -->
          <tr>
            <td style="background-color:#ffffff;border:1px solid ${BRAND.sand};border-radius:16px;padding:40px;">
              ${opts.content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 8px;text-align:center;font-family:${FONT_BODY};font-size:11px;line-height:18px;color:${BRAND.muted};">
              ${opts.footer ?? brandFooter()}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function badge(text: string): string {
  return `<span style="display:inline-block;font-family:${FONT_BODY};font-size:11px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;color:${BRAND.forest};background-color:#ecfdf5;border:1px solid #a7f3d0;border-radius:999px;padding:6px 12px;">${escapeHtml(
    text,
  )}</span>`;
}

function heading(text: string): string {
  return `<h1 style="margin:0 0 16px 0;font-family:${FONT_DISPLAY};font-size:30px;line-height:1.2;font-weight:bold;color:${BRAND.ink};letter-spacing:-0.5px;">${text}</h1>`;
}

function paragraph(html: string): string {
  return `<p style="margin:0 0 16px 0;font-family:${FONT_BODY};font-size:16px;line-height:1.6;color:${BRAND.slate};">${html}</p>`;
}

/** Notification sent to admins when someone joins the waitlist. */
export function adminNotificationEmail(email: string): {
  subject: string;
  text: string;
  html: string;
} {
  const safe = escapeHtml(email);
  const content = `
    ${badge("New Signup")}
    <div style="height:16px;"></div>
    ${heading("New waitlist signup")}
    ${paragraph("Someone just secured their spot on the Velofloor waitlist.")}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 24px 0;">
      <tr>
        <td style="background-color:${BRAND.paper};border:1px solid ${BRAND.sand};border-radius:12px;padding:18px 20px;">
          <div style="font-family:${FONT_BODY};font-size:11px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;color:${BRAND.muted};margin-bottom:6px;">Subscriber email</div>
          <a href="mailto:${safe}" style="font-family:${FONT_BODY};font-size:18px;font-weight:600;color:${BRAND.forest};text-decoration:none;word-break:break-all;">${safe}</a>
        </td>
      </tr>
    </table>
    ${paragraph(
      `Reply directly to this email to reach <strong style="color:${BRAND.ink};">${safe}</strong>.`,
    )}`;

  return {
    subject: `New Velofloor waitlist signup: ${email}`,
    text: `New Velofloor waitlist signup\n\nSomeone just secured their spot on the waitlist.\n\nSubscriber email: ${email}\n\nReply to this email to reach them directly.`,
    html: layout({
      preheaderText: `${email} just joined the Velofloor waitlist.`,
      content,
    }),
  };
}

/** Confirmation sent to the subscriber after they join. */
export function subscriberConfirmationEmail(
  email: string,
  unsubscribeUrl: string,
): {
  subject: string;
  text: string;
  html: string;
} {
  const c = company();
  const content = `
    ${badge("You're on the list")}
    <div style="height:16px;"></div>
    ${heading("Welcome to the Velofloor waitlist \u{1F389}")}
    ${paragraph(
      "Thanks for securing your spot. You're officially in line for early access to the Virtual Headquarters built for distributed teams.",
    )}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 24px 0;">
      <tr>
        <td style="background-color:${BRAND.paper};border:1px solid ${BRAND.sand};border-radius:12px;padding:20px 22px;">
          <div style="font-family:${FONT_BODY};font-size:11px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;color:${BRAND.muted};margin-bottom:10px;">What you've locked in</div>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="font-family:${FONT_BODY};font-size:15px;line-height:1.5;color:${BRAND.ink};padding-bottom:8px;">
                <span style="color:${BRAND.forest};font-weight:bold;">&#10003;</span>&nbsp; Lifetime early-adopter pricing
              </td>
            </tr>
            <tr>
              <td style="font-family:${FONT_BODY};font-size:15px;line-height:1.5;color:${BRAND.ink};padding-bottom:8px;">
                <span style="color:${BRAND.forest};font-weight:bold;">&#10003;</span>&nbsp; Priority access when we launch
              </td>
            </tr>
            <tr>
              <td style="font-family:${FONT_BODY};font-size:15px;line-height:1.5;color:${BRAND.ink};">
                <span style="color:${BRAND.forest};font-weight:bold;">&#10003;</span>&nbsp; Launching <strong>${LAUNCH_DATE}</strong>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    ${paragraph(
      "We'll keep your inbox quiet until there's something worth sharing. Keep an eye out as launch day approaches.",
    )}
    ${paragraph(
      `<span style="color:${BRAND.muted};">&mdash; The Velofloor Team</span>`,
    )}`;

  return {
    subject: "You're on the Velofloor waitlist \u{1F389}",
    text:
      `Welcome to the Velofloor waitlist!\n\n` +
      `Thanks for securing your spot. You're officially in line for early access.\n\n` +
      `What you've locked in:\n` +
      `- Lifetime early-adopter pricing\n` +
      `- Priority access when we launch\n` +
      `- Launching ${LAUNCH_DATE}\n\n` +
      `We'll keep your inbox quiet until there's something worth sharing.\n\n` +
      `— The Velofloor Team\n\n` +
      `----\n` +
      `You're receiving this because you joined the Velofloor waitlist with ${email}.\n` +
      `Unsubscribe: ${unsubscribeUrl}\n` +
      `${c.name} · ${c.address}`,
    html: layout({
      preheaderText:
        "You're in. Lifetime early-adopter pricing locked in — we launch June 15, 2026.",
      content,
      footer: complianceFooter(email, unsubscribeUrl),
    }),
  };
}
