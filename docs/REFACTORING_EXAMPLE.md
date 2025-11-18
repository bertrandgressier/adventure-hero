# Exemple de Refactorisation : CharacterStats

Ce document montre **concrètement** comment refactoriser un composant existant vers Clean Architecture.

## 🔴 AVANT : Code Actuel

### Structure
```
app/components/character/CharacterStats.tsx    (180 lignes)
    ├── État local (8 useState)
    ├── Logique métier (transformations de données)
    ├── Logique de persistance (appels directs)
    └── UI (JSX)
```

### Code (CharacterStats.tsx)
```tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import type { Character } from '@/lib/types/character';

interface CharacterStatsProps {
  character: Character;
  onUpdate: (character: Character) => Promise<void>;
}

export default function CharacterStats({ character, onUpdate }: CharacterStatsProps) {
  // ❌ État local pour chaque champ
  const [editingDexterite, setEditingDexterite] = useState(false);
  const [dexteriteValue, setDexteriteValue] = useState('');
  const [editingChance, setEditingChance] = useState(false);
  const [chanceValue, setChanceValue] = useState('');
  // ... 4 autres useState

  // ❌ Logique métier dans le composant
  const handleUpdateStat = async (updates: Partial<Character>) => {
    const updatedCharacter = {
      ...character,
      ...updates,
      updatedAt: new Date().toISOString()  // ❌ Répété partout
    };
    await onUpdate(updatedCharacter);
  };

  const saveDexterite = async () => {
    const newValue = parseInt(dexteriteValue);
    if (isNaN(newValue) || newValue < 1) {
      alert('La dextérité doit être un nombre positif');  // ❌ Validation UI
      return;
    }
    await handleUpdateStat({
      stats: { ...character.stats, dexterite: newValue }
    });
    setEditingDexterite(false);
  };

  // ... 3 autres fonctions similaires (120 lignes de duplication)

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* ❌ Logique d'édition inline mélangée avec l'UI */}
      <div className="bg-[#1a140f] glow-border rounded-lg p-4 text-center">
        <div className="font-[var(--font-merriweather)] text-sm text-muted-light mb-2">
          DEXTÉRITÉ
        </div>
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
              className="..."
              min="1"
            />
            <button onClick={saveDexterite} className="...">✓</button>
            <button onClick={() => setEditingDexterite(false)} className="...">✕</button>
          </div>
        ) : (
          <div
            onClick={startEditDexterite}
            className="..."
          >
            {character.stats.dexterite}
          </div>
        )}
      </div>
      {/* ... 3 autres blocs identiques */}
    </div>
  );
}
```

### Problèmes
- ❌ **180 lignes** dans un seul fichier
- ❌ **8 useState** pour gérer l'édition
- ❌ **Logique métier mélangée** avec l'UI
- ❌ **Validation dans le composant**
- ❌ **Code dupliqué** pour chaque stat
- ❌ **Difficile à tester** (besoin de mocker IndexedDB)
- ❌ **Difficile à réutiliser** (couplé à Character)

---

## 🟢 APRÈS : Architecture Clean

### Structure
```
src/
├── domain/
│   └── entities/
│       └── Character.ts              (Logique métier)
├── application/
│   └── services/
│       └── CharacterService.ts       (Use cases)
└── presentation/
    └── hooks/
        └── useCharacter.ts           (État + orchestration)

app/components/character/
├── CharacterStatsView.tsx            (UI pure - 60 lignes)
└── EditableStatField.tsx             (Composant réutilisable - 40 lignes)
```

### 1. Domain Layer : Entité Character

```typescript
// src/domain/entities/Character.ts
import { Stats, StatsData } from './Stats';
import { Inventory, InventoryData } from './Inventory';

export interface CharacterData {
  id: string;
  name: string;
  book: string;
  talent: string;
  createdAt: string;
  updatedAt: string;
  stats: StatsData;
  inventory: InventoryData;
  progress: ProgressData;
  notes: string;
}

export class Character {
  constructor(
    public readonly id: string,
    public name: string,
    public readonly book: string,
    public readonly talent: string,
    public readonly createdAt: string,
    private stats: Stats,
    private inventory: Inventory,
    private progress: Progress,
    public notes: string
  ) {}

  // ✅ Logique métier centralisée
  updateStats(newStats: Partial<StatsData>): Character {
    const updatedStats = this.stats.update(newStats);
    
    return new Character(
      this.id,
      this.name,
      this.book,
      this.talent,
      this.createdAt,
      updatedStats,
      this.inventory,
      this.progress,
      this.notes
    );
  }

  updateName(newName: string): Character {
    if (!newName.trim()) {
      throw new Error('Le nom ne peut pas être vide');
    }
    
    return new Character(
      this.id,
      newName.trim(),
      this.book,
      this.talent,
      this.createdAt,
      this.stats,
      this.inventory,
      this.progress,
      this.notes
    );
  }

  isDead(): boolean {
    return this.stats.currentHealth <= 0;
  }

  isCriticalHealth(): boolean {
    return this.stats.currentHealth <= this.stats.maxHealth / 4;
  }

  // ✅ Conversion pour la persistance
  toData(): CharacterData {
    return {
      id: this.id,
      name: this.name,
      book: this.book,
      talent: this.talent,
      createdAt: this.createdAt,
      updatedAt: new Date().toISOString(),  // ✅ SEUL endroit
      stats: this.stats.toData(),
      inventory: this.inventory.toData(),
      progress: this.progress.toData(),
      notes: this.notes
    };
  }

  // ✅ Factory method
  static fromData(data: CharacterData): Character {
    return new Character(
      data.id,
      data.name,
      data.book,
      data.talent,
      data.createdAt,
      Stats.fromData(data.stats),
      Inventory.fromData(data.inventory),
      Progress.fromData(data.progress),
      data.notes
    );
  }

  // Getters pour l'UI
  getStats(): StatsData {
    return this.stats.toData();
  }

  getInventory(): InventoryData {
    return this.inventory.toData();
  }
}
```

```typescript
// src/domain/entities/Stats.ts
export interface StatsData {
  dexterite: number;
  chance: number;
  chanceInitiale: number;
  pointsDeVieMax: number;
  pointsDeVieActuels: number;
}

export class Stats {
  constructor(
    public readonly dexterite: number,
    public readonly chance: number,
    public readonly chanceInitiale: number,
    public readonly maxHealth: number,
    public readonly currentHealth: number
  ) {
    this.validate();
  }

  // ✅ Validation centralisée
  private validate(): void {
    if (this.dexterite < 1) {
      throw new Error('La dextérité doit être >= 1');
    }
    if (this.chance < 0) {
      throw new Error('La chance doit être >= 0');
    }
    if (this.maxHealth < 1) {
      throw new Error('Les PV max doivent être >= 1');
    }
    if (this.currentHealth < 0) {
      throw new Error('Les PV actuels doivent être >= 0');
    }
  }

  update(newStats: Partial<StatsData>): Stats {
    return new Stats(
      newStats.dexterite ?? this.dexterite,
      newStats.chance ?? this.chance,
      newStats.chanceInitiale ?? this.chanceInitiale,
      newStats.pointsDeVieMax ?? this.maxHealth,
      newStats.pointsDeVieActuels ?? this.currentHealth
    );
  }

  toData(): StatsData {
    return {
      dexterite: this.dexterite,
      chance: this.chance,
      chanceInitiale: this.chanceInitiale,
      pointsDeVieMax: this.maxHealth,
      pointsDeVieActuels: this.currentHealth
    };
  }

  static fromData(data: StatsData): Stats {
    return new Stats(
      data.dexterite,
      data.chance,
      data.chanceInitiale,
      data.pointsDeVieMax,
      data.pointsDeVieActuels
    );
  }
}
```

### 2. Application Layer : Service

```typescript
// src/application/services/CharacterService.ts
import { Character } from '@/src/domain/entities/Character';
import { ICharacterRepository } from '@/src/domain/repositories/ICharacterRepository';
import { StatsData } from '@/src/domain/entities/Stats';

export class CharacterService {
  constructor(
    private repository: ICharacterRepository
  ) {}

  async getCharacter(id: string): Promise<Character | null> {
    return this.repository.findById(id);
  }

  async getAllCharacters(): Promise<Character[]> {
    return this.repository.findAll();
  }

  async updateCharacterStats(
    id: string,
    statsUpdate: Partial<StatsData>
  ): Promise<Character> {
    const character = await this.repository.findById(id);
    if (!character) {
      throw new Error(`Personnage ${id} non trouvé`);
    }

    // ✅ Logique métier dans l'entité
    const updated = character.updateStats(statsUpdate);
    
    // ✅ Persistance
    await this.repository.save(updated);
    
    return updated;
  }

  async deleteCharacter(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
```

### 3. Presentation Layer : Hook

```typescript
// src/presentation/hooks/useCharacter.ts
'use client';

import { useState, useEffect } from 'react';
import { Character } from '@/src/domain/entities/Character';
import { StatsData } from '@/src/domain/entities/Stats';
import { CharacterService } from '@/src/application/services/CharacterService';
import { IndexedDBCharacterRepository } from '@/src/infrastructure/persistence/IndexedDBCharacterRepository';

// ✅ Instance unique du service
const characterService = new CharacterService(
  new IndexedDBCharacterRepository()
);

export function useCharacter(id: string) {
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadCharacter();
  }, [id]);

  const loadCharacter = async () => {
    try {
      setLoading(true);
      setError(null);
      const char = await characterService.getCharacter(id);
      setCharacter(char);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const updateStats = async (stats: Partial<StatsData>) => {
    try {
      setError(null);
      const updated = await characterService.updateCharacterStats(id, stats);
      setCharacter(updated);
    } catch (err) {
      setError(err as Error);
      throw err;  // Re-throw pour l'UI
    }
  };

  const updateName = async (newName: string) => {
    if (!character) return;
    
    try {
      setError(null);
      const updated = character.updateName(newName);
      await characterService.repository.save(updated);
      setCharacter(updated);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  return {
    character,
    loading,
    error,
    stats: character?.getStats() ?? null,
    updateStats,
    updateName,
    reload: loadCharacter
  };
}
```

### 4. UI Layer : Composants

```tsx
// app/components/character/EditableStatField.tsx
'use client';

import { useState, useRef, useEffect } from 'react';

interface EditableStatFieldProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onSave: (value: number) => Promise<void>;
  variant?: 'default' | 'health';
}

export default function EditableStatField({
  label,
  value,
  min = 0,
  max = 999,
  onSave,
  variant = 'default'
}: EditableStatFieldProps) {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState('');
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const startEdit = () => {
    setTempValue(value.toString());
    setEditing(true);
  };

  const handleSave = async () => {
    const newValue = parseInt(tempValue);
    
    if (isNaN(newValue) || newValue < min || newValue > max) {
      alert(`La valeur doit être entre ${min} et ${max}`);
      return;
    }

    try {
      setSaving(true);
      await onSave(newValue);
      setEditing(false);
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setTempValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') handleCancel();
  };

  const getValueColor = () => {
    if (variant === 'health' && value <= max / 4) return 'text-red-400';
    if (variant === 'health' && value <= max / 2) return 'text-orange-400';
    return 'text-primary';
  };

  return (
    <div className="bg-[#1a140f] glow-border rounded-lg p-4 text-center">
      <div className="font-[var(--font-merriweather)] text-sm text-muted-light mb-2">
        {label}
      </div>
      
      {editing ? (
        <div className="flex items-center justify-center gap-2">
          <input
            ref={inputRef}
            type="number"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={saving}
            className="w-16 bg-[#2a1e17] border border-primary/50 rounded px-2 py-1 text-center font-[var(--font-geist-mono)] text-2xl text-primary focus:outline-none focus:border-primary"
            min={min}
            max={max}
          />
          <button
            onClick={handleSave}
            disabled={saving}
            className="text-green-400 hover:text-green-300 text-xl disabled:opacity-50"
            title="Valider"
          >
            ✓
          </button>
          <button
            onClick={handleCancel}
            disabled={saving}
            className="text-red-400 hover:text-red-300 text-xl disabled:opacity-50"
            title="Annuler"
          >
            ✕
          </button>
        </div>
      ) : (
        <div
          onClick={startEdit}
          className={`font-[var(--font-geist-mono)] text-4xl ${getValueColor()} hover:text-yellow-300 cursor-pointer transition-colors`}
          title="Cliquer pour modifier"
        >
          {value}
        </div>
      )}
    </div>
  );
}
```

```tsx
// app/components/character/CharacterStatsView.tsx
'use client';

import { StatsData } from '@/src/domain/entities/Stats';
import EditableStatField from './EditableStatField';

interface CharacterStatsViewProps {
  stats: StatsData;
  onUpdateStats: (stats: Partial<StatsData>) => Promise<void>;
}

export default function CharacterStatsView({
  stats,
  onUpdateStats
}: CharacterStatsViewProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <EditableStatField
        label="DEXTÉRITÉ"
        value={stats.dexterite}
        min={1}
        onSave={(value) => onUpdateStats({ dexterite: value })}
      />
      
      <EditableStatField
        label="CHANCE"
        value={stats.chance}
        min={0}
        onSave={(value) => onUpdateStats({ chance: value })}
      />
      
      <EditableStatField
        label="PV MAX"
        value={stats.pointsDeVieMax}
        min={1}
        onSave={(value) => onUpdateStats({ pointsDeVieMax: value })}
      />
      
      <EditableStatField
        label="PV ACTUELS"
        value={stats.pointsDeVieActuels}
        min={0}
        max={stats.pointsDeVieMax}
        variant="health"
        onSave={(value) => onUpdateStats({ pointsDeVieActuels: value })}
      />
    </div>
  );
}
```

```tsx
// app/characters/[id]/page.tsx
'use client';

import { useCharacter } from '@/src/presentation/hooks/useCharacter';
import CharacterStatsView from '@/app/components/character/CharacterStatsView';

export default function CharacterDetail({ params }: { params: { id: string } }) {
  const { character, stats, loading, error, updateStats } = useCharacter(params.id);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#1a140f] p-4">
        <div className="max-w-4xl mx-auto py-8">
          <p className="text-muted-light text-center py-8">Chargement...</p>
        </div>
      </main>
    );
  }

  if (error || !character || !stats) {
    return (
      <main className="min-h-screen bg-[#1a140f] p-4">
        <div className="max-w-4xl mx-auto py-8">
          <p className="text-red-400 text-center py-8">
            {error?.message || 'Personnage non trouvé'}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#1a140f] p-4">
      <div className="max-w-4xl mx-auto py-8 space-y-6">
        <h1 className="font-[var(--font-uncial)] text-3xl sm:text-4xl tracking-wider text-[#FFBF00] mb-2">
          {character.name}
        </h1>

        <div className="bg-[#2a1e17] glow-border rounded-lg p-6">
          <h2 className="font-[var(--font-uncial)] text-xl tracking-wide text-light mb-4">
            Caractéristiques
          </h2>
          <CharacterStatsView
            stats={stats}
            onUpdateStats={updateStats}
          />
        </div>
      </div>
    </main>
  );
}
```

---

## 📊 Comparaison

| Critère | Avant | Après |
|---------|-------|-------|
| **Lignes de code** | 180 lignes (1 fichier) | 60 + 40 + 30 lignes (3 fichiers réutilisables) |
| **useState** | 8 dans CharacterStats | 3 dans EditableStatField (réutilisable) |
| **Logique métier** | ❌ Dans le composant | ✅ Dans Character entity |
| **Validation** | ❌ Dans l'UI (alert) | ✅ Dans Stats.validate() |
| **Testabilité** | ❌ Difficile (mocker IndexedDB) | ✅ Facile (tests unitaires) |
| **Réutilisabilité** | ❌ Couplé à Character | ✅ EditableStatField générique |
| **Duplication** | ❌ 4x le même code | ✅ Aucune |
| **updatedAt** | ❌ Répété 4 fois | ✅ 1 seul endroit (toData) |

---

## ✅ Avantages de la Nouvelle Architecture

1. **Testabilité**
   ```typescript
   // Test unitaire de la logique métier (SANS React, SANS IndexedDB)
   describe('Character', () => {
     it('should update stats', () => {
       const character = Character.fromData(mockData);
       const updated = character.updateStats({ dexterite: 10 });
       expect(updated.getStats().dexterite).toBe(10);
     });

     it('should throw on invalid stats', () => {
       expect(() => {
         new Stats(-1, 5, 5, 20, 20);
       }).toThrow('La dextérité doit être >= 1');
     });
   });
   ```

2. **Réutilisabilité**
   - `EditableStatField` peut être utilisé partout (inventaire, armes, etc.)
   - Logique de validation centralisée

3. **Maintenabilité**
   - Changement de règle métier → 1 seul fichier (Character.ts)
   - Changement d'UI → 1 seul composant (EditableStatField)
   - Changement de stockage → 1 seul fichier (IndexedDBCharacterRepository)

4. **Lisibilité**
   - Composants courts et clairs
   - Responsabilités bien séparées

---

## 🚀 Migration Progressive

Vous pouvez migrer **un composant à la fois** :

### Étape 1 : CharacterStats (ce composant)
- ✅ Créer Character entity
- ✅ Créer CharacterService
- ✅ Créer useCharacter hook
- ✅ Refactoriser CharacterStats

### Étape 2 : CharacterInventory
- ✅ Réutiliser Character entity
- ✅ Ajouter méthodes inventory dans Character
- ✅ Refactoriser CharacterInventory

### Étape 3 : CombatInterface
- ✅ Créer Combat entity
- ✅ Créer CombatService
- ✅ Créer useCombat hook
- ✅ Refactoriser CombatInterface

---

**Prêt à commencer ?** On peut migrer CharacterStats ensemble !
