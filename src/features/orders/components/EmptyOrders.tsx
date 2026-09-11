import { Clock } from "lucide-react";
import Button from "../../../components/common/Button";

export function EmptyOrders() {
  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-24 px-4 text-center">
      {/* Icon Circle */}
      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#f5a623]/10 flex items-center justify-center text-[#f5a623] mb-6 shadow-xs">
        <Clock size={48} strokeWidth={1.5} />
      </div>

      <h3
        className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2"
        style={{ fontFamily: "'Rubik', sans-serif" }}
      >
        No orders yet
      </h3>

      <p className="text-sm sm:text-base text-neutral-500 max-w-md mb-8">
        When you place your first order, you'll see it here. Explore our delicious menu and treat yourself!
      </p>

      <Button
        to="/menu"
        className="rounded-full !px-8 !py-3 font-semibold shadow-md hover:shadow-lg transition-transform"
      >
        Browse Menu
      </Button>
    </div>
  );
}

export default EmptyOrders;
