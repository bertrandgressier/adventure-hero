# Architecture - Adventure Tome

## Stack technique

### Frontend
- **Next.js 16** - Framework React avec App Router
- **React 19** - Bibliothèque UI
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Styling avec theming
- **shadcn/ui** - Composants UI

### State Management
- **Zustand 5.x** - State management avec vanilla store pattern
- **Slices Pattern** - Store modulaire divisé en slices thématiques
- **Immutabilité** - Updates avec `Record<string, T>` et spread operator

### PWA
- **Service Worker** - Cache et offline
- **Web App Manifest** - Configuration PWA
- **IndexedDB** - Stockage local structuré

## Structure du projet

```text
adventure-tome/
├── app/                           # Next.js App Router
│   ├── layout.tsx                 # Layout principal + metadata
│   ├── page.tsx                   # Page d'accueil
│   ├── manifest.ts                # PWA manifest
│   ├── globals.css                # Styles globaux + theme
│   │
│   ├── characters/                # Gestion des personnages
│   │   ├── layout.tsx            # Provider Zustand scoped
│   │   ├── page.tsx              # Liste des personnages
│   │   ├── new/
│   │   │   └── page.tsx          # Créer un personnage
│   │   └── [id]/
│   │       └── page.tsx          # Détail personnage
│   │
│   └── components/                # Composants Next.js legacy
│       ├── ui/                    # Composants shadcn/ui
│       ├── adventure/             # Combat, dice roller
│       ├── character/             # Character legacy components
│       ├── GoogleAnalytics.tsx
│       └── MusicPlayer.tsx
│
├── src/                           # Clean Architecture
│   ├── domain/                    # Couche métier (logique pure)
│   │   ├── entities/
│   │   │   ├── Character.ts      # Entité Character avec logique métier
│   │   │   └── Character.test.ts
│   │   │
│   │   ├── value-objects/
│   │   │   ├── Stats.ts          # Stats avec validation
│   │   │   ├── Stats.test.ts
│   │   │   └── Inventory.ts      # Inventory, Weapon types
│   │   │
│   │   ├── services/
│   │   │   ├── CombatService.ts  # Logique de combat pure
│   │   │   └── CombatService.test.ts
│   │   │
│   │   ├── repositories/
│   │   │   └── ICharacterRepository.ts  # Interface repository
│   │   │
│   │   └── types/
│   │       └── combat.ts         # Types combat
│   │
│   ├── application/               # Couche application (use cases)
│   │   └── services/
│   │       ├── CharacterService.ts      # Orchestration CRUD
│   │       └── CharacterService.test.ts
│   │
│   ├── infrastructure/            # Couche infrastructure (I/O)
│   │   ├── repositories/
│   │   │   └── IndexedDBCharacterRepository.ts  # Implémentation IndexedDB
│   │   │
│   │   ├── persistence/
│   │   │   └── indexeddb.ts      # Helpers IndexedDB
│   │   │
│   │   ├── dto/
│   │   │   └── CharacterDTO.ts   # Mapping DB <-> Domain
│   │   │
│   │   └── analytics/
│   │       ├── gtag.ts           # Google Analytics
│   │       └── tracking.ts
│   │
│   └── presentation/              # Couche présentation (UI)
│       ├── stores/
│       │   ├── characterStore.ts         # Store principal (combine slices)
│       │   ├── characterStore.test.ts
│       │   ├── createSelectors.ts        # Auto-selectors helper
│       │   │
│       │   └── slices/                   # Slices Pattern
│       │       ├── characterListSlice.ts     # Load, refresh, getters
│       │       ├── characterMutationSlice.ts # Create, delete
│       │       ├── characterStatsSlice.ts    # Update stats, damage, heal
│       │       ├── characterInventorySlice.ts # Inventory, weapons, boulons
│       │       └── characterMetadataSlice.ts # Name, notes, progress
│       │
│       ├── providers/
│       │   ├── character-store-provider.tsx  # Context provider
│       │   └── CharacterStoreProvider.test.tsx
│       │
│       ├── hooks/
│       │   └── useCharacter.ts   # Custom hook pour Zustand store
│       │
│       └── components/
│           ├── CharacterStats.tsx
│           ├── CharacterInventory.tsx
│           ├── CharacterProgress.tsx
│           ├── CharacterWeapon.tsx
│           └── EditableStatField.tsx
│
├── lib/                           # Legacy code (en cours de migration)
│   ├── storage/                   # DEPRECATED - use CharacterService
│   ├── game/
│   │   └── combat.ts             # DEPRECATED - use CombatService
│   ├── utils.ts
│   └── types/
│       ├── character.ts          # DEPRECATED - use domain entities
│       └── combat.ts             # DEPRECATED - use domain types
│
├── tests/
│   └── integration/
│       ├── character-flow.test.ts    # Tests E2E flux personnage
│       └── data-migration.test.ts    # Tests migration données
│
├── public/
│   ├── icons/                     # Icônes PWA
│   └── manifest.json              # Manifest statique
│
└── docs/                          # Documentation
    ├── ARCHITECTURE.md            # Ce fichier
    ├── FEATURES.md
    ├── CHARACTER_SHEET.md
    ├── COMBAT.md
    └── THEMING.md
```

## Modèles de données

### Character (Personnage)

```typescript
interface Character {
  id: string;
  name: string;
  book: string;
  talent: string;  // Artisan, Explorateur, Guerrier, Magicien, Négociant, Voleur
  createdAt: string;
  updatedAt: string;
  
  // Caractéristiques
  stats: {
    dexterite: number;         // Score fixe (7 par défaut)
    chance: number;            // Score actuel
    chanceInitiale: number;    // Score de départ
    pointsDeVieMax: number;    // Maximum de PV (2d6 × 4)
    pointsDeVieActuels: number;// PV actuels
  };
  
  // Inventaire
  inventory: {
    boulons: number;           // Monnaie
    weapon?: {                 // Arme équipée (une seule)
      name: string;
      attackPoints: number;    // Points de dommage
    };
    items: Array<{             // Objets (hors armes)
      name: string;
      possessed: boolean;
      type?: 'item' | 'special';
    }>;
  };
  
  // Progression
  progress: {
    currentParagraph: number;
    history: number[];
    lastSaved: Date;
  };
  
  // Notes
  notes: string;
}
```

### Combat

```typescript
interface Enemy {
  name: string;
  dexterite: number;
  endurance: number;
  enduranceMax: number;
  attackPoints: number; // Points de dommage de l'arme
}

interface CombatRound {
  roundNumber: number;
  attacker: 'player' | 'enemy';
  
  // Test pour toucher
  hitDiceRoll: number;           // 2d6
  hitSuccess: boolean;           // hitDiceRoll ≤ DEXTÉRITÉ
  
  // Si touché, calcul des dégâts
  damageDiceRoll?: number;       // 1d6
  weaponDamage?: number;         // Points de dommage de l'arme
  totalDamage?: number;          // 1 + 1d6 + weaponDamage
  
  playerEnduranceAfter: number;
  enemyEnduranceAfter: number;
}

interface CombatState {
  enemy: Enemy;
  rounds: CombatRound[];
  playerEndurance: number;
  enemyEndurance: number;
  status: 'setup' | 'ongoing' | 'victory' | 'defeat';
  nextAttacker: 'player' | 'enemy';
}

type CombatMode = 'auto' | 'manual';
```

## Flux de données

### Architecture Clean - Flux de données

```text
User Action → Component (Presentation)
    ↓
useCharacter Hook → Zustand Store
    ↓
CharacterService (Application)
    ↓
IndexedDBRepository (Infrastructure) → IndexedDB
    ↓
Return Domain Entity
    ↓
Update Zustand Store → Re-render Component
```

### Exemple : Mise à jour d'une stat

```text
1. User clicks "Save" in EditableStatField
2. Component calls updateStats from useCharacter hook
3. Hook dispatches to Zustand characterStatsSlice
4. Slice calls CharacterService.updateCharacterStats()
5. Service validates with Stats Value Object
6. Service calls repository.update(character)
7. Repository saves to IndexedDB
8. Repository returns updated Character entity
9. Service returns to slice
10. Slice updates store state (immutable Record update)
11. Component re-renders with new data
```

### Combat

```text
Start Combat → Initialize Combat State (mode, first attacker)
    ↓
Roll to Hit (2d6) → Check if ≤ DEXTÉRITÉ
    ↓
If Hit → Roll Damage (1d6) → Calculate Total (1 + 1d6 + weapon)
    ↓
Apply Damage → Update Endurance
    ↓
Alternate Attacker → Next Round
    ↓
Check Victory/Defeat (PV = 0) → End or Continue
    ↓
Save Updated Character → Show End Modal
```

## Gestion d'état

### Zustand avec Slices Pattern

- **Store centralisé** : `characterStore.ts` combine 5 slices thématiques
- **Vanilla store** : `zustand/vanilla` pour compatibilité SSR Next.js
- **Provider scoped** : Context limité à `/characters` routes
- **Immutabilité** : `Record<string, Character>` avec spread operator (pas de `Map`)
- **Auto-selectors** : `createSelectors()` helper pour accès type-safe
- **Persistence** : Auto-save vers IndexedDB via `CharacterService`

### Slices (5 modules)

1. **characterListSlice** : État + chargement (`characters`, `isLoading`, `hasInitialLoad`, `loadAll`, `loadOne`)
2. **characterMutationSlice** : CRUD (`createCharacter`, `deleteCharacter`)
3. **characterStatsSlice** : Stats (`updateStats`, `applyDamage`, `heal`)
4. **characterInventorySlice** : Inventaire (`equipWeapon`, `addItem`, `toggleItem`, `addBoulons`)
5. **characterMetadataSlice** : Métadonnées (`updateName`, `updateNotes`, `goToParagraph`)

### Tests

- **Unit tests** : Test store directement avec `store.getState()` et `store.setState()`
- **Component tests** : Test avec `CharacterStoreProvider` wrapper
- **Mocks auto-reset** : `__mocks__/zustand/vanilla.ts` réinitialise après chaque test
- **109 tests** : 100% de couverture sur Domain, Application, Infrastructure, Presentation

## Performance

### Optimisations

- Next.js App Router avec RSC
- Code splitting automatique
- Lazy loading des composants
- Optimisation des images
- Service Worker pour cache
- IndexedDB pour stockage performant

## Sécurité

### Données locales

- Validation côté client
- Sanitization des inputs
- Pas de données sensibles
- Backup recommandé (export/import)

## Accessibilité

### ARIA et sémantique

- Labels appropriés
- Navigation au clavier
- Contraste des couleurs
- Tailles de touch targets (44x44px minimum)
- Screen reader support
