
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertTriangle, Lightbulb, Palette, AlignHorizontalDistributeCenter, Eye, ThumbsUp } from "lucide-react";
import type { SuggestDesignImprovementsOutput } from "@/ai/flows/suggest-design-improvements";

interface AnalysisResult {
  flaws: string[];
  suggestions: string[];
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
  if (lowerArea.includes("readab") || lowerArea.includes("typograph") || lowerArea.includes("text") || lowerArea.includes("accessib")) return <Eye className="h-5 w-5 text-accent" />;
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
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
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
          <CheckCircle className="h-7 w-7 text-primary" />
          Analysis Complete!
        </CardTitle>
        <CardDescription>Here&apos;s what Design Alchemist found in your design. Expand sections to see details:</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!hasContent ? (
          <div className="text-center py-8">
            <ThumbsUp className="h-12 w-12 text-primary mx-auto mb-4" />
            <p className="text-xl font-semibold">Great job! No immediate flaws or improvement suggestions found.</p>
            <p className="text-muted-foreground">Your design looks good based on the initial analysis.</p>
          </div>
        ) : (
          <Accordion type="multiple" className="w-full">
            {results.flaws.length > 0 && (
              <AccordionItem value="flaws">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex flex-1 items-center gap-2 text-lg font-semibold">
                    <AlertTriangle className="h-6 w-6 text-destructive" />
                    Identified Flaws ({results.flaws.length})
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-4">
                    {results.flaws.map((flaw, index) => (
                      <Alert variant="destructive" key={`flaw-${index}`}>
                        <AlertTriangle className="h-4 w-4" /> 
                        <AlertTitle className="text-destructive">Flaw #{index + 1}</AlertTitle>
                        <AlertDescription className="text-foreground"> 
                          {flaw}
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {results.improvements.length > 0 && (
              <AccordionItem value="improvements">
                <AccordionTrigger className="hover:no-underline">
                   <div className="flex flex-1 items-center gap-2 text-lg font-semibold text-primary">
                    <Lightbulb className="h-6 w-6" />
                    Improvement Suggestions ({results.improvements.length})
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <div className="space-y-4">
                    {results.improvements.map((item, index) => (
                      <div key={`improvement-${index}`} className="p-4 border border-border/70 rounded-lg shadow-sm bg-card space-y-3">
                        <div className="flex items-center gap-2">
                          {getIconForArea(item.area)}
                          <h4 className="font-semibold text-base text-primary">{item.area}</h4>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-foreground">Suggestion:</p>
                            <p className="text-sm text-foreground/90">{item.suggestion}</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-muted-foreground">Reasoning:</p>
                            <p className="text-xs text-muted-foreground/90">{item.reasoning}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}

