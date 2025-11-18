import { useState, useEffect, useCallback } from 'react';
import { Character } from '@/src/domain/entities/Character';
import { CharacterService } from '@/src/application/services/CharacterService';
import { IndexedDBCharacterRepository } from '@/src/infrastructure/repositories/IndexedDBCharacterRepository';
import type { StatsData } from '@/src/domain/value-objects/Stats';
import type { Weapon } from '@/src/domain/value-objects/Inventory';

// Instance singleton du service (client-side only)
let serviceInstance: CharacterService | null = null;

function getService(): CharacterService {
  if (!serviceInstance) {
    const repository = new IndexedDBCharacterRepository();
    serviceInstance = new CharacterService(repository);
  }
  return serviceInstance;
}

interface UseCharacterResult {
  character: Character | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  updateName: (name: string) => Promise<void>;
  updateStats: (stats: Partial<StatsData>) => Promise<void>;
  applyDamage: (amount: number) => Promise<void>;
  heal: (amount: number) => Promise<void>;
  equipWeapon: (weapon: Weapon | null) => Promise<void>;
  addItem: (item: string) => Promise<void>;
  removeItem: (itemIndex: number) => Promise<void>;
  addBoulons: (amount: number) => Promise<void>;
  removeBoulons: (amount: number) => Promise<void>;
  goToParagraph: (paragraph: number) => Promise<void>;
  updateNotes: (notes: string) => Promise<void>;
  refresh: () => Promise<void>;
}

/**
 * Hook React pour gérer un personnage.
 * 
 * Utilise CharacterService pour toutes les opérations.
 * Gère le state local (character, loading, error).
 * 
 * @param characterId - ID du personnage à charger
 * @returns État et actions pour le personnage
 */
export function useCharacter(characterId: string | null): UseCharacterResult {
  const [character, setCharacter] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const service = getService();

  // Charger le personnage
  const loadCharacter = useCallback(async () => {
    if (!characterId) {
      setCharacter(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const char = await service.getCharacter(characterId);
      setCharacter(char);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
      setCharacter(null);
    } finally {
      setIsLoading(false);
    }
  }, [characterId, service]);

  // Charger au montage et quand l'ID change
  useEffect(() => {
    loadCharacter();
  }, [loadCharacter]);

  // Actions
  const updateName = useCallback(async (name: string) => {
    if (!characterId) return;
    
    try {
      setError(null);
      const updated = await service.updateCharacterName(characterId, name);
      setCharacter(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
      throw err;
    }
  }, [characterId, service]);

  const updateStats = useCallback(async (stats: Partial<StatsData>) => {
    if (!characterId) return;
    
    try {
      setError(null);
      const updated = await service.updateCharacterStats(characterId, stats);
      setCharacter(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
      throw err;
    }
  }, [characterId, service]);

  const applyDamage = useCallback(async (amount: number) => {
    if (!characterId) return;
    
    try {
      setError(null);
      const updated = await service.applyDamage(characterId, amount);
      setCharacter(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'application des dégâts');
      throw err;
    }
  }, [characterId, service]);

  const heal = useCallback(async (amount: number) => {
    if (!characterId) return;
    
    try {
      setError(null);
      const updated = await service.healCharacter(characterId, amount);
      setCharacter(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors des soins');
      throw err;
    }
  }, [characterId, service]);

  const equipWeapon = useCallback(async (weapon: Weapon | null) => {
    if (!characterId) return;
    
    try {
      setError(null);
      
      if (weapon === null) {
        // Unequip weapon
        const character = await service.getCharacter(characterId);
        if (!character) throw new Error('Personnage non trouvé');
        const updated = character.unequipWeapon();
        await service.updateCharacterStats(characterId, {}); // Force save
        setCharacter(updated);
      } else {
        const updated = await service.equipWeapon(characterId, weapon);
        setCharacter(updated);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'équipement');
      throw err;
    }
  }, [characterId, service]);

  const addItem = useCallback(async (item: string) => {
    if (!characterId) return;
    
    try {
      setError(null);
      const updated = await service.addItemToInventory(characterId, {
        name: item,
        possessed: true,
        type: 'item',
      });
      setCharacter(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'ajout');
      throw err;
    }
  }, [characterId, service]);

  const removeItem = useCallback(async (itemIndex: number) => {
    if (!characterId) return;
    
    try {
      setError(null);
      const character = await service.getCharacter(characterId);
      if (!character) throw new Error('Personnage non trouvé');
      
      const updated = character.removeItem(itemIndex);
      await service.updateCharacterStats(characterId, {}); // Force save
      setCharacter(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      throw err;
    }
  }, [characterId, service]);

  const addBoulons = useCallback(async (amount: number) => {
    if (!characterId) return;
    
    try {
      setError(null);
      const character = await service.getCharacter(characterId);
      if (!character) throw new Error('Personnage non trouvé');
      
      const updated = character.addBoulons(amount);
      await service.updateCharacterStats(characterId, {}); // Force save
      setCharacter(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'ajout');
      throw err;
    }
  }, [characterId, service]);

  const removeBoulons = useCallback(async (amount: number) => {
    if (!characterId) return;
    
    try {
      setError(null);
      const character = await service.getCharacter(characterId);
      if (!character) throw new Error('Personnage non trouvé');
      
      const updated = character.removeBoulons(amount);
      await service.updateCharacterStats(characterId, {}); // Force save
      setCharacter(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du retrait');
      throw err;
    }
  }, [characterId, service]);

  const goToParagraph = useCallback(async (paragraph: number) => {
    if (!characterId) return;
    
    try {
      setError(null);
      const updated = await service.goToParagraph(characterId, paragraph);
      setCharacter(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du changement de paragraphe');
      throw err;
    }
  }, [characterId, service]);

  const updateNotes = useCallback(async (notes: string) => {
    if (!characterId) return;
    
    try {
      setError(null);
      const updated = await service.updateNotes(characterId, notes);
      setCharacter(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour des notes');
      throw err;
    }
  }, [characterId, service]);

  const refresh = useCallback(async () => {
    await loadCharacter();
  }, [loadCharacter]);

  return {
    character,
    isLoading,
    error,
    updateName,
    updateStats,
    applyDamage,
    heal,
    equipWeapon,
    addItem,
    removeItem,
    addBoulons,
    removeBoulons,
    goToParagraph,
    updateNotes,
    refresh,
  };
}
