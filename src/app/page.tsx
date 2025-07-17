import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AiRecommender from '@/components/AiRecommender';
import { CarList } from '@/components/CarList';
import { cars } from '@/lib/cars';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <section className="text-center mb-12">
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-2">
            Renta de Autos en Cuba
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-4">
            RentCubaCar es una agencia en línea con asistencia telefónica dedicada a la intermediación, organización y realización de proyectos turísticos, planes e itinerarios y venta de productos turísticos como: alquiler de coches y reservas de hoteles.
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Encuentra el auto perfecto para tu viaje. Fácil, rápido y confiable.
          </p>
        </section>

        <AiRecommender />

        <section id="cars" className="my-12">
          <h2 className="font-headline text-3xl font-bold text-center mb-8 text-primary">Nuestra Flota</h2>
          <CarList cars={cars} />
        </section>
      </main>
      <Footer />
    </div>
  );
}
