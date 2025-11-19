import type { CharacterService } from '@/src/application/services/CharacterService';
import type { CharacterListSlice } from './characterListSlice';

export type CharacterMetadataSlice = {
  updateName: (id: string, name: string) => Promise<void>;
  updateNotes: (id: string, notes: string) => Promise<void>;
  goToParagraph: (id: string, paragraph: number) => Promise<void>;
  updateBook: (id: string, book: number) => Promise<void>;
};

type StoreState = CharacterMetadataSlice & CharacterListSlice;
type SetState = (partial: Partial<StoreState> | ((state: StoreState) => Partial<StoreState>)) => void;
type GetState = () => StoreState;

export const createCharacterMetadataSlice = (service: CharacterService) => {
  return (set: SetState, get: GetState): CharacterMetadataSlice => ({
    updateName: async (id: string, name: string) => {
      const character = get().characters[id];
      if (!character) return;

      try {
        const updated = await service.updateCharacterName(id, name);
        set((state) => ({
          characters: { ...state.characters, [id]: updated },
        }));
      } catch (error) {
        set({ error: error instanceof Error ? error.message : 'Erreur de mise à jour' });
        throw error;
      }
    },

    updateBook: async (id: string, book: number) => {
      const character = get().characters[id];
      if (!character) return;

      try {
        const updated = await service.updateBook(id, book);
        set((state) => ({
          characters: { ...state.characters, [id]: updated },
        }));
      } catch (error) {
        set({ error: error instanceof Error ? error.message : 'Erreur de mise à jour' });
        throw error;
      }
    },

    updateNotes: async (id: string, notes: string) => {
      const character = get().characters[id];
      if (!character) return;

      try {
        const updated = await service.updateNotes(id, notes);
        set((state) => ({
          characters: { ...state.characters, [id]: updated },
        }));
      } catch (error) {
        set({ error: error instanceof Error ? error.message : 'Erreur de mise à jour' });
        throw error;
      }
    },

    goToParagraph: async (id: string, paragraph: number) => {
      const character = get().characters[id];
      if (!character) return;

      try {
        const updated = await service.goToParagraph(id, paragraph);
        set((state) => ({
          characters: { ...state.characters, [id]: updated },
        }));
      } catch (error) {
        set({ error: error instanceof Error ? error.message : 'Erreur de mise à jour' });
        throw error;
      }
    },
  });
};
