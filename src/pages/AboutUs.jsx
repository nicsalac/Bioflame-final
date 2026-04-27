import Header       from "../components/header";
import Footer       from "../components/footer";
import Card         from "../components/Card";
import C            from "../theme/palette";
import hiraya       from "../assets/hiraya.jpg";
import hirayabg     from "../assets/hirayabg.jpg";
import droneShot    from "../assets/hiraya_farm_drone_shot.jpg";
import anotherDrone from "../assets/another_drone_shot.jpg";

const team = [
  { name: "Christian James Luces",  role: "Research Leader",  initials: "CJL", color: C.greenD  },
  { name: "Andrei Cruz",            role: "Co-Researcher",    initials: "AC",  color: C.green   },
  { name: "Christian Dating",       role: "Co-Researcher",    initials: "CD",  color: C.brown   },
  { name: "Rizza Mae Denosta",      role: "Co-Researcher",    initials: "RMD", color: C.goldD   },
  { name: "Nicolette Irish Salac",  role: "Co-Researcher",    initials: "NIS", color: C.red     },
];

const values = [
  { icon: "🌱", title: "Sustainability",  desc: "We believe clean energy starts with smart use of what already exists — animal waste as a fuel source." },
  { icon: "🔬", title: "Innovation",      desc: "Combining IoT sensors, real-time data, and a modern web stack to make biogas monitoring accessible." },
  { icon: "🤝", title: "Community",       desc: "Designed for small-scale farmers and researchers, not just large enterprise energy operators." },
  { icon: "📖", title: "Open Knowledge",  desc: "All documentation, sensor specs, and workflows are freely available for educational and research use." },
];

export default function AboutUs() {
  return (
    <div style={{ background: C.cream, minHeight: "100vh" }}>
      <Header title="👥 About Us" subtitle="The team and mission behind BioFlame" bg={C.brown} />

      {/* Farm hero banner */}
      <div style={{ position: "relative", height: 280, overflow: "hidden", width: "100%" }}>
        <img
          src={anotherDrone}
          alt="Hiraya Farm aerial view"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(26,42,15,0.45) 0%, rgba(26,42,15,0.70) 100%)",
          display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column",
        }}>
          <img
            src={hiraya} alt="Hiraya"
            style={{ height: 72, objectFit: "contain", marginBottom: 10, filter: "drop-shadow(0 2px 10px rgba(0,0,0,0.6))" }}
          />
          <p style={{ color: "rgba(255,255,255,0.88)", fontSize: 15, margin: 0, fontStyle: "italic" }}>
            Childhood Play Farm · Where nature meets technology
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "3rem 1rem" }}>

        {/* Mission statement */}
        <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 3rem" }}>
          <h2 style={{ fontFamily: "'Georgia',serif", color: C.greenD, fontSize: "clamp(1.4rem,3vw,2rem)", marginBottom: "1rem" }}>
            What is BioFlame?
          </h2>
          <p style={{ color: C.muted, fontSize: 14.5, lineHeight: 1.85 }}>
            BioFlame is an academic-research project that builds a web-based monitoring platform
            for anaerobic biogas digesters at <strong>Hiraya Childhood Play Farm</strong>. Our goal
            is to make clean energy from animal waste more reliable, measurable, and accessible —
            starting at the farm level.
          </p>
        </div>

        {/* Farm photo pair */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))",
          gap: "1rem", marginBottom: "3rem",
        }}>
          <div style={{ borderRadius: 14, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.12)" }}>
            <img src={droneShot} alt="Hiraya Farm drone shot" style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }} />
          </div>
          <div style={{ borderRadius: 14, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.12)" }}>
            <img src={hirayabg} alt="Hiraya Farm landscape" style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }} />
          </div>
        </div>

        {/* Values */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px,1fr))",
          gap: "1.25rem", marginBottom: "3rem",
        }}>
          {values.map(v => (
            <Card key={v.title}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{v.icon}</div>
              <h3 style={{ color: C.greenD, fontFamily: "'Georgia',serif", margin: "0 0 8px", fontSize: 16 }}>{v.title}</h3>
              <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.7, margin: 0 }}>{v.desc}</p>
            </Card>
          ))}
        </div>

        {/* Team heading + group badge */}
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <h2 style={{
            fontFamily: "'Georgia',serif", color: C.greenD,
            fontSize: "clamp(1.3rem,2.5vw,1.75rem)", margin: "0 0 0.6rem",
          }}>
            Meet the Team
          </h2>
          {/* Group badge */}
          <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
            <span style={{
              background: C.greenD, color: "#fff",
              padding: "4px 16px", borderRadius: 20,
              fontSize: 13, fontWeight: 700, letterSpacing: 0.5,
            }}>
              Team Code: Group 4310
            </span>
            <span style={{
              background: C.cream, color: C.muted,
              border: `1px solid ${C.creamD}`,
              padding: "4px 16px", borderRadius: 20,
              fontSize: 13,
            }}>
              5 Researchers
            </span>
          </div>
        </div>

        {/* Team cards — Research Leader first, then 4 co-researchers */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

          {/* Research Leader — full-width featured card */}
          <div style={{
            background: "#fff",
            border: `2px solid ${C.greenD}`,
            borderRadius: 14,
            padding: "1.5rem",
            display: "flex", alignItems: "center", gap: "1.5rem",
            flexWrap: "wrap",
            boxShadow: "0 4px 20px rgba(74,98,41,0.12)",
          }}>
            <div style={{
              width: 72, height: 72, borderRadius: "50%",
              background: C.greenD, color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: 22, flexShrink: 0,
            }}>CJL</div>
            <div style={{ flex: 1, minWidth: 160 }}>
              <div style={{
                display: "inline-block",
                background: `${C.greenD}18`, color: C.greenD,
                fontSize: 11, fontWeight: 700, letterSpacing: 0.8,
                padding: "2px 10px", borderRadius: 10, marginBottom: 6,
                textTransform: "uppercase",
              }}>
                ⭐ Research Leader
              </div>
              <div style={{ color: C.text, fontWeight: 700, fontSize: 17 }}>
                Christian James Luces
              </div>
              <div style={{ color: C.muted, fontSize: 13, marginTop: 3 }}>
                Team Code: Group 4310 · BioFlame Project
              </div>
            </div>
          </div>

          {/* 4 Co-Researchers in a 2×2 grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))",
            gap: "1.25rem",
          }}>
            {team.slice(1).map(m => (
              <Card key={m.name} style={{ textAlign: "center" }}>
                <div style={{
                  width: 60, height: 60, borderRadius: "50%", background: m.color,
                  color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700, fontSize: 17, margin: "0 auto 12px",
                }}>{m.initials}</div>
                <div style={{ color: C.text, fontWeight: 600, fontSize: 15 }}>{m.name}</div>
                <div style={{
                  display: "inline-block", marginTop: 6,
                  background: `${C.green}18`, color: C.green,
                  fontSize: 11, fontWeight: 600,
                  padding: "2px 10px", borderRadius: 10,
                }}>Co-Researcher</div>
              </Card>
            ))}
          </div>

        </div>
        {/* end team */}

      </div>

      <Footer />
    </div>
  );
}
