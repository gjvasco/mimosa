"use server";

import { createClient } from "@/lib/supabase/server";

export async function getAdminProduct(productId: number) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Usuario no autenticado.");
    }

    const { data, error } = await supabase
        .from("products")
        .select(`
            id,
            category_id,
            name,
            slug,
            description,
            price,
            image_url,
            available,
            featured,
            created_at,
            updated_at,
            categories (
                id,
                name,
                slug
            )
        `)
        .eq("id", productId)
        .single();

    if (error) {
        throw new Error(
            `No se pudo obtener el producto: ${error.message}`
        );
    }

    if (!data) return null;

    const categoriesArray = data.categories;
    const category = Array.isArray(categoriesArray)
        ? categoriesArray[0]
        : (categoriesArray || null);

    return {
        ...data,
        categories: category ? {
            id: category.id,
            name: category.name,
            slug: category.slug
        } : null
    };
}

export async function toggleProductAvailability(
    productId: number,
    available: boolean
) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Usuario no autenticado.");
    }

    const { error } = await supabase
        .from("products")
        .update({ available })
        .eq("id", productId);

    if (error) {
        throw new Error(
            `No se pudo actualizar la disponibilidad del producto: ${error.message}`
        );
    }
}