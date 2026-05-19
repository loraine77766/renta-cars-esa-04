import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CarList } from '@/components/CarList';
import { cars } from '@/lib/cars';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Clock, ShieldCheck, ListChecks, Map, CalendarSearch, Car, User, CreditCard, MailCheck, ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  const sortedCars = [...cars].sort((a, b) => a.pricePerDay - b.pricePerDay);
  const cheapestCar = sortedCars[0];
  const corolla = cars.find(c => c.id === 15);
  const otherCar = sortedCars.find(c => c.id !== cheapestCar.id && c.id !== corolla?.id);
  const recommendedCars = [cheapestCar, corolla, otherCar].filter((c): c is NonNullable<typeof c> => c !== undefined);

  const howToSteps = [
    { icon: <CalendarSearch className="h-8 w-8" />, title: "Elige fecha", description: "Selecciona lugar, hora y fecha." },
    { icon: <Car className="h-8 w-8" />, title: "Escoge tu auto", description: "Elige entre nuestra flota." },
    { icon: <User className="h-8 w-8" />, title: "Tus datos", description: "Completa y te confirmamos en 24h." },
    { icon: <CreditCard className="h-8 w-8" />, title: "Pago seguro", description: "Recibes link de pago." },
    { icon: <MailCheck className="h-8 w-8" />, title: "Voucher", description: "Recibes tu factura y Voucher." }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main>
        <section className="hero-habana text-white">
          <div className="container mx-auto px-4 py-20 md:py-28 text-center">
            <div className="inline-block bg-yellow-700/20 px-5 py-2 mb-6 border border-white/20 uppercase tracking-[0.3em] text-xs font-bold">Cuba te espera</div>
            <h1 className="font-headline text-4xl md:text-6xl font-bold mb-4 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              Renta de Autos en Cuba
            </h1>
            <p className="text-lg md:text-xl text-white/75 max-w-2xl mx-auto mb-8 font-light">
              Descubre la isla con la libertad que mereces.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="bg-[hsl(35,30%,92%)] text-[hsl(0,55%,45%)] hover:bg-white font-bold rounded-none px-8 uppercase tracking-wider">
                <Link href="/autos">Ver Autos <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/40 text-white hover:bg-white/10 rounded-none px-8 uppercase tracking-wider">
                <Link href="#como-funciona">¿Cómo funciona?</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="como-funciona" className="py-20 bg-[hsl(35,30%,95%)]">
          <div className="container mx-auto px-4">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-2 text-[hsl(0,55%,35%)]" style={{ fontFamily: 'Georgia, serif' }}>¿Cómo reservar?</h2>
            <p className="text-[hsl(175,55%,38%)] text-center text-sm uppercase tracking-widest mb-12">5 pasos sencillos</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
               {howToSteps.map((step, index) => (
                   <div key={index} className="relative text-center group">
                       <div className="mx-auto bg-white vintage-border text-[hsl(0,55%,45%)] h-20 w-20 flex items-center justify-center mb-4 group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
                           <span className="absolute -top-2 -right-2 bg-[hsl(175,55%,38%)] text-white h-7 w-7 flex items-center justify-center font-bold text-sm">{index + 1}</span>
                           {step.icon}
                       </div>
                       <h3 className="font-headline text-base font-semibold text-[hsl(0,55%,35%)] mb-1">{step.title}</h3>
                       <p className="text-sm text-gray-600">{step.description}</p>
                   </div>
               ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-[hsl(35,30%,97%)]">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="font-headline text-3xl md:text-4xl font-bold text-[hsl(0,55%,35%)]" style={{ fontFamily: 'Georgia, serif' }}>Autos Recomendados</h2>
                <p className="text-[hsl(175,55%,38%)] text-sm uppercase tracking-widest mt-2">Para tu viaje perfecto</p>
              </div>
              <Button asChild variant="outline" className="hidden sm:flex border-[hsl(0,55%,45%)]/30 text-[hsl(0,55%,45%)] hover:bg-[hsl(0,55%,45%)] hover:text-white rounded-none uppercase tracking-wider text-xs">
                <Link href="/autos">Ver todos <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
            <CarList cars={recommendedCars} />
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-2 text-[hsl(0,55%,35%)]" style={{ fontFamily: 'Georgia, serif' }}>¿Por qué elegirnos?</h2>
            <p className="text-[hsl(175,55%,38%)] text-sm uppercase tracking-widest text-center mb-12">Nuestra promesa</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: <MessageSquare className="h-10 w-10" />, title: "Siempre contigo", desc: "Te acompañamos antes, durante y después de tu reserva." },
                { icon: <Clock className="h-10 w-10" />, title: "Respuesta rápida", desc: "Confirmación en menos de 24 horas." },
                { icon: <ShieldCheck className="h-10 w-10" />, title: "Apoyo local", desc: "Nuestro equipo en Cuba te respalda." }
              ].map((item, i) => (
                <Card key={i} className="text-center border-0 vintage-border shadow-sm hover:shadow-md transition-all duration-300 bg-[hsl(35,30%,97%)] rounded-none">
                  <CardHeader>
                    <div className="mx-auto bg-white vintage-border text-[hsl(0,55%,45%)] h-20 w-20 flex items-center justify-center mb-2">
                      {item.icon}
                    </div>
                    <CardTitle className="font-headline text-xl text-[hsl(0,55%,35%)]" style={{ fontFamily: 'Georgia, serif' }}>{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-gray-600">{item.desc}</CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-[hsl(35,30%,95%)]">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="shadow-sm border-0 vintage-border rounded-none bg-[hsl(35,30%,97%)]">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl text-[hsl(0,55%,35%)] flex items-center gap-2" style={{ fontFamily: 'Georgia, serif' }}>
                    <ListChecks className="h-6 w-6 text-[hsl(175,55%,38%)]" />
                    Informaciones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex gap-2"><span className="text-[hsl(175,55%,38%)] mt-1">★</span>Edad: 21-80 años.</li>
                    <li className="flex gap-2"><span className="text-[hsl(175,55%,38%)] mt-1">★</span>Licencia vigente (mín. 2 años).</li>
                    <li className="flex gap-2"><span className="text-[hsl(175,55%,38%)] mt-1">★</span>Pasaporte y Voucher impreso.</li>
                    <li className="flex gap-2"><span className="text-[hsl(175,55%,38%)] mt-1">★</span>Combustible, impuestos y seguro pueden estar incluidos.</li>
                    <li className="flex gap-2"><span className="text-[hsl(175,55%,38%)] mt-1">★</span>Cargo extra por devolución diferente.</li>
                    <li className="flex gap-2"><span className="text-[hsl(175,55%,38%)] mt-1">★</span>Seguro obligatorio. Pago con tarjeta.</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-0 vintage-border rounded-none bg-[hsl(35,30%,97%)]">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl text-[hsl(0,55%,35%)] flex items-center gap-2" style={{ fontFamily: 'Georgia, serif' }}>
                    <Map className="h-6 w-6 text-[hsl(175,55%,38%)]" />
                    Descubre Cuba
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-gray-600">
                    {["Malecón de La Habana.", "Mojito en La Bodeguita del Medio.", "Habana Vieja.", "Varadero.", "Trinidad colonial.", "Viñales a caballo.", "Cienfuegos."].map((item, i) => (
                      <li key={i} className="flex gap-2"><Star className="h-4 w-4 text-[hsl(175,55%,38%)] shrink-0 mt-0.5" />{item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="hero-habana py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-block bg-yellow-700/20 px-5 py-2 mb-6 border border-white/20 uppercase tracking-[0.3em] text-xs font-bold">Vive Cuba</div>
            <h2 className="font-headline text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>Tu aventura comienza aquí</h2>
            <p className="text-white/75 mb-8 max-w-lg mx-auto font-light">Reserva hoy y recorre Cuba a tu ritmo</p>
            <Button asChild size="lg" className="bg-[hsl(35,30%,92%)] text-[hsl(0,55%,45%)] hover:bg-white font-bold rounded-none px-10 uppercase tracking-wider">
              <Link href="/autos">Ver Autos <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
