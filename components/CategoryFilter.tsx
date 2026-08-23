"use client";

import { useState } from "react";

type Category = {
    id: number;
    name: string;
    slug: string;
};

type CategoryFilterProps = {
    categories: Category[];
    onCategoryChange: (slug: string) => void;
};

export default function CategoryFilter({
    categories,
    onCategoryChange,
}: CategoryFilterProps) {
    const [selectedCategory, setSelectedCategory] =
        useState("todos");

    function handleCategoryChange(slug: string) {
        setSelectedCategory(slug);
        onCategoryChange(slug);
    }

    return (
        <div className="mb-6 -mx-1">
            <div
                className="flex gap-2 overflow-x-auto px-1 pb-2 scrollbar-hide"
                style={{
                    WebkitOverflowScrolling: "touch",
                }}
            >
                <button
                    type="button"
                    onClick={() =>
                        handleCategoryChange("todos")
                    }
                    className={`min-h-10 shrink-0 rounded-full px-4 text-sm font-medium transition active:scale-95 ${selectedCategory === "todos"
                            ? "bg-gray-900 text-white"
                            : "bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-100"
                        }`}
                >
                    Todos
                </button>

                {categories.map((category) => (
                    <button
                        key={category.id}
                        type="button"
                        onClick={() =>
                            handleCategoryChange(
                                category.slug
                            )
                        }
                        className={`min-h-10 shrink-0 rounded-full px-4 text-sm font-medium transition active:scale-95 ${selectedCategory ===
                                category.slug
                                ? "bg-gray-900 text-white"
                                : "bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-100"
                            }`}
                    >
                        {category.name}
                    </button>
                ))}
            </div>
        </div>
    );
}