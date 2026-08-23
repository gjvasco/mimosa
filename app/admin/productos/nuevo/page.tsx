import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ProductForm from "@/components/admin/ProductForm";

export const instant = false;

export default async function NuevoProductoPage() {
    const supabase = await createClient();

    const { data: categories, error } = await supabase
        .from("categories")
        .select("id, name, slug")
        .eq("active", true)
        .order("sort_order", { ascending: true });

    if (error) {
        throw new Error(error.message);
    }

    return (
        <main className="min-h-screen bg-gray-50 p-6 md:p-8">
            <div className="mx-auto max-w-3xl">

                <Link
                    href="/admin/productos"
                    className="text-sm text-gray-500 hover:text-gray-900"
                >
                    ← Volver a productos
                </Link>

                <div className="mt-4">
                    <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
                        Mimosa Alelí
                    </p>

                    <h1 className="mt-1 text-3xl font-bold text-gray-900">
                        Nuevo producto
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Agrega un producto al catálogo.
                    </p>
                </div>

                <ProductForm categories={categories ?? []} />

            </div>
        </main>
    );
}