
"use client";
import { useEffect, useState } from 'react';
import LiveScore from '@/components/LiveScore';
import PropBetting from '@/components/PropBetting';
import PropBetAdmin from '@/components/PropBetAdmin';
import GridButton from '@/components/GridButton';

export default function Page() {
  const [showBetting, setShowBetting] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
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
        <div className="flex justify-center mt-6">
          <GridButton isAdmin={isAdmin} />
        </div>

        {/* Betting Button */}
        <div className="flex justify-center mt-12">
          <button
            className="px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-black rounded-full shadow-lg text-xl transition-all border-2 border-yellow-400"
            onClick={() => setShowBetting(true)}
          >
            BETTING
          </button>
        </div>

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
