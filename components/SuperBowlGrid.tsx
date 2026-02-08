"use client";


import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

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
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Save grid data to Supabase
  const saveGridToDatabase = async () => {
    setIsSaving(true);
    
    const gridData = {
      id: 1,
      participants,
      afc_numbers: afcNumbers,
      nfc_numbers: nfcNumbers,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('grid_data')
      .upsert(gridData);

    if (error) {
      console.error('Error saving grid:', error);
      alert('Error saving grid. Please try again.');
    } else {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
    
    setIsSaving(false);
  };

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
            <div className="bg-white rounded-lg p-6 w-72 relative text-black">
              <button className="absolute top-2 right-2 text-xl text-slate-700 hover:text-red-600 font-bold" onClick={() => setSelectedCell(null)}>&times;</button>
              <h2 className="font-black text-lg mb-2">Edit Square</h2>
              <input
                className="w-full border border-black rounded p-2 mb-2"
                value={cellInput}
                onChange={e => setCellInput(e.target.value)}
                placeholder="Enter name"
              />
              <button className="w-full bg-green-600 text-white py-2 rounded font-bold" onClick={saveCell}>Save</button>
            </div>
          </div>
        )}
        <div className="w-full flex flex-col items-center">
        <button
          className="absolute top-2 right-2 text-2xl text-black hover:text-red-600 font-bold"
          onClick={onClose}
        >
          ×
        </button>
        {/* How to Play Paragraph */}
        <div className="mb-4 max-w-2xl mx-auto text-center text-slate-700 text-sm font-semibold bg-white/80 rounded-lg p-3 shadow">
          <p>
            <span className="font-black text-green-600">How to Play:</span> Squares are <span className="font-bold">$1 each</span>. Buy them from <span className="font-bold">Cole Grundhauser</span>.<br />
            Winners are chosen from the quarter scores: take the <span className="font-bold">last digit</span> of each team's score at the end of each quarter. The person in that square wins.<br />
            Numbers on the top (Seahawks) and side (Patriots) are randomized before the start of the game.<br />
            Payouts: 1st, 2nd, and 3rd quarter winners get <span className="font-bold">20%</span> each; 4th quarter gets <span className="font-bold">40%</span>.
          </p>
        </div>
        {/* Grid Header */}
        <div className="mb-2 w-full max-w-full mx-auto">
          <span className="block text-center font-black text-lg text-blue-600 mb-1">{NFC}</span>
        </div>
        <div className="w-full max-w-full overflow-hidden">
          <div className="flex flex-row w-full max-w-full items-stretch" style={{ width: '100%', maxWidth: '95vw', overflow: 'hidden' }}>
            {/* Patriots label on the left, vertically centered, vertical text */}
            <div className="flex flex-col justify-center items-center" style={{width: '32px', minWidth: '32px', height: '100%'}}>
              <span
                className="font-black text-md text-red-700 whitespace-nowrap"
                style={{
                  writingMode: 'vertical-rl',
                  transform: 'rotate(180deg)',
                  letterSpacing: '0.05em',
                  textAlign: 'center',
                  display: 'inline-block',
                  marginTop: '120px',
                }}
              >
                {AFC}
              </span>
            </div>
            <div className="flex flex-col w-full">
            {/* Seahawks numbers row */}
            <div className="flex w-full">
              <div style={{ width: '10%' }}></div>
              {nfcNumbers.map((num, idx) => (
                <div key={"nfc-"+idx} style={{ width: '9%' }} className="flex items-center justify-center font-bold text-slate-700 border border-slate-300 bg-slate-100 text-xs aspect-square">
                  {num}
                </div>
              ))}
            </div>
            {/* Grid rows */}
            {participants.map((row, rowIdx) => (
              <div key={rowIdx} className="flex w-full">
                {/* Patriots number */}
                <div style={{ width: '9%' }} className="flex items-center justify-center font-bold text-slate-700 border border-slate-300 bg-slate-100 text-xs aspect-square">
                  {afcNumbers[rowIdx]}
                </div>
                {row.map((name, colIdx) => (
                  <div key={colIdx} style={{ width: '9%' }} className={`border border-slate-300 flex items-center justify-center ${isAdmin ? 'cursor-pointer hover:bg-yellow-100' : ''} bg-white text-[10px] aspect-square`}
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
        </div>
        {isAdmin && (
          <div className="mt-4 flex flex-col items-center gap-2">
            <button
              disabled={isSaving}
              className={`px-6 py-3 rounded-lg font-black text-lg transition-all shadow-lg ${
                isSaving 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
              onClick={saveGridToDatabase}
            >
              {isSaving ? 'SAVING...' : '💾 SAVE GRID'}
            </button>
            
            {saveSuccess && (
              <div className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold animate-pulse">
                ✓ Grid saved! Everyone can now see the updates.
              </div>
            )}
            
            <div className="flex gap-2">
              <button
                className="bg-green-600 text-white px-3 py-1 rounded font-bold hover:bg-green-700"
                onClick={randomizeGridNumbers}
              >
                Randomize Numbers
              </button>
              <button
                className="bg-green-600 text-white px-3 py-1 rounded font-bold hover:bg-green-700"
                onClick={() => setShowAddMultiple(true)}
              >
                Add Multiple
              </button>
            </div>
          </div>
        )}

        {/* Add Multiple Modal */}
        {isAdmin && showAddMultiple && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-white rounded-lg p-6 w-80 relative text-black">
              <button className="absolute top-2 right-2 text-xl text-black hover:text-red-600 font-bold" onClick={() => setShowAddMultiple(false)}>&times;</button>
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
              <button className="w-full bg-green-600 text-white py-2 rounded font-bold" onClick={handleAddMultiple}>
                Add
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
