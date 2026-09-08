import AdminPageHeader from "../../components/AdminPageHeader";
import OrderTable from "../components/OrderTable";
import { adminOrders } from "../../data";
import type { AdminOrder,OrderStatus } from "../../types";
import { useState } from "react";

const AdminOrdersPage = () => {
  const [status, setStatus] = useState<"All" | OrderStatus>("All");
  const [search, setSearch] = useState("");
   const [orders, setOrders] =
    useState<AdminOrder[]>(adminOrders);


const handleStatusChange = (
  id: string,
  newStatus: OrderStatus
) => {
  setOrders((currentOrders) =>
    currentOrders.map((order) =>
      order.id === id
        ? { ...order, status: newStatus }
        : order
    )
  );
};

  const filteredOrders = orders.filter((order) => {
  const matchesStatus =
    status === "All" || order.status === status;

  const searchTerm = search.toLowerCase();

  const matchesSearch =
    order.id.toLowerCase().includes(searchTerm) ||
    order.customerName.toLowerCase().includes(searchTerm);

  return matchesStatus && matchesSearch;
});
  return (
    <div>
      <AdminPageHeader
        title="Order Management"
        description="View and manage customer orders."
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="text"
          placeholder="Search order or customer..."
          className="input input-bordered w-full sm:max-w-sm"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          className="select select-bordered w-full sm:w-auto sm:min-w-[160px]"
          value={status}
          onChange={(event) =>
            setStatus(event.target.value as "All" | OrderStatus)
          }
        >
          <option value="All">All Orders</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Preparing">Preparing</option>
          <option value="Ready">Ready</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <OrderTable orders={filteredOrders} onStatusChange={handleStatusChange} />
    </div>
  );
};

export default AdminOrdersPage;
