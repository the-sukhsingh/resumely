import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

function getCorsHeaders(req: NextRequest) {
  const origin = req.headers.get("origin") || "*";
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
  };
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(request),
  });
}

export async function GET(request: NextRequest) {
  const corsHeaders = getCorsHeaders(request);
  try {
    let email: string | null = null;
    let userId: string | null = null;

    // 1. Try NextAuth session from cookies
    try {
      const session = await auth();
      if (session?.user?.email) {
        email = session.user.email;
      }
    } catch (e) {
      // Session extraction fallback
    }

    // 2. Query param or Authorization header fallback
    const searchParams = request.nextUrl.searchParams;
    if (!email) {
      email = searchParams.get("email");
    }
    if (!userId) {
      userId = searchParams.get("userId");
    }

    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7).trim();
      if (token.includes("@")) {
        email = token;
      } else {
        userId = token;
      }
    }

    // If still no user identifier, return unauthenticated status
    if (!email && !userId) {
      return NextResponse.json(
        {
          authenticated: false,
          message: "No active Resumely session found",
        },
        { headers: corsHeaders }
      );
    }

    // Lookup user in Convex
    let user = null;
    if (email) {
      user = await convex.query(api.users.getUserByEmail, { email });
    }

    if (!user && userId) {
      try {
        const master = await convex.query(api.masterResumes.getMasterResumeByUser, {
          userId: userId as Id<"users">,
        });
        if (master) {
          user = { _id: userId, name: master.personalInfo?.name || "User", email: email || "" };
        }
      } catch (e) {
        // invalid ID format
      }
    }

    if (!user) {
      return NextResponse.json(
        {
          authenticated: false,
          error: "User not found in Resumely database",
        },
        { status: 404, headers: corsHeaders }
      );
    }

    const typedUserId = user._id as Id<"users">;

    // Fetch master resume and all tailored versions in parallel
    const [masterResume, resumeVersions] = await Promise.all([
      convex.query(api.masterResumes.getMasterResumeByUser, { userId: typedUserId }),
      convex.query(api.resumeVersions.getResumeVersionsByUser, { userId: typedUserId }),
    ]);

    return NextResponse.json(
      {
        authenticated: true,
        user: {
          id: user._id,
          email: "email" in user ? user.email : email,
          name: "name" in user ? user.name : "Resumely User",
          picture: "picture" in user ? user.picture : null,
          credits: "credits" in user ? user.credits : 0,
          agentRules: "agentRules" in user ? user.agentRules : [],
        },
        masterResume,
        resumeVersions: resumeVersions || [],
        totalResumes: (masterResume ? 1 : 0) + (resumeVersions?.length || 0),
      },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    console.error("Error in GET /api/extension/session:", error);
    return NextResponse.json(
      { authenticated: false, error: error.message || "Failed to check session" },
      { status: 500, headers: corsHeaders }
    );
  }
}
