import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AuthUser } from "@/types";
import { OnboardingFormValues } from "@/lib/schema";

// Function to save onboarding data to Firestore
export async function saveUserProfile(
  userId: string,
  profileData: OnboardingFormValues
) {
  try {
    const userRef = doc(db, "users", userId);
    // Merge the data with any existing user data
    await setDoc(
      userRef,
      {
        ...profileData,
        onboardingCompleted: true,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    return { success: true };
  } catch (error) {
    console.error("Error saving user profile:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save profile",
    };
  }
}

export async function getUserProfile(userId: string) {
  try {
    console.log(`Fetching user profile for ${userId}`);
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      console.log(`User profile found for ${userId}`);
      return {
        success: true,
        data: userDoc.data(),
      };
    } else {
      console.log(`No user profile found for ${userId}`);
      return {
        success: true,
        data: null,
      };
    }
  } catch (error) {
    console.error("Error getting user profile:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get profile",
    };
  }
}

// Function to check if user has completed onboarding
export async function hasCompletedOnboarding(userId: string) {
  try {
    console.log(`Checking onboarding completion for ${userId}`);
    if (!userId) {
      console.error(
        "hasCompletedOnboarding called with invalid userId:",
        userId
      );
      return false;
    }

    const result = await getUserProfile(userId);

    if (result.success && result.data) {
      const isCompleted = result.data.onboardingCompleted === true;
      console.log(`Onboarding completion status for ${userId}:`, isCompleted);
      return isCompleted;
    }

    console.log(`User ${userId} has not completed onboarding`);
    return false;
  } catch (error) {
    console.error(`Error checking onboarding status for ${userId}:`, error);
    return false;
  }
}
