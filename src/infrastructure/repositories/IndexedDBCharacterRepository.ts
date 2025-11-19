import { ICharacterRepository } from '@/src/domain/repositories/ICharacterRepository';
import { Character } from '@/src/domain/entities/Character';
import { getDB } from '@/src/infrastructure/persistence/indexeddb';
import { migrateCharacter } from '@/src/infrastructure/persistence/migrations';

/**
 * Implémentation IndexedDB du repository Character.
 * 
 * Adapter qui connecte la couche Domain à la couche Infrastructure.
 * Gère la conversion entre Character (entité) et CharacterData (persistance).
 * Applique automatiquement les migrations de données au chargement.
 */
export class IndexedDBCharacterRepository implements ICharacterRepository {
  /**
   * Sauvegarde un personnage dans IndexedDB.
   * Convertit l'entité Character en données sérialisables.
   */
  async save(character: Character): Promise<void> {
    const db = await getDB();
    const data = character.toData();
    await db.put('characters', data);
  }

  /**
   * Récupère un personnage par son ID.
   * Retourne null si non trouvé.
   * Applique automatiquement les migrations si nécessaire.
   */
  async findById(id: string): Promise<Character | null> {
    const db = await getDB();
    const rawData = await db.get('characters', id);
    
    if (!rawData) {
      return null;
    }

    // Migrate data if needed
    const migratedData = migrateCharacter(rawData);
    
    // Save migrated data back to DB if version changed
    if (migratedData.version !== rawData.version) {
      await db.put('characters', migratedData);
    }

    return Character.fromData(migratedData);
  }

  /**
   * Récupère tous les personnages.
   * Retourne un tableau vide si aucun personnage.
   * Applique automatiquement les migrations si nécessaire.
   */
  async findAll(): Promise<Character[]> {
    const db = await getDB();
    const allRawData = await db.getAll('characters');
    
    const characters: Character[] = [];
    
    for (const rawData of allRawData) {
      // Migrate data if needed
      const migratedData = migrateCharacter(rawData);
      
      // Save migrated data back to DB if version changed
      if (migratedData.version !== rawData.version) {
        await db.put('characters', migratedData);
      }
      
      characters.push(Character.fromData(migratedData));
    }
    
    return characters;
  }

  /**
   * Supprime un personnage par son ID.
   */
  async delete(id: string): Promise<void> {
    const db = await getDB();
    await db.delete('characters', id);
  }

  /**
   * Vérifie si un personnage existe par son ID.
   */
  async exists(id: string): Promise<boolean> {
    const character = await this.findById(id);
    return character !== null;
  }
}
