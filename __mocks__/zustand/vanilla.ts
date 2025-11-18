import { act } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
export * from 'zustand/vanilla';

const { createStore: actualCreateStore } =
  await vi.importActual<typeof import('zustand/vanilla')>('zustand/vanilla');

// Variable pour contenir les fonctions de reset de tous les stores
export const storeResetFns = new Set<() => void>();

const createStoreUncurried = <T>(
  stateCreator: Parameters<typeof actualCreateStore<T>>[0],
) => {
  const store = actualCreateStore(stateCreator);
  const initialState = store.getInitialState();
  storeResetFns.add(() => {
    store.setState(initialState, true);
  });
  return store;
};

// Création d'un store vanilla avec reset automatique après chaque test
export const createStore = (<T>(
  stateCreator: Parameters<typeof actualCreateStore<T>>[0],
) => {
  console.log('zustand/vanilla createStore mock');

  // Support de la version curried de createStore
  return typeof stateCreator === 'function'
    ? createStoreUncurried(stateCreator)
    : createStoreUncurried;
}) as typeof actualCreateStore;

// Reset tous les stores après chaque test
afterEach(() => {
  act(() => {
    storeResetFns.forEach((resetFn) => {
      resetFn();
    });
  });
});
