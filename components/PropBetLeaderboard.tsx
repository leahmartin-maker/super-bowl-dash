import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface LeaderboardEntry {
  userName: string;
  points: number;
}

export default function PropBetLeaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [showWinners, setShowWinners] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data, error } = await supabase
        .from('prop_bet_leaderboard')
        .select('*')
        .order('points', { ascending: false });
      if (!error && data) setEntries(data);
    };
    fetchLeaderboard();
    // Optionally, subscribe to changes for real-time updates
    const channel = supabase
      .channel('prop_bet_leaderboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'prop_bet_leaderboard' }, fetchLeaderboard)
      .subscribe();
    return () => { channel.unsubscribe(); };
  }, []);

  // Calculate pot and winners
  const costPerPlayer = 5;
  const totalPot = entries.length * costPerPlayer;
  const sorted = [...entries].sort((a, b) => b.points - a.points);
  const winners = sorted.slice(0, 3);
  const payout = [Math.round(totalPot * 0.5), Math.round(totalPot * 0.25), Math.round(totalPot * 0.25)];

  return (
    <div className="bg-white rounded-lg shadow p-4 w-full max-w-md mx-auto relative">
      <h2 className="text-lg font-black mb-2 text-green-700">Prop Bet Leaderboard</h2>
      <ul>
        {entries.map((entry, idx) => (
          <li key={entry.userName + '-' + entry.points} className="flex justify-between border-b py-1">
            <span>{idx + 1}. {entry.userName}</span>
            <span className="font-bold text-green-700">{entry.points}</span>
          </li>
        ))}
      </ul>
      {/* Winner Popup */}
      {showWinners && winners.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative text-black overflow-y-auto max-h-screen">
            <button className="absolute top-2 right-2 text-xl text-black hover:text-red-600 font-bold" onClick={() => setShowWinners(false)}>&times;</button>
            <h3 className="text-2xl font-black mb-4 text-center text-green-700">🏆 Prop Bet Winners 🏆</h3>
            <ol className="space-y-4">
              {winners.map((winner, idx) => (
                <li key={winner.userName + '-' + winner.points} className="flex flex-col items-center">
                  <span className="font-bold text-lg text-green-700">{idx === 0 ? '1st Place' : idx === 1 ? '2nd Place' : '3rd Place'}</span>
                  <span className="text-xl font-black">{winner.userName}</span>
                  <span className="text-green-700 font-bold">{winner.points} correct</span>
                  <span className="text-yellow-600 font-bold">Prize: ${payout[idx]}</span>
                </li>
              ))}
            </ol>
            <div className="mt-6 text-center text-slate-700 text-lg font-bold">
              Total Pot: <span className="text-yellow-600">${totalPot}</span> ({entries.length} players × $5)
            </div>
          </div>
        </div>
      )}
      {/* Pot at bottom */}
      <div className="mt-6 text-center text-slate-700 text-lg font-bold">
        Total Pot: <span className="text-yellow-600">${totalPot}</span> ({entries.length} players × $5)
      </div>
    </div>
  );
}
