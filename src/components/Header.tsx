'use client';

import Link from 'next/link';
import { LifeBuoy, CarFront, HelpCircle, Menu, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function ThemeToggle() {
    const { setTheme } = useTheme()
    return (
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/15">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>Claro</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>Oscuro</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>Sistema</DropdownMenuItem>
        </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default function Header() {
  const navLinks = [
    { href: "/", label: "Inicio", icon: <CarFront className="h-4 w-4" /> },
    { href: "/autos", label: "Autos", icon: <CarFront className="h-4 w-4" /> },
    { href: "/preguntas-frecuentes", label: "FAQ", icon: <HelpCircle className="h-4 w-4" /> },
    { href: "https://wa.me/15878569144", label: "Soporte", icon: <LifeBuoy className="h-4 w-4" />, target: "_blank" },
  ];

  return (
    <header className="hero-habana sticky top-0 z-40 border-b-2 border-yellow-700/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-white hover:text-yellow-200 transition-colors">
            <div className="bg-yellow-700/30 p-1.5 rounded-none">
              <CarFront className="h-6 w-6" />
            </div>
            <span className="font-headline text-xl font-bold tracking-wide">Renta Cars ESA</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
               <Button variant="ghost" asChild key={link.href} className="text-white/85 hover:text-white hover:bg-white/10 rounded-none">
                <Link href={link.href} target={link.target} className="flex items-center gap-2">
                    {link.icon}
                    <span>{link.label}</span>
                </Link>
            </Button>
            ))}
            <div className="w-px h-6 bg-white/20 mx-2" />
            <ThemeToggle />
          </nav>

          <div className="md:hidden flex items-center gap-1">
             <ThemeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-[hsl(35,30%,92%)] text-foreground">
                <nav className="flex flex-col gap-4 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      target={link.target}
                      className="text-lg font-medium flex items-center gap-3 p-3 vintage-border rounded-none hover:bg-primary/5 transition-colors"
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
