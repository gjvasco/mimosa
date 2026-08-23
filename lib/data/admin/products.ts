import { createClient } from "@/lib/supabase/server";

export async function getAdminProducts() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Usuario no autenticado");
    }

    const { data, error } = await supabase
        .from("products")
        .select(`
            id,
            name,
            slug,
            description,
            price,
            available,
            featured,
            image_url,
            created_at,
            updated_at,
            categories (
                id,
                name,
                slug
            )
        `)
        .order("created_at", {
            ascending: false,
        });

    if (error) {
        throw new Error(error.message);
    }

    return data;
}


/**
 * Obtener un producto específico para administración
 */
export async function getAdminProduct(id: number) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Usuario no autenticado");
    }

    const { data, error } = await supabase
        .from("products")
        .select(`
            id,
            name,
            slug,
            description,
            price,
            available,
            featured,
            image_url,
            created_at,
            updated_at,
            categories (
                id,
                name,
                slug
            )
        `)
        .eq("id", id)
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}