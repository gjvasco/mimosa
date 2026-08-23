import Link from "next/link";
import { notFound } from "next/navigation";

import { getAdminProduct } from "@/lib/data/admin/products";
import { getCategories } from "@/lib/data/products";
import ProductForm from "@/components/admin/ProductForm";

export const instant = false;

type EditProductPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function EditProductPage({
    params,
}: EditProductPageProps) {
    const { id } = await params;

    const productId = Number(id);

    if (!Number.isInteger(productId)) {
        notFound();
    }

    const [product, categories] = await Promise.all([
        getAdminProduct(productId),
        getCategories(),
    ]);

    if (!product) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-4xl px-4 py-8">

                <div>
                    <Link
                        href="/admin/productos"
                        className="text-sm font-medium text-gray-600 hover:text-gray-900"
                    >
                        ← Volver a productos
                    </Link>

                    <h1 className="mt-4 text-3xl font-bold text-gray-900">
                        Editar producto
                    </h1>

                    <p className="mt-2 text-sm text-gray-600">
                        Modifica la información de "{product.name}".
                    </p>
                </div>

                <ProductForm
                    categories={categories}
                    product={product}
                />

            </div>
        </main>
    );
}