import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface LeaderboardEntry {
  userName: string;
  points: number;
}

export default function PropBetLeaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

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

  return (
    <div className="bg-white rounded-lg shadow p-4 w-full max-w-md mx-auto">
      <h2 className="text-lg font-black mb-2 text-green-700">Prop Bet Leaderboard</h2>
      <ul>
        {entries.map((entry, idx) => (
          <li key={entry.userName} className="flex justify-between border-b py-1">
            <span>{idx + 1}. {entry.userName}</span>
            <span className="font-bold text-green-700">{entry.points}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
