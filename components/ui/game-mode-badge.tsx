import type { GameMode } from '@/src/domain/entities/Character';

const GAME_MODE_CONFIG: Record<GameMode, { icon: string; label: string; description: string }> = {
  narrative: {
    icon: '📖',
    label: 'Narratif',
    description: 'Mode histoire',
  },
  simplified: {
    icon: '⚔️',
    label: 'Simplifié',
    description: 'Mode normal',
  },
  mortal: {
    icon: '💀',
    label: 'Mortel',
    description: 'Mode hardcore',
  },
};

interface GameModeBadgeProps {
  gameMode: GameMode;
  showLabel?: boolean;
  className?: string;
}

export function GameModeBadge({ gameMode, showLabel = false, className = '' }: GameModeBadgeProps) {
  const config = GAME_MODE_CONFIG[gameMode];
  
  if (showLabel) {
    return (
      <span 
        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-background/50 border border-primary/30 text-xs font-[var(--font-merriweather)] text-muted-light ${className}`}
        title={config.description}
      >
        <span>{config.icon}</span>
        <span>{config.label}</span>
      </span>
    );
  }
  
  return (
    <span 
      className={`inline-flex items-center justify-center w-6 h-6 text-base ${className}`}
      title={`${config.label} - ${config.description}`}
    >
      {config.icon}
    </span>
  );
}
