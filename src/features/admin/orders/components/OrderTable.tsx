import type { AdminOrder, OrderStatus } from "../../types";

type OrderTableProps = {
  orders: AdminOrder[];
  onStatusChange: (id: string, status: OrderStatus) => void;
};

const statusClasses: Record<OrderStatus, string> = {
  Pending: "badge-warning",
  Confirmed: "badge-info",
  Preparing: "badge-primary",
  Ready: "badge-secondary",
  Completed: "badge-success",
  Cancelled: "badge-error",
};

const OrderTable = ({ orders, onStatusChange }: OrderTableProps) => {
  return (
    <section className="rounded-xl border bg-base-100 shadow-sm">
      <div className="overflow-x-auto">
        <table className="table table-sm sm:table-md w-full min-w-[720px]">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-sm opacity-60">
                  No orders found matching your criteria.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id}>
                  <td className="font-medium whitespace-nowrap">
                    {order.id}
                  </td>

                  <td className="whitespace-nowrap font-medium">
                    {order.customerName}
                  </td>

                  <td className="whitespace-nowrap">{order.items}</td>

                  <td className="whitespace-nowrap font-medium">
                    ₹{order.amount.toLocaleString("en-IN")}
                  </td>

                  <td className="whitespace-nowrap">
                    <select
                      className={`select select-xs sm:select-sm ${statusClasses[order.status]} font-medium w-full max-w-[130px]`}
                      value={order.status}
                      onChange={(event) =>
                        onStatusChange(
                          order.id,
                          event.target.value as OrderStatus
                        )
                      }
                      aria-label={`Change status for order ${order.id}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Ready">Ready</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>

                  <td className="whitespace-nowrap text-xs sm:text-sm opacity-60">
                    {order.orderDate}
                  </td>

                  <td className="whitespace-nowrap">
                    <button className="btn btn-ghost btn-xs sm:btn-sm">
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default OrderTable;
