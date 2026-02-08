'use client';

import { useState, useEffect } from 'react';
import propBetsData from '@/data/prop-bets.json';
import { PropBetsData, UserPick } from '@/types/prop-bets';

const STORAGE_KEY = 'super-bowl-prop-bets';

export default function PropBetting() {
  const data = propBetsData as PropBetsData;
  const [userPicks, setUserPicks] = useState<Record<string, string>>({});
  const [userName, setUserName] = useState('');
  const [tiebreakerScore, setTiebreakerScore] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  // Load saved picks from localStorage
  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUserPicks(parsed.picks || {});
        setUserName(parsed.userName || '');
        setTiebreakerScore(parsed.tiebreakerScore || '');
      } catch (error) {
        console.error('Error loading saved picks:', error);
      }
    }
  }, []);

  // Save picks to localStorage whenever they change
  useEffect(() => {
    if (isMounted) {
      const dataToSave = {
        picks: userPicks,
        userName,
        tiebreakerScore,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    }
  }, [userPicks, userName, tiebreakerScore, isMounted]);

  const handlePickSelection = (propId: string, optionId: string) => {
    setUserPicks((prev) => ({
      ...prev,
      [propId]: optionId,
    }));
  };

  const handleTextInput = (propId: string, value: string) => {
    setUserPicks((prev) => ({
      ...prev,
      [propId]: value,
    }));
  };

  const clearAllPicks = () => {
    if (confirm('Are you sure you want to clear all your picks?')) {
      setUserPicks({});
      setUserName('');
      setTiebreakerScore('');
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const getTotalPicks = () => {
    return Object.keys(userPicks).filter((key) => userPicks[key]).length;
  };

  const getTotalProps = () => {
    return data.categories.reduce((acc, cat) => acc + cat.props.length, 0);
  };

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xs sm:max-w-md mx-auto">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 p-0.5 rounded-t-xl">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-2 rounded-t-lg">
          <div className="text-center">
            <h2 className="text-lg sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200 mb-1">
              {data.gameInfo.title}
            </h2>
            <p className="text-slate-400 text-xs font-semibold mb-0.5">
              {data.gameInfo.date} • {data.gameInfo.venue}
            </p>
            <p className="text-yellow-500 text-xs font-bold">
              Scoring: {data.scoring.pointsPerCorrectPick} pt • {data.scoring.tiebreaker}
            </p>
          </div>
        </div>
      </div>

      {/* User Info Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-x border-slate-700 p-2">
        <div className="grid grid-cols-1 gap-2 mb-2">
          <div>
            <label className="block text-slate-400 text-sm font-semibold mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-yellow-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-slate-400 text-sm font-semibold mb-2">
              Tiebreaker: Total Points
            </label>
            <input
              type="number"
              value={tiebreakerScore}
              onChange={(e) => setTiebreakerScore(e.target.value)}
              placeholder="Total combined score"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-yellow-500 transition-colors"
            />
          </div>
          <div className="flex items-end">
            <div className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-2">
              <div className="text-yellow-500 text-lg font-black">
                {getTotalPicks()} / {getTotalProps()}
              </div>
              <div className="text-slate-400 text-xs font-semibold">Picks Made</div>
            </div>
          </div>
        </div>

        <button
          onClick={clearAllPicks}
          className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
        >
          Clear All Picks
        </button>
      </div>

      {/* Categories and Props */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-x border-b border-slate-700 rounded-b-lg p-2 space-y-4">
        {data.categories.map((category) => (
          <div key={category.id} className="space-y-4">
            {/* Category Header */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{category.icon}</span>
              <h3 className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">
                {category.name}
              </h3>
            </div>

            {/* Props Grid */}
            <div className="grid grid-cols-1 gap-2">
              {category.props.map((prop) => (
                <div
                  key={prop.id}
                  className="bg-slate-800/50 border border-slate-700 rounded-lg p-2 hover:border-yellow-500/50 transition-all"
                >
                  {/* Question */}
                  <h4 className="text-white font-bold text-xs mb-1">
                    {prop.question}
                  </h4>

                  {/* Options */}
                  {prop.type === 'text-input' || prop.type === 'player-input' ? (
                    <input
                      type="text"
                      value={userPicks[prop.id] || ''}
                      onChange={(e) => handleTextInput(prop.id, e.target.value)}
                      placeholder={prop.placeholder}
                      className="w-full px-2 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-yellow-500 transition-colors text-xs"
                    />
                  ) : (
                    <div className="grid grid-cols-2 gap-1">
                      {prop.options?.map((option) => {
                        const isSelected = userPicks[prop.id] === option.id;
                        return (
                          <button
                            key={option.id}
                            onClick={() => handlePickSelection(prop.id, option.id)}
                            className={`
                              px-2 py-2 rounded-lg font-bold transition-all text-xs
                              ${isSelected
                                ? 'bg-yellow-500 text-slate-900 shadow-md shadow-yellow-500/30'
                                : 'bg-slate-900 text-slate-300 border border-slate-600 hover:border-yellow-500 hover:text-yellow-500'
                              }
                            `}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Selected Indicator */}
                  {userPicks[prop.id] && (
                    <div className="mt-1 flex items-center gap-1 text-yellow-500 text-xs font-semibold">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Pick saved!</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Auto-save indicator */}
      <div className="mt-2 text-center">
        <p className="text-slate-600 text-xs">
          ✓ All picks automatically saved to your device
        </p>
      </div>
    </div>
  );
}
