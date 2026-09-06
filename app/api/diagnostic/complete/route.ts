import { NextRequest, NextResponse } from "next/server";
import { checkBotId } from "botid/server";
import { z } from "zod";
import {
  isDiagnosticComplete,
  scoreDiagnostic,
  BAND_LABELS,
} from "@/lib/data/diagnostic";

const schema = z.object({
  email: z.string().email("Enter a valid email address."),
  firstName: z.string().trim().max(80).optional(),
  answers: z.record(z.string(), z.number().int().min(0).max(3)),
});

/**
 * The gate between the twelve answers and the verdict. Stores the founder as
 * a Resend contact and emails Randy a PDF of the scored diagnostic. Scores
 * are recomputed here; the client's numbers are never trusted.
 */
export async function POST(request: NextRequest) {
  try {
    const verification = await checkBotId();
    if (verification.isBot) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "Server configuration error. Please contact support." },
        { status: 500 },
      );
    }

    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid request." },
        { status: 400 },
      );
    }
    const { email, firstName, answers } = parsed.data;
    if (!isDiagnosticComplete(answers)) {
      return NextResponse.json(
        { error: "Answer every question before requesting the verdict." },
        { status: 400 },
      );
    }

    const { upsertContact, sendEmail, OWNER_EMAIL } = await import(
      "@/lib/email"
    );
    const contact = await upsertContact({ email, firstName });
    if (contact.error) {
      console.error("Diagnostic contact error:", contact.error);
      return NextResponse.json(
        { error: "Could not save your email. Please try again." },
        { status: 500 },
      );
    }

    // The contact is stored, so the founder gets the verdict from here on.
    // A failed report is logged, not surfaced; awaited so Vercel does not end
    // the function before Resend accepts it.
    const result = scoreDiagnostic(answers);
    try {
      const { buildDiagnosticPdf } = await import(
        "@/lib/email/diagnostic-report"
      );
      const pdf = await buildDiagnosticPdf({
        email,
        firstName,
        answers,
        result,
      });
      const scores = result.dimensions
        .map((d) => `${d.name}: ${d.score}/${d.max} (${BAND_LABELS[d.band]})`)
        .join("\n");
      const sent = await sendEmail({
        to: OWNER_EMAIL,
        replyTo: email,
        subject: `Diagnostic: ${email} · ${result.total}/${result.max} · ${BAND_LABELS[result.band]}`,
        text: `${firstName ? `${firstName} <${email}>` : email} completed the diagnostic.\n\nTotal: ${result.total}/${result.max} (${BAND_LABELS[result.band]})\n${scores}\n\nWeakest: ${result.weakest.name}\n\nFull report attached.`,
        attachments: [
          {
            filename: `diagnostic-${email.replace(/[^a-z0-9]+/gi, "-")}.pdf`,
            content: pdf,
          },
        ],
      });
      if (!sent.success) console.error("Diagnostic report error:", sent.error);
    } catch (reportError) {
      console.error("Diagnostic report error:", reportError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Diagnostic complete error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 },
    );
  }
}
