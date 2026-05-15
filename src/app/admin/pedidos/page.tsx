'use client';

import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useFirestore, useCollection } from '@/firebase/index';
import { collection, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Loader2, Lock, User, FileText, Smartphone } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function AdminPedidosPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');
  const { toast } = useToast();
  
  const firestore = useFirestore();
  
  const pedidosQuery = useMemo(() => {
    if (!firestore || !isAuthenticated) return null;
    return query(collection(firestore, 'pedidos'), orderBy('createdAt', 'desc'));
  }, [firestore, isAuthenticated]);

  const { data: pedidos, loading, error } = useCollection(pedidosQuery);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Renta2026!') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Contraseña incorrecta.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!firestore) return;
    if (!confirm('¿Seguro que deseas eliminar este pedido permanentemente?')) return;
    setIsDeleting(id);
    try {
      await deleteDoc(doc(firestore, 'pedidos', id));
      toast({ title: "Pedido eliminado correctamente" });
    } catch (e) {
      toast({ variant: "destructive", title: "Error al eliminar" });
    } finally {
      setIsDeleting(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md shadow-xl border-2">
            <CardHeader className="text-center">
              <Lock className="mx-auto h-10 w-10 text-primary mb-4" />
              <CardTitle className="text-2xl font-headline">Panel de Control</CardTitle>
              <p className="text-sm text-muted-foreground">Acceso restringido para administración.</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <Input 
                    type="password" 
                    placeholder="Contraseña Maestra" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="text-center py-6 text-lg"
                />
                {loginError && <p className="text-destructive text-sm text-center font-bold">{loginError}</p>}
                <Button type="submit" className="w-full py-6 text-lg bg-primary">Entrar al Sistema</Button>
              </form>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <h1 className="font-headline text-3xl font-bold text-primary flex items-center gap-2">
            <FileText className="h-8 w-8 text-accent" />
            Registro de Pedidos 2026
          </h1>
          <Button variant="outline" onClick={() => setIsAuthenticated(false)}>Cerrar Sesión</Button>
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-muted-foreground font-semibold">Consultando base de datos en tiempo real...</p>
              </div>
            ) : error ? (
              <div className="p-20 text-center text-destructive font-bold">Error de conexión con la base de datos. Reintenta.</div>
            ) : !pedidos || pedidos.length === 0 ? (
              <div className="p-32 text-center text-muted-foreground">
                <FileText className="mx-auto h-12 w-12 opacity-20 mb-4" />
                No se han registrado pedidos todavía.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-100">
                    <TableRow>
                      <TableHead className="font-bold">ID / Fecha</TableHead>
                      <TableHead className="font-bold">Cliente / Contacto</TableHead>
                      <TableHead className="font-bold">Vehículo / Ruta</TableHead>
                      <TableHead className="font-bold">Pasaporte / Licencia</TableHead>
                      <TableHead className="font-bold">Total</TableHead>
                      <TableHead className="text-right font-bold">Acción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pedidos.map((pedido: any) => (
                      <TableRow key={pedido.id} className="hover:bg-primary/5 transition-colors">
                        <TableCell>
                          <div className="text-[10px] font-mono text-muted-foreground mb-1">#{pedido.id}</div>
                          <div className="text-sm font-semibold">
                            {pedido.createdAt?.seconds ? format(new Date(pedido.createdAt.seconds * 1000), "dd/MM/yy HH:mm") : 'Recién ahora'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 font-bold"><User className="h-3 w-3" /> {pedido.customerName}</div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground"><Smartphone className="h-3 w-3" /> {pedido.customerPhone}</div>
                          <div className="text-[10px] italic">{pedido.customerEmail}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="mb-1 bg-white">{pedido.carName}</Badge>
                          <div className="text-[10px] leading-tight text-muted-foreground">
                            {pedido.pickupLocation} → {pedido.dropoffLocation}
                          </div>
                          <div className="text-[10px] font-bold mt-1">
                            {pedido.startDate ? format(new Date(pedido.startDate), "dd/MM/yy") : '?'} al {pedido.endDate ? format(new Date(pedido.endDate), "dd/MM/yy") : '?'}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs">
                            <div className="font-mono">P: {pedido.customerPassport || 'N/A'}</div>
                            <div className="font-mono">L: {pedido.customerLicense || 'N/A'}</div>
                            <div className="text-[9px] text-primary">{pedido.customerCountry}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-bold text-primary font-mono">${pedido.totalAmount?.toFixed(2)}</div>
                          <Badge variant="secondary" className="text-[9px] h-4">{pedido.paymentOption === 'full_payment' ? 'Total' : 'Depósito'}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="destructive" 
                            size="icon" 
                            onClick={() => handleDelete(pedido.id)} 
                            disabled={isDeleting === pedido.id}
                            className="h-8 w-8"
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
