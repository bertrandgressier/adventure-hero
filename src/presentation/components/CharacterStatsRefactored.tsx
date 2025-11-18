'use client';

import { useCharacter } from '@/src/presentation/hooks/useCharacter';
import EditableStatField from '@/src/presentation/components/EditableStatField';

interface CharacterStatsProps {
  characterId: string;
}

/**
 * Composant refactorisé avec Clean Architecture.
 * 
 * Avant: 8 useState + 4 useRef + logique métier dupliquée
 * Après: 1 hook useCharacter qui encapsule tout
 * 
 * Avantages:
 * - Code réduit de ~300 lignes à ~70 lignes
 * - Logique métier testable (dans Character entity)
 * - Composant réutilisable (EditableStatField)
 * - Pas de duplication de updatedAt
 */
export default function CharacterStats({ characterId }: CharacterStatsProps) {
  const { character, isLoading, error, updateStats } = useCharacter(characterId);

  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-light">
        Chargement...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-400">
        Erreur: {error}
      </div>
    );
  }

  if (!character) {
    return (
      <div className="text-center py-8 text-muted-light">
        Personnage non trouvé
      </div>
    );
  }

  const stats = character.getStatsObject();
  const statsData = stats.toData();

  // Couleur pour les PV actuels
  const pvColor = stats.isDead()
    ? 'text-red-400'
    : stats.isCriticalHealth()
      ? 'text-orange-400'
      : 'text-primary';

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <EditableStatField
        label="DEXTÉRITÉ"
        value={statsData.dexterite}
        onSave={(value) => updateStats({ dexterite: value })}
        min={1}
      />

      <EditableStatField
        label="CHANCE"
        value={statsData.chance}
        onSave={(value) => updateStats({ chance: value })}
        min={0}
      />

      <EditableStatField
        label="PV MAX"
        value={statsData.pointsDeVieMax}
        onSave={(value) => updateStats({ pointsDeVieMax: value })}
        min={1}
      />

      <EditableStatField
        label="PV ACTUELS"
        value={statsData.pointsDeVieActuels}
        onSave={(value) => updateStats({ pointsDeVieActuels: value })}
        min={0}
        colorClass={pvColor}
      />
    </div>
  );
}
