/* Display metadata for each category, keyed by Category.id */
export const CATEGORY_META: Record<
  string,
  { icon: string; description: string; image: string }
> = {
  pizza: {
    icon: "🍕",
    description:
      "Food is any substance consumed to provide nutritional support for an organism.",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop",
  },
  burger: {
    icon: "🍔",
    description:
      "Food is any substance consumed to provide nutritional support for an organism.",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop",
  },
  pasta: {
    icon: "🍝",
    description:
      "Food is any substance consumed to provide nutritional support for an organism.",
    image:
      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=400&fit=crop",
  },
  dessert: {
    icon: "🧁",
    description:
      "Food is any substance consumed to provide nutritional support for an organism.",
    image:
      "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=400&fit=crop",
  },
};

export const FALLBACK_META = {
  icon: "🍽️",
  description:
    "Food is any substance consumed to provide nutritional support for an organism.",
  image:
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop",
};
