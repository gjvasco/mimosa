import { Suspense } from "react";
import { getProducts, getCategories } from "@/lib/data/products";
import ProductCatalog from "@/components/ProductCatalog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CatalogSkeleton from "@/components/CatalogSkeleton";

async function CatalogData() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return <ProductCatalog products={products} categories={categories} />;
}

export default function ProductosPage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <div>
        <Navbar />

        <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
          <div className="mb-6">
            <h2 className="font-brand text-2xl font-bold text-brand sm:text-3xl md:text-4xl">
              Nuestros productos
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              Encuentra algo especial para ti o para regalar.
            </p>
          </div>

          <Suspense fallback={<CatalogSkeleton />}>
            <CatalogData />
          </Suspense>
        </div>
      </div>

      <Footer />
    </main>
  );
}