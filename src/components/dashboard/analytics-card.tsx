import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function AnalyticsCard({
  dataTitle,
  dataVal,
}: {
  dataTitle: string;
  dataVal: string;
}) {
  return (
    <>
      <Card className="rounded-2xl p-3 shadow-none border border-neutral-200 hover:bg-primary group hover:text-white">
        <CardHeader className="p-0 mb-2">
          <CardTitle className="text-base text-muted-foreground group-hover:text-white">
            {dataTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-primary p-0 text-4xl font-bold font-bricolage group-hover:text-white">
          {dataVal}
        </CardContent>
      </Card>
    </>
  );
}
