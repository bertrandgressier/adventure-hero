'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getCharacter, deleteCharacter, updateCharacter } from '@/lib/storage/characters';
import type { Character } from '@/lib/types/character';

export default function CharacterDetail() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingParagraph, setEditingParagraph] = useState(false);
  const [paragraphValue, setParagraphValue] = useState('');
  const [editingBoulons, setEditingBoulons] = useState(false);
  const [boulonsValue, setBoulonsValue] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const paragraphInputRef = useRef<HTMLInputElement>(null);
  const boulonsInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadCharacter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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

  const handleUpdateParagraph = async () => {
    if (!character) return;

    const newParagraph = parseInt(paragraphValue);
    if (isNaN(newParagraph) || newParagraph < 1) {
      setEditingParagraph(false);
      setParagraphValue('');
      return;
    }

    try {
      const updatedCharacter = {
        ...character,
        progress: {
          ...character.progress,
          currentParagraph: newParagraph,
          history: [...character.progress.history, newParagraph],
          lastSaved: new Date().toISOString()
        },
        updatedAt: new Date().toISOString()
      };

      await updateCharacter(updatedCharacter);
      setCharacter(updatedCharacter);
      setEditingParagraph(false);
      setParagraphValue('');
    } catch (error) {
      console.error('Error updating paragraph:', error);
    }
  };

  const handleUpdateBoulons = async () => {
    if (!character) return;

    const newBoulons = parseInt(boulonsValue);
    if (isNaN(newBoulons) || newBoulons < 0) {
      setEditingBoulons(false);
      setBoulonsValue('');
      return;
    }

    try {
      const updatedCharacter = {
        ...character,
        inventory: {
          ...character.inventory,
          boulons: newBoulons
        },
        updatedAt: new Date().toISOString()
      };

      await updateCharacter(updatedCharacter);
      setCharacter(updatedCharacter);
      setEditingBoulons(false);
      setBoulonsValue('');
    } catch (error) {
      console.error('Error updating boulons:', error);
    }
  };

  const handleAddItem = async () => {
    if (!character || !newItemName.trim()) return;

    try {
      const updatedCharacter = {
        ...character,
        inventory: {
          ...character.inventory,
          items: [
            ...character.inventory.items,
            {
              name: newItemName.trim(),
              possessed: true,
              type: 'item' as const
            }
          ]
        },
        updatedAt: new Date().toISOString()
      };

      await updateCharacter(updatedCharacter);
      setCharacter(updatedCharacter);
      setNewItemName('');
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleToggleItem = async (index: number) => {
    if (!character) return;

    try {
      const updatedItems = [...character.inventory.items];
      updatedItems[index] = {
        ...updatedItems[index],
        possessed: !updatedItems[index].possessed
      };

      const updatedCharacter = {
        ...character,
        inventory: {
          ...character.inventory,
          items: updatedItems
        },
        updatedAt: new Date().toISOString()
      };

      await updateCharacter(updatedCharacter);
      setCharacter(updatedCharacter);
    } catch (error) {
      console.error('Error toggling item:', error);
    }
  };

  const handleDeleteItem = async (index: number) => {
    if (!character) return;

    try {
      const updatedItems = character.inventory.items.filter((_, i) => i !== index);

      const updatedCharacter = {
        ...character,
        inventory: {
          ...character.inventory,
          items: updatedItems
        },
        updatedAt: new Date().toISOString()
      };

      await updateCharacter(updatedCharacter);
      setCharacter(updatedCharacter);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
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
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#1a140f] border border-primary/20 rounded-lg p-4 text-center">
              <div className="text-xs font-[var(--font-uncial)] tracking-wide text-muted-light mb-2">DEXTÉRITÉ</div>
              <div className="font-[var(--font-geist-mono)] text-3xl font-bold text-light">{character.stats.dexterite}</div>
            </div>
            <div className="bg-[#1a140f] border border-primary/20 rounded-lg p-4 text-center">
              <div className="text-xs font-[var(--font-uncial)] tracking-wide text-muted-light mb-2">CHANCE</div>
              <div className="font-[var(--font-geist-mono)] text-3xl font-bold text-light">
                {character.stats.chance}
                <span className="text-sm text-muted-light ml-2">(init: {character.stats.chanceInitiale})</span>
              </div>
            </div>
            <div className="bg-[#1a140f] border border-primary/20 rounded-lg p-4 text-center">
              <div className="text-xs font-[var(--font-uncial)] tracking-wide text-muted-light mb-2">PV MAX</div>
              <div className="font-[var(--font-geist-mono)] text-3xl font-bold text-light">{character.stats.pointsDeVieMax}</div>
            </div>
            <div className="bg-[#1a140f] border border-primary/20 rounded-lg p-4 text-center">
              <div className="text-xs font-[var(--font-uncial)] tracking-wide text-muted-light mb-2">PV ACTUELS</div>
              <div className="font-[var(--font-geist-mono)] text-3xl font-bold text-light">{character.stats.pointsDeVieActuels}</div>
            </div>
          </div>
        </div>

        {/* Progression Section */}
        <div className="bg-[#2a1e17] glow-border rounded-lg p-6">
          <h2 className="font-[var(--font-uncial)] text-xl tracking-wide text-light mb-4">Progression</h2>
          <div className="flex items-center gap-4">
            <p className="font-[var(--font-merriweather)] text-muted-light">Paragraphe actuel:</p>
            {editingParagraph ? (
              <div className="flex items-center gap-2">
                <input
                  ref={paragraphInputRef}
                  type="number"
                  value={paragraphValue}
                  onChange={(e) => setParagraphValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleUpdateParagraph();
                    } else if (e.key === 'Escape') {
                      setEditingParagraph(false);
                      setParagraphValue('');
                    }
                  }}
                  className="bg-[#1a140f] border border-primary/20 rounded px-3 py-2 w-32 font-[var(--font-geist-mono)] text-light focus:outline-none focus:border-primary"
                />
                <button
                  onClick={handleUpdateParagraph}
                  className="bg-[#FFBF00] hover:bg-yellow-400 text-[#000000] font-bold px-4 py-2 rounded transition-all"
                >
                  ✓
                </button>
                <button
                  onClick={() => {
                    setEditingParagraph(false);
                    setParagraphValue('');
                  }}
                  className="bg-muted hover:bg-muted/80 text-light font-bold px-4 py-2 rounded transition-all"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setEditingParagraph(true);
                  setParagraphValue(character.progress.currentParagraph.toString());
                }}
                className="font-[var(--font-geist-mono)] text-3xl font-bold text-light hover:text-primary transition-colors cursor-pointer"
              >
                §{character.progress.currentParagraph}
              </button>
            )}
          </div>
        </div>

        {/* Inventory Section */}
        <div className="bg-[#2a1e17] glow-border rounded-lg p-6">
          <h2 className="font-[var(--font-uncial)] text-xl tracking-wide text-light mb-4">Inventaire</h2>
          
          {/* Boulons */}
          <div className="mb-6 flex items-center gap-4">
            <p className="font-[var(--font-merriweather)] text-muted-light">Boulons:</p>
            {editingBoulons ? (
              <div className="flex items-center gap-2">
                <input
                  ref={boulonsInputRef}
                  type="number"
                  value={boulonsValue}
                  onChange={(e) => setBoulonsValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleUpdateBoulons();
                    } else if (e.key === 'Escape') {
                      setEditingBoulons(false);
                      setBoulonsValue('');
                    }
                  }}
                  className="bg-[#1a140f] border border-primary/20 rounded px-3 py-2 w-32 font-[var(--font-geist-mono)] text-light focus:outline-none focus:border-primary"
                />
                <button
                  onClick={handleUpdateBoulons}
                  className="bg-[#FFBF00] hover:bg-yellow-400 text-[#000000] font-bold px-4 py-2 rounded transition-all"
                >
                  ✓
                </button>
                <button
                  onClick={() => {
                    setEditingBoulons(false);
                    setBoulonsValue('');
                  }}
                  className="bg-muted hover:bg-muted/80 text-light font-bold px-4 py-2 rounded transition-all"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setEditingBoulons(true);
                  setBoulonsValue(character.inventory.boulons?.toString() || '0');
                }}
                className="font-[var(--font-geist-mono)] text-2xl font-bold text-light hover:text-primary transition-colors cursor-pointer"
              >
                🔩 {character.inventory.boulons || 0}
              </button>
            )}
          </div>

          {/* Items List */}
          <div className="space-y-2 mb-4">
            {character.inventory.items.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-[#1a140f] border border-primary/20 rounded-lg p-3 group hover:border-primary/40 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={item.possessed}
                  onChange={() => handleToggleItem(index)}
                  className="w-5 h-5 cursor-pointer accent-primary"
                />
                <span className={`flex-1 font-[var(--font-merriweather)] ${item.possessed ? 'text-light' : 'text-muted-light line-through'}`}>
                  {item.name}
                  {item.attackPoints && (
                    <span className="ml-2 text-sm text-primary font-bold">
                      (+{item.attackPoints})
                    </span>
                  )}
                </span>
                <button
                  onClick={() => handleDeleteItem(index)}
                  className="opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive/80 transition-opacity text-xl"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Add Item */}
          <div className="flex gap-2">
            <input
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddItem();
                }
              }}
              placeholder="Nouvel objet..."
              className="flex-1 bg-[#1a140f] border border-primary/20 rounded px-4 py-2 font-[var(--font-merriweather)] text-light placeholder:text-muted-light focus:outline-none focus:border-primary"
            />
            <button
              onClick={handleAddItem}
              className="bg-[#FFBF00] hover:bg-yellow-400 text-[#000000] font-[var(--font-uncial)] font-bold px-6 py-2 rounded transition-all"
            >
              Ajouter
            </button>
          </div>
        </div>

        {/* Notes Section */}
        {character.notes && (
          <div className="bg-[#2a1e17] glow-border rounded-lg p-6">
            <h2 className="font-[var(--font-uncial)] text-xl tracking-wide text-light mb-4">Notes</h2>
            <p className="font-[var(--font-merriweather)] text-light whitespace-pre-wrap">{character.notes}</p>
          </div>
        )}
      </div>
    </main>
  );
}
