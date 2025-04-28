import { NextResponse } from "next/server";
import { hasCompletedOnboarding } from "@/services/user-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId } = body;

    console.log("Checking onboarding status for user:", userId);

    if (!userId) {
      console.error("No userId provided in request");
      return NextResponse.json(
        { error: "User ID is required", completed: false },
        { status: 400 }
      );
    }

    const completed = await hasCompletedOnboarding(userId);
    console.log(`Onboarding completed for user ${userId}:`, completed);

    return NextResponse.json({ completed });
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    // Return false for completed as a fallback to prevent redirect loops
    return NextResponse.json(
      { error: "Failed to check onboarding status", completed: false },
      { status: 500 }
    );
  }
}
