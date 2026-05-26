'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Car as CarType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from './ui/badge';

interface CarCardProps {
  car: CarType;
}

export function CarCard({ car }: CarCardProps) {
  return (
    <div className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="relative h-52 w-full overflow-hidden">
        <Image
          src={car.imageUrl}
          alt={car.name}
          data-ai-hint={car.imageHint}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute top-3 left-3">
          <span className="text-xs font-medium text-white bg-primary/90 px-3 py-1 rounded-full">Disponible</span>
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
          <h3 className="font-headline text-xl font-bold text-white drop-shadow-lg">{car.name}</h3>
          <div className="flex items-baseline gap-1 bg-white/90 dark:bg-gray-800/90 px-3 py-1 rounded-lg">
            {car.originalPricePerDay && (
              <span className="text-xs text-gray-500 line-through">${car.originalPricePerDay}</span>
            )}
            <span className="font-headline text-lg font-bold text-accent">${car.pricePerDay}</span>
            <span className="text-xs text-gray-500">/día</span>
          </div>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">{car.description}</p>
        <div className="flex flex-wrap gap-1.5">
            {car.features.map((feature) => (
                <Badge key={feature} variant="secondary" className="text-xs font-normal">{feature}</Badge>
            ))}
        </div>
        <Button asChild className="w-full bg-primary hover:bg-primary/90 rounded-lg">
            <Link href={`/reserva?carId=${car.id}`}>
                Rentar Ahora
            </Link>
        </Button>
      </div>
    </div>
  );
}