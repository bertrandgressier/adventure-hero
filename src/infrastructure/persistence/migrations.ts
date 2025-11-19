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

export const CURRENT_VERSION = 2;

/**
 * Migration interface
 * Each migration transforms data from version N to version N+1
 */
export interface Migration {
  version: number;
  migrate: (data: any) => any;
}

/**
 * Registry of all migrations (chronological order)
 * 
 * Migration v1 → v2: Add gameMode and version fields
 * - Legacy characters (no version field) get gameMode='mortal' (preserve current behavior)
 * - Add version=2 to track migration
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
 * // migrated = { id: '123', name: 'Aragorn', gameMode: 'mortal', version: 2, stats: { ... } }
 */
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
