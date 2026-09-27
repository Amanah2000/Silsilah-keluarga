import { useState } from "react";
import SilsilahFolder from "./components/silsilahFolder.jsx";
import data from "./data/silsilah.json";

export default function App() {
  const [cari, setCari] = useState("");

  return (
    <div
      style={{ padding: 20, background: "#f1f5f9", minHeight: "100vh", fontFamily: "sans-serif" }}
    >
      <div style={{ maxWidth: 550, margin: "0 auto" }}>
        <h1
          style={{
            textAlign: "center",
            fontSize: 18,
            fontWeight: 800,
            color: "#0f172a",
            marginBottom: 10,
          }}
        >
          📁 Silsilah Keluarga
        </h1>

        {/* KOTAK CARI */}
        <div
          style={{
            background: "white",
            borderRadius: 12,
            padding: 8,
            marginBottom: 12,
            display: "flex",
            alignItems: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <span style={{ marginLeft: 8 }}>🔍</span>
          <input
            value={cari}
            onChange={(e) => setCari(e.target.value)}
            placeholder="Cari nama... contoh: Wahyudi"
            style={{ flex: 1, border: "none", outline: "none", padding: "8px 10px", fontSize: 14 }}
          />
          {cari && (
            <button
              onClick={() => setCari("")}
              style={{
                border: "none",
                background: "#eee",
                borderRadius: 20,
                padding: "4px 10px",
                cursor: "pointer",
                marginRight: 4,
              }}
            >
              X
            </button>
          )}
        </div>

        <div
          style={{
            background: "white",
            borderRadius: 16,
            padding: 16,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            border: "1px solid #e2e8f0",
          }}
        >
          <SilsilahFolder data={data} searchTerm={cari} />
        </div>
        <p style={{ textAlign: "center", fontSize: 11, color: "#94a3b8", marginTop: 12 }}>
          Klik folder buka/tutup • Foto taruh di folder public/foto
        </p>
      </div>
    </div>
  );
}
