import Header             from "../components/header";
import Footer             from "../components/footer";
import SlurryManagementTable from "../database/Table";
import { useAuth }        from "../context/AuthContext";
import C                  from "../theme/palette";

export default function SlurryLog() {
  const { isAdmin } = useAuth();

  return (
    <div style={{ background: "#0d1a09", minHeight: "100vh" }}>
      <Header
        title="🌾 Slurry Input Log"
        subtitle={isAdmin
          ? "Record, track and manage all slurry batch entries"
          : "View slurry batch entries — Admin access required to add or modify"
        }
        bg={C.brown}
      />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "1.5rem 1rem" }}>

        {/* Info banner */}
        <div style={{
          background: "rgba(108,142,62,0.12)", border: "1px solid rgba(108,142,62,0.25)",
          borderRadius: 10, padding: "12px 18px", marginBottom: "1.25rem",
          display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
        }}>
          <span style={{ fontSize: 18 }}>ℹ️</span>
          <p style={{ color: "#8fb050", fontSize: 13, margin: 0, lineHeight: 1.6 }}>
            All entries are saved to the Supabase <strong>slurrylog</strong> table.
            Adding a batch automatically updates the Digester retention time.
            Deleting a batch recalculates retention from the previous entry.
            {!isAdmin && <strong style={{ color: "#d4a84b" }}> · Slurry input is restricted to Admin accounts.</strong>}
          </p>
        </div>

        <SlurryManagementTable />
      </div>

      <Footer />
    </div>
  );
}
