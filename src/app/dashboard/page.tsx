"use client";

import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const { user, loading, signOut } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signup");
    }
  }, [user, loading, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">Loading...</p>
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

      <div className="bg-white p-6 rounded-lg shadow">
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
              {user.displayName || "User"}
            </h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>
        <p className="mb-4">Welcome to your dashboard!</p>
        <p>User ID: {user.uid}</p>
      </div>
    </div>
  );
}
