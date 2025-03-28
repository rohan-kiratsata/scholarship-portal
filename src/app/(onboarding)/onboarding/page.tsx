import React from "react";
import { OnboardingForm } from "@/components/onboarding/onboarding-form";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container max-w-4xl py-16 mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            Complete Your Profile
          </h1>
          <p className="text-muted-foreground mt-3 text-lg">
            Please provide your details to complete the onboarding process.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 p-6 md:p-8">
          <OnboardingForm />
        </div>
      </div>
    </div>
  );
}
