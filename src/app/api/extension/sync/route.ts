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
    const email = searchParams.get("email");
    const userId = searchParams.get("userId");

    let user = null;
    if (email) {
      user = await convex.query(api.users.getUserByEmail, { email });
    }

    if (!user && userId) {
      // If userId is provided as Convex Id
      try {
        const master = await convex.query(api.masterResumes.getMasterResumeByUser, {
          userId: userId as Id<"users">,
        });
        if (master) {
          user = { _id: userId };
        }
      } catch (err) {
        // ignore invalid ID format
      }
    }

    if (!user) {
      return NextResponse.json(
        {
          success: true,
          status: "ready",
          message: "Resumely Extension API is active",
          version: "1.0.0",
        },
        { headers: CORS_HEADERS }
      );
    }

    const typedUserId = user._id as Id<"users">;
    const [masterResume, resumeVersions] = await Promise.all([
      convex.query(api.masterResumes.getMasterResumeByUser, { userId: typedUserId }),
      convex.query(api.resumeVersions.getResumeVersionsByUser, { userId: typedUserId }),
    ]);

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user._id,
          email: "email" in user ? user.email : email,
          name: "name" in user ? user.name : "Resumely User",
          picture: "picture" in user ? user.picture : null,
          credits: "credits" in user ? user.credits : 0,
        },
        masterResume,
        resumeVersions: resumeVersions || [],
      },
      { headers: CORS_HEADERS }
    );
  } catch (error: any) {
    console.error("Error in GET /api/extension/sync:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to sync" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = body.email;
    const userId = body.userId;

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
          user = { _id: userId };
        }
      } catch (e) {
        // ignore
      }
    }

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found. Please log in to Resumely or verify your email.",
        },
        { status: 404, headers: CORS_HEADERS }
      );
    }

    const typedUserId = user._id as Id<"users">;
    const [masterResume, resumeVersions] = await Promise.all([
      convex.query(api.masterResumes.getMasterResumeByUser, { userId: typedUserId }),
      convex.query(api.resumeVersions.getResumeVersionsByUser, { userId: typedUserId }),
    ]);

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user._id,
          email: "email" in user ? user.email : email,
          name: "name" in user ? user.name : "Resumely User",
          picture: "picture" in user ? user.picture : null,
          credits: "credits" in user ? user.credits : 0,
        },
        masterResume,
        resumeVersions: resumeVersions || [],
      },
      { headers: CORS_HEADERS }
    );
  } catch (error: any) {
    console.error("Error in POST /api/extension/sync:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to sync" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
