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

      

        <SlurryManagementTable />
      </div>

      <Footer />
    </div>
  );
}
