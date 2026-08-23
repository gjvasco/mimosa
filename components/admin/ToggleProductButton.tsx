"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toggleProductAvailability } from "@/lib/actions/products";

type ToggleProductButtonProps = {
    productId: number;
    available: boolean;
};

export default function ToggleProductButton({
    productId,
    available,
}: ToggleProductButtonProps) {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    async function handleToggle() {
        const newAvailability = !available;

        const action = newAvailability
            ? "activar"
            : "desactivar";

        const confirmed = window.confirm(
            `¿Quieres ${action} este producto?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setIsLoading(true);

            await toggleProductAvailability(
                productId,
                newAvailability
            );

            router.refresh();
        } catch (error) {
            console.error(error);

            alert(
                error instanceof Error
                    ? error.message
                    : "No se pudo actualizar el producto."
            );
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <button
            type="button"
            onClick={handleToggle}
            disabled={isLoading}
            className={
                available
                    ? "flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    : "flex-1 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            }
        >
            {isLoading
                ? "Actualizando..."
                : available
                    ? "Desactivar"
                    : "Activar"}
        </button>
    );
}