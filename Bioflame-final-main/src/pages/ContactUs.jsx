import { useState } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import Card   from "../components/Card";
import C      from "../theme/palette";

const contacts = [
  { icon: "📧", label: "Email",    value: "bioflame@research.edu.ph"   },
  { icon: "📍", label: "Location", value: "Quezon City, Philippines"    },
  { icon: "🕐", label: "Support",  value: "Mon–Fri, 8 AM – 5 PM (PHT)" },
];

export default function ContactUs() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.message) return;
    setSent(true);
  };

  const inputStyle = {
    width: "100%", padding: "10px 12px", borderRadius: 8, fontSize: 14,
    border: `1px solid ${C.creamD}`, background: "#fff", color: C.text,
    boxSizing: "border-box", outline: "none", fontFamily: "inherit",
  };

  return (
    <div style={{ background: C.cream, minHeight: "100vh" }}>
      <Header title="📬 Contact Us" subtitle="Get in touch with the BioFlame team" bg={C.greenD} />

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "3rem 1rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>

          {/* Contact info */}
          <div>
            <h2 style={{ fontFamily: "'Georgia', serif", color: C.greenD, margin: "0 0 1.5rem", fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)" }}>
              Reach Out
            </h2>
            <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.8, marginBottom: "1.5rem" }}>
              Have a question about the BioFlame system, sensor integration, or research collaboration?
              We'd love to hear from you.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {contacts.map(c => (
                <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: "50%", background: C.green + "22",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0,
                  }}>{c.icon}</div>
                  <div>
                    <div style={{ color: C.muted, fontSize: 11 }}>{c.label}</div>
                    <div style={{ color: C.text, fontSize: 14, fontWeight: 500 }}>{c.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <Card>
            {sent ? (
              <div style={{ textAlign: "center", padding: "2rem 0" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <h3 style={{ color: C.greenD, fontFamily: "'Georgia', serif", marginBottom: 8 }}>Message Sent!</h3>
                <p style={{ color: C.muted, fontSize: 14 }}>We'll get back to you within 1–2 business days.</p>
                <button onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }} style={{
                  marginTop: 16, background: C.green, color: "#fff", border: "none",
                  padding: "10px 22px", borderRadius: 8, cursor: "pointer", fontSize: 14,
                }}>Send Another</button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <h3 style={{ color: C.greenD, fontFamily: "'Georgia', serif", margin: "0 0 4px", fontSize: 16 }}>Send a Message</h3>
                {[
                  { name: "name",    label: "Full Name",    type: "text" },
                  { name: "email",   label: "Email Address",type: "email"},
                  { name: "subject", label: "Subject",      type: "text" },
                ].map(f => (
                  <div key={f.name}>
                    <label style={{ display: "block", color: C.muted, fontSize: 12, marginBottom: 4 }}>{f.label}</label>
                    <input
                      type={f.type} name={f.name} value={form[f.name]}
                      onChange={handleChange} style={inputStyle}
                      placeholder={f.label}
                    />
                  </div>
                ))}
                <div>
                  <label style={{ display: "block", color: C.muted, fontSize: 12, marginBottom: 4 }}>Message</label>
                  <textarea
                    name="message" value={form.message} onChange={handleChange}
                    rows={4} style={{ ...inputStyle, resize: "vertical" }}
                    placeholder="Your message..."
                  />
                </div>
                <button onClick={handleSubmit} style={{
                  background: C.green, color: "#fff", border: "none",
                  padding: "11px", borderRadius: 8, fontSize: 14,
                  fontWeight: 700, cursor: "pointer", width: "100%",
                }}>Send Message →</button>
              </div>
            )}
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
