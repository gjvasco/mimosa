import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/data/products";
import ProductWhatsappButton from "@/components/ProductWhatsappButton";

type ProductPageProps = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata(
    { params }: ProductPageProps
): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
        return {
            title: "Producto no encontrado — Mimosa Alelí",
        };
    }

    const price = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
    }).format(product.price);

    const title = `${product.name} — Mimosa Alelí`;
    const description = product.description
        ? product.description
        : `${price} — Disponible en Mimosa Alelí.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: product.image_url
                ? [{ url: product.image_url, width: 800, height: 800 }]
                : undefined,
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: product.image_url ? [product.image_url] : undefined,
        },
    };
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
        notFound();
    }

    const price = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
    }).format(product.price);

    return (
        <main className="min-h-screen bg-background px-4 py-8 sm:px-6 sm:py-10">
            <div className="mx-auto max-w-3xl">

                <Link
                    href="/productos"
                    className="text-sm font-medium text-brand hover:underline"
                >
                    ← Volver al catálogo
                </Link>

                <div className="mt-4 grid gap-6 rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-6 md:grid-cols-2 md:p-8">

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
                    </div>

                    {/* Información */}
                    <div className="flex flex-col justify-between">
                        <div>
                            {product.categories && (
                                <span className="text-xs font-bold uppercase tracking-widest text-brand">
                                    {product.categories.name}
                                </span>
                            )}

                            <h1 className="font-brand mt-1 text-2xl sm:text-3xl font-bold leading-tight text-foreground">
                                {product.name}
                            </h1>

                            <p className="mt-3 text-2xl font-extrabold text-brand">
                                {price}
                            </p>

                            {product.description && (
                                <div className="mt-4 border-t border-border pt-4">
                                    <h2 className="text-xs font-bold uppercase text-muted-foreground tracking-wider mb-1">
                                        Descripción
                                    </h2>
                                    <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-line">
                                        {product.description}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 pt-4 border-t border-border">
                            <ProductWhatsappButton
                                name={product.name}
                                slug={product.slug}
                                price={price}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}