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

export async function getProductBySlug(slug: string) {
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
    .eq("slug", slug)
    .eq("available", true)
    .maybeSingle();

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