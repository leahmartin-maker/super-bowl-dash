"use client";


import { useState } from "react";

const ROWS = 10;
const COLS = 10;
const AFC = "New England Patriots";
const NFC = "Seattle Seahawks";

function randomizeNumbers() {
  const nums = Array.from({ length: 10 }, (_, i) => i);
  return nums.sort(() => Math.random() - 0.5);
}

export default function SuperBowlGrid({ open, onClose, isAdmin = false }: { open: boolean; onClose: () => void; isAdmin?: boolean }) {
  const [showAddMultiple, setShowAddMultiple] = useState(false);
  const [multiName, setMultiName] = useState("");
  const [multiQty, setMultiQty] = useState(1);
  const [participants, setParticipants] = useState<string[][]>(
    Array.from({ length: ROWS }, () => Array(COLS).fill(""))
  );
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [cellInput, setCellInput] = useState("");
  const [winner, setWinner] = useState<string>("");
  const [afcNumbers, setAfcNumbers] = useState<number[]>(randomizeNumbers());
  const [nfcNumbers, setNfcNumbers] = useState<number[]>(randomizeNumbers());
  const [editing, setEditing] = useState(true);

  // Helper to get all empty cells
  const getEmptyCells = () => {
    const empty: { row: number; col: number }[] = [];
    participants.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (!cell) empty.push({ row: i, col: j });
      });
    });
    return empty;
  };

  const handleAddMultiple = () => {
    const empty = getEmptyCells();
    if (!multiName || multiQty < 1 || empty.length === 0) return;
    const qty = Math.min(multiQty, empty.length);
    // Shuffle empty cells
    const shuffled = empty.sort(() => Math.random() - 0.5);
    const updated = participants.map(row => [...row]);
    for (let i = 0; i < qty; i++) {
      const { row, col } = shuffled[i];
      updated[row][col] = multiName;
    }
    setParticipants(updated);
    setShowAddMultiple(false);
    setMultiName("");
    setMultiQty(1);
  };

  const handleNameChange = (row: number, col: number, value: string) => {
    const updated = participants.map((r, i) =>
      r.map((c, j) => (i === row && j === col ? value : c))
    );
    setParticipants(updated);
  };

  const openCellModal = (row: number, col: number) => {
    setSelectedCell({ row, col });
    setCellInput(participants[row][col]);
    setWinner("");
  };

  const saveCell = () => {
    if (selectedCell) {
      handleNameChange(selectedCell.row, selectedCell.col, cellInput);
      setSelectedCell(null);
    }
  };

  const randomizeGridNumbers = () => {
    setAfcNumbers(randomizeNumbers());
    setNfcNumbers(randomizeNumbers());
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundImage: "url(/field.jpg)", backgroundSize: "cover", backgroundPosition: "center", fontFamily: 'Helvetica, Arial, sans-serif' }}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl p-4 relative overflow-auto max-h-[90vh]">
        {/* Cell Modal */}
        {selectedCell && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-white rounded-lg p-6 w-72 relative">
              <button className="absolute top-2 right-2 text-xl text-slate-700 hover:text-red-600 font-bold" onClick={() => setSelectedCell(null)}>&times;</button>
              <h2 className="font-black text-lg mb-2">Edit Square</h2>
              <input
                className="w-full border border-slate-300 rounded p-2 mb-2"
                value={cellInput}
                onChange={e => setCellInput(e.target.value)}
                placeholder="Enter name"
              />
              <button className="w-full bg-blue-600 text-white py-2 rounded font-bold" onClick={saveCell}>Save</button>
            </div>
          </div>
        )}
        <div className="w-full">
        <button
          className="absolute top-2 right-2 text-2xl text-slate-700 hover:text-red-600 font-bold"
          onClick={onClose}
        >
          ×
        </button>
        {/* How to Play Paragraph */}
        <div className="mb-4 max-w-2xl mx-auto text-center text-slate-700 text-sm font-semibold bg-white/80 rounded-lg p-3 shadow">
          <p>
            <span className="font-black text-green-600">How to Play:</span> Squares are <span className="font-bold">$1 each</span>. Buy them from <span className="font-bold">Cole Grundhauser</span>.<br />
            Winners are chosen from the quarter scores: take the <span className="font-bold">last digit</span> of each team's score at the end of each quarter. The person in that square wins.<br />
            Numbers on the top (Seahawks) and side (Patriots) are randomized before each pick.<br />
            Payouts: 1st, 2nd, and 3rd quarter winners get <span className="font-bold">20%</span> each; 4th quarter (final score) gets <span className="font-bold">40%</span>.
          </p>
        </div>
        {/* Grid Header */}
        <div className="mb-2" style={{ width: 'calc(10 * 2rem + 2rem)', marginLeft: 'auto', marginRight: 'auto' }}>
          <span className="block text-center font-black text-lg text-blue-600 mb-1">{NFC}</span>
        </div>
        <div className="flex">
          {/* Left: Patriots label */}
          <div className="flex flex-col items-center mr-1">
            <span className="font-black text-lg text-red-600 mb-1 mt-16" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>{AFC}</span>
          </div>
          {/* Main grid with top row: Seahawks numbers and left col: Patriots numbers */}
          <div className="flex flex-col">
            <div className="flex">
              <div className="w-8 h-8"></div>
              {nfcNumbers.map((num, idx) => (
                <div key={idx} className="w-8 h-8 flex items-center justify-center font-bold text-slate-700 border border-slate-300 bg-slate-100 text-xs">
                  {num}
                </div>
              ))}
            </div>
            {participants.map((row, rowIdx) => (
              <div key={rowIdx} className="flex">
                {/* Patriots numbers on left */}
                <div className="w-8 h-8 flex items-center justify-center font-bold text-slate-700 border border-slate-300 bg-slate-100 text-xs">
                  {afcNumbers[rowIdx]}
                </div>
                {row.map((name, colIdx) => (
                  <div key={colIdx} className={`w-8 h-8 border border-slate-300 flex items-center justify-center ${isAdmin ? 'cursor-pointer hover:bg-yellow-100' : ''} bg-white text-[10px]`}
                    onClick={isAdmin ? () => openCellModal(rowIdx, colIdx) : undefined}
                  >
                    {name || <span className="text-slate-300">+</span>}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        </div>
        {isAdmin && (
          <div className="mt-4 flex flex-col items-center gap-2">
            <button
              className="bg-blue-600 text-white px-3 py-1 rounded font-bold"
              onClick={randomizeGridNumbers}
            >
              Randomize Numbers
            </button>
            <button
              className="bg-green-600 text-white px-3 py-1 rounded font-bold"
              onClick={() => setShowAddMultiple(true)}
            >
              Add Multiple
            </button>
          </div>
        )}

        {/* Add Multiple Modal */}
        {isAdmin && showAddMultiple && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-white rounded-lg p-6 w-80 relative">
              <button className="absolute top-2 right-2 text-xl text-slate-700 hover:text-red-600 font-bold" onClick={() => setShowAddMultiple(false)}>&times;</button>
              <h2 className="font-black text-lg mb-2">Add Multiple Squares</h2>
              <input
                className="w-full border border-slate-300 rounded p-2 mb-2"
                value={multiName}
                onChange={e => setMultiName(e.target.value)}
                placeholder="Enter name"
              />
              <input
                type="number"
                min={1}
                max={100}
                className="w-full border border-slate-300 rounded p-2 mb-2"
                value={multiQty}
                onChange={e => setMultiQty(Number(e.target.value))}
                placeholder="Quantity"
              />
              <button className="w-full bg-blue-600 text-white py-2 rounded font-bold" onClick={handleAddMultiple}>
                Add
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
