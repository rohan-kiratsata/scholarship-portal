import { NextResponse } from "next/server";
import { getUserProfile } from "@/services/user-service";
import { getScholarships } from "@/lib/firebase";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

const ScholarshipMatchSchema = z.object({
  matches: z.array(
    z.object({
      title: z.string(),
      reason: z.string(),
    })
  ),
});

export async function POST(req: Request) {
  const { uid } = await req.json();

  if (!uid) {
    return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
  }

  try {
    const userProfileRes = await getUserProfile(uid);
    const scholarships = await getScholarships();

    if (!userProfileRes.success) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const prompt = `
You are a scholarship matching assistant.

User Profile:
${JSON.stringify(userProfileRes.data, null, 2)}

Scholarship List:
${JSON.stringify(
  scholarships.map((s: any) => ({
    title: s.title,
    department: s.department,
    deadlines: s.deadlines,
  })),
  null,
  2
)}

Match the most relevant 10 scholarships for the user.
For each match, provide:
- title
- reason why it matches (like: "because your state is Maharashtra and your income is less than 2 lakh").

Return output in this JSON format:
{
  "matches": [
    { "title": "Scholarship A", "reason": "Because your course is engineering and your state is Gujarat." },
    { "title": "Scholarship B", "reason": "Because your annual income matches the eligibility." },
    ...
  ]
}
`;

    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: ScholarshipMatchSchema,
      prompt,
    });

    return NextResponse.json({ matches: object.matches });
  } catch (error) {
    console.error("AI Matching Error:", error);
    return NextResponse.json({ error: "Matching failed" }, { status: 500 });
  }
}
