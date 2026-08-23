import Link from "next/link";
import { getAdminProducts } from "@/lib/data/admin/products";
import ToggleProductButton from "@/components/admin/ToggleProductButton";

export const instant = false;

export default async function AdminProductsPage() {
    const products = await getAdminProducts();

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-6xl px-4 py-8">

                {/* Encabezado */}

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                        <p className="text-sm font-medium text-gray-500">
                            Mimosa Alelí
                        </p>

                        <h1 className="mt-1 text-3xl font-bold text-gray-900">
                            Administrar productos
                        </h1>

                        <p className="mt-2 text-sm text-gray-600">
                            Gestiona el catálogo y la disponibilidad.
                        </p>
                    </div>

                    <Link
                        href="/admin/productos/nuevo"
                        className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
                    >
                        + Nuevo producto
                    </Link>

                </div>

                {/* Resumen */}

                <div className="mt-8 grid gap-4 sm:grid-cols-3">

                    <div className="rounded-2xl border bg-white p-5 shadow-sm">
                        <p className="text-sm text-gray-500">
                            Total productos
                        </p>

                        <p className="mt-1 text-3xl font-bold text-gray-900">
                            {products.length}
                        </p>
                    </div>

                    <div className="rounded-2xl border bg-white p-5 shadow-sm">
                        <p className="text-sm text-gray-500">
                            Disponibles
                        </p>

                        <p className="mt-1 text-3xl font-bold text-gray-900">
                            {
                                products.filter(
                                    (product) =>
                                        product.available
                                ).length
                            }
                        </p>
                    </div>

                    <div className="rounded-2xl border bg-white p-5 shadow-sm">
                        <p className="text-sm text-gray-500">
                            No disponibles
                        </p>

                        <p className="mt-1 text-3xl font-bold text-gray-900">
                            {
                                products.filter(
                                    (product) =>
                                        !product.available
                                ).length
                            }
                        </p>
                    </div>

                </div>

                {/* Productos */}

                <section className="mt-8">

                    <div className="mb-4">
                        <h2 className="text-xl font-bold text-gray-900">
                            Productos
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            {products.length === 0
                                ? "Todavía no hay productos."
                                : "Productos registrados en Mimosa Alelí."}
                        </p>
                    </div>

                    {products.length === 0 ? (
                        <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">

                            <div className="text-4xl">
                                📦
                            </div>

                            <p className="mt-4 font-medium text-gray-900">
                                No hay productos todavía
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                                Crea tu primer producto para comenzar.
                            </p>

                            <Link
                                href="/admin/productos/nuevo"
                                className="mt-5 inline-flex rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white"
                            >
                                Crear producto
                            </Link>

                        </div>
                    ) : (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                            {products.map((product) => (
                                <article
                                    key={product.id}
                                    className="overflow-hidden rounded-2xl border bg-white shadow-sm"
                                >

                                    {/* Imagen */}

                                    <div className="aspect-square bg-gray-100">

                                        {product.image_url ? (
                                            <img
                                                src={product.image_url}
                                                alt={product.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-gray-400">
                                                <div className="text-center">
                                                    <div className="text-4xl">
                                                        📷
                                                    </div>
                                                    <p className="mt-2 text-sm">
                                                        Sin fotografía
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                    </div>

                                    {/* Información */}

                                    <div className="p-5">

                                        {product.categories && (
                                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                {product.categories.name}
                                            </p>
                                        )}

                                        <h3 className="mt-1 text-lg font-semibold text-gray-900">
                                            {product.name}
                                        </h3>

                                        <p className="mt-2 text-lg font-bold text-gray-900">
                                            {new Intl.NumberFormat(
                                                "es-CO",
                                                {
                                                    style: "currency",
                                                    currency: "COP",
                                                    maximumFractionDigits: 0,
                                                }
                                            ).format(product.price)}
                                        </p>

                                        {/* Estado */}

                                        <div className="mt-3">

                                            {product.available ? (
                                                <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                                    ● Disponible
                                                </span>
                                            ) : (
                                                <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                                                    ● No disponible
                                                </span>
                                            )}

                                        </div>

                                        {/* Acciones */}

                                        <div className="mt-5 flex gap-2">

                                            <Link
                                                href={`/admin/productos/${product.id}/editar`}
                                                className="flex-1 rounded-xl border px-4 py-2.5 text-center text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                                            >
                                                Editar
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