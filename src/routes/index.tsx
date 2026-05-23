import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, MapPin, Phone, Star, MessageCircle, Wine, Utensils, ChefHat, Sparkles, Award, Settings } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { FloatingCTA } from "@/components/FloatingCTA";
import { ReservationForm } from "@/components/ReservationForm";
import { buildWhatsAppUrl, useSiteData } from "@/lib/site-data";

const TAG_ICONS = [Utensils, ChefHat, Award, Sparkles, Sparkles, Wine];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Los Corales de Caldereros — Cocina Mediterránea Premium en Albacete" },
      { name: "description", content: "Restaurante mediterráneo en el corazón de Albacete. Mariscos frescos, carnes premium y postres gourmet. Reservas: +34 967 02 33 62." },
      { property: "og:title", content: "Los Corales de Caldereros — Albacete" },
      { property: "og:description", content: "Exquisita cocina mediterránea. Mariscos, carnes premium y postres memorables. 4.6★ con 1.226 reseñas." },
      { property: "og:type", content: "restaurant" },
      { property: "og:url", content: "/" },
    ],
    links: [
      { rel: "canonical", href: "/" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" },
    ],
  }),
  component: Index,
});

function Index() {
  const { data } = useSiteData();
  const { hero, about, contact, specialties, reviews, rating, gallery, reservationBgImage } = data;

  const PHONE = `tel:${contact.phone}`;
  const WHATSAPP_URL = buildWhatsAppUrl(contact.whatsapp, contact.whatsappMessage);
  const mapsQuery = encodeURIComponent(`${about.title}, ${contact.address}, ${contact.city}`);
  const mapsEmbed = `https://www.google.com/maps?q=${encodeURIComponent(`${contact.address}, ${contact.city}`)}&output=embed`;

  return (
    <div id="top" className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <FloatingCTA />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Restaurant",
            name: `${hero.titleLine1} ${hero.titleLine2}`,
            servesCuisine: "Mediterranean",
            priceRange: "$$$",
            telephone: contact.phone,
            address: {
              "@type": "PostalAddress",
              streetAddress: contact.address,
              addressLocality: contact.city,
              addressCountry: contact.country,
            },
            geo: { "@type": "GeoCoordinates", latitude: contact.lat, longitude: contact.lng },
            aggregateRating: { "@type": "AggregateRating", ratingValue: rating.value, reviewCount: rating.count },
          }),
        }}
      />

      {/* HERO */}
      <section className="relative min-h-[100svh] w-full overflow-hidden">
        <img src={hero.image} alt={`${hero.titleLine1} ${hero.titleLine2}`} className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/85" />
        <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-5xl flex-col items-center justify-center px-5 text-center text-background">
          <div className="animate-fade-up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-black/30 px-4 py-1.5 text-xs uppercase tracking-[0.3em] text-gold backdrop-blur">
              <Sparkles className="size-3.5" /> {hero.badge}
            </div>
            <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl leading-[0.95] text-background">
              {hero.titleLine1} <br />
              <span className="italic text-gold">{hero.titleLine2}</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl text-background/85 font-light whitespace-pre-line">
              {hero.subtitle}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href={PHONE} className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-gold px-8 py-4 text-base font-medium text-gold-foreground shadow-[var(--shadow-gold)] transition-all hover:bg-gold-dark hover:scale-[1.03]">
                <Phone className="size-5" /> Llamar ahora
              </a>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener" className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-background/40 bg-background/10 px-8 py-4 text-base font-medium text-background backdrop-blur transition-all hover:bg-background hover:text-foreground">
                <MessageCircle className="size-5" /> Escribir por WhatsApp
              </a>
            </div>

            <div className="mt-10 flex items-center justify-center gap-2 text-sm text-background/80">
              <div className="flex text-gold">
                {[...Array(5)].map((_, i) => <Star key={i} className="size-4 fill-current" />)}
              </div>
              <span className="font-medium">{rating.value}</span>
              <span className="text-background/60">·</span>
              <span>{rating.count} reseñas</span>
            </div>
          </div>
        </div>
      </section>

      {/* NOSOTROS */}
      <section id="nosotros" className="py-24 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-16 px-5 lg:grid-cols-2 lg:gap-24 lg:px-8 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold-dark mb-4">{about.eyebrow}</p>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-primary leading-tight">
              {about.title}
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
              {about.text}
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {about.stats.map((s) => (
                <div key={s.l} className="rounded-lg border border-border bg-card p-4 text-center">
                  <div className="font-serif text-2xl text-primary">{s.n}</div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img src={about.image} alt="Interior del restaurante" loading="lazy" className="rounded-lg shadow-[var(--shadow-elegant)] w-full h-[480px] object-cover" />
            <div className="absolute -bottom-6 -left-6 hidden sm:block rounded-lg bg-gold p-6 text-gold-foreground shadow-xl max-w-[220px]">
              <p className="font-serif text-xl italic">"{about.quote}"</p>
            </div>
          </div>
        </div>
      </section>

      {/* ESPECIALIDADES */}
      <section id="especialidades" className="bg-primary py-24 lg:py-32 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs uppercase tracking-[0.3em] text-gold mb-4">Carta</p>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl">Especialidades de la casa</h2>
            <p className="mt-5 text-primary-foreground/75 text-lg">
              Platos pensados para emocionar. Productos seleccionados, manos expertas, sabor inolvidable.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {specialties.map((s, idx) => {
              const Icon = TAG_ICONS[idx % TAG_ICONS.length];
              return (
                <article key={s.id} className="group relative overflow-hidden rounded-xl bg-card text-card-foreground shadow-lg transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-gold)]">
                  <div className="relative h-64 overflow-hidden">
                    <img src={s.img} alt={s.title} loading="lazy" className="size-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    {s.tag && (
                      <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-gold px-3 py-1 text-xs font-medium text-gold-foreground">
                        <Icon className="size-3.5" /> {s.tag}
                      </div>
                    )}
                    {s.price && (
                      <div className="absolute bottom-4 right-4 rounded-full bg-background/95 px-3 py-1 text-sm font-semibold text-primary">
                        {s.price}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-2xl text-primary">{s.title}</h3>
                    <p className="mt-2 text-muted-foreground leading-relaxed">{s.desc}</p>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-14 text-center">
            <a href={PHONE} className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-4 font-medium text-gold-foreground transition-all hover:bg-gold-dark hover:scale-[1.03]">
              <Phone className="size-5" /> Consultar carta completa
            </a>
          </div>
        </div>
      </section>

      {/* GALERÍA */}
      <section id="galeria" className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs uppercase tracking-[0.3em] text-gold-dark mb-4">Galería</p>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-primary">Para abrir el apetito</h2>
          </div>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3">
            {gallery.map((src, i) => (
              <div key={i} className={`relative overflow-hidden rounded-lg group ${i === 0 || i === 5 ? "md:row-span-2 md:h-[520px]" : "h-[250px]"}`}>
                <img src={src} alt={`Galería ${i + 1}`} loading="lazy" className="size-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-primary/0 transition group-hover:bg-primary/20" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RESEÑAS */}
      <section id="resenas" className="bg-secondary py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs uppercase tracking-[0.3em] text-gold-dark mb-4">Testimonios</p>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-primary">Lo que dicen nuestros clientes</h2>
            <div className="mt-6 inline-flex items-center gap-3 rounded-full bg-card border border-border px-5 py-2.5 shadow-sm">
              <div className="flex text-gold">
                {[...Array(5)].map((_, i) => <Star key={i} className="size-4 fill-current" />)}
              </div>
              <span className="font-serif text-xl text-primary">{rating.value}</span>
              <span className="text-sm text-muted-foreground">· {rating.count} reseñas</span>
            </div>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {reviews.map((r) => (
              <blockquote key={r.id} className="rounded-xl bg-card border border-border p-7 shadow-sm">
                <div className="flex text-gold mb-3">
                  {[...Array(5)].map((_, i) => <Star key={i} className="size-4 fill-current" />)}
                </div>
                <p className="font-serif text-xl text-foreground italic leading-snug">"{r.text}"</p>
                <footer className="mt-4 text-sm text-muted-foreground">— {r.name}</footer>
              </blockquote>
            ))}
          </div>

          <div className="mt-12 text-center">
            <a href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-full border-2 border-primary px-7 py-3 font-medium text-primary transition hover:bg-primary hover:text-primary-foreground">
              Ver todas las reseñas en Google
            </a>
          </div>
        </div>
      </section>

      {/* INFO + MAPA */}
      <section id="info" className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold-dark mb-4">Información</p>
            <h2 className="font-serif text-4xl sm:text-5xl text-primary">Visítanos</h2>

            <div className="mt-8 space-y-5">
              {[
                { icon: MapPin, title: "Dirección", lines: [contact.address, `${contact.city}, ${contact.country}`] },
                { icon: Clock, title: "Horarios", lines: contact.hours },
                { icon: Phone, title: "Reservas", lines: [contact.phoneDisplay] },
                { icon: Award, title: "Experiencia", lines: ["Cocina mediterránea premium · Carta de vinos selecta"] },
              ].map((b) => (
                <div key={b.title} className="flex gap-4 rounded-lg bg-card border border-border p-5">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold-dark">
                    <b.icon className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-primary">{b.title}</h3>
                    {b.lines.map((l, i) => <p key={i} className="text-sm text-muted-foreground">{l}</p>)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl overflow-hidden border border-border shadow-[var(--shadow-elegant)] min-h-[480px]">
            <iframe
              title="Ubicación"
              src={mapsEmbed}
              className="w-full h-full min-h-[480px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* RESERVA */}
      <section id="reserva" className="relative py-24 lg:py-32 overflow-hidden">
        <img src={reservationBgImage} alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-primary/92" />
        <div className="relative mx-auto max-w-3xl px-5 lg:px-8 text-primary-foreground">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-gold mb-4">Reserva tu mesa</p>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl">Hagamos de tu visita algo especial</h2>
            <p className="mt-5 text-primary-foreground/75 text-lg">
              Confirma tu reserva al instante por WhatsApp o llámanos directamente.
            </p>
          </div>

          <div className="mt-10 rounded-2xl bg-card text-card-foreground p-6 sm:p-10 shadow-2xl">
            <ReservationForm />
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 pt-6 border-t border-border">
              <span className="text-sm text-muted-foreground">¿Prefieres hablar?</span>
              <a href={PHONE} className="inline-flex items-center gap-2 font-medium text-primary hover:text-gold-dark">
                <Phone className="size-4" /> {contact.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-primary text-primary-foreground py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 grid gap-10 md:grid-cols-3">
          <div>
            <h3 className="font-serif text-3xl">{hero.titleLine1} <span className="text-gold italic">{hero.titleLine2}</span></h3>
            <p className="mt-3 text-sm text-primary-foreground/70 max-w-xs">
              Cocina mediterránea premium en Albacete. Una experiencia para repetir.
            </p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.3em] text-gold mb-4">Visítanos</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>{contact.address} · {contact.city}</li>
              {contact.hours.map((h, i) => <li key={i}>{h}</li>)}
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.3em] text-gold mb-4">Contacto directo</h4>
            <div className="flex flex-col gap-3">
              <a href={PHONE} className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-medium text-gold-foreground hover:bg-gold-dark transition">
                <Phone className="size-4" /> Llamar {contact.phoneDisplay}
              </a>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener" className="inline-flex items-center justify-center gap-2 rounded-full border border-primary-foreground/30 px-5 py-3 text-sm font-medium hover:bg-primary-foreground hover:text-primary transition">
                <MessageCircle className="size-4" /> WhatsApp
              </a>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-5 lg:px-8 mt-12 pt-6 border-t border-primary-foreground/15 text-xs text-primary-foreground/60 flex flex-col sm:flex-row justify-between gap-3">
          <span>© {new Date().getFullYear()} {hero.titleLine1} {hero.titleLine2}. Todos los derechos reservados.</span>
          <Link to="/admin" className="inline-flex items-center gap-1.5 text-primary-foreground/40 hover:text-gold transition" aria-label="Panel de administración">
            <Settings className="size-3.5" /> Admin
          </Link>
        </div>
      </footer>
    </div>
  );
}
