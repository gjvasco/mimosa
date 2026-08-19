import { getProducts } from "@/lib/data/products";
import ProductCard from "@/components/ProductCard";

export default async function ProductosPage() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Encabezado */}
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

      {/* Contenido */}
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Nuestros productos
          </h2>

          <p className="mt-1 text-sm text-gray-600">
            Encuentra algo especial para ti o para regalar.
          </p>
        </div>

        {/* Productos */}
        {products.length === 0 ? (
          <div className="rounded-2xl border bg-white p-10 text-center">
            <p className="text-gray-500">
              En este momento no tenemos productos disponibles.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}