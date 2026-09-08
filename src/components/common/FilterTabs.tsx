import { useAppSelector } from "../../store/hooks";

interface FilterTabsProps {
  tabs: readonly string[];
  activeTab: string;
  onChange: (tab: string) => void;
  className?: string;
}

function FilterTabs({
  tabs,
  activeTab,
  onChange,
  className = "",
}: FilterTabsProps) {
  const mode = useAppSelector((state) => state.theme.mode);

  const theme =
    mode === "veg"
      ? {
          active: "#22c55e",
          activeText: "#fff",
          inactive: "#fff",
          inactiveText: "#2d2d2d",
          border: "#e0ddd8",
          shadow: "rgba(34, 197, 94, 0.3)",
        }
      : {
          active: "#f5a623",
          activeText: "#fff",
          inactive: "#fff",
          inactiveText: "#2d2d2d",
          border: "#e0ddd8",
          shadow: "rgba(245, 166, 35, 0.3)",
        };

  return (
    <div
      className={`flex flex-wrap justify-center gap-2 sm:gap-3 ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab;

        return (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            className="cursor-pointer rounded px-4 py-1.5 text-xs font-medium transition-all duration-300 sm:px-6 sm:py-2 sm:text-sm"
            style={{
              background: isActive ? theme.active : theme.inactive,
              color: isActive ? theme.activeText : theme.inactiveText,
              border: `2px solid ${
                isActive ? theme.active : theme.border
              }`,
              boxShadow: isActive
                ? `0 4px 12px ${theme.shadow}`
                : "none",
            }}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}

export default FilterTabs;