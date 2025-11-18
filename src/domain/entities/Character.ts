import { Stats, StatsData } from '../value-objects/Stats';
import { Inventory, InventoryData } from '../value-objects/Inventory';

/**
 * Progress - Value Object
 * Représente la progression dans le livre
 */
export interface ProgressData {
  currentParagraph: number;
  history: number[];
  lastSaved: string;
}

export class Progress {
  constructor(
    public readonly currentParagraph: number,
    public readonly history: readonly number[],
    public readonly lastSaved: string
  ) {}

  /**
   * Change le paragraphe actuel
   */
  goToParagraph(paragraph: number): Progress {
    if (paragraph < 1) {
      throw new Error('Le numéro de paragraphe doit être >= 1');
    }
    
    return new Progress(
      paragraph,
      [...this.history, paragraph],
      new Date().toISOString()
    );
  }

  toData(): ProgressData {
    return {
      currentParagraph: this.currentParagraph,
      history: [...this.history],
      lastSaved: this.lastSaved,
    };
  }

  static fromData(data: ProgressData): Progress {
    return new Progress(
      data.currentParagraph,
      data.history,
      data.lastSaved
    );
  }
}

/**
 * Character - Entity
 * Entité racine représentant un personnage avec toute sa logique métier
 */
export interface CharacterData {
  id: string;
  name: string;
  book: string;
  talent: string;
  createdAt: string;
  updatedAt: string;
  stats: StatsData;
  inventory: InventoryData;
  progress: ProgressData;
  notes: string;
}

export class Character {
  constructor(
    public readonly id: string,
    private _name: string,
    public readonly book: string,
    public readonly talent: string,
    public readonly createdAt: string,
    public readonly updatedAt: string,
    private stats: Stats,
    private inventory: Inventory,
    private progress: Progress,
    private _notes: string
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this._name.trim()) {
      throw new Error('Le nom du personnage ne peut pas être vide');
    }
  }

  // Getters
  get name(): string {
    return this._name;
  }

  get notes(): string {
    return this._notes;
  }

  /**
   * Met à jour le nom du personnage
   */
  updateName(newName: string): Character {
    if (!newName.trim()) {
      throw new Error('Le nom du personnage ne peut pas être vide');
    }
    
    return new Character(
      this.id,
      newName.trim(),
      this.book,
      this.talent,
      this.createdAt,
      new Date().toISOString(),
      this.stats,
      this.inventory,
      this.progress,
      this._notes
    );
  }

  /**
   * Met à jour les statistiques
   */
  updateStats(newStats: Partial<StatsData>): Character {
    const updatedStats = this.stats.update(newStats);
    
    return new Character(
      this.id,
      this._name,
      this.book,
      this.talent,
      this.createdAt,
      new Date().toISOString(),
      updatedStats,
      this.inventory,
      this.progress,
      this._notes
    );
  }

  /**
   * Applique des dégâts au personnage
   */
  takeDamage(damage: number): Character {
    const updatedStats = this.stats.takeDamage(damage);
    
    return new Character(
      this.id,
      this._name,
      this.book,
      this.talent,
      this.createdAt,
      new Date().toISOString(),
      updatedStats,
      this.inventory,
      this.progress,
      this._notes
    );
  }

  /**
   * Soigne le personnage
   */
  heal(amount: number): Character {
    const updatedStats = this.stats.heal(amount);
    
    return new Character(
      this.id,
      this._name,
      this.book,
      this.talent,
      this.createdAt,
      new Date().toISOString(),
      updatedStats,
      this.inventory,
      this.progress,
      this._notes
    );
  }

  /**
   * Diminue la chance après un test
   */
  decreaseChance(): Character {
    const updatedStats = this.stats.decreaseChance();
    
    return new Character(
      this.id,
      this._name,
      this.book,
      this.talent,
      this.createdAt,
      new Date().toISOString(),
      updatedStats,
      this.inventory,
      this.progress,
      this._notes
    );
  }

  /**
   * Équipe une arme
   */
  equipWeapon(weapon: { name: string; attackPoints: number }): Character {
    const updatedInventory = this.inventory.equipWeapon(weapon);
    
    return new Character(
      this.id,
      this._name,
      this.book,
      this.talent,
      this.createdAt,
      new Date().toISOString(),
      this.stats,
      updatedInventory,
      this.progress,
      this._notes
    );
  }

  /**
   * Retire l'arme équipée
   */
  unequipWeapon(): Character {
    const updatedInventory = this.inventory.unequipWeapon();
    
    return new Character(
      this.id,
      this._name,
      this.book,
      this.talent,
      this.createdAt,
      new Date().toISOString(),
      this.stats,
      updatedInventory,
      this.progress,
      this._notes
    );
  }

  /**
   * Ajoute un objet à l'inventaire
   */
  addItem(item: { name: string; possessed: boolean; type?: 'item' | 'special' }): Character {
    const updatedInventory = this.inventory.addItem(item);
    
    return new Character(
      this.id,
      this._name,
      this.book,
      this.talent,
      this.createdAt,
      new Date().toISOString(),
      this.stats,
      updatedInventory,
      this.progress,
      this._notes
    );
  }

  /**
   * Retire un objet de l'inventaire
   */
  removeItem(index: number): Character {
    const updatedInventory = this.inventory.removeItem(index);
    
    return new Character(
      this.id,
      this._name,
      this.book,
      this.talent,
      this.createdAt,
      new Date().toISOString(),
      this.stats,
      updatedInventory,
      this.progress,
      this._notes
    );
  }

  /**
   * Change l'état de possession d'un objet
   */
  toggleItemPossession(index: number): Character {
    const updatedInventory = this.inventory.toggleItemPossession(index);
    
    return new Character(
      this.id,
      this._name,
      this.book,
      this.talent,
      this.createdAt,
      new Date().toISOString(),
      this.stats,
      updatedInventory,
      this.progress,
      this._notes
    );
  }

  /**
   * Ajoute des boulons
   */
  addBoulons(amount: number): Character {
    const updatedInventory = this.inventory.addBoulons(amount);
    
    return new Character(
      this.id,
      this._name,
      this.book,
      this.talent,
      this.createdAt,
      new Date().toISOString(),
      this.stats,
      updatedInventory,
      this.progress,
      this._notes
    );
  }

  /**
   * Retire des boulons
   */
  removeBoulons(amount: number): Character {
    const updatedInventory = this.inventory.removeBoulons(amount);
    
    return new Character(
      this.id,
      this._name,
      this.book,
      this.talent,
      this.createdAt,
      new Date().toISOString(),
      this.stats,
      updatedInventory,
      this.progress,
      this._notes
    );
  }

  /**
   * Change le paragraphe actuel
   */
  goToParagraph(paragraph: number): Character {
    const updatedProgress = this.progress.goToParagraph(paragraph);
    
    return new Character(
      this.id,
      this._name,
      this.book,
      this.talent,
      this.createdAt,
      new Date().toISOString(),
      this.stats,
      this.inventory,
      updatedProgress,
      this._notes
    );
  }

  /**
   * Met à jour les notes
   */
  updateNotes(notes: string): Character {
    return new Character(
      this.id,
      this._name,
      this.book,
      this.talent,
      this.createdAt,
      new Date().toISOString(),
      this.stats,
      this.inventory,
      this.progress,
      notes
    );
  }

  /**
   * Vérifie si le personnage est mort
   */
  isDead(): boolean {
    return this.stats.isDead();
  }

  /**
   * Vérifie si le personnage a peu de vie
   */
  isCriticalHealth(): boolean {
    return this.stats.isCriticalHealth();
  }

  /**
   * Retourne les statistiques pour l'UI
   */
  getStats(): StatsData {
    return this.stats.toData();
  }

  /**
   * Retourne l'objet Stats complet avec méthodes
   */
  getStatsObject(): Stats {
    return this.stats;
  }

  /**
   * Retourne l'inventaire pour l'UI
   */
  getInventory(): InventoryData {
    return this.inventory.toData();
  }

  /**
   * Retourne la progression pour l'UI
   */
  getProgress(): ProgressData {
    return this.progress.toData();
  }

  /**
   * Convertit en format de données pour la persistance
   * SEUL ENDROIT où updatedAt est ajouté !
   */
  toData(): CharacterData {
    return {
      id: this.id,
      name: this._name,
      book: this.book,
      talent: this.talent,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      stats: this.stats.toData(),
      inventory: this.inventory.toData(),
      progress: this.progress.toData(),
      notes: this._notes,
    };
  }

  /**
   * Crée une instance depuis des données
   */
  static fromData(data: CharacterData): Character {
    return new Character(
      data.id,
      data.name,
      data.book,
      data.talent,
      data.createdAt,
      data.updatedAt,
      Stats.fromData(data.stats),
      Inventory.fromData(data.inventory),
      Progress.fromData(data.progress),
      data.notes
    );
  }

  /**
   * Crée un nouveau personnage
   */
  static create(data: {
    name: string;
    book: string;
    talent: string;
    stats: StatsData;
  }): Character {
    const now = new Date().toISOString();
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    return new Character(
      id,
      data.name.trim(),
      data.book,
      data.talent,
      now,
      now,
      Stats.fromData(data.stats),
      new Inventory(0, undefined, []),
      new Progress(1, [1], now),
      ''
    );
  }
}
