import { useState, useEffect, useCallback } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import Button from "../../../../components/common/Button";
import type { RestaurantOrderSummary } from "../../types";
import {
  ORDER_STATUS_BADGE_CLASSES,
  ORDER_STATUS_LABELS,
} from "../../metadata";
import AdminTableRowSkeleton from "../../../../components/common/skeletons/AdminTableRowSkeleton";
import {
  restaurantOrderService,
  getRestaurantOrderErrorMessage,
} from "../../services/restaurantOrderService";

function formatOrderDate(dateInput: string | Date | null): string {
  if (!dateInput) return "—";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "—";

  const today = new Date();
  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  const timeStr = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  if (isToday) {
    return `Today, ${timeStr}`;
  }

  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const RecentOrders = () => {
  const [orders, setOrders] = useState<RestaurantOrderSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchRecentOrders = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const allOrders = await restaurantOrderService.listOrders();
      const sorted = [...allOrders].sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      });
      setOrders(sorted.slice(0, 5));
    } catch (err) {
      setErrorMessage(getRestaurantOrderErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    restaurantOrderService
      .listOrders()
      .then((allOrders) => {
        if (!isMounted) return;
        const sorted = [...allOrders].sort((a, b) => {
          const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return timeB - timeA;
        });
        setOrders(sorted.slice(0, 5));
      })
      .catch((err) => {
        if (!isMounted) return;
        setErrorMessage(getRestaurantOrderErrorMessage(err));
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="rounded-xl border bg-base-100 p-4 sm:p-5 shadow-sm">
      <div className="mb-4 sm:mb-5 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-base sm:text-lg font-semibold">Recent Orders</h2>

          <p className="text-xs sm:text-sm opacity-60">
            Latest orders placed by customers
          </p>
        </div>

        <Button
          to="/admin/orders"
          variant="ghost"
          size="sm"
        >
          View All
        </Button>
      </div>

      {errorMessage ? (
        <div className="flex flex-col items-center justify-center py-10 text-center px-4">
          <AlertCircle className="h-8 w-8 text-error mb-2" />
          <p className="text-sm font-semibold text-error mb-1">
            Failed to load recent orders
          </p>
          <p className="text-xs opacity-60 mb-4 max-w-sm">{errorMessage}</p>
          <Button
            type="button"
            onClick={fetchRecentOrders}
            variant="outline"
            size="sm"
            className="gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Retry
          </Button>
        </div>
      ) : !isLoading && orders.length === 0 ? (
        <div className="py-12 text-center text-sm opacity-60">
          No recent orders found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-sm sm:table-md w-full min-w-[520px]">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <AdminTableRowSkeleton columns={5} rows={5} />
              ) : (
                orders.map((order) => (
                <tr key={order.id}>
                  <td className="font-medium whitespace-nowrap">
                    {order.orderNumber || `#${order.id.slice(0, 8)}`}
                  </td>

                  <td className="whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-medium">{order.customer.name}</span>
                      {order.customer.phone && (
                        <span className="text-[11px] opacity-60">
                          {order.customer.phone}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="whitespace-nowrap font-medium">
                    ₹{order.total.toLocaleString("en-IN")}
                  </td>

                  <td className="whitespace-nowrap">
                    <span
                      className={`badge badge-sm sm:badge-md capitalize ${
                        ORDER_STATUS_BADGE_CLASSES[order.status] || "badge-ghost"
                      }`}
                    >
                      {ORDER_STATUS_LABELS[order.status] || order.status}
                    </span>
                  </td>

                  <td className="text-xs sm:text-sm opacity-60 whitespace-nowrap">
                    {formatOrderDate(order.createdAt)}
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default RecentOrders;