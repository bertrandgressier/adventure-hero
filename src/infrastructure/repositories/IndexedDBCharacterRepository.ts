import { ICharacterRepository } from '@/src/domain/repositories/ICharacterRepository';
import { Character } from '@/src/domain/entities/Character';
import { getDB } from '@/lib/storage/db';

/**
 * Implémentation IndexedDB du repository Character.
 * 
 * Adapter qui connecte la couche Domain à la couche Infrastructure.
 * Gère la conversion entre Character (entité) et CharacterData (persistance).
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
   */
  async findById(id: string): Promise<Character | null> {
    const db = await getDB();
    const data = await db.get('characters', id);
    
    if (!data) {
      return null;
    }

    return Character.fromData(data);
  }

  /**
   * Récupère tous les personnages.
   * Retourne un tableau vide si aucun personnage.
   */
  async findAll(): Promise<Character[]> {
    const db = await getDB();
    const allData = await db.getAll('characters');
    
    return allData.map(data => Character.fromData(data));
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
