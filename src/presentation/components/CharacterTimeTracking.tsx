'use client';

import { Clock } from 'lucide-react';
import { useCharacter } from '@/src/presentation/hooks/useCharacter';
import EditableStatField from '@/src/presentation/components/EditableStatField';

interface CharacterTimeTrackingProps {
  characterId: string;
  onUpdate?: () => void;
}

/**
 * Composant pour gérer le suivi du temps dans le Tome 2
 * - Jours écoulés (0-4) avec jauge visuelle
 * - Prochain réveil (numéro de paragraphe optionnel)
 */
export default function CharacterTimeTracking({ characterId, onUpdate }: CharacterTimeTrackingProps) {
  const { character, isLoading, error, updateDaysElapsed, updateNextWakeUpParagraph } = useCharacter(characterId);

  const handleUpdateDays = async (newValue: number | null) => {
    if (newValue === null || newValue < 0 || newValue > 4) return;
    await updateDaysElapsed(newValue);
    onUpdate?.();
  };

  const handleUpdateWakeUp = async (newValue: number | null) => {
    await updateNextWakeUpParagraph(newValue === null ? undefined : newValue);
    onUpdate?.();
  };

  if (isLoading) {
    return (
      <div className="bg-card glow-border rounded-lg p-6">
        <p className="text-muted-light text-center">Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card glow-border rounded-lg p-6">
        <p className="text-red-400 text-center">Erreur: {error}</p>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="bg-card glow-border rounded-lg p-6">
        <p className="text-muted-light text-center">Personnage non trouvé</p>
      </div>
    );
  }

  const progress = character.getProgress();
  const daysElapsed = progress.daysElapsed ?? 0;
  const nextWakeUpParagraph = progress.nextWakeUpParagraph ?? null;

  return (
    <div className="bg-card glow-border rounded-lg p-6">
      <h2 className="font-[var(--font-uncial)] text-xl tracking-wide text-light mb-4">
        Suivi du temps
      </h2>

      <div className="space-y-4">
        {/* Jours écoulés avec jauge */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="font-[var(--font-merriweather)] text-muted-light text-sm">
              Jours écoulés
            </label>
            <div
              onClick={() => {
                const newValue = prompt('Jours écoulés (0-4):', daysElapsed.toString());
                if (newValue !== null) {
                  const parsed = parseInt(newValue);
                  if (!isNaN(parsed) && parsed >= 0 && parsed <= 4) {
                    handleUpdateDays(parsed);
                  }
                }
              }}
              className="font-[var(--font-geist-mono)] text-2xl text-primary hover:text-yellow-300 cursor-pointer transition-colors"
              title="Cliquer pour modifier"
            >
              {daysElapsed}/4
            </div>
          </div>

          {/* Jauge visuelle */}
          <div className="relative h-10 bg-background rounded-lg overflow-hidden border border-primary/30">
            <div
              className={`h-full transition-all duration-300 ${
                daysElapsed === 4 
                  ? 'bg-gradient-to-r from-red-600 to-red-800' 
                  : 'bg-gradient-to-r from-primary to-amber-600'
              }`}
              style={{ width: `${(daysElapsed / 4) * 100}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-evenly px-4">
              {[1, 2, 3, 4].map((day) => (
                <button
                  key={day}
                  onClick={() => handleUpdateDays(day)}
                  className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center hover:scale-110 active:scale-95 ${
                    day <= daysElapsed
                      ? 'border-primary-foreground bg-primary-foreground/20 shadow-md hover:bg-primary-foreground/40'
                      : 'border-muted-light/40 bg-background/50 hover:border-primary/50 hover:bg-primary/10'
                  }`}
                  title={`Définir à ${day} jour${day > 1 ? 's' : ''}`}
                >
                  <span className={`text-xs font-bold ${
                    day <= daysElapsed 
                      ? 'text-primary-foreground' 
                      : 'text-muted-light'
                  }`}>
                    {day}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <p className="text-xs text-muted-light mt-1 italic">
            Cliquez sur un jour pour définir le nombre de jours écoulés
          </p>
        </div>

        {/* Prochain réveil */}
        <EditableStatField
          label="PROCHAIN RÉVEIL"
          value={nextWakeUpParagraph}
          onSave={handleUpdateWakeUp}
          min={1}
          icon={<Clock className="size-4" />}
          placeholder="-"
        />
      </div>
    </div>
  );
}
