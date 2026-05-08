import Footer       from "../components/footer";
import C            from "../theme/palette";
import hirayahorse  from "../assets/hirayahorse.jpg";
import cow          from "../assets/cow.jpg";
import carabao      from "../assets/carabao.jpg";
import moimoi       from "../assets/moimoi.jpg";
import rockpool     from "../assets/rockpool.jpg";
import energy       from "../assets/energy.jpg";
import droneShot    from "../assets/hiraya_farm_drone_shot.jpg";
import anotherDrone from "../assets/another_drone_shot.jpg";
import hiraya       from "../assets/hiraya.jpg";

const features = [
  { icon: "📊", title: "Real-Time Dashboard",  desc: "Monitor temperature, pH, and gas quality live with dynamic charts and instant alerts." },
  { icon: "🔧", title: "Maintenance Tracker",  desc: "Schedule and track system upkeep tasks with priority flags and status logs." },
  { icon: "📚", title: "Full Documentation",   desc: "Setup guides, sensor specs, and workflow diagrams for every component." },
  { icon: "🌡️", title: "Sensor Integration",  desc: "Supports temperature, pH, water level, and CH₄ sensors out of the box." },
  { icon: "♻️", title: "Waste-to-Energy",      desc: "Converts animal waste into usable biogas, reducing environmental impact." },
  { icon: "📡", title: "Remote Monitoring",    desc: "Web-based access from any device — phone, tablet, or desktop." },
];

const stats = [
  { val: "37.2°C", label: "Avg. Digester Temp" },
  { val: "7.0",    label: "Avg. pH Level"       },
  { val: "66%",    label: "Avg. CH₄ Purity"     },
  { val: "74%",    label: "Water Level"          },
];

const galleryImages = [
  { src: hirayahorse,  alt: "Horses grazing at Hiraya Farm", caption: "Free-range horses" },
  { src: cow,          alt: "Brahman cow at Hiraya",          caption: "Brahman cattle" },
  { src: carabao,      alt: "Mother carabao and calf",        caption: "Carabao & calf" },
  { src: moimoi,       alt: "Baby carabao",                   caption: "Baby carabao" },
  { src: rockpool,     alt: "Rock pool with floaties",        caption: "Natural rock pool" },
  { src: energy,       alt: "Rice paddies near Hiraya",       caption: "Surrounding fields" },
];

export default function Home({ setPage }) {
  return (
    <div style={{ width: "100%", overflowX: "hidden" }}>

      <style>{`
        @media (max-width: 400px) {
          .home-hero-btns { flex-direction: column !important; align-items: stretch !important; }
          .home-hero-btns button { width: 100% !important; text-align: center !important; }
        }
        @media (max-width: 479px) {
          .home-features-grid { grid-template-columns: 1fr !important; }
          .home-stats-grid    { grid-template-columns: repeat(2,1fr) !important; }
          .home-gallery-grid  { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (min-width: 480px) and (max-width: 767px) {
          .home-features-grid { grid-template-columns: repeat(2,1fr) !important; }
          .home-gallery-grid  { grid-template-columns: repeat(3,1fr) !important; }
        }
        .gallery-card:hover img {
          transform: scale(1.06);
        }
        .gallery-card img {
          transition: transform .4s ease;
        }
      `}</style>

      {/* ── Hero ── */}
      <div style={{
        position: "relative",
        minHeight: "520px",
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
        width: "100%", boxSizing: "border-box",
      }}>
        <img
          src={droneShot}
          alt="Hiraya Farm aerial view"
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "center",
          }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, rgba(26,42,15,0.80) 0%, rgba(74,98,41,0.68) 55%, rgba(139,90,43,0.60) 100%)",
        }} />

        <div style={{
          position: "relative", zIndex: 1,
          color: "#fff", textAlign: "center",
          maxWidth: 700, margin: "0 auto",
          padding: "4rem 1.5rem",
          boxSizing: "border-box",
        }}>
          <img
            src={hiraya}
            alt="Hiraya Childhood Play Farm"
            style={{ height: 80, objectFit: "contain", marginBottom: 20, filter: "drop-shadow(0 2px 12px rgba(0,0,0,0.5))" }}
          />
          <h1 style={{
            fontFamily: "'Georgia', serif",
            fontSize: "clamp(1.8rem, 7vw, 3.5rem)",
            fontWeight: 700, margin: "0 0 0.5rem", letterSpacing: 1, lineHeight: 1.15,
          }}>BioFlame</h1>
          <p style={{ fontSize: "clamp(0.85rem, 2.5vw, 1rem)", opacity: 0.88, margin: "0 0 0.4rem" }}>
            Hiraya Childhood Play Farm
          </p>
          <p style={{
            fontSize: "clamp(0.85rem, 2.5vw, 1rem)",
            opacity: 0.85, maxWidth: 520, margin: "0 auto 2rem", lineHeight: 1.7,
          }}>
            A web-based monitoring system integrating animal waste management
            with renewable biogas energy technology.
          </p>

          <div
            className="home-hero-btns"
            style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}
          >
            <button
              onClick={() => setPage("Dashboard")}
              style={{
                background: C.gold, color: C.text, border: "none",
                padding: "12px 28px", borderRadius: 10, fontSize: 15,
                fontWeight: 700, cursor: "pointer", minWidth: 160,
              }}
            >View Dashboard →</button>

            <button
              onClick={() => setPage("Documentation")}
              style={{
                background: "transparent", color: "#fff",
                border: "2px solid rgba(255,255,255,0.55)",
                padding: "12px 28px", borderRadius: 10, fontSize: 15,
                cursor: "pointer", minWidth: 140,
              }}
            >Read Docs</button>
          </div>
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div style={{
        background: C.brown, padding: "1.5rem 1rem",
        width: "100%", boxSizing: "border-box",
      }}>
        <div
          className="home-stats-grid"
          style={{
            maxWidth: 1100, margin: "0 auto",
            display: "grid", gridTemplateColumns: "repeat(4,1fr)",
            gap: "1rem", textAlign: "center",
          }}
        >
          {stats.map(s => (
            <div key={s.label}>
              <div style={{ color: C.gold, fontSize: "clamp(18px,4vw,26px)", fontWeight: 700, fontFamily: "'Georgia',serif" }}>
                {s.val}
              </div>
              <div style={{ color: "rgba(255,255,255,0.72)", fontSize: "clamp(10px,2vw,12px)", marginTop: 2 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── About the Farm ── */}
      <div style={{
        background: C.cream, padding: "3.5rem 1rem",
        width: "100%", boxSizing: "border-box",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))", gap: "2.5rem", alignItems: "center" }}>
          <div>
            <h2 style={{ fontFamily: "'Georgia',serif", color: C.greenD, fontSize: "clamp(1.3rem,3vw,2rem)", marginBottom: "1rem" }}>
              About Hiraya Farm
            </h2>
            <p style={{ color: C.muted, fontSize: 14.5, lineHeight: 1.85, marginBottom: "1rem" }}>
              Hiraya Childhood Play Farm is a lush, open-air agri-tourism destination where families
              reconnect with nature through hands-on farm experiences. Home to horses, carabaos,
              brahman cattle, and more, Hiraya combines sustainable agriculture with childhood wonder.
            </p>
            <p style={{ color: C.muted, fontSize: 14.5, lineHeight: 1.85 }}>
              BioFlame harnesses the farm's animal waste output to generate clean, renewable biogas —
              monitored in real-time through this platform to ensure optimal efficiency and safety.
            </p>
          </div>
          <div style={{ borderRadius: 16, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }}>
            <img
              src={anotherDrone}
              alt="Hiraya Farm aerial"
              style={{ width: "100%", height: 260, objectFit: "cover", display: "block" }}
            />
          </div>
        </div>
      </div>

      {/* ── Farm Gallery ── */}
      <div style={{
        background: "#fff", padding: "3rem 1rem",
        width: "100%", boxSizing: "border-box",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{
            textAlign: "center", fontFamily: "'Georgia',serif",
            color: C.greenD, fontSize: "clamp(1.3rem,4vw,2rem)",
            marginBottom: "0.5rem",
          }}>Life at Hiraya</h2>
          <p style={{ textAlign: "center", color: C.muted, marginBottom: "2rem", fontSize: 14 }}>
            The animals that power our biogas system
          </p>
          <div
            className="home-gallery-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: "1rem",
            }}
          >
            {galleryImages.map(img => (
              <div
                key={img.alt}
                className="gallery-card"
                style={{
                  borderRadius: 12, overflow: "hidden",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
                  position: "relative", cursor: "default",
                }}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }}
                />
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  background: "linear-gradient(transparent, rgba(0,0,0,0.55))",
                  padding: "1.5rem 0.75rem 0.6rem",
                  color: "#fff", fontSize: 12.5, fontWeight: 600,
                }}>
                  {img.caption}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Features grid ── */}
      <div style={{
        background: C.cream, padding: "3rem 1rem",
        width: "100%", boxSizing: "border-box",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{
            textAlign: "center", fontFamily: "'Georgia',serif",
            color: C.greenD, fontSize: "clamp(1.3rem,4vw,2rem)",
            marginBottom: "0.5rem",
          }}>System Features</h2>
          <p style={{ textAlign: "center", color: C.muted, marginBottom: "2.5rem", fontSize: 15 }}>
            Everything you need to monitor and manage your biogas system
          </p>
          <div
            className="home-features-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: "1.25rem",
            }}
          >
            {features.map(f => (
              <div key={f.title} style={{
                background: "#fff", borderRadius: 12, padding: "1.25rem",
                border: `1px solid ${C.creamD}`,
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
                <h3 style={{ color: C.greenD, fontFamily: "'Georgia',serif", margin: "0 0 8px", fontSize: 15 }}>
                  {f.title}
                </h3>
                <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Mission banner with rockpool image ── */}
      <div style={{
        position: "relative",
        overflow: "hidden",
        width: "100%", boxSizing: "border-box",
      }}>
        <img
          src={rockpool}
          alt="Rock pool at Hiraya"
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "center",
          }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, rgba(74,98,41,0.88) 0%, rgba(26,42,15,0.80) 100%)",
        }} />
        <div style={{
          position: "relative", zIndex: 1,
          padding: "3.5rem 1rem", color: "#fff", textAlign: "center",
        }}>
          <div style={{ maxWidth: 780, margin: "0 auto", padding: "0 0.5rem" }}>
            <div style={{ fontSize: "clamp(28px,6vw,40px)", marginBottom: 16 }}>♻️</div>
            <h2 style={{
              fontFamily: "'Georgia',serif",
              fontSize: "clamp(1.3rem,4vw,2rem)",
              margin: "0 0 1rem",
            }}>Our Mission</h2>
            <p style={{
              fontSize: "clamp(0.85rem,2.5vw,1rem)",
              lineHeight: 1.8, opacity: 0.92, margin: "0 0 2rem",
            }}>
              BioFlame transforms animal waste into a renewable energy resource by continuously
              monitoring the anaerobic digestion process. Our platform empowers farmers and
              researchers with real-time sensor data, intelligent alerts, and comprehensive
              documentation — bridging sustainable agriculture with clean energy technology.
            </p>
            <button
              onClick={() => setPage("Documentation")}
              style={{
                background: C.gold, color: C.text, border: "none",
                padding: "12px 28px", borderRadius: 10, fontSize: 14,
                fontWeight: 700, cursor: "pointer",
              }}
            >Learn How It Works</button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
