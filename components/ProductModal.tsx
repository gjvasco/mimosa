"use client";

import { useEffect } from "react";
import { siteUrl } from "@/lib/utils";

type Product = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  available: boolean;
  featured: boolean;
  image_url?: string | null;
  categories?: {
    name: string;
    slug: string;
  } | null;
};

type ProductModalProps = {
  product: Product | null;
  onClose: () => void;
};

export default function ProductModal({ product, onClose }: ProductModalProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    if (product) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [product, onClose]);

  if (!product) return null;

  const price = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(product.price);

  const rawPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  const phone = rawPhone.replace(/\D/g, "");

  const productUrl = `${siteUrl}/producto/${product.slug}`;

  const message = [
    "Hola 👋",
    "",
    "Estoy interesado(a) en este producto de Mimosa Alelí:",
    "",
    `✨ ${product.name}`,
    `💰 ${price}`,
    `🔗 ${productUrl}`,
    "",
    "¿Me pueden dar más información?",
  ].join("\n");

  const whatsappUrl = phone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-product-title"
    >
      <div
        className="
          relative
          w-full
          max-w-2xl
          max-h-[90vh]
          overflow-y-auto
          rounded-3xl
          bg-card
          border
          border-border
          shadow-2xl
          transition-all
          p-4
          sm:p-6
          md:p-8
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar modal"
          className="
            absolute
            right-3
            top-3
            z-10
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            bg-background/80
            text-foreground
            border
            border-border
            shadow-sm
            transition
            hover:bg-muted
            active:scale-90
            sm:right-4
            sm:top-4
          "
        >
          ✕
        </button>

        <div className="grid gap-6 md:grid-cols-2 items-start">
          {/* Imagen */}
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-brand-soft border border-border/50">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-sage">
                <span className="text-5xl">📷</span>
                <p className="mt-2 text-xs font-medium">Foto próximamente</p>
              </div>
            )}

            {product.featured && (
              <div className="absolute left-3 top-3">
                <span className="inline-flex items-center gap-1 rounded-full bg-amber px-3 py-1 text-xs font-bold text-white shadow-md">
                  ✨ Destacado
                </span>
              </div>
            )}

            {!product.available && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                <span className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-foreground shadow-lg">
                  No disponible
                </span>
              </div>
            )}
          </div>

          {/* Información */}
          <div className="flex flex-col h-full justify-between">
            <div>
              {product.categories && (
                <span className="text-xs font-bold uppercase tracking-widest text-brand">
                  {product.categories.name}
                </span>
              )}

              <h2
                id="modal-product-title"
                className="font-brand mt-1 text-2xl sm:text-3xl font-bold leading-tight text-foreground"
              >
                {product.name}
              </h2>

              <p className="mt-3 text-2xl font-extrabold text-brand">
                {price}
              </p>

              {product.description && (
                <div className="mt-4 border-t border-border pt-4">
                  <h3 className="text-xs font-bold uppercase text-muted-foreground tracking-wider mb-1">
                    Descripción
                  </h3>
                  <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              )}
            </div>

            {/* CTA WhatsApp */}
            <div className="mt-6 pt-4 border-t border-border">
              {product.available && whatsappUrl ? (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-2xl
                    bg-[#25D366]
                    py-3.5
                    px-4
                    text-center
                    text-sm
                    font-bold
                    text-white
                    shadow-md
                    transition-all
                    hover:bg-[#20bd5a]
                    hover:shadow-lg
                    active:scale-[0.98]
                  "
                >
                  <span className="text-lg">💬</span>
                  <span>Pedir por WhatsApp</span>
                </a>
              ) : (
                <button
                  disabled
                  className="w-full rounded-2xl bg-muted py-3.5 px-4 text-center text-sm font-semibold text-muted-foreground cursor-not-allowed"
                >
                  Producto no disponible
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}