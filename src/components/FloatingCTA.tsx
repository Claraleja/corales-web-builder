import { MessageCircle, Phone } from "lucide-react";

export function FloatingCTA() {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3">
      <a
        href="https://wa.me/34967023362?text=Hola%20Los%20Corales%2C%20me%20gustaría%20hacer%20una%20reserva"
        target="_blank"
        rel="noopener"
        aria-label="Escribir a WhatsApp"
        className="animate-pulse-gold inline-flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110"
      >
        <MessageCircle className="size-7" />
      </a>
      <a
        href="tel:+34967023362"
        aria-label="Llamar al restaurante"
        className="inline-flex size-14 items-center justify-center rounded-full bg-gold text-gold-foreground shadow-lg transition-transform hover:scale-110"
      >
        <Phone className="size-6" />
      </a>
    </div>
  );
}
