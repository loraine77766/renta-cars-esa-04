'use client';

import Link from 'next/link';
import { LifeBuoy, CarFront, HelpCircle, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function Header() {
  const navLinks = [
    { href: "/", label: "Inicio", icon: <CarFront className="h-4 w-4" /> },
    { href: "/autos", label: "Autos", icon: <CarFront className="h-4 w-4" /> },
    { href: "/preguntas-frecuentes", label: "FAQ", icon: <HelpCircle className="h-4 w-4" /> },
    { href: "https://wa.me/15878565382", label: "Soporte", icon: <LifeBuoy className="h-4 w-4" />, target: "_blank" },
  ];

  return (
    <header className="hero-sunset sticky top-0 z-40 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-white hover:text-white/80 transition-colors">
            <div className="bg-white/20 p-1.5 rounded-lg">
              <CarFront className="h-6 w-6" />
            </div>
            <span className="font-headline text-xl font-bold tracking-tight">Renta Cars ESA</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
               <Button variant="ghost" asChild key={link.href} className="text-white/90 hover:text-white hover:bg-white/15 rounded-lg">
                <Link href={link.href} target={link.target} className="flex items-center gap-2">
                    {link.icon}
                    <span>{link.label}</span>
                </Link>
            </Button>
            ))}
          </nav>

          <div className="md:hidden flex items-center gap-1">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-white">
                <nav className="flex flex-col gap-4 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      target={link.target}
                      className="text-lg font-medium flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors"
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}