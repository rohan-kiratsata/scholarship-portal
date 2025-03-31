import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function middleware(request: NextRequest) {
  try {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req: request, res });

    // Get the user from Supabase auth
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // If no user, return early
    if (!user) {
      return res;
    }

    // Check if user exists in profiles table
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .single();

    if (profileError && profileError.code !== "PGRST116") {
      console.error("Error checking profile:", profileError);
      return res;
    }

    // If profile doesn't exist, create it
    if (!profile) {
      const { error: insertError } = await supabase.from("profiles").insert([
        {
          id: user.id,
          full_name: user.user_metadata.full_name,
          avatar_url: user.user_metadata.avatar_url,
        },
      ]);

      if (insertError) {
        console.error("Error creating profile:", insertError);
      }
    }

    return res;
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.next();
  }
}
