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
    <div className="group bg-[hsl(35,30%,97%)] dark:bg-gray-800 overflow-hidden hover:shadow-lg transition-all duration-300 vintage-border">
      <div className="relative h-52 w-full overflow-hidden">
        <Image
          src={car.imageUrl}
          alt={car.name}
          data-ai-hint={car.imageHint}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500 sepia-[20%] group-hover:sepia-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(0,55%,30%)]/70 to-transparent" />
        <div className="absolute top-3 left-3">
          <span className="text-xs font-bold text-white bg-[hsl(0,55%,45%)] px-3 py-1 uppercase tracking-widest">Disponible</span>
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
          <h3 className="font-headline text-xl font-bold text-white drop-shadow-lg" style={{ fontFamily: 'Georgia, serif' }}>{car.name}</h3>
          <div className="flex items-baseline gap-1 bg-[hsl(35,30%,92%)]/90 px-3 py-1 border-2 border-[hsl(0,55%,45%)]">
            {car.originalPricePerDay && (
              <span className="text-xs text-gray-500 line-through">${car.originalPricePerDay}</span>
            )}
            <span className="font-headline text-lg font-bold text-[hsl(0,55%,45%)]" style={{ fontFamily: 'Georgia, serif' }}>${car.pricePerDay}</span>
            <span className="text-xs text-gray-500">/día</span>
          </div>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{car.description}</p>
        <div className="flex flex-wrap gap-1.5">
            {car.features.slice(0, 4).map((feature) => (
                <Badge key={feature} className="text-xs font-normal bg-[hsl(35,20%,85%)] text-[hsl(0,55%,35%)] hover:bg-[hsl(35,20%,80%)] rounded-none border-0">{feature}</Badge>
            ))}
            {car.features.length > 4 && (
                <Badge variant="outline" className="text-xs rounded-none">+{car.features.length - 4}</Badge>
            )}
        </div>
        <Button asChild className="w-full bg-[hsl(0,55%,45%)] hover:bg-[hsl(0,55%,50%)] text-white rounded-none uppercase tracking-wider text-sm">
            <Link href={`/reserva?carId=${car.id}`}>
                Rentar Ahora
            </Link>
        </Button>
      </div>
    </div>
  );
}
