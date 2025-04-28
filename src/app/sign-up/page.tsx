"use client";

import { useAuthStore } from "@/store/auth-store";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SignUp() {
  const { user, signInWithGoogle, loading, error, setError } = useAuthStore();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    return () => {
      setError(null);
    };
  }, [setError]);

  useEffect(() => {
    if (user && !loading) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  const handleGoogleSignIn = async () => {
    try {
      setIsSigningIn(true);
      await signInWithGoogle();
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSigningIn(false);
    }
  };

  if (user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12 bg-primary/5">
      <div className="w-full max-w-lg space-y-8 bg-white border border-neutral-200 p-10 rounded-2xl">
        <div>
          <h1 className="text-center text-3xl font-bold">
            Get started with ScholarAI
          </h1>
          <p className="mt-2 text-xl font-medium w-[70%] text-center mx-auto text-muted-foreground">
            Sign up to create an account and explore scholarships
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        <div className="mt-8 text-center">
          <Button
            size={"lg"}
            className="font-semibold text-lg rounded-xl cursor-pointer"
            onClick={handleGoogleSignIn}
            disabled={isSigningIn || loading}
          >
            {isSigningIn ? "Signing in..." : "Sign up with Google"}
          </Button>
        </div>

        <div className="text-center mt-4">
          <div>
            <span>Already have an account? </span>
            <Button variant={"link"} className="p-0">
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
