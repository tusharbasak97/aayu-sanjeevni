import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { checkRateLimit } from "@/lib/rate-limit";
import { sanitizeHtml } from "@/lib/sanitize";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().trim().email("Valid email is required").max(150, "Email is too long"),
  phone: z.string().trim().max(25, "Phone is too long").optional(),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000, "Message is too long"),
});

export async function POST(req: NextRequest) {
  try {
    // OWASP A04 - Rate limiting on public contact form (5 submissions per 10 minutes per IP)
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anonymous";
    const rateLimit = checkRateLimit(`contact_${ip}`, { limit: 5, windowMs: 600000 });

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many contact requests from your IP. Please try again in a few minutes.",
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const validated = contactSchema.parse(body);

    // Sanitize inputs for email delivery
    const safeName = sanitizeHtml(validated.name);
    const safeMessage = sanitizeHtml(validated.message);
    const safePhone = validated.phone ? sanitizeHtml(validated.phone) : "";

    // Send email if Resend is configured
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "Aayu Sanjeevni <onboarding@resend.dev>",
        to: process.env.CONTACT_EMAIL || "contact@aayusanjeevni.org",
        subject: `New Contact Form Submission from ${safeName}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${validated.email}</p>
          ${safePhone ? `<p><strong>Phone:</strong> ${safePhone}</p>` : ""}
          <p><strong>Message:</strong></p>
          <p>${safeMessage}</p>
        `,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Your message has been sent successfully. We'll get back to you soon!",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }
    console.error("Error sending contact form:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send message" },
      { status: 500 }
    );
  }
}
