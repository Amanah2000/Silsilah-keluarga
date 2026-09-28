import { useState } from "react";

export default function Belajar() {
  const [nama, setNama] = useState("");
  return (
    <>
      <input onChange={(e) => setNama(e.target.value)} placeholder="ketik..." />
      <p>Halo, {nama}</p>
    </>
  );
}
