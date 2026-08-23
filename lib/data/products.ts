"use cache";

import { cacheTag } from "next/cache";
import { supabasePublic } from "@/lib/supabase/public";

export async function getProducts() {
  cacheTag("products");

  const { data, error } = await supabasePublic
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
            categories (
                id,
                name,
                slug
            )
        `)
    .eq("available", true)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getCategories() {
  cacheTag("categories");

  const { data, error } = await supabasePublic
    .from("categories")
    .select(`
            id,
            name,
            slug
        `)
    .order("sort_order", {
      ascending: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}