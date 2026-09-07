import { useState, useEffect, useCallback } from "react";

type RegisterModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin?: () => void;
};

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) => {
  const [value, setValue] = useState("");

  /* close on Escape */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here (e.g., send data to server)
    console.log("Submitted value:", value);
  };

  return (
    <>
      {/* Keyframe animations — matching LoginModal */}
      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(32px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/35 backdrop-blur-sm"
        style={{ animation: "modalFadeIn 0.25s ease-out" }}
        id="register-backdrop"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        {/* Card */}
        <div
          className="relative w-[96vw] sm:w-[92vw] max-w-[420px] px-5 sm:px-6 md:px-8 pt-8 sm:pt-10 pb-7 sm:pb-9 rounded-2xl sm:rounded-3xl overflow-hidden"
          style={{
            background: "linear-gradient(180deg, #e8f4fc 0%, #ddf0fb 18%, #f0f6fb 45%, #ffffff 100%)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)",
            animation: "modalSlideUp 0.3s ease-out",
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="register-title"
        >
          {/* Subtle top shine */}
          <div
            className="absolute -top-15 left-1/2 -translate-x-1/2 w-[300px] h-[120px] rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at center, rgba(186,225,255,0.55) 0%, transparent 70%)",
            }}
          />

          {/* Close button */}
          <button
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/60 border border-gray-200 text-gray-500 cursor-pointer transition-colors hover:bg-white/90 hover:text-gray-900"
            onClick={onClose}
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Icon circle — user-plus icon */}
          <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-4 sm:mb-5 rounded-full bg-gray-800/85 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
            </svg>
          </div>

          {/* Heading */}
          <h2
            className="text-center text-lg sm:text-xl font-bold mb-1.5 text-gray-900"
            id="register-title"
            style={{ fontFamily: "'Rubik', sans-serif" }}
          >
            Create your account
          </h2>
          <p
            className="text-center text-xs sm:text-sm text-gray-500 leading-relaxed mb-5 sm:mb-7 max-w-[300px] mx-auto"
            style={{ fontFamily: "'Roboto', sans-serif" }}
          >
            Join us to order your favourite meals, track deliveries, and more.
          </p>

          

          {/* Form */}
          <form onSubmit={handleSubmit} autoComplete="off">
            {/* Email or Phone input */}
            <div className="relative mb-5 sm:mb-6">
               <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-[18px] sm:h-[18px] text-gray-400 pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              <input
                id="register-input"
                type="email"
                placeholder="enter your email"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
                className="w-full py-3 sm:py-3.5 pl-10 sm:pl-11 pr-4 text-sm sm:text-[0.9rem] text-gray-900 bg-white/75 border-[1.5px] border-gray-200 rounded-xl outline-none transition-all duration-200 focus:border-blue-300 focus:ring-[3px] focus:ring-blue-200/30 placeholder:text-gray-400"
                style={{ fontFamily: "'Roboto', sans-serif" }}
              />
            </div>

            {/* Submit */}
            <button
              className="block w-full py-3 sm:py-3.5 text-sm sm:text-[0.95rem] font-semibold text-white border-none rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
              style={{
                fontFamily: "'Rubik', sans-serif",
                background: "linear-gradient(135deg, #1e1e2e, #2d2d44)",
                boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
              }}
              type="submit"
              id="register-submit"
            >
              Continue
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5 sm:my-6">
            <span className="flex-1 h-px bg-gray-200" />
            <span className="text-xs sm:text-[0.78rem] text-gray-400 whitespace-nowrap" style={{ fontFamily: "'Roboto', sans-serif" }}>
              Or continue with
            </span>
            <span className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Google OAuth — full-width button */}
          <button
            className="flex items-center justify-center gap-2.5 w-full py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border-[1.5px] border-gray-200 bg-white/70 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-gray-300"
            aria-label="Sign up with Google"
            id="register-google"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-[22px] sm:h-[22px]">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span className="text-sm sm:text-[0.9rem] font-medium text-gray-700" style={{ fontFamily: "'Roboto', sans-serif" }}>
              Continue with Google
            </span>
          </button>

          {/* Switch to Login link */}
          <p
            className="text-center text-xs sm:text-sm text-gray-500 mt-5 sm:mt-6 mb-0"
            style={{ fontFamily: "'Roboto', sans-serif" }}
          >
            Already have an account?{" "}
            <button
              type="button"
              className="font-semibold text-gray-900 bg-transparent border-none cursor-pointer underline underline-offset-2 transition-colors hover:text-gray-600"
              onClick={onSwitchToLogin}
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </>
  );
};

export default RegisterModal;
