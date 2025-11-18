'use client';

import { useCharacter } from '@/src/presentation/hooks/useCharacter';

interface CharacterInventoryProps {
  characterId: string;
  onUpdate?: () => void;
  onOpenAddItemModal?: () => void;
}

/**
 * Composant refactorisé pour gérer l'inventaire.
 * 
 * Avant: Logique directement dans le composant avec duplication updatedAt
 * Après: Utilise addItem() et removeItem() du hook useCharacter
 * 
 * Gère:
 * - Liste d'objets avec checkbox "possédé"
 * - Ajout/suppression d'objets
 * - Affichage avec styles conditionnels
 */
export default function CharacterInventory({ 
  characterId,
  onUpdate,
  onOpenAddItemModal
}: CharacterInventoryProps) {
  const { character, isLoading, error, removeItem, toggleItem } = useCharacter(characterId);

  const handleToggleItem = async (index: number) => {
    await toggleItem(index);
    onUpdate?.();
  };

  const handleDeleteItem = async (index: number) => {
    if (!character) return;
    
    const items = character.getInventory().items;
    const item = items[index];
    
    if (!confirm(`Supprimer "${item.name}" de l'inventaire ?`)) {
      return;
    }

    await removeItem(index);
    onUpdate?.();
  };

  if (isLoading) {
    return (
      <div className="bg-[#2a1e17] glow-border rounded-lg p-6">
        <p className="text-muted-light text-center">Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#2a1e17] glow-border rounded-lg p-6">
        <p className="text-red-400 text-center">Erreur: {error}</p>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="bg-[#2a1e17] glow-border rounded-lg p-6">
        <p className="text-muted-light text-center">Personnage non trouvé</p>
      </div>
    );
  }

  const inventory = character.getInventory();
  const items = inventory.items;

  return (
    <div className="bg-[#2a1e17] glow-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-[var(--font-uncial)] text-xl tracking-wide text-light">
          Inventaire
        </h2>
        <button
          onClick={onOpenAddItemModal}
          className="text-primary hover:text-yellow-300 text-2xl transition-colors bg-primary/10 hover:bg-primary/20 rounded-lg px-3 py-1"
          title="Ajouter un objet"
        >
          ➕
        </button>
      </div>
      {items.length === 0 ? (
        <span className="text-sm text-muted-light">Aucun objet dans l&apos;inventaire</span>
      ) : (
        <div className="space-y-2">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 bg-[#1a140f] rounded-lg p-3 group hover:bg-[#1a140f]/80 transition-colors"
            >
              <input
                type="checkbox"
                checked={item.possessed}
                onChange={() => handleToggleItem(index)}
                className="w-5 h-5 rounded border-2 border-primary/30 bg-[#2a1e17] checked:bg-primary checked:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
              />
              <span
                className={`flex-1 font-[var(--font-merriweather)] ${
                  item.possessed ? 'text-light' : 'text-muted-light line-through'
                }`}
              >
                {item.name}
              </span>
              <button
                onClick={() => handleDeleteItem(index)}
                className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all text-sm"
                title="Supprimer"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
