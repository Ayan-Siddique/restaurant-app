const overviewData = [
  { day: "Mon", orders: 42, revenue: 12450 },
  { day: "Tue", orders: 51, revenue: 15820 },
  { day: "Wed", orders: 38, revenue: 11200 },
  { day: "Thu", orders: 64, revenue: 19450 },
  { day: "Fri", orders: 58, revenue: 17680 },
  { day: "Sat", orders: 72, revenue: 22100 },
  { day: "Sun", orders: 67, revenue: 20450 },
];

const RevenueOverview = () => {
  const maxRevenue = Math.max(
    ...overviewData.map((item) => item.revenue)
  );

  return (
    <section className="mt-6 rounded-xl border bg-base-100 p-4 sm:p-5 shadow-sm">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-semibold">
            Revenue Overview
          </h2>

          <p className="text-xs sm:text-sm opacity-60">
            Revenue and orders for the selected period
          </p>
        </div>

        <select className="select select-sm select-bordered w-full sm:w-auto sm:min-w-[140px]">
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>Today</option>
        </select>
      </div>

      <div className="flex h-56 sm:h-64 items-end gap-1.5 sm:gap-4 overflow-x-auto pb-2">
        {overviewData.map((item) => {
          const height = `${(item.revenue / maxRevenue) * 100}%`;

          return (
            <div
              key={item.day}
              className="flex h-full flex-1 min-w-[28px] sm:min-w-0 flex-col items-center justify-end gap-2"
            >
              <div className="flex h-full w-full items-end justify-center">
                <div
                  className="w-full max-w-[48px] rounded-t-md bg-primary/80 transition-all hover:bg-primary"
                  style={{ height }}
                  title={`₹${item.revenue.toLocaleString("en-IN")} · ${item.orders} orders`}
                />
              </div>

              <span className="text-[11px] sm:text-xs font-medium opacity-60">
                {item.day}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-4 sm:gap-6 text-sm border-t pt-4">
        <div>
          <span className="text-xs opacity-60 block">Total Orders</span>
          <p className="font-semibold text-sm sm:text-base">
            {overviewData.reduce(
              (total, item) => total + item.orders,
              0
            )}
          </p>
        </div>

        <div>
          <span className="text-xs opacity-60 block">Total Revenue</span>
          <p className="font-semibold text-sm sm:text-base text-primary">
            ₹
            {overviewData
              .reduce((total, item) => total + item.revenue, 0)
              .toLocaleString("en-IN")}
          </p>
        </div>
      </div>
    </section>
  );
};

export default RevenueOverview;