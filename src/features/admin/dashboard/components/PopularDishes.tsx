type PopularDish = {
  id: string;
  name: string;
  category: string;
  image: string;
  ordersSold: number;
  revenue: number;
};

const popularDishes: PopularDish[] = [
  {
    id: "1",
    name: "Margherita Pizza",
    category: "Pizza",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002",
    ordersSold: 142,
    revenue: 42478,
  },
  {
    id: "2",
    name: "Classic Cheese Burger",
    category: "Burger",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
    ordersSold: 118,
    revenue: 23582,
  },
  {
    id: "3",
    name: "Creamy Alfredo Pasta",
    category: "Pasta",
    image:
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601",
    ordersSold: 96,
    revenue: 23904,
  },
  {
    id: "4",
    name: "Chocolate Lava Cake",
    category: "Dessert",
    image:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c",
    ordersSold: 81,
    revenue: 14580,
  },
  {
    id: "5",
    name: "Pepperoni Pizza",
    category: "Pizza",
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e",
    ordersSold: 74,
    revenue: 22126,
  },
];

const PopularDishes = () => {
  return (
    <section className="rounded-xl border bg-base-100 p-4 sm:p-5 shadow-sm">
      <div className="mb-4 sm:mb-5">
        <h2 className="text-base sm:text-lg font-semibold">Popular Dishes</h2>

        <p className="text-xs sm:text-sm opacity-60">
          Best-performing dishes for the selected period
        </p>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {popularDishes.map((dish, index) => (
          <div
            key={dish.id}
            className="flex items-center gap-2.5 sm:gap-3"
          >
            <span className="w-4 sm:w-5 text-xs sm:text-sm font-semibold opacity-50 shrink-0">
              {index + 1}
            </span>

            <img
              src={dish.image}
              alt={dish.name}
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg object-cover shrink-0"
            />

            <div className="min-w-0 flex-1">
              <h3 className="truncate text-xs sm:text-sm font-medium">
                {dish.name}
              </h3>

              <p className="truncate text-[11px] sm:text-xs opacity-50">
                {dish.category} · {dish.ordersSold} sold
              </p>
            </div>

            <span className="shrink-0 text-xs sm:text-sm font-semibold text-right">
              ₹{dish.revenue.toLocaleString("en-IN")}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PopularDishes;