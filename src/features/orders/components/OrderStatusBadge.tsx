import type { OrderStatus, PaymentStatus } from "../types";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: "sm" | "md" | "lg";
  className?: string;
}

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const orderStatusConfig: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-amber-100 text-amber-800 border-amber-300",
  },
  accepted: {
    label: "Accepted",
    className: "bg-blue-100 text-blue-800 border-blue-300",
  },
  preparing: {
    label: "Preparing",
    className: "bg-orange-100 text-orange-900 border-orange-300 font-semibold",
  },
  delivered: {
    label: "Delivered",
    className: "bg-emerald-100 text-emerald-800 border-emerald-300",
  },
  declined: {
    label: "Declined",
    className: "bg-rose-100 text-rose-800 border-rose-300",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-neutral-100 text-neutral-600 border-neutral-300",
  },
};

const paymentStatusConfig: Record<
  PaymentStatus,
  { label: string; className: string }
> = {
  success: {
    label: "Success",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  pending: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  failed: {
    label: "Failed",
    className: "bg-rose-50 text-rose-700 border-rose-200",
  },
  expired: {
    label: "Expired",
    className: "bg-neutral-100 text-neutral-600 border-neutral-200",
  },
  refunded: {
    label: "Refunded",
    className: "bg-neutral-100 text-neutral-700 border-neutral-200",
  },
};

export function OrderStatusBadge({
  status,
  size = "md",
  className = "",
}: OrderStatusBadgeProps) {
  const config = orderStatusConfig[status] || {
    label: status,
    className: "bg-neutral-100 text-neutral-800 border-neutral-300",
  };

  const sizeClasses = {
    sm: "text-[11px] px-2.5 py-0.5",
    md: "text-xs px-3 py-1",
    lg: "text-sm px-3.5 py-1.5",
  };

  return (
    <span
      className={`inline-flex items-center justify-center font-medium rounded-full border shadow-2xs whitespace-nowrap transition-colors ${config.className} ${sizeClasses[size]} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-75" />
      {config.label}
    </span>
  );
}

export function PaymentStatusBadge({
  status,
  size = "md",
  className = "",
}: PaymentStatusBadgeProps) {
  const config = paymentStatusConfig[status] || {
    label: status,
    className: "bg-neutral-50 text-neutral-600 border-neutral-200",
  };

  const sizeClasses = {
    sm: "text-[10px] px-2 py-0.5",
    md: "text-[11px] px-2.5 py-0.5",
    lg: "text-xs px-3 py-1",
  };

  return (
    <span
      className={`inline-flex items-center justify-center font-medium rounded-full border whitespace-nowrap ${config.className} ${sizeClasses[size]} ${className}`}
    >
      {config.label}
    </span>
  );
}

export default OrderStatusBadge;
