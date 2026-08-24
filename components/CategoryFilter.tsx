"use client";

type Category = {
  id: number;
  name: string;
  slug: string;
};

type CategoryFilterProps = {
  categories: Category[];
  selectedCategory?: string;
  onCategoryChange: (slug: string) => void;
};

export default function CategoryFilter({
  categories,
  selectedCategory = "todos",
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div className="w-full">
      {/* Título y sugerencia */}
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-brand">
          Categorías
        </h3>
        <span className="text-[11px] font-medium text-amber sm:hidden select-none">
          Desliza para ver más →
        </span>
      </div>

      {/* Contenedor de Filtros */}
      <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
        <div
          className="
            flex
            gap-2
            overflow-x-auto
            pb-1
            pt-1
            scrollbar-hide
            mask-gradient-x
            sm:flex-wrap
            sm:mask-none
          "
        >
          {/* Botón Todos */}
          <button
            type="button"
            onClick={() => onCategoryChange("todos")}
            className={`
              inline-flex
              items-center
              justify-center
              whitespace-nowrap
              rounded-full
              px-4
              py-2
              text-xs
              sm:text-sm
              font-semibold
              transition-all
              duration-200
              active:scale-95
              ${
                selectedCategory === "todos"
                  ? "bg-brand text-white shadow-md shadow-brand/20 ring-2 ring-brand"
                  : "bg-card text-brand border border-border hover:bg-brand-light hover:border-brand-light"
              }
            `}
          >
            Todos los productos
          </button>

          {/* Botones por Categoría */}
          {categories.map((category) => {
            const isSelected = selectedCategory === category.slug;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => onCategoryChange(category.slug)}
                className={`
                  inline-flex
                  items-center
                  justify-center
                  whitespace-nowrap
                  rounded-full
                  px-4
                  py-2
                  text-xs
                  sm:text-sm
                  font-semibold
                  transition-all
                  duration-200
                  active:scale-95
                  ${
                    isSelected
                      ? "bg-brand text-white shadow-md shadow-brand/20 ring-2 ring-brand"
                      : "bg-card text-brand border border-border hover:bg-brand-light hover:border-brand-light"
                  }
                `}
              >
                {category.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}