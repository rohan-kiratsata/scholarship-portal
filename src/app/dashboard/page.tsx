"use client";

import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ExternalLink, Heart, Loader2 } from "lucide-react";
import { getScholarships } from "@/lib/firebase";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/global/app-sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AnalyticsCard from "@/components/dashboard/analytics-card";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const { user, loading, signOut } = useAuthStore();
  const router = useRouter();

  const [scholarships, setScholarships] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [topMatches, setTopMatches] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [loadingMatches, setLoadingMatches] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/sign-up");
    } else if (user) {
      getScholarships().then((data) => {
        setScholarships(data);
        setFiltered(data);
        fetchMatches(user.uid, data);
      });
    }
  }, [user, loading, router]);

  useEffect(() => {
    const filtered = scholarships.filter((s) => {
      const matchesSearch = s.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesDept =
        departmentFilter === "all" || s.department === departmentFilter;
      return matchesSearch && matchesDept;
    });

    filtered.sort((a, b) => {
      const dateA = a.deadlines?.scheme_close || "";
      const dateB = b.deadlines?.scheme_close || "";
      return dateA < dateB ? 1 : -1;
    });

    setFiltered(filtered);
  }, [search, departmentFilter, scholarships]);

  const departments = Array.from(
    new Set(scholarships.map((s) => s.department).filter(Boolean))
  );

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
      return dateA.getTime() - dateB.getTime(); // nearest date first
    });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />

      <main className="w-full">
        <div className="flex min-h-screen flex-col p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">
              Welcome, {user?.displayName}
            </h1>
            <div>
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

          {/* 🎯 BEST MATCHES SECTION */}
          {loadingMatches ? (
            <div className="text-center mb-8">
              <Loader2 className="h-6 w-6 animate-spin mx-auto" />
              <p>Finding best matches...</p>
            </div>
          ) : topMatches.length > 0 ? (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">
                🎯 Best Matches for You
              </h2>
              <div className="grid gap-4 grid-cols-3">
                {topMatches.map((s) => (
                  <Card
                    key={s.id}
                    className="border border-neutral-200 shadow-none p-4"
                  >
                    <CardContent className="p-0">
                      <div className="flex gap-3 justify-between">
                        <p className="font-semibold line-clamp-2">{s.title}</p>
                        <div className="p-1.5 border border-rose-400 w-fit rounded-full aspect-square h-fit">
                          <Heart className="w-4 h-4 text-rose-400" />
                        </div>
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
                              Specification <ExternalLink className="w-3 h-3" />
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

          {/* 📅 CLOSING SOON SCHOLARSHIPS SECTION */}
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

          {/* 🧹 NORMAL SEARCH + FILTER SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Input
              placeholder="Search by title"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Select
              onValueChange={setDepartmentFilter}
              value={departmentFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 📚 FULL LIST OF FILTERED SCHOLARSHIPS */}
          <div className="grid gap-4">
            {filtered.map((s) => (
              <Card key={s.id}>
                <CardHeader>
                  <CardTitle>{s.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {s.department}
                  </p>
                  {s.deadlines?.scheme_close && (
                    <p className="text-sm mt-1">
                      📅 Scheme closes on: {s.deadlines.scheme_close}
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
      </main>
    </SidebarProvider>
  );
}
