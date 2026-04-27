import { useState } from "react";
import { useAuth }  from "../context/AuthContext";
import C            from "../theme/palette";

const LINKS = [
  "Home", "Dashboard", "Maintenance", "Slurry Log",
  "Documentation", "CCTV", "About Us", "Contact Us",
];

const LINK_LABELS = {
  "CCTV": "📹 CCTV",
};

export default function Navbar({ page, setPage }) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <>
      <nav style={{
        background: C.green,
        position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
        width: "100%",
      }}>
        <div style={{
          width: "100%", maxWidth: 1280,
          margin: "0 auto", padding: "0 16px",
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          height: 56, gap: 8,
        }}>

          {/* Logo */}
          <div
            onClick={() => { setPage("Home"); setOpen(false); }}
            style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", flexShrink: 0 }}
          >
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: C.gold, display: "flex",
              alignItems: "center", justifyContent: "center", fontSize: 16,
            }}>🌿</div>
            <span style={{
              color: "#fff", fontFamily: "'Georgia', serif",
              fontSize: 18, fontWeight: 700, letterSpacing: 0.5,
            }}>BioFlame</span>
          </div>

          {/* Desktop links */}
          <div style={{
            display: "flex", gap: 2, alignItems: "center",
            flex: 1, justifyContent: "center", overflow: "hidden",
          }} className="bf-desktop-links">
            {LINKS.map(l => (
              <button
                key={l}
                onClick={() => setPage(l)}
                style={{
                  background: page === l ? "rgba(255,255,255,0.22)" : "transparent",
                  border: "none", color: "#fff", cursor: "pointer",
                  padding: "6px 10px", borderRadius: 6,
                  fontSize: 12, fontWeight: page === l ? 700 : 400,
                  whiteSpace: "nowrap", transition: "background .15s",
                }}
              >{LINK_LABELS[l] || l}</button>
            ))}
          </div>

          {/* User chip + sign out */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }} className="bf-desktop-user">
            <div style={{
              background: "rgba(255,255,255,0.15)", borderRadius: 20,
              padding: "4px 10px", fontSize: 11, color: "#fff",
              display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap",
            }}>
              <span>👤</span>
              <span style={{ fontWeight: 600 }}>{user?.name}</span>
              <span style={{
                background: C.gold, color: C.text,
                padding: "1px 6px", borderRadius: 10,
                fontSize: 9, fontWeight: 700,
              }}>{user?.role}</span>
            </div>
            <button
              onClick={logout}
              style={{
                background: "rgba(163,54,46,0.4)", color: "#ffcccc",
                border: "none", padding: "5px 10px", borderRadius: 6,
                fontSize: 11, cursor: "pointer", fontWeight: 600, whiteSpace: "nowrap",
              }}
            >Sign Out</button>
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setOpen(o => !o)}
            className="bf-hamburger"
            style={{
              background: open ? "rgba(255,255,255,0.15)" : "transparent",
              border: "none", color: "#fff",
              fontSize: 22, cursor: "pointer",
              padding: "6px 8px", borderRadius: 6,
              flexShrink: 0, lineHeight: 1, display: "none",
            }}
            aria-label="Toggle menu"
          >{open ? "✕" : "☰"}</button>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div style={{
            background: C.greenD,
            padding: "8px 12px 16px",
            borderTop: "1px solid rgba(255,255,255,0.1)",
          }}>
            {LINKS.map(l => (
              <button
                key={l}
                onClick={() => { setPage(l); setOpen(false); }}
                style={{
                  display: "block", width: "100%", textAlign: "left",
                  background: page === l ? "rgba(255,255,255,0.15)" : "transparent",
                  border: "none", color: "#fff", cursor: "pointer",
                  padding: "11px 14px", borderRadius: 8,
                  fontSize: 15, fontWeight: page === l ? 700 : 400, marginBottom: 2,
                }}
              >{LINK_LABELS[l] || l}</button>
            ))}

            <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)", marginTop: 10, paddingTop: 12 }}>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, padding: "4px 14px", marginBottom: 6 }}>
                Signed in as&nbsp;
                <strong style={{ color: "#fff" }}>{user?.name}</strong>
                <span style={{
                  marginLeft: 7, background: C.gold, color: C.text,
                  padding: "1px 6px", borderRadius: 10, fontSize: 10, fontWeight: 700,
                }}>{user?.role}</span>
              </div>
              <button
                onClick={() => { logout(); setOpen(false); }}
                style={{
                  display: "block", width: "100%", textAlign: "left",
                  background: "rgba(163,54,46,0.3)", border: "none",
                  color: "#ffaaaa", cursor: "pointer",
                  padding: "11px 14px", borderRadius: 8, fontSize: 15,
                }}
              >🚪 Sign Out</button>
            </div>
          </div>
        )}
      </nav>

      <style>{`
        @media (max-width: 960px) {
          .bf-desktop-links { display: none !important; }
          .bf-desktop-user  { display: none !important; }
          .bf-hamburger     { display: block !important; }
        }
      `}</style>
    </>
  );
}
