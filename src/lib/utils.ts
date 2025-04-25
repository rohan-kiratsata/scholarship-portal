import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// hardcoded url fixiing
// IMP: change later when data gets updated
export function fixUrl(url?: string): string {
  if (!url) return "";

  // Remove duplicate base domains
  return url.replace(
    /^(https:\/\/scholarships\.gov\.in)+/,
    "https://scholarships.gov.in"
  );
}
