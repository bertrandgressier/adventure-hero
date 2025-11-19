import { describe, it, expect } from 'vitest';
import { migrateCharacter, CURRENT_VERSION, migrations } from './migrations';

describe('migrateCharacter', () => {
  describe('v1 → v2 migration', () => {
    it('should migrate legacy character (no version field)', () => {
      const legacyData = {
        id: '123-abc',
        name: 'Aragorn',
        book: 'La Harpe des Quatre Saisons',
        talent: 'instinct',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        stats: {
          dexterite: 7,
          chance: 5,
          chanceInitiale: 5,
          pointsDeVieMax: 32,
          pointsDeVieActuels: 32,
        },
        inventory: {
          boulons: 0,
          items: [],
        },
        progress: {
          currentParagraph: 1,
          history: [1],
          lastSaved: '2024-01-01T00:00:00.000Z',
        },
        notes: '',
      };

      const migrated = migrateCharacter(legacyData);

      expect(migrated.version).toBe(2);
      expect(migrated.gameMode).toBe('mortal');
      expect(migrated.name).toBe('Aragorn');
      expect(migrated.stats).toEqual(legacyData.stats);
    });

    it('should preserve existing gameMode if present', () => {
      const dataWithGameMode = {
        id: '456-def',
        name: 'Legolas',
        gameMode: 'narrative',
        stats: { dexterite: 7, chance: 5, chanceInitiale: 5, pointsDeVieMax: 32, pointsDeVieActuels: 32 },
        inventory: { boulons: 0, items: [] },
        progress: { currentParagraph: 1, history: [1], lastSaved: '2024-01-01T00:00:00.000Z' },
        notes: '',
      };

      const migrated = migrateCharacter(dataWithGameMode);

      expect(migrated.gameMode).toBe('narrative'); // Should preserve existing value
      expect(migrated.version).toBe(2);
    });

    it('should not migrate data already at current version', () => {
      const currentData = {
        id: '789-ghi',
        name: 'Gimli',
        gameMode: 'simplified' as const,
        version: 2,
        stats: { dexterite: 7, chance: 5, chanceInitiale: 5, pointsDeVieMax: 32, pointsDeVieActuels: 32 },
        inventory: { boulons: 0, items: [] },
        progress: { currentParagraph: 1, history: [1], lastSaved: '2024-01-01T00:00:00.000Z' },
        notes: '',
      };

      const migrated = migrateCharacter(currentData);

      expect(migrated).toEqual(currentData); // Should remain unchanged
    });
  });

  describe('migration registry', () => {
    it('should have migrations in chronological order', () => {
      for (let i = 0; i < migrations.length - 1; i++) {
        expect(migrations[i].version).toBeLessThan(migrations[i + 1].version);
      }
    });

    it('should have CURRENT_VERSION equal to last migration version', () => {
      if (migrations.length > 0) {
        const lastMigration = migrations[migrations.length - 1];
        expect(CURRENT_VERSION).toBe(lastMigration.version);
      }
    });

    it('should have at least one migration', () => {
      expect(migrations.length).toBeGreaterThan(0);
    });
  });

  describe('sequential migrations', () => {
    it('should apply multiple migrations in sequence (future test)', () => {
      // This test will be relevant when we have v2 → v3 migration
      const dataV1 = {
        id: '123',
        name: 'Test',
        stats: { dexterite: 7, chance: 5, chanceInitiale: 5, pointsDeVieMax: 32, pointsDeVieActuels: 32 },
        inventory: { boulons: 0, items: [] },
        progress: { currentParagraph: 1, history: [1], lastSaved: '2024-01-01T00:00:00.000Z' },
        notes: '',
      };

      const migrated = migrateCharacter(dataV1);

      // Should apply v1→v2, then v2→v3, etc.
      expect(migrated.version).toBe(CURRENT_VERSION);
    });
  });
});
