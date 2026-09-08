import AdminPageHeader from "../../components/AdminPageHeader";
import StatCard from "../components/StatCard";
import RevenueOverview from "../components/RevenueOverview";
import RecentOrders from "../components/RecentOrders";
import PopularDishes from "../components/PopularDishes";

const AdminDashboardPage = () => {
  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        description="Here's what's happening with your restaurant."
      />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Orders"
          value="1,248"
          change="+12.5%"
          description="vs previous period"
        />

        <StatCard
          title="Total Revenue"
          value="₹3,84,920"
          change="+8.4%"
          description="vs previous period"
        />

        <StatCard
          title="Total Customers"
          value="2,430"
          change="+5.2%"
          description="vs previous period"
        />

        <StatCard
          title="Menu Items"
          value="86"
          description="74 active · 12 unavailable"
        />
      </section>

      <RevenueOverview />

      <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentOrders />
        <PopularDishes />
      </section>
    </div>
  );
};

export default AdminDashboardPage;
