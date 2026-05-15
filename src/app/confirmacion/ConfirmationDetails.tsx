'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { format, differenceInYears, parse } from 'date-fns';
import { es } from 'date-fns/locale';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useFirestore } from '@/firebase/index';

import type { Car, ReservationDetails } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { PartyPopper, Download, Loader2, MessageCircle, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ConfirmationDetailsProps {
  car: Car;
  startDate: Date;
  endDate: Date;
  pickupLocation: string;
  dropoffLocation: string;
  pickupTime: string;
  dropoffTime: string;
  reservationDetails: ReservationDetails;
}

const formSchema = z.object({
  name: z.string().min(2, { message: 'El nombre es requerido.' }),
  lastName1: z.string().min(2, { message: 'El primer apellido es requerido.' }),
  lastName2: z.string().optional(),
  birthDay: z.coerce.number({invalid_type_error: "Día inválido"}).min(1).max(31),
  birthMonth: z.coerce.number({invalid_type_error: "Mes inválido"}).min(1).max(12),
  birthYear: z.coerce.number({invalid_type_error: "Año inválido"}).min(1900),
  phone: z.string().min(5, { message: 'El teléfono es requerido.' }),
  country: z.string().min(2, { message: 'El país es requerido.' }),
  passport: z.string().min(5, { message: 'El número de pasaporte es requerido.' }),
  driversLicense: z.string().min(5, { message: 'El número de licencia es requerido.' }),
  email: z.string().email({ message: 'El correo electrónico no es válido.' }),
  paymentOption: z.enum(['deposit', 'full_payment']),
}).refine(data => {
    try {
        const dateOfBirth = parse(`${data.birthYear}-${data.birthMonth}-${data.birthDay}`, 'yyyy-MM-dd', new Date());
        return !isNaN(dateOfBirth.getTime()) && differenceInYears(new Date(), dateOfBirth) >= 21;
    } catch {
        return false;
    }
}, {
    message: 'Debes tener al menos 21 años para rentar un auto.',
    path: ['birthYear'],
});

export default function ConfirmationDetails({ car, startDate, endDate, pickupLocation, dropoffLocation, pickupTime, dropoffTime, reservationDetails }: ConfirmationDetailsProps) {
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [formattedDates, setFormattedDates] = useState({ start: '', end: '' });
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  
  useEffect(() => {
    try {
      setFormattedDates({
        start: format(startDate, "EEE dd/MM/yyyy", { locale: es }) + " - " + pickupTime,
        end: format(endDate, "EEE dd/MM/yyyy", { locale: es }) + " - " + dropoffTime,
      });
    } catch (e) {
      console.error("Error formatting dates:", e);
    }
  }, [startDate, endDate, pickupTime, dropoffTime]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      lastName1: '',
      lastName2: '',
      phone: '',
      country: '',
      passport: '',
      driversLicense: '',
      email: '',
      paymentOption: 'deposit',
    },
  });
  
  const paymentOption = form.watch('paymentOption');
  const amountToPay = paymentOption === 'full_payment' ? reservationDetails.totalWithDiscount : reservationDetails.deposit;
  const paymentConcept = paymentOption === 'full_payment' ? `Pago Completo (20% Desc.)` : `Depósito de Reserva`;

  const generateOrderId = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Evitamos O, I, 0, 1 para evitar confusiones
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const generateInvoiceMarkdown = (values: z.infer<typeof formSchema>, id: string) => {
    const today = format(new Date(), "dd/MM/yyyy");
    return `
# FACTURA PROFORMA / COMPROBANTE DE VENTA
**Renta Cars ESA**
ID de Factura: ${id}
Fecha: ${today}
Estado: PENDIENTE DE PAGO

## 1. DATOS DEL CLIENTE
Nombre: ${values.name} ${values.lastName1} ${values.lastName2 || ''}
Email: ${values.email}
Teléfono: ${values.phone}
Pasaporte: ${values.passport}
País: ${values.country}

## 2. DETALLES DE LA RENTA
Vehículo: ${car.name}
Días: ${reservationDetails.rentalDays}
Recogida: ${formattedDates.start} (${pickupLocation})
Devolución: ${formattedDates.end} (${dropoffLocation})

## 3. TOTALES
Subtotal Renta: $${reservationDetails.rentPrice.toFixed(2)}
Depósito Garantía: $250.00
---
**TOTAL A PAGAR AHORA:** $${amountToPay.toFixed(2)}
(Opción: ${paymentOption === 'full_payment' ? 'Pago Total con 20% Descuento' : 'Solo Depósito'})

## 4. NOTAS
- Pagar vía WhatsApp (+1 587 912-0936).
- El depósito de $250 es reembolsable.
    `.trim();
  };

  const downloadInvoice = () => {
    if (!orderId) return;
    const values = form.getValues();
    const markdown = generateInvoiceMarkdown(values, orderId);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `factura-${orderId}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleWhatsAppPayment = () => {
    if (!orderId) return;
    const values = form.getValues();
    const message = `
¡Hola! Quiero confirmar mi reserva:
-----------------------------------
ID PEDIDO: ${orderId}
-----------------------------------
Vehículo: ${car.name}
Conductor: ${values.name} ${values.lastName1}
WhatsApp: ${values.phone}
Pasaporte: ${values.passport}
-----------------------------------
Recogida: ${formattedDates.start}
Devolución: ${formattedDates.end}
-----------------------------------
PAGO: $${amountToPay.toFixed(2)} (${paymentConcept})
-----------------------------------
Ya descargué mi factura proforma.
    `.trim();
    window.open(`https://wa.me/15879120936?text=${encodeURIComponent(message)}`, '_blank');
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore) return;
    setIsSubmitting(true);
    try {
      const newId = generateOrderId();
      await setDoc(doc(firestore, 'pedidos', newId), {
        id: newId,
        customerName: `${values.name} ${values.lastName1}`,
        customerEmail: values.email,
        customerPhone: values.phone,
        customerPassport: values.passport,
        customerLicense: values.driversLicense,
        customerCountry: values.country,
        carName: car.name,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        pickupLocation,
        dropoffLocation,
        totalAmount: amountToPay,
        paymentOption: values.paymentOption,
        createdAt: serverTimestamp(),
      });

      setOrderId(newId);
      setIsRegistered(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error: any) {
      console.error("Error saving order:", error);
      toast({ variant: "destructive", title: "Error al registrar pedido" });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isRegistered) {
    return (
      <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in zoom-in duration-500">
        <Card className="shadow-2xl border-2 border-primary/20 overflow-hidden">
          <CardHeader className="bg-primary/5 text-center py-10">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-20 w-20 text-green-500" />
            </div>
            <CardTitle className="font-headline text-3xl text-primary">¡Pedido Registrado con Éxito!</CardTitle>
            <p className="text-muted-foreground mt-2">Tu ID de pedido es: <strong className="text-primary font-mono text-xl">{orderId}</strong></p>
          </CardHeader>
          <CardContent className="p-8 space-y-10">
            
            {/* BLOQUE 1: FACTURA (ARRIBA) */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center font-bold text-xs">1</div>
                <h3 className="font-bold text-primary uppercase text-sm">Descarga tu comprobante</h3>
              </div>
              <Button 
                onClick={downloadInvoice} 
                className="w-full h-16 text-lg gap-3 bg-primary hover:bg-primary/90 shadow-lg"
              >
                <Download className="h-6 w-6" /> Descargar Factura Proforma
              </Button>
              <p className="text-xs text-center text-muted-foreground">Guarda este documento para tus registros.</p>
            </div>

            <Separator />

            {/* BLOQUE 2: WHATSAPP (ABAJO) */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-accent text-white rounded-full h-6 w-6 flex items-center justify-center font-bold text-xs">2</div>
                <h3 className="font-bold text-accent uppercase text-sm">Coordina el pago</h3>
              </div>
              <Button 
                onClick={handleWhatsAppPayment}
                className="w-full h-16 text-lg gap-3 bg-green-600 hover:bg-green-700 shadow-lg"
              >
                <MessageCircle className="h-6 w-6" /> Pagar por WhatsApp
              </Button>
              <p className="text-xs text-center text-muted-foreground">Serás atendido por nuestro equipo de Atención al Cliente.</p>
            </div>
            
            <div className="pt-6">
              <Button variant="ghost" className="w-full text-muted-foreground" onClick={() => router.push('/')}>
                Volver al inicio
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
        <h1 className="font-headline text-3xl md:text-4xl font-bold text-primary mb-4 text-center">Finaliza tu Reserva</h1>
        <p className="text-center text-muted-foreground mb-8">Completa tus datos para registrar el pedido en nuestro sistema 2026.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-8">
                <Card className="shadow-lg border-2 border-primary/5">
                    <CardHeader className="bg-primary/5">
                        <CardTitle className="font-headline text-2xl text-primary">Datos del Conductor</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField control={form.control} name="name" render={({ field }) => (
                                        <FormItem><FormLabel>Nombre *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                    )}/>
                                    <FormField control={form.control} name="lastName1" render={({ field }) => (
                                        <FormItem><FormLabel>1. Apellido *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                    )}/>
                                    <FormField control={form.control} name="lastName2" render={({ field }) => (
                                        <FormItem><FormLabel>2. Apellido</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                    )}/>
                                    <div className="space-y-2">
                                        <FormLabel>Fecha de nacimiento *</FormLabel>
                                        <div className="flex gap-2">
                                            <FormField control={form.control} name="birthDay" render={({ field }) => (
                                                <FormControl><Input placeholder="Día" type="number" {...field} /></FormControl>
                                            )}/>
                                            <FormField control={form.control} name="birthMonth" render={({ field }) => (
                                                <FormControl><Input placeholder="Mes" type="number" {...field} /></FormControl>
                                            )}/>
                                            <FormField control={form.control} name="birthYear" render={({ field }) => (
                                                <FormControl><Input placeholder="Año" type="number" {...field} /></FormControl>
                                            )}/>
                                        </div>
                                    </div>
                                    <FormField control={form.control} name="phone" render={({ field }) => (
                                        <FormItem><FormLabel>WhatsApp/Teléfono *</FormLabel><FormControl><Input placeholder="+1..." {...field} /></FormControl><FormMessage /></FormItem>
                                    )}/>
                                    <FormField control={form.control} name="country" render={({ field }) => (
                                        <FormItem><FormLabel>País de Residencia *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                    )}/>
                                    <FormField control={form.control} name="passport" render={({ field }) => (
                                        <FormItem><FormLabel>Número de Pasaporte *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                    )}/>
                                    <FormField control={form.control} name="driversLicense" render={({ field }) => (
                                        <FormItem><FormLabel>Licencia de Conducir *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                    )}/>
                                    <FormField control={form.control} name="email" render={({ field }) => (
                                        <FormItem className="md:col-span-2"><FormLabel>Correo Electrónico *</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                                    )}/>
                                </div>
                                
                                <Separator />
                                <h3 className="font-headline text-xl text-primary">Forma de Pago</h3>
                                <FormField
                                    control={form.control}
                                    name="paymentOption"
                                    render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormControl>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <label className={`block p-4 border rounded-lg cursor-pointer transition-all ${field.value === 'deposit' ? 'border-primary ring-2 ring-primary bg-primary/5' : 'border-border'}`}>
                                                    <input type="radio" {...field} value="deposit" checked={field.value === 'deposit'} className="sr-only" />
                                                    <h4 className="font-semibold">Solo Depósito ($250)</h4>
                                                    <p className="text-xs text-muted-foreground">Asegura tu auto ahora.</p>
                                                </label>
                                                <label className={`block p-4 border rounded-lg cursor-pointer transition-all ${field.value === 'full_payment' ? 'border-primary ring-2 ring-primary bg-primary/5' : 'border-border'}`}>
                                                    <input type="radio" {...field} value="full_payment" checked={field.value === 'full_payment'} className="sr-only" />
                                                    <h4 className="font-semibold">Pago Total (-20% Dto.)</h4>
                                                    <p className="text-xs text-muted-foreground">Ahorra pagando hoy mismo.</p>
                                                </label>
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                    )}
                                />

                                <div className="bg-secondary/30 p-4 rounded-lg text-center border border-dashed">
                                    <p className="text-sm text-muted-foreground">Total a pagar ahora:</p>
                                    <p className="font-bold text-3xl text-primary font-mono">${amountToPay.toFixed(2)}</p>
                                </div>

                                <Button 
                                  type="submit" 
                                  className="w-full bg-accent hover:bg-accent/90 text-lg py-7 shadow-lg"
                                  disabled={isSubmitting}
                                >
                                    {isSubmitting ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Registrando...</> : '1. Registrar Reserva'}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
            
            <Card className="shadow-lg lg:sticky lg:top-24 border-2 border-primary/5">
                <CardHeader className="bg-primary/5">
                    <CardTitle className="font-headline text-xl text-primary">Resumen</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="relative h-40 w-full">
                       <Image src={car.imageUrl} alt={car.name} fill className="object-cover rounded-lg" />
                    </div>
                    <Table>
                        <TableBody>
                            <TableRow><TableCell className="font-semibold p-2">Vehículo:</TableCell><TableCell className="p-2">{car.name}</TableCell></TableRow>
                            <TableRow><TableCell className="font-semibold p-2">Días:</TableCell><TableCell className="p-2">{reservationDetails.rentalDays}</TableCell></TableRow>
                            <TableRow><TableCell className="font-semibold p-2">Precio/Día:</TableCell><TableCell className="p-2">${car.pricePerDay}</TableCell></TableRow>
                        </TableBody>
                    </Table>
                    <Separator />
                    <div className="flex justify-between items-center text-xl font-bold text-primary">
                        <span>Total:</span>
                        <span className="font-mono">${reservationDetails.totalWithoutDiscount.toFixed(2)}</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
