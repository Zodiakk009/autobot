'use server';
/**
 * @fileOverview An AI agent that extracts service record information from a photo and creates a new service record.
 *
 * - createServiceRecordFromPhoto - A function that handles the service record creation process from a photo.
 * - CreateServiceRecordFromPhotoInput - The input type for the createServiceRecordFromPhoto function.
 * - CreateServiceRecordFromPhotoOutput - The return type for the createServiceRecordFromPhoto function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CreateServiceRecordFromPhotoInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a service record, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  carId: z.number().describe('The ID of the car the service record belongs to.'),
});
export type CreateServiceRecordFromPhotoInput = z.infer<typeof CreateServiceRecordFromPhotoInputSchema>;

const CreateServiceRecordFromPhotoOutputSchema = z.object({
  serviceDate: z.string().describe('The date the service was performed.'),
  mileage: z.number().describe('The mileage of the car at the time of service.'),
  serviceType: z.string().describe('The type of service performed.'),
  details: z.string().describe('A description of the service performed.'),
  totalCost: z.number().describe('The total cost of the service.'),
});
export type CreateServiceRecordFromPhotoOutput = z.infer<typeof CreateServiceRecordFromPhotoOutputSchema>;

export async function createServiceRecordFromPhoto(input: CreateServiceRecordFromPhotoInput): Promise<CreateServiceRecordFromPhotoOutput> {
  return createServiceRecordFromPhotoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'createServiceRecordFromPhotoPrompt',
  input: {schema: CreateServiceRecordFromPhotoInputSchema},
  output: {schema: CreateServiceRecordFromPhotoOutputSchema},
  prompt: `You are an expert automotive technician and data entry specialist.\n
You will be provided with a photo of a service record. Your task is to extract the relevant information from the photo and format it into a JSON object.\n
Extract the following information:\n- serviceDate: The date the service was performed.\n- mileage: The mileage of the car at the time of service.\n- serviceType: The type of service performed.\n- details: A description of the service performed.\n- totalCost: The total cost of the service.\n
Ensure that the extracted information is accurate and complete. If any information is missing or unclear, make a best guess based on the available data.  If the service record lists multiple services, extract them all into the details field.\n
Car ID: {{{carId}}}\nPhoto: {{media url=photoDataUri}}\n
Output the data in JSON format:\n{
  "serviceDate": "",
  "mileage": 0,
  "serviceType": "",
  "details": "",
  "totalCost": 0
}
`,
});

const createServiceRecordFromPhotoFlow = ai.defineFlow(
  {
    name: 'createServiceRecordFromPhotoFlow',
    inputSchema: CreateServiceRecordFromPhotoInputSchema,
    outputSchema: CreateServiceRecordFromPhotoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
