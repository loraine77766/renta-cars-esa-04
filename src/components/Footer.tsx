export default function Footer() {
  return (
    <footer className="bg-card mt-auto">
      <div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
        <p className="text-sm mb-2">
            RentCubaCar es una Agencia On-Line con asistencia telefónica donde te ayudamos a encontrar y rentar tu Auto en Cuba con los mejores precios del mercado.
        </p>
        <p className="text-xs">&copy; {new Date().getFullYear()} rentacar. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
