import React, { useState } from "react";

function filterData(list, searchTerm) {
  if (!searchTerm) return list;
  const lower = searchTerm.toLowerCase();
  return list.filter((item) => {
    const nama = (item.nama || item.name || "").toLowerCase();
    if (nama.includes(lower)) return true;
    const anak = item.anak || item.children || [];
    return filterData(anak, searchTerm).length > 0;
  });
}

function Item({ node, depth, searchTerm, onFotoClick }) {
  const [isOpen, setIsOpen] = useState(true);
  const nama = node.nama || node.name || "";
  const tgl = node.tgl || node.tanggal || "";
  const anak = node.anak || node.children || [];
  const anakTampil = anak;

  return (
    <div style={{ marginLeft: depth === 0 ? 0 : 10 }}>
      <div
        onClick={() => anak.length > 0 && setIsOpen(!isOpen)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 12px",
          borderRadius: 12,
          background: "#1e293b",
          color: "white",
          cursor: anak.length > 0 ? "pointer" : "default",
          marginBottom: 6,
          marginTop: 4,
          zIndex: 1,
        }}
      >
        <span>{anak.length > 0 ? (isOpen ? "📂" : "📁") : "👤"}</span>
        <span style={{ fontWeight: 600 }}>{nama}</span>
        <span style={{ fontSize: 10, opacity: 0.7 }}>{tgl}</span>
      </div>

      {isOpen && (
        <div
          style={{
            borderLeft: "2px dashed #64748b",
            marginLeft: 14,
            paddingLeft: 10,
            marginTop: 6,
          }}
        >
          {anakTampil?.map((child, i) => (
            <Item
              key={i}
              node={child}
              depth={depth + 1}
              searchTerm={searchTerm}
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

  return (
    <div>
      {filtered.map((node, i) => (
        <Item key={i} node={node} depth={0} searchTerm={searchTerm} onFotoClick={setSelected} />
      ))}
    </div>
  );
}
c;
