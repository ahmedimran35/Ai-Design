
"use server";

import { analyzeDesignImage, AnalyzeDesignImageOutput } from "@/ai/flows/analyze-design-image";
import { suggestDesignImprovements, SuggestDesignImprovementsOutput } from "@/ai/flows/suggest-design-improvements";

interface DesignAnalysisResult {
  flaws: string[];
  suggestions: string[];
  improvements: SuggestDesignImprovementsOutput['improvements'];
}

export async function analyzeUserDesignAction(
  designDataUri: string,
  designDescription: string
): Promise<DesignAnalysisResult | { error: string }> {
  if (!designDataUri) {
    return { error: "Design image data URI is required." };
  }
  if (!designDescription) {
    // Use a default description if not provided, or make it mandatory in the form.
    designDescription = "A user-uploaded design for analysis.";
  }

  try {
    // Step 1: Analyze the design image for flaws and initial suggestions
    const analysisResult: AnalyzeDesignImageOutput = await analyzeDesignImage({
      designImage: designDataUri,
    });

    if (!analysisResult || !analysisResult.flaws) {
      return { error: "Failed to get initial analysis from AI." };
    }

    // Step 2: Get detailed improvement suggestions based on identified flaws
    // Join flaws into a string for the next AI call
    const identifiedFlawsString = analysisResult.flaws.join(", ");
    if (!identifiedFlawsString && analysisResult.suggestions.length > 0) {
        // If no flaws but suggestions exist, use suggestions as input for identifiedFlaws
        const improvementInputFlaws = analysisResult.suggestions.join(", ");
         const improvementSuggestions: SuggestDesignImprovementsOutput = await suggestDesignImprovements({
            designDataUri,
            designDescription,
            identifiedFlaws: improvementInputFlaws,
        });
        return {
            flaws: analysisResult.flaws,
            suggestions: analysisResult.suggestions,
            improvements: improvementSuggestions.improvements || [],
        };
    } else if (!identifiedFlawsString) {
        // No flaws and no suggestions from initial analysis, return empty improvements.
         return {
            flaws: analysisResult.flaws,
            suggestions: analysisResult.suggestions,
            improvements: [],
        };
    }


    const improvementSuggestions: SuggestDesignImprovementsOutput = await suggestDesignImprovements({
      designDataUri,
      designDescription,
      identifiedFlaws: identifiedFlawsString,
    });
    
    return {
      flaws: analysisResult.flaws,
      suggestions: analysisResult.suggestions, // These are from analyzeDesignImage, might be redundant if improvements are comprehensive
      improvements: improvementSuggestions.improvements || [],
    };

  } catch (error) {
    console.error("Error in AI design analysis:", error);
    let errorMessage = "An unexpected error occurred during AI analysis.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { error: errorMessage };
  }
}
