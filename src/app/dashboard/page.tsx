
"use client";

import React, { useState, useEffect } from "react";
import { ImageUploadForm } from "@/components/dashboard/image-upload-form";
import { AnalysisResults } from "@/components/dashboard/analysis-results";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ShieldAlert } from "lucide-react";
import type { SuggestDesignImprovementsOutput } from "@/ai/flows/suggest-design-improvements";

interface DesignAnalysisResult {
  flaws: string[];
  suggestions: string[];
  improvements: SuggestDesignImprovementsOutput['improvements'];
}

export default function DashboardPage() {
  const [analysisResult, setAnalysisResult] = useState<DesignAnalysisResult | null>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Client-side check for authentication.
    // This effect now runs primarily on mount (and if router identity changes).
    const checkAuth = () => {
      const storedAuth = typeof window !== "undefined" ? localStorage.getItem("isAuthenticated") : null;
      if (storedAuth !== "true") {
        // If localStorage doesn't confirm auth at mount, redirect.
        router.replace("/login?message=unauthorized");
      } else {
        // localStorage is okay. Stop the "Verifying..." state.
        // The page will then rely on `isAuthenticated` from AuthContext for rendering.
        setIsCheckingAuth(false);
      }
    };
    
    if (typeof window !== "undefined") { // Ensure this logic only runs client-side
        checkAuth();
    }
  }, [router]); // Dependency array changed to only include router.

  const handleAnalysisStart = () => {
    setIsLoadingAnalysis(true);
    setAnalysisResult(null);
    setAnalysisError(null);
  };

  const handleAnalysisComplete = (results: DesignAnalysisResult) => {
    setAnalysisResult(results);
    setIsLoadingAnalysis(false);
    setAnalysisError(null);
  };

  const handleAnalysisError = (error: string) => {
    setAnalysisError(error);
    setIsLoadingAnalysis(false);
    setAnalysisResult(null);
  };

  if (isCheckingAuth) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Verifying authentication...</p>
      </div>
    );
  }
  
  // After isCheckingAuth is false, rely on isAuthenticated from AuthContext.
  if (!isAuthenticated) {
    // This block will be shown if AuthContext determines the user is not authenticated
    // (e.g., after isCheckingAuth becomes false but isAuthenticated is still false).
    // The useEffect should have redirected if localStorage was also missing the auth flag.
    // This serves as a fallback UI.
    return (
         <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center">
            <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
            <h1 className="text-2xl font-semibold mb-2">Access Denied</h1>
            <p className="text-muted-foreground">Please log in to access the dashboard.</p>
        </div>
    );
  }

  // If isCheckingAuth is false AND isAuthenticated is true, show dashboard:
  return (
    <div className="space-y-8">
      <Card className="bg-gradient-to-br from-primary/5 via-background to-accent/5 border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tight">Your Design Dashboard</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Ready to refine your masterpiece? Upload your design below and let our AI provide expert feedback.
          </CardDescription>
        </CardHeader>
      </Card>

      <ImageUploadForm
        onAnalysisStart={handleAnalysisStart}
        onAnalysisComplete={handleAnalysisComplete}
        onAnalysisError={handleAnalysisError}
      />

      <AnalysisResults
        results={analysisResult}
        isLoading={isLoadingAnalysis}
        error={analysisError}
      />
    </div>
  );
}
