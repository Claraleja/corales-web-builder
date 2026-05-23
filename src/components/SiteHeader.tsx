import { useEffect, useState } from "react";
import { Menu, Phone, X } from "lucide-react";

const links = [
  { href: "#nosotros", label: "Nosotros" },
  { href: "#especialidades", label: "Especialidades" },
  { href: "#galeria", label: "Galería" },
  { href: "#resenas", label: "Reseñas" },
  { href: "#info", label: "Info" },
  { href: "#reserva", label: "Reservar" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-md shadow-sm border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <a href="#top" className="flex items-center gap-2">
          <span className={`font-serif text-xl lg:text-2xl tracking-tight ${scrolled ? "text-primary" : "text-background"}`}>
            Los Corales
          </span>
          <span className={`hidden sm:inline text-xs uppercase tracking-[0.25em] ${scrolled ? "text-muted-foreground" : "text-background/70"}`}>
            de Caldereros
          </span>
        </a>

        <nav className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`text-sm tracking-wide transition-colors hover:text-gold ${
                scrolled ? "text-foreground" : "text-background/90"
              }`}
            >
              {l.label}
            </a>
          ))}
          <a
            href="tel:+34967023362"
            className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-medium text-gold-foreground transition-all hover:bg-gold-dark hover:shadow-[var(--shadow-gold)]"
          >
            <Phone className="size-4" /> 967 02 33 62
          </a>
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className={`lg:hidden rounded-md p-2 ${scrolled ? "text-foreground" : "text-background"}`}
          aria-label="Menú"
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <nav className="flex flex-col p-5 gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-3 text-foreground hover:text-gold border-b border-border/60"
              >
                {l.label}
              </a>
            ))}
            <a
              href="tel:+34967023362"
              className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 font-medium text-gold-foreground"
            >
              <Phone className="size-4" /> Llamar ahora
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
