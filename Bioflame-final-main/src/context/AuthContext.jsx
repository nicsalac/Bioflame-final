import { createContext, useContext, useState } from "react";

const AuthContext   = createContext(null);
const SESSION_KEY   = "bf_session";
const PAGE_KEY      = "bf_page";

const VALID_PAGES = [
  "Home", "Dashboard", "Maintenance", "Slurry Log",
  "Documentation", "CCTV", "About Us", "Contact Us",
];

const DEMO_USERS = [
  { email: "admin@bioflame.ph",  password: "bioflame2026", name: "Christian James Luces", role: "Admin" },
  { email: "staff1@bioflame.ph", password: "staff2026",    name: "Andrei Cruz",            role: "Staff" },
  { email: "staff2@bioflame.ph", password: "staff2026",    name: "Christian Dating",       role: "Staff" },
  { email: "staff3@bioflame.ph", password: "staff2026",    name: "Rizza Mae Denosta",      role: "Staff" },
  { email: "staff4@bioflame.ph", password: "staff2026",    name: "Nicolette Irish Salac",  role: "Staff" },
];

// ── localStorage helpers ──────────────────────────────────────────────────────

export function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.email && parsed?.name && parsed?.role) return parsed;
    return null;
  } catch {
    return null;
  }
}

export function loadPage() {
  try {
    const saved = localStorage.getItem(PAGE_KEY);
    return saved && VALID_PAGES.includes(saved) ? saved : "Home";
  } catch {
    return "Home";
  }
}

function saveSession(user) {
  try {
    const { password, ...safe } = user;
    localStorage.setItem(SESSION_KEY, JSON.stringify(safe));
  } catch {}
}

function savePage(page) {
  try { localStorage.setItem(PAGE_KEY, page); } catch {}
}

function clearStorage() {
  try {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(PAGE_KEY);
  } catch {}
}

// ── Provider ──────────────────────────────────────────────────────────────────

export function AuthProvider({ children }) {
  // Initialise SYNCHRONOUSLY from localStorage — no async, no useEffect,
  // no "loading" gap — so the very first render already knows if the user
  // is logged in. This is what prevents the flash-to-login on refresh.
  const [user,  setUser]  = useState(() => loadSession());
  const [error, setError] = useState("");

  const login = (email, password) => {
    const found = DEMO_USERS.find(
      u => u.email === email && u.password === password
    );
    if (found) {
      const { password: _pw, ...safe } = found;
      setUser(safe);
      saveSession(safe);
      setError("");
      return true;
    }
    setError("Invalid email or password.");
    return false;
  };

  const logout = () => {
    setUser(null);
    clearStorage();
  };

  const isAdmin = user?.role === "Admin";

  return (
    <AuthContext.Provider value={{ user, login, logout, error, setError, isAdmin, savePage }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
