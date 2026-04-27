import { useState, useEffect } from "react";
import { AuthProvider, useAuth, loadPage } from "./context/AuthContext";
import Navbar        from "./components/Navbar";
import Login         from "./pages/Login";
import Home          from "./pages/Home";
import DashboardPage from "./pages/DashboardPage";
import Maintenance   from "./pages/Maintenance";
import SlurryLog     from "./pages/SlurryLog";
import Documentation from "./pages/Documentation";
import CCTVPage      from "./pages/CCTVPage";
import AboutUs       from "./pages/AboutUs";
import ContactUs     from "./pages/ContactUs";
import C             from "./theme/palette";

function AppInner() {
  const { user, savePage, logout } = useAuth();

  // Read the last visited page SYNCHRONOUSLY on first render.
  // Because loadPage() reads localStorage directly (no async / no useEffect),
  // the very first paint already has the correct page — no flash to Home.
  const [page, setPageState] = useState(() => loadPage());

  // Wrap setPage so every nav click also persists the page
  const setPage = (newPage) => {
    setPageState(newPage);
    savePage(newPage);
  };

  // When the user explicitly logs out, reset to Home
  useEffect(() => {
    if (!user) {
      setPageState("Home");
      // savePage("Home") is handled inside logout() in AuthContext
    }
  }, [user]);

  // ── Guard: not logged in ─────────────────────────────────────────────────
  // This is a CONDITIONAL RENDER, not a redirect — there is no router,
  // so there is nothing that can produce a redirect loop.
  // The session is read synchronously above, so this check is stable on
  // refresh: if localStorage has a valid session the user is never null,
  // and the login screen is never shown even for a single frame.
  if (!user) return <Login />;

  // ── Render the active page ───────────────────────────────────────────────
  const renderPage = () => {
    switch (page) {
      case "Home":          return <Home          setPage={setPage} />;
      case "Dashboard":     return <DashboardPage />;
      case "Maintenance":   return <Maintenance   />;
      case "Slurry Log":    return <SlurryLog     />;
      case "Documentation": return <Documentation />;
      case "CCTV":          return <CCTVPage      />;
      case "About Us":      return <AboutUs       />;
      case "Contact Us":    return <ContactUs     />;
      default:              return <Home          setPage={setPage} />;
    }
  };

  return (
    <div style={{
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      minHeight: "100vh",
      background: C.cream,
    }}>
      <Navbar page={page} setPage={setPage} />
      {renderPage()}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
