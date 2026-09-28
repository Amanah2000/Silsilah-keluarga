import { useState } from "react";

const FOTO_LIST = [
  "abi",
  "aditya",
  "aini",
  "awet",
  "fia",
  "fuad",
  "khalimatus",
  "mamad",
  "masduki",
  "mujahid",
  "nurhidayati",
  "rochayanik",
  "virda",
  "wahyudi",
  "zaki",
];

function cariFoto(label) {
  if (!label) return [];
  const parts = label
    .toLowerCase()
    .split("+")
    .map((s) => s.trim());
  let hasil = [];
  parts.forEach((p) => {
    const namaDepan = p.split(" ")[0]; // ambil kata pertama: masduki, wahyudi, aditya
    // cari file yang mirip
    let file = FOTO_LIST.find((f) => p.includes(f) || f.includes(namaDepan));
    if (namaDepan === "masduki") file = "masduki"; // biar pakai masduki.jpg bukan mamad.jpg
    if (
      p.includes("azalia") ||
      p.includes("romadhon") ||
      p.includes("hafidz") ||
      p.includes("husain")
    )
      file = null; // belum ada foto
    if (file) hasil.push(file + ".jpg");
  });
  // kalau keluarga, kembalikan 2 foto
  // kalau 1 orang, 1 foto
  // kalau tidak ada, pakai avatar
  if (hasil.length === 0) {
    // coba cari lagi pakai nama depan saja
    const depan = label.toLowerCase().split(" ")[0];
    const f = FOTO_LIST.find((x) => depan.includes(x) || x.includes(depan));
    if (f) hasil.push(f + ".jpg");
  }
  return [...new Set(hasil)]; // hilangkan duplikat
}

const filterData = (list, term) => {
  if (!term) return list;
  return list.filter((n) => JSON.stringify(n).toLowerCase().includes(term.toLowerCase()));
};

function Node({ node, isLast, onFotoClick }) {
  const hasChild = node.children && node.children.length > 0;
  return (
    <div style={{ position: "relative", paddingLeft: "24px" }}>
      {!isLast && (
        <div
          style={{
            position: "absolute",
            left: "8px",
            top: "0",
            bottom: "-8px",
            borderLeft: "1.5px solid #94a3b8",
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          left: "8px",
          top: "14px",
          width: "16px",
          borderTop: "1.5px solid #94a3b8",
        }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "4px 0" }}>
        <span>📁</span>
        <span
          onClick={() => onFotoClick(node)}
          style={{ cursor: "pointer", color: "#334155" }}
          className="hover:text-blue-600 hover:underline"
        >
          {node.label || node.name}
        </span>
      </div>
      {hasChild && (
        <div>
          {node.children.map((child, idx) => (
            <Node
              key={idx}
              node={child}
              isLast={idx === node.children.length - 1}
              onFotoClick={onFotoClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SilsilahFolder({ data, searchTerm }) {
  const [selected, setSelected] = useState(null);
  const list = Array.isArray(data) ? data : [data];
  const filtered = filterData(list, searchTerm);
  const fotoFiles = selected ? cariFoto(selected.label || selected.name) : [];

  return (
    <div style={{ background: "white", padding: "20px", borderRadius: "16px" }}>
      {filtered.map((root, i) => (
        <div key={i}>
          <div
            style={{
              display: "flex",
              gap: "6px",
              fontWeight: "600",
              paddingBottom: "4px",
              cursor: "pointer",
            }}
            onClick={() => setSelected(root)}
          >
            <span>📁</span>
            <span>{root.label || root.name}</span>
          </div>
          <div>
            {root.children?.map((child, idx) => (
              <Node
                key={idx}
                node={child}
                isLast={idx === root.children.length - 1}
                onFotoClick={setSelected}
              />
            ))}
          </div>
        </div>
      ))}

      {selected && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
          onClick={() => setSelected(null)}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "16px",
              maxWidth: "380px",
              width: "90%",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontWeight: "700", textAlign: "center" }}>
              {selected.label || selected.name}
            </h3>

            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "center",
                marginTop: "14px",
                flexWrap: "wrap",
              }}
            >
              {fotoFiles.length > 0 ? (
                fotoFiles.map((f, i) => (
                  <img
                    key={i}
                    src={`/foto/${f}`}
                    alt={f}
                    style={{
                      width: fotoFiles.length > 1 ? "48%" : "100%",
                      maxHeight: "280px",
                      objectFit: "cover",
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                    }}
                  />
                ))
              ) : (
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selected.label || "")}&background=random&size=200`}
                  alt=""
                  style={{ width: "120px", height: "120px", borderRadius: "100px" }}
                />
              )}
            </div>

            {selected.date && (
              <p
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  textAlign: "center",
                  marginTop: "10px",
                }}
              >
                {selected.date}
              </p>
            )}
            <button
              onClick={() => setSelected(null)}
              style={{
                marginTop: "16px",
                background: "#334155",
                color: "white",
                padding: "8px 12px",
                borderRadius: "10px",
                width: "100%",
              }}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
      <div style={{ marginTop: "16px", fontSize: "11px", textAlign: "center", color: "#94a3b8" }}>
        Klik nama untuk lihat foto • Statis
      </div>
    </div>
  );
}
