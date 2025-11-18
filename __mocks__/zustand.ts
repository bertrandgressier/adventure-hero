import { act } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import type * as ZustandExportedTypes from 'zustand';
export * from 'zustand';

const { create: actualCreate, createStore: actualCreateStore } =
  await vi.importActual<typeof ZustandExportedTypes>('zustand');

// Variable pour contenir les fonctions de reset de tous les stores
export const storeResetFns = new Set<() => void>();

const createUncurried = <T>(
  stateCreator: ZustandExportedTypes.StateCreator<T>,
) => {
  const store = actualCreate(stateCreator);
  const initialState = store.getInitialState();
  storeResetFns.add(() => {
    store.setState(initialState, true);
  });
  return store;
};

// Création d'un store avec reset automatique après chaque test
export const create = (<T>(
  stateCreator: ZustandExportedTypes.StateCreator<T>,
) => {
  console.log('zustand create mock');

  // Support de la version curried de create
  return typeof stateCreator === 'function'
    ? createUncurried(stateCreator)
    : createUncurried;
}) as typeof ZustandExportedTypes.create;

const createStoreUncurried = <T>(
  stateCreator: ZustandExportedTypes.StateCreator<T>,
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
  stateCreator: ZustandExportedTypes.StateCreator<T>,
) => {
  console.log('zustand createStore mock');

  // Support de la version curried de createStore
  return typeof stateCreator === 'function'
    ? createStoreUncurried(stateCreator)
    : createStoreUncurried;
}) as typeof ZustandExportedTypes.createStore;

// Reset tous les stores après chaque test
afterEach(() => {
  act(() => {
    storeResetFns.forEach((resetFn) => {
      resetFn();
    });
  });
});
