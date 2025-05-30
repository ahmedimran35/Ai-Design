
"use client";

import React, { useEffect } from "react"; // Ensure React is imported for useState
import { SignupForm } from "@/components/auth/signup-form";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function SignupPage() {
  const { isAuthenticated, authLoading } = useAuth(); // Use authLoading from context
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace("/dashboard"); // Redirect to dashboard if authenticated and auth is loaded
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading) { // Show loader while Firebase is determining auth state
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // If auth is loaded and user is not authenticated, show signup form
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] py-12 animate-in fade-in duration-500">
        <SignupForm />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    );
  }

  // Fallback, e.g. if redirecting
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p>Redirecting...</p>
    </div>
  );
}
