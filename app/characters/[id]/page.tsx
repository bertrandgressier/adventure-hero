'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getCharacter, deleteCharacter, updateCharacter } from '@/lib/storage/characters';
import type { Character } from '@/lib/types/character';
import type { Enemy, CombatMode } from '@/lib/types/combat';
import CombatSetup from '@/app/components/adventure/CombatSetup';
import CombatInterface from '@/app/components/adventure/CombatInterface';
import CombatEndModal from '@/app/components/adventure/CombatEndModal';
import CharacterStats from '@/app/components/character/CharacterStats';
import CharacterProgress from '@/app/components/character/CharacterProgress';
import CharacterWeapon from '@/app/components/character/CharacterWeapon';
import CharacterInventory from '@/app/components/character/CharacterInventory';
import DiceRoller from '@/app/components/character/DiceRoller';
import AddWeaponModal from '@/app/components/character/AddWeaponModal';
import AddItemModal from '@/app/components/character/AddItemModal';

export default function CharacterDetail() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showWeaponModal, setShowWeaponModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showDiceModal, setShowDiceModal] = useState(false);
  
  // Combat states
  const [showCombatSetup, setShowCombatSetup] = useState(false);
  const [currentEnemy, setCurrentEnemy] = useState<Enemy | null>(null);
  const [combatMode, setCombatMode] = useState<CombatMode>('auto');
  const [firstAttacker, setFirstAttacker] = useState<'player' | 'enemy'>('player');
  const [showCombat, setShowCombat] = useState(false);
  const [combatEndStatus, setCombatEndStatus] = useState<'victory' | 'defeat' | null>(null);
  const [finalEndurance, setFinalEndurance] = useState(0);
  const [roundsCount, setRoundsCount] = useState(0);

  useEffect(() => {
    loadCharacter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadCharacter = async () => {
    try {
      const char = await getCharacter(id);
      if (!char) {
        router.push('/characters');
        return;
      }
      setCharacter(char);
    } catch (error) {
      console.error('Error loading character:', error);
      router.push('/characters');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce personnage ?')) {
      return;
    }

    try {
      await deleteCharacter(id);
      router.push('/characters');
    } catch (error) {
      console.error('Error deleting character:', error);
    }
  };

  // Generic character update handler
  const handleUpdateCharacter = async (updatedCharacter: Character) => {
    try {
      await updateCharacter(updatedCharacter);
      setCharacter(updatedCharacter);
    } catch (error) {
      console.error('Error updating character:', error);
    }
  };

  // Modal handlers for adding weapon/item
  const handleAddWeapon = async (name: string, attackPoints: number) => {
    if (!character) return;

    const updatedCharacter = {
      ...character,
      inventory: {
        ...character.inventory,
        weapon: { name, attackPoints }
      },
      updatedAt: new Date().toISOString()
    };
    await handleUpdateCharacter(updatedCharacter);
  };

  const handleAddItem = async (name: string) => {
    if (!character) return;

    const updatedCharacter = {
      ...character,
      inventory: {
        ...character.inventory,
        items: [
          ...character.inventory.items,
          { name, possessed: true }
        ]
      },
      updatedAt: new Date().toISOString()
    };
    await handleUpdateCharacter(updatedCharacter);
  };

  // Combat handlers
  const handleStartCombat = (enemy: Enemy, mode: CombatMode, firstAttacker: 'player' | 'enemy') => {
    setCurrentEnemy(enemy);
    setCombatMode(mode);
    setFirstAttacker(firstAttacker);
    setShowCombatSetup(false);
    setShowCombat(true);
  };

  const handleCombatEnd = async (status: 'victory' | 'defeat', finalEnd: number, rounds: number) => {
    if (!character) return;

    setCombatEndStatus(status);
    setFinalEndurance(finalEnd);
    setRoundsCount(rounds);

    // Mettre à jour les PV du personnage
    const updatedCharacter = {
      ...character,
      stats: {
        ...character.stats,
        pointsDeVieActuels: finalEnd
      },
      updatedAt: new Date().toISOString()
    };
    await handleUpdateCharacter(updatedCharacter);

    setShowCombat(false);
  };

  const handleResurrect = async () => {
    if (!character) return;

    const updatedCharacter = {
      ...character,
      stats: {
        ...character.stats,
        pointsDeVieActuels: 0
      },
      updatedAt: new Date().toISOString()
    };
    await handleUpdateCharacter(updatedCharacter);
    setCombatEndStatus(null);
  };

  const handleDeleteCharacterAfterDeath = async () => {
    await handleDelete();
  };

  const handleCloseCombatModal = () => {
    setCombatEndStatus(null);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#1a140f] p-4">
        <div className="max-w-4xl mx-auto py-8">
          <p className="text-muted-light text-center py-8">Chargement...</p>
        </div>
      </main>
    );
  }

  if (!character) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#1a140f] p-4">
      <div className="max-w-4xl mx-auto py-8 space-y-6">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="font-[var(--font-uncial)] text-3xl sm:text-4xl tracking-wider text-[#FFBF00] mb-2">
              {character.name}
            </h1>
            <p className="font-[var(--font-merriweather)] text-muted-light">
              Talent : <span className="text-primary">{character.talent}</span>
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowCombatSetup(true)}
              className="text-2xl hover:scale-110 transition-transform"
              title="Lancer un combat"
            >
              ⚔️
            </button>
            <button
              onClick={() => setShowDiceModal(true)}
              className="text-2xl hover:scale-110 transition-transform"
              title="Lancer les dés"
            >
              🎲
            </button>
            <button
              onClick={() => router.push('/characters')}
              className="text-muted-light hover:text-primary transition-colors text-2xl"
            >
              ←
            </button>
            <button
              onClick={handleDelete}
              className="text-muted-light hover:text-destructive transition-colors text-2xl"
            >
              🗑️
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-[#2a1e17] glow-border rounded-lg p-6">
          <h2 className="font-[var(--font-uncial)] text-xl tracking-wide text-light mb-4">Caractéristiques</h2>
          <CharacterStats character={character} onUpdate={handleUpdateCharacter} />
        </div>

        {/* Progress Section */}
        <CharacterProgress
          character={character}
          onUpdate={handleUpdateCharacter}
        />

        {/* Weapon Section */}
        <CharacterWeapon
          character={character}
          onUpdate={handleUpdateCharacter}
          onOpenAddWeaponModal={() => setShowWeaponModal(true)}
        />

        {/* Inventory Section */}
        <CharacterInventory
          character={character}
          onUpdate={handleUpdateCharacter}
          onOpenAddItemModal={() => setShowItemModal(true)}
        />

        {/* Action Buttons - Supprimés car les icônes + sont dans les sections */}

        {/* Notes Section */}
        {character.notes && (
          <div className="bg-[#2a1e17] glow-border rounded-lg p-6">
            <h2 className="font-[var(--font-uncial)] text-xl tracking-wide text-light mb-4">Notes</h2>
            <p className="font-[var(--font-merriweather)] text-light whitespace-pre-wrap">{character.notes}</p>
          </div>
        )}

        {/* Modals */}
        {showWeaponModal && (
          <AddWeaponModal
            onAdd={handleAddWeapon}
            onClose={() => setShowWeaponModal(false)}
          />
        )}

        {showItemModal && (
          <AddItemModal
            onAdd={handleAddItem}
            onClose={() => setShowItemModal(false)}
          />
        )}

        {showDiceModal && (
          <DiceRoller onClose={() => setShowDiceModal(false)} />
        )}

        {showCombatSetup && (
          <CombatSetup
            onStartCombat={handleStartCombat}
            onCancel={() => setShowCombatSetup(false)}
          />
        )}

        {showCombat && currentEnemy && (
          <CombatInterface
            character={character}
            enemy={currentEnemy}
            mode={combatMode}
            firstAttacker={firstAttacker}
            onCombatEnd={handleCombatEnd}
          />
        )}

        {combatEndStatus && (
          <CombatEndModal
            status={combatEndStatus}
            playerName={character.name}
            enemyName={currentEnemy?.name || 'Adversaire'}
            roundsCount={roundsCount}
            characterId={id}
            onResurrect={handleResurrect}
            onDelete={handleDeleteCharacterAfterDeath}
            onClose={handleCloseCombatModal}
          />
        )}
      </div>
    </main>
  );
}
