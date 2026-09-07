import type { ReactNode } from "react";

type Heading2Props = {
  children: ReactNode;
  colorHeading?: string;
  className?: string;
};

const SectionHeading = ({ children, colorHeading, className = "" }: Heading2Props) => {
  return (
    <h2
      className={`m-0 mb-4 ${className}`}
      style={{
        fontFamily: "'Rubik', sans-serif",
        fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
        color: "#2d2d2d",
        fontWeight: "bold",
      }}
    >
      {children}
      {colorHeading && (
        <span style={{ color: "#f5a623" }}> {colorHeading}</span>
      )}
    </h2>
  );
};

export default SectionHeading;