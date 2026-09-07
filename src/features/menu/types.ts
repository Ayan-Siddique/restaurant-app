export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: "pizza" | "burger" | "pasta" | "dessert";
  isAvailable: boolean;
}