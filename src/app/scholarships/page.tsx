"use client";

import { AppSidebar } from "@/components/global/app-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getScholarships } from "@/lib/firebase";
import { useAuthStore } from "@/store/auth-store";
import React, { useEffect, useState } from "react";

export default function page() {
  const { user, loading } = useAuthStore();
  const [scholarships, setScholarships] = useState<any[]>([]);

  useEffect(() => {
    getScholarships().then((data) => {
      setScholarships(data);
    });
  }, [user, loading]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <div className="grid gap-4">
          {scholarships.map((s) => (
            <Card key={s.id}>
              <CardHeader>
                <CardTitle>{s.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{s.department}</p>
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
      </main>
    </SidebarProvider>
  );
}
