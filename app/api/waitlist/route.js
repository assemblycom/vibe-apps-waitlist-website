import { NextResponse } from "next/server";
import { createServiceClient } from "@/app/lib/supabase";
import { validateWaitlistForm } from "@/app/lib/validation";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, company } = body;

    const { valid, errors } = validateWaitlistForm({ name, email, company });
    if (!valid) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { error } = await supabase.from("waitlist_submissions").insert({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      company: company.trim(),
    });

    if (error) {
      // Unique constraint violation on email
      if (error.code === "23505") {
        return NextResponse.json(
          { errors: { email: "This email is already on the waitlist" } },
          { status: 409 }
        );
      }
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Something went wrong. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Waitlist API error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
