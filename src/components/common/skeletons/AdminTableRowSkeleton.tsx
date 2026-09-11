/**
 * AdminTableRowSkeleton
 * Reusable skeleton for admin table rows.
 * Accepts `columns` count and `rows` count to generate matching placeholders.
 * Renders inside existing `<tbody>` — does NOT create its own `<table>`.
 * Uses DaisyUI `skeleton` class for theme-aware shimmer.
 */

interface AdminTableRowSkeletonProps {
  /** Number of columns to render per row */
  columns: number;
  /** Number of skeleton rows to render (default: 5) */
  rows?: number;
}

function AdminTableRowSkeleton({
  columns,
  rows = 5,
}: AdminTableRowSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <tr key={rowIdx} aria-hidden="true">
          {Array.from({ length: columns }).map((_, colIdx) => (
            <td key={colIdx} className="py-3">
              <div
                className="skeleton h-4 rounded"
                style={{
                  /* Vary widths across columns for visual realism */
                  width:
                    colIdx === 0
                      ? "70%"
                      : colIdx === columns - 1
                      ? "50%"
                      : "60%",
                }}
              />
              {/* Add a secondary line for the first column to mimic name+id pattern */}
              {colIdx === 0 && (
                <div className="skeleton h-3 w-2/5 rounded mt-1.5" />
              )}
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export default AdminTableRowSkeleton;
