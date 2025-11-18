import { createStore } from 'zustand/vanilla';
import { devtools } from 'zustand/middleware';
import { Character } from '@/src/domain/entities/Character';
import { CharacterService } from '@/src/application/services/CharacterService';
import { IndexedDBCharacterRepository } from '@/src/infrastructure/repositories/IndexedDBCharacterRepository';
import type { StatsData } from '@/src/domain/value-objects/Stats';

// Instance singleton du service
let serviceInstance: CharacterService | null = null;

function getService(): CharacterService {
  if (!serviceInstance) {
    const repository = new IndexedDBCharacterRepository();
    serviceInstance = new CharacterService(repository);
  }
  return serviceInstance;
}

// Séparation State et Actions (best practice Zustand)
export interface CharacterState {
  characters: Record<string, Character>;
  isLoading: boolean;
  error: string | null;
}

export interface CharacterActions {
  loadAll: () => Promise<void>;
  loadOne: (id: string) => Promise<void>;
  refresh: (id: string) => Promise<void>;
  createCharacter: (data: {
    name: string;
    book: string;
    talent: string;
    stats: StatsData;
  }) => Promise<Character>;
  deleteCharacter: (id: string) => Promise<void>;
  updateName: (id: string, name: string) => Promise<void>;
  updateStats: (id: string, stats: Partial<StatsData>) => Promise<void>;
  applyDamage: (id: string, amount: number) => Promise<void>;
  heal: (id: string, amount: number) => Promise<void>;
  equipWeapon: (
    id: string,
    weapon: { name: string; attackPoints: number } | null
  ) => Promise<void>;
  addItem: (
    id: string,
    item: { name: string; possessed: boolean; type?: 'item' | 'special' }
  ) => Promise<void>;
  toggleItem: (id: string, itemIndex: number) => Promise<void>;
  removeItem: (id: string, itemIndex: number) => Promise<void>;
  addBoulons: (id: string, amount: number) => Promise<void>;
  removeBoulons: (id: string, amount: number) => Promise<void>;
  goToParagraph: (id: string, paragraph: number) => Promise<void>;
  updateNotes: (id: string, notes: string) => Promise<void>;
  getCharacter: (id: string) => Character | null;
  getAllCharacters: () => Character[];
}

export type CharacterStore = CharacterState & CharacterActions;

// État initial par défaut
export const defaultInitState: CharacterState = {
  characters: {},
  isLoading: false,
  error: null,
};

// Factory function pour créer un store (pattern Next.js SSR)
export const createCharacterStore = () => {
  return createStore<CharacterStore>()(
    devtools(
      (set, get) => ({
      // État initial
      characters: {},
      isLoading: false,
      error: null,

      // Charger tous les personnages
      loadAll: async () => {
        set({ isLoading: true, error: null });
        try {
          const service = getService();
          const characters = await service.getAllCharacters();
          const characterRecord = characters.reduce(
            (acc, char) => ({ ...acc, [char.id]: char }),
            {} as Record<string, Character>
          );
          set({ characters: characterRecord, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Erreur de chargement',
            isLoading: false,
          });
        }
      },

      // Charger un personnage spécifique
      loadOne: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const service = getService();
          const character = await service.getCharacter(id);
          if (character) {
            set((state) => ({
              characters: { ...state.characters, [id]: character },
              isLoading: false,
            }));
          } else {
            set({ error: 'Personnage non trouvé', isLoading: false });
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Erreur de chargement',
            isLoading: false,
          });
        }
      },

      // Recharger un personnage depuis IndexedDB
      refresh: async (id: string) => {
        await get().loadOne(id);
      },

      // Créer un nouveau personnage
      createCharacter: async (data) => {
        set({ error: null });
        try {
          const service = getService();
          const character = await service.createCharacter(data);
          set((state) => ({
            characters: { ...state.characters, [character.id]: character },
          }));
          return character;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Erreur de création';
          set({ error: errorMessage });
          throw error;
        }
      },

      // Supprimer un personnage
      deleteCharacter: async (id: string) => {
        set({ error: null });
        try {
          const service = getService();
          await service.deleteCharacter(id);
          set((state) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [id]: _deletedId, ...rest } = state.characters;
            return { characters: rest };
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Erreur de suppression';
          set({ error: errorMessage });
          throw error;
        }
      },

      // Mettre à jour le nom
      updateName: async (id: string, name: string) => {
        const character = get().characters[id];
        if (!character) return;

        try {
          const service = getService();
          const updated = await service.updateCharacterName(id, name);
          set((state) => ({
            characters: { ...state.characters, [id]: updated },
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Erreur de mise à jour' });
          throw error;
        }
      },

      // Mettre à jour les stats
      updateStats: async (id: string, stats: Partial<StatsData>) => {
        const character = get().characters[id];
        if (!character) return;

        try {
          const service = getService();
          const updated = await service.updateCharacterStats(id, stats);
          set((state) => ({
            characters: { ...state.characters, [id]: updated },
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Erreur de mise à jour' });
          throw error;
        }
      },

      // Appliquer des dégâts
      applyDamage: async (id: string, amount: number) => {
        const character = get().characters[id];
        if (!character) return;

        try {
          const service = getService();
          const updated = await service.applyDamage(id, amount);
          set((state) => ({
            characters: { ...state.characters, [id]: updated },
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Erreur de mise à jour' });
          throw error;
        }
      },

      // Soigner
      heal: async (id: string, amount: number) => {
        const character = get().characters[id];
        if (!character) return;

        try {
          const service = getService();
          const updated = await service.healCharacter(id, amount);
          set((state) => ({
            characters: { ...state.characters, [id]: updated },
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Erreur de mise à jour' });
          throw error;
        }
      },

      // Équiper une arme
      equipWeapon: async (
        id: string,
        weapon: { name: string; attackPoints: number } | null
      ) => {
        const character = get().characters[id];
        if (!character) return;

        try {
          const service = getService();
          const updated = weapon
            ? await service.equipWeapon(id, weapon)
            : await service.unequipWeapon(id);
          set((state) => ({
            characters: { ...state.characters, [id]: updated },
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Erreur de mise à jour' });
          throw error;
        }
      },

      // Ajouter un objet
      addItem: async (
        id: string,
        item: { name: string; possessed: boolean; type?: 'item' | 'special' }
      ) => {
        const character = get().characters[id];
        if (!character) return;

        try {
          const service = getService();
          const updated = await service.addItemToInventory(id, item);
          set((state) => ({
            characters: { ...state.characters, [id]: updated },
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Erreur de mise à jour' });
          throw error;
        }
      },

      // Basculer la possession d'un objet
      toggleItem: async (id: string, itemIndex: number) => {
        const character = get().characters[id];
        if (!character) return;

        try {
          const service = getService();
          const updated = await service.toggleItemPossession(id, itemIndex);
          set((state) => ({
            characters: { ...state.characters, [id]: updated },
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Erreur de mise à jour' });
          throw error;
        }
      },

      // Supprimer un objet
      removeItem: async (id: string, itemIndex: number) => {
        const character = get().characters[id];
        if (!character) return;

        try {
          const service = getService();
          const updated = await service.removeItemFromInventory(id, itemIndex);
          set((state) => ({
            characters: { ...state.characters, [id]: updated },
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Erreur de mise à jour' });
          throw error;
        }
      },

      // Ajouter des boulons
      addBoulons: async (id: string, amount: number) => {
        const character = get().characters[id];
        if (!character) return;

        try {
          const service = getService();
          const updated = await service.addBoulons(id, amount);
          set((state) => ({
            characters: { ...state.characters, [id]: updated },
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Erreur de mise à jour' });
          throw error;
        }
      },

      // Retirer des boulons
      removeBoulons: async (id: string, amount: number) => {
        const character = get().characters[id];
        if (!character) return;

        try {
          const service = getService();
          const updated = await service.removeBoulons(id, amount);
          set((state) => ({
            characters: { ...state.characters, [id]: updated },
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Erreur de mise à jour' });
          throw error;
        }
      },

      // Aller à un paragraphe
      goToParagraph: async (id: string, paragraph: number) => {
        const character = get().characters[id];
        if (!character) return;

        try {
          const service = getService();
          const updated = await service.goToParagraph(id, paragraph);
          set((state) => ({
            characters: { ...state.characters, [id]: updated },
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Erreur de mise à jour' });
          throw error;
        }
      },

      // Mettre à jour les notes
      updateNotes: async (id: string, notes: string) => {
        const character = get().characters[id];
        if (!character) return;

        try {
          const service = getService();
          const updated = await service.updateNotes(id, notes);
          set((state) => ({
            characters: { ...state.characters, [id]: updated },
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Erreur de mise à jour' });
          throw error;
        }
      },

      // Utilitaires
      getCharacter: (id: string) => {
        return get().characters[id] || null;
      },

      getAllCharacters: () => {
        return Object.values(get().characters);
      },
    }),
    { name: 'CharacterStore', enabled: typeof window !== 'undefined' }
  )
);
};
