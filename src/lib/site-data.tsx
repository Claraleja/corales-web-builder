import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

import heroImg from "@/assets/hero-seafood.jpg";
import interiorImg from "@/assets/interior.jpg";
import tableImg from "@/assets/table-setting.jpg";
import steakImg from "@/assets/dish-steak.jpg";
import porkImg from "@/assets/dish-pork.jpg";
import seafoodImg from "@/assets/dish-seafood.jpg";
import souffleImg from "@/assets/dish-souffle.jpg";
import cheesecakeImg from "@/assets/dish-cheesecake.jpg";
import wineImg from "@/assets/dish-wine.jpg";

export type Specialty = {
  id: string;
  img: string;
  title: string;
  desc: string;
  tag: string;
  price?: string;
};

export type Review = { id: string; name: string; text: string };

export type SiteData = {
  hero: {
    badge: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    image: string;
  };
  about: {
    eyebrow: string;
    title: string;
    text: string;
    quote: string;
    image: string;
    stats: { n: string; l: string }[];
  };
  contact: {
    phone: string;        // tel: format e.g. +34967023362
    phoneDisplay: string; // human, e.g. 967 02 33 62
    whatsapp: string;     // digits only, e.g. 34967023362
    whatsappMessage: string;
    address: string;
    city: string;
    country: string;
    lat: number;
    lng: number;
    hours: string[];
  };
  specialties: Specialty[];
  reviews: Review[];
  rating: { value: string; count: string };
  gallery: string[];
  reservationBgImage: string;
};

const DEFAULT: SiteData = {
  hero: {
    badge: "Albacete · Desde 1996",
    titleLine1: "Los Corales",
    titleLine2: "de Caldereros",
    subtitle:
      "Exquisita cocina mediterránea en el corazón de Albacete. Cada plato, una experiencia. Cada visita, un recuerdo.",
    image: heroImg,
  },
  about: {
    eyebrow: "Sobre Nosotros",
    title: "Una tradición de sabor y elegancia",
    text: "En Los Corales de Caldereros llevamos décadas honrando la cocina mediterránea con ingredientes de primera calidad, técnicas refinadas y una hospitalidad que solo se encuentra en los grandes restaurantes. Cada visita es una invitación a disfrutar.",
    quote: "Cocina con alma mediterránea",
    image: interiorImg,
    stats: [
      { n: "4.6★", l: "Rating Google" },
      { n: "1.226", l: "Reseñas" },
      { n: "+25", l: "Años de pasión" },
    ],
  },
  contact: {
    phone: "+34967023362",
    phoneDisplay: "+34 967 02 33 62",
    whatsapp: "34967023362",
    whatsappMessage: "Hola Los Corales, me gustaría hacer una reserva",
    address: "Calle Caldereros, 13",
    city: "02001 Albacete",
    country: "España",
    lat: 38.99406,
    lng: -1.85256,
    hours: [
      "Lunes: 13:30 – 16:30",
      "Mar – Sáb: 13:30 – 16:30  /  20:30 – 00:00",
      "Domingo: cerrado",
    ],
  },
  specialties: [
    { id: "1", img: seafoodImg, title: "Mariscos Frescos", desc: "Selección diaria preparada con técnicas mediterráneas auténticas.", tag: "Frescura diaria" },
    { id: "2", img: steakImg, title: "Carnes Premium", desc: "Cortes selectos cocinados a la perfección, jugosos y sabrosos.", tag: "Cocción perfecta" },
    { id: "3", img: porkImg, title: "Pork Shoulder", desc: "Nuestro plato icónico: confitado, tierno y memorable.", tag: "Plato estrella" },
    { id: "4", img: souffleImg, title: "Soufflé del Chef", desc: "Esponjoso, dorado y elaborado al momento. Una experiencia.", tag: "Postre de autor" },
    { id: "5", img: cheesecakeImg, title: "Cheesecake Gourmet", desc: "Cremoso, equilibrado y con coulis artesano de frutos rojos.", tag: "Favorito de la casa" },
    { id: "6", img: wineImg, title: "Bodega Selecta", desc: "Vinos españoles cuidadosamente escogidos para cada plato.", tag: "Maridaje" },
  ],
  reviews: [
    { id: "r1", name: "María L.", text: "La carne estaba en su punto perfecto y el soufflé fue lo mejor que he probado. Volveré sin dudar." },
    { id: "r2", name: "Javier R.", text: "Atención impecable y mariscos espectaculares. Una experiencia gastronómica de altísimo nivel." },
    { id: "r3", name: "Carmen S.", text: "El Pork Shoulder es de otro planeta. Ambiente acogedor y elegante. Muy recomendable." },
    { id: "r4", name: "Tomás G.", text: "Carta de vinos excelente y un personal que te hace sentir como en casa. Cheesecake espectacular." },
  ],
  rating: { value: "4.6", count: "1.226" },
  gallery: [interiorImg, seafoodImg, steakImg, tableImg, porkImg, souffleImg, cheesecakeImg, wineImg],
  reservationBgImage: tableImg,
};

const STORAGE_KEY = "loscorales:sitedata:v1";

type Ctx = {
  data: SiteData;
  setData: (updater: SiteData | ((prev: SiteData) => SiteData)) => void;
  reset: () => void;
};

const SiteDataContext = createContext<Ctx | null>(null);

function deepMerge<T>(base: T, override: any): T {
  if (Array.isArray(base)) return (override ?? base) as T;
  if (base && typeof base === "object") {
    const out: any = { ...base };
    if (override && typeof override === "object") {
      for (const k of Object.keys(override)) {
        out[k] = deepMerge((base as any)[k], override[k]);
      }
    }
    return out;
  }
  return (override ?? base) as T;
}

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const [data, setDataState] = useState<SiteData>(DEFAULT);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setDataState(deepMerge(DEFAULT, JSON.parse(raw)));
    } catch {}
    setHydrated(true);
  }, []);

  const setData = useCallback((updater: SiteData | ((prev: SiteData) => SiteData)) => {
    setDataState((prev) => {
      const next = typeof updater === "function" ? (updater as (p: SiteData) => SiteData)(prev) : updater;
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    setDataState(DEFAULT);
  }, []);

  return (
    <SiteDataContext.Provider value={{ data, setData, reset }}>
      {hydrated ? children : null}
    </SiteDataContext.Provider>
  );
}

export function useSiteData() {
  const ctx = useContext(SiteDataContext);
  if (!ctx) throw new Error("useSiteData must be used inside SiteDataProvider");
  return ctx;
}

export function buildWhatsAppUrl(whatsapp: string, message: string) {
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
}

export const DEFAULT_SITE_DATA = DEFAULT;
