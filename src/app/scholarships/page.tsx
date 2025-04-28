"use client";

import { AppSidebar } from "@/components/global/app-sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ExternalLink } from "lucide-react";
import {
  getScholarships,
  saveScholarship,
  unsaveScholarship,
} from "@/lib/firebase";
import { useAuthStore } from "@/store/auth-store";
import { Heart } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function page() {
  const { user, loading } = useAuthStore();
  const [scholarships, setScholarships] = useState<any[]>([]);

  const [savedScholarships, setSavedScholarships] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [closingStatusFilter, setClosingStatusFilter] = useState("all");
  const [showOnlySaved, setShowOnlySaved] = useState(false);

  useEffect(() => {
    getScholarships().then((data) => {
      setScholarships(data);
    });
  }, [user, loading]);

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

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full p-6">
        <div>
          <div className="flex flex-wrap gap-4 mb-6 items-center">
            {/* Search input */}
            <Input
              placeholder="Search scholarships..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-64"
            />

            {/* Department filter */}
            <Select
              value={departmentFilter}
              onValueChange={setDepartmentFilter}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {Array.from(
                  new Set(scholarships.map((s) => s.department).filter(Boolean))
                ).map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Closing status filter */}
            <Select
              value={closingStatusFilter}
              onValueChange={setClosingStatusFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="closing-soon">Closing Soon (30d)</SelectItem>
                <SelectItem value="already-closed">Already Closed</SelectItem>
                <SelectItem value="open">Currently Open</SelectItem>
              </SelectContent>
            </Select>

            {/* Saved scholarships toggle */}
            <div
              // size={"icon"}
              onClick={() => setShowOnlySaved(!showOnlySaved)}
              className={`h-10 w-10 rounded-full items-center flex justify-center ${
                showOnlySaved
                  ? "bg-rose-500 text-white"
                  : "bg-rose-50 text-rose-400"
              }`}
              aria-label={
                showOnlySaved
                  ? "Show all scholarships"
                  : "Show only saved scholarships"
              }
            >
              <Heart className={showOnlySaved ? "fill-white" : ""} />
            </div>
          </div>
        </div>
        <div className="grid gap-4 grid-cols-3">
          {scholarships
            .filter((s) => {
              // Filter by search
              const matchesSearch = s.title
                .toLowerCase()
                .includes(search.toLowerCase());

              // Filter by department
              const matchesDept =
                departmentFilter === "all" || s.department === departmentFilter;

              // Filter by closing status
              const today = new Date();
              const closeDate = new Date(s.deadlines?.scheme_close);
              const diffDays =
                (closeDate.getTime() - today.getTime()) / (1000 * 3600 * 24);

              let matchesClosing = true;
              if (closingStatusFilter === "closing-soon") {
                matchesClosing = diffDays >= 0 && diffDays <= 30;
              } else if (closingStatusFilter === "already-closed") {
                matchesClosing = diffDays < 0;
              } else if (closingStatusFilter === "open") {
                matchesClosing = diffDays > 0;
              }

              // Filter by saved
              const matchesSaved =
                !showOnlySaved || savedScholarships.includes(s.id);

              return (
                matchesSearch && matchesDept && matchesClosing && matchesSaved
              );
            })
            .map((s) => (
              <Card
                key={s.id}
                className="border border-neutral-200 shadow-none p-4 rounded-2xl"
              >
                <CardContent className="p-0">
                  <div className="flex gap-3 justify-between">
                    <p className="font-semibold line-clamp-2">{s.title}</p>
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

                  <div className="flex gap-2 mt-2 pb-2">
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
                </CardContent>
              </Card>
            ))}
        </div>
      </main>
    </SidebarProvider>
  );
}
