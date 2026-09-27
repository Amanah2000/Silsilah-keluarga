import { useState } from "react";

function getNama(node) {
  return node.nama || node.name || "";
}
function getTgl(node) {
  return node.tglLahir || node.tgl || "";
}
function getAnak(node) {
  return node.anak || node.children || [];
}
function getFoto(node) {
  return node.foto || "";
}

function filterData(nodes, keyword) {
  if (!Array.isArray(nodes)) nodes = [nodes];
  if (!keyword) return nodes;
  const lower = keyword.toLowerCase();
  let hasil = [];
  for (let node of nodes) {
    const nama = getNama(node).toLowerCase();
    const match = nama.includes(lower);
    let filteredAnak = [];
    const anak = getAnak(node);
    if (anak && Array.isArray(anak)) {
      filteredAnak = filterData(anak, keyword);
    }
    if (match || filteredAnak.length > 0) {
      hasil.push({ ...node, _filteredAnak: filteredAnak });
    }
  }
  return hasil;
}

function Item({ node, depth, searchTerm }) {
  const [buka, setBuka] = useState(true);
  const isOpen = searchTerm ? true : buka;
  const anakAsli = getAnak(node);
  const anakTampil = node._filteredAnak || anakAsli;
  const foto = getFoto(node);
  const foto2 = node.foto2 || node._original?.foto2 || "";
  const hasChildren = anakAsli && anakAsli.length > 0;
  const isDark = hasChildren || depth <= 5;
  const nama = getNama(node);
  const tgl = getTgl(node);

  if (!nama) return null;

  return (
    <div style={{ marginLeft: depth * 16 }}>
      <div
        onClick={() => setBuka(!buka)}
        style={{
          background: isDark ? "#1e293b" : "white",
          color: isDark ? "white" : "black",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px",
          borderRadius: "8px",
          margin: "4px 0",
          cursor: "pointer",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          {foto ? (
            <img
              src={foto}
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid white",
                zIndex: 2,
              }}
            />
          ) : (
            <span>📁</span>
          )}
          {foto2 ? (
            <img
              src={foto2}
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid white",
                marginLeft: "-8px",
                zIndex: 1,
              }}
            />
          ) : null}
        </div>
        <span>{nama}</span>
        <span style={{ fontSize: "10px", opacity: 0.7 }}>{tgl}</span>
      </div>
      {isOpen &&
        anakTampil &&
        anakTampil.map((child, i) => (
          <Item key={i} node={child} depth={depth + 1} searchTerm={searchTerm} />
        ))}
    </div>
  );
}

export default function SilsilahFolder({ data, searchTerm }) {
  const list = Array.isArray(data) ? data : [data];
  const filtered = filterData(list, searchTerm);
  if (filtered.length === 0)
    return (
      <div style={{ textAlign: "center", padding: 20, color: "#94a3b8" }}>
        😕 Nama tidak ketemu pak
      </div>
    );
  return (
    <div>
      {filtered.map((node, i) => (
        <Item key={i} node={node} depth={0} searchTerm={searchTerm} />
      ))}
    </div>
  );
}
