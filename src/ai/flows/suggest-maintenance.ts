'use server';

/**
 * @fileOverview Suggests upcoming maintenance based on a car's mileage and service history.
 *
 * - suggestMaintenance - A function that suggests upcoming maintenance.
 * - SuggestMaintenanceInput - The input type for the suggestMaintenance function.
 * - SuggestMaintenanceOutput - The return type for the suggestMaintenance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestMaintenanceInputSchema = z.object({
  carId: z.number().describe('The ID of the car to suggest maintenance for.'),
  currentMileage: z.number().describe('The current mileage of the car.'),
  serviceHistory: z.string().describe('A summary of the car service history.'),
});
export type SuggestMaintenanceInput = z.infer<typeof SuggestMaintenanceInputSchema>;

const SuggestMaintenanceOutputSchema = z.object({
  suggestedMaintenance: z.string().describe('The suggested upcoming maintenance tasks.'),
});
export type SuggestMaintenanceOutput = z.infer<typeof SuggestMaintenanceOutputSchema>;

export async function suggestMaintenance(input: SuggestMaintenanceInput): Promise<SuggestMaintenanceOutput> {
  return suggestMaintenanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestMaintenancePrompt',
  input: {schema: SuggestMaintenanceInputSchema},
  output: {schema: SuggestMaintenanceOutputSchema},
  prompt: `You are an expert mechanic. Based on the car\'s current mileage of {{{currentMileage}}} and the following service history: {{{serviceHistory}}}, suggest upcoming maintenance tasks for car ID {{{carId}}}.  Consider providing mileage estimates for when each service should be performed.\n\nFor example:\n- Oil change at 10,000 miles\n- Tire rotation at 15,000 miles\n- Brake replacement at 20,000 miles`,
});

const suggestMaintenanceFlow = ai.defineFlow(
  {
    name: 'suggestMaintenanceFlow',
    inputSchema: SuggestMaintenanceInputSchema,
    outputSchema: SuggestMaintenanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
