import type { GameMode } from '@/src/domain/entities/Character';

const GAME_MODE_CONFIG: Record<GameMode, { icon: string; label: string; description: string; details: string }> = {
  narrative: {
    icon: '📖',
    label: 'Narratif',
    description: 'Mode histoire',
    details: 'Mode histoire pour profiter du récit sans difficulté. Les combats sont gagnés automatiquement.',
  },
  simplified: {
    icon: '⚔️',
    label: 'Simplifié',
    description: 'Mode normal',
    details: 'Mode équilibré avec combats réels. Vous pouvez créer des sauvegardes manuelles (copies) quand le livre le permet.',
  },
  mortal: {
    icon: '💀',
    label: 'Mortel',
    description: 'Mode hardcore',
    details: 'Mode difficile avec une seule vie. Aucune sauvegarde manuelle possible, chaque décision compte !',
  },
};

interface GameModeBadgeProps {
  gameMode: GameMode;
  showLabel?: boolean;
  clickable?: boolean;
  onClick?: (event: React.MouseEvent) => void;
  className?: string;
}

export function GameModeBadge({ gameMode, showLabel = false, clickable = false, onClick, className = '' }: GameModeBadgeProps) {
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
  
  const baseClasses = `inline-flex items-center justify-center w-6 h-6 text-base ${className}`;
  const interactiveClasses = clickable ? 'cursor-pointer hover:scale-125 transition-transform' : '';
  
  return (
    <span 
      className={`${baseClasses} ${interactiveClasses}`}
      title={`${config.label} - ${config.description}`}
      onClick={onClick}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={clickable ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick?.(e as unknown as React.MouseEvent); } } : undefined}
    >
      {config.icon}
    </span>
  );
}

export { GAME_MODE_CONFIG };
