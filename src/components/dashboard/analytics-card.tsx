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
      <Card className="rounded-2xl p-3 shadow-none border border-neutral-200">
        <CardHeader className="p-0 mb-2">
          <CardTitle className="text-sm text-muted-foreground">
            {dataTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-primary p-0 text-3xl font-bold">
          {dataVal}
        </CardContent>
      </Card>
    </>
  );
}
