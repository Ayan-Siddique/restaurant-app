import { useState } from "react";
import AdminPageHeader from "../../components/AdminPageHeader";
import { adminCustomers } from "../../data";
import type { AdminCustomer } from "../../types";
import { Search } from "lucide-react";

const AdminCustomersPage = () => {
  const [search, setSearch] = useState("");
  const [customers] = useState<AdminCustomer[]>(adminCustomers);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  return (
    <div>
      <AdminPageHeader
        title="Customer Management"
        description="View customer details, purchase history, and spending metrics."
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <label className="input input-bordered flex w-full items-center gap-2 sm:max-w-sm">
          <Search size={18} className="opacity-50 shrink-0" />
          <input
            type="text"
            className="grow w-full min-w-0"
            placeholder="Search customer name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
      </div>

      <section className="rounded-xl border bg-base-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="table table-sm sm:table-md w-full min-w-[640px]">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Contact</th>
                <th>Total Orders</th>
                <th>Total Spent</th>
                <th>Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-sm opacity-60">
                    No customers found matching your search.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id}>
                    <td className="whitespace-nowrap">
                      <div className="font-medium">{cust.name}</div>
                      <div className="text-xs opacity-50">{cust.id}</div>
                    </td>
                    <td className="whitespace-nowrap">
                      <div>{cust.email}</div>
                      <div className="text-xs opacity-60">{cust.phone}</div>
                    </td>
                    <td className="whitespace-nowrap">{cust.totalOrders} orders</td>
                    <td className="whitespace-nowrap font-semibold text-primary">
                      ₹{cust.totalSpent.toLocaleString("en-IN")}
                    </td>
                    <td className="whitespace-nowrap text-xs sm:text-sm opacity-60">
                      {cust.joinedDate}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminCustomersPage;
