import type { ReactNode } from "react";
import Navbar from "../components/layout/Navbar";

interface MainLayoutProps {
  children: ReactNode;
}

function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {children}
      </main>

      <footer className="footer footer-center bg-base-200 p-6">
        <p>© 2026 Restaurant. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default MainLayout;