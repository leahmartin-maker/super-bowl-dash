"use client";

import { useState } from "react";
import SuperBowlGrid from "./SuperBowlGrid";

export default function GridButton({ isAdmin }: { isAdmin: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 text-slate-900 font-black px-8 py-4 rounded-full shadow-lg hover:scale-105 transition mb-2 border-2 border-yellow-400 text-xl"
        onClick={() => setOpen(true)}
      >
        QTR BOARD GRID
      </button>
      <SuperBowlGrid open={open} onClose={() => setOpen(false)} isAdmin={isAdmin} />
    </>
  );
}
