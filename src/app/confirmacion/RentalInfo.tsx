
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Car } from "@/lib/types";
import { Check, X, Info, Clock } from "lucide-react";

interface RentalInfoProps {
    details: NonNullable<Car['details']>;
}

const InfoSection: React.FC<{ title: string; items: string[], icon: React.ReactNode, iconClass: string }> = ({ title, items, icon, iconClass }) => (
    <div>
        <h4 className="flex items-center font-semibold text-primary mb-2">
            <span className={`mr-2 ${iconClass}`}>{icon}</span>
            {title}
        </h4>
        <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
            {items.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
    </div>
);


export default function RentalInfo({ details }: RentalInfoProps) {
    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="font-headline text-2xl text-primary">Detalles Importantes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <InfoSection 
                    title="Cargos Adicionales" 
                    items={details.additionalCharges} 
                    icon={<Info size={16}/>} 
                    iconClass="text-blue-500"
                />

                <InfoSection 
                    title="Incluido en el Precio" 
                    items={details.included}
                    icon={<Check size={16}/>}
                    iconClass="text-green-500"
                />

                <InfoSection 
                    title="No Incluido en el Precio" 
                    items={details.notIncluded}
                    icon={<X size={16}/>}
                    iconClass="text-red-500"
                />

                <InfoSection 
                    title="Hora de Recogida y Entrega"
                    items={details.pickupAndDropoff}
                    icon={<Clock size={16}/>}
                    iconClass="text-orange-500"
                />

                <InfoSection 
                    title="Informaciones" 
                    items={details.notes}
                    icon={<Info size={16}/>}
                    iconClass="text-gray-500"
                />
            </CardContent>
        </Card>
    )
}
