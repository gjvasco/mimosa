"use server";

import { revalidateTag } from "next/cache";
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

export async function toggleProductAvailability(
    productId: number,
    available: boolean
) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    requireAdmin(user);

    const { error } = await supabase
        .from("products")
        .update({ available })
        .eq("id", productId);

    if (error) {
        throw new Error(
            `No se pudo actualizar la disponibilidad del producto: ${error.message}`
        );
    }

    // @ts-expect-error - Next.js 15 canary types may incorrectly require 2 arguments
    revalidateTag("products");
}

/**
 * Limpia la caché del catálogo público (productos y categorías)
 * para que los cambios hechos desde el admin se vean de inmediato
 * en /productos y /, sin esperar al próximo despliegue.
 */
export async function revalidateCatalog() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    requireAdmin(user);

    // @ts-expect-error
    revalidateTag("products");
    // @ts-expect-error
    revalidateTag("categories");
}