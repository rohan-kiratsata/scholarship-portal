import { NextResponse } from "next/server";
import { getScholarships } from "@/lib/firebase";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

const ScholarshipSearchSchema = z.object({
  filters: z.object({
    caste: z.string().optional(),
    course: z.string().optional(),
    state: z.string().optional(),
    type: z.string().optional(),
  }),
});

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json(
        { error: "Missing search query" },
        { status: 400 }
      );
    }

    const scholarships = await getScholarships();

    const prompt = `
You are an AI assistant helping users search scholarships.

Available scholarship fields:
- title
- department
- state
- eligibility (caste, gender, income)

User Query: "${query}"

Return a JSON with possible extracted filters like caste, course, state, type.
Example:
{
  "filters": {
    "caste": "General",
    "course": "Engineering",
    "state": "Maharashtra",
    "type": "Internship"
  }
}
If not mentioned, leave the field out.
`;

    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: ScholarshipSearchSchema,
      prompt,
    });

    const filters = object.filters;

    // Now apply filters locally
    const filteredScholarships = scholarships.filter((s: any) => {
      const title = s.title.toLowerCase();
      //   const dept = s.department?.toLowerCase() || "";

      let matches = true;

      if (filters.type) {
        matches = matches && title.includes(filters.type.toLowerCase());
      }
      if (filters.state) {
        matches = matches && title.includes(filters.state.toLowerCase());
      }
      if (filters.course) {
        matches = matches && title.includes(filters.course.toLowerCase());
      }
      if (filters.caste) {
        matches = matches && title.includes(filters.caste.toLowerCase());
      }

      return matches;
    });

    return NextResponse.json({ matches: filteredScholarships });
  } catch (error) {
    console.error("AI search error:", error);
    return NextResponse.json({ error: "AI search failed" }, { status: 500 });
  }
}
