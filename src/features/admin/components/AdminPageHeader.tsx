type AdminPageHeaderProps = {
  title: string;
  description?: string;
  children?: React.ReactNode;
};

const AdminPageHeader = ({
  title,
  description,
  children,
}: AdminPageHeaderProps) => {
  return (
    <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{title}</h1>

        {description && (
          <p className="mt-1 text-xs sm:text-sm opacity-60">
            {description}
          </p>
        )}
      </div>

      {children && (
        <div className="w-full sm:w-auto shrink-0 flex items-center gap-2">
          {children}
        </div>
      )}
    </header>
  );
};

export default AdminPageHeader;