'use client';

import { useState, useEffect, useRef } from 'react';
import type { CharacterDTO } from '@/src/infrastructure/dto/CharacterDTO';
import type { Enemy, CombatState, CombatMode } from '@/src/domain/types/combat';
import { CombatService } from '@/src/domain/services/CombatService';
import CombatRoundDisplay from './CombatRoundDisplay';
import { trackCombatStart } from '@/src/infrastructure/analytics/tracking';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CombatInterfaceProps {
  character: CharacterDTO;
  enemy: Enemy;
  mode: CombatMode;
  firstAttacker: 'player' | 'enemy';
  onCombatEnd: (status: 'victory' | 'defeat', finalEndurance: number, roundsCount: number) => void;
  onClose?: () => void;
}

export default function CombatInterface({
  character,
  enemy: initialEnemy,
  mode,
  firstAttacker,
  onCombatEnd,
  onClose
}: CombatInterfaceProps) {
  const [combatState, setCombatState] = useState<CombatState>({
    enemy: { ...initialEnemy },
    rounds: [],
    playerEndurance: character.stats.pointsDeVieActuels,
    enemyEndurance: initialEnemy.endurance,
    status: 'ongoing',
    nextAttacker: firstAttacker
  });

  const [isRolling, setIsRolling] = useState(false);
  const [showEndButton, setShowEndButton] = useState(false);
  const historyRef = useRef<HTMLDivElement>(null);
  const combatTrackedRef = useRef(false); // Pour tracker le début une seule fois
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Nettoyage des timers au démontage
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Tracker le début du combat
  useEffect(() => {
    if (!combatTrackedRef.current) {
      trackCombatStart(initialEnemy.name, {
        habilete: character.stats.dexterite,
        endurance: character.stats.pointsDeVieActuels,
      });
      combatTrackedRef.current = true;
    }
  }, [initialEnemy.name, character.stats.dexterite, character.stats.pointsDeVieActuels]);

  const executeRound = (hitDiceRoll?: number, damageDiceRoll?: number) => {
    setIsRolling(true);

    // Simuler un délai pour l'animation des dés
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      const playerWeaponPoints = character.inventory.weapon?.attackPoints || 0;
      const roundNumber = combatState.rounds.length + 1;

      const round = CombatService.resolveCombatRound(
        roundNumber,
        combatState.nextAttacker,
        character.stats.dexterite,
        combatState.playerEndurance,
        playerWeaponPoints,
        combatState.enemy,
        combatState.enemyEndurance,
        hitDiceRoll,
        damageDiceRoll
      );

      // Alterner l'attaquant pour le prochain round
      const nextAttacker = combatState.nextAttacker === 'player' ? 'enemy' : 'player';

      // Appliquer le round
      setCombatState(prev => ({
        ...prev,
        rounds: [...prev.rounds, round],
        playerEndurance: round.playerEnduranceAfter,
        enemyEndurance: round.enemyEnduranceAfter,
        enemy: { ...prev.enemy, endurance: round.enemyEnduranceAfter },
        nextAttacker
      }));
      
      setIsRolling(false);
    }, mode === 'auto' ? 1500 : 0);
  };

  // Scroll automatique vers le bas à chaque nouveau round
  useEffect(() => {
    if (historyRef.current && combatState.rounds.length > 0) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [combatState.rounds.length]);

  // Mode automatique : lancer les rounds automatiquement
  useEffect(() => {
    if (mode === 'auto' && combatState.status === 'ongoing' && !isRolling && !showEndButton) {
      const timer = setTimeout(() => {
        executeRound();
      }, 1000);
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, combatState.status, combatState.rounds.length, isRolling, showEndButton]);

  // Vérifier la fin du combat
  useEffect(() => {
    if (combatState.playerEndurance <= 0 || combatState.enemyEndurance <= 0) {
      setShowEndButton(true);
    }
  }, [combatState.playerEndurance, combatState.enemyEndurance]);

  const playerWeaponName = character.inventory.weapon?.name || 'Aucune';
  const playerWeaponPoints = character.inventory.weapon?.attackPoints || 0;

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose && onClose()}>
      <DialogContent className="max-w-4xl w-full bg-card border-2 border-primary p-6 max-h-[90vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="font-[var(--font-uncial)] text-3xl text-primary text-center mb-6">
            ⚔️ COMBAT EN COURS ⚔️
          </DialogTitle>
        </DialogHeader>

        {/* Indicateur de tour */}
        {combatState.status === 'ongoing' && (
          <div className="text-center mb-4">
            <p className="font-[var(--font-uncial)] text-lg">
              {combatState.nextAttacker === 'player' ? (
                <span className="text-green-400">🛡️ Votre tour</span>
              ) : (
                <span className="text-red-400">⚔️ Tour de {combatState.enemy.name}</span>
              )}
            </p>
          </div>
        )}

        {/* Stats des combattants */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Joueur */}
          <div className="bg-background border-2 border-green-500/50 rounded-lg p-4">
            <h3 className="font-[var(--font-uncial)] text-xl text-primary mb-3">
              {character.name}
            </h3>
            <div className="space-y-2 font-[var(--font-geist-mono)] text-sm">
              <div className="flex justify-between">
                <span className="text-muted-light">DEXTÉRITÉ:</span>
                <span className="text-light font-bold">{character.stats.dexterite}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-light">ENDURANCE:</span>
                <span className={`font-bold ${
                  combatState.playerEndurance <= character.stats.pointsDeVieMax / 4
                    ? 'text-red-400'
                    : 'text-green-400'
                }`}>
                  {combatState.playerEndurance}/{character.stats.pointsDeVieMax}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-light">ARME:</span>
                <span className="text-primary font-bold">
                  {playerWeaponName} (+{playerWeaponPoints})
                </span>
              </div>
            </div>
          </div>

          {/* Ennemi */}
          <div className="bg-background border-2 border-red-500/50 rounded-lg p-4">
            <h3 className="font-[var(--font-uncial)] text-xl text-primary mb-3">
              {combatState.enemy.name}
            </h3>
            <div className="space-y-2 font-[var(--font-geist-mono)] text-sm">
              <div className="flex justify-between">
                <span className="text-muted-light">DEXTÉRITÉ:</span>
                <span className="text-light font-bold">{combatState.enemy.dexterite}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-light">ENDURANCE:</span>
                <span className={`font-bold ${
                  combatState.enemyEndurance <= combatState.enemy.enduranceMax / 4
                    ? 'text-red-400'
                    : 'text-green-400'
                }`}>
                  {combatState.enemyEndurance}/{combatState.enemy.enduranceMax}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-light">ARME:</span>
                <span className="text-primary font-bold">
                  +{combatState.enemy.attackPoints}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Historique des rounds */}
        <div ref={historyRef} className="bg-background rounded-lg p-4 mb-4 max-h-96 overflow-y-auto scroll-smooth">
          <h3 className="font-[var(--font-uncial)] text-lg text-primary mb-3 flex items-center justify-between">
            <span>Historique des rounds</span>
            {combatState.rounds.length > 0 && (
              <span className="text-sm font-[var(--font-geist-mono)] text-muted-light">
                {combatState.rounds.length} assaut{combatState.rounds.length > 1 ? 's' : ''}
              </span>
            )}
          </h3>
          {combatState.rounds.length === 0 ? (
            <p className="font-[var(--font-merriweather)] text-muted-light text-center py-4">
              Aucun round pour le moment
            </p>
          ) : (
            <div className="space-y-2">
              {combatState.rounds.map((round, index) => (
                <CombatRoundDisplay
                  key={index}
                  round={round}
                  playerName={character.name}
                  enemyName={combatState.enemy.name}
                />
              ))}
            </div>
          )}
        </div>

        {/* Boutons d'action */}
        <div className="flex gap-3">
          {mode === 'manual' ? (
            <button
              onClick={() => {
                if (showEndButton) {
                  // Afficher le résultat
                  if (combatState.playerEndurance <= 0) {
                    setCombatState(prev => ({ ...prev, status: 'defeat' }));
                    onCombatEnd('defeat', 0, combatState.rounds.length);
                  } else if (combatState.enemyEndurance <= 0) {
                    setCombatState(prev => ({ ...prev, status: 'victory' }));
                    onCombatEnd('victory', combatState.playerEndurance, combatState.rounds.length);
                  }
                } else {
                  // Lancer un round
                  executeRound();
                }
              }}
              disabled={isRolling || combatState.status !== 'ongoing'}
              className={`flex-1 font-[var(--font-uncial)] font-bold px-6 py-3 rounded-lg text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                showEndButton 
                  ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/50 animate-bounce'
                  : 'bg-gradient-to-r from-primary to-yellow-400 hover:from-yellow-400 hover:to-primary text-primary-foreground shadow-md hover:shadow-lg'
              }`}
            >
              {isRolling ? '⏳ Lancer en cours...' : showEndButton ? '✓ Voir le résultat' : '🎲 Lancer les dés'}
            </button>
          ) : (
            <div className="flex-1 bg-background border border-primary/50 text-primary font-[var(--font-uncial)] font-bold px-6 py-3 rounded-lg text-lg text-center">
              {isRolling ? '⏳ Round en cours...' : '⚡ Mode automatique actif'}
            </div>
          )}
        </div>

        {/* Info mode */}
        <p className="text-xs text-muted-light text-center mt-3 font-[var(--font-merriweather)]">
          Mode {mode === 'auto' ? 'automatique' : 'manuel'} • 
          Round #{combatState.rounds.length + 1}
        </p>

        {/* Bouton pour afficher le résultat en mode auto */}
        {showEndButton && mode === 'auto' && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => {
                if (combatState.playerEndurance <= 0) {
                  setCombatState(prev => ({ ...prev, status: 'defeat' }));
                  onCombatEnd('defeat', 0, combatState.rounds.length);
                } else if (combatState.enemyEndurance <= 0) {
                  setCombatState(prev => ({ ...prev, status: 'victory' }));
                  onCombatEnd('victory', combatState.playerEndurance, combatState.rounds.length);
                }
              }}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-cinzel px-8 py-6 text-lg shadow-lg shadow-primary/50 animate-bounce"
            >
              ✓ Voir le résultat
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

