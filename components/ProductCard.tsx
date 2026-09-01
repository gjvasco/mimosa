"use client";

import { siteUrl } from "@/lib/utils";

type Product = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  show_price?: boolean | null;
  custom_price_label?: string | null;
  available: boolean;
  featured: boolean;
  image_url?: string | null;
  categories?: {
    name: string;
    slug: string;
  } | null;
};

type ProductCardProps = {
  product: Product;
  onSelect?: (product: Product) => void;
};

export default function ProductCard({ product, onSelect }: ProductCardProps) {
  const priceDisplay = product.show_price !== false
    ? new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
      }).format(Math.round(product.price))
    : (product.custom_price_label || "Pregúntanos por el valor");

  const rawPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  const phone = rawPhone.replace(/\D/g, "");

  const productUrl = `${siteUrl}/producto/${product.slug}`;

  const message = [
    "Hola 👋",
    "",
    "Estoy interesado(a) en este producto de Mimosa Alelí:",
    "",
    `✨ ${product.name}`,
    `💰 ${priceDisplay}`,
    `🔗 ${productUrl}`,
    "",
    "¿Me pueden dar más información?",
  ].join("\n");

  const whatsappUrl = phone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    : null;

  function handleCardClick() {
    if (onSelect) {
      onSelect(product);
    }
  }

  return (
    <article
      onClick={handleCardClick}
      className="
        group
        relative
        flex
        h-full
        flex-col
        overflow-hidden
        rounded-2xl
        border
        border-border
        bg-card
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-md
        hover:border-brand/30
        cursor-pointer
      "
    >
      {/* IMAGEN */}
      <div className="relative aspect-square overflow-hidden bg-brand-soft">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="
              h-full
              w-full
              object-cover
              transition-transform
              duration-500
              group-hover:scale-105
            "
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-brand-soft text-sage">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl">📷</div>
              <p className="mt-1 text-[11px] sm:text-xs font-medium">
                Foto próximamente
              </p>
            </div>
          </div>
        )}

        {/* INSIGNIA DESTACADO */}
        {product.featured && (
          <div className="absolute left-2.5 top-2.5 z-10">
            <span
              className="
                inline-flex
                items-center
                gap-1
                rounded-full
                bg-amber
                px-2.5
                py-1
                text-[9px]
                sm:text-[10px]
                font-bold
                text-white
                shadow-md
              "
            >
              ✨ Destacado
            </span>
          </div>
        )}

        {/* BOTÓN FLOTANTE EGANTE DE WHATSAPP EN LA ESQUINA INFERIOR DERECHA DE LA FOTO */}
        {product.available && whatsappUrl && (
          <div className="absolute right-2.5 bottom-2.5 z-10">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label={`Consultar ${product.name} por WhatsApp`}
              className="
                flex
                h-9
                w-9
                sm:h-10
                sm:w-10
                items-center
                justify-center
                rounded-full
                bg-white/95
                text-[#25D366]
                shadow-md
                border
                border-white/50
                backdrop-blur-md
                transition-all
                duration-200
                hover:scale-110
                hover:bg-[#25D366]
                hover:text-white
                active:scale-95
              "
              title="Pedir por WhatsApp"
            >
              <span aria-hidden="true" className="text-base sm:text-lg">
                💬
              </span>
            </a>
          </div>
        )}

        {/* NO DISPONIBLE */}
        {!product.available && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/35 backdrop-blur-[1px]">
            <span className="rounded-full bg-white/95 px-3 py-1.5 text-[11px] sm:text-xs font-semibold text-foreground shadow-md">
              No disponible
            </span>
          </div>
        )}
      </div>

      {/* INFORMACIÓN */}
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        {/* Categoría */}
        {product.categories && (
          <p className="text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.12em] text-brand">
            {product.categories.name}
          </p>
        )}

        {/* Nombre */}
        <h2 className="font-brand mt-0.5 line-clamp-2 min-h-[2.2rem] text-sm font-bold leading-tight text-foreground sm:min-h-[2.8rem] sm:text-base md:text-lg">
          {product.name}
        </h2>

        {/* Descripción */}
        {product.description ? (
          <p className="mt-1 line-clamp-2 text-[11px] sm:text-xs leading-relaxed text-muted-foreground">
            {product.description}
          </p>
        ) : (
          <div className="h-2" />
        )}

        {/* PRECIO */}
        <div className="mt-auto pt-3">
          <p className="text-sm sm:text-base font-extrabold text-brand">
            {priceDisplay}
          </p>
        </div>

        {/* BOTÓN SECUNDARIO CON ESTILO DE MARCA REFINADO */}
        <div className="mt-2.5">
          <button
            type="button"
            onClick={handleCardClick}
            className="
              w-full
              rounded-xl
              bg-brand-light/80
              py-2
              px-2
              text-center
              text-xs
              font-bold
              text-brand
              border
              border-brand/20
              transition-all
              duration-200
              hover:bg-brand
              hover:text-white
              hover:border-brand
              active:scale-[0.98]
            "
          >
            Ver detalle
          </button>
        </div>
      </div>
    </article>
  );
}