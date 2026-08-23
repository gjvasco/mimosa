"use client";

type ProductCardProps = {
    product: {
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
};

export default function ProductCard({
    product,
}: ProductCardProps) {
    /*
     * =====================================================
     * PRECIO
     * =====================================================
     */

    const price = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
    }).format(product.price);

    /*
     * =====================================================
     * WHATSAPP
     * =====================================================
     */

    const rawPhone =
        process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

    // Permite que la variable tenga espacios, +, guiones, etc.
    const phone = rawPhone.replace(/\D/g, "");

    const message = [
        "Hola 👋",
        "",
        "Estoy interesado(a) en este producto de Mimosa Alelí:",
        "",
        `✨ ${product.name}`,
        `💰 ${price}`,
        "",
        "¿Me pueden dar más información?",
    ].join("\n");

    const whatsappUrl = phone
        ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
        : null;

    /*
     * =====================================================
     * RENDER
     * =====================================================
     */

    return (
        <article
            className="
                group
                flex
                h-full
                flex-col
                overflow-hidden
                rounded-2xl
                border
                border-pink-100
                bg-white
                shadow-sm
                transition
                duration-300
                hover:-translate-y-1
                hover:shadow-lg
            "
        >
            {/* =================================================
                IMAGEN
            ================================================= */}

            <div className="relative aspect-square overflow-hidden bg-[#faf7f5]">
                {product.image_url ? (
                    <img
                        src={product.image_url}
                        alt={product.name}
                        loading="lazy"
                        className="
                            h-full
                            w-full
                            object-cover
                            transition
                            duration-500
                            group-hover:scale-105
                        "
                    />
                ) : (
                    <div
                        className="
                            flex
                            h-full
                            items-center
                            justify-center
                            bg-gradient-to-br
                            from-[#fff7ed]
                            via-[#fff1f7]
                            to-[#fdf4ff]
                            text-gray-400
                        "
                    >
                        <div className="text-center">
                            <div className="text-4xl">
                                📷
                            </div>

                            <p className="mt-2 text-xs">
                                Foto próximamente
                            </p>
                        </div>
                    </div>
                )}

                {/* =================================================
                    DESTACADO
                ================================================= */}

                {product.featured && (
                    <div className="absolute left-2 top-2">
                        <span
                            className="
                                inline-flex
                                items-center
                                gap-1
                                rounded-full
                                bg-[#f5b94c]
                                px-2.5
                                py-1
                                text-[10px]
                                font-bold
                                text-white
                                shadow-md
                            "
                        >
                            ✨ Destacado
                        </span>
                    </div>
                )}

                {/* =================================================
                    DISPONIBILIDAD
                ================================================= */}

                {!product.available && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/35">
                        <span
                            className="
                                rounded-full
                                bg-white/95
                                px-4
                                py-2
                                text-xs
                                font-semibold
                                text-gray-800
                                shadow-md
                            "
                        >
                            No disponible
                        </span>
                    </div>
                )}
            </div>

            {/* =================================================
                INFORMACIÓN
            ================================================= */}

            <div className="flex flex-1 flex-col p-3 sm:p-4">
                {/* Categoría */}

                {product.categories && (
                    <p
                        className="
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-[0.12em]
                            text-[#d65b91]
                            sm:text-xs
                        "
                    >
                        {product.categories.name}
                    </p>
                )}

                {/* Nombre */}

                <h2
                    className="
                        mt-1
                        line-clamp-2
                        min-h-[2.5rem]
                        text-sm
                        font-semibold
                        leading-tight
                        text-[#4f4f4f]
                        sm:min-h-[3rem]
                        sm:text-lg
                    "
                >
                    {product.name}
                </h2>

                {/* Descripción */}

                {product.description ? (
                    <p
                        className="
                            mt-2
                            line-clamp-2
                            text-xs
                            leading-relaxed
                            text-gray-500
                            sm:text-sm
                        "
                    >
                        {product.description}
                    </p>
                ) : (
                    <div className="h-2" />
                )}

                {/* =================================================
                    PRECIO
                ================================================= */}

                <div className="mt-auto pt-3">
                    <p
                        className="
                            text-base
                            font-bold
                            text-[#555555]
                            sm:text-lg
                        "
                    >
                        {price}
                    </p>
                </div>

                {/* =================================================
                    WHATSAPP
                ================================================= */}

                {product.available && whatsappUrl ? (
                    <a
                        href={whatsappUrl}
                        aria-label={`Consultar ${product.name} por WhatsApp`}
                        className="
                            mt-3
                            flex
                            min-h-11
                            w-full
                            items-center
                            justify-center
                            gap-1.5
                            rounded-xl
                            bg-[#25D366]
                            px-3
                            py-2.5
                            text-center
                            text-xs
                            font-bold
                            text-white
                            shadow-sm
                            transition
                            hover:bg-[#20bd5a]
                            active:scale-[0.97]
                            sm:mt-4
                            sm:text-sm
                        "
                    >
                        <span
                            aria-hidden="true"
                            className="text-base"
                        >
                            💬
                        </span>

                        <span>
                            Consultar por WhatsApp
                        </span>
                    </a>
                ) : product.available ? (
                    <div
                        className="
                            mt-3
                            rounded-xl
                            bg-gray-100
                            px-3
                            py-2.5
                            text-center
                            text-xs
                            text-gray-500
                            sm:mt-4
                            sm:text-sm
                        "
                    >
                        WhatsApp no configurado
                    </div>
                ) : (
                    <div
                        className="
                            mt-3
                            rounded-xl
                            border
                            border-gray-200
                            bg-gray-50
                            px-3
                            py-2.5
                            text-center
                            text-xs
                            font-medium
                            text-gray-500
                            sm:mt-4
                            sm:text-sm
                        "
                    >
                        Producto no disponible
                    </div>
                )}
            </div>
        </article>
    );
}