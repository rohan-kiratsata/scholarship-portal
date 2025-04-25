import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";
import { db } from "@/lib/firebase-admin";
import { fixUrl } from "@/lib/utils";

export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const url = "https://scholarships.gov.in/All-Scholarships";
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);
    const results: any[] = [];

    $(".accordion-item").each((_, accordion) => {
      const department = $(accordion).find(".accordion-button").text().trim();

      $(accordion)
        .find(".row.mb-4.border-1.border-bottom")
        .each((_, card) => {
          const title = $(card).find("h6").text().trim();

          const deadlines: string[] = [];
          $(card)
            .find("span")
            .each((_, span) => {
              deadlines.push($(span).text().trim());
            });

          const specLink = $(card)
            .find("a")
            .filter((_, el) =>
              $(el).text().toLowerCase().includes("specification")
            )
            .attr("href");

          const faqLink = $(card)
            .find("a")
            .filter((_, el) => $(el).text().toLowerCase().includes("faq"))
            .attr("href");

          results.push({
            department,
            title,
            deadlines,
            specification: fixUrl(specLink),
            faq: fixUrl(faqLink),
          });
        });
    });

    for (const scholarship of results) {
      //  yha we are checking for same doc to avoid duplication
      const querySnapshot = await db
        .collection("scholarships")
        .where("title", "==", scholarship.title)
        .where("department", "==", scholarship.department)
        .get();

      if (querySnapshot.empty) {
        await db.collection("scholarships").add(scholarship);
        console.log(`✅ Added: ${scholarship.title}`);
      } else {
        console.log(`⏭️ Skipped (already exists): ${scholarship.title}`);
      }
    }

    return NextResponse.json({ success: true, count: results.length });
  } catch (err) {
    console.error("Scrape error:", err);
    return NextResponse.json({ error: "Scraping failed" }, { status: 500 });
  }
}

// parse dealines relative to current scraped data from NSP.
// find a way to automate this.
function parseDeadlines(deadlines: string[]): Record<string, string> {
  const structured: Record<string, string> = {};

  deadlines.forEach((line) => {
    const lower = line.toLowerCase();
    const dateMatch = line.match(/\d{2}-\d{2}-\d{4}/);

    if (!dateMatch) return;

    const date = dateMatch[0];

    if (lower.includes("scheme closed")) {
      structured.scheme_close = date;
    } else if (lower.includes("defective application")) {
      structured.defective_verification = date;
    } else if (lower.includes("institute verification")) {
      structured.institute_verification = date;
    } else if (
      lower.includes("dno") ||
      lower.includes("sno") ||
      lower.includes("mno")
    ) {
      structured.dno_sno_verification = date;
    }
  });

  return structured;
}
