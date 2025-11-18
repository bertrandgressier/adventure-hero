# Audit d'Architecture - Adventure Tome

**Date:** 18 Novembre 2025  
**Version du projet:** 1.7.0

## 📊 Résumé Exécutif

### Points Positifs ✅
- Logique métier bien isolée dans `/lib/game/`
- Types TypeScript bien définis
- Séparation claire entre stockage et logique
- Pas de dépendance externe lourde (Redux, etc.)
- Code lisible et maintenable

### Points d'Amélioration 🔧
- **Couplage fort** entre composants et logique de persistance
- **State management dispersé** (multiple useState dans chaque composant)
- **Logique de présentation mélangée** avec la logique métier dans les composants
- **Duplication de code** pour les opérations CRUD
- **Absence de couche de services** centralisée
- **Tests difficiles** à écrire (composants trop chargés)

---

## 🏗️ Architecture Actuelle

### Structure des Fichiers

```
adventure-tome/
├── app/                          # Présentation (UI)
│   ├── components/              # Composants React
│   ├── characters/              # Pages personnages
│   └── [...]
├── lib/                          # Logique métier + Infra
│   ├── game/                    # ✅ Logique pure (combat, dés)
│   ├── storage/                 # ⚠️ Infrastructure (IndexedDB)
│   ├── types/                   # ✅ Modèles de données
│   └── utils/                   # Utilitaires
└── public/                       # Assets statiques
```

### Flux de Données Actuel

```
Composant UI
    ↓
  useState/useEffect (État local)
    ↓
  Appel direct à storage/ (IndexedDB)
    ↓
  Mise à jour de l'état local
    ↓
  Re-render du composant
```

### Problèmes Identifiés

#### 1. **Couplage Fort Présentation/Infrastructure**

```tsx
// ❌ PROBLÈME : CharacterStats.tsx
const handleUpdateStat = async (updates: Partial<Character>) => {
  const updatedCharacter = {
    ...character,
    ...updates,
    updatedAt: new Date().toISOString()  // Logique métier dans UI
  };
  await onUpdate(updatedCharacter);  // Dépendance directe à la persistance
};
```

**Conséquences:**
- Difficile de changer IndexedDB pour une autre solution
- Impossible de tester la logique sans mocker IndexedDB
- Duplication de `updatedAt: new Date().toISOString()` partout

#### 2. **État Dispersé (useState Partout)**

```tsx
// ❌ PROBLÈME : CharacterDetail page
const [character, setCharacter] = useState<Character | null>(null);
const [loading, setLoading] = useState(true);
const [editingName, setEditingName] = useState(false);
const [showWeaponModal, setShowWeaponModal] = useState(false);
const [showItemModal, setShowItemModal] = useState(false);
const [showCombatSetup, setShowCombatSetup] = useState(false);
const [currentEnemy, setCurrentEnemy] = useState<Enemy | null>(null);
// ... 13 useState au total dans ce composant !
```

**Conséquences:**
- État difficile à suivre
- Synchronisation manuelle entre états
- Re-renders excessifs

#### 3. **Logique Métier dans les Composants**

```tsx
// ❌ PROBLÈME : CharacterInventory.tsx
const handleToggleItem = async (index: number) => {
  const updatedItems = character.inventory.items.map((item, i) =>
    i === index ? { ...item, possessed: !item.possessed } : item
  );

  const updatedCharacter = {
    ...character,
    inventory: {
      ...character.inventory,
      items: updatedItems
    },
    updatedAt: new Date().toISOString()  // Répété partout
  };

  await onUpdate(updatedCharacter);
};
```

**Problèmes:**
- Transformation de données dans le composant
- Responsabilité unique violée (UI + logique)
- Code difficile à tester unitairement

#### 4. **Duplication de Code**

La logique de mise à jour de personnage est dupliquée dans :
- `CharacterStats.tsx` (x4 fonctions)
- `CharacterWeapon.tsx` (x3 fonctions)
- `CharacterInventory.tsx` (x2 fonctions)
- `CharacterProgress.tsx`
- `CharacterDetail.tsx`

---

## 🎯 Architecture Recommandée : Clean Architecture Adaptée

### Pourquoi Clean Architecture avec Next.js 16 ?

**✅ OUI, c'est totalement compatible !**

Next.js 16 avec App Router s'adapte parfaitement à Clean Architecture car :
- Server Components = Couche de présentation légère
- Client Components = UI interactive isolée
- Pas de contraintes sur l'organisation de `/lib`

### Structure Proposée

```
adventure-tome/
├── app/                                    # 🎨 PRESENTATION LAYER
│   ├── characters/
│   │   ├── [id]/
│   │   │   └── page.tsx                   # Page (orchestration)
│   │   └── page.tsx
│   └── components/
│       ├── character/                      # Composants UI PURS
│       │   ├── CharacterStatsView.tsx     # Affichage seul
│       │   ├── CharacterStatsForm.tsx     # Formulaire seul
│       │   └── [...]
│       └── ui/                             # shadcn/ui
│
├── src/                                    # 📦 DOMAIN + APPLICATION + INFRA
│   ├── domain/                            # 🔵 DOMAIN LAYER (Logique métier pure)
│   │   ├── entities/                      # Entités métier
│   │   │   ├── Character.ts               # Classe Character avec méthodes
│   │   │   ├── Combat.ts                  # Logique combat
│   │   │   └── Inventory.ts               # Logique inventaire
│   │   ├── value-objects/                 # Objets valeur
│   │   │   ├── Stats.ts
│   │   │   └── Dice.ts
│   │   └── repositories/                  # Interfaces (ports)
│   │       └── ICharacterRepository.ts
│   │
│   ├── application/                       # 🟢 APPLICATION LAYER (Use cases)
│   │   ├── use-cases/
│   │   │   ├── character/
│   │   │   │   ├── CreateCharacter.ts
│   │   │   │   ├── UpdateCharacterStats.ts
│   │   │   │   ├── DeleteCharacter.ts
│   │   │   │   └── GetCharacter.ts
│   │   │   └── combat/
│   │   │       ├── StartCombat.ts
│   │   │       └── ResolveCombatRound.ts
│   │   └── services/                      # Services applicatifs
│   │       ├── CharacterService.ts
│   │       └── CombatService.ts
│   │
│   ├── infrastructure/                    # 🔴 INFRASTRUCTURE LAYER
│   │   ├── persistence/
│   │   │   ├── IndexedDBCharacterRepository.ts  # Implémentation
│   │   │   └── db.ts
│   │   └── analytics/
│   │       └── GoogleAnalyticsService.ts
│   │
│   └── presentation/                      # 🎨 PRESENTATION LOGIC
│       ├── hooks/                         # Custom hooks (pont UI ↔ Application)
│       │   ├── useCharacter.ts
│       │   ├── useCharacterList.ts
│       │   └── useCombat.ts
│       ├── view-models/                   # ViewModels (état UI)
│       │   ├── CharacterViewModel.ts
│       │   └── CombatViewModel.ts
│       └── stores/                        # State management (optionnel)
│           └── characterStore.ts
│
└── lib/                                    # Utils génériques
    └── utils.ts
```

### Couches et Responsabilités

#### 1. **Domain Layer** (Cœur métier - Aucune dépendance externe)

```typescript
// src/domain/entities/Character.ts
export class Character {
  constructor(
    public readonly id: string,
    public name: string,
    private stats: Stats,
    private inventory: Inventory,
    // ...
  ) {}

  // Logique métier pure
  updateStats(newStats: Partial<StatsData>): Character {
    const updatedStats = this.stats.update(newStats);
    return new Character(
      this.id,
      this.name,
      updatedStats,
      this.inventory,
      // ...
    );
  }

  addWeapon(weapon: Weapon): Character {
    const updatedInventory = this.inventory.equipWeapon(weapon);
    return new Character(
      this.id,
      this.name,
      this.stats,
      updatedInventory,
      // ...
    );
  }

  isDead(): boolean {
    return this.stats.currentHealth <= 0;
  }

  // Retourne les données pour la persistance
  toData(): CharacterData {
    return {
      id: this.id,
      name: this.name,
      stats: this.stats.toData(),
      inventory: this.inventory.toData(),
      // ...
    };
  }

  // Factory method
  static fromData(data: CharacterData): Character {
    return new Character(
      data.id,
      data.name,
      Stats.fromData(data.stats),
      Inventory.fromData(data.inventory),
      // ...
    );
  }
}
```

```typescript
// src/domain/repositories/ICharacterRepository.ts
export interface ICharacterRepository {
  save(character: Character): Promise<void>;
  findById(id: string): Promise<Character | null>;
  findAll(): Promise<Character[]>;
  delete(id: string): Promise<void>;
}
```

#### 2. **Application Layer** (Use Cases)

```typescript
// src/application/use-cases/character/UpdateCharacterStats.ts
export class UpdateCharacterStats {
  constructor(
    private characterRepository: ICharacterRepository
  ) {}

  async execute(
    characterId: string,
    statsUpdate: Partial<StatsData>
  ): Promise<Character> {
    // 1. Récupérer le personnage
    const character = await this.characterRepository.findById(characterId);
    if (!character) {
      throw new Error(`Character ${characterId} not found`);
    }

    // 2. Appliquer la logique métier
    const updatedCharacter = character.updateStats(statsUpdate);

    // 3. Persister
    await this.characterRepository.save(updatedCharacter);

    // 4. Retourner le résultat
    return updatedCharacter;
  }
}
```

```typescript
// src/application/services/CharacterService.ts
export class CharacterService {
  constructor(
    private repository: ICharacterRepository
  ) {}

  // API de haut niveau pour l'UI
  async updateCharacterStats(
    id: string,
    stats: Partial<StatsData>
  ): Promise<Character> {
    const useCase = new UpdateCharacterStats(this.repository);
    return useCase.execute(id, stats);
  }

  async getCharacter(id: string): Promise<Character | null> {
    return this.repository.findById(id);
  }

  async getAllCharacters(): Promise<Character[]> {
    return this.repository.findAll();
  }

  async deleteCharacter(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
```

#### 3. **Infrastructure Layer** (Implémentation)

```typescript
// src/infrastructure/persistence/IndexedDBCharacterRepository.ts
export class IndexedDBCharacterRepository implements ICharacterRepository {
  async save(character: Character): Promise<void> {
    const db = await getDB();
    const data = character.toData();
    await db.put('characters', {
      ...data,
      updatedAt: new Date().toISOString()  // ✅ SEUL endroit où on ajoute updatedAt
    });
  }

  async findById(id: string): Promise<Character | null> {
    const db = await getDB();
    const data = await db.get('characters', id);
    return data ? Character.fromData(data) : null;
  }

  async findAll(): Promise<Character[]> {
    const db = await getDB();
    const dataArray = await db.getAll('characters');
    return dataArray.map(data => Character.fromData(data));
  }

  async delete(id: string): Promise<void> {
    const db = await getDB();
    await db.delete('characters', id);
  }
}
```

#### 4. **Presentation Layer** (Hooks + ViewModels)

```typescript
// src/presentation/hooks/useCharacter.ts
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
      const updated = await characterService.updateCharacterStats(id, stats);
      setCharacter(updated);
    } catch (err) {
      setError(err as Error);
    }
  };

  const addWeapon = async (weapon: WeaponData) => {
    if (!character) return;
    
    try {
      const updated = character.addWeapon(Weapon.fromData(weapon));
      await characterService.repository.save(updated);
      setCharacter(updated);
    } catch (err) {
      setError(err as Error);
    }
  };

  return {
    character,
    loading,
    error,
    updateStats,
    addWeapon,
    reload: loadCharacter
  };
}
```

```typescript
// app/characters/[id]/page.tsx
'use client';

import { useCharacter } from '@/src/presentation/hooks/useCharacter';
import CharacterStatsView from '@/app/components/character/CharacterStatsView';

export default function CharacterDetail({ params }: { params: { id: string } }) {
  const { character, loading, updateStats, addWeapon } = useCharacter(params.id);

  if (loading) return <div>Chargement...</div>;
  if (!character) return <div>Personnage non trouvé</div>;

  return (
    <main>
      <CharacterStatsView
        stats={character.stats.toData()}
        onUpdate={updateStats}  // ✅ Simple callback, pas de logique
      />
    </main>
  );
}
```

---

## 🔄 State Management : Est-ce Nécessaire ?

### Option 1 : **Zustand** (Recommandé pour ce projet)

**Pourquoi Zustand ?**
- ✅ Léger (1.2 KB gzipped)
- ✅ Simple, pas de boilerplate
- ✅ Compatible React 19
- ✅ Supporte les Server Components

```typescript
// src/presentation/stores/characterStore.ts
import { create } from 'zustand';
import { CharacterService } from '@/src/application/services/CharacterService';

interface CharacterStore {
  characters: Map<string, Character>;
  loading: boolean;
  
  // Actions
  loadCharacter: (id: string) => Promise<void>;
  updateCharacterStats: (id: string, stats: Partial<StatsData>) => Promise<void>;
  deleteCharacter: (id: string) => Promise<void>;
}

export const useCharacterStore = create<CharacterStore>((set, get) => ({
  characters: new Map(),
  loading: false,

  loadCharacter: async (id: string) => {
    set({ loading: true });
    const character = await characterService.getCharacter(id);
    if (character) {
      set(state => ({
        characters: new Map(state.characters).set(id, character),
        loading: false
      }));
    }
  },

  updateCharacterStats: async (id: string, stats: Partial<StatsData>) => {
    const updated = await characterService.updateCharacterStats(id, stats);
    set(state => ({
      characters: new Map(state.characters).set(id, updated)
    }));
  },

  deleteCharacter: async (id: string) => {
    await characterService.deleteCharacter(id);
    set(state => {
      const newMap = new Map(state.characters);
      newMap.delete(id);
      return { characters: newMap };
    });
  }
}));
```

**Usage dans un composant:**

```tsx
// app/characters/[id]/page.tsx
'use client';

import { useCharacterStore } from '@/src/presentation/stores/characterStore';

export default function CharacterDetail({ params }: { params: { id: string } }) {
  const character = useCharacterStore(state => state.characters.get(params.id));
  const updateStats = useCharacterStore(state => state.updateCharacterStats);
  const loading = useCharacterStore(state => state.loading);

  useEffect(() => {
    useCharacterStore.getState().loadCharacter(params.id);
  }, [params.id]);

  // Composant devient TRÈS simple
  if (loading) return <div>Chargement...</div>;
  if (!character) return <div>Personnage non trouvé</div>;

  return (
    <CharacterStatsView
      stats={character.stats.toData()}
      onUpdate={(stats) => updateStats(params.id, stats)}
    />
  );
}
```

### Option 2 : **Custom Hooks** (Solution actuelle améliorée)

Si vous ne voulez **PAS** de state management externe, gardez des hooks mais mieux structurés :

```typescript
// src/presentation/hooks/useCharacter.ts
// (Voir code plus haut - déjà montré)
```

**Avantages:**
- ✅ Pas de dépendance externe
- ✅ Simple pour un petit projet

**Inconvénients:**
- ❌ État dupliqué si le même personnage est affiché à plusieurs endroits
- ❌ Pas de cache centralisé

### Option 3 : **React Context** (Non recommandé)

❌ **À ÉVITER** car :
- Re-renders excessifs
- Complexe à structure
- Performance médiocre avec de nombreuses données

---

## 📋 Plan de Migration

### Phase 1 : Fondations (1-2 jours)

1. **Créer la structure de dossiers**
   ```bash
   mkdir -p src/{domain,application,infrastructure,presentation}/{entities,use-cases,persistence,hooks}
   ```

2. **Migrer les types vers des entités**
   - `lib/types/character.ts` → `src/domain/entities/Character.ts`
   - Ajouter les méthodes métier

3. **Créer les interfaces (ports)**
   - `src/domain/repositories/ICharacterRepository.ts`

### Phase 2 : Application Layer (2-3 jours)

4. **Créer les services**
   - `src/application/services/CharacterService.ts`
   - `src/application/services/CombatService.ts`

5. **Implémenter les use cases critiques**
   - `UpdateCharacterStats`
   - `CreateCharacter`
   - `DeleteCharacter`

### Phase 3 : Infrastructure (1 jour)

6. **Adapter le code existant**
   - `lib/storage/characters.ts` → `src/infrastructure/persistence/IndexedDBCharacterRepository.ts`

### Phase 4 : Presentation (2-3 jours)

7. **Créer les hooks custom**
   - `useCharacter`
   - `useCharacterList`
   - `useCombat`

8. **Refactoriser les composants UI**
   - Extraire la logique vers les hooks
   - Composants deviennent "dumb" (présentation pure)

### Phase 5 : State Management (Optionnel, 1 jour)

9. **Installer Zustand**
   ```bash
   pnpm add zustand
   ```

10. **Créer les stores**
    - `characterStore.ts`
    - `combatStore.ts`

---

## 🎯 Recommandations Finales

### Architecture Recommandée

**✅ Clean Architecture Légère avec Zustand**

**Pourquoi ?**
1. **Séparation claire** : Logique métier isolée, facile à tester
2. **Flexible** : Facile de changer IndexedDB pour LocalStorage ou une API
3. **Maintenable** : Code organisé par domaine, pas par type de fichier
4. **Performant** : Zustand évite les re-renders inutiles
5. **Compatible Next.js 16** : Aucune contrainte, architecture standard

### Structure Minimale Recommandée (Si pas le temps pour Clean Archi complète)

```
adventure-tome/
├── app/                          # UI uniquement
│   └── components/              # Composants "dumb"
├── src/
│   ├── domain/                  # Entités + logique métier
│   │   └── Character.ts
│   ├── services/                # Services (pont entre UI et data)
│   │   ├── CharacterService.ts
│   │   └── CombatService.ts
│   ├── repositories/            # Interfaces
│   │   └── ICharacterRepository.ts
│   └── infrastructure/          # Implémentations
│       └── IndexedDBCharacterRepository.ts
└── hooks/                        # Custom hooks
    └── useCharacter.ts
```

### Checklist d'Amélioration Immédiate (Sans Refacto Complète)

Si vous voulez améliorer **progressivement** sans tout refactoriser :

1. ✅ **Créer un `CharacterService.ts`**
   - Centraliser toutes les opérations CRUD
   - Remplacer les appels directs à `storage/characters.ts`

2. ✅ **Extraire la logique métier des composants**
   - Créer des fonctions utilitaires dans `lib/game/character.ts`
   - Exemple : `updateCharacterStats(character, newStats)`

3. ✅ **Créer des hooks custom**
   - `useCharacter(id)` au lieu de `useState` + `useEffect` partout
   - `useCharacterList()` pour la liste

4. ✅ **Ajouter Zustand** (optionnel mais recommandé)
   - Cache centralisé
   - Moins de props drilling

5. ✅ **Simplifier les composants**
   - Composants = affichage + callbacks
   - Pas de transformation de données

---

## 📚 Ressources

- [Clean Architecture by Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Zustand Documentation](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [Next.js 16 App Router Patterns](https://nextjs.org/docs/app/building-your-application/routing)
- [Hexagonal Architecture in TypeScript](https://herbertograca.com/2017/11/16/explicit-architecture-01-ddd-hexagonal-onion-clean-cqrs-how-i-put-it-all-together/)

---

## 🚀 Prochaines Étapes

1. **Décider du niveau de refactorisation** (complète vs progressive)
2. **Choisir le state management** (Zustand vs Custom Hooks)
3. **Commencer par Phase 1** (créer la structure)
4. **Migrer un composant** en mode pilote (ex: CharacterStats)
5. **Valider l'approche** avant de migrer le reste

---

**Questions ?** Besoin d'aide pour implémenter une partie spécifique ?
