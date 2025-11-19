import { describe, it, expect } from 'vitest';
import { migrateCharacter, CURRENT_VERSION, migrations } from './migrations';

describe('migrateCharacter', () => {
  describe('individual migrations', () => {
    describe('v1 → v2: Add gameMode field', () => {
      it('should add gameMode with default "mortal" for legacy character', () => {
        const v1Data = {
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

        const v2Migration = migrations.find(m => m.version === 2);
        const migrated = v2Migration!.migrate(v1Data);

        expect(migrated.version).toBe(2);
        expect(migrated.gameMode).toBe('mortal');
        expect(migrated.name).toBe('Aragorn');
        expect(migrated.stats.dexterite).toBe(7);
      });

      it('should preserve existing gameMode if already present', () => {
        const v1DataWithGameMode = {
          id: '456-def',
          name: 'Legolas',
          gameMode: 'narrative',
          stats: { dexterite: 7, chance: 5, chanceInitiale: 5, pointsDeVieMax: 32, pointsDeVieActuels: 32 },
          inventory: { boulons: 0, items: [] },
          progress: { currentParagraph: 1, history: [1], lastSaved: '2024-01-01T00:00:00.000Z' },
          notes: '',
        };

        const v2Migration = migrations.find(m => m.version === 2);
        const migrated = v2Migration!.migrate(v1DataWithGameMode);

        expect(migrated.gameMode).toBe('narrative');
        expect(migrated.version).toBe(2);
      });
    });

    describe('v2 → v3: Add optional constitution field', () => {
      it('should add constitution field with null default', () => {
        const v2Data = {
          id: '789-ghi',
          name: 'Gimli',
          gameMode: 'simplified',
          version: 2,
          stats: { dexterite: 7, chance: 5, chanceInitiale: 5, pointsDeVieMax: 32, pointsDeVieActuels: 32 },
          inventory: { boulons: 0, items: [] },
          progress: { currentParagraph: 1, history: [1], lastSaved: '2024-01-01T00:00:00.000Z' },
          notes: '',
        };

        const v3Migration = migrations.find(m => m.version === 3);
        const migrated = v3Migration!.migrate(v2Data);

        expect(migrated.version).toBe(3);
        expect(migrated.stats.constitution).toBe(null);
        expect(migrated.gameMode).toBe('simplified');
        expect(migrated.stats.dexterite).toBe(7);
      });

      it('should preserve existing constitution if already present', () => {
        const v2DataWithConstitution = {
          id: '012-jkl',
          name: 'Boromir',
          gameMode: 'mortal',
          version: 2,
          stats: { dexterite: 7, constitution: 8, chance: 5, chanceInitiale: 5, pointsDeVieMax: 32, pointsDeVieActuels: 32 },
          inventory: { boulons: 0, items: [] },
          progress: { currentParagraph: 1, history: [1], lastSaved: '2024-01-01T00:00:00.000Z' },
          notes: '',
        };

        const v3Migration = migrations.find(m => m.version === 3);
        const migrated = v3Migration!.migrate(v2DataWithConstitution);

        expect(migrated.stats.constitution).toBe(8);
        expect(migrated.version).toBe(3);
      });
    });

    describe('v3 → v4: Convert book title to number', () => {
      it('should convert "La Harpe des Quatre Saisons" to 1', () => {
        const v3Data = {
          id: '345-mno',
          name: 'Frodo',
          book: 'La Harpe des Quatre Saisons',
          gameMode: 'narrative',
          version: 3,
          stats: { dexterite: 7, constitution: null, chance: 5, chanceInitiale: 5, pointsDeVieMax: 32, pointsDeVieActuels: 32 },
          inventory: { boulons: 0, items: [] },
          progress: { currentParagraph: 1, history: [1], lastSaved: '2024-01-01T00:00:00.000Z' },
          notes: '',
        };

        const v4Migration = migrations.find(m => m.version === 4);
        const migrated = v4Migration!.migrate(v3Data);

        expect(migrated.version).toBe(4);
        expect(migrated.book).toBe(1);
      });

      it('should convert "La Confrérie de NUADA" to 2', () => {
        const v3Data = {
          id: '678-pqr',
          name: 'Sam',
          book: 'La Confrérie de NUADA',
          gameMode: 'simplified',
          version: 3,
          stats: { dexterite: 7, constitution: null, chance: 5, chanceInitiale: 5, pointsDeVieMax: 32, pointsDeVieActuels: 32 },
          inventory: { boulons: 0, items: [] },
          progress: { currentParagraph: 1, history: [1], lastSaved: '2024-01-01T00:00:00.000Z' },
          notes: '',
        };

        const v4Migration = migrations.find(m => m.version === 4);
        const migrated = v4Migration!.migrate(v3Data);

        expect(migrated.book).toBe(2);
        expect(migrated.version).toBe(4);
      });

      it('should convert "Les Entrailles du temps" to 3', () => {
        const v3Data = {
          id: '901-stu',
          name: 'Merry',
          book: 'Les Entrailles du temps',
          gameMode: 'mortal',
          version: 3,
          stats: { dexterite: 7, constitution: null, chance: 5, chanceInitiale: 5, pointsDeVieMax: 32, pointsDeVieActuels: 32 },
          inventory: { boulons: 0, items: [] },
          progress: { currentParagraph: 1, history: [1], lastSaved: '2024-01-01T00:00:00.000Z' },
          notes: '',
        };

        const v4Migration = migrations.find(m => m.version === 4);
        const migrated = v4Migration!.migrate(v3Data);

        expect(migrated.book).toBe(3);
        expect(migrated.version).toBe(4);
      });

      it('should default to 1 for unknown book title', () => {
        const v3Data = {
          id: '234-vwx',
          name: 'Pippin',
          book: 'Unknown Book',
          gameMode: 'narrative',
          version: 3,
          stats: { dexterite: 7, constitution: null, chance: 5, chanceInitiale: 5, pointsDeVieMax: 32, pointsDeVieActuels: 32 },
          inventory: { boulons: 0, items: [] },
          progress: { currentParagraph: 1, history: [1], lastSaved: '2024-01-01T00:00:00.000Z' },
          notes: '',
        };

        const v4Migration = migrations.find(m => m.version === 4);
        const migrated = v4Migration!.migrate(v3Data);

        expect(migrated.book).toBe(1);
        expect(migrated.version).toBe(4);
      });

      it('should preserve existing book number', () => {
        const v3DataWithNumber = {
          id: '567-yz0',
          name: 'Gandalf',
          book: 2,
          gameMode: 'simplified',
          version: 3,
          stats: { dexterite: 7, constitution: null, chance: 5, chanceInitiale: 5, pointsDeVieMax: 32, pointsDeVieActuels: 32 },
          inventory: { boulons: 0, items: [] },
          progress: { currentParagraph: 1, history: [1], lastSaved: '2024-01-01T00:00:00.000Z' },
          notes: '',
        };

        const v4Migration = migrations.find(m => m.version === 4);
        const migrated = v4Migration!.migrate(v3DataWithNumber);

        expect(migrated.book).toBe(2);
        expect(migrated.version).toBe(4);
      });
    });

    describe('v4 → v5: Add reputation field', () => {
      it('should add reputation 0 for book 2', () => {
        const v4Data = {
          id: '123-abc',
          name: 'Aragorn',
          book: 2,
          gameMode: 'mortal',
          version: 4,
          stats: { dexterite: 7, constitution: null, chance: 5, chanceInitiale: 5, pointsDeVieMax: 32, pointsDeVieActuels: 32 },
          inventory: { boulons: 0, items: [] },
          progress: { currentParagraph: 1, history: [1], lastSaved: '2024-01-01T00:00:00.000Z' },
          notes: '',
        };

        const v5Migration = migrations.find(m => m.version === 5);
        const migrated = v5Migration!.migrate(v4Data);

        expect(migrated.version).toBe(5);
        expect(migrated.stats.reputation).toBe(0);
      });

      it('should add reputation null for book 1', () => {
        const v4Data = {
          id: '456-def',
          name: 'Legolas',
          book: 1,
          gameMode: 'narrative',
          version: 4,
          stats: { dexterite: 7, constitution: null, chance: 5, chanceInitiale: 5, pointsDeVieMax: 32, pointsDeVieActuels: 32 },
          inventory: { boulons: 0, items: [] },
          progress: { currentParagraph: 1, history: [1], lastSaved: '2024-01-01T00:00:00.000Z' },
          notes: '',
        };

        const v5Migration = migrations.find(m => m.version === 5);
        const migrated = v5Migration!.migrate(v4Data);

        expect(migrated.version).toBe(5);
        expect(migrated.stats.reputation).toBe(null);
      });

      it('should preserve existing reputation', () => {
        const v4DataWithReputation = {
          id: '789-ghi',
          name: 'Gimli',
          book: 2,
          gameMode: 'simplified',
          version: 4,
          stats: { dexterite: 7, constitution: null, reputation: 3, chance: 5, chanceInitiale: 5, pointsDeVieMax: 32, pointsDeVieActuels: 32 },
          inventory: { boulons: 0, items: [] },
          progress: { currentParagraph: 1, history: [1], lastSaved: '2024-01-01T00:00:00.000Z' },
          notes: '',
        };

        const v5Migration = migrations.find(m => m.version === 5);
        const migrated = v5Migration!.migrate(v4DataWithReputation);

        expect(migrated.stats.reputation).toBe(3);
        expect(migrated.version).toBe(5);
      });
    });
  });

  describe('full migration chain', () => {
    it('should migrate from v1 to current version applying all transformations', () => {
      const v1Data = {
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

      const migrated = migrateCharacter(v1Data);

      expect(migrated.version).toBe(CURRENT_VERSION);
      expect(migrated.gameMode).toBe('mortal'); // From v1→v2
      expect(migrated.stats.constitution).toBe(null); // From v2→v3
      expect(migrated.book).toBe(1); // From v3→v4
      expect(migrated.stats.reputation).toBe(null); // From v4→v5 (book 1)
      expect(migrated.name).toBe('Aragorn'); // Preserved
      expect(migrated.stats.dexterite).toBe(7); // Preserved
    });

    it('should migrate from v2 to current version', () => {
      const v2Data = {
        id: '456-def',
        name: 'Legolas',
        book: 'La Confrérie de NUADA',
        gameMode: 'narrative',
        version: 2,
        stats: { dexterite: 7, chance: 5, chanceInitiale: 5, pointsDeVieMax: 32, pointsDeVieActuels: 32 },
        inventory: { boulons: 0, items: [] },
        progress: { currentParagraph: 1, history: [1], lastSaved: '2024-01-01T00:00:00.000Z' },
        notes: '',
      };

      const migrated = migrateCharacter(v2Data);

      expect(migrated.version).toBe(CURRENT_VERSION);
      expect(migrated.gameMode).toBe('narrative'); // Preserved
      expect(migrated.stats.constitution).toBe(null); // From v2→v3
      expect(migrated.book).toBe(2); // From v3→v4
    });

    it('should migrate from v3 to current version', () => {
      const v3Data = {
        id: '789-ghi',
        name: 'Gimli',
        book: 'Les Entrailles du temps',
        gameMode: 'simplified',
        version: 3,
        stats: { dexterite: 7, constitution: null, chance: 5, chanceInitiale: 5, pointsDeVieMax: 32, pointsDeVieActuels: 32 },
        inventory: { boulons: 0, items: [] },
        progress: { currentParagraph: 1, history: [1], lastSaved: '2024-01-01T00:00:00.000Z' },
        notes: '',
      };

      const migrated = migrateCharacter(v3Data);

      expect(migrated.version).toBe(CURRENT_VERSION);
      expect(migrated.gameMode).toBe('simplified'); // Preserved
      expect(migrated.stats.constitution).toBe(null); // Preserved
      expect(migrated.book).toBe(3); // From v3→v4
    });

    it('should not migrate data already at current version', () => {
      const currentData = {
        id: '012-jkl',
        name: 'Boromir',
        book: 1,
        gameMode: 'mortal' as const,
        version: CURRENT_VERSION,
        stats: { dexterite: 7, constitution: null, chance: 5, chanceInitiale: 5, pointsDeVieMax: 32, pointsDeVieActuels: 32 },
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

    it('should have no gaps in version sequence', () => {
      for (let i = 0; i < migrations.length; i++) {
        expect(migrations[i].version).toBe(i + 2); // Versions start at 2 (v1 is implicit)
      }
    });
  });
});
