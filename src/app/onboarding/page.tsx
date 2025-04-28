"use client";

import React, { useEffect, useState } from "react";
import { OnboardingForm } from "@/components/onboarding/onboarding-form";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { hasCompletedOnboarding } from "@/services/user-service";
import { Loader2 } from "lucide-react";

export default function OnboardingPage() {
  const { user, loading } = useAuthStore();
  const router = useRouter();
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    if (!loading && !user) {
      router.push("/sign-in");
      return;
    }

    // If user is logged in, check if they've already completed onboarding
    if (user) {
      const checkOnboardingStatus = async () => {
        try {
          // First check localStorage for faster response
          const localOnboardingStatus =
            localStorage.getItem("onboardingCompleted") === "true";

          if (localOnboardingStatus) {
            // User has already completed onboarding according to localStorage, redirect to dashboard
            router.push("/dashboard");
            return;
          }

          // If not found in localStorage, check Firebase
          const completed = await hasCompletedOnboarding(user.uid);
          if (completed) {
            // Update localStorage if Firebase says onboarding is completed
            localStorage.setItem("onboardingCompleted", "true");
            // User has already completed onboarding, redirect to dashboard
            router.push("/dashboard");
          }
        } catch (error) {
          console.error("Error checking onboarding status:", error);
        } finally {
          setIsCheckingOnboarding(false);
        }
      };

      checkOnboardingStatus();
    } else {
      setIsCheckingOnboarding(false);
    }
  }, [user, loading, router]);

  return (
    <div className="h-full bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container max-w-4xl py-16 mx-auto px-4">
        <div className="bg-white h-full dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 p-6 md:p-8">
          <OnboardingForm />
        </div>
      </div>
    </div>
  );
}
