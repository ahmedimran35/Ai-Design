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
    .describe('A list of actionable suggestions for improving the design, corresponding to the identified flaws.'),
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
  prompt: `You are an expert design consultant. Analyze the provided design image.

Image: {{media url=designImage}}

Your task is to:
1. Identify potential design flaws. Focus specifically on issues related to:
    - Alignment and Spacing (e.g., inconsistent margins, misaligned elements)
    - Color Palette and Contrast (e.g., poor color combinations, insufficient text/background contrast for accessibility)
    - Typography and Readability (e.g., difficult-to-read fonts, inappropriate font sizes, insufficient line height)
    - Visual Hierarchy and Focal Points (e.g., lack of clear primary focus, confusing element importance)
    - Consistency in design elements (e.g., varied button styles, inconsistent iconography)
    - User Interface (UI) element usability (e.g., unclear calls-to-action, small touch targets, confusing navigation)
2. For each identified flaw, provide a concise description. This will be part of the "flaws" output list.
3. For each identified flaw, also provide an actionable suggestion for how to improve it. This will be part of the "suggestions" output list.

Return your findings as two separate lists:
- \`flaws\`: A list of strings, where each string is a description of an identified flaw.
- \`suggestions\`: A list of strings, where each string is an actionable suggestion corresponding to an identified flaw. Ensure the order of suggestions matches the order of flaws if possible, or clearly link them.

If no significant flaws are found, the "flaws" list can be empty or contain a statement like "No major flaws identified." The "suggestions" list can similarly be empty or offer general enhancement tips if applicable.
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
