"use client";

import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  hasCompletedOnboarding,
  getUserProfile,
} from "@/services/user-service";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const { user, loading, signOut } = useAuthStore();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);

  useEffect(() => {
    // If not logged in, redirect to sign up
    if (!loading && !user) {
      router.push("/sign-up");
      return;
    }

    // If logged in, check onboarding status
    if (user) {
      const checkOnboarding = async () => {
        try {
          const completed = await hasCompletedOnboarding(user.uid);
          if (!completed) {
            // User hasn't completed onboarding, redirect
            router.push("/onboarding");
            return;
          }

          // Get user profile data
          const profileResult = await getUserProfile(user.uid);
          if (profileResult.success && profileResult.data) {
            setUserProfile(profileResult.data);
          }
        } catch (error) {
          console.error("Error checking user profile:", error);
        } finally {
          setIsCheckingProfile(false);
        }
      };

      checkOnboarding();
    }
  }, [user, loading, router]);

  // Show loading state while checking authentication or profile
  if (loading || isCheckingProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  // If no user is logged in, this will be briefly shown before redirecting
  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={signOut}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Sign Out
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow dark:bg-gray-800">
        <div className="flex items-center mb-6">
          {user.photoURL && (
            <img
              src={user.photoURL}
              alt="Profile"
              className="w-16 h-16 rounded-full mr-4"
            />
          )}
          <div>
            <h2 className="text-xl font-semibold">
              {userProfile?.firstName
                ? `${userProfile.firstName} ${userProfile.lastName}`
                : user.displayName || "User"}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
          </div>
        </div>

        {userProfile && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-medium">Your Profile Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Course
                </p>
                <p className="font-medium">{userProfile.course}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Annual Income
                </p>
                <p className="font-medium">{userProfile.annualIncome}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  State
                </p>
                <p className="font-medium">{userProfile.state}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  District
                </p>
                <p className="font-medium">{userProfile.district}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
