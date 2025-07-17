import Link from 'next/link';
import { Car, LifeBuoy, CarFront, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="bg-card shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-primary hover:text-opacity-80 transition-colors">
            <Car className="h-7 w-7" />
            <span className="font-headline text-2xl font-bold">rentacar</span>
          </Link>
          <nav className="flex items-center gap-2">
             <Button variant="ghost" asChild>
                <Link href="/" className="flex items-center gap-2">
                    <CarFront className="h-4 w-4" />
                    <span>Inicio</span>
                </Link>
            </Button>
             <Button variant="ghost" asChild>
                <Link href="/autos" className="flex items-center gap-2">
                    <CarFront className="h-4 w-4" />
                    <span>Autos</span>
                </Link>
            </Button>
            <Button variant="ghost" asChild>
                <Link href="/preguntas-frecuentes" className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" />
                    <span>Preguntas Frecuentes</span>
                </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="https://wa.me/18256097251" target="_blank" className="flex items-center gap-2">
                <LifeBuoy className="h-4 w-4" />
                <span>Soporte</span>
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
