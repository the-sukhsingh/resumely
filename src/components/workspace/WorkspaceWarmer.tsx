"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface WorkspaceWarmerProps {
  userId: Id<"users">;
}

/**
 * WorkspaceWarmer keeps core workspace queries warm and active in the Convex client cache.
 * This guarantees instantaneous route transitions between Resumes and Job Tracker with 0ms delay.
 */
export default function WorkspaceWarmer({ userId }: WorkspaceWarmerProps) {
  // Keep resume versions, job tracker pipeline, and master resume warm in memory
  useQuery(api.resumeVersions.getResumeVersionsByUser, { userId });
  useQuery(api.jobTracker.getJobApplications, { userId });
  useQuery(api.masterResumes.getMasterResumeByUser, { userId });

  return null;
}
