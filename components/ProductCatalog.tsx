"use client";

import { useState } from "react";
import CategoryFilter from "./CategoryFilter";
import ProductCard from "./ProductCard";
import SearchBar from "./SearchBar";

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
    const [selectedCategory, setSelectedCategory] =
        useState("todos");

    const [search, setSearch] = useState("");

    const normalizedSearch = search.trim().toLowerCase();

    const filteredProducts = products.filter((product) => {
        const matchesCategory =
            selectedCategory === "todos" ||
            product.categories?.slug === selectedCategory;

        const matchesSearch =
            normalizedSearch === "" ||
            product.name
                .toLowerCase()
                .includes(normalizedSearch) ||
            product.description
                ?.toLowerCase()
                .includes(normalizedSearch) ||
            product.categories?.name
                .toLowerCase()
                .includes(normalizedSearch);

        return matchesCategory && matchesSearch;
    });

    function clearFilters() {
        setSearch("");
        setSelectedCategory("todos");
    }

    return (
        <section className="min-w-0">

            {/* =========================================
                BUSCADOR Y FILTROS
            ========================================= */}

            <div className="mb-5 space-y-3">

                {/* Buscador */}

                <SearchBar
                    value={search}
                    onChange={setSearch}
                />

                {/* Categorías */}

                <CategoryFilter
                    categories={categories}
                    onCategoryChange={setSelectedCategory}
                />

            </div>

            {/* =========================================
                RESULTADOS
            ========================================= */}

            <div className="mb-4 flex items-center justify-between">

                <p className="text-sm text-gray-500">
                    {filteredProducts.length}{" "}
                    {filteredProducts.length === 1
                        ? "producto"
                        : "productos"}
                </p>

                {(search || selectedCategory !== "todos") && (
                    <button
                        type="button"
                        onClick={clearFilters}
                        className="text-sm font-medium text-gray-700 underline underline-offset-4 hover:text-gray-900"
                    >
                        Limpiar filtros
                    </button>
                )}

            </div>

            {/* =========================================
                SIN RESULTADOS
            ========================================= */}

            {filteredProducts.length === 0 ? (
                <div className="rounded-2xl border bg-white px-5 py-10 text-center shadow-sm">

                    <div className="text-4xl">
                        🔎
                    </div>

                    <h3 className="mt-3 font-semibold text-gray-900">
                        No encontramos productos
                    </h3>

                    <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500">
                        Prueba con otro nombre o selecciona
                        una categoría diferente.
                    </p>

                    <button
                        type="button"
                        onClick={clearFilters}
                        className="mt-5 rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
                    >
                        Ver todos los productos
                    </button>

                </div>
            ) : (

                /* =====================================
                   PRODUCTOS
                ===================================== */

                <div
                    className="
                        grid
                        grid-cols-2
                        gap-3
                        sm:gap-4
                        md:grid-cols-3
                        lg:grid-cols-4
                    "
                >
                    {filteredProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                        />
                    ))}
                </div>
            )}

        </section>
    );
}