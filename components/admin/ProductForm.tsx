"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { revalidateCatalog } from "@/lib/actions/products";

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
    image_url: string | null;
    categories?: {
        id: number;
        name: string;
        slug: string;
    } | null;
};

type ProductFormProps = {
    categories: Category[];
    product?: Product;
};

export default function ProductForm({
    categories,
    product,
}: ProductFormProps) {
    const router = useRouter();

    const isEditing = !!product;

    const [name, setName] = useState(product?.name ?? "");
    const [categoryId, setCategoryId] = useState(
        product?.categories?.id?.toString() ?? ""
    );
    const [price, setPrice] = useState(
        product?.price != null ? String(Number(product.price)) : ""
    );
    const [description, setDescription] = useState(
        product?.description ?? ""
    );

    const [available, setAvailable] = useState(
        product?.available ?? true
    );

    const [featured, setFeatured] = useState(
        product?.featured ?? false
    );

    const [showPrice, setShowPrice] = useState(
        product?.show_price ?? true
    );

    const [customPriceLabel, setCustomPriceLabel] = useState(
        product?.custom_price_label ?? ""
    );

    const [image, setImage] = useState<File | null>(null);

    const [imagePreview, setImagePreview] = useState<string | null>(
        product?.image_url ?? null
    );

    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    /*
     * =====================================================
     * LIMPIAR URL DE PREVIEW
     * =====================================================
     */

    useEffect(() => {
        return () => {
            if (imagePreview?.startsWith("blob:")) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    /*
     * =====================================================
     * MANEJAR IMAGEN
     * =====================================================
     */

    function handleImageChange(
        event: React.ChangeEvent<HTMLInputElement>
    ) {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        if (!allowedTypes.includes(file.type)) {
            setError(
                "La fotografía debe ser JPG, PNG o WebP."
            );

            event.target.value = "";
            return;
        }

        const maxSize = 5 * 1024 * 1024;

        if (file.size > maxSize) {
            setError(
                "La fotografía no puede superar los 5 MB."
            );

            event.target.value = "";
            return;
        }

        setError(null);

        setImage(file);

        const previewUrl = URL.createObjectURL(file);

        setImagePreview(previewUrl);
    }

    /*
     * =====================================================
     * GENERAR SLUG
     * =====================================================
     */

    function generateSlug(value: string) {
        return value
            .trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    }

    /*
     * =====================================================
     * GUARDAR
     * =====================================================
     */

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError(null);

        /*
         * VALIDACIONES
         */

        if (!name.trim()) {
            setError(
                "Debes ingresar el nombre del producto."
            );
            return;
        }

        if (!categoryId) {
            setError(
                "Debes seleccionar una categoría."
            );
            return;
        }

        let numericPrice = 0;
        if (showPrice) {
            const parsed = parseFloat(price);
            if (!price || isNaN(parsed) || parsed < 0) {
                setError(
                    "Debes ingresar un precio válido."
                );
                return;
            }
            numericPrice = Math.round(parsed);
            if (!Number.isFinite(numericPrice)) {
                setError(
                    "El precio ingresado no es válido."
                );
                return;
            }
        } else {
            if (price) {
                const parsed = parseFloat(price);
                if (isNaN(parsed) || parsed < 0) {
                    setError(
                        "El precio ingresado no es válido."
                    );
                    return;
                }
                numericPrice = Math.round(parsed);
            }
        }

        const slug = generateSlug(name);

        if (!slug) {
            setError(
                "El nombre del producto no permite generar un identificador válido."
            );
            return;
        }

        try {
            setIsSaving(true);

            const supabase = createClient();

            /*
             * =================================================
             * 1. COMPROBAR USUARIO
             * =================================================
             */

            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser();

            if (userError) {
                throw new Error(
                    `No se pudo verificar la sesión: ${userError.message}`
                );
            }

            if (!user) {
                throw new Error(
                    "Tu sesión ha expirado. Inicia sesión nuevamente."
                );
            }

            /*
             * =================================================
             * 2. COMPROBAR SLUG
             *
             * En edición excluimos el producto actual.
             * =================================================
             */

            const { data: existingProducts, error: slugError } =
                await supabase
                    .from("products")
                    .select("id")
                    .eq("slug", slug);

            if (slugError) {
                throw new Error(
                    `No se pudo comprobar el nombre del producto: ${slugError.message}`
                );
            }

            const slugExists = existingProducts?.some(
                (existingProduct) =>
                    existingProduct.id !== product?.id
            );

            if (slugExists) {
                throw new Error(
                    `Ya existe otro producto con el nombre "${name.trim()}".`
                );
            }

            /*
             * =================================================
             * 3. IMAGEN
             * =================================================
             */

            let imageUrl = product?.image_url ?? null;
            let uploadedFilePath: string | null = null;

            /*
             * Si el usuario seleccionó una nueva imagen,
             * la subimos.
             */

            if (image) {
                const extension =
                    image.name
                        .split(".")
                        .pop()
                        ?.toLowerCase() || "jpg";

                const fileName = `${slug}-${crypto.randomUUID()}.${extension}`;

                uploadedFilePath = fileName;

                const { error: uploadError } =
                    await supabase.storage
                        .from("product-images")
                        .upload(
                            uploadedFilePath,
                            image,
                            {
                                cacheControl: "3600",
                                upsert: false,
                                contentType: image.type,
                            }
                        );

                if (uploadError) {
                    throw new Error(
                        `No se pudo subir la fotografía: ${uploadError.message}`
                    );
                }

                const {
                    data: publicUrlData,
                } = supabase.storage
                    .from("product-images")
                    .getPublicUrl(
                        uploadedFilePath
                    );

                imageUrl =
                    publicUrlData.publicUrl;
            }

            /*
             * =================================================
             * 4. CREAR
             * =================================================
             */

            if (!isEditing) {
                const {
                    error: productError,
                } = await supabase
                    .from("products")
                    .insert({
                        category_id: Number(categoryId),
                        name: name.trim(),
                        slug,
                        description:
                            description.trim() || null,
                        price: numericPrice,
                        show_price: showPrice,
                        custom_price_label: showPrice ? null : (customPriceLabel.trim() || null),
                        image_url: imageUrl,
                        available,
                        featured,
                    });

                if (productError) {
                    /*
                     * Si falló el producto,
                     * eliminamos la imagen que acabamos
                     * de subir.
                     */

                    if (uploadedFilePath) {
                        await supabase.storage
                            .from("product-images")
                            .remove([
                                uploadedFilePath,
                            ]);
                    }

                    throw new Error(
                        `No se pudo guardar el producto: ${productError.message}`
                    );
                }
            }

            /*
             * =================================================
             * 5. EDITAR
             * =================================================
             */

            if (isEditing) {
                const {
                    error: productError,
                } = await supabase
                    .from("products")
                    .update({
                        category_id: Number(categoryId),
                        name: name.trim(),
                        slug,
                        description:
                            description.trim() || null,
                        price: numericPrice,
                        show_price: showPrice,
                        custom_price_label: showPrice ? null : (customPriceLabel.trim() || null),
                        image_url: imageUrl,
                        available,
                        featured,
                    })
                    .eq("id", product.id);

                if (productError) {
                    /*
                     * Si falló la actualización,
                     * eliminamos la nueva imagen.
                     */

                    if (uploadedFilePath) {
                        await supabase.storage
                            .from("product-images")
                            .remove([
                                uploadedFilePath,
                            ]);
                    }

                    throw new Error(
                        `No se pudo actualizar el producto: ${productError.message}`
                    );
                }

                /*
                 * =================================================
                 * 6. ELIMINAR IMAGEN ANTERIOR
                 *
                 * Solo después de que el producto fue actualizado
                 * correctamente.
                 * =================================================
                 */

                if (
                    uploadedFilePath &&
                    product.image_url
                ) {
                    try {
                        const oldImageUrl =
                            product.image_url;

                        const marker =
                            "/product-images/";

                        const markerIndex =
                            oldImageUrl.indexOf(
                                marker
                            );

                        if (markerIndex !== -1) {
                            const oldFilePath =
                                oldImageUrl.substring(
                                    markerIndex +
                                    marker.length
                                );

                            await supabase.storage
                                .from(
                                    "product-images"
                                )
                                .remove([
                                    oldFilePath,
                                ]);
                        }
                    } catch (imageDeleteError) {
                        console.error(
                            "No se pudo eliminar la imagen anterior:",
                            imageDeleteError
                        );
                    }
                }
            }

            /*
             * =================================================
             * 7. REGRESAR
             * =================================================
             */

            await revalidateCatalog();

            router.push("/admin/productos");
            router.refresh();

        } catch (error: unknown) {
            console.error(
                "Error guardando producto:",
                error
            );

            setError(
                error instanceof Error
                    ? error.message
                    : "Ocurrió un error al guardar el producto."
            );
        } finally {
            setIsSaving(false);
        }
    }

    /*
     * =====================================================
     * CANCELAR
     * =====================================================
     */

    function handleCancel() {
        if (isSaving) {
            return;
        }

        router.push("/admin/productos");
    }

    /*
     * =====================================================
     * INTERFAZ
     * =====================================================
     */

    return (
        <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-6"
        >
            {/* INFORMACIÓN */}

            <section className="rounded-2xl border bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900">
                    Información del producto
                </h2>

                <div className="mt-6 space-y-5">

                    {/* Nombre */}

                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Nombre
                        </label>

                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            placeholder="Ej. Collar Luna"
                            disabled={isSaving}
                            className="mt-2 w-full rounded-xl border px-4 py-3 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900 disabled:bg-gray-100"
                        />
                    </div>

                    {/* Categoría */}

                    <div>
                        <label
                            htmlFor="category"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Categoría
                        </label>

                        <select
                            id="category"
                            value={categoryId}
                            onChange={(e) =>
                                setCategoryId(
                                    e.target.value
                                )
                            }
                            disabled={isSaving}
                            className="mt-2 w-full rounded-xl border bg-white px-4 py-3 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900 disabled:bg-gray-100"
                        >
                            <option value="">
                                Selecciona una categoría
                            </option>

                            {categories.map(
                                (category) => (
                                    <option
                                        key={category.id}
                                        value={
                                            category.id
                                        }
                                    >
                                        {category.name}
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    {/* Precio */}

                    <div>
                        <label
                            htmlFor="price"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Precio
                        </label>

                        <div className="relative mt-2">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                $
                            </span>

                            <input
                                id="price"
                                type="number"
                                min="0"
                                step="1"
                                value={price}
                                onChange={(e) =>
                                    setPrice(
                                        e.target.value
                                    )
                                }
                                placeholder="85000"
                                disabled={isSaving}
                                className="w-full rounded-xl border px-8 py-3 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900 disabled:bg-gray-100"
                            />
                        </div>
                    </div>

                    {/* Opciones de visualización de precio */}
                    <div className="space-y-4 rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                        <label className="flex cursor-pointer items-start gap-3">
                            <input
                                type="checkbox"
                                checked={showPrice}
                                onChange={(e) => setShowPrice(e.target.checked)}
                                disabled={isSaving}
                                className="mt-1 h-5 w-5 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                            />
                            <div>
                                <span className="block text-sm font-medium text-gray-900">
                                    Mostrar precio en catálogo
                                </span>
                                <span className="block text-xs text-gray-500">
                                    Si se desactiva, se ocultará el precio numérico y se mostrará un texto personalizado (o "Pregúntanos por el valor" por defecto).
                                </span>
                            </div>
                        </label>

                        {!showPrice && (
                            <div className="mt-3">
                                <label
                                    htmlFor="customPriceLabel"
                                    className="block text-xs font-semibold uppercase tracking-wider text-gray-700"
                                >
                                    Texto de precio personalizado
                                </label>
                                <input
                                    id="customPriceLabel"
                                    type="text"
                                    value={customPriceLabel}
                                    onChange={(e) => setCustomPriceLabel(e.target.value)}
                                    placeholder="Ej: Pregúntanos por el valor, Precio por persona: $80.000, etc."
                                    disabled={isSaving}
                                    className="mt-2 w-full rounded-xl border bg-white px-4 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900 disabled:bg-gray-100"
                                />
                            </div>
                        )}

                        {/* Ayuda visual e información si la categoría es Bienestar */}
                        {categories.find(c => c.id.toString() === categoryId)?.slug === "bienestar" && (
                            <div className="mt-3 rounded-lg bg-amber-50/60 p-3 text-xs text-amber-800 border border-amber-100 flex items-start gap-2">
                                <span className="text-base select-none">💡</span>
                                <div>
                                    <strong className="font-semibold block mb-0.5">Categoría Bienestar seleccionada:</strong>
                                    Dado que en Bienestar los precios varían según si es por persona o por grupo, puedes desactivar "Mostrar precio en catálogo" y usar un texto como <em>"Pregúntanos por el valor"</em> o <em>"$80.000 por persona"</em> para evitar malos entendidos.
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Descripción */}

                    <div>
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Descripción
                        </label>

                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) =>
                                setDescription(
                                    e.target.value
                                )
                            }
                            rows={4}
                            placeholder="Describe brevemente el producto..."
                            disabled={isSaving}
                            className="mt-2 w-full resize-none rounded-xl border px-4 py-3 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900 disabled:bg-gray-100"
                        />
                    </div>

                </div>
            </section>

            {/* FOTOGRAFÍA */}

            <section className="rounded-2xl border bg-white p-6 shadow-sm">

                <h2 className="text-lg font-semibold text-gray-900">
                    Fotografía
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    {isEditing
                        ? "Puedes conservar la fotografía actual o seleccionar una nueva."
                        : "Selecciona una fotografía del producto."
                    }
                </p>

                <div className="mt-5">

                    <label
                        htmlFor="image"
                        className={`block ${isSaving
                                ? "cursor-not-allowed"
                                : "cursor-pointer"
                            }`}
                    >

                        {imagePreview ? (
                            <div className="relative max-w-sm overflow-hidden rounded-2xl border">

                                <img
                                    src={imagePreview}
                                    alt="Vista previa del producto"
                                    className="aspect-square w-full object-cover"
                                />

                                {!isSaving && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-3 text-center text-sm font-medium text-white">
                                        Cambiar fotografía
                                    </div>
                                )}

                            </div>
                        ) : (
                            <div className="flex aspect-square max-w-sm items-center justify-center rounded-2xl border-2 border-dashed bg-gray-50 transition hover:bg-gray-100">

                                <div className="text-center">

                                    <div className="text-5xl">
                                        📷
                                    </div>

                                    <p className="mt-3 font-medium text-gray-700">
                                        Seleccionar fotografía
                                    </p>

                                    <p className="mt-1 text-sm text-gray-500">
                                        JPG, PNG o WebP
                                    </p>

                                    <p className="mt-1 text-xs text-gray-400">
                                        Máximo 5 MB
                                    </p>

                                </div>

                            </div>
                        )}

                    </label>

                    <input
                        id="image"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={
                            handleImageChange
                        }
                        disabled={isSaving}
                        className="hidden"
                    />

                    {image && (
                        <p className="mt-3 text-sm text-gray-500">
                            📎 {image.name}
                        </p>
                    )}

                </div>
            </section>

            {/* ESTADO */}

            <section className="rounded-2xl border bg-white p-6 shadow-sm">

                <h2 className="text-lg font-semibold text-gray-900">
                    Estado
                </h2>

                <div className="mt-5 space-y-4">

                    {/* Disponible */}

                    <label className="flex cursor-pointer items-start gap-3">

                        <input
                            type="checkbox"
                            checked={available}
                            onChange={(e) =>
                                setAvailable(
                                    e.target.checked
                                )
                            }
                            disabled={isSaving}
                            className="mt-1 h-5 w-5 rounded"
                        />

                        <div>
                            <p className="font-medium text-gray-900">
                                Disponible
                            </p>

                            <p className="text-sm text-gray-500">
                                El producto aparecerá en el catálogo.
                            </p>
                        </div>

                    </label>

                    {/* Destacado */}

                    <label className="flex cursor-pointer items-start gap-3">

                        <input
                            type="checkbox"
                            checked={featured}
                            onChange={(e) =>
                                setFeatured(
                                    e.target.checked
                                )
                            }
                            disabled={isSaving}
                            className="mt-1 h-5 w-5 rounded"
                        />

                        <div>
                            <p className="font-medium text-gray-900">
                                Producto destacado
                            </p>

                            <p className="text-sm text-gray-500">
                                Podremos utilizarlo posteriormente para mostrar productos destacados.
                            </p>
                        </div>

                    </label>

                </div>
            </section>

            {/* ERROR */}

            {error && (
                <div
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                >
                    <strong>
                        No se pudo guardar:
                    </strong>{" "}
                    {error}
                </div>
            )}

            {/* BOTONES */}

            <div className="flex flex-col-reverse gap-3 pb-8 sm:flex-row sm:justify-end">

                <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="rounded-xl border px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Cancelar
                </button>

                <button
                    type="submit"
                    disabled={isSaving}
                    className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSaving
                        ? "Guardando..."
                        : isEditing
                            ? "Guardar cambios"
                            : "Guardar producto"}
                </button>

            </div>

        </form>
    );
}