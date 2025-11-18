'use client';

import { CharacterStoreProvider } from '@/src/presentation/providers/character-store-provider';

export default function CharactersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CharacterStoreProvider>
      {children}
    </CharacterStoreProvider>
  );
}
