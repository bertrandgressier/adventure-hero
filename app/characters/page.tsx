'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import { useCharacterStore } from '@/src/presentation/providers/character-store-provider';
import { BookTag } from '@/components/ui/book-tag';
import type { Character } from '@/src/domain/entities/Character';

export default function CharactersPage() {
  const characters = useCharacterStore((state) => state.getAllCharacters());
  const isLoading = useCharacterStore((state) => state.isLoading);
  const deleteCharacter = useCharacterStore((state) => state.deleteCharacter);
  const createCharacter = useCharacterStore((state) => state.createCharacter);

  const isDead = useCallback((character: any) => character.isDead(), []);

  const handleDelete = useCallback(async (id: string, name: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${name} ?`)) {
      try {
        await deleteCharacter(id);
      } catch (error) {
        console.error('Error deleting character:', error);
        alert('Erreur lors de la suppression du personnage');
      }
    }
  }, [deleteCharacter]);

  const handleDuplicate = useCallback(async (character: any) => {
    try {
      const characterData = character.toData();
      
      // Créer un nouveau personnage avec les mêmes données
      await createCharacter({
        name: `${characterData.name} (Copie)`,
        book: characterData.book,
        talent: characterData.talent,
        stats: characterData.stats,
      });
    } catch (error) {
      console.error('Error duplicating character:', error);
      alert('Erreur lors de la duplication du personnage');
    }
  }, [createCharacter]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#1a140f] p-4">
        <div className="max-w-4xl mx-auto py-8">
          <h1 className="font-[var(--font-uncial)] text-3xl sm:text-4xl tracking-wider text-[#FFBF00] mb-8">
            Vos héros
          </h1>
          <p className="text-muted-light text-center py-8">Chargement...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#1a140f] p-4">
      <div className="max-w-4xl mx-auto py-8 space-y-6">
        {/* En-tête */}
        <div>
          <h1 className="font-[var(--font-uncial)] text-3xl sm:text-4xl tracking-wider text-[#FFBF00] mb-2">
            Vos héros
          </h1>
          <p className="font-[var(--font-merriweather)] text-muted-light">
            Gérez vos personnages d&apos;aventure
          </p>
        </div>

        {/* Bouton créer */}
        <Link
          href="/characters/new"
          className="block w-full bg-[#FFBF00] hover:bg-yellow-400 text-[#000000] font-[var(--font-uncial)] font-bold tracking-wider py-4 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(255,191,0,0.6)] hover:scale-[1.02] active:scale-[0.98] text-center text-lg"
        >
          ✨ Créer un héros
        </Link>

        {/* Liste des personnages */}
        {characters.length === 0 ? (
          <div className="relative bg-[#2a1e17] glow-border rounded-lg p-12 text-center">
            <div className="max-w-sm mx-auto space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-amber-600/20 border-2 border-primary/50 flex items-center justify-center">
                <span className="text-4xl">📜</span>
              </div>
              
              <div className="space-y-2">
                <h2 className="font-[var(--font-uncial)] text-xl tracking-wide text-light">
                  Aucun héro créé
                </h2>
                <p className="font-[var(--font-merriweather)] text-sm text-muted-light">
                  Créez votre premier personnage pour commencer votre aventure
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {characters.map((character: Character) => {
              const characterData = character.toData();
              const stats = character.getStatsObject().toData();
              const progress = character.getProgress();
              
              return (
              <div
                key={character.id}
                className={`rounded-lg p-6 transition-all ${
                  isDead(character)
                    ? 'bg-[#3d1f1f] border-2 border-destructive/50 opacity-50 grayscale hover:opacity-60'
                    : 'bg-[#2a1e17] glow-border hover:bg-[#2a1e17]/80'
                }`}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-[var(--font-uncial)] text-2xl tracking-wide text-light">
                        {characterData.name}
                      </h3>
                      {isDead(character) && (
                        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-red-600 text-white rounded-full text-sm font-bold shadow-lg">
                          <span className="text-lg">💀</span> DÉCÉDÉ
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="font-[var(--font-merriweather)] text-light font-semibold">
                        Talent : <span className="text-primary">{characterData.talent}</span>
                      </span>
                      <span className="text-muted-light">•</span>
                      <BookTag book={characterData.book} />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDuplicate(character)}
                      className="text-xl hover:scale-110 transition-transform text-muted-light hover:text-primary"
                      title="Dupliquer le personnage"
                    >
                      📋
                    </button>
                    <button
                      onClick={() => handleDelete(character.id, character.name)}
                      className="text-xl hover:scale-110 transition-transform text-muted-light hover:text-destructive"
                      title="Supprimer le personnage"
                    >
                      🗑️
                    </button>
                    <Link
                      href={`/characters/${character.id}`}
                      className="text-3xl hover:scale-110 transition-transform"
                      title="Voir la fiche"
                    >
                      ⚔️
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-[#1a140f] border border-primary/20 rounded-lg p-4 text-center">
                    <div className="text-xs font-[var(--font-uncial)] tracking-wide text-muted-light mb-2">
                      DEXTÉRITÉ
                    </div>
                    <div className="font-[var(--font-geist-mono)] text-3xl font-bold text-light">
                      {stats.dexterite}
                    </div>
                  </div>
                  <div className="bg-[#1a140f] border border-primary/20 rounded-lg p-4 text-center">
                    <div className="text-xs font-[var(--font-uncial)] tracking-wide text-muted-light mb-2">
                      CHANCE
                    </div>
                    <div className="font-[var(--font-geist-mono)] text-3xl font-bold text-light">
                      {stats.chance}
                    </div>
                  </div>
                  <div className="bg-[#1a140f] border border-primary/20 rounded-lg p-4 text-center">
                    <div className="text-xs font-[var(--font-uncial)] tracking-wide text-muted-light mb-2">
                      POINTS DE VIE
                    </div>
                    <div className="font-[var(--font-geist-mono)] text-3xl font-bold text-light">
                      {stats.pointsDeVieActuels}<span className="text-xl text-muted-light">/{stats.pointsDeVieMax}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-primary/20">
                  <div className="flex items-center gap-2 text-sm text-muted-light">
                    <span className="font-[var(--font-geist-mono)]">§{progress.currentParagraph}</span>
                    <span>•</span>
                    <span>{new Date(characterData.updatedAt).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <Link
                    href={`/characters/${character.id}`}
                    className="font-[var(--font-merriweather)] text-sm text-light hover:text-primary transition-colors font-semibold"
                  >
                    Voir la fiche →
                  </Link>
                </div>
              </div>
            );
            })}
          </div>
        )}

        {/* Bouton retour à l'accueil */}
        <Link
          href="/"
          className="block w-full bg-[#2a1e17] hover:bg-[#2a1e17]/80 border border-primary/30 text-light font-[var(--font-uncial)] tracking-wider py-4 px-8 rounded-lg transition-all duration-300 hover:border-primary text-center"
        >
          ← Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}
