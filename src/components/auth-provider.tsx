"use client";

import React, { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuthStore } from "@/store/auth-store";
import { mapFirebaseUser } from "@/types";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      useAuthStore.setState({
        user: firebaseUser ? mapFirebaseUser(firebaseUser) : null,
        loading: false,
      });
    });
    return () => unsubscribe();
  }, []);
  return <>{children}</>;
}
