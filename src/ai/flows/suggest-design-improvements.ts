'use server';
/**
 * @fileOverview AI flow for suggesting design improvements based on identified flaws.
 *
 * - suggestDesignImprovements - A function that takes a design image and provides improvement suggestions.
 * - SuggestDesignImprovementsInput - The input type for the suggestDesignImprovements function.
 * - SuggestDesignImprovementsOutput - The return type for the suggestDesignImprovements function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestDesignImprovementsInputSchema = z.object({
  designDataUri: z
    .string()
    .describe(
      "A design image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  designDescription: z.string().describe('A description of the design and its purpose.'),
  identifiedFlaws: z.string().describe('A list of identified flaws in the design.'),
});
export type SuggestDesignImprovementsInput = z.infer<typeof SuggestDesignImprovementsInputSchema>;

const SuggestDesignImprovementsOutputSchema = z.object({
  improvements: z.array(
    z.object({
      area: z.string().describe('The area of the design the suggestion applies to.'),
      suggestion: z.string().describe('A specific suggestion for improvement.'),
      reasoning: z.string().describe('The reasoning behind the suggestion.'),
    })
  ).describe('A list of specific suggestions for improving the design.'),
});
export type SuggestDesignImprovementsOutput = z.infer<typeof SuggestDesignImprovementsOutputSchema>;

export async function suggestDesignImprovements(
  input: SuggestDesignImprovementsInput
): Promise<SuggestDesignImprovementsOutput> {
  return suggestDesignImprovementsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestDesignImprovementsPrompt',
  input: {schema: SuggestDesignImprovementsInputSchema},
  output: {schema: SuggestDesignImprovementsOutputSchema},
  prompt: `You are an expert design consultant. A user has uploaded a design and received feedback about flaws in that design.
Your job is to provide a list of specific, actionable suggestions for improving the design based on the identified flaws.

Description of the design: {{{designDescription}}}

Identified flaws: {{{identifiedFlaws}}}

Here is the design:
{{media url=designDataUri}}

Provide a list of improvements, including the area the suggestion applies to, the specific suggestion, and the reasoning behind the suggestion.

Ensure your suggestions are clear, concise, and directly address the identified flaws, and are actionable.
`,
});

const suggestDesignImprovementsFlow = ai.defineFlow(
  {
    name: 'suggestDesignImprovementsFlow',
    inputSchema: SuggestDesignImprovementsInputSchema,
    outputSchema: SuggestDesignImprovementsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
