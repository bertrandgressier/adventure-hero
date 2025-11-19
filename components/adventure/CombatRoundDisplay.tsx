'use client';

import React from 'react';
import type { CombatRound } from '@/src/domain/types/combat';

interface CombatRoundDisplayProps {
  round: CombatRound;
  playerName: string;
  enemyName: string;
}

export default function CombatRoundDisplay({ round, playerName, enemyName }: CombatRoundDisplayProps) {
  const attackerName = round.attacker === 'player' ? playerName : enemyName;
  
  return (
    <div className="bg-background border border-primary/20 rounded-lg p-3 mb-2 text-sm">
      <div className="flex justify-between items-center mb-2">
        <span className="font-[var(--font-uncial)] text-primary">Round {round.roundNumber}</span>
        <span className={`font-bold ${round.attacker === 'player' ? 'text-green-400' : 'text-red-400'}`}>
          {attackerName} attaque
        </span>
      </div>
      
      <div className="flex items-center justify-between bg-card/50 rounded p-2">
        <div className="flex items-center gap-2">
          <span>🎲 {round.hitDiceRoll}</span>
          {round.hitSuccess ? (
            <span className="text-green-400 font-bold">Touché !</span>
          ) : (
            <span className="text-muted-light">Raté</span>
          )}
        </div>
        
        {round.hitSuccess && (
          <div className="flex items-center gap-2 text-primary font-bold">
            <span>💥 -{round.totalDamage} PV</span>
          </div>
        )}
      </div>
      
      {round.hitSuccess && (
         <div className="text-[10px] text-muted-light mt-1 text-right italic">
           (1 base + {round.damageDiceRoll} dé + {round.weaponDamage} arme)
         </div>
      )}
      
      <div className="flex justify-between mt-2 text-xs font-[var(--font-geist-mono)] border-t border-primary/10 pt-2">
         <span className={round.playerEnduranceAfter < 5 ? 'text-red-400' : 'text-muted-light'}>
           {playerName}: {round.playerEnduranceAfter} PV
         </span>
         <span className={round.enemyEnduranceAfter < 5 ? 'text-red-400' : 'text-muted-light'}>
           {enemyName}: {round.enemyEnduranceAfter} PV
         </span>
      </div>
    </div>
  );
}

