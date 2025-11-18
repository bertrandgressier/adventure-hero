import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CharacterStoreProvider, useCharacterStore } from './character-store-provider';

// Mock Zustand pour auto-reset entre tests
vi.mock('zustand');
vi.mock('zustand/vanilla');

// Cleanup IndexedDB entre chaque test
afterEach(async () => {
  const databases = await indexedDB.databases();
  await Promise.all(
    databases.map(db => db.name && indexedDB.deleteDatabase(db.name))
  );
});

// Composant de test simple
function CharacterCounter() {
  const characters = useCharacterStore((state) => state.getAllCharacters());
  const isLoading = useCharacterStore((state) => state.isLoading);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <h2>Personnages</h2>
      <p data-testid="character-count">Nombre: {characters.length}</p>
    </div>
  );
}

// Composant pour tester la création
function CharacterCreator() {
  const createCharacter = useCharacterStore((state) => state.createCharacter);
  const characters = useCharacterStore((state) => state.getAllCharacters());

  const handleCreate = async () => {
    await createCharacter({
      name: 'Test Hero',
      book: 'La Harpe des Quatre Saisons',
      talent: 'instinct',
      stats: {
        dexterite: 8,
        chance: 10,
        chanceInitiale: 10,
        pointsDeVieMax: 20,
        pointsDeVieActuels: 20,
      },
    });
  };

  return (
    <div>
      <button onClick={handleCreate} data-testid="create-btn">
        Créer personnage
      </button>
      <div data-testid="character-list">
        {characters.map((char) => (
          <div key={char.id} data-testid={`character-${char.id}`}>
            {char.name}
          </div>
        ))}
      </div>
    </div>
  );
}

// Composant pour tester les mutations
function CharacterMutator() {
  const characters = useCharacterStore((state) => state.getAllCharacters());
  const updateStats = useCharacterStore((state) => state.updateStats);
  const applyDamage = useCharacterStore((state) => state.applyDamage);

  const character = characters[0];

  if (!character) {
    return <div>Aucun personnage</div>;
  }

  const stats = character.getStats();

  return (
    <div>
      <p data-testid="character-hp">
        PV: {stats.pointsDeVieActuels}
      </p>
      <button
        onClick={() => applyDamage(character.id, 5)}
        data-testid="damage-btn"
      >
        Infliger 5 dégâts
      </button>
      <button
        onClick={() =>
          updateStats(character.id, {
            chance: stats.chance + 1,
          })
        }
        data-testid="luck-btn"
      >
        +1 Chance
      </button>
      <p data-testid="character-luck">
        Chance: {stats.chance}
      </p>
    </div>
  );
}

describe('CharacterStoreProvider', () => {
  beforeEach(() => {
    // Le mock Zustand reset automatiquement les stores après chaque test
  });

  it('devrait rendre le provider sans erreur', () => {
    render(
      <CharacterStoreProvider>
        <div>Test</div>
      </CharacterStoreProvider>
    );

    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('devrait afficher 0 personnages initialement', async () => {
    render(
      <CharacterStoreProvider>
        <CharacterCounter />
      </CharacterStoreProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('character-count')).toHaveTextContent('Nombre: 0');
    });
  });

  it('devrait créer un personnage via le store', async () => {
    const user = userEvent.setup();

    render(
      <CharacterStoreProvider>
        <CharacterCreator />
      </CharacterStoreProvider>
    );

    const createBtn = screen.getByTestId('create-btn');
    await user.click(createBtn);

    await waitFor(() => {
      expect(screen.getByText('Test Hero')).toBeInTheDocument();
    });
  });

  it('devrait appliquer des dégâts à un personnage', async () => {
    const user = userEvent.setup();

    render(
      <CharacterStoreProvider>
        <CharacterCreator />
        <CharacterMutator />
      </CharacterStoreProvider>
    );

    // Créer le personnage
    await user.click(screen.getByTestId('create-btn'));

    await waitFor(() => {
      const heroes = screen.queryAllByText('Test Hero');
      expect(heroes.length).toBeGreaterThan(0);
    });

    // Vérifier PV initiaux
    await waitFor(() => {
      expect(screen.getByTestId('character-hp')).toHaveTextContent('PV: 20');
    });

    // Appliquer dégâts
    await user.click(screen.getByTestId('damage-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('character-hp')).toHaveTextContent('PV: 15');
    });
  });

  it('devrait mettre à jour les stats d\'un personnage', async () => {
    const user = userEvent.setup();

    render(
      <CharacterStoreProvider>
        <CharacterCreator />
        <CharacterMutator />
      </CharacterStoreProvider>
    );

    // Créer le personnage
    await user.click(screen.getByTestId('create-btn'));

    await waitFor(() => {
      const heroes = screen.queryAllByText('Test Hero');
      expect(heroes.length).toBeGreaterThan(0);
    });

    // Vérifier chance initiale
    await waitFor(() => {
      expect(screen.getByTestId('character-luck')).toHaveTextContent('Chance: 10');
    });

    // Augmenter la chance
    await user.click(screen.getByTestId('luck-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('character-luck')).toHaveTextContent('Chance: 11');
    });
  });

  it('devrait lancer une erreur si useCharacterStore est utilisé hors Provider', () => {
    // Supprimer les logs d'erreur React pour ce test
    const consoleError = console.error;
    console.error = () => {};

    expect(() => {
      render(<CharacterCounter />);
    }).toThrow('useCharacterStore must be used within CharacterStoreProvider');

    console.error = consoleError;
  });

  it('devrait partager l\'état entre plusieurs composants', async () => {
    const user = userEvent.setup();

    render(
      <CharacterStoreProvider>
        <CharacterCreator />
        <CharacterCounter />
      </CharacterStoreProvider>
    );

    // Attendre que le chargement soit terminé et récupérer le compte initial
    await waitFor(() => {
      expect(screen.queryByText('Chargement...')).not.toBeInTheDocument();
    });

    const initialCount = screen.getByTestId('character-count').textContent;
    const initialNumber = parseInt(initialCount?.match(/\d+/)?.[0] || '0');

    // Créer un personnage
    await user.click(screen.getByTestId('create-btn'));

    // Les deux composants voient le changement
    await waitFor(() => {
      const newCount = screen.getByTestId('character-count').textContent;
      const newNumber = parseInt(newCount?.match(/\d+/)?.[0] || '0');
      expect(newNumber).toBeGreaterThan(initialNumber);
      expect(screen.getAllByText('Test Hero').length).toBeGreaterThan(0);
    });
  });
});
