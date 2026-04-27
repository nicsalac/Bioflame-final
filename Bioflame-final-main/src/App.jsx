import { useState, useEffect } from "react";
import { AuthProvider, useAuth, loadPage } from "./context/AuthContext";
import Navbar        from "./components/Navbar";
import Login         from "./pages/Login";
import Home          from "./pages/Home";
import DashboardPage from "./pages/DashboardPage";
import Maintenance   from "./pages/Maintenance";
import SlurryLog     from "./pages/SlurryLog";
import Documentation from "./pages/Documentation";
import AboutUs       from "./pages/AboutUs";
import ContactUs     from "./pages/ContactUs";
import C             from "./theme/palette";

function AppInner() {
  const { user, savePage, logout } = useAuth();

  const [page, setPageState] = useState(() => loadPage());

  const setPage = (newPage) => {
    setPageState(newPage);
    savePage(newPage);
  };

  useEffect(() => {
    if (!user) {
      setPageState("Home");
    }
  }, [user]);

  if (!user) return <Login />;

  const renderPage = () => {
    switch (page) {
      case "Home":          return <Home          setPage={setPage} />;
      case "Dashboard":     return <DashboardPage />;
      case "Maintenance":   return <Maintenance   />;
      case "Slurry Log":    return <SlurryLog     />;
      case "Documentation": return <Documentation />;
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