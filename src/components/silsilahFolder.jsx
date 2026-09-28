import { useState } from "react";

function getNama(node) {
  return node.nama || node.name || "";
}
function getTgl(node) {
  const t1 = node.tglLahir || node.tglLahir1 || node.tgl1 || node.tgl || "";
  const t2 = node.tglLahir2 || node.tglLahirIstri || node.tgl2 || node.tgl12 || "";
  if (t1 && t2) return `${t1} & ${t2}`;
  return t1 || t2 || "";
}
function getAnak(node) {
  return node.children || node.anak || [];
}
function getFoto(node) {
  let f = node.foto || node.foto1 || "";
  if (f.includes("/")) f = f.split("/").pop();
  return f;
}
function getFoto2(node) {
  let f = node.foto2 || "";
  if (f.includes("/")) f = f.split("/").pop();
  return f;
}

function filterData(nodes, keyword) {
  if (!keyword) return nodes;
  const lower = keyword.toLowerCase();
  const hasil = [];
  for (let node of nodes) {
    const nama = getNama(node).toLowerCase();
    const match = nama.includes(lower);
    const anak = getAnak(node);
    const filteredAnak = filterData(anak, keyword);
    if (match || filteredAnak.length > 0) {
      hasil.push({ ...node, _filteredAnak: filteredAnak });
    }
  }
  return hasil;
}

function Item({ node, depth, searchTerm, onFotoClick }) {
  const [buka, setBuka] = useState(true);
  const isOpen = searchTerm ? true : buka;
  const anakAsli = getAnak(node);
  const anakTampil = node._filteredAnak || anakAsli;
  const foto = getFoto(node);
  const foto2 = getFoto2(node);
  const hasChildren = anakAsli.length > 0;
  const nama = getNama(node);
  const tgl = getTgl(node);
  const isDark = depth <= 5;
  if (!nama) return null;

  return (
    <div style={{ marginLeft: depth * 16, marginBottom: 6 }}>
      <div
        onClick={() => hasChildren && setBuka(!buka)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 12px",
          borderRadius: 12,
          background: isDark ? "#1e293b" : "white",
          color: isDark ? "white" : "black",
          cursor: hasChildren ? "pointer" : "default",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        {hasChildren ? <span>📁</span> : <span>📄</span>}

        <div style={{ display: "flex" }} onClick={(e) => e.stopPropagation()}>
          {foto && (
            <img
              src={`/foto/${foto}`.toLowerCase()}
              onError={(e) => (e.target.style.display = "none")}
              onClick={() => onFotoClick(`/foto/${foto}`.toLowerCase(), nama)}
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                objectFit: "cover",
                cursor: "zoom-in",
                border: "2px solid white",
                zIndex: 2,
              }}
            />
          )}
          {foto2 && (
            <img
              src={`/foto/${foto2}`.toLowerCase()}
              onError={(e) => (e.target.style.display = "none")}
              onClick={() => onFotoClick(`/foto/${foto2}`.toLowerCase(), nama)}
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                objectFit: "cover",
                cursor: "zoom-in",
                marginLeft: foto ? -8 : 0,
                border: "2px solid white",
                zIndex: 1,
              }}
            />
          )}
        </div>

        <span style={{ fontWeight: 600 }}>{nama}</span>
        <span style={{ fontSize: 10, opacity: 0.7 }}>{tgl}</span>
      </div>

      {isOpen &&
        anakTampil?.map((child, i) => (
          <Item
            key={i}
            node={child}
            depth={depth + 1}
            searchTerm={searchTerm}
            onFotoClick={onFotoClick}
          />
        ))}
    </div>
  );
}

export default function SilsilahFolder({ data, searchTerm }) {
  const [selected, setSelected] = useState(null);
  const list = Array.isArray(data) ? data : [data];
  const filtered = filterData(list, searchTerm);

  if (filtered.length === 0)
    return <div style={{ padding: 20, textAlign: "center" }}>Nama tidak ketemu pak</div>;

  return (
    <>
      {filtered.map((node, i) => (
        <Item
          key={i}
          node={node}
          depth={0}
          searchTerm={searchTerm}
          onFotoClick={(src, nama) => setSelected({ src, nama })}
        />
      ))}

      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.9)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            padding: 20,
          }}
        >
          {/* TOMBOL X */}
          <button
            onClick={() => setSelected(null)}
            style={{
              position: "absolute",
              top: 15,
              right: 15,
              background: "white",
              color: "black",
              border: "none",
              borderRadius: "50%",
              width: 36,
              height: 36,
              fontSize: 20,
              fontWeight: "bold",
              cursor: "pointer",
              lineHeight: "36px",
            }}
          >
            ✕
          </button>

          <img
            src={selected.src}
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "90%", maxHeight: "75%", borderRadius: 16 }}
          />
          <p style={{ color: "white", marginTop: 12, fontWeight: 600, fontSize: 18 }}>
            {selected.nama}
          </p>
          <p style={{ color: "#aaa", fontSize: 12, marginTop: 4 }}>Klik X atau layar untuk tutup</p>
        </div>
      )}
    </>
  );
}
