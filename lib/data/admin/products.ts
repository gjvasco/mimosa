import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

function requireAdmin(user: User | null) {
    if (!user) {
        throw new Error("Usuario no autenticado");
    }

    const adminEmailsEnv = process.env.ADMIN_EMAILS || "";
    const adminEmails = adminEmailsEnv
        .split(",")
        .map((email) => email.trim().toLowerCase());

    if (!user.email || !adminEmails.includes(user.email.toLowerCase())) {
        throw new Error("Acceso denegado: Se requieren permisos de administrador");
    }
}

export async function getAdminProducts() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    requireAdmin(user);

    // Ensure 'Bienestar' category exists
    try {
        const { data: existing } = await supabase
            .from("categories")
            .select("id")
            .eq("slug", "bienestar")
            .maybeSingle();

        if (!existing) {
            const { error: insertError } = await supabase
                .from("categories")
                .insert({
                    name: "Bienestar",
                    slug: "bienestar",
                    sort_order: 7,
                    active: true
                });
            if (insertError) {
                console.error("Failed to insert Bienestar category:", insertError.message);
            } else {
                console.log("Successfully inserted Bienestar category");
            }
        }
    } catch (e) {
        console.error("Failed to seed Bienestar category:", e);
    }

    const { data, error } = await supabase
        .from("products")
        .select(`
            id,
            name,
            slug,
            description,
            price,
            show_price,
            custom_price_label,
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

    return (data || []).map((product) => {
        const categoriesArray = product.categories;
        const category = Array.isArray(categoriesArray)
            ? categoriesArray[0]
            : (categoriesArray || null);

        return {
            ...product,
            categories: category ? {
                id: category.id,
                name: category.name,
                slug: category.slug
            } : null
        };
    });
}


/**
 * Obtener un producto específico para administración
 */
export async function getAdminProduct(id: number) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    requireAdmin(user);

    const { data, error } = await supabase
        .from("products")
        .select(`
            id,
            name,
            slug,
            description,
            price,
            show_price,
            custom_price_label,
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