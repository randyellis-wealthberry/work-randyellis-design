import { SKILL_MODULES, type SkillModuleId } from "@/lib/data/skill-catalog";

/**
 * The email a buyer gets after checkout. Plain text first: it is a receipt
 * with links, and a receipt that renders as a marketing card reads as an
 * advert. The HTML mirrors the text line for line.
 *
 * The durable link is the download page, which re-verifies the session with
 * Stripe and mints a fresh grant on every visit. The per-file links carry a
 * grant that expires in thirty days; the page does not.
 */
export type ReceiptInput = {
  /** Absolute URL of the success page for this session. */
  downloadPageUrl: string;
  /** Absolute download URL per module, in catalog order. */
  files: { id: SkillModuleId; url: string }[];
  /** How to install, shown once. */
  installPath: string;
};

export function buildReceiptEmail(input: ReceiptInput): {
  subject: string;
  text: string;
  html: string;
} {
  const modules = input.files
    .map((f) => {
      const entry = SKILL_MODULES.find((m) => m.id === f.id);
      return { ...f, name: entry?.name ?? f.id };
    })
    .filter(Boolean);

  const count = modules.length;
  const subject =
    count === 1
      ? `Your Skill.md module: ${modules[0].name}`
      : `Your Skill.md modules (${count})`;

  const lines = [
    "Thanks. Here is what you bought, as the files they are.",
    "",
    ...modules.map((m) => `${m.name}\n${m.url}`),
    "",
    `Install: save each file as ${input.installPath}<module>/SKILL.md in your project, or wherever your agent keeps skills. Nothing else to configure.`,
    "",
    "Keep this link. It re-opens your download page any time, and it is the place to fetch an updated version when one is published:",
    input.downloadPageUrl,
    "",
    "The per-file links above expire after thirty days; the page link does not.",
    "",
    "Licensed to you, or to the team you bought it for. Copy it into every project you like; do not republish it.",
    "",
    "Reply to this email if a file will not open.",
    "",
    "Randy Ellis",
    "work.randyellis.design/skill",
  ];

  const text = lines.join("\n");

  const esc = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #18181b; max-width: 600px; margin: 0 auto; padding: 24px;">
  <p style="margin: 0 0 20px;">Thanks. Here is what you bought, as the files they are.</p>
  <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse: collapse; width: 100%;">
    ${modules
      .map(
        (m) => `<tr>
      <td style="padding: 12px 0; border-top: 1px solid #e4e4e7;">
        <div style="font-weight: 500;">${esc(m.name)}</div>
        <a href="${esc(m.url)}" style="color: #18181b; text-decoration: underline; text-underline-offset: 3px;">Download SKILL.md</a>
      </td>
    </tr>`,
      )
      .join("\n    ")}
  </table>
  <p style="margin: 20px 0 0;">Install: save each file as <code>${esc(input.installPath)}&lt;module&gt;/SKILL.md</code> in your project, or wherever your agent keeps skills. Nothing else to configure.</p>
  <p style="margin: 20px 0 0;">Keep this link. It re-opens your download page any time, and it is the place to fetch an updated version when one is published:<br>
    <a href="${esc(input.downloadPageUrl)}" style="color: #18181b;">${esc(input.downloadPageUrl)}</a></p>
  <p style="margin: 20px 0 0; color: #52525b; font-size: 14px;">The per-file links above expire after thirty days; the page link does not.</p>
  <p style="margin: 20px 0 0; color: #52525b; font-size: 14px;">Licensed to you, or to the team you bought it for. Copy it into every project you like; do not republish it.</p>
  <p style="margin: 20px 0 0;">Reply to this email if a file will not open.</p>
  <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e4e4e7;">
    <p style="margin: 0; font-weight: 600;">Randy Ellis</p>
    <p style="margin: 4px 0 0; color: #71717a; font-size: 14px;">work.randyellis.design/skill</p>
  </div>
</body>
</html>
`;

  return { subject, text, html };
}
