type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Preparing"
  | "Ready"
  | "Completed"
  | "Cancelled";

type Order = {
  id: string;
  customer: string;
  items: number;
  amount: number;
  status: OrderStatus;
  date: string;
};

const recentOrders: Order[] = [
  {
    id: "#ORD-1024",
    customer: "Rahul Verma",
    items: 2,
    amount: 598,
    status: "Preparing",
    date: "Today, 12:42 PM",
  },
  {
    id: "#ORD-1023",
    customer: "Priya Sharma",
    items: 3,
    amount: 849,
    status: "Pending",
    date: "Today, 12:28 PM",
  },
  {
    id: "#ORD-1022",
    customer: "Aman Singh",
    items: 1,
    amount: 299,
    status: "Ready",
    date: "Today, 12:15 PM",
  },
  {
    id: "#ORD-1021",
    customer: "Neha Gupta",
    items: 4,
    amount: 1120,
    status: "Completed",
    date: "Today, 11:54 AM",
  },
  {
    id: "#ORD-1020",
    customer: "Arjun Das",
    items: 2,
    amount: 549,
    status: "Cancelled",
    date: "Today, 11:37 AM",
  },
];

const statusClasses: Record<OrderStatus, string> = {
  Pending: "badge-warning",
  Confirmed: "badge-info",
  Preparing: "badge-primary",
  Ready: "badge-secondary",
  Completed: "badge-success",
  Cancelled: "badge-error",
};

const RecentOrders = () => {
  return (
    <section className="rounded-xl border bg-base-100 p-4 sm:p-5 shadow-sm">
      <div className="mb-4 sm:mb-5 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-base sm:text-lg font-semibold">Recent Orders</h2>

          <p className="text-xs sm:text-sm opacity-60">
            Latest orders placed by customers
          </p>
        </div>

        <button className="btn btn-ghost btn-xs sm:btn-sm">
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-sm sm:table-md w-full min-w-[520px]">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id}>
                <td className="font-medium whitespace-nowrap">{order.id}</td>

                <td className="whitespace-nowrap">{order.customer}</td>

                <td className="whitespace-nowrap">{order.items}</td>

                <td className="whitespace-nowrap font-medium">₹{order.amount.toLocaleString("en-IN")}</td>

                <td className="whitespace-nowrap">
                  <span
                    className={`badge badge-sm sm:badge-md ${statusClasses[order.status]}`}
                  >
                    {order.status}
                  </span>
                </td>

                <td className="text-xs sm:text-sm opacity-60 whitespace-nowrap">
                  {order.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default RecentOrders;