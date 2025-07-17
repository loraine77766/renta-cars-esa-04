'use server';

/**
 * @fileOverview This file defines a Genkit flow for recommending cars based on user preferences.
 *
 * - recommendCars - A function that takes user preferences as input and returns car recommendations.
 * - RecommendCarsInput - The input type for the recommendCars function.
 * - RecommendCarsOutput - The return type for the recommendCars function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { cars } from '@/lib/cars';

const carListForPrompt = cars.map(c => `- ${c.name}: ${c.description} (Características: ${c.features.join(', ')}, Precio: $${c.pricePerDay}/día)`).join('\n');

const RecommendCarsInputSchema = z.object({
  preferences: z
    .string()
    .describe("User's preferences for car recommendations (e.g., 'economic cars', 'family cars')."),
});
export type RecommendCarsInput = z.infer<typeof RecommendCarsInputSchema>;

const RecommendCarsOutputSchema = z.object({
  recommendations: z
    .string()
    .describe('AI-powered car recommendations based on user preferences.'),
});
export type RecommendCarsOutput = z.infer<typeof RecommendCarsOutputSchema>;

export async function recommendCars(input: RecommendCarsInput): Promise<RecommendCarsOutput> {
  return recommendCarsFlow(input);
}

const recommendCarsPrompt = ai.definePrompt({
  name: 'recommendCarsPrompt',
  input: {schema: RecommendCarsInputSchema},
  output: {schema: RecommendCarsOutputSchema},
  prompt: `Eres un experto en recomendar autos de renta en Cuba. Basado en las preferencias del usuario, ofrece recomendaciones de autos de la siguiente lista. Tu recomendación debe ser concisa y mencionar uno o dos modelos específicos de la lista.

Lista de autos disponibles:
${carListForPrompt}

Preferencias del usuario: {{{preferences}}}
`,
});

const recommendCarsFlow = ai.defineFlow(
  {
    name: 'recommendCarsFlow',
    inputSchema: RecommendCarsInputSchema,
    outputSchema: RecommendCarsOutputSchema,
  },
  async input => {
    const {output} = await recommendCarsPrompt(input);
    return output!;
  }
);
