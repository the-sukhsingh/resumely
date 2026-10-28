import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
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

    const typedUserId = resolvedUserId as Id<"users">;
    const [masterResume, versions] = await Promise.all([
      convex.query(api.masterResumes.getMasterResumeByUser, { userId: typedUserId }),
      convex.query(api.resumeVersions.getResumeVersionsByUser, { userId: typedUserId }),
    ]);

    const allResumes = [];
    if (masterResume) {
      allResumes.push({
        ...masterResume,
        isMaster: true,
      });
    }

    if (Array.isArray(versions)) {
      versions.forEach((v) => {
        if (!masterResume || v._id !== masterResume._id) {
          allResumes.push(v);
        }
      });
    }

    return NextResponse.json(
      {
        success: true,
        resumes: allResumes,
        masterResume,
      },
      { headers: CORS_HEADERS }
    );
  } catch (error: any) {
    console.error("Error in GET /api/extension/resumes:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch resumes" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
