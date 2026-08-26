import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// This check can be removed, it is just for tutorial purposes
export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/**
 * URL base del sitio, resuelta en tiempo de build a partir de una
 * variable de entorno pública. Se usa (en vez de window.location.origin)
 * para que el servidor y el cliente generen exactamente el mismo HTML
 * y no se produzcan errores de hidratación.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://mimosa-rho.vercel.app";