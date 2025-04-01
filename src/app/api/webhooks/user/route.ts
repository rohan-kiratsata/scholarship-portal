import { supabase } from "@/lib/supabase/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    if (payload.type !== "user.created") {
      return NextResponse.json(
        { error: "Invalid event type" },
        { status: 400 }
      );
    }

    const userData = payload.data;

    // Insert user data into Supabase
    const { error } = await supabase.from("profiles").insert({
      stack_id: userData.id,
      full_name: userData.display_name,
    });

    if (error) {
      console.error("Error storing user data:", error);
      return NextResponse.json(
        { error: "Failed to store user data" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
