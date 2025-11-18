'use client';

import { useState, useEffect, useRef } from 'react';

interface EditableStatFieldProps {
  label: string;
  value: number;
  onSave: (value: number) => Promise<void>;
  min?: number;
  colorClass?: string;
  title?: string;
}

/**
 * Composant réutilisable pour afficher/éditer une stat.
 * 
 * - Clic pour éditer
 * - Enter pour valider, Escape pour annuler
 * - Validation du min
 */
export default function EditableStatField({
  label,
  value,
  onSave,
  min = 0,
  colorClass = 'text-primary',
  title = 'Cliquer pour modifier',
}: EditableStatFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus et sélection au début de l'édition
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const startEdit = () => {
    setInputValue(value.toString());
    setIsEditing(true);
  };

  const save = async () => {
    const newValue = parseInt(inputValue);
    
    if (isNaN(newValue)) {
      alert(`${label} doit être un nombre`);
      return;
    }
    
    if (newValue < min) {
      alert(`${label} doit être au minimum ${min}`);
      return;
    }
    
    try {
      await onSave(newValue);
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const cancel = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') save();
    if (e.key === 'Escape') cancel();
  };

  return (
    <div className="bg-background glow-border rounded-lg p-4 text-center">
      <div className="font-[var(--font-merriweather)] text-sm text-muted-light mb-2">
        {label}
      </div>
      
      {isEditing ? (
        <div className="flex items-center justify-center gap-2">
          <input
            ref={inputRef}
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-16 bg-card border border-primary/50 rounded px-2 py-1 text-center font-[var(--font-geist-mono)] text-2xl text-primary focus:outline-none focus:border-primary"
            min={min}
          />
          <button
            onClick={save}
            className="text-green-400 hover:text-green-300 text-xl"
            title="Valider"
          >
            ✓
          </button>
          <button
            onClick={cancel}
            className="text-red-400 hover:text-red-300 text-xl"
            title="Annuler"
          >
            ✕
          </button>
        </div>
      ) : (
        <div
          onClick={startEdit}
          className={`font-[var(--font-geist-mono)] text-4xl hover:text-yellow-300 cursor-pointer transition-colors ${colorClass}`}
          title={title}
        >
          {value}
        </div>
      )}
    </div>
  );
}
