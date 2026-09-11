import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";

export interface NotFoundProps {
  title?: string;
  message?: string;
  buttonText?: string;
  onAction?: () => void;
  actionHref?: string;
  className?: string;
}

export const NotFound: React.FC<NotFoundProps> = ({
  title = "Nothing found",
  message = "No dishes in this category with the current filters",
  buttonText = "Checkout our Menu",
  onAction,
  actionHref = "/menu",
  className = "",
}) => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (onAction) {
      onAction();
    } else if (actionHref) {
      navigate(actionHref);
    }
  };

  return (
    <>


      <section
        className={`w-full min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 text-center ${className}`}
        style={{
          fontFamily: "'Roboto', sans-serif",
          background: "#f9f5f0",
        }}
      >
        <div className="flex flex-col items-center max-w-md mx-auto">
          {/* ── Utensil & Plate Icon ── */}
          <div className="mb-6 text-[#1a1a1a]" aria-hidden="true">
            <svg
              className="w-16 h-16 sm:w-18 sm:h-18"
              viewBox="0 0 64 64"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Fork (Left) */}
              <path d="M14 14v10c0 2.2 1.6 4 3.6 4.4V48c0 1.1.9 2 2 2s2-.9 2-2V28.4c2-.4 3.6-2.2 3.6-4.4V14h-2.2v9c0 .7-.6 1.3-1.3 1.3s-1.3-.6-1.3-1.3v-9h-1.6v9c0 .7-.6 1.3-1.3 1.3s-1.3-.6-1.3-1.3v-9H14z" />

              {/* Plate with inner rim (Center) */}
              <circle cx="32" cy="32" r="16" fill="#1a1a1a" />
              <circle cx="32" cy="32" r="13" fill="#f9f5f0" />
              <circle cx="32" cy="32" r="10.5" fill="#1a1a1a" />

              {/* Knife (Right) */}
              <path d="M46.8 14c0 0-4 3.5-4 13.5v1.2c0 1.8 1.4 3.3 3.2 3.3h1.2V48c0 1.1.9 2 2 2s2-.9 2-2V14h-4.4z" />
            </svg>
          </div>

          {/* ── Title ── */}
          <h2
            className="m-0 mb-3 tracking-tight"
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.35rem)",
              fontWeight: 700,
              color: "#18181b",
              lineHeight: 1.2,
            }}
          >
            {title}
          </h2>

          {/* ── Subtitle / Message ── */}
          <p
            className="m-0 mb-7 text-sm sm:text-base font-normal max-w-sm"
            style={{
              color: "#6b7280",
              lineHeight: 1.5,
            }}
          >
            {message}
          </p>

          {/* ── Action Button ── */}
          {buttonText && (
            <Button
              onClick={handleButtonClick}
              variant="primary"
              size="md"
              className="px-7 py-2.5 !rounded-xl font-semibold shadow-md hover:shadow-lg"
            >
              {buttonText}
            </Button>
          )}
        </div>
      </section>
    </>
  );
};

export default NotFound;
