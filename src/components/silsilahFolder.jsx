import { useState } from "react";

const filterData = (list, term) => {
  if (!term) return list;
  return list.filter((n) => JSON.stringify(n).toLowerCase().includes(term.toLowerCase()));
};

function Node({ node, isLast, depth, onFotoClick }) {
  const [open, setOpen] = useState(true);
  const hasChild = node.children && node.children.length > 0;
  const isFolder = node.type === "family" || hasChild || (node.label && node.label.includes("+"));

  return (
    <div style={{ position: "relative", paddingLeft: "24px" }}>
      {/* GARIS VERTIKAL lurus ke bawah - kalau bukan anak terakhir */}
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

      {/* GARIS HORIZONTAL dari vertical ke folder */}
      <div
        style={{
          position: "absolute",
          left: "8px",
          top: "14px",
          width: "16px",
          borderTop: "1.5px solid #94a3b8",
        }}
      />

      {/* ICON + NAMA */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "4px 0" }}>
        <span onClick={() => hasChild && setOpen(!open)} style={{ cursor: "pointer" }}>
          {isFolder ? "📁" : "👤"}
        </span>
        <span
          onClick={() => onFotoClick && onFotoClick(node)}
          style={{ cursor: "pointer", color: "#475569" }}
        >
          {node.label || node.name}
        </span>
      </div>

      {/* ANAK-ANAK */}
      {hasChild && open && (
        <div>
          {node.children.map((child, idx) => (
            <Node
              key={idx}
              node={child}
              isLast={idx === node.children.length - 1}
              depth={depth + 1}
              onFotoClick={onFotoClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SilsilahFolder({ data, searchTerm }) {
  const list = Array.isArray(data) ? data : [data];
  const filtered = filterData(list, searchTerm);

  return (
    <div style={{ background: "white", padding: "20px", borderRadius: "16px" }}>
      {filtered.map((root, i) => (
        <div key={i}>
          <div style={{ display: "flex", gap: "6px", fontWeight: "600", paddingBottom: "4px" }}>
            <span>📁</span>
            <span>{root.label || root.name}</span>
          </div>
          <div style={{ paddingLeft: "0" }}>
            {root.children?.map((child, idx) => (
              <Node
                key={idx}
                node={child}
                isLast={idx === root.children.length - 1}
                depth={1}
                onFotoClick={() => {}}
              />
            ))}
          </div>
        </div>
      ))}
      <div style={{ marginTop: "16px", fontSize: "11px", textAlign: "center", color: "#94a3b8" }}>
        Klik folder buka/tutup • Foto taruh di folder public/foto
      </div>
    </div>
  );
}
