import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";

export const instant = false;

export default function AdminPage() {
    return (
        <main className="min-h-screen bg-gray-50 p-6 md:p-8">
            <div className="mx-auto max-w-5xl">

                {/* Encabezado */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
                            Mimosa Alelí
                        </p>

                        <h1 className="mt-1 text-3xl font-bold text-gray-900">
                            Administración
                        </h1>

                        <p className="mt-2 text-gray-600">
                            Gestiona fácilmente los productos de tu catálogo.
                        </p>
                    </div>
                    <LogoutButton variant="destructive" />
                </div>

                {/* Opciones principales */}
                <div className="grid gap-5 md:grid-cols-2">

                    {/* Productos */}
                    <Link
                        href="/admin/productos"
                        className="group rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-2xl">
                            🛍️
                        </div>

                        <h2 className="mt-5 text-xl font-semibold text-gray-900">
                            Productos
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-gray-600">
                            Crea, modifica, activa o desactiva los productos
                            disponibles en el catálogo.
                        </p>

                        <div className="mt-5 text-sm font-medium text-gray-900">
                            Gestionar productos →
                        </div>
                    </Link>

                    {/* Catálogo */}
                    <Link
                        href="/productos"
                        className="group rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-2xl">
                            👀
                        </div>

                        <h2 className="mt-5 text-xl font-semibold text-gray-900">
                            Ver catálogo
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-gray-600">
                            Consulta el catálogo tal como lo ven tus clientes.
                        </p>

                        <div className="mt-5 text-sm font-medium text-gray-900">
                            Ver catálogo →
                        </div>
                    </Link>

                </div>

                {/* Acceso rápido */}
                <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Acciones rápidas
                    </h2>

                    <div className="mt-4">
                        <Link
                            href="/admin/productos/nuevo"
                            className="inline-flex items-center rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
                        >
                            + Nuevo producto
                        </Link>
                    </div>
                </div>

            </div>
        </main>
    );
}