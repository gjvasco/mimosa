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

    return data;
}