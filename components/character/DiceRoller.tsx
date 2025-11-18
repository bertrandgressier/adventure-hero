'use client';

import { useState } from 'react';
import { trackDiceRoll } from '@/src/infrastructure/analytics/tracking';

interface DiceRollerProps {
  onClose: () => void;
}

const getDiceFace = (value: number) => {
  const faces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
  return faces[value - 1];
};

export default function DiceRoller({ onClose }: DiceRollerProps) {
  const [diceResult, setDiceResult] = useState<number[]>([6, 6]);
  const [diceTotal, setDiceTotal] = useState(12);
  const [isRolling, setIsRolling] = useState(false);

  const rollDice = (count: number) => {
    setIsRolling(true);

    const results: number[] = [];
    let total = 0;

    for (let i = 0; i < count; i++) {
      const roll = Math.floor(Math.random() * 6) + 1;
      results.push(roll);
      total += roll;
    }

    // Si on lance 1 dé, on garde le deuxième à 0
    if (count === 1) {
      results.push(0);
    }

    setTimeout(() => {
      setDiceResult(results);
      setDiceTotal(total);
      setIsRolling(false);
      
      // Tracker le lancer de dés
      trackDiceRoll(count === 1 ? '1d6' : '2d6', total, 'general');
    }, 500);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="bg-[#2a1e17] border-2 border-[#FFBF00] rounded-lg p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-[var(--font-uncial)] text-3xl tracking-wide text-[#FFBF00] mb-6 text-center">
          🎲 Lancer de dés
        </h3>

        {/* Affichage des dés - toujours visible */}
        <div className="mb-6">
          <div className="flex justify-center gap-4 mb-4">
            {diceResult[0] > 0 && (
              <div
                className={`w-24 h-24 bg-[#FFBF00] border-2 border-[#000000] rounded-xl flex items-center justify-center text-7xl text-[#000000] shadow-lg shadow-[#FFBF00]/50 ${
                  isRolling ? 'animate-[spin_0.5s_ease-in-out]' : 'animate-[bounce_0.5s_ease-in-out]'
                }`}
              >
                {getDiceFace(diceResult[0])}
              </div>
            )}
            {diceResult[1] > 0 && (
              <div
                className={`w-24 h-24 bg-[#FFBF00] border-2 border-[#000000] rounded-xl flex items-center justify-center text-7xl text-[#000000] shadow-lg shadow-[#FFBF00]/50 ${
                  isRolling ? 'animate-[spin_0.5s_ease-in-out]' : 'animate-[bounce_0.5s_ease-in-out]'
                }`}
              >
                {getDiceFace(diceResult[1])}
              </div>
            )}
          </div>
          {diceTotal > 0 && (
            <div className="font-[var(--font-uncial)] text-3xl text-center">
              Total: <span className="text-[#FFBF00] text-4xl font-bold">{diceTotal}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <button
            onClick={() => rollDice(1)}
            disabled={isRolling}
            className="bg-gradient-to-br from-primary to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-[#000000] font-[var(--font-uncial)] font-bold px-6 py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-primary/50 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            {isRolling ? '⏳' : '1 dé'}
          </button>
          <button
            onClick={() => rollDice(2)}
            disabled={isRolling}
            className="bg-gradient-to-br from-primary to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-[#000000] font-[var(--font-uncial)] font-bold px-6 py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-primary/50 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            {isRolling ? '⏳' : '2 dés'}
          </button>
        </div>
        <button
          onClick={onClose}
          className="w-full bg-[#1a140f] border border-muted-light/30 hover:border-[#FFBF00] text-light font-[var(--font-merriweather)] px-6 py-3 rounded-lg transition-colors"
        >
          Fermer
        </button>
      </div>
    </div>
  );
}
