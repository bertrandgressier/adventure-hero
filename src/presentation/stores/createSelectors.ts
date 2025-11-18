import { StoreApi, useStore } from 'zustand';

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

/**
 * Helper pour auto-générer des selectors typés à partir d'un store vanilla.
 * 
 * Au lieu de :
 *   const bears = useCharacterStore((state) => state.bears)
 * 
 * Vous pouvez faire :
 *   const bears = useCharacterStore.use.bears()
 * 
 * Pattern officiel Zustand : https://zustand.docs.pmnd.rs/guides/auto-generating-selectors
 * 
 * @example
 * ```typescript
 * const useBearStore = createSelectors(bearStore);
 * const bears = useBearStore.use.bears();
 * const increment = useBearStore.use.increment();
 * ```
 */
export const createSelectors = <S extends StoreApi<object>>(_store: S) => {
  const store = _store as WithSelectors<typeof _store>;
  store.use = {} as WithSelectors<typeof _store>['use'];
  
  for (const k of Object.keys(store.getState())) {
    // Wrapper function to satisfy react-hooks/rules-of-hooks
    const createUseHook = (key: string) => () => useStore(_store, (s) => s[key as keyof typeof s]);
    (store.use as Record<string, () => unknown>)[k] = createUseHook(k);
  }

  return store;
};
