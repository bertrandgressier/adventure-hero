import { Character } from '../entities/Character';

/**
 * ICharacterRepository - Port (Interface)
 * Définit le contrat pour la persistance des personnages
 * L'implémentation concrète sera dans la couche Infrastructure
 */
export interface ICharacterRepository {
  /**
   * Sauvegarde un personnage (création ou mise à jour)
   */
  save(character: Character): Promise<void>;

  /**
   * Récupère un personnage par son ID
   * Retourne null si le personnage n'existe pas
   */
  findById(id: string): Promise<Character | null>;

  /**
   * Récupère tous les personnages
   */
  findAll(): Promise<Character[]>;

  /**
   * Supprime un personnage par son ID
   */
  delete(id: string): Promise<void>;

  /**
   * Vérifie si un personnage existe
   */
  exists(id: string): Promise<boolean>;
}
