import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useAppSelector } from "../store/hooks";

interface MainLayoutProps {
  children: ReactNode;
}

function MainLayout({ children }: MainLayoutProps) {
  const mode = useAppSelector((state) => state.theme.mode);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);

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