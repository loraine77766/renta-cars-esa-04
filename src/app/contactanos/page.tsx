import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { locations } from '@/lib/locations';
import { MapPin, Clock } from 'lucide-react';

export default function ContactanosPage() {
  const locationsByProvince: Record<string, typeof locations> = locations.reduce((acc, loc) => {
    const { province } = loc;
    if (!acc[province]) {
      acc[province] = [];
    }
    acc[province].push(loc);
    return acc;
  }, {} as Record<string, typeof locations>);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <Card className="max-w-6xl mx-auto shadow-lg">
            <CardHeader>
                <CardTitle className="font-headline text-3xl md:text-4xl text-primary text-center">
                    Nuestras Oficinas en Cuba
                </CardTitle>
                <p className="text-center text-muted-foreground pt-2">
                    Estos son nuestros puntos de recogida y entrega oficiales. También podemos coordinar la entrega en otras ubicaciones con un cargo adicional.
                </p>
            </CardHeader>
            <CardContent className="space-y-8">
              {Object.entries(locationsByProvince).map(([province, offices]) => (
                <div key={province}>
                    <h2 className="font-headline text-2xl font-bold text-primary mb-4 border-b pb-2">{province}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {offices.map(office => (
                            <div key={office.id} className="bg-secondary/30 p-4 rounded-lg border">
                                <h3 className="font-semibold text-primary mb-2">{office.name}</h3>
                                <p className="text-sm text-muted-foreground flex items-start gap-2">
                                    <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                                    <span>{office.address}</span>
                                </p>
                                <p className="text-sm text-muted-foreground flex items-center gap-2 mt-2">
                                    <Clock className="h-4 w-4 shrink-0" />
                                    <span>{office.hours}</span>
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
              ))}
            </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
