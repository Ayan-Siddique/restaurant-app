import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useAppSelector } from "../store/hooks";

interface MainLayoutProps {
  children: ReactNode;
}

function MainLayout({ children }: MainLayoutProps) {
  const mode = useAppSelector((state) => state.theme.mode);
  const mainRef = useRef<HTMLElement>(null);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);

  if (isAdminRoute) {
    return <div data-theme={mode}>{children}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col" data-theme={mode}>
      <main ref={mainRef} className="flex-1 relative">
        <Navbar containerRef={mainRef} />
        {children}
      </main>

      <Footer />
    </div>
  );
}

export default MainLayout;