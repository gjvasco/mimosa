"use client";

import { useState } from "react";
import CategoryFilter from "./CategoryFilter";
import ProductCard from "./ProductCard";
import SearchBar from "./SearchBar";
import ProductModal from "./ProductModal";

type Category = {
  id: number;
  name: string;
  slug: string;
};

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

type ProductCatalogProps = {
  products: Product[];
  categories: Category[];
};

export default function ProductCatalog({
  products,
  categories,
}: ProductCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const normalizedSearch = search.trim().toLowerCase();

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "todos" ||
      product.categories?.slug === selectedCategory;

    const matchesSearch =
      normalizedSearch === "" ||
      product.name.toLowerCase().includes(normalizedSearch) ||
      product.description?.toLowerCase().includes(normalizedSearch) ||
      product.categories?.name.toLowerCase().includes(normalizedSearch);

    return matchesCategory && matchesSearch;
  });

  function clearFilters() {
    setSearch("");
    setSelectedCategory("todos");
  }

  return (
    <section className="min-w-0">
      {/* BUSCADOR Y FILTROS */}
      <div className="mb-6 space-y-4">
        {/* Buscador */}
        <SearchBar value={search} onChange={setSearch} />

        {/* Categorías */}
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>

      {/* RESULTADOS INFO */}
      <div className="mb-4 flex items-center justify-between border-b border-border/60 pb-3">
        <p className="text-xs sm:text-sm font-semibold text-muted-foreground">
          {filteredProducts.length}{" "}
          {filteredProducts.length === 1 ? "producto encontrado" : "productos encontrados"}
        </p>

        {(search || selectedCategory !== "todos") && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs sm:text-sm font-semibold text-brand underline underline-offset-4 hover:opacity-80 transition"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* SIN RESULTADOS */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-3xl border border-border bg-card px-6 py-12 text-center shadow-sm">
          <div className="text-4xl text-sage select-none">🔎</div>

          <h3 className="font-brand mt-3 text-xl font-bold text-foreground">
            No encontramos productos
          </h3>

          <p className="mx-auto mt-1 max-w-sm text-xs sm:text-sm text-muted-foreground">
            Intenta con otro término de búsqueda o selecciona una categoría diferente.
          </p>

          <button
            type="button"
            onClick={clearFilters}
            className="mt-6 rounded-2xl bg-brand px-6 py-3 text-xs sm:text-sm font-semibold text-white shadow-md transition hover:bg-brand/90 active:scale-95"
          >
            Ver todos los productos
          </button>
        </div>
      ) : (
        /* PRODUCTOS GRID */
        <div
          className="
            grid
            grid-cols-2
            gap-3
            sm:gap-5
            md:grid-cols-3
            lg:grid-cols-4
          "
        >
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={setSelectedProduct}
            />
          ))}
        </div>
      )}

      {/* MODAL DETALLE DE PRODUCTO */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </section>
  );
}