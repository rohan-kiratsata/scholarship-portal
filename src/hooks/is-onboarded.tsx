"use client";

import { useUser } from "@stackframe/stack";
import { useEffect, useState } from "react";
export function useIsOnboarded() {
  const user = useUser();
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user) return;

    if (user) {
      const cachedStatus = localStorage.getItem("isOnboarded");

      if (cachedStatus) setIsOnboarded(cachedStatus === "true");

      const onboarded = user.clientMetadata?.onboarded ?? false;
      setIsOnboarded(onboarded);

      localStorage.setItem("isOnboarded", onboarded.toString());
    }
  }, [user]);

  return isOnboarded;
}
