"use client";

import { siteUrl } from "@/lib/utils";

type ProductWhatsappButtonProps = {
    name: string;
    slug: string;
    price: string;
};

export default function ProductWhatsappButton({
    name,
    slug,
    price,
}: ProductWhatsappButtonProps) {
    const rawPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
    const phone = rawPhone.replace(/\D/g, "");

    const productUrl = `${siteUrl}/producto/${slug}`;

    const message = [
        "Hola 👋",
        "",
        "Estoy interesado(a) en este producto de Mimosa Alelí:",
        "",
        `✨ ${name}`,
        `💰 ${price}`,
        `🔗 ${productUrl}`,
        "",
        "¿Me pueden dar más información?",
    ].join("\n");

    const whatsappUrl = phone
        ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
        : null;

    if (!whatsappUrl) {
        return (
            <button
                disabled
                className="w-full rounded-2xl bg-muted py-3.5 px-4 text-center text-sm font-semibold text-muted-foreground cursor-not-allowed"
            >
                Producto no disponible
            </button>
        );
    }

    return (
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
    );
}