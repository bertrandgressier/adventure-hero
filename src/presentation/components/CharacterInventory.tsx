'use client';

import { Trash2 } from 'lucide-react';
import { useCharacter } from '@/src/presentation/hooks/useCharacter';
import { MAX_ITEMS, BOURSE_ITEM_NAME } from '@/src/domain/value-objects/Inventory';

interface CharacterInventoryProps {
  characterId: string;
  onUpdate?: () => void;
  onOpenAddItemModal?: () => void;
}

export default function CharacterInventory({
  characterId,
  onUpdate,
  onOpenAddItemModal,
}: CharacterInventoryProps) {
  const { character, isLoading, error, removeItem } = useCharacter(characterId);

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
  const items = inventory.items;
  const isFull = items.length >= MAX_ITEMS;

  return (
    <div className="bg-card glow-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="font-[var(--font-uncial)] text-xl tracking-wide text-light">
            Inventaire
          </h2>
          <span className={`text-sm font-mono ${isFull ? 'text-red-400' : 'text-muted-light'}`}>
            ({items.length}/{MAX_ITEMS})
          </span>
        </div>
        <button
          onClick={onOpenAddItemModal}
          disabled={isFull}
          className={`text-2xl transition-colors rounded-lg px-3 py-1 ${
            isFull 
              ? 'text-muted-light bg-muted cursor-not-allowed opacity-50' 
              : 'text-primary hover:text-yellow-300 bg-primary/10 hover:bg-primary/20'
          }`}
          title={isFull ? "Inventaire plein" : "Ajouter un objet"}
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
              className="flex items-center gap-3 bg-background rounded-lg p-3 group hover:bg-background/80 transition-colors"
            >
              <span className="flex-1 font-[var(--font-merriweather)] text-light">
                {item.name}
                {item.type === 'special' && (
                  <span className="ml-2 text-xs uppercase tracking-wider text-muted-light">Spécial</span>
                )}
              </span>
              {item.name !== BOURSE_ITEM_NAME && (
                <button
                  onClick={() => handleDeleteItem(index)}
                  className="opacity-0 group-hover:opacity-100 text-muted-light hover:text-red-400 transition-all"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
