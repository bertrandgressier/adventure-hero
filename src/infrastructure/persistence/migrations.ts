/**
 * Data Migration System
 * 
 * Inspired by Zustand persist middleware versioning pattern.
 * Each character has a version field to track data structure evolution.
 * 
 * When adding new fields to Character:
 * 1. Increment CURRENT_VERSION
 * 2. Add migration in migrations array
 * 3. Provide default values for backward compatibility
 * 4. Test in data-migration.test.ts
 */

export const CURRENT_VERSION = 5;

/**
 * Migration interface
 * Each migration transforms data from version N to version N+1
 */
export interface Migration {
  version: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  migrate: (data: any) => any;
}

/**
 * Registry of all migrations (chronological order)
 * 
 * Migration v1 → v2: Add gameMode and version fields
 * - Legacy characters (no version field) get gameMode='mortal' (preserve current behavior)
 * - Add version=2 to track migration
 * 
 * Migration v2 → v3: Add optional constitution field to stats
 * - New optional stat for tome 2 & 3
 * - Default to null (not set)
 * 
 * Migration v3 → v4: Convert book title to book number
 * - "La Harpe des Quatre Saisons" -> 1
 * - "La Confrérie de NUADA" -> 2
 * - "Les Entrailles du temps" -> 3
 * - Default to 1 if unknown
 * 
 * Migration v4 → v5: Add reputation field to stats
 * - New stat for tome 2
 * - Default to 0 if book is 2, else null
 */
export const migrations: Migration[] = [
  {
    version: 2,
    migrate: (data) => ({
      ...data,
      gameMode: data.gameMode ?? 'mortal', // Default to mortal mode for legacy characters
      version: 2,
    }),
  },
  {
    version: 3,
    migrate: (data) => ({
      ...data,
      stats: {
        ...data.stats,
        constitution: data.stats?.constitution ?? null, // Optional field, default null
      },
      version: 3,
    }),
  },
  {
    version: 4,
    migrate: (data) => {
      const bookMapping: Record<string, number> = {
        "La Harpe des Quatre Saisons": 1,
        "La Confrérie de NUADA": 2,
        "Les Entrailles du temps": 3,
      };
      return {
        ...data,
        book: typeof data.book === 'string' ? (bookMapping[data.book] ?? 1) : data.book,
        version: 4,
      };
    },
  },
  {
    version: 5,
    migrate: (data) => ({
      ...data,
      stats: {
        ...data.stats,
        reputation: data.stats.reputation ?? (data.book === 2 ? 0 : null),
      },
      version: 5,
    }),
  },
  // Future migrations here
];

/**
 * Migrate character data to current version
 * 
 * @param data - Raw character data from IndexedDB
 * @returns Migrated data at CURRENT_VERSION
 * 
 * @example
 * // Legacy character (v1)
 * const legacyData = { id: '123', name: 'Aragorn', stats: { ... } };
 * const migrated = migrateCharacter(legacyData);
 * // migrated = { id: '123', name: 'Aragorn', gameMode: 'mortal', version: 4, book: 1, stats: { constitution: null, ... } }
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function migrateCharacter(data: any): any {
  const currentVersion = data.version ?? 1; // Default to v1 if no version field
  
  // Already at current version
  if (currentVersion >= CURRENT_VERSION) {
    return data;
  }
  
  // Apply all necessary migrations sequentially
  return migrations
    .filter(m => m.version > currentVersion)
    .sort((a, b) => a.version - b.version)
    .reduce((acc, migration) => migration.migrate(acc), data);
}
