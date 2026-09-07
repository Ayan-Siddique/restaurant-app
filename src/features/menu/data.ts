import type { MenuItem } from "./types";

export const menuItems: MenuItem[] = [
  {
    id: "pizza-1",
    name: "Margherita Pizza",
    description: "Classic tomato, mozzarella, and fresh basil.",
    price: 299,
    image: "/images/margherita.jpg",
    category: "pizza",
    isAvailable: true,
  },
  {
    id: "burger-1",
    name: "Classic Burger",
    description: "Juicy beef patty with lettuce, tomato, and cheese.",
    price: 249,
    image: "/images/burger.jpg",
    category: "burger",
    isAvailable: true,
  },
];