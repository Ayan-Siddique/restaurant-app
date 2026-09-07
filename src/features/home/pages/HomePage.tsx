import Hero from "../components/Hero";
import Categories from "../components/Categories";
import PopularDishes from "../components/PopularDishes";
import type { Category } from "../types";
import type { MenuItem } from "../../menu/types";

const categories: Category[] = [
  { id: "pizza", name: "Pizza" },
  { id: "burger", name: "Burgers" },
  { id: "pasta", name: "Pasta" },
  { id: "dessert", name: "Desserts" },
];

const popularDishes: MenuItem[] = [
  {
    id: "pizza-1",
    name: "Margherita Pizza",
    description: "Classic tomato, mozzarella, and fresh basil.",
    price: 299,
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&h=400&fit=crop",
    category: "pizza",
    isAvailable: true,
  },
  {
    id: "burger-1",
    name: "Classic Burger",
    description: "Juicy beef patty with lettuce, tomato, and cheese.",
    price: 249,
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=400&fit=crop",
    category: "burger",
    isAvailable: true,
  },
  {
    id: "pasta-1",
    name: "Creamy Alfredo",
    description: "Rich and creamy fettuccine alfredo with parmesan.",
    price: 349,
    image:
      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&h=400&fit=crop",
    category: "pasta",
    isAvailable: true,
  },
  {
    id: "dessert-1",
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with a molten center.",
    price: 199,
    image:
      "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&h=400&fit=crop",
    category: "dessert",
    isAvailable: true,
  },
  {
    id: "pizza-2",
    name: "Pepperoni Special",
    description: "Loaded pepperoni with mozzarella and oregano.",
    price: 399,
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&h=400&fit=crop",
    category: "pizza",
    isAvailable: true,
  },
  {
    id: "burger-2",
    name: "BBQ Bacon Burger",
    description: "Smoky BBQ sauce, crispy bacon, and cheddar.",
    price: 329,
    image:
      "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500&h=400&fit=crop",
    category: "burger",
    isAvailable: true,
  },
];

function HomePage() {
  return (
    <div style={{ background: "#f9f5f0" }}>
      <Hero />
      <Categories categories={categories} />
      <PopularDishes items={popularDishes} />
    </div>
  );
}

export default HomePage;