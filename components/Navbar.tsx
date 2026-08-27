"use client";

import Link from "next/link";
import { Instagram } from "lucide-react";

export default function Navbar() {
  const rawPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  const phone = rawPhone.replace(/\D/g, "");

  const whatsappUrl = phone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(
        "Hola 👋, me gustaría información sobre sus productos de Mimosa Alelí ✨"
      )}`
    : "#";

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md shadow-sm transition-all">
      <div className="mx-auto max-w-6xl px-4">
        <div className="relative flex h-16 sm:h-20 items-center justify-between gap-2">
          {/* LOGO ICONO EN LA IZQUIERDA */}
          <Link
            href="/productos"
            aria-label="Inicio Mimosa Alelí"
            className="flex items-center gap-2.5 shrink-0 group focus:outline-none z-10"
          >
            <div className="relative flex h-11 w-11 sm:h-13 sm:w-13 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-brand-light/70 p-1 shadow-sm ring-1 ring-brand/20 transition-transform group-hover:scale-105">
              <img
                src="/mimosa-aleli-logo.png"
                alt="Logo Mimosa Alelí"
                className="h-[145%] w-[240%] max-w-none object-cover object-left translate-x-[-4%] translate-y-[-1%]"
              />
            </div>
          </Link>

          {/* NOMBRE DE MARCA Y ESLOGAN CENTRADOS EN LA CABECERA */}
          <Link
            href="/productos"
            className="
              absolute
              left-1/2
              -translate-x-1/2
              flex
              flex-col
              items-center
              justify-center
              text-center
              min-w-0
              px-2
              pointer-events-auto
            "
          >
            <h1 className="font-brand truncate text-lg sm:text-2xl md:text-3xl font-bold tracking-wide text-brand leading-none">
              Mimosa Alelí
            </h1>
            <p className="truncate text-[8px] sm:text-[10px] md:text-[11px] font-bold tracking-[0.18em] text-amber uppercase mt-0.5 sm:mt-1">
              ACCESORIOS · VELAS · ESENCIAS
            </p>
          </Link>

          {/* NAVEGACIÓN EN LA DERECHA */}
          <nav className="flex shrink-0 items-center gap-1.5 sm:gap-3 z-10">
            <a
              href="https://instagram.com/mimosa_aleli_"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-bold text-brand transition hover:bg-brand-light sm:px-4 sm:py-2 sm:text-sm"
            >
              <Instagram className="h-4 w-4" />
              <span>@mimosa_aleli_</span>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contactar por WhatsApp"
              className="flex items-center gap-1 sm:gap-1.5 rounded-full bg-[#25D366] px-2.5 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#20bd5a] hover:shadow active:scale-95 sm:px-4 sm:py-2 sm:text-sm"
            >
              <span aria-hidden="true" className="text-sm sm:text-base">
                💬
              </span>
              <span className="hidden xs:inline sm:inline">WhatsApp</span>
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
