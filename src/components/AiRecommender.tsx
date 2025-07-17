'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Wand2, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { getAiRecommendations } from '@/app/actions';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import type { RecommendCarsOutput } from '@/ai/flows/recommend-cars';
import { cars } from '@/lib/cars';
import { CarCard } from './CarCard';

const formSchema = z.object({
  preferences: z.string().min(1, {
    message: 'Describe qué tipo de auto buscas.',
  }),
});

export default function AiRecommender() {
  const [recommendation, setRecommendation] = useState<RecommendCarsOutput | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      preferences: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setRecommendation(null);
    setError('');
    const result = await getAiRecommendations(values);
    if (result.success) {
      setRecommendation(result.recommendations);
    } else {
      setError(result.error ?? 'Ocurrió un error inesperado.');
    }
    setIsLoading(false);
  }

  const recommendedCars = recommendation?.recommendedCarIds
    .map(id => cars.find(car => car.id === id))
    .filter((car): car is NonNullable<typeof car> => car !== undefined) ?? [];

  return (
    <Card className="max-w-2xl mx-auto mb-12 shadow-lg border-2 border-primary/10">
      <CardHeader className="text-center">
        <div className="flex justify-center items-center gap-2">
            <Wand2 className="h-6 w-6 text-accent" />
            <CardTitle className="font-headline text-2xl text-primary">¿No sabes qué elegir?</CardTitle>
        </div>
        <CardDescription>Usa nuestra IA para encontrar tu auto ideal. Dinos qué necesitas.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="preferences"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Ej: 'económico', 'familiar', 'lujo'" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Buscando...
                </>
              ) : (
                'Obtener recomendación'
              )}
            </Button>
          </form>
        </Form>
        {recommendation && (
            <div className="mt-6 space-y-4">
                <Alert className="border-accent">
                    <Wand2 className="h-4 w-4" />
                    <AlertTitle className="font-headline text-accent">Nuestra recomendación</AlertTitle>
                    <AlertDescription>
                        {recommendation.reasoning}
                    </AlertDescription>
                </Alert>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {recommendedCars.map(car => (
                        <CarCard key={car.id} car={car} />
                    ))}
                </div>
            </div>
        )}
        {error && (
            <Alert variant="destructive" className="mt-4">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    {error}
                </AlertDescription>
            </Alert>
        )}
      </CardContent>
    </Card>
  );
}
