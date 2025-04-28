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

export function greetings(): string {
  const currentHour = new Date().getHours();

  if (currentHour >= 5 && currentHour < 12) {
    return "Good morning!";
  } else if (currentHour >= 12 && currentHour < 17) {
    return "Good afternoon!";
  } else if (currentHour >= 17 && currentHour < 21) {
    return "Good evening!";
  } else if (currentHour >= 21 || currentHour < 5) {
    return "Happy late night!";
  } else {
    return "Welcome!";
  }
}
