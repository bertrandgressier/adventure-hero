'use client';

import { useState, useEffect, useRef } from 'react';
import type { Character } from '@/lib/types/character';

interface CharacterProgressProps {
  character: Character;
  onUpdate: (character: Character) => Promise<void>;
}

export default function CharacterProgress({ 
  character, 
  onUpdate
}: CharacterProgressProps) {
  const [editingParagraph, setEditingParagraph] = useState(false);
  const [paragraphValue, setParagraphValue] = useState('');
  const [editingBoulons, setEditingBoulons] = useState(false);
  const [boulonsValue, setBoulonsValue] = useState('');
  
  const paragraphInputRef = useRef<HTMLInputElement>(null);
  const boulonsInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingParagraph && paragraphInputRef.current) {
      paragraphInputRef.current.focus();
      paragraphInputRef.current.select();
    }
  }, [editingParagraph]);

  useEffect(() => {
    if (editingBoulons && boulonsInputRef.current) {
      boulonsInputRef.current.focus();
      boulonsInputRef.current.select();
    }
  }, [editingBoulons]);

  const startEditParagraph = () => {
    setParagraphValue(character.progress.currentParagraph.toString());
    setEditingParagraph(true);
  };

  const saveParagraph = async () => {
    const newValue = parseInt(paragraphValue);
    if (isNaN(newValue) || newValue < 1) {
      alert('Le numéro de paragraphe doit être un nombre positif');
      return;
    }
    const updatedCharacter = {
      ...character,
      progress: {
        ...character.progress,
        currentParagraph: newValue,
        history: [...character.progress.history, newValue],
        lastSaved: new Date().toISOString()
      },
      updatedAt: new Date().toISOString()
    };
    await onUpdate(updatedCharacter);
    setEditingParagraph(false);
  };

  const startEditBoulons = () => {
    setBoulonsValue(character.inventory.boulons.toString());
    setEditingBoulons(true);
  };

  const saveBoulons = async () => {
    const newValue = parseInt(boulonsValue);
    if (isNaN(newValue) || newValue < 0) {
      alert('Le nombre de boulons doit être un nombre positif ou nul');
      return;
    }
    const updatedCharacter = {
      ...character,
      inventory: {
        ...character.inventory,
        boulons: newValue
      },
      updatedAt: new Date().toISOString()
    };
    await onUpdate(updatedCharacter);
    setEditingBoulons(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Paragraphe actuel */}
            <div className="bg-[#1a140f] border border-primary/20 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-[var(--font-uncial)] tracking-wide text-muted-light">
            PARAGRAPHE
          </div>
          <div className="text-xs font-[var(--font-merriweather)] text-muted-light">
            {new Date(character.updatedAt).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        {editingParagraph ? (
          <div className="flex items-center gap-2">
            <input
              ref={paragraphInputRef}
              type="number"
              value={paragraphValue}
              onChange={(e) => setParagraphValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveParagraph();
                if (e.key === 'Escape') setEditingParagraph(false);
              }}
              className="flex-1 bg-[#2a1e17] border border-primary/50 rounded px-3 py-2 font-[var(--font-geist-mono)] text-xl text-primary focus:outline-none focus:border-primary"
              min="1"
            />
            <button
              onClick={saveParagraph}
              className="text-green-400 hover:text-green-300 text-2xl px-2"
              title="Valider"
            >
              ✓
            </button>
            <button
              onClick={() => setEditingParagraph(false)}
              className="text-red-400 hover:text-red-300 text-2xl px-2"
              title="Annuler"
            >
              ✕
            </button>
          </div>
        ) : (
          <div
            onClick={startEditParagraph}
            className="font-[var(--font-geist-mono)] text-3xl text-primary hover:text-yellow-300 cursor-pointer transition-colors"
            title="Cliquer pour modifier"
          >
            #{character.progress.currentParagraph}
          </div>
        )}
      </div>

      {/* Boulons */}
      <div className="bg-[#1a140f] glow-border rounded-lg p-4">
        <div className="font-[var(--font-merriweather)] text-sm text-muted-light mb-2">
          Boulons 🪙
        </div>
        {editingBoulons ? (
          <div className="flex items-center gap-2">
            <input
              ref={boulonsInputRef}
              type="number"
              value={boulonsValue}
              onChange={(e) => setBoulonsValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveBoulons();
                if (e.key === 'Escape') setEditingBoulons(false);
              }}
              className="flex-1 bg-[#2a1e17] border border-primary/50 rounded px-3 py-2 font-[var(--font-geist-mono)] text-xl text-primary focus:outline-none focus:border-primary"
              min="0"
            />
            <button
              onClick={saveBoulons}
              className="text-green-400 hover:text-green-300 text-2xl px-2"
              title="Valider"
            >
              ✓
            </button>
            <button
              onClick={() => setEditingBoulons(false)}
              className="text-red-400 hover:text-red-300 text-2xl px-2"
              title="Annuler"
            >
              ✕
            </button>
          </div>
        ) : (
          <div
            onClick={startEditBoulons}
            className="font-[var(--font-geist-mono)] text-3xl text-primary hover:text-yellow-300 cursor-pointer transition-colors"
            title="Cliquer pour modifier"
          >
            {character.inventory.boulons}
          </div>
        )}
      </div>
    </div>
  );
}
