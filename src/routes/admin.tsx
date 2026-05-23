import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type ChangeEvent } from "react";
import { ArrowLeft, ExternalLink, ImagePlus, LogOut, Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import { useSiteData, type Specialty, type Review, type SiteData } from "@/lib/site-data";

const ADMIN_PASSWORD = "admin123";
const AUTH_KEY = "loscorales:admin:auth";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Panel de Administración — Los Corales" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setAuthed(sessionStorage.getItem(AUTH_KEY) === "1");
    setChecked(true);
  }, []);

  if (!checked) return null;
  if (!authed) return <LoginScreen onSuccess={() => setAuthed(true)} />;
  return <Dashboard onLogout={() => { sessionStorage.removeItem(AUTH_KEY); setAuthed(false); }} />;
}

function LoginScreen({ onSuccess }: { onSuccess: () => void }) {
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd === ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, "1");
      onSuccess();
    } else setError("Contraseña incorrecta");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-5">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-xl">
        <h1 className="font-serif text-3xl text-primary">Panel de Administración</h1>
        <p className="mt-2 text-sm text-muted-foreground">Introduce la contraseña para acceder.</p>
        <input
          type="password"
          autoFocus
          value={pwd}
          onChange={(e) => { setPwd(e.target.value); setError(""); }}
          placeholder="Contraseña"
          className="mt-6 w-full rounded-md border border-border bg-background px-4 py-3 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
        />
        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
        <button type="submit" className="mt-4 w-full rounded-full bg-gold px-6 py-3 font-medium text-gold-foreground hover:bg-gold-dark transition">
          Entrar
        </button>
        <Link to="/" className="mt-4 flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Volver al sitio
        </Link>
        <p className="mt-6 text-xs text-muted-foreground text-center">Contraseña por defecto: <code className="font-mono">admin123</code></p>
      </form>
    </div>
  );
}

const TABS = [
  { id: "hero", label: "Hero / Bienvenida" },
  { id: "about", label: "Nosotros" },
  { id: "contact", label: "Contacto y horarios" },
  { id: "menu", label: "Menú / Especialidades" },
  { id: "reviews", label: "Reseñas" },
  { id: "gallery", label: "Galería" },
] as const;
type TabId = typeof TABS[number]["id"];

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const { data, setData, reset } = useSiteData();
  const [tab, setTab] = useState<TabId>("hero");
  const [saved, setSaved] = useState(false);

  const flashSaved = () => { setSaved(true); setTimeout(() => setSaved(false), 1500); };

  const update = (updater: (d: SiteData) => SiteData) => {
    setData(updater);
    flashSaved();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-5 py-4">
          <div>
            <h1 className="font-serif text-2xl text-primary">Panel de Administración</h1>
            <p className="text-xs text-muted-foreground">Los cambios se guardan automáticamente en este navegador.</p>
          </div>
          <div className="flex items-center gap-2">
            {saved && <span className="hidden sm:inline-flex items-center gap-1.5 text-sm text-gold-dark"><Save className="size-4" /> Guardado</span>}
            <Link to="/" target="_blank" className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm hover:bg-muted">
              <ExternalLink className="size-4" /> Ver sitio
            </Link>
            <button
              onClick={() => { if (confirm("¿Restaurar todos los contenidos al estado original?")) reset(); }}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm hover:bg-muted"
            >
              <RotateCcw className="size-4" /> <span className="hidden sm:inline">Restaurar</span>
            </button>
            <button onClick={onLogout} className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90">
              <LogOut className="size-4" /> <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-5 overflow-x-auto">
          <nav className="flex gap-1 pb-3">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm transition ${tab === t.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10">
        {tab === "hero" && <HeroEditor data={data} update={update} />}
        {tab === "about" && <AboutEditor data={data} update={update} />}
        {tab === "contact" && <ContactEditor data={data} update={update} />}
        {tab === "menu" && <MenuEditor data={data} update={update} />}
        {tab === "reviews" && <ReviewsEditor data={data} update={update} />}
        {tab === "gallery" && <GalleryEditor data={data} update={update} />}
      </main>
    </div>
  );
}

/* ---------- Reusable UI ---------- */

const fieldCls = "w-full rounded-md border border-border bg-background px-4 py-2.5 text-foreground focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-foreground mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-xs text-muted-foreground mt-1">{hint}</span>}
    </label>
  );
}

function Section({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-card p-6 sm:p-8 mb-6">
      <h2 className="font-serif text-2xl text-primary">{title}</h2>
      {desc && <p className="text-sm text-muted-foreground mt-1">{desc}</p>}
      <div className="mt-6 space-y-5">{children}</div>
    </section>
  );
}

function ImagePicker({ value, onChange, label = "Imagen" }: { value: string; onChange: (v: string) => void; label?: string }) {
  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 3 * 1024 * 1024) {
      if (!confirm("La imagen es mayor de 3 MB y puede ocupar mucho espacio local. ¿Continuar?")) return;
    }
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(f);
  };
  return (
    <div>
      <span className="block text-sm font-medium text-foreground mb-1.5">{label}</span>
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div className="w-32 h-32 rounded-lg border border-border bg-muted overflow-hidden shrink-0">
          {value ? <img src={value} alt="" className="size-full object-cover" /> : <div className="size-full flex items-center justify-center text-xs text-muted-foreground">Sin imagen</div>}
        </div>
        <div className="flex-1 w-full space-y-2">
          <label className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90 cursor-pointer">
            <ImagePlus className="size-4" /> Subir imagen
            <input type="file" accept="image/*" className="hidden" onChange={onFile} />
          </label>
          <input
            type="url"
            placeholder="o pega una URL de imagen"
            value={value.startsWith("data:") ? "" : value}
            onChange={(e) => onChange(e.target.value)}
            className={fieldCls}
          />
        </div>
      </div>
    </div>
  );
}

/* ---------- Editors ---------- */

function HeroEditor({ data, update }: { data: SiteData; update: (u: (d: SiteData) => SiteData) => void }) {
  const h = data.hero;
  const set = (patch: Partial<SiteData["hero"]>) => update((d) => ({ ...d, hero: { ...d.hero, ...patch } }));
  return (
    <Section title="Hero / Bienvenida" desc="Texto principal que ve el visitante al entrar.">
      <Field label="Etiqueta superior"><input className={fieldCls} value={h.badge} onChange={(e) => set({ badge: e.target.value })} /></Field>
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Título — línea 1"><input className={fieldCls} value={h.titleLine1} onChange={(e) => set({ titleLine1: e.target.value })} /></Field>
        <Field label="Título — línea 2 (acento dorado)"><input className={fieldCls} value={h.titleLine2} onChange={(e) => set({ titleLine2: e.target.value })} /></Field>
      </div>
      <Field label="Texto de bienvenida"><textarea rows={4} className={fieldCls} value={h.subtitle} onChange={(e) => set({ subtitle: e.target.value })} /></Field>
      <ImagePicker label="Imagen de fondo del Hero" value={h.image} onChange={(v) => set({ image: v })} />

      <div className="grid sm:grid-cols-2 gap-5 pt-4 border-t border-border">
        <Field label="Rating mostrado"><input className={fieldCls} value={data.rating.value} onChange={(e) => update((d) => ({ ...d, rating: { ...d.rating, value: e.target.value } }))} /></Field>
        <Field label="Número de reseñas"><input className={fieldCls} value={data.rating.count} onChange={(e) => update((d) => ({ ...d, rating: { ...d.rating, count: e.target.value } }))} /></Field>
      </div>
    </Section>
  );
}

function AboutEditor({ data, update }: { data: SiteData; update: (u: (d: SiteData) => SiteData) => void }) {
  const a = data.about;
  const set = (patch: Partial<SiteData["about"]>) => update((d) => ({ ...d, about: { ...d.about, ...patch } }));
  return (
    <Section title="Nosotros" desc="Sección 'Sobre Nosotros'.">
      <Field label="Eyebrow"><input className={fieldCls} value={a.eyebrow} onChange={(e) => set({ eyebrow: e.target.value })} /></Field>
      <Field label="Título"><input className={fieldCls} value={a.title} onChange={(e) => set({ title: e.target.value })} /></Field>
      <Field label="Texto"><textarea rows={5} className={fieldCls} value={a.text} onChange={(e) => set({ text: e.target.value })} /></Field>
      <Field label="Frase destacada"><input className={fieldCls} value={a.quote} onChange={(e) => set({ quote: e.target.value })} /></Field>
      <ImagePicker label="Imagen lateral" value={a.image} onChange={(v) => set({ image: v })} />
      <div>
        <span className="block text-sm font-medium text-foreground mb-1.5">Estadísticas (3)</span>
        <div className="grid sm:grid-cols-3 gap-3">
          {a.stats.map((s, i) => (
            <div key={i} className="space-y-2 rounded-lg border border-border p-3">
              <input className={fieldCls} placeholder="Número" value={s.n} onChange={(e) => set({ stats: a.stats.map((x, j) => j === i ? { ...x, n: e.target.value } : x) })} />
              <input className={fieldCls} placeholder="Etiqueta" value={s.l} onChange={(e) => set({ stats: a.stats.map((x, j) => j === i ? { ...x, l: e.target.value } : x) })} />
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

function ContactEditor({ data, update }: { data: SiteData; update: (u: (d: SiteData) => SiteData) => void }) {
  const c = data.contact;
  const set = (patch: Partial<SiteData["contact"]>) => update((d) => ({ ...d, contact: { ...d.contact, ...patch } }));
  return (
    <>
      <Section title="Teléfono y WhatsApp">
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Teléfono (formato internacional)" hint="Se usa en el enlace tel:. Ej. +34967023362">
            <input className={fieldCls} value={c.phone} onChange={(e) => set({ phone: e.target.value })} />
          </Field>
          <Field label="Teléfono visible" hint="Texto que se muestra. Ej. +34 967 02 33 62">
            <input className={fieldCls} value={c.phoneDisplay} onChange={(e) => set({ phoneDisplay: e.target.value })} />
          </Field>
          <Field label="WhatsApp (solo dígitos con prefijo)" hint="Sin '+', sin espacios. Ej. 34967023362">
            <input className={fieldCls} value={c.whatsapp} onChange={(e) => set({ whatsapp: e.target.value.replace(/\D/g, "") })} />
          </Field>
          <Field label="Mensaje WhatsApp por defecto">
            <input className={fieldCls} value={c.whatsappMessage} onChange={(e) => set({ whatsappMessage: e.target.value })} />
          </Field>
        </div>
      </Section>

      <Section title="Dirección y ubicación GPS">
        <div className="grid sm:grid-cols-3 gap-5">
          <Field label="Dirección"><input className={fieldCls} value={c.address} onChange={(e) => set({ address: e.target.value })} /></Field>
          <Field label="Ciudad / CP"><input className={fieldCls} value={c.city} onChange={(e) => set({ city: e.target.value })} /></Field>
          <Field label="País"><input className={fieldCls} value={c.country} onChange={(e) => set({ country: e.target.value })} /></Field>
          <Field label="Latitud"><input type="number" step="0.00001" className={fieldCls} value={c.lat} onChange={(e) => set({ lat: parseFloat(e.target.value) || 0 })} /></Field>
          <Field label="Longitud"><input type="number" step="0.00001" className={fieldCls} value={c.lng} onChange={(e) => set({ lng: parseFloat(e.target.value) || 0 })} /></Field>
        </div>
      </Section>

      <Section title="Horarios" desc="Una línea por horario mostrado en el sitio.">
        <div className="space-y-2">
          {c.hours.map((h, i) => (
            <div key={i} className="flex gap-2">
              <input className={fieldCls} value={h} onChange={(e) => set({ hours: c.hours.map((x, j) => j === i ? e.target.value : x) })} />
              <button onClick={() => set({ hours: c.hours.filter((_, j) => j !== i) })} className="rounded-md border border-border px-3 text-muted-foreground hover:text-destructive hover:border-destructive">
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
          <button onClick={() => set({ hours: [...c.hours, ""] })} className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm hover:bg-muted">
            <Plus className="size-4" /> Añadir horario
          </button>
        </div>
      </Section>
    </>
  );
}

function MenuEditor({ data, update }: { data: SiteData; update: (u: (d: SiteData) => SiteData) => void }) {
  const list = data.specialties;
  const set = (next: Specialty[]) => update((d) => ({ ...d, specialties: next }));
  const patch = (id: string, p: Partial<Specialty>) => set(list.map((x) => x.id === id ? { ...x, ...p } : x));

  const add = () => set([...list, { id: crypto.randomUUID(), title: "Nuevo plato", desc: "Descripción del plato.", tag: "", img: "", price: "" }]);

  return (
    <Section title="Menú / Especialidades" desc="Añade, edita o elimina los platos destacados.">
      <div className="space-y-4">
        {list.map((s, i) => (
          <div key={s.id} className="rounded-lg border border-border p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Plato #{i + 1}</span>
              <div className="flex gap-1">
                <button onClick={() => i > 0 && set([...list.slice(0, i - 1), s, list[i - 1], ...list.slice(i + 1)])} disabled={i === 0} className="rounded px-2 py-1 text-xs border border-border hover:bg-muted disabled:opacity-40">↑</button>
                <button onClick={() => i < list.length - 1 && set([...list.slice(0, i), list[i + 1], s, ...list.slice(i + 2)])} disabled={i === list.length - 1} className="rounded px-2 py-1 text-xs border border-border hover:bg-muted disabled:opacity-40">↓</button>
                <button onClick={() => { if (confirm("¿Eliminar este plato?")) set(list.filter((x) => x.id !== s.id)); }} className="rounded px-2 py-1 text-xs border border-border text-destructive hover:bg-destructive hover:text-destructive-foreground">
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
            <div className="grid lg:grid-cols-2 gap-5">
              <ImagePicker label="Foto del plato" value={s.img} onChange={(v) => patch(s.id, { img: v })} />
              <div className="space-y-4">
                <Field label="Nombre"><input className={fieldCls} value={s.title} onChange={(e) => patch(s.id, { title: e.target.value })} /></Field>
                <Field label="Descripción"><textarea rows={3} className={fieldCls} value={s.desc} onChange={(e) => patch(s.id, { desc: e.target.value })} /></Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Etiqueta"><input className={fieldCls} placeholder="Ej. Plato estrella" value={s.tag} onChange={(e) => patch(s.id, { tag: e.target.value })} /></Field>
                  <Field label="Precio"><input className={fieldCls} placeholder="Ej. 24€" value={s.price || ""} onChange={(e) => patch(s.id, { price: e.target.value })} /></Field>
                </div>
              </div>
            </div>
          </div>
        ))}
        <button onClick={add} className="inline-flex items-center gap-1.5 rounded-full bg-gold px-5 py-2.5 text-sm font-medium text-gold-foreground hover:bg-gold-dark">
          <Plus className="size-4" /> Añadir plato
        </button>
      </div>
    </Section>
  );
}

function ReviewsEditor({ data, update }: { data: SiteData; update: (u: (d: SiteData) => SiteData) => void }) {
  const list = data.reviews;
  const set = (next: Review[]) => update((d) => ({ ...d, reviews: next }));
  const patch = (id: string, p: Partial<Review>) => set(list.map((x) => x.id === id ? { ...x, ...p } : x));

  return (
    <Section title="Reseñas destacadas">
      <div className="space-y-4">
        {list.map((r) => (
          <div key={r.id} className="rounded-lg border border-border p-4 space-y-3">
            <Field label="Nombre"><input className={fieldCls} value={r.name} onChange={(e) => patch(r.id, { name: e.target.value })} /></Field>
            <Field label="Texto"><textarea rows={3} className={fieldCls} value={r.text} onChange={(e) => patch(r.id, { text: e.target.value })} /></Field>
            <button onClick={() => { if (confirm("¿Eliminar reseña?")) set(list.filter((x) => x.id !== r.id)); }} className="inline-flex items-center gap-1.5 text-sm text-destructive hover:underline">
              <Trash2 className="size-4" /> Eliminar
            </button>
          </div>
        ))}
        <button onClick={() => set([...list, { id: crypto.randomUUID(), name: "Cliente", text: "Una experiencia maravillosa." }])} className="inline-flex items-center gap-1.5 rounded-full bg-gold px-5 py-2.5 text-sm font-medium text-gold-foreground hover:bg-gold-dark">
          <Plus className="size-4" /> Añadir reseña
        </button>
      </div>
    </Section>
  );
}

function GalleryEditor({ data, update }: { data: SiteData; update: (u: (d: SiteData) => SiteData) => void }) {
  const list = data.gallery;
  const set = (next: string[]) => update((d) => ({ ...d, gallery: next }));
  return (
    <>
      <Section title="Galería de fotos">
        <div className="grid sm:grid-cols-2 gap-4">
          {list.map((src, i) => (
            <div key={i} className="rounded-lg border border-border p-3">
              <ImagePicker label={`Foto ${i + 1}`} value={src} onChange={(v) => set(list.map((x, j) => j === i ? v : x))} />
              <button onClick={() => { if (confirm("¿Eliminar foto?")) set(list.filter((_, j) => j !== i)); }} className="mt-3 inline-flex items-center gap-1.5 text-sm text-destructive hover:underline">
                <Trash2 className="size-4" /> Eliminar
              </button>
            </div>
          ))}
        </div>
        <button onClick={() => set([...list, ""])} className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-gold px-5 py-2.5 text-sm font-medium text-gold-foreground hover:bg-gold-dark">
          <Plus className="size-4" /> Añadir foto
        </button>
      </Section>
      <Section title="Imagen de fondo — sección Reserva">
        <ImagePicker label="Fondo" value={data.reservationBgImage} onChange={(v) => update((d) => ({ ...d, reservationBgImage: v }))} />
      </Section>
    </>
  );
}
