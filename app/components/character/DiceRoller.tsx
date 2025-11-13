'use client';

import { useState } from 'react';

interface DiceRollerProps {
  onClose: () => void;
}

export default function DiceRoller({ onClose }: DiceRollerProps) {
  const [diceResult, setDiceResult] = useState<number[]>([]);
  const [diceTotal, setDiceTotal] = useState(0);
  const [isRolling, setIsRolling] = useState(false);

  const rollDice = (count: number) => {
    setIsRolling(true);
    setDiceResult([]);
    setDiceTotal(0);

    const results: number[] = [];
    let total = 0;

    for (let i = 0; i < count; i++) {
      const roll = Math.floor(Math.random() * 6) + 1;
      results.push(roll);
      total += roll;
    }

    setTimeout(() => {
      setDiceResult(results);
      setDiceTotal(total);
      setIsRolling(false);
    }, 500);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="bg-[#2a1e17] border-2 border-primary/50 rounded-lg p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-[var(--font-uncial)] text-3xl tracking-wide text-primary mb-6 text-center">
          🎲 Lancer de dés
        </h3>

        {diceResult.length > 0 && (
          <div className="mb-6 text-center">
            <div className="flex justify-center gap-3 mb-4">
              {diceResult.map((die, index) => (
                <div
                  key={index}
                  className="w-16 h-16 bg-[#1a140f] border-2 border-primary rounded-lg flex items-center justify-center font-[var(--font-geist-mono)] text-3xl text-primary animate-[bounce_0.5s_ease-in-out]"
                >
                  {die}
                </div>
              ))}
            </div>
            <div className="font-[var(--font-uncial)] text-2xl text-light">
              Total: <span className="text-primary">{diceTotal}</span>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => rollDice(1)}
            disabled={isRolling}
            className="w-full bg-primary hover:bg-yellow-400 text-[#1a140f] font-[var(--font-uncial)] font-bold px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRolling ? '⏳ Lancer...' : '1d6'}
          </button>
          <button
            onClick={() => rollDice(2)}
            disabled={isRolling}
            className="w-full bg-primary hover:bg-yellow-400 text-[#1a140f] font-[var(--font-uncial)] font-bold px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRolling ? '⏳ Lancer...' : '2d6'}
          </button>
          <button
            onClick={onClose}
            className="w-full bg-muted hover:bg-muted/80 text-light font-[var(--font-merriweather)] font-bold px-6 py-3 rounded-lg transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
