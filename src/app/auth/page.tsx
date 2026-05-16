"use client";

import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function AuthPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/resume"); // Redirect to dashboard/resume builder
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50/50">
      <Card className="w-90">
        <CardHeader className="text-center">
          <CardTitle>Welcome to Resumely</CardTitle>
          <CardDescription>Sign in to access your resumes</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="default"
            className="w-full h-12"
            onClick={() => signIn("google")}
          >
            Continue with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}