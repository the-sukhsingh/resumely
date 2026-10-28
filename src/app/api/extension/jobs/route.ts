import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const email = searchParams.get("email");

    let resolvedUserId = userId;

    if (!resolvedUserId && email) {
      const user = await convex.query(api.users.getUserByEmail, { email });
      if (user) {
        resolvedUserId = user._id;
      }
    }

    if (!resolvedUserId) {
      return NextResponse.json(
        { success: false, error: "userId or email is required" },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const applications = await convex.query(api.jobTracker.getJobApplications, {
      userId: resolvedUserId as Id<"users">,
    });

    return NextResponse.json(
      { success: true, applications },
      { headers: CORS_HEADERS }
    );
  } catch (error: any) {
    console.error("Error in GET /api/extension/jobs:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch jobs" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      email,
      company,
      title,
      stage = "saved",
      jobUrl,
      companyUrl,
      location,
      salary,
      notes,
      description,
      resumeVersionId,
      tags = ["Extension"],
      requirements = [],
      responsibilities = [],
      extractedSkills = [],
      extractedKeywords = [],
    } = body;

    let targetUserId = userId;
    if (!targetUserId && email) {
      const user = await convex.query(api.users.getUserByEmail, { email });
      if (user) {
        targetUserId = user._id;
      }
    }

    if (!targetUserId) {
      return NextResponse.json(
        {
          success: false,
          error: "Valid userId or email is required to save job to Resumely Tracker",
        },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    if (!company || !title) {
      return NextResponse.json(
        {
          success: false,
          error: "Job company and title are required",
        },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    let jobDescriptionId: Id<"jobDescriptions"> | null = null;
    if (description && description.trim().length > 0) {
      try {
        jobDescriptionId = await convex.mutation(api.jobDescriptions.createJobDescription, {
          userId: targetUserId as Id<"users">,
          description: description.trim(),
          requirements: Array.isArray(requirements) ? requirements : [],
          responsibilities: Array.isArray(responsibilities) ? responsibilities : [],
          extractedSkills: Array.isArray(extractedSkills) ? extractedSkills : [],
          extractedKeywords: Array.isArray(extractedKeywords) ? extractedKeywords : [],
        });
      } catch (err) {
        console.warn("Could not create job description record:", err);
      }
    }

    const validStages = ["saved", "applied", "interviewing", "offered", "rejected", "archived"];
    const resolvedStage = validStages.includes(stage) ? stage : "saved";

    const applicationId = await convex.mutation(api.jobTracker.createJobApplication, {
      userId: targetUserId as Id<"users">,
      company: company.trim(),
      title: title.trim(),
      stage: resolvedStage as "saved" | "applied" | "interviewing" | "offered" | "rejected" | "archived",
      jobUrl: jobUrl || null,
      companyUrl: companyUrl || null,
      location: location || null,
      salary: salary || null,
      notes: notes || null,
      description: description || null,
      jobDescriptionId: jobDescriptionId || null,
      resumeVersionId: resumeVersionId ? (resumeVersionId as Id<"resumeVersions">) : null,
      tags: Array.isArray(tags) ? tags : ["Extension"],
    });

    return NextResponse.json(
      {
        success: true,
        applicationId,
        jobDescriptionId,
        message: `Saved "${title} at ${company}" to Resumely Tracker`,
      },
      { status: 201, headers: CORS_HEADERS }
    );
  } catch (error: any) {
    console.error("Error in POST /api/extension/jobs:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save job" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
