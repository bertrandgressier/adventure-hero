/**
 * CharacterDTO - Data Transfer Object
 * 
 * Format de persistance pour IndexedDB.
 * Représente la structure exacte des données stockées.
 * 
 * Ce type est différent de l'entité Character (domain) qui contient la logique métier.
 */
export interface CharacterDTO {
  id: string;
  name: string;
  book: string;
  talent: string;
  createdAt: string;
  updatedAt: string;
  
  stats: {
    dexterite: number;
    chance: number;
    chanceInitiale: number;
    pointsDeVieMax: number;
    pointsDeVieActuels: number;
  };
  
  inventory: {
    boulons: number;
    weapon?: {
      name: string;
      attackPoints: number;
    };
    items: Array<{
      name: string;
      possessed: boolean;
      type?: 'item' | 'special';
    }>;
  };
  
  progress: {
    currentParagraph: number;
    history: number[];
    lastSaved: string;
  };
  
  notes: string;
}
