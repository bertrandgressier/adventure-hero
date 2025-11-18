# State Management avec Zustand

## Vue d'ensemble

Adventure Tome utilise **Zustand 5.0.8** pour la gestion d'état centralisée des personnages.

### Pourquoi Zustand ?

- **Ultra-léger** : 1.2 KB, pas de boilerplate
- **Performance** : Re-renders optimisés avec sélecteurs
- **Cache centralisé** : Plus besoin de `loadCharacter()` dans chaque page
- **DevTools** : Débogage via Redux DevTools
- **Persistence automatique** : Sauvegarde synchrone dans IndexedDB

## Architecture

```
┌─────────────────────────────────────────────────┐
│              React Components                    │
│   (pages, forms, stats displays...)             │
└───────────────┬─────────────────────────────────┘
                │ useCharacterStore()
                │ useCharacter(id)
┌───────────────▼─────────────────────────────────┐
│          Zustand Store (Cache)                   │
│   Map<string, Character> + actions               │
│   - loadAll(), createCharacter()                │
│   - updateStats(), equipWeapon(), etc.          │
└───────────────┬─────────────────────────────────┘
                │ CharacterService
┌───────────────▼─────────────────────────────────┐
│        Application Service Layer                 │
│   Business logic + validation                    │
└───────────────┬─────────────────────────────────┘
                │
┌───────────────▼─────────────────────────────────┐
│           IndexedDB Repository                   │
│   Persistence (create, update, delete)          │
└─────────────────────────────────────────────────┘
```

## Fichiers principaux

### 1. Store (`src/presentation/stores/characterStore.ts`)

**Responsabilité** : État global et cache des personnages

```typescript
interface CharacterStore {
  // State
  characters: Map<string, Character>;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadAll: () => Promise<void>;
  loadOne: (id: string) => Promise<void>;
  createCharacter: (data: CreateCharacterData) => Promise<Character>;
  deleteCharacter: (id: string) => Promise<void>;
  
  // Mutations (20+ actions)
  updateStats: (id: string, stats: Partial<StatsData>) => Promise<void>;
  equipWeapon: (id: string, weapon: Weapon | null) => Promise<void>;
  applyDamage: (id: string, amount: number) => Promise<void>;
  // ... etc
}
```

**Fonctionnement** :
- Cache en mémoire avec `Map<string, Character>` pour O(1) lookups
- Chaque action **met à jour le cache** puis **persiste dans IndexedDB**
- Pattern : `update cache → save to DB`

### 2. Hook (`src/presentation/hooks/useCharacter.ts`)

**Responsabilité** : Interface React compatible avec ancien code

```typescript
export function useCharacter(characterId: string | null) {
  // Sélecteurs Zustand
  const character = useCharacterStore(state => state.getCharacter(characterId));
  const updateStats = useCharacterStore(state => state.updateStats);
  
  // Auto-load si pas dans cache
  useEffect(() => {
    if (characterId && !character && !isLoading) {
      storeLoadOne(characterId);
    }
  }, [characterId, character]);

  // Wrappers qui bind l'ID
  return {
    character,
    updateStats: (stats) => updateStats(characterId, stats)
  };
}
```

**Avantages** :
- API identique à l'ancienne version (useState/useEffect)
- Zéro breaking change pour les composants existants
- Charge automatiquement depuis le cache (instantané)

### 3. Initializer (`src/presentation/components/StoreInitializer.tsx`)

**Responsabilité** : Charger tous les personnages au démarrage

```typescript
export function StoreInitializer() {
  const loadAll = useCharacterStore(state => state.loadAll);
  
  useEffect(() => {
    loadAll(); // Charge tous les personnages dans le cache
  }, []);

  return null;
}
```

Ajouté dans `app/layout.tsx` :
```tsx
<StoreInitializer />
{children}
```

## Garanties de persistence

### Option A implémentée : Sauvegarde synchrone

Chaque mutation attend la sauvegarde IndexedDB avant de retourner :

```typescript
updateStats: async (id, stats) => {
  const updated = await CharacterService.updateCharacterStats(id, stats);
  set(state => ({
    characters: new Map(state.characters).set(id, updated)
  }));
  // ✅ La sauvegarde IndexedDB est terminée ici
}
```

**Garantie** : Si l'action termine sans erreur, les données sont dans IndexedDB.

**Alternative non utilisée** :
- Option B : Sauvegarde asynchrone (fire-and-forget)
- Option C : Debounce (attente 1-2 secondes)

## Utilisation

### Dans un composant page (exemple : `app/characters/[id]/page.tsx`)

**AVANT (avec useState)** :
```typescript
const [character, setCharacter] = useState(null);

useEffect(() => {
  loadCharacter(); // Requête IndexedDB à chaque montage
}, [id]);

const loadCharacter = async () => {
  const service = getService();
  const char = await service.getCharacter(id); // ⏱️ Lent
  setCharacter(char.toData());
};

const handleUpdateStats = async (stats) => {
  await service.updateCharacterStats(id, stats);
  await loadCharacter(); // ⏱️ Re-fetch complet
};
```

**APRÈS (avec Zustand)** :
```typescript
const character = useCharacterStore(state => state.getCharacter(id)); // ⚡ Cache
const updateStats = useCharacterStore(state => state.updateStats);

const handleUpdateStats = async (stats) => {
  await updateStats(id, stats); // ✅ Cache auto-mis à jour
};
```

**Gains** :
- ❌ Plus de `loadCharacter()` partout
- ❌ Plus de re-fetch après chaque mutation
- ✅ Réactivité instantanée (cache)
- ✅ Persistence garantie (sync save)

### Dans un composant enfant (exemple : `CharacterStats.tsx`)

**Pattern recommandé** : Hook `useCharacter`

```typescript
import { useCharacter } from '@/src/presentation/hooks/useCharacter';

export function CharacterStats({ characterId }: { characterId: string }) {
  const { character, updateStats, applyDamage } = useCharacter(characterId);

  if (!character) return <div>Chargement...</div>;

  return (
    <div>
      <p>PV : {character.stats.currentHealth}</p>
      <button onClick={() => applyDamage(2)}>-2 PV</button>
    </div>
  );
}
```

**Alternative** : Sélecteurs directs

```typescript
const character = useCharacterStore(state => state.getCharacter(id));
const updateStats = useCharacterStore(state => state.updateStats);

// Wrapper manuel si besoin
const handleUpdate = (stats) => updateStats(id, stats);
```

## DevTools

Activer Redux DevTools :

1. Installer l'extension Chrome/Firefox : [Redux DevTools](https://github.com/reduxjs/redux-devtools)
2. Ouvrir les DevTools → onglet "Redux"
3. Observer les actions :
   - `loadAll`
   - `updateStats`
   - `equipWeapon`
   - etc.

**Désactiver en production** (déjà fait) :
```typescript
const useCharacterStore = create<CharacterStore>()(
  devtools(
    (set, get) => ({ /* ... */ }),
    { enabled: process.env.NODE_ENV === 'development' }
  )
);
```

## Performance

### Optimisations

1. **Sélecteurs précis** : Re-render uniquement si la valeur change
   ```typescript
   // ❌ Mauvais : re-render à chaque mutation
   const store = useCharacterStore();
   
   // ✅ Bon : re-render uniquement si character change
   const character = useCharacterStore(state => state.getCharacter(id));
   ```

2. **Map lookups** : O(1) pour `getCharacter(id)`
   ```typescript
   getCharacter: (id) => get().characters.get(id) || null
   ```

3. **Batch updates** : Zustand regroupe automatiquement les updates

### Métriques

- Taille bundle : +1.2 KB (zustand)
- Chargement initial : 1 requête IndexedDB (`loadAll`)
- Mutations : 0 re-fetch (cache auto-mis à jour)
- Re-renders : Optimisés par sélecteurs

## Migration d'un composant existant

### Checklist

1. **Remplacer les imports** :
   ```diff
   - import { CharacterService } from '@/src/application/services/CharacterService';
   - import { IndexedDBCharacterRepository } from '@/src/infrastructure/repositories/IndexedDBCharacterRepository';
   + import { useCharacterStore } from '@/src/presentation/stores/characterStore';
   ```

2. **Supprimer le service singleton** :
   ```diff
   - let serviceInstance: CharacterService | null = null;
   - function getService() { /* ... */ }
   ```

3. **Remplacer useState par store** :
   ```diff
   - const [character, setCharacter] = useState(null);
   + const character = useCharacterStore(state => state.getCharacter(id));
   ```

4. **Supprimer useEffect de chargement** :
   ```diff
   - useEffect(() => {
   -   loadCharacter();
   - }, [id]);
   - 
   - const loadCharacter = async () => { /* ... */ };
   ```

5. **Remplacer les appels service par actions** :
   ```diff
   - const handleUpdate = async () => {
   -   await getService().updateStats(id, stats);
   -   await loadCharacter(); // Re-fetch
   - };
   + const updateStats = useCharacterStore(state => state.updateStats);
   + const handleUpdate = async () => {
   +   await updateStats(id, stats); // Cache auto mis à jour
   + };
   ```

6. **Supprimer les props `onUpdate`** (devenues inutiles) :
   ```diff
   - <CharacterStats characterId={id} onUpdate={loadCharacter} />
   + <CharacterStats characterId={id} />
   ```

## Tests

### Tests existants

Les 83 tests continuent de passer :
- Tests de domaine : ✅ (aucun changement)
- Tests de services : ✅ (aucun changement)
- Tests d'intégration : ✅ (aucun changement)

**Raison** : Zustand est une couche présentation, le domaine/application reste inchangé.

### Tester le store (optionnel)

```typescript
import { renderHook, act } from '@testing-library/react';
import { useCharacterStore } from '@/src/presentation/stores/characterStore';

test('createCharacter ajoute au cache', async () => {
  const { result } = renderHook(() => useCharacterStore());
  
  await act(async () => {
    await result.current.createCharacter({
      name: 'Test',
      book: 'harpe-4-saisons',
      talent: 'Druide'
    });
  });
  
  expect(result.current.characters.size).toBe(1);
});
```

## Troubleshooting

### Le personnage ne charge pas

**Symptôme** : `character` reste `null`

**Causes possibles** :
1. Store pas initialisé → Vérifier `<StoreInitializer />` dans `layout.tsx`
2. ID invalide → Vérifier `characterId` passé au hook
3. Erreur IndexedDB → Consulter `store.error`

**Debug** :
```typescript
const characters = useCharacterStore(state => state.characters);
const error = useCharacterStore(state => state.error);
console.log('Characters in cache:', Array.from(characters.keys()));
console.log('Error:', error);
```

### Les mutations ne persistent pas

**Symptôme** : Changements disparaissent au refresh

**Causes possibles** :
1. Action lancée mais erreur silencieuse → Ajouter `try/catch` + `console.error`
2. IndexedDB bloqué par navigateur → Tester en mode incognito
3. Quota dépassé → Vérifier DevTools → Application → Storage

**Debug** :
```typescript
await updateStats(id, stats).catch(err => {
  console.error('Failed to persist:', err);
});
```

### Re-renders excessifs

**Symptôme** : Composant re-render à chaque action

**Cause** : Sélecteur trop large

**Solution** :
```diff
- const store = useCharacterStore(); // ❌ Re-render sur tout changement
+ const character = useCharacterStore(state => state.getCharacter(id)); // ✅ Re-render uniquement si character change
```

## Références

- [Zustand Docs](https://docs.pmnd.rs/zustand)
- [Clean Architecture avec Zustand](https://dev.to/ivandotv/zustand-and-react-context-api-in-a-typescript-application-5h54)
- [Performance Zustand](https://github.com/pmndrs/zustand#performance)
