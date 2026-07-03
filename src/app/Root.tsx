import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

export function Root() {
  const { pathname, hash } = useLocation();

  // Scroll to top on route change, or to the hash target if present.
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname, hash]);

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "var(--mito-black)" }}>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
