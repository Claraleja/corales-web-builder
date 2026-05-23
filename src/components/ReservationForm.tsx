import { useState, type FormEvent } from "react";
import { MessageCircle } from "lucide-react";

export function ReservationForm() {
  const [form, setForm] = useState({
    name: "",
    contact: "",
    date: "",
    people: "2",
    notes: "",
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = `Hola Los Corales, me gustaría reservar.%0A%0ANombre: ${form.name}%0AContacto: ${form.contact}%0AFecha: ${form.date}%0APersonas: ${form.people}%0ANotas: ${form.notes}`;
    window.open(`https://wa.me/34967023362?text=${text}`, "_blank");
  };

  const field = "w-full rounded-md border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30 transition";

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <input required placeholder="Nombre completo *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={field} />
      <input required placeholder="Teléfono o email *" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} className={field} />
      <input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={field} />
      <select value={form.people} onChange={(e) => setForm({ ...form, people: e.target.value })} className={field}>
        {[1,2,3,4,5,6,7,8,"9+"].map((n) => (
          <option key={n} value={n}>{n} {Number(n) === 1 ? "persona" : "personas"}</option>
        ))}
      </select>
      <textarea placeholder="Notas especiales (alergias, ocasión...)" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={4} className={`${field} sm:col-span-2`} />
      <button type="submit" className="sm:col-span-2 inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-4 font-medium text-gold-foreground transition-all hover:bg-gold-dark hover:shadow-[var(--shadow-gold)]">
        <MessageCircle className="size-5" /> Confirmar reserva por WhatsApp
      </button>
    </form>
  );
}
