"use client";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full">
      <label htmlFor="product-search" className="sr-only">
        Buscar productos
      </label>

      <div className="relative flex items-center">
        <span
          className="pointer-events-none absolute left-4 text-muted-foreground text-sm sm:text-base select-none"
          aria-hidden="true"
        >
          🔎
        </span>

        <input
          id="product-search"
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="¿Qué estás buscando? (ej. Velas, Pulseras, Esencias...)"
          autoComplete="off"
          className="
            w-full
            rounded-2xl
            border
            border-border
            bg-card
            py-3
            pl-11
            pr-10
            text-sm
            sm:text-base
            text-foreground
            placeholder:text-muted-foreground
            outline-none
            shadow-sm
            transition-all
            duration-200
            focus:border-brand
            focus:ring-4
            focus:ring-brand/10
          "
        />

        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Limpiar búsqueda"
            className="
              absolute
              right-3
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-full
              bg-muted
              text-xs
              font-bold
              text-muted-foreground
              transition
              hover:bg-brand-light
              hover:text-brand
              active:scale-90
            "
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}