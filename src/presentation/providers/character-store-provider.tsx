'use client';

import { type ReactNode, createContext, useRef, useContext, useEffect } from 'react';
import { useStoreWithEqualityFn } from 'zustand/traditional';
import {
  type CharacterStore,
  createCharacterStore,
} from '@/src/presentation/stores/characterStore';

export type CharacterStoreApi = ReturnType<typeof createCharacterStore>;

export const CharacterStoreContext = createContext<CharacterStoreApi | undefined>(
  undefined
);

export interface CharacterStoreProviderProps {
  children: ReactNode;
}

export const CharacterStoreProvider = ({ children }: CharacterStoreProviderProps) => {
  const storeRef = useRef<CharacterStoreApi | null>(null);
  
  if (storeRef.current === null) {
    storeRef.current = createCharacterStore();
  }

  useEffect(() => {
    if (storeRef.current) {
      storeRef.current.getState().loadAll();
    }
  }, []);

  return (
    <CharacterStoreContext.Provider value={storeRef.current}>
      {children}
    </CharacterStoreContext.Provider>
  );
};

export function useCharacterStore<T>(
  selector: (store: CharacterStore) => T
): T {
  const store = useContext(CharacterStoreContext);

  if (!store) {
    throw new Error('useCharacterStore must be used within CharacterStoreProvider');
  }

  return useStoreWithEqualityFn(store, selector);
}
