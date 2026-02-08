
"use client";
import { useEffect, useRef, useState } from 'react';
import LiveScore from '@/components/LiveScore';
import PropBetting from '@/components/PropBetting';
import PropBetAdmin from '@/components/PropBetAdmin';
import GridButton from '@/components/GridButton';

export default function Home() {
  const [showBetting, setShowBetting] = useState(false);
  const [showGamePlan, setShowGamePlan] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showDrinkingGames, setShowDrinkingGames] = useState(false);
  const [drinkingGamesPage, setDrinkingGamesPage] = useState(0);
  const touchStartXRef = useRef<number | null>(null);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setIsAdmin(params.get('admin') === '1');
    }
  }, []);
  return (
    <div className="min-h-screen relative">
      {/* Football Field Background (user image) */}
      <div className="absolute inset-0 -z-10 bg-center bg-cover bg-no-repeat" style={{ backgroundImage: 'url(/field.jpg)', filter: 'brightness(0.7)' }} />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
      <main className="relative z-10 container mx-auto px-4 py-12 md:py-20">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <div className="bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 text-slate-900 px-6 py-2 rounded-full font-black text-sm uppercase tracking-widest">
              🏈 Super Bowl LX 🏈
            </div>
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 mb-4">
            POUR HAUS SUPER BOWL PARTY
          </h1>
          <p className="text-white text-xs md:text-sm max-w-2xl mx-auto">
            Live scores and real-time updates from Levi's Stadium
          </p>
        </div>

        {/* Live Score Component */}
        <LiveScore />


        {/* Super Bowl Grid Button */}
        <div className="flex flex-col items-center gap-6 mt-6">
          {/* The Game Plan Button */}
          <button
            className="px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-black rounded-full shadow-lg text-xl transition-all border-2 border-yellow-400 text-center"
            style={{ minWidth: 220 }}
            onClick={() => setShowGamePlan(true)}
          >
            THE GAME PLAN
          </button>
          {/* Qtr Board (GridButton) */}
          <GridButton isAdmin={isAdmin} />
          {/* Prop Bet Button */}
          <button
            className="px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-black rounded-full shadow-lg text-xl transition-all border-2 border-yellow-400 text-center"
            style={{ minWidth: 220 }}
            onClick={() => setShowBetting(true)}
          >
            PROP BETS
          </button>
          {/* Photo Booth Button */}
          <a
            href="https://jdl09.zappar-us.io/1198237891314520891/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-black rounded-full shadow-lg text-xl transition-all border-2 border-yellow-400 text-center"
            style={{ minWidth: 220 }}
          >
            PHOTO BOOTH
          </a>

          {/* Drinking Games Button */}
          <button
            className="px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-black rounded-full shadow-lg text-xl transition-all border-2 border-yellow-400 text-center mt-4"
            style={{ minWidth: 220 }}
            onClick={() => setShowDrinkingGames(true)}
          >
            DRINKING GAMES
          </button>
                {/* Drinking Games Modal */}
                {showDrinkingGames && (
                  <div
                    className="fixed inset-0 z-50 w-screen h-screen flex items-center justify-center"
                    style={{ backgroundImage: 'url(/field.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
                  >
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative text-black overflow-y-auto max-h-screen">
                      <button
                        className="absolute top-2 right-2 text-xl text-black hover:text-red-600 font-bold"
                        onClick={() => setShowDrinkingGames(false)}
                        aria-label="Close"
                      >
                        &#10005;
                      </button>
                      {/* Swipe navigation */}
                        <div
                          className="relative"
                          onTouchStart={e => {
                            touchStartXRef.current = e.touches[0].clientX;
                          }}
                          onTouchEnd={e => {
                            const startX = touchStartXRef.current;
                            const endX = e.changedTouches[0].clientX;
                            if (startX !== null) {
                              if (startX - endX > 50 && drinkingGamesPage === 0) setDrinkingGamesPage(1);
                              if (endX - startX > 50 && drinkingGamesPage === 1) setDrinkingGamesPage(0);
                            }
                          }}
                        >
                          {drinkingGamesPage === 0 ? (
                            <div>
                              <h2 className="text-2xl font-black mb-4 text-center text-black">Super Bowl Drinking Game</h2>
                              <div className="space-y-4 text-base">
                                <div>
                                  <span className="font-bold">Standard Gameplay Rules</span>
                                  <p>These rules apply to the live action on the field.</p>
                                </div>
                                <div>
                                  <span className="font-bold">Take a Sip when:</span>
                                  <ul className="list-disc pl-6">
                                    <li>A first down is gained.</li>
                                    <li>A penalty flag is thrown by a referee.</li>
                                    <li>A slow-motion replay is shown from a different angle.</li>
                                    <li>A kicker makes a field goal or extra point.</li>
                                  </ul>
                                </div>
                                <div>
                                  <span className="font-bold">Take 2 Sips when:</span>
                                  <ul className="list-disc pl-6">
                                    <li>A team successfully converts a third down.</li>
                                    <li>A player drops a wide-open pass.</li>
                                    <li>The broadcast mentions a stat "that nobody cares about".</li>
                                  </ul>
                                </div>
                                <div>
                                  <span className="font-bold">Take a Shot when:</span>
                                  <ul className="list-disc pl-6">
                                    <li>There is a quarterback sack.</li>
                                    <li>A touchdown is scored (or finish your drink).</li>
                                    <li>A turnover occurs (interception or fumble).</li>
                                    <li>A coach throws a challenge flag.</li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center">
                              <h2 className="text-2xl font-black mb-4 text-center text-black">Super Bowl LX Drinking Game</h2>
                              <img src="/drinkinggame.png" alt="Super Bowl LX Drinking Game" className="rounded-lg max-w-full h-auto" />
                            </div>
                          )}
                          {/* Dots navigation with click support */}
                          <div className="flex justify-center mt-6">
                            <button
                              className={`h-3 w-3 rounded-full mx-2 ${drinkingGamesPage === 0 ? 'bg-yellow-500' : 'bg-gray-300'}`}
                              aria-label="Show drinking game text"
                              onClick={() => setDrinkingGamesPage(0)}
                              style={{ border: 'none', outline: 'none', cursor: 'pointer' }}
                            />
                            <button
                              className={`h-3 w-3 rounded-full mx-2 ${drinkingGamesPage === 1 ? 'bg-yellow-500' : 'bg-gray-300'}`}
                              aria-label="Show drinking game image"
                              onClick={() => setDrinkingGamesPage(1)}
                              style={{ border: 'none', outline: 'none', cursor: 'pointer' }}
                            />
                          </div>
                        </div>
                      </div>
                  </div>
                )}
        </div>
        {/* Game Plan Modal */}
        {showGamePlan && (
          <div
            className="fixed inset-0 z-50 w-screen h-screen flex items-center justify-center"
            style={{ backgroundImage: 'url(/field.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative text-black overflow-y-auto max-h-screen">
              <button
                className="absolute top-2 right-2 text-xl text-black hover:text-red-600 font-bold"
                onClick={() => setShowGamePlan(false)}
                aria-label="Close"
              >
                &#10005;
              </button>
              <h2 className="text-2xl font-black mb-4 text-center text-black">The Game Plan</h2>
              <div className="space-y-6 text-base">
                <div>
                  <span className="font-bold">The Main Event</span>
                  <p>Watch the Super Bowl live! We'll be showing the game outside on the big projector for the ultimate viewing experience. </p>
                </div>
                <div>
                  <span className="font-bold">LET'S GLOW! Party</span>
                  <p>Get your glow on! We'll have glow sticks and fun glowing accessories to light up the night. Perfect for all ages—let's make the party shine!</p>
                </div>
                <div>
                  <span className="font-bold">Get Your Game Face On</span>
                  <p>Show your team spirit or just get creative! Leah will be offering a face painting station, open for everyone to get festive and colorful!</p>
                </div>
                <div>
                  <span className="font-bold">1st & 10 Toppings</span>
                  <p>Build your own nachos with all the fixings! Pile them high and enjoy a delicious snack throughout the game.</p>
                </div>
                <div>
                  <span className="font-bold">End Zone Odds</span>
                  <p>Test your luck and football knowledge with our prop bets and 10x10 squares—place your bets right here on the site and see if you win big!</p>
                </div>
                <div>
                  <span className="font-bold">Sideline Sips</span>
                  <p>Grab a beverage of choice and play along with our Super Bowl 2026 Drinking Game on the home page. </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ...existing code... */}

        {/* Betting Modal */}
        {showBetting && (
          <div className="fixed inset-0 z-50 w-screen h-screen flex items-center justify-center" style={{ backgroundImage: 'url(/field.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="relative w-full h-full max-h-screen overflow-y-auto p-0">
              <div className="sticky top-2 right-2 z-10 flex justify-end">
                <button
                  className="bg-transparent text-white hover:text-yellow-500 font-bold rounded-full p-2 text-2xl"
                  onClick={() => setShowBetting(false)}
                  aria-label="Close"
                >
                  &#10005;
                </button>
              </div>
              <PropBetting isAdmin={isAdmin} />
            </div>
          </div>
        )}
        {/* Admin Modal */}
        {isAdmin && showAdmin && (
          <div className="fixed inset-0 z-50 w-screen h-screen flex items-center justify-center bg-black bg-opacity-60">
            <div className="relative w-full max-w-lg mx-auto">
              <PropBetAdmin onClose={() => setShowAdmin(false)} />
            </div>
          </div>
        )}
        {/* Admin Button */}
        {isAdmin && (
          <div className="fixed bottom-4 right-4 z-50">
            <button className="bg-green-600 text-white px-4 py-2 rounded font-bold shadow-lg" onClick={() => setShowAdmin(true)}>
              Admin: Pick Winners
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 text-center text-white">
          <p className="text-sm">
            Built by Leah Grundhauser - Creative Technologist
          </p>
          <p className="text-xs mt-2">
            Data provided by ESPN
          </p>
        </div>
      </main>
    </div>
  );
}
