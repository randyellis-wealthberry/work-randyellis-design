import { NextRequest, NextResponse } from "next/server";
import { LoopsClient } from "loops";
import { z } from "zod";
import { emailStorage } from "@/lib/email-storage";

const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().optional(),
  mailingLists: z.array(z.string()).optional(), // Optional mailing list IDs
});

export async function POST(request: NextRequest) {
  try {
    // Check for required environment variables
    if (!process.env.LOOPS_API_KEY) {
      return NextResponse.json(
        { error: "Server configuration error. Please contact support." },
        { status: 500 },
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const result = emailSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Invalid email address" },
        { status: 400 },
      );
    }

    const { email, firstName, mailingLists } = result.data;

    // Store locally for data ownership and backup
    try {
      await emailStorage.addSubscription({
        email,
        source: "website",
        ipAddress:
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
          request.headers.get("x-real-ip") ||
          request.headers.get("cf-connecting-ip") ||
          "unknown",
        userAgent: request.headers.get("user-agent") || "",
        referer: request.headers.get("referer") || "",
        signupSource: "Newsletter form",
      });
    } catch (localStorageError) {
      console.error("Local storage error:", localStorageError);
      // Don't fail the request if local storage fails
    }

    // Add contact to Loops.so
    try {
      const loops = new LoopsClient(process.env.LOOPS_API_KEY as string);

      // Prepare mailing lists object if provided
      const mailingListsObject: Record<string, boolean> = {};
      if (mailingLists && mailingLists.length > 0) {
        mailingLists.forEach((listId) => {
          mailingListsObject[listId] = true;
        });
      }

      const contactData = {
        firstName: firstName || "",
        source: "Website newsletter signup",
        subscribed: true,
        // Enhanced custom properties for better segmentation
        signupSource: "Newsletter form",
        signupDate: new Date().toISOString(),
        userAgent: request.headers.get("user-agent") || "",
        referer: request.headers.get("referer") || "",
        ipAddress:
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
          request.headers.get("x-real-ip") ||
          request.headers.get("cf-connecting-ip") ||
          "unknown",
        signupPage: request.headers.get("referer") || "unknown",
        subscriptionMethod: "Website form",
      };

      const resp = await loops.updateContact(email, contactData);

      // Handle mailing list subscriptions separately if provided
      if (Object.keys(mailingListsObject).length > 0) {
        try {
          await loops.sendEvent({
            email,
            eventName: "manage_lists",
            eventProperties: {
              mailingListsJson: JSON.stringify(mailingListsObject),
              mailingListCount: Object.keys(mailingListsObject).length,
            },
          });
          console.log(`Mailing list subscriptions updated for: ${email}`);
        } catch (listError) {
          console.error("Failed to update mailing lists:", listError);
          // Don't fail the request if mailing list update fails
        }
      }

      if (!resp.success) {
        console.error("Loops API error:", resp);
        return NextResponse.json(
          { error: "Failed to subscribe. Please try again." },
          { status: 400 },
        );
      }

      // Send newsletter signup event to Loops.so for drip campaign triggers
      try {
        await loops.sendEvent({
          email,
          eventName: "newsletter_signup",
          eventProperties: {
            signupSource: "Newsletter form",
            signupDate: new Date().toISOString(),
            hasFirstName: !!firstName,
            userAgent: request.headers.get("user-agent") || "",
            referer: request.headers.get("referer") || "",
            mailingListCount: mailingLists?.length || 0,
          },
        });
        console.log(`Newsletter signup event sent for: ${email}`);
      } catch (eventError) {
        console.error("Failed to send newsletter signup event:", eventError);
        // Don't fail the request if event tracking fails
      }

      console.log(
        `Successfully added contact to Loops: ${email} (ID: ${resp.id})`,
      );
    } catch (error) {
      console.error("Loops subscription error:", error);
      return NextResponse.json(
        { error: "Failed to subscribe. Please try again." },
        { status: 500 },
      );
    }

    // Trigger Zapier webhook (optional - don't fail if this fails)
    if (process.env.ZAPIER_WEBHOOK_URL) {
      try {
        await fetch(process.env.ZAPIER_WEBHOOK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            firstName: firstName || "",
            timestamp: new Date().toISOString(),
            source: "newsletter-signup",
            metadata: {
              userAgent: request.headers.get("user-agent"),
              referer: request.headers.get("referer"),
            },
          }),
        });
      } catch (webhookError) {
        // Log the error but don't fail the request
        console.error("Zapier webhook error:", webhookError);
      }
    }

    return NextResponse.json({
      success: true,
      message:
        "Successfully subscribed! You'll receive a confirmation email shortly.",
    });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 },
    );
  }
}
