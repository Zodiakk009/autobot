'use server';

/**
 * @fileOverview Summarizes a vehicle's service history.
 * This flow is triggered when a user asks the AI assistant to summarize their vehicle's service history.
 *
 * - generateServiceRecordSummary - A function that generates a summary of a vehicle's service history.
 * - GenerateServiceRecordSummaryInput - The input type for the generateServiceRecordSummary function.
 * - GenerateServiceRecordSummaryOutput - The return type for the generateServiceRecordSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateServiceRecordSummaryInputSchema = z.object({
  vehicleName: z.string().describe('The name of the vehicle.'),
  serviceRecords: z
    .string()
    .describe(
      'A stringified JSON array of service records for the vehicle. Each record should include service_date, mileage, service_type, details, and total_cost.'
    ),
});
export type GenerateServiceRecordSummaryInput = z.infer<
  typeof GenerateServiceRecordSummaryInputSchema
>;

const GenerateServiceRecordSummaryOutputSchema = z.object({
  summary: z
    .string()
    .describe('A concise summary of the vehicle service history.'),
});
export type GenerateServiceRecordSummaryOutput = z.infer<
  typeof GenerateServiceRecordSummaryOutputSchema
>;

export async function generateServiceRecordSummary(
  input: GenerateServiceRecordSummaryInput
): Promise<GenerateServiceRecordSummaryOutput> {
  return generateServiceRecordSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateServiceRecordSummaryPrompt',
  input: {schema: GenerateServiceRecordSummaryInputSchema},
  output: {schema: GenerateServiceRecordSummaryOutputSchema},
  prompt: `You are an expert mechanic summarizing vehicle service records.

  Summarize the following service records for the vehicle: {{vehicleName}}.
  The summary should be concise and easy to understand.
  Include key maintenance events and any recurring issues.

  Service Records:
  {{serviceRecords}}`,
});

const generateServiceRecordSummaryFlow = ai.defineFlow(
  {
    name: 'generateServiceRecordSummaryFlow',
    inputSchema: GenerateServiceRecordSummaryInputSchema,
    outputSchema: GenerateServiceRecordSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
