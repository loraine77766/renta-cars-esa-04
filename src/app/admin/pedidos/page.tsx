'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useFirestore, useCollection } from '@/firebase';
import { collection, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2, Phone, Mail, Calendar, Loader2, ClipboardList } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

export default function AdminPedidosPage() {
  const firestore = useFirestore();
  const pedidosQuery = firestore ? query(collection(firestore, 'pedidos'), orderBy('createdAt', 'desc')) : null;
  const { data: pedidos, loading, error } = useCollection(pedidosQuery);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!firestore) return;
    if (!confirm('¿Estás seguro de que quieres eliminar este pedido?')) return;

    setIsDeleting(id);
    try {
      await deleteDoc(doc(firestore, 'pedidos', id));
      toast({
        title: "Pedido eliminado",
        description: "El registro ha sido borrado correctamente.",
      });
    } catch (e) {
      console.error(e);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar el pedido.",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900/10">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <ClipboardList className="h-8 w-8 text-primary" />
          <h1 className="font-headline text-3xl font-bold text-primary">Registro de Pedidos</h1>
        </div>

        <Card className="shadow-xl border-none">
          <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
            <CardTitle>Historial de Reservas</CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Gestiona todos los pedidos recibidos a través de la plataforma.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground">Cargando pedidos...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center text-destructive">
                Error al cargar los pedidos. Por favor, intenta de nuevo.
              </div>
            ) : pedidos && pedidos.length === 0 ? (
              <div className="p-20 text-center text-muted-foreground">
                No hay pedidos registrados todavía.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-secondary/50">
                      <TableHead className="w-[200px]">Cliente</TableHead>
                      <TableHead>Vehículo</TableHead>
                      <TableHead>Fechas</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Estado Pago</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pedidos?.map((pedido: any) => (
                      <TableRow key={pedido.id} className="hover:bg-secondary/20 transition-colors">
                        <TableCell>
                          <div className="font-bold text-primary">{pedido.customerName}</div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <Phone className="h-3 w-3" /> {pedido.customerPhone}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3" /> {pedido.customerEmail}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-semibold">{pedido.carName}</Badge>
                          <div className="text-[10px] text-muted-foreground mt-1 uppercase font-mono">ID: {pedido.id}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs space-y-1">
                            <div className="flex items-center gap-1">
                              <span className="text-green-600 font-bold">Desde:</span> {pedido.startDate ? format(new Date(pedido.startDate), "dd MMM yyyy", { locale: es }) : 'N/A'}
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-red-600 font-bold">Hasta:</span> {pedido.endDate ? format(new Date(pedido.endDate), "dd MMM yyyy", { locale: es }) : 'N/A'}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-mono font-bold text-lg text-primary">${pedido.totalAmount?.toFixed(2)}</div>
                        </TableCell>
                        <TableCell>
                          <Badge className={pedido.paymentOption === 'full_payment' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'} variant="secondary">
                            {pedido.paymentOption === 'full_payment' ? 'Pago Completo' : 'Solo Depósito'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="destructive" 
                            size="icon" 
                            onClick={() => handleDelete(pedido.id)}
                            disabled={isDeleting === pedido.id}
                          >
                            {isDeleting === pedido.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}