import { useState, useEffect, useRef } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import C      from "../theme/palette";

export default function CCTVPage() {
  const [url,       setUrl]       = useState(() => localStorage.getItem("cctv_url") || "");
  const [urlInput,  setUrlInput]  = useState(() => localStorage.getItem("cctv_url") || "");
  const [label,     setLabel]     = useState(() => localStorage.getItem("cctv_label") || "Biogas Digester Area");
  const [labelInput,setLabelInput]= useState(() => localStorage.getItem("cctv_label") || "Biogas Digester Area");
  const [status,    setStatus]    = useState(url ? "connecting" : "unconfigured");
  const [showEdit,  setShowEdit]  = useState(false);
  const [now,       setNow]       = useState(new Date());
  const imgRef = useRef(null);

  // Live clock
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const saveConfig = () => {
    setUrl(urlInput);
    setLabel(labelInput);
    localStorage.setItem("cctv_url",   urlInput);
    localStorage.setItem("cctv_label", labelInput);
    setStatus(urlInput ? "connecting" : "unconfigured");
    setShowEdit(false);
  };

  const clearCamera = () => {
    setUrl(""); setUrlInput("");
    setLabel("Biogas Digester Area"); setLabelInput("Biogas Digester Area");
    localStorage.removeItem("cctv_url");
    localStorage.removeItem("cctv_label");
    setStatus("unconfigured");
  };

  const statusColors = {
    live:          { dot: "#4cff7e", text: "#4cff7e", label: "LIVE"         },
    connecting:    { dot: C.gold,    text: C.gold,    label: "CONNECTING…"  },
    error:         { dot: C.red,     text: "#ff8080", label: "NO SIGNAL"    },
    unconfigured:  { dot: "#666",    text: "#888",    label: "NOT SET"      },
  };
  const sc = statusColors[status] || statusColors.unconfigured;

  return (
    <div style={{ background: "#0a1208", minHeight: "100vh" }}>
      <Header
        title="📹 CCTV Camera"
        subtitle="Live feed from the BioFlame monitoring site"
        bg="#0a1208"
      />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "1.5rem 1rem" }}>

        {/* ── Camera viewport ── */}
        <div style={{
          background: "#000", borderRadius: 14, overflow: "hidden",
          border: `2px solid ${sc.dot}`,
          boxShadow: status === "live" ? `0 0 20px ${sc.dot}33` : "none",
          marginBottom: "1.25rem",
          transition: "border-color .3s, box-shadow .3s",
        }}>

          {/* Top bar */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 16px",
            background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 10, height: 10, borderRadius: "50%", background: sc.dot,
                boxShadow: status === "live" ? `0 0 8px ${sc.dot}` : "none",
                flexShrink: 0,
              }} />
              <span style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>📷 {label}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ color: sc.text, fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>
                {sc.label}
              </span>
              <span style={{ color: "#666", fontSize: 11, fontFamily: "monospace" }}>
                {now.toLocaleTimeString()}
              </span>
            </div>
          </div>

          {/* Feed area — 16:9 */}
          <div style={{ position: "relative", width: "100%", paddingBottom: "56.25%", background: "#050a04" }}>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>

              {/* ── Live feed via <img> (MJPEG / snapshot URL) ── */}
              {url ? (
                <>
                  {status === "connecting" && (
                    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
                      <div style={{
                        width: 40, height: 40, border: `3px solid ${C.green}`,
                        borderTopColor: "transparent", borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                      }} />
                      <span style={{ color: C.gold, fontSize: 13 }}>Connecting to camera…</span>
                      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>
                  )}
                  <img
                    ref={imgRef}
                    src={url}
                    alt="CCTV feed"
                    onLoad={() => setStatus("live")}
                    onError={() => setStatus("error")}
                    style={{
                      width: "100%", height: "100%", objectFit: "cover",
                      display: status === "connecting" ? "none" : "block",
                    }}
                  />
                  {status === "error" && (
                    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
                      <div style={{ fontSize: 48 }}>📵</div>
                      <div style={{ color: "#ff8080", fontSize: 15, fontWeight: 600 }}>Cannot connect to camera</div>
                      <div style={{ color: "#666", fontSize: 13, textAlign: "center", maxWidth: 400, lineHeight: 1.6 }}>
                        Verify the camera URL and ensure this device is on the <strong style={{ color: "#aaa" }}>same WiFi network</strong> as the camera.
                      </div>
                      <button
                        onClick={() => { setStatus("connecting"); imgRef.current && (imgRef.current.src = url); }}
                        style={{
                          marginTop: 8, background: C.green, color: "#fff", border: "none",
                          padding: "8px 20px", borderRadius: 8, cursor: "pointer", fontSize: 13,
                        }}
                      >🔄 Retry</button>
                    </div>
                  )}
                </>
              ) : (
                /* ── Not configured ── */
                <div style={{ textAlign: "center", padding: "2rem" }}>
                  <div style={{ fontSize: 64, marginBottom: 16, opacity: 0.4 }}>📷</div>
                  <div style={{ color: "#555", fontSize: 16, marginBottom: 8 }}>No camera configured</div>
                  <div style={{ color: "#444", fontSize: 13, marginBottom: 20 }}>
                    Set your camera's stream URL to start monitoring
                  </div>
                  <button
                    onClick={() => setShowEdit(true)}
                    style={{
                      background: C.green, color: "#fff", border: "none",
                      padding: "10px 24px", borderRadius: 8, fontSize: 14,
                      fontWeight: 700, cursor: "pointer",
                    }}
                  >⚙️ Configure Camera</button>
                </div>
              )}
            </div>

            {/* Timestamp overlay (live only) */}
            {status === "live" && (
              <div style={{
                position: "absolute", bottom: 10, right: 12,
                background: "rgba(0,0,0,0.55)", color: "#fff",
                fontSize: 11, padding: "4px 10px", borderRadius: 6,
                fontFamily: "monospace", zIndex: 10,
              }}>
                {now.toLocaleDateString()} {now.toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>

        {/* ── Action buttons ── */}
        <div style={{ display: "flex", gap: 10, marginBottom: "1.5rem", flexWrap: "wrap" }}>
          <button
            onClick={() => setShowEdit(true)}
            style={{
              background: C.green, color: "#fff", border: "none",
              padding: "10px 20px", borderRadius: 8, fontSize: 13,
              fontWeight: 600, cursor: "pointer",
            }}
          >⚙️ {url ? "Edit Camera" : "Set Camera URL"}</button>

          {url && (
            <>
              <button
                onClick={() => {
                  setStatus("connecting");
                  if (imgRef.current) { imgRef.current.src = ""; setTimeout(() => { imgRef.current.src = url; }, 100); }
                }}
                style={{
                  background: "rgba(229,193,106,0.2)", color: C.gold, border: `1px solid ${C.gold}40`,
                  padding: "10px 20px", borderRadius: 8, fontSize: 13, cursor: "pointer",
                }}
              >🔄 Refresh Feed</button>
              <button
                onClick={clearCamera}
                style={{
                  background: "rgba(163,54,46,0.2)", color: "#ff8080", border: "1px solid rgba(163,54,46,0.3)",
                  padding: "10px 20px", borderRadius: 8, fontSize: 13, cursor: "pointer",
                }}
              >✕ Remove Camera</button>
            </>
          )}
        </div>

        {/* ── How-to instructions ── */}
        <div style={{
          background: "rgba(108,142,62,0.08)", border: "1px solid rgba(108,142,62,0.2)",
          borderRadius: 12, padding: "1.25rem 1.5rem",
        }}>
          <h3 style={{ color: C.gold, fontFamily: "'Georgia', serif", margin: "0 0 1rem", fontSize: 15 }}>
            📡 How to connect your WiFi camera
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}>
            {[
              { n: "1", title: "Same Network", body: "Connect your WiFi camera and this device to the same local WiFi router." },
              { n: "2", title: "Find IP Address", body: "Check your router's admin panel or camera app to find the camera's local IP (e.g. 192.168.1.100)." },
              { n: "3", title: "Get Stream URL", body: "Use your camera's MJPEG stream URL. Common formats: http://192.168.1.100/video  or  http://192.168.1.100/mjpeg" },
              { n: "4", title: "Paste & Save", body: "Click 'Set Camera URL', paste the URL, and click Save. The feed loads automatically." },
            ].map(s => (
              <div key={s.n} style={{ display: "flex", gap: 12 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", background: C.green,
                  color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700, fontSize: 13, flexShrink: 0,
                }}>{s.n}</div>
                <div>
                  <div style={{ color: "#ccc", fontWeight: 600, fontSize: 13, marginBottom: 3 }}>{s.title}</div>
                  <div style={{ color: "#777", fontSize: 12, lineHeight: 1.6 }}>{s.body}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: "1rem", background: "rgba(0,0,0,0.3)", borderRadius: 8,
            padding: "10px 14px", fontSize: 12, color: "#888", lineHeight: 1.8,
          }}>
            <strong style={{ color: "#aaa" }}>Common stream URL formats:</strong><br />
            <code style={{ color: C.greenL }}>http://&lt;IP&gt;/video</code> &nbsp;·&nbsp;
            <code style={{ color: C.greenL }}>http://&lt;IP&gt;/mjpeg</code> &nbsp;·&nbsp;
            <code style={{ color: C.greenL }}>http://&lt;IP&gt;:8080/stream</code> &nbsp;·&nbsp;
            <code style={{ color: C.greenL }}>http://&lt;IP&gt;/snapshot.cgi</code>
          </div>
        </div>
      </div>

      {/* ── Configure modal ── */}
      {showEdit && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 300, padding: "1rem",
        }}>
          <div style={{
            background: "#1a2a12", borderRadius: 14, padding: "2rem",
            maxWidth: 480, width: "100%",
            border: `1px solid ${C.green}40`,
            boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
          }}>
            <h3 style={{ color: "#ccc", fontFamily: "'Georgia', serif", margin: "0 0 1.25rem", fontSize: 18 }}>
              📷 Camera Configuration
            </h3>

            <label style={{ display: "block", color: "#888", fontSize: 12, marginBottom: 5 }}>Camera Label</label>
            <input
              type="text"
              value={labelInput}
              onChange={e => setLabelInput(e.target.value)}
              placeholder="e.g. Digester Area"
              style={{
                width: "100%", padding: "10px 12px", borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.05)",
                color: "#ccc", boxSizing: "border-box", fontFamily: "inherit",
                fontSize: 13, outline: "none", marginBottom: "1rem",
              }}
            />

            <label style={{ display: "block", color: "#888", fontSize: 12, marginBottom: 5 }}>Stream URL</label>
            <input
              type="url"
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && saveConfig()}
              placeholder="http://192.168.1.100/video"
              style={{
                width: "100%", padding: "10px 12px", borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.05)",
                color: "#ccc", boxSizing: "border-box", fontFamily: "monospace",
                fontSize: 13, outline: "none", marginBottom: "1.5rem",
              }}
            />

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={saveConfig} style={{
                flex: 1, padding: "11px", borderRadius: 8, border: "none",
                background: C.green, color: "#fff", fontWeight: 700,
                fontSize: 14, cursor: "pointer",
              }}>💾 Save</button>
              <button onClick={() => setShowEdit(false)} style={{
                padding: "11px 20px", borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.1)",
                background: "transparent", color: "#888",
                fontSize: 14, cursor: "pointer",
              }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
