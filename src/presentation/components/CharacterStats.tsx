'use client';

import { useState, useRef, useEffect } from 'react';
import { Hand, Clover, Heart } from 'lucide-react';
import { useCharacter } from '@/src/presentation/hooks/useCharacter';
import EditableStatField from '@/src/presentation/components/EditableStatField';

interface CharacterStatsProps {
  characterId: string;
  onUpdate?: () => void; // Callback optionnel pour notifier le parent
}

interface EditableNumberProps {
  value: number;
  onSave: (value: number) => Promise<void>;
  min?: number;
  className?: string;
  editClassName?: string;
}

function EditableNumber({ value, onSave, min = 0, className, editClassName }: EditableNumberProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const startEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInputValue(value.toString());
    setIsEditing(true);
  };

  const save = async () => {
    const newValue = parseInt(inputValue);
    if (isNaN(newValue) || newValue < min) return;
    
    try {
      await onSave(newValue);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') save();
    if (e.key === 'Escape') setIsEditing(false);
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="number"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={save}
        className={`bg-card border border-primary/50 rounded px-1 py-0.5 text-center font-[var(--font-geist-mono)] text-primary focus:outline-none focus:border-primary ${editClassName || 'w-12 text-xl'}`}
        min={min}
        onClick={(e) => e.stopPropagation()}
      />
    );
  }

  return (
    <span
      onClick={startEdit}
      className={`cursor-pointer hover:text-yellow-300 transition-colors ${className}`}
      title="Cliquer pour modifier"
    >
      {value}
    </span>
  );
}

/**
 * Composant refactorisé avec Clean Architecture.
 * 
 * Avant: 8 useState + 4 useRef + logique métier dupliquée
 * Après: 1 hook useCharacter qui encapsule tout
 * 
 * Avantages:
 * - Code réduit de ~300 lignes à ~70 lignes
 * - Logique métier testable (dans Character entity)
 * - Composant réutilisable (EditableStatField)
 * - Pas de duplication de updatedAt
 */
export default function CharacterStats({ characterId, onUpdate }: CharacterStatsProps) {
  const { character, isLoading, error, updateStats } = useCharacter(characterId);
  
  const handleUpdate = async (updates: Parameters<typeof updateStats>[0]) => {
    await updateStats(updates);
    onUpdate?.(); // Notifier le parent si nécessaire
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

  const stats = character.getStatsObject();
  const statsData = stats.toData();

  return (
    <div className="grid grid-cols-3 gap-2">
      <EditableStatField
        label="DEXT."
        value={statsData.dexterite}
        onSave={(value) => handleUpdate({ dexterite: value })}
        min={1}
        icon={<Hand className="size-4" />}
      />

      <EditableStatField
        label="CHANCE"
        value={statsData.chance}
        onSave={(value) => handleUpdate({ chance: value })}
        min={0}
        icon={<Clover className="size-4" />}
      />

      <div className="bg-background border border-primary/20 rounded-lg p-2 text-center flex flex-col items-center justify-center min-h-[80px]">
        <div className="flex items-center gap-1.5 text-muted-light mb-1">
          <Heart className="size-4" />
          <span className="text-[10px] uppercase font-bold tracking-wider">VIE</span>
        </div>
        <div className="font-[var(--font-geist-mono)] font-bold text-light flex items-baseline justify-center gap-0.5">
          <EditableNumber
            value={statsData.pointsDeVieActuels}
            onSave={(value) => handleUpdate({ pointsDeVieActuels: value })}
            min={0}
            className="text-2xl"
            editClassName="w-12 text-xl"
          />
          <span className="text-sm text-muted-light">/</span>
          <EditableNumber
            value={statsData.pointsDeVieMax}
            onSave={(value) => handleUpdate({ pointsDeVieMax: value })}
            min={1}
            className="text-sm text-muted-light"
            editClassName="w-10 text-sm"
          />
        </div>
      </div>
    </div>
  );
}
