/**
 * Formatting utilities for customer orders
 * Uses Indian locale ('en-IN') and ₹ currency
 */

export function formatCurrency(amount: number): string {
  if (typeof amount !== "number" || isNaN(amount)) {
    return "₹0";
  }
  // Check if amount has fractional paise
  const hasDecimals = amount % 1 !== 0;
  return `₹${amount.toLocaleString("en-IN", {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  })}`;
}

export function formatOrderDate(dateInput: string | Date): string {
  try {
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    if (isNaN(date.getTime())) {
      return String(dateInput);
    }

    // Format: "Sep 9, 2026 · 2:35 PM"
    const datePart = new Intl.DateTimeFormat("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);

    const timePart = new Intl.DateTimeFormat("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);

    return `${datePart} · ${timePart}`;
  } catch {
    return String(dateInput);
  }
}
