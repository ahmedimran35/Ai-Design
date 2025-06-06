
"use client";

import React, { useState, useEffect, useRef } from "react";
import { ImageUploadForm } from "@/components/dashboard/image-upload-form";
// import { AnalysisResults } from "@/components/dashboard/analysis-results"; // To be dynamically imported
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldAlert, RefreshCcw } from "lucide-react";
import type { SuggestDesignImprovementsOutput } from "@/ai/flows/suggest-design-improvements";
import dynamic from "next/dynamic";

const AnalysisResults = dynamic(() => import("@/components/dashboard/analysis-results").then(mod => mod.AnalysisResults), {
  loading: () => (
      <div className="flex flex-col items-center justify-center min-h-[200px] text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-muted-foreground">Loading Results Component...</p>
      </div>
  ),
  ssr: false, // AnalysisResults likely uses client-side hooks/state
});


interface DesignAnalysisResult {
  flaws: string[];
  suggestions: string[];
  improvements: SuggestDesignImprovementsOutput['improvements'];
}

export default function DashboardPage() {
  const [analysisResult, setAnalysisResult] = useState<DesignAnalysisResult | null>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  
  const { isAuthenticated, user, authLoading } = useAuth(); // Use authLoading
  const router = useRouter();

  const imageUploadFormRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Redirect if not authenticated once Firebase auth state is determined
    if (!authLoading && !isAuthenticated) {
      router.replace("/login?message=unauthorized");
    }
  }, [isAuthenticated, authLoading, router]);

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

  const handleAnalyzeAnother = () => {
    setAnalysisResult(null);
    setAnalysisError(null);
    imageUploadFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (authLoading) { // Show loader while Firebase auth is initializing
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Verifying authentication...</p>
      </div>
    );
  }
  
  if (!isAuthenticated) { // If auth is loaded and still not authenticated
    return (
         <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center">
            <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
            <h1 className="text-2xl font-semibold mb-2">Access Denied</h1>
            <p className="text-muted-foreground">Please log in to access the dashboard.</p>
        </div>
    );
  }

  // User is authenticated and auth state is loaded
  return (
    <div className="space-y-8">
      <Card className="bg-gradient-to-br from-primary/5 via-background to-accent/5 border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tight">Your Design Dashboard</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Welcome{user?.email ? `, ${user.email}` : ''}! Ready to refine your masterpiece?
          </CardDescription>
        </CardHeader>
      </Card>

      <div ref={imageUploadFormRef} className="scroll-mt-20">
        <ImageUploadForm
          onAnalysisStart={handleAnalysisStart}
          onAnalysisComplete={handleAnalysisComplete}
          onAnalysisError={handleAnalysisError}
        />
      </div>

      {(analysisResult || analysisError) && !isLoadingAnalysis && (
        <div className="mt-8 flex justify-center">
          <Button onClick={handleAnalyzeAnother} size="lg" variant="outline" className="shadow-sm hover:shadow-lg transition-all duration-200 ease-in-out transform hover:-translate-y-0.5">
            <RefreshCcw className="mr-2 h-5 w-5" /> Analyze Another Image
          </Button>
        </div>
      )}

      <AnalysisResults
        results={analysisResult}
        isLoading={isLoadingAnalysis}
        error={analysisError}
      />
    </div>
  );
}
