// Cloudflare Worker: receives the "Join the closed test" form from solentcompanion.com
// and emails it to the owner. Deployed from the Cloudflare dashboard (Workers & Pages).
// Needs one binding: a "Send email" binding named SEND whose destination is the owner's
// verified Email Routing address. No storage: the details only travel in the email.
import { EmailMessage } from "cloudflare:email";

const TO = "randomdoodle.pm@googlemail.com";
const FROM = "join@solentcompanion.com";
const SITE = "https://solentcompanion.com";
const ALLOWED_ORIGINS = [SITE, "https://www.solentcompanion.com"];

const clean = (v, max = 300) =>
  String(v ?? "").replace(/[\r\n]+/g, " ").trim().slice(0, max);

const page = (title, body, status = 200) =>
  new Response(
    `<!doctype html><html lang="en-GB"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title>
<link rel="stylesheet" href="${SITE}/assets/css/site.css"></head>
<body><main class="wrap prose" style="padding-top:48px"><h1>${title}</h1>${body}
<p><a href="${SITE}/#join">Back to Solent Companion</a></p></main></body></html>`,
    { status, headers: { "content-type": "text/html; charset=utf-8" } }
  );

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== "/join") return new Response("Not found", { status: 404 });
    if (request.method !== "POST") return Response.redirect(`${SITE}/#join`, 303);

    const origin = request.headers.get("Origin");
    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
      return new Response("Forbidden", { status: 403 });
    }

    const form = await request.formData();

    // Honeypot: real people never see or fill this field.
    if (clean(form.get("company"))) return Response.redirect(`${SITE}/thanks.html`, 303);

    const name = clean(form.get("name"), 100);
    const email = clean(form.get("email"), 200);
    const phone = clean(form.get("phone"), 100);
    const area = clean(form.get("area"), 200);
    const boat = clean(form.get("boat"), 200);
    const notes = String(form.get("notes") ?? "").trim().slice(0, 2000);

    if (!/^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/.test(email)) {
      return page(
        "Please check your email address",
        "<p>We need the Google account email you use on your Android phone so we can add you to the test. Please go back and check it.</p>",
        400
      );
    }

    const text = [
      "New closed test sign-up from solentcompanion.com",
      "",
      `Name: ${name || "(not given)"}`,
      `Google account email: ${email}`,
      `Phone model: ${phone || "(not given)"}`,
      `Where they sail: ${area || "(not given)"}`,
      `Boat type and draft: ${boat || "(not given)"}`,
      "",
      "Anything else:",
      notes || "(nothing)",
      "",
      "Reply to this email to reach them directly.",
    ].join("\r\n");

    const raw = [
      `From: Solent Companion website <${FROM}>`,
      `To: ${TO}`,
      `Reply-To: ${email}`,
      `Subject: Closed test sign-up: ${name || email}`,
      `Message-ID: <${crypto.randomUUID()}@solentcompanion.com>`,
      `Date: ${new Date().toUTCString()}`,
      "MIME-Version: 1.0",
      "Content-Type: text/plain; charset=utf-8",
      "Content-Transfer-Encoding: 8bit",
      "",
      text,
    ].join("\r\n");

    try {
      await env.SEND.send(new EmailMessage(FROM, TO, raw));
    } catch (err) {
      console.error("send failed", err);
      return page(
        "Sorry, that didn't send",
        "<p>Something went wrong on our side. Please try again in a few minutes, or email <a href=\"mailto:hello@solentcompanion.com\">hello@solentcompanion.com</a>.</p>",
        500
      );
    }

    return Response.redirect(`${SITE}/thanks.html`, 303);
  },
};
