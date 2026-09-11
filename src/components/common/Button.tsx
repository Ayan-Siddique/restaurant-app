import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "success";
export type ButtonSize = "xs" | "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  to?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  className?: string;
}

const Button = ({
  children = "Explore Menu",
  to,
  onClick,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  type = "button",
  ...rest
}: ButtonProps) => {
  const mode = useAppSelector((state) => state.theme.mode);

  const baseClasses =
    "inline-flex items-center justify-center font-medium cursor-pointer transition-all duration-200 no-underline select-none rounded-none !rounded-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none";

  const sizeClasses: Record<ButtonSize, string> = {
    xs: "px-2.5 py-1 text-xs gap-1",
    sm: "px-3.5 py-1.5 text-xs sm:text-sm gap-1.5",
    md: "px-5 py-2 text-sm sm:text-base gap-2",
    lg: "px-8 py-3 text-base gap-2",
  };

  const primaryBg =
    mode === "veg"
      ? "bg-[#4caf50] hover:bg-[#43a047] active:bg-[#388e3c] text-white shadow-xs"
      : "bg-[#f5a623] hover:bg-[#e09612] active:bg-[#c97e08] text-white shadow-xs";

  const variantClasses: Record<ButtonVariant, string> = {
    primary: primaryBg,
    secondary:
      "bg-neutral-800 hover:bg-neutral-900 text-white dark:bg-neutral-700 dark:hover:bg-neutral-600 shadow-xs",
    outline:
      "border border-neutral-300 dark:border-neutral-700 bg-transparent text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800",
    ghost:
      "bg-transparent text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white",
    danger: "bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-xs",
    success: "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-xs",
  };

  const combinedClasses = `
    ${baseClasses}
    ${sizeClasses[size] || sizeClasses.md}
    ${variantClasses[variant] || variantClasses.primary}
    ${className}
  `.replace(/\s+/g, " ").trim();

  const content = (
    <>
      {loading && (
        <svg
          className="animate-spin h-4 w-4 text-current shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
      )}
      {children}
    </>
  );

  if (to && !onClick && !disabled && !loading) {
    return (
      <Link to={to} className={combinedClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={combinedClasses}
      {...rest}
    >
      {content}
    </button>
  );
};

export default Button;