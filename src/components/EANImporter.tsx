// components/EANImporter.tsx
import { useState } from "react";
import { isValidEAN13 } from "../utils/eanValidator";

export default function EANImporter({ onImport }: { onImport: (codes: string[]) => void }) {
  const [input, setInput] = useState("");

  const handleImport = () => {
    const codes = input
      .split("\n")
      .map(c => c.trim())
      .filter(c => c.length > 0 && isValidEAN13(c));

    onImport(codes);
    setInput(""); // limpa após importar
  };

  return (
    <div className="bg-slate-900 p-4 rounded-lg shadow-lg">
      <textarea
        className="w-full h-40 p-2 bg-slate-950 text-emerald-400 font-mono"
        placeholder="Cole aqui os códigos EAN-13 (um por linha)..."
        value={input}
        onChange={e => setInput(e.target.value)}
      />
      <button
        onClick={handleImport}
        className="mt-2 px-4 py-2 bg-emerald-500 text-black font-bold rounded hover:bg-emerald-400"
      >
        ⚡ Importar Códigos
      </button>
    </div>
  );
}
