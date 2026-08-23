import {
    getProducts,
    getCategories,
} from "@/lib/data/products";

import ProductCatalog from "@/components/ProductCatalog";

export default async function ProductosPage() {
    const [products, categories] = await Promise.all([
        getProducts(),
        getCategories(),
    ]);

    return (
        <main className="min-h-screen bg-gray-50">
            <header className="border-b bg-white">
                <div className="mx-auto max-w-6xl px-4 py-8 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        Mimosa Alelí
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Bisutería · Velas aromáticas · Aceites esenciales
                    </p>
                </div>
            </header>

            <div className="mx-auto max-w-6xl px-4 py-8">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Nuestros productos
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                        Encuentra algo especial para ti o para regalar.
                    </p>
                </div>

                <ProductCatalog
                    products={products}
                    categories={categories}
                />
            </div>
        </main>
    );
}