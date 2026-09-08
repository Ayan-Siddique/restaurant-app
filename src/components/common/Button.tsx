import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";

type ButtonProps = {
  children?: ReactNode;
  to?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  type?: "button" | "submit" | "reset";
};

const Button = ({
  children = "Explore Menu",
  to,
  onClick,
  className = "",
  type = "button",
}: ButtonProps) => {

const mode = useAppSelector((state) => state.theme.mode);

  const variantClasses = {
    primary: "bg-[#f5a623]",
    veg: "bg-[#4caf50]",
  };

  const classes = `
    inline-block cursor-pointer px-8 py-3 text-base font-medium
    text-white no-underline transition-all duration-300
    hover:-translate-y-0.5 hover:bg-black
    ${mode === "veg" ? variantClasses.veg : variantClasses.primary}
    ${className}
  `;

  if (to && !onClick) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={classes}
    >
      {children}
    </button>
  );
};

export default Button;