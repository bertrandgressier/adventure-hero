'use client';

import { useCharacter } from '@/src/presentation/hooks/useCharacter';
import EditableStatField from '@/src/presentation/components/EditableStatField';

interface CharacterProgressProps {
  characterId: string;
  onUpdate?: () => void;
}

/**
 * Composant refactorisé pour afficher et éditer la progression du personnage.
 * 
 * Avant: 4 useState + 2 useRef + 2 useEffect + logique métier dupliquée
 * Après: 1 hook useCharacter + réutilisation de EditableStatField
 * 
 * Gère:
 * - Paragraphe actuel (avec historique)
 * - Boulons (monnaie du jeu)
 * - Date de dernière mise à jour
 */
export default function CharacterProgress({ characterId, onUpdate }: CharacterProgressProps) {
  const { character, isLoading, error, goToParagraph, addBoulons, removeBoulons } = useCharacter(characterId);

  const handleUpdateProgress = async (paragraph: number) => {
    await goToParagraph(paragraph);
    onUpdate?.();
  };

  const handleUpdateBoulons = async (newValue: number) => {
    if (!character) return;
    const currentBoulons = character.getInventory().boulons;
    const diff = newValue - currentBoulons;
    
    if (diff > 0) {
      await addBoulons(diff);
    } else if (diff < 0) {
      await removeBoulons(Math.abs(diff));
    }
    onUpdate?.();
  };

  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-light">
        Chargement...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-400">
        Erreur: {error}
      </div>
    );
  }

  if (!character) {
    return (
      <div className="text-center py-8 text-muted-light">
        Personnage non trouvé
      </div>
    );
  }

  const progressData = character.getProgress();
  const inventoryData = character.getInventory();
  const characterData = character.toData();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Paragraphe actuel */}
      <div className="bg-[#1a140f] border border-primary/20 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-[var(--font-uncial)] tracking-wide text-muted-light">
            PARAGRAPHE
          </div>
          <div className="text-xs font-[var(--font-merriweather)] text-muted-light">
            {new Date(characterData.updatedAt).toLocaleString('fr-FR', { 
              day: '2-digit', 
              month: '2-digit', 
              year: 'numeric', 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
        <div
          onClick={() => {
            const newParagraph = prompt('Nouveau paragraphe:', progressData.currentParagraph.toString());
            if (newParagraph) {
              const value = parseInt(newParagraph);
              if (!isNaN(value) && value >= 1) {
                handleUpdateProgress(value);
              }
            }
          }}
          className="font-[var(--font-geist-mono)] text-3xl text-primary hover:text-yellow-300 cursor-pointer transition-colors"
          title="Cliquer pour modifier"
        >
          #{progressData.currentParagraph}
        </div>
      </div>

      {/* Boulons */}
      <div className="bg-[#1a140f] glow-border rounded-lg p-4">
        <div className="font-[var(--font-merriweather)] text-sm text-muted-light mb-2">
          Boulons 🪙
        </div>
        <EditableStatField
          label=""
          value={inventoryData.boulons}
          onSave={handleUpdateBoulons}
          min={0}
        />
      </div>
    </div>
  );
}
