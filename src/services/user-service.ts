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

// Function to check if a user has completed onboarding
export async function getUserProfile(userId: string) {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      return {
        success: true,
        data: userDoc.data(),
      };
    } else {
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
  const result = await getUserProfile(userId);
  if (result.success && result.data) {
    return result.data.onboardingCompleted === true;
  }
  return false;
}
