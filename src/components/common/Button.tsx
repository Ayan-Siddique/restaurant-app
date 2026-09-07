import type { ReactNode, MouseEventHandler } from "react";
import { Link } from "react-router-dom";

type ButtonProps = {
  children?: ReactNode;
  to?: string;
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  className?: string;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "veg" | "non-veg";
};

const Button = ({
  children = "Explore Menu",
  to = "/menu",
  onClick,
  className = "",
  type = "button",
  variant = "primary",
}: ButtonProps) => {
  const isPrimary = variant === "primary";
  const bgDefault = isPrimary ? "#f5a623" : variant === "veg" ? "#4caf50" : "#f44336";
  const bgHover = "#000000";

  const baseClasses = `inline-block px-8 py-3 text-base font-medium no-underline transition-all duration-300 cursor-pointer ${className}`;

  const baseStyle: React.CSSProperties = {
    background: bgDefault,
    color: "#fff",
    fontFamily: "'Roboto', sans-serif",
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.background = bgHover;
    e.currentTarget.style.transform = "translateY(-2px)";
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.background = bgDefault;
    e.currentTarget.style.transform = "translateY(0)";
  };

  if (to && !onClick) {
    return (
      <Link
        to={to}
        className={baseClasses}
        style={baseStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={baseClasses}
      style={{ ...baseStyle, border: "none" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </button>
  );
};

export default Button;