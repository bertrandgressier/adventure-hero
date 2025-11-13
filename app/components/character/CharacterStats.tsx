'use client';

import { useState, useEffect, useRef } from 'react';
import type { Character } from '@/lib/types/character';

interface CharacterStatsProps {
  character: Character;
  onUpdate: (character: Character) => Promise<void>;
}

export default function CharacterStats({ character, onUpdate }: CharacterStatsProps) {
  const handleUpdateStat = async (updates: Partial<Character>) => {
    const updatedCharacter = {
      ...character,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    await onUpdate(updatedCharacter);
  };

  const [editingDexterite, setEditingDexterite] = useState(false);
  const [dexteriteValue, setDexteriteValue] = useState('');
  const [editingChance, setEditingChance] = useState(false);
  const [chanceValue, setChanceValue] = useState('');
  const [editingPvMax, setEditingPvMax] = useState(false);
  const [pvMaxValue, setPvMaxValue] = useState('');
  const [editingPvActuels, setEditingPvActuels] = useState(false);
  const [pvActuelsValue, setPvActuelsValue] = useState('');
  
  const dexteriteInputRef = useRef<HTMLInputElement>(null);
  const chanceInputRef = useRef<HTMLInputElement>(null);
  const pvMaxInputRef = useRef<HTMLInputElement>(null);
  const pvActuelsInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingDexterite && dexteriteInputRef.current) {
      dexteriteInputRef.current.focus();
      dexteriteInputRef.current.select();
    }
  }, [editingDexterite]);

  useEffect(() => {
    if (editingChance && chanceInputRef.current) {
      chanceInputRef.current.focus();
      chanceInputRef.current.select();
    }
  }, [editingChance]);

  useEffect(() => {
    if (editingPvMax && pvMaxInputRef.current) {
      pvMaxInputRef.current.focus();
      pvMaxInputRef.current.select();
    }
  }, [editingPvMax]);

  useEffect(() => {
    if (editingPvActuels && pvActuelsInputRef.current) {
      pvActuelsInputRef.current.focus();
      pvActuelsInputRef.current.select();
    }
  }, [editingPvActuels]);

  const startEditDexterite = () => {
    setDexteriteValue(character.stats.dexterite.toString());
    setEditingDexterite(true);
  };

  const saveDexterite = async () => {
    const newValue = parseInt(dexteriteValue);
    if (isNaN(newValue) || newValue < 1) {
      alert('La dextérité doit être un nombre positif');
      return;
    }
    await handleUpdateStat({
      stats: { ...character.stats, dexterite: newValue }
    });
    setEditingDexterite(false);
  };

  const startEditChance = () => {
    setChanceValue(character.stats.chance.toString());
    setEditingChance(true);
  };

  const saveChance = async () => {
    const newValue = parseInt(chanceValue);
    if (isNaN(newValue) || newValue < 0) {
      alert('La chance doit être un nombre positif ou nul');
      return;
    }
    await handleUpdateStat({
      stats: { ...character.stats, chance: newValue }
    });
    setEditingChance(false);
  };

  const startEditPvMax = () => {
    setPvMaxValue(character.stats.pointsDeVieMax.toString());
    setEditingPvMax(true);
  };

  const savePvMax = async () => {
    const newValue = parseInt(pvMaxValue);
    if (isNaN(newValue) || newValue < 1) {
      alert('Les PV maximum doivent être un nombre positif');
      return;
    }
    await handleUpdateStat({
      stats: { ...character.stats, pointsDeVieMax: newValue }
    });
    setEditingPvMax(false);
  };

  const startEditPvActuels = () => {
    setPvActuelsValue(character.stats.pointsDeVieActuels.toString());
    setEditingPvActuels(true);
  };

  const savePvActuels = async () => {
    const newValue = parseInt(pvActuelsValue);
    if (isNaN(newValue) || newValue < 0) {
      alert('Les PV actuels doivent être un nombre positif ou nul');
      return;
    }
    await handleUpdateStat({
      stats: { ...character.stats, pointsDeVieActuels: newValue }
    });
    setEditingPvActuels(false);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* DEXTÉRITÉ */}
      <div className="bg-[#1a140f] glow-border rounded-lg p-4 text-center">
        <div className="font-[var(--font-merriweather)] text-sm text-muted-light mb-2">DEXTÉRITÉ</div>
        {editingDexterite ? (
          <div className="flex items-center justify-center gap-2">
            <input
              ref={dexteriteInputRef}
              type="number"
              value={dexteriteValue}
              onChange={(e) => setDexteriteValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveDexterite();
                if (e.key === 'Escape') setEditingDexterite(false);
              }}
              className="w-16 bg-[#2a1e17] border border-primary/50 rounded px-2 py-1 text-center font-[var(--font-geist-mono)] text-2xl text-primary focus:outline-none focus:border-primary"
              min="1"
            />
            <button
              onClick={saveDexterite}
              className="text-green-400 hover:text-green-300 text-xl"
              title="Valider"
            >
              ✓
            </button>
            <button
              onClick={() => setEditingDexterite(false)}
              className="text-red-400 hover:text-red-300 text-xl"
              title="Annuler"
            >
              ✕
            </button>
          </div>
        ) : (
          <div
            onClick={startEditDexterite}
            className="font-[var(--font-geist-mono)] text-4xl text-primary hover:text-yellow-300 cursor-pointer transition-colors"
            title="Cliquer pour modifier"
          >
            {character.stats.dexterite}
          </div>
        )}
      </div>

      {/* CHANCE */}
      <div className="bg-[#1a140f] glow-border rounded-lg p-4 text-center">
        <div className="font-[var(--font-merriweather)] text-sm text-muted-light mb-2">CHANCE</div>
        {editingChance ? (
          <div className="flex items-center justify-center gap-2">
            <input
              ref={chanceInputRef}
              type="number"
              value={chanceValue}
              onChange={(e) => setChanceValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveChance();
                if (e.key === 'Escape') setEditingChance(false);
              }}
              className="w-16 bg-[#2a1e17] border border-primary/50 rounded px-2 py-1 text-center font-[var(--font-geist-mono)] text-2xl text-primary focus:outline-none focus:border-primary"
              min="0"
            />
            <button
              onClick={saveChance}
              className="text-green-400 hover:text-green-300 text-xl"
              title="Valider"
            >
              ✓
            </button>
            <button
              onClick={() => setEditingChance(false)}
              className="text-red-400 hover:text-red-300 text-xl"
              title="Annuler"
            >
              ✕
            </button>
          </div>
        ) : (
          <div
            onClick={startEditChance}
            className="font-[var(--font-geist-mono)] text-4xl text-primary hover:text-yellow-300 cursor-pointer transition-colors"
            title="Cliquer pour modifier"
          >
            {character.stats.chance}
          </div>
        )}
      </div>

      {/* PV MAX */}
      <div className="bg-[#1a140f] glow-border rounded-lg p-4 text-center">
        <div className="font-[var(--font-merriweather)] text-sm text-muted-light mb-2">PV MAX</div>
        {editingPvMax ? (
          <div className="flex items-center justify-center gap-2">
            <input
              ref={pvMaxInputRef}
              type="number"
              value={pvMaxValue}
              onChange={(e) => setPvMaxValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') savePvMax();
                if (e.key === 'Escape') setEditingPvMax(false);
              }}
              className="w-16 bg-[#2a1e17] border border-primary/50 rounded px-2 py-1 text-center font-[var(--font-geist-mono)] text-2xl text-primary focus:outline-none focus:border-primary"
              min="1"
            />
            <button
              onClick={savePvMax}
              className="text-green-400 hover:text-green-300 text-xl"
              title="Valider"
            >
              ✓
            </button>
            <button
              onClick={() => setEditingPvMax(false)}
              className="text-red-400 hover:text-red-300 text-xl"
              title="Annuler"
            >
              ✕
            </button>
          </div>
        ) : (
          <div
            onClick={startEditPvMax}
            className="font-[var(--font-geist-mono)] text-4xl text-primary hover:text-yellow-300 cursor-pointer transition-colors"
            title="Cliquer pour modifier"
          >
            {character.stats.pointsDeVieMax}
          </div>
        )}
      </div>

      {/* PV ACTUELS */}
      <div className="bg-[#1a140f] glow-border rounded-lg p-4 text-center">
        <div className="font-[var(--font-merriweather)] text-sm text-muted-light mb-2">PV ACTUELS</div>
        {editingPvActuels ? (
          <div className="flex items-center justify-center gap-2">
            <input
              ref={pvActuelsInputRef}
              type="number"
              value={pvActuelsValue}
              onChange={(e) => setPvActuelsValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') savePvActuels();
                if (e.key === 'Escape') setEditingPvActuels(false);
              }}
              className="w-16 bg-[#2a1e17] border border-primary/50 rounded px-2 py-1 text-center font-[var(--font-geist-mono)] text-2xl text-primary focus:outline-none focus:border-primary"
              min="0"
            />
            <button
              onClick={savePvActuels}
              className="text-green-400 hover:text-green-300 text-xl"
              title="Valider"
            >
              ✓
            </button>
            <button
              onClick={() => setEditingPvActuels(false)}
              className="text-red-400 hover:text-red-300 text-xl"
              title="Annuler"
            >
              ✕
            </button>
          </div>
        ) : (
          <div
            onClick={startEditPvActuels}
            className={`font-[var(--font-geist-mono)] text-4xl hover:text-yellow-300 cursor-pointer transition-colors ${
              character.stats.pointsDeVieActuels === 0
                ? 'text-red-400'
                : character.stats.pointsDeVieActuels <= character.stats.pointsDeVieMax / 4
                  ? 'text-orange-400'
                  : 'text-primary'
            }`}
            title="Cliquer pour modifier"
          >
            {character.stats.pointsDeVieActuels}
          </div>
        )}
      </div>
    </div>
  );
}
