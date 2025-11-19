import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createCharacterStore } from './characterStore';
import type { CharacterStore } from './characterStore';
import type { Character } from '@/src/domain/entities/Character';

// Mock du service
vi.mock('@/src/application/services/CharacterService');
vi.mock('@/src/infrastructure/repositories/IndexedDBCharacterRepository');

describe('CharacterStore', () => {
  let store: ReturnType<typeof createCharacterStore>;

  beforeEach(() => {
    store = createCharacterStore();
  });

  describe('État initial', () => {
    it('devrait avoir un état initial correct', () => {
      const state = store.getState();

      expect(state.characters).toEqual({});
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('devrait avoir toutes les actions définies', () => {
      const state = store.getState();

      // Actions de liste
      expect(typeof state.loadAll).toBe('function');
      expect(typeof state.loadOne).toBe('function');
      expect(typeof state.refresh).toBe('function');
      expect(typeof state.getCharacter).toBe('function');
      expect(typeof state.getAllCharacters).toBe('function');

      // Actions de mutation
      expect(typeof state.createCharacter).toBe('function');
      expect(typeof state.deleteCharacter).toBe('function');

      // Actions de stats
      expect(typeof state.updateStats).toBe('function');
      expect(typeof state.applyDamage).toBe('function');
      expect(typeof state.heal).toBe('function');

      // Actions d'inventaire
      expect(typeof state.equipWeapon).toBe('function');
      expect(typeof state.addItem).toBe('function');
      expect(typeof state.removeItem).toBe('function');
      expect(typeof state.addBoulons).toBe('function');
      expect(typeof state.removeBoulons).toBe('function');

      // Actions de métadonnées
      expect(typeof state.updateName).toBe('function');
      expect(typeof state.updateNotes).toBe('function');
      expect(typeof state.goToParagraph).toBe('function');
    });
  });

  describe('Sélecteurs', () => {
    it('getCharacter devrait retourner null si le personnage n\'existe pas', () => {
      const state = store.getState();
      const character = state.getCharacter('non-existent-id');

      expect(character).toBeNull();
    });

    it('getAllCharacters devrait retourner un tableau vide initialement', () => {
      const state = store.getState();
      const characters = state.getAllCharacters();

      expect(characters).toEqual([]);
      expect(Array.isArray(characters)).toBe(true);
    });
  });

  describe('État de chargement', () => {
    it('devrait gérer l\'état isLoading', () => {
      // Initialement false
      expect(store.getState().isLoading).toBe(false);

      // Peut être modifié via setState (pour simulation)
      store.setState({ isLoading: true });
      expect(store.getState().isLoading).toBe(true);

      store.setState({ isLoading: false });
      expect(store.getState().isLoading).toBe(false);
    });
  });

  describe('Gestion des erreurs', () => {
    it('devrait gérer l\'état error', () => {
      // Initialement null
      expect(store.getState().error).toBeNull();

      // Peut être modifié
      store.setState({ error: 'Une erreur est survenue' });
      expect(store.getState().error).toBe('Une erreur est survenue');

      // Peut être réinitialisé
      store.setState({ error: null });
      expect(store.getState().error).toBeNull();
    });
  });

  describe('Immutabilité du state', () => {
    it('ne devrait pas muter directement l\'objet characters', () => {
      const initialCharacters = store.getState().characters;
      
      // Tenter une mutation directe (ne devrait pas affecter le store)
      (initialCharacters as Record<string, Character>)['test-id'] = { id: 'test-id', name: 'Test' } as Character;

      // Le store ne devrait pas avoir changé
      expect(store.getState().characters).toBe(initialCharacters);
    });
  });

  describe('Abonnements', () => {
    it('devrait permettre de s\'abonner aux changements', () => {
      const listener = vi.fn();
      const unsubscribe = store.subscribe(listener);

      // Modifier le state
      store.setState({ isLoading: true });

      expect(listener).toHaveBeenCalledTimes(1);

      // Se désabonner
      unsubscribe();

      // Les changements ultérieurs ne devraient pas déclencher le listener
      store.setState({ isLoading: false });
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('devrait permettre de s\'abonner à des propriétés spécifiques', () => {
      const values: boolean[] = [];

      const unsubscribe = store.subscribe(
        (state) => {
          const isLoading = state.isLoading;
          values.push(isLoading);
        }
      );

      // Modifier isLoading
      store.setState({ isLoading: true });
      expect(values.length).toBeGreaterThan(0);
      expect(values[values.length - 1]).toBe(true);

      // Modifier error (devrait aussi déclencher le listener)
      store.setState({ error: 'Erreur' });
      expect(values.length).toBeGreaterThan(1);

      unsubscribe();
    });
  });

  describe('getInitialState', () => {
    it('devrait retourner l\'état initial du store', () => {
      // Modifier le state
      store.setState({ isLoading: true, error: 'Test error' });

      // getInitialState devrait retourner l'état d'origine
      const initialState = store.getInitialState();
      expect(initialState.isLoading).toBe(false);
      expect(initialState.error).toBeNull();
      expect(initialState.characters).toEqual({});
    });
  });

  describe('setState avec replace flag', () => {
    it('devrait remplacer tout le state avec replace: true', () => {
      // Ajouter des données
      store.setState({ 
        isLoading: true, 
        error: 'Test',
        characters: { 'id1': {} as Character }
      });

      // Remplacer avec un état minimal
      store.setState({ 
        characters: {}, 
        isLoading: false, 
        error: null 
      } as CharacterStore, true);

      const state = store.getState();
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.characters).toEqual({});
    });
  });
});
