"use client";

import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ExternalLink, Heart, Loader2, RefreshCcw } from "lucide-react";
import {
  getScholarships,
  getSavedScholarships,
  saveScholarship,
  unsaveScholarship,
} from "@/lib/firebase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/global/app-sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AnalyticsCard from "@/components/dashboard/analytics-card";
import { Badge } from "@/components/ui/badge";
import { CommandPalette } from "@/components/global/cmd-search";
import HeaderSearchBar from "@/components/global/cmd-searchbar";
import { greetings } from "@/lib/utils";
import { hasCompletedOnboarding } from "@/services/user-service";

export default function Dashboard() {
  const { user, loading } = useAuthStore();
  const router = useRouter();
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [topMatches, setTopMatches] = useState<any[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [savedScholarships, setSavedScholarships] = useState<string[]>([]);

  useEffect(() => {
    const checkOnboarding = async () => {
      if (user) {
        const onboardingStatus = await hasCompletedOnboarding(`${user.uid}`);
        console.log(onboardingStatus);
        setIsOnboarded(onboardingStatus);
      }
    };

    checkOnboarding();
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/sign-up");
    } else if (isOnboarded === false) {
      router.push("/onboarding");
    } else if (user) {
      getScholarships().then((data) => {
        setScholarships(data);
        fetchMatches(user.uid, data);
      });
    }
  }, [user, loading, router, isOnboarded]);

  useEffect(() => {
    if (user) {
      getSavedScholarships(user.uid).then((saved) => {
        const ids = saved.map((s) => s.id);
        setSavedScholarships(ids);
      });
    }
  }, [user]);

  async function fetchMatches(uid: string, scholarships: any[]) {
    try {
      setLoadingMatches(true);
      const res = await fetch("/api/match-scholarships", {
        method: "POST",
        body: JSON.stringify({ uid }),
      });
      const data = await res.json();

      const matchObjects = data.matches || [];
      const matchTitles = matchObjects.map((match: any) => match.title);

      const matchedScholarships = scholarships.filter((s) =>
        matchTitles.includes(s.title)
      );

      const scholarshipsWithReasons = matchedScholarships.map((s) => {
        const matchInfo = matchObjects.find((m: any) => m.title === s.title);
        return {
          ...s,
          matchReason: matchInfo?.reason || "",
        };
      });

      setTopMatches(scholarshipsWithReasons);
    } catch (error) {
      console.error("Failed to fetch matches:", error);
    } finally {
      setLoadingMatches(false);
    }
  }

  async function refreshMatches() {
    if (!user) return;

    try {
      setLoadingMatches(true);
      const res = await fetch("/api/match-scholarships", {
        method: "POST",
        body: JSON.stringify({ uid: user.uid, refresh: true }),
      });
      const data = await res.json();
      const matchObjects = data.matches || [];
      const matchTitles = matchObjects.map((match: any) => match.title);

      const matchedScholarships = scholarships.filter((s) =>
        matchTitles.includes(s.title)
      );

      const scholarshipsWithReasons = matchedScholarships.map((s) => {
        const matchInfo = matchObjects.find((m: any) => m.title === s.title);
        return {
          ...s,
          matchReason: matchInfo?.reason || "",
        };
      });

      setTopMatches(scholarshipsWithReasons);
    } catch (error) {
      console.error("Failed to refresh matches:", error);
    } finally {
      setLoadingMatches(false);
    }
  }

  const closingSoonScholarships = scholarships
    .filter((s) => {
      const closeDate = new Date(s.deadlines?.scheme_close);
      const today = new Date();
      const diffDays =
        (closeDate.getTime() - today.getTime()) / (1000 * 3600 * 24);
      return diffDays >= 0 && diffDays <= 30;
    })
    .sort((a, b) => {
      const dateA = new Date(a.deadlines?.scheme_close);
      const dateB = new Date(b.deadlines?.scheme_close);
      return dateA.getTime() - dateB.getTime();
    });

  function toggleSave(scholarship: any) {
    if (!user) return;
    if (savedScholarships.includes(scholarship.id)) {
      unsaveScholarship(user.uid, scholarship.id);
      setSavedScholarships((prev) =>
        prev.filter((id) => id !== scholarship.id)
      );
    } else {
      saveScholarship(user.uid, scholarship);
      setSavedScholarships((prev) => [...prev, scholarship.id]);
    }
  }

  if (loading || isOnboarded === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="mt-2">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <CommandPalette scholarships={scholarships} />

      <main className="w-full">
        <div className="flex min-h-screen flex-col p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold font-bricolage">
              {greetings()} {user?.displayName}
            </h1>
            <div className="flex gap-5">
              <HeaderSearchBar />
              <Avatar>
                <AvatarImage
                  src={user?.photoURL || "/default-avatar.png"}
                  alt="User Avatar"
                />
                <AvatarFallback>
                  {user?.displayName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Analytics */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <AnalyticsCard
              dataTitle="Total Scholarships"
              dataVal={`${scholarships.length}`}
            />
            <AnalyticsCard
              dataTitle="Matched Scholarships"
              dataVal={`${topMatches.length}`}
            />
            <AnalyticsCard
              dataTitle="Closing in 30 days"
              dataVal={`${
                scholarships.filter((s) => {
                  const closeDate = new Date(s.deadlines?.scheme_close);
                  const today = new Date();
                  const diffDays =
                    (closeDate.getTime() - today.getTime()) /
                    (1000 * 3600 * 24);
                  return diffDays >= 0 && diffDays <= 30;
                }).length
              }`}
            />
          </div>

          {/* best matches */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Best Matches for You</h2>
              <Button
                onClick={refreshMatches}
                variant="outline"
                size={"icon"}
                className="rounded-full cursor-pointer hover:bg-primary hover:text-white"
                disabled={loadingMatches}
              >
                <RefreshCcw
                  className={`w-4 h-4 ${loadingMatches ? "animate-spin" : ""}`}
                />
              </Button>
            </div>
            {loadingMatches ? (
              <div className="text-center mb-8">
                <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                <p>Finding best matches...</p>
              </div>
            ) : topMatches.length > 0 ? (
              <div className="mb-8">
                <div className="grid gap-4 grid-cols-3">
                  {topMatches.map((s) => (
                    <Card
                      key={s.id}
                      className="border border-neutral-200 shadow-none p-4 rounded-2xl"
                    >
                      <CardContent className="p-0">
                        <div className="flex gap-3 justify-between">
                          <p className="font-semibold line-clamp-2">
                            {s.title}
                          </p>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleSave(s)}
                            className="h-8 w-8 p-1 rounded-full border border-rose-400 hover:bg-rose-100"
                          >
                            {savedScholarships.includes(s.id) ? (
                              <Heart className="w-5 h-5 fill-rose-400 text-rose-400" />
                            ) : (
                              <Heart className="w-5 h-5 text-rose-400" />
                            )}
                          </Button>
                        </div>
                        <span className="text-muted-foreground text-sm line-clamp-1 w-full">
                          {s.department}
                        </span>
                        {/* {s.deadlines?.scheme_close && (
                        <p className="text-sm mt-1">
                          📅 Scheme closes on: {s.deadlines.scheme_close}
                        </p>
                      )} */}

                        <div className="flex gap-2 mt-2 pb-2 border-b">
                          {s.specification && (
                            <Badge className="bg-green-200 text-green-600">
                              <a
                                href={s.specification}
                                target="_blank"
                                className="inline-flex gap-1 items-center"
                              >
                                Specification{" "}
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </Badge>
                          )}
                          {s.faq && (
                            <Badge className="bg-blue-200 text-blue-600">
                              <a
                                href={s.faq}
                                target="_blank"
                                className="inline-flex gap-1 items-center"
                              >
                                FAQs <ExternalLink className="w-3 h-3" />
                              </a>
                            </Badge>
                          )}
                        </div>
                        <div>
                          {s.matchReason && (
                            <p className="text-xs mt-2 font-medium text-muted-foreground">
                              {s.matchReason}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mb-8 text-center text-sm text-muted-foreground">
                No best matches found yet.
              </div>
            )}
          </section>

          {/* closing soon */}
          {closingSoonScholarships.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">
                📅 Closing Soon (Next 30 Days)
              </h2>
              <div className="grid gap-4">
                {closingSoonScholarships.map((s) => (
                  <Card key={s.id} className="border-yellow-400 border-2">
                    <CardHeader>
                      <CardTitle>{s.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {s.department}
                      </p>
                      {s.deadlines?.scheme_close && (
                        <p className="text-sm mt-1 font-semibold text-yellow-700">
                          🕒 Closes on: {s.deadlines.scheme_close}
                        </p>
                      )}
                    </CardHeader>
                    <CardContent className="space-x-4">
                      {s.specification && (
                        <a
                          href={s.specification}
                          target="_blank"
                          className="text-blue-600 underline"
                        >
                          📄 Spec
                        </a>
                      )}
                      {s.faq && (
                        <a
                          href={s.faq}
                          target="_blank"
                          className="text-blue-600 underline"
                        >
                          ❓ FAQ
                        </a>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </SidebarProvider>
  );
}
