"use client";

import React from "react";
import { useAuthInit } from "@/hooks/use-auth-init";

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  useAuthInit();
  return <>{children}</>;
}
