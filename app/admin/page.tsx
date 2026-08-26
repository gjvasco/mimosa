import Link from "next/link";
import { getAdminProducts } from "@/lib/data/admin/products";
import ToggleProductButton from "@/components/admin/ToggleProductButton";

export const instant = false;

export default async function AdminProductsPage() {
    const products = await getAdminProducts();

    const availableProducts = products.filter(
        (product) => product.available
    ).length;

    const unavailableProducts =
        products.length - availableProducts;

    return (
        <main className="min-h-screen bg-[#fffafc]">

            {/* =====================================================
                HEADER
            ===================================================== */}

            <header className="sticky top-0 z-40 border-b border-[#ead9df] bg-[#fffafc]/95 backdrop-blur">

                <div className="mx-auto max-w-6xl px-4">

                    <div className="flex h-16 items-center justify-between sm:h-20">

                        {/* Marca */}

                        <Link
                            href="/admin"
                            className="flex items-center gap-2"
                        >
                            <img
                                src="/mimosa-aleli-logo.png"
                                alt="Mimosa Alelí"
                                className="h-10 w-10 object-contain sm:h-12 sm:w-12"
                            />

                            <div className="hidden sm:block">
                                <p className="font-serif text-lg font-semibold text-[#6f4656]">
                                    Mimosa Alelí
                                </p>

                                <p className="text-[9px] tracking-[0.18em] text-[#8f747f]">
                                    ADMINISTRACIÓN
                                </p>
                            </div>
                        </Link>

                        {/* Navegación */}

                        <div className="flex items-center gap-2">

                            <Link
                                href="/productos"
                                className="rounded-full px-3 py-2 text-sm font-medium text-[#6f4656] transition hover:bg-[#f5e9ee]"
                            >
                                <span className="hidden sm:inline">
                                    Ver catálogo
                                </span>

                                <span className="sm:hidden">
                                    🛍️
                                </span>
                            </Link>

                            <Link
                                href="/admin/productos/nuevo"
                                className="inline-flex items-center rounded-full bg-[#6f4656] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5c3948] active:scale-[0.98]"
                            >
                                <span className="mr-1">
                                    +
                                </span>

                                Nuevo
                            </Link>

                        </div>

                    </div>

                </div>

            </header>

            {/* =====================================================
                CONTENIDO
            ===================================================== */}

            <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8">

                {/* =================================================
                    TÍTULO
                ================================================= */}

                <div>

                    <h1 className="font-serif text-2xl font-semibold text-[#6f4656] sm:text-3xl">
                        Mis productos
                    </h1>

                    <p className="mt-1 text-sm text-[#8f747f]">
                        Administra tu catálogo desde cualquier lugar.
                    </p>

                </div>

                {/* =================================================
                    RESUMEN
                ================================================= */}

                <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-4">

                    <div className="rounded-2xl border border-[#ead9df] bg-white p-3 shadow-sm sm:p-5">

                        <p className="text-[11px] text-[#8f747f] sm:text-sm">
                            Productos
                        </p>

                        <p className="mt-1 text-2xl font-bold text-[#6f4656] sm:text-3xl">
                            {products.length}
                        </p>

                    </div>

                    <div className="rounded-2xl border border-[#dce8de] bg-white p-3 shadow-sm sm:p-5">

                        <p className="text-[11px] text-[#6f8b73] sm:text-sm">
                            Disponibles
                        </p>

                        <p className="mt-1 text-2xl font-bold text-[#6f8b73] sm:text-3xl">
                            {availableProducts}
                        </p>

                    </div>

                    <div className="rounded-2xl border border-[#ead9df] bg-white p-3 shadow-sm sm:p-5">

                        <p className="text-[11px] text-[#8f747f] sm:text-sm">
                            Ocultos
                        </p>

                        <p className="mt-1 text-2xl font-bold text-[#8f747f] sm:text-3xl">
                            {unavailableProducts}
                        </p>

                    </div>

                </div>

                {/* =================================================
                    PRODUCTOS
                ================================================= */}

                <section className="mt-8">

                    <div className="mb-4 flex items-end justify-between">

                        <div>

                            <h2 className="font-serif text-xl font-semibold text-[#6f4656] sm:text-2xl">
                                Catálogo
                            </h2>

                            <p className="mt-1 text-xs text-[#8f747f] sm:text-sm">
                                {products.length === 0
                                    ? "Todavía no hay productos."
                                    : `${products.length} productos registrados`}
                            </p>

                        </div>

                    </div>

                    {/* =================================================
                        SIN PRODUCTOS
                    ================================================= */}

                    {products.length === 0 ? (

                        <div className="rounded-3xl border border-[#ead9df] bg-white px-6 py-12 text-center shadow-sm">

                            <div className="text-5xl">
                                🌸
                            </div>

                            <p className="mt-4 font-semibold text-[#6f4656]">
                                Tu catálogo está vacío
                            </p>

                            <p className="mx-auto mt-1 max-w-sm text-sm text-[#8f747f]">
                                Crea tu primer producto para comenzar.
                            </p>

                            <Link
                                href="/admin/productos/nuevo"
                                className="mt-6 inline-flex rounded-full bg-[#6f4656] px-6 py-3 text-sm font-semibold text-white"
                            >
                                + Crear producto
                            </Link>

                        </div>

                    ) : (

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">

                            {products.map((product) => (

                                <article
                                    key={product.id}
                                    className="overflow-hidden rounded-2xl border border-[#ead9df] bg-white shadow-sm transition hover:shadow-md"
                                >

                                    {/* =================================================
                                        IMAGEN
                                    ================================================= */}

                                    <div className="relative aspect-square bg-[#f8f1f4]">

                                        {product.image_url ? (

                                            <img
                                                src={product.image_url}
                                                alt={product.name}
                                                loading="lazy"
                                                className="h-full w-full object-cover"
                                            />

                                        ) : (

                                            <div className="flex h-full items-center justify-center text-[#b79aa6]">

                                                <div className="text-center">

                                                    <div className="text-3xl">
                                                        📷
                                                    </div>

                                                    <p className="mt-1 text-[10px]">
                                                        Sin fotografía
                                                    </p>

                                                </div>

                                            </div>

                                        )}

                                        {/* Estado */}

                                        <div className="absolute left-2 top-2">

                                            {product.available ? (

                                                <span className="rounded-full bg-white/95 px-2 py-1 text-[9px] font-semibold text-[#6f8b73] shadow-sm backdrop-blur">
                                                    ● Disponible
                                                </span>

                                            ) : (

                                                <span className="rounded-full bg-white/95 px-2 py-1 text-[9px] font-semibold text-[#8f747f] shadow-sm backdrop-blur">
                                                    ● Oculto
                                                </span>

                                            )}

                                        </div>

                                        {/* Destacado */}

                                        {product.featured && (

                                            <div className="absolute right-2 top-2">

                                                <span className="rounded-full bg-white/95 px-2 py-1 text-[9px] shadow-sm">
                                                    ✨
                                                </span>

                                            </div>

                                        )}

                                    </div>

                                    {/* =================================================
                                        INFORMACIÓN
                                    ================================================= */}

                                    <div className="p-3 sm:p-5">

                                        {product.categories && (

                                            <p className="truncate text-[9px] font-semibold uppercase tracking-wide text-[#9a7f89] sm:text-xs">
                                                {product.categories.name}
                                            </p>

                                        )}

                                        <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-tight text-[#4f3942] sm:text-lg">
                                            {product.name}
                                        </h3>

                                        <p className="mt-2 text-sm font-bold text-[#6f4656] sm:text-lg">
                                            {new Intl.NumberFormat(
                                                "es-CO",
                                                {
                                                    style: "currency",
                                                    currency: "COP",
                                                    maximumFractionDigits: 0,
                                                }
                                            ).format(product.price)}
                                        </p>

                                        {/* =================================================
                                            ACCIONES
                                        ================================================= */}

                                        <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-5">

                                            <Link
                                                href={`/admin/productos/${product.id}/editar`}
                                                className="flex min-h-10 items-center justify-center rounded-xl border border-[#decbd2] px-2 text-xs font-semibold text-[#6f4656] transition hover:bg-[#faf4f6] active:scale-[0.98] sm:min-h-11 sm:text-sm"
                                            >
                                                ✏️ Editar
                                            </Link>

                                            <ToggleProductButton
                                                productId={product.id}
                                                available={product.available}
                                            />

                                        </div>

                                    </div>

                                </article>

                            ))}

                        </div>

                    )}

                </section>

            </div>

        </main>
    );
}