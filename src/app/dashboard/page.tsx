"use client";

import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
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
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/global/app-sidebar";

export default function Dashboard() {
  const { user, loading, signOut } = useAuthStore();
  const router = useRouter();

  const [scholarships, setScholarships] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/sign-up");
    } else if (user) {
      getScholarships().then((data) => {
        setScholarships(data);
        setFiltered(data);
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

    // Sort by scheme_close date (latest first)
    filtered.sort((a, b) => {
      const dateA = a.deadlines?.scheme_close || "";
      const dateB = b.deadlines?.scheme_close || "";
      return dateA < dateB ? 1 : -1;
    });

    setFiltered(filtered);
  }, [search, departmentFilter, scholarships]);

  console.log(filtered);

  const departments = Array.from(
    new Set(scholarships.map((s) => s.department).filter(Boolean))
  );

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
      <main className="w-full p-5">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2 items-center">
            <SidebarTrigger />
            <h1 className="text-xl font-bold">Your Scholarships</h1>
          </div>
        </div>

        <div className="">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Input
              className="border border-muted-foreground"
              placeholder="Search by title"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Select
              onValueChange={setDepartmentFilter}
              value={departmentFilter}
            >
              <SelectTrigger className="border border-muted-foreground">
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
