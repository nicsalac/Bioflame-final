import { useState } from "react";
import { useAuth }  from "../context/AuthContext";
import C            from "../theme/palette";
import hirayabg     from "../assets/hirayabg.jpg";
import hiraya       from "../assets/hiraya.jpg";

export default function Login() {
  const { login, error, setError } = useAuth();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = () => {
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    // Small delay so the button gives visual feedback before the state update
    setTimeout(() => {
      login(email, password);
      setLoading(false);
    }, 400);
  };

  const inputStyle = {
    width: "100%", padding: "11px 14px", borderRadius: 8, fontSize: 14,
    border: `1.5px solid ${C.creamD}`, background: "rgba(255,255,255,0.95)", color: C.text,
    boxSizing: "border-box", outline: "none", fontFamily: "inherit",
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundImage: `url(${hirayabg})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "1rem",
      boxSizing: "border-box",
      width: "100%",
      overflowX: "hidden",
      position: "relative",
    }}>
      {/* Dark overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(135deg, rgba(26,42,15,0.82) 0%, rgba(74,98,41,0.70) 60%, rgba(139,90,43,0.65) 100%)",
      }} />

      <div style={{
        position: "relative", zIndex: 1,
        background: "rgba(255,255,255,0.97)", borderRadius: 20,
        padding: "clamp(1.5rem, 5vw, 2.5rem)",
        width: "100%", maxWidth: 420,
        boxShadow: "0 24px 80px rgba(0,0,0,0.35)",
        boxSizing: "border-box",
      }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <img
            src={hiraya}
            alt="Hiraya Childhood Play Farm"
            style={{ height: 72, objectFit: "contain", marginBottom: 10 }}
          />
          <h1 style={{
            fontFamily: "'Georgia', serif", color: C.greenD,
            fontSize: "clamp(20px, 5vw, 26px)", fontWeight: 700, margin: "0 0 2px",
          }}>BioFlame</h1>
          <p style={{ color: C.muted, fontSize: 12, margin: 0 }}>
            Hiraya Childhood Play Farm · Biogas Monitoring System
          </p>
        </div>

        {/* Credentials hint */}
        <div style={{
          background: `${C.green}12`, border: `1px solid ${C.green}35`,
          borderRadius: 8, padding: "10px 14px", marginBottom: "1.25rem",
          fontSize: 11.5, color: C.greenD, lineHeight: 1.8,
        }}>
          <strong>Demo credentials:</strong><br />
          Admin — admin@bioflame.ph / bioflame2026<br />
          Staff — staff1@bioflame.ph / staff2026
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: "#fde8e6", border: `1px solid ${C.red}40`,
            borderRadius: 8, padding: "10px 14px", marginBottom: "1rem",
            fontSize: 13, color: C.red,
          }}>⚠ {error}</div>
        )}

        {/* Email */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", color: C.muted, fontSize: 12, fontWeight: 600, marginBottom: 5 }}>
            Email Address
          </label>
          <input
            type="email" value={email}
            onChange={e => { setEmail(e.target.value); setError(""); }}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            placeholder="you@bioflame.ph"
            style={inputStyle}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", color: C.muted, fontSize: 12, fontWeight: 600, marginBottom: 5 }}>
            Password
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showPass ? "text" : "password"} value={password}
              onChange={e => { setPassword(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              placeholder="••••••••"
              style={{ ...inputStyle, paddingRight: 44 }}
            />
            <button
              onClick={() => setShowPass(s => !s)}
              style={{
                position: "absolute", right: 12, top: "50%",
                transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer",
                fontSize: 16, color: C.muted, padding: 2,
              }}
            >{showPass ? "🙈" : "👁"}</button>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%", padding: "12px", borderRadius: 8,
            background: loading ? C.greenD + "99" : C.green,
            color: "#fff", border: "none", fontSize: 15,
            fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
            transition: "background .2s",
          }}
        >{loading ? "Signing in…" : "Sign In →"}</button>

        <p style={{ textAlign: "center", color: C.muted, fontSize: 11.5, marginTop: "1.25rem" }}>
          BioFlame Monitoring System · Hiraya Farm · © 2026
        </p>
      </div>
    </div>
  );
}
