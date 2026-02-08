'use client';

import { useEffect, useState } from 'react';
import { GameData, Event, Competitor, Competition } from '@/types/nfl';

const ESPN_API_URL = 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard';

interface GameState {
  patriots: Competitor | null;
  seahawks: Competitor | null;
  status: {
    clock: string;
    period: number;
    detail: string;
    state: 'pre' | 'in' | 'post';
  } | null;
  competition: Competition | null;
}

export default function LiveScore() {
  const [gameState, setGameState] = useState<GameState>({
    patriots: null,
    seahawks: null,
    status: null,
    competition: null,
  });
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGameData = async () => {
    try {
      const response = await fetch(ESPN_API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch game data');
      }
      
      const data: GameData = await response.json();
      
      // Find the Patriots vs Seahawks game
      const superBowlGame = data.events?.find((event: Event) => {
        const competition = event.competitions[0];
        const teams = competition.competitors.map(c => c.team.abbreviation);
        return (teams.includes('NE') && teams.includes('SEA'));
      });

      if (superBowlGame) {
        const competition = superBowlGame.competitions[0];
        const patriots = competition.competitors.find(c => c.team.abbreviation === 'NE') || null;
        const seahawks = competition.competitors.find(c => c.team.abbreviation === 'SEA') || null;
        
        const status = {
          clock: competition.status.displayClock,
          period: competition.status.period,
          detail: competition.status.type.detail,
          state: competition.status.type.state,
        };

        setGameState({
          patriots,
          seahawks,
          status,
          competition,
        });

        setIsLive(status.state === 'in');
      } else {
        // If game not found, set mock data for demonstration
        setError('Game not currently available. Displaying mock data.');
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching game data:', err);
      setError('Unable to load game data');
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchGameData();

    // Set up interval to fetch every 30 seconds
    const interval = setInterval(() => {
      fetchGameData();
    }, 30000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  const getQuarterDisplay = (period: number) => {
    if (period === 1) return '1ST';
    if (period === 2) return '2ND';
    if (period === 3) return '3RD';
    if (period === 4) return '4TH';
    if (period > 4) return `OT${period - 4 > 1 ? period - 4 : ''}`;
    return '';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-slate-700">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-slate-400 font-semibold">Loading Super Bowl LX...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-xs sm:max-w-md mx-auto">
      {/* Super Bowl Header */}
      <div className="bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 p-0.5 rounded-t-xl">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-2 rounded-t-lg">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200 tracking-tight" >
                SUPER BOWL LX
              </h1>
              {isLive && (
                <div className="flex items-center gap-1 px-2 py-1 bg-red-600 rounded-full animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full animate-ping absolute"></div>
                  <div className="w-2 h-2 bg-white rounded-full relative"></div>
                  <span className="text-white font-bold text-xs ml-2">LIVE</span>
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="flex items-center gap-0.5 justify-end">
                <p className="text-yellow-500 text-[14px] font-bold">Levi's Stadium</p>
                <span className="text-slate-400 text-[14px] font-semibold">• Feb 8, 2026</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scoreboard */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-x border-slate-700 p-1">
        {error && !gameState.patriots && (
          <div className="text-center py-8">
            <p className="text-yellow-500 font-semibold mb-2">{error}</p>
            <p className="text-slate-400 text-sm">Check back closer to game time</p>
          </div>
        )}
        
        {/* Patriots */}
        <div className="mb-1">
          <div className="flex items-center justify-between bg-slate-800/50 rounded-lg p-1 border border-slate-700 hover:border-yellow-500/50 transition-all">
            <div className="flex items-center gap-1">
              <div className="w-6 h-6 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg flex items-center justify-center border-2 border-slate-600">
                <span className="text-sm font-black text-red-600">NE</span>
              </div>
              <div>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">AFC</p>
                <h2 className="text-sm sm:text-base font-black text-white">Patriots</h2>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg sm:text-xl font-black text-yellow-500">
                {gameState.patriots?.score || '0'}
              </p>
            </div>
          </div>
        </div>

        {/* Game Status */}
        {gameState.status && (
          <div className="flex items-center justify-center gap-2 my-1">
            <div className="flex flex-col items-center bg-slate-800 rounded-lg px-2 py-1 border border-yellow-500/30">
              <span className="text-yellow-500 text-xs font-bold uppercase tracking-widest mb-0.5">
                {getQuarterDisplay(gameState.status.period)}
              </span>
              <span className="text-sm font-black text-white tabular-nums">
                {gameState.status.clock}
              </span>
            </div>
            <div className="text-center">
              <p className="text-slate-400 text-xs font-semibold">{gameState.status.detail}</p>
            </div>
          </div>
        )}

        {/* Seahawks */}
        <div>
          <div className="flex items-center justify-between bg-slate-800/50 rounded-lg p-1 border border-slate-700 hover:border-yellow-500/50 transition-all">
            <div className="flex items-center gap-1">
              <div className="w-6 h-6 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg flex items-center justify-center border-2 border-slate-600">
                <span className="text-sm font-black text-blue-600">SEA</span>
              </div>
              <div>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">NFC</p>
                <h2 className="text-sm sm:text-base font-black text-white">Seahawks</h2>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg sm:text-xl font-black text-yellow-500">
                {gameState.seahawks?.score || '0'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Halftime Show */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-b-lg border-x border-b border-slate-700 p-1">
        <div className="text-center">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-0.5">Halftime Show</p>
          <p className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">
            BAD BUNNY 
          </p>
        </div>
      </div>

      {/* Last Updated */}
      <div className="mt-1 text-center">
        <p className="text-white text-xs">
          Updates every 30 seconds • Powered by ESPN
        </p>
      </div>
    </div>
  );
}
