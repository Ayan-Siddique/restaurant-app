type StatCardProps = {
  title: string;
  value: string;
  change?: string;
  description?: string;
};

const StatCard = ({
  title,
  value,
  change,
  description,
}: StatCardProps) => {
  return (
    <div className="rounded-xl border bg-base-100 p-4 sm:p-5 shadow-sm">
      <p className="text-xs sm:text-sm opacity-60 font-medium">{title}</p>

      <div className="mt-2 flex items-baseline justify-between gap-2">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{value}</h2>

        {change && (
          <span className="shrink-0 text-xs sm:text-sm font-semibold text-success">
            {change}
          </span>
        )}
      </div>

      {description && (
        <p className="mt-2 text-xs opacity-50 truncate">
          {description}
        </p>
      )}
    </div>
  );
};

export default StatCard;