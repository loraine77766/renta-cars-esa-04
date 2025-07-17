'use server';

import { recommendCars, type RecommendCarsInput, type RecommendCarsOutput } from '@/ai/flows/recommend-cars';

export async function getAiRecommendations(input: RecommendCarsInput): Promise<{ success: true, recommendations: RecommendCarsOutput } | { success: false, error: string }> {
  try {
    const result = await recommendCars(input);
    return { success: true, recommendations: result };
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    return { success: false, error: 'No se pudieron obtener las recomendaciones. Inténtalo de nuevo.' };
  }
}
