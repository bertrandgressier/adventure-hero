'use client';

import { useState } from 'react';
import { Pencil } from 'lucide-react';
import { useCharacter } from '@/src/presentation/hooks/useCharacter';

interface CharacterNotesProps {
  characterId: string;
}

export default function CharacterNotes({ characterId }: CharacterNotesProps) {
  const { character, updateNotes } = useCharacter(characterId);
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState('');

  const handleStartEditing = () => {
    if (character) {
      setNotes(character.notes || '');
    }
    setIsEditing(true);
  };

  const handleSave = async () => {
    await updateNotes(notes);
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (character) {
      setNotes(character.notes || '');
    }
    setIsEditing(false);
  };

  if (!character) return null;

  return (
    <div className="bg-card glow-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-[var(--font-uncial)] text-xl tracking-wide text-light">
          Notes
        </h2>
        {!isEditing && (
          <button
            onClick={handleStartEditing}
            className="text-primary hover:text-yellow-300 transition-colors bg-primary/10 hover:bg-primary/20 rounded-lg p-2"
            title="Modifier"
          >
            <Pencil className="w-5 h-5" />
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full h-40 bg-background border border-primary/30 rounded-lg p-3 text-light font-[var(--font-merriweather)] focus:outline-none focus:border-primary resize-none"
            placeholder="Écrivez vos notes ici..."
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 rounded-lg border border-primary/30 text-muted-light hover:text-light hover:border-primary/50 transition-colors font-[var(--font-uncial)]"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-[var(--font-uncial)] font-bold"
            >
              Sauvegarder
            </button>
          </div>
        </div>
      ) : (
        <div 
          onClick={handleStartEditing}
          className="min-h-[100px] cursor-pointer group"
        >
          {character.notes ? (
            <p className="font-[var(--font-merriweather)] text-light whitespace-pre-wrap group-hover:text-primary/90 transition-colors">
              {character.notes}
            </p>
          ) : (
            <p className="font-[var(--font-merriweather)] text-muted-light italic group-hover:text-primary/70 transition-colors">
              Aucune note. Cliquez pour ajouter...
            </p>
          )}
        </div>
      )}
    </div>
  );
}
