'use client';

import { useCharacter } from '@/src/presentation/hooks/useCharacter';
import type { Weapon } from '@/src/domain/value-objects/Inventory';

interface CharacterWeaponProps {
  characterId: string;
  onUpdate?: () => void;
  onOpenAddWeaponModal?: () => void;
}

/**
 * Composant refactorisé pour gérer l'arme équipée.
 * 
 * Avant: 4 useState + 2 useRef + 2 useEffect + logique métier dupliquée
 * Après: 1 hook useCharacter
 * 
 * Utilise equipWeapon() du hook pour gérer l'équipement/déséquipement.
 */
export default function CharacterWeapon({ 
  characterId,
  onUpdate,
  onOpenAddWeaponModal
}: CharacterWeaponProps) {
  const { character, isLoading, error, equipWeapon } = useCharacter(characterId);

  const handleUpdateWeaponName = async (name: string) => {
    if (!character) return;
    const inventory = character.getInventory();
    if (!inventory.weapon) return;
    
    const updatedWeapon: Weapon = {
      ...inventory.weapon,
      name: name.trim()
    };
    
    await equipWeapon(updatedWeapon);
    onUpdate?.();
  };

  const handleUpdateWeaponAttack = async (attackPoints: number) => {
    if (!character) return;
    const inventory = character.getInventory();
    if (!inventory.weapon) return;
    
    const updatedWeapon: Weapon = {
      ...inventory.weapon,
      attackPoints
    };
    
    await equipWeapon(updatedWeapon);
    onUpdate?.();
  };

  const handleDeleteWeapon = async () => {
    if (!character) return;
    const inventory = character.getInventory();
    if (!inventory.weapon) return;
    
    if (!confirm(`Perdre l'arme "${inventory.weapon.name}" ?`)) {
      return;
    }
    
    await equipWeapon(null);
    onUpdate?.();
  };

  if (isLoading) {
    return (
      <div className="bg-card glow-border rounded-lg p-6">
        <p className="text-muted-light text-center">Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card glow-border rounded-lg p-6">
        <p className="text-red-400 text-center">Erreur: {error}</p>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="bg-card glow-border rounded-lg p-6">
        <p className="text-muted-light text-center">Personnage non trouvé</p>
      </div>
    );
  }

  const inventory = character.getInventory();
  const weapon = inventory.weapon;

  return (
    <div className="bg-card glow-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-[var(--font-uncial)] text-xl tracking-wide text-light">
          Arme équipée
        </h2>
        {weapon ? (
          <button
            onClick={handleDeleteWeapon}
            className="text-red-400 hover:text-red-300 text-xl transition-colors"
            title="Perdre cette arme"
          >
            🗑️
          </button>
        ) : (
          <button
            onClick={onOpenAddWeaponModal}
            className="text-primary hover:text-yellow-300 text-2xl transition-colors bg-primary/10 hover:bg-primary/20 rounded-lg px-3 py-1"
            title="Ajouter une arme"
          >
            ➕
          </button>
        )}
      </div>
      {weapon ? (
        <div className="space-y-4">
          {/* Nom de l'arme */}
          <div>
            <div className="text-xs font-[var(--font-merriweather)] text-muted-light mb-1">
              Nom
            </div>
            <div
              onClick={() => {
                const newName = prompt('Nouveau nom:', weapon.name);
                if (newName && newName.trim()) {
                  handleUpdateWeaponName(newName);
                }
              }}
              className="font-[var(--font-merriweather)] text-lg text-primary hover:text-yellow-300 cursor-pointer transition-colors"
              title="Cliquer pour modifier"
            >
              {weapon.name}
            </div>
          </div>

          {/* Points d'attaque */}
          <div>
            <div className="text-xs font-[var(--font-merriweather)] text-muted-light mb-1">
              Points d&apos;attaque
            </div>
            <div
              onClick={() => {
                const newAttack = prompt('Nouveaux points d\'attaque:', weapon.attackPoints.toString());
                if (newAttack) {
                  const value = parseInt(newAttack);
                  if (!isNaN(value) && value >= 0) {
                    handleUpdateWeaponAttack(value);
                  }
                }
              }}
              className="font-[var(--font-geist-mono)] text-2xl text-primary hover:text-yellow-300 cursor-pointer transition-colors inline-block"
              title="Cliquer pour modifier"
            >
              +{weapon.attackPoints}
            </div>
          </div>
        </div>
      ) : (
        <p className="font-[var(--font-merriweather)] text-muted-light">
          Aucune arme équipée
        </p>
      )}
    </div>
  );
}
