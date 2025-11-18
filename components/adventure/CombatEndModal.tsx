'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { useEffect, useRef } from 'react';
import { trackCombatEnd } from '@/src/infrastructure/analytics/tracking';

interface CombatEndModalProps {
  status: 'victory' | 'defeat';
  playerName: string;
  enemyName: string;
  roundsCount: number;
  characterId: string;
  onClose: () => void;
  remainingEndurance?: number;
}

export default function CombatEndModal({
  status,
  playerName,
  enemyName,
  roundsCount,
  characterId,
  onClose,
  remainingEndurance = 0
}: CombatEndModalProps) {
  const router = useRouter();
  const trackedRef = useRef(false);

  // Tracker la fin du combat
  useEffect(() => {
    if (!trackedRef.current) {
      trackCombatEnd(enemyName, status, roundsCount, remainingEndurance);
      trackedRef.current = true;
    }
  }, [enemyName, status, roundsCount, remainingEndurance]);

  if (status === 'victory') {
    return (
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50 overflow-y-auto">
        <div className="bg-[#2a1e17] border-4 border-primary rounded-lg p-6 sm:p-8 max-w-md w-full text-center my-auto">
          <div className="text-5xl sm:text-6xl mb-3 animate-[float_2s_ease-in-out_infinite]">🎉</div>
          <h2 className="font-[var(--font-uncial)] text-3xl sm:text-4xl text-primary mb-3">
            VICTOIRE !
          </h2>
          <p className="font-[var(--font-merriweather)] text-light text-base sm:text-lg mb-2">
            {playerName} a vaincu {enemyName} !
          </p>
          <p className="font-[var(--font-merriweather)] text-muted-light text-sm sm:text-base mb-6">
            Combat terminé en {roundsCount} assaut{roundsCount > 1 ? 's' : ''}
          </p>
          <button
            onClick={() => {
              onClose();
              router.push(`/characters/${characterId}`);
            }}
            className="w-full bg-[#FFBF00] hover:bg-yellow-400 text-[#000000] font-[var(--font-uncial)] font-bold px-6 py-3 rounded-lg transition-colors text-base sm:text-lg"
          >
            Continuer l&apos;aventure
          </button>
        </div>
      </div>
    );
  }

  // Défaite
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-[#2a1e17] border-4 border-red-500 rounded-lg p-6 sm:p-8 max-w-md w-full text-center my-auto">
        <div className="text-5xl sm:text-6xl mb-3">💀</div>
        <h2 className="font-[var(--font-uncial)] text-3xl sm:text-4xl text-red-400 mb-3">
          DÉFAITE
        </h2>
        <p className="font-[var(--font-merriweather)] text-light text-base sm:text-lg mb-2">
          {playerName} est tombé au combat...
        </p>
        <p className="font-[var(--font-merriweather)] text-muted-light text-sm sm:text-base mb-6">
          {enemyName} a vaincu votre héros après {roundsCount} assaut{roundsCount > 1 ? 's' : ''}
        </p>

        <button
          onClick={() => router.push('/characters')}
          className="w-full bg-[#FFBF00] hover:bg-yellow-400 text-[#000000] font-[var(--font-uncial)] font-bold tracking-wider px-6 py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(255,191,0,0.6)] hover:scale-[1.02] active:scale-[0.98] text-base sm:text-lg"
        >
          Retour à la liste des personnages
        </button>
      </div>
    </div>
  );
}
