'use client';

import { useState } from 'react';
import { Coins } from 'lucide-react';
import { useCharacter } from '@/src/presentation/hooks/useCharacter';
import EditableStatField from '@/src/presentation/components/EditableStatField';
import { BookTag, type BookTitle } from '@/components/ui/book-tag';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const BOOKS: BookTitle[] = [
  "La Harpe des Quatre Saisons",
  "La Confrérie de NUADA",
  "Les Entrailles du temps",
];

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
  const { character, isLoading, error, goToParagraph, addBoulons, removeBoulons, updateBook } = useCharacter(characterId);
  const [isBookDialogOpen, setIsBookDialogOpen] = useState(false);

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
      <div className="bg-background border border-primary/20 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
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

        <div className="flex items-center justify-between gap-4">
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
            className="font-[var(--font-geist-mono)] text-4xl text-primary hover:text-yellow-300 cursor-pointer transition-colors"
            title="Cliquer pour modifier"
          >
            #{progressData.currentParagraph}
          </div>

          <Dialog open={isBookDialogOpen} onOpenChange={setIsBookDialogOpen}>
            <DialogTrigger asChild>
              <button className="hover:scale-105 transition-transform">
                <BookTag book={characterData.book} />
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-[var(--font-uncial)] text-2xl text-center mb-4">
                  Changer de livre
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-3">
                {BOOKS.map((book) => (
                  <button
                    key={book}
                    onClick={() => {
                      updateBook(book);
                      setIsBookDialogOpen(false);
                    }}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      characterData.book === book
                        ? 'border-primary bg-primary/10'
                        : 'border-transparent hover:border-primary/50 bg-card'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <BookTag book={book} />
                      <span className="font-[var(--font-merriweather)] text-sm text-light">
                        {book}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Boulons */}
      <EditableStatField
        label="BOULONS"
        value={inventoryData.boulons}
        onSave={handleUpdateBoulons}
        min={0}
        icon={<Coins className="size-4" />}
      />
    </div>
  );
}
