
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, AlertTriangle, Lightbulb, Palette, AlignHorizontalDistributeCenter, Eye, ThumbsUp } from "lucide-react";
import type { SuggestDesignImprovementsOutput } from "@/ai/flows/suggest-design-improvements"; // Ensure this type is correctly defined and exported

interface AnalysisResult {
  flaws: string[];
  suggestions: string[]; // From initial analysis, might be less detailed
  improvements: SuggestDesignImprovementsOutput['improvements'];
}

interface AnalysisResultsProps {
  results: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
}

const getIconForArea = (area: string) => {
  const lowerArea = area.toLowerCase();
  if (lowerArea.includes("color") || lowerArea.includes("palette")) return <Palette className="h-5 w-5 text-accent" />;
  if (lowerArea.includes("align") || lowerArea.includes("layout")) return <AlignHorizontalDistributeCenter className="h-5 w-5 text-primary" />;
  if (lowerArea.includes("readab") || lowerArea.includes("typograph") || lowerArea.includes("text")) return <Eye className="h-5 w-5 text-accent" />;
  if (lowerArea.includes("hierarch") || lowerArea.includes("visual")) return <Lightbulb className="h-5 w-5 text-primary" />;
  return <Lightbulb className="h-5 w-5 text-muted-foreground" />;
};

export function AnalysisResults({ results, isLoading, error }: AnalysisResultsProps) {
  if (isLoading) {
    return (
      <Card className="mt-8 w-full shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Analyzing Your Design...</CardTitle>
          <CardDescription>Our AI is hard at work. This might take a moment.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-12">
          <div className="flex flex-col items-center gap-4">
             <svg className="animate-spin h-12 w-12 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-muted-foreground">Please wait while we process your image.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mt-8 w-full shadow-lg border-destructive">
        <CardHeader>
          <CardTitle className="text-xl text-destructive flex items-center gap-2">
            <AlertTriangle className="h-6 w-6" />
            Analysis Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive-foreground bg-destructive p-4 rounded-md">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!results) {
    return null; // No analysis initiated yet
  }
  
  const hasContent = results.flaws.length > 0 || results.improvements.length > 0;

  return (
    <Card className="mt-8 w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <CheckCircle className="h-7 w-7 text-primary" /> {/* Updated color */}
          Analysis Complete!
        </CardTitle>
        <CardDescription>Here&apos;s what Design Alchemist found in your design:</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!hasContent ? (
          <div className="text-center py-8">
            <ThumbsUp className="h-12 w-12 text-primary mx-auto mb-4" /> {/* Updated color */}
            <p className="text-xl font-semibold">Great job! No immediate flaws or improvement suggestions found.</p>
            <p className="text-muted-foreground">Your design looks good based on the initial analysis.</p>
          </div>
        ) : (
          <>
            {results.flaws.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                  Identified Flaws ({results.flaws.length})
                </h3>
                <ul className="list-disc list-inside space-y-1 pl-2 bg-destructive/10 p-4 rounded-md">
                  {results.flaws.map((flaw, index) => (
                    <li key={`flaw-${index}`} className="text-destructive-foreground/90">{flaw}</li>
                  ))}
                </ul>
              </div>
            )}

            {results.improvements.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <Lightbulb className="h-6 w-6 text-primary" />
                  Improvement Suggestions ({results.improvements.length})
                </h3>
                <Accordion type="single" collapsible className="w-full">
                  {results.improvements.map((item, index) => (
                    <AccordionItem value={`item-${index}`} key={`improvement-${index}`} className="border-b border-border/70">
                      <AccordionTrigger className="text-left hover:no-underline">
                        <div className="flex items-center gap-3">
                          {getIconForArea(item.area)}
                          <span className="font-medium">{item.area}: {item.suggestion.substring(0, 60)}{item.suggestion.length > 60 ? "..." : ""}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-2 pt-2 pb-4 px-2 bg-primary/5 rounded-b-md">
                        <p><strong>Suggestion:</strong> {item.suggestion}</p>
                        <p className="text-sm text-muted-foreground"><strong>Reasoning:</strong> {item.reasoning}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
