"use client";

type SearchBarProps = {
    value: string;
    onChange: (value: string) => void;
};

export default function SearchBar({
    value,
    onChange,
}: SearchBarProps) {
    return (
        <div className="mb-5">
            <label
                htmlFor="product-search"
                className="sr-only"
            >
                Buscar productos
            </label>

            <div className="relative">
                <span
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    aria-hidden="true"
                >
                    🔎
                </span>

                <input
                    id="product-search"
                    type="search"
                    value={value}
                    onChange={(event) =>
                        onChange(event.target.value)
                    }
                    placeholder="¿Qué estás buscando?"
                    autoComplete="off"
                    className="w-full rounded-2xl border border-gray-200 bg-white py-3.5 pl-11 pr-4 text-base text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                />
            </div>
        </div>
    );
}