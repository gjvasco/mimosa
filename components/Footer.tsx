"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Footer() {
  const [year, setYear] = useState(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const rawPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  const phone = rawPhone.replace(/\D/g, "");

  const whatsappUrl = phone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(
      "Hola 👋, me gustaría información sobre sus productos de Mimosa Alelí ✨"
    )}`
    : "#";

  return (
    <footer className="mt-16 border-t border-border bg-brand-soft/60 py-10 sm:py-14 text-foreground">
      <div className="mx-auto max-w-6xl px-4 text-center">
        {/* LOGO ICONO CORTADO EN CORAZÓN */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-brand-light/80 p-1 shadow-sm ring-1 ring-brand/20 transition-transform hover:scale-105">
          <img
            src="/mimosa-aleli-logo.png"
            alt="Mimosa Alelí"
            className="h-[145%] w-[240%] max-w-none object-cover object-left translate-x-[-4%] translate-y-[-1%]"
          />
        </div>

        {/* MARCA Y FRASE ESPECIAL */}
        <h3 className="font-brand mt-3 text-2xl font-bold tracking-wide text-brand sm:text-3xl">
          Mimosa Alelí
        </h3>

        <p className="font-brand mt-2 text-xl sm:text-2xl font-medium italic text-brand-dark/90 tracking-wide">
          “Amor por nosotras mismas”
        </p>

        <p className="mt-1 text-xs font-bold tracking-[0.2em] text-amber uppercase">
          ACCESORIOS · VELAS · ESENCIAS
        </p>

        {/* NAVEGACIÓN Y CONTACTO */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm font-semibold">
          <Link
            href="/productos"
            className="text-foreground/80 transition hover:text-brand hover:underline underline-offset-4"
          >
            Catálogo
          </Link>
          <span className="text-border">•</span>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[#25D366] transition hover:opacity-80"
          >
            <span>💬</span>
            <span>Contactar por WhatsApp</span>
          </a>
        </div>

        {/* COPYRIGHT */}
        <div className="mt-8 border-t border-border/60 pt-6 text-[11px] sm:text-xs text-muted-foreground">
          <p>© {year} Mimosa Alelí. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
