'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const faqs = [
    {
        question: "¿Qué necesito para rentar un auto?",
        answer: "Para rentar un auto necesitas tener entre 21 y 80 años, una licencia de conducción vigente con al menos 2 años de antigüedad, y tu pasaporte."
    },
    {
        question: "¿El seguro está incluido en el precio?",
        answer: "Sí, el pago del seguro es obligatorio y normalmente está incluido en el precio final que se muestra. En algunos casos podría haber cargos adicionales dependiendo de la edad del conductor."
    },
    {
        question: "¿Puedo pagar en efectivo?",
        answer: "No, los pagos en las oficinas de renta son exclusivamente con tarjetas de crédito. No se admite efectivo para el depósito de garantía ni para los cargos adicionales."
    },
    {
        question: "¿Qué pasa si devuelvo el auto en otra ciudad?",
        answer: "Si devuelves el auto en un punto diferente al de recogida, se aplicará un cargo extra por concepto de 'drop-off'. El monto varía según la distancia entre las oficinas."
    },
    {
        question: "¿Puedo elegir un modelo de auto específico?",
        answer: "Las reservas se realizan por categoría de vehículo, no por marca o modelo específico. Te garantizamos un auto de la categoría que elegiste, pero el modelo exacto dependerá de la disponibilidad."
    },
    {
        question: "¿Hay algún cargo extra por ser conductor joven o mayor?",
        answer: "Sí, a los conductores de entre 21 y 24 años, y de 75 a 80 años, se les aplica un incremento del 50% en el costo del seguro diario."
    },
];

export default function FAQ() {
    return (
        <Card className="shadow-lg max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle className="font-headline text-3xl text-primary text-center">Preguntas Frecuentes</CardTitle>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                         <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger className="text-left font-semibold hover:no-underline">{faq.question}</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
    );
}
