// 'use server';
/**
 * @fileOverview Analyzes a design image and provides feedback on potential design flaws and suggestions for improvement.
 *
 * - analyzeDesignImage - A function that analyzes a design image and returns feedback.
 * - AnalyzeDesignImageInput - The input type for the analyzeDesignImage function.
 * - AnalyzeDesignImageOutput - The return type for the analyzeDesignImage function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeDesignImageInputSchema = z.object({
  designImage: z
    .string()
    .describe(
      "A design image to analyze, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeDesignImageInput = z.infer<typeof AnalyzeDesignImageInputSchema>;

const AnalyzeDesignImageOutputSchema = z.object({
  flaws: z
    .array(z.string())
    .describe('A list of potential design flaws identified in the image.'),
  suggestions: z
    .array(z.string())
    .describe('A list of actionable suggestions for improving the design.'),
});
export type AnalyzeDesignImageOutput = z.infer<typeof AnalyzeDesignImageOutputSchema>;

export async function analyzeDesignImage(
  input: AnalyzeDesignImageInput
): Promise<AnalyzeDesignImageOutput> {
  return analyzeDesignImageFlow(input);
}

const analyzeDesignImagePrompt = ai.definePrompt({
  name: 'analyzeDesignImagePrompt',
  input: {schema: AnalyzeDesignImageInputSchema},
  output: {schema: AnalyzeDesignImageOutputSchema},
  prompt: `You are an expert design consultant. Analyze the provided design image and provide feedback on potential design flaws and actionable suggestions for improvement.

  Image: {{media url=designImage}}

  Specifically, identify flaws related to alignment, color palette, readability, and visual hierarchy.
  Then, provide suggestions on how to fix them.
  Return the flaws and suggestions in simple lists.
  `,
});

const analyzeDesignImageFlow = ai.defineFlow(
  {
    name: 'analyzeDesignImageFlow',
    inputSchema: AnalyzeDesignImageInputSchema,
    outputSchema: AnalyzeDesignImageOutputSchema,
  },
  async input => {
    const {output} = await analyzeDesignImagePrompt(input);
    return output!;
  }
);
