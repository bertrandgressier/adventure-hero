/**
 * Fonctions helper pour envoyer des événements personnalisés à Google Analytics
 */

// Vérifier si gtag est disponible
const isGtagAvailable = () => 
  typeof window !== 'undefined' && 
  typeof window.gtag === 'function';

/**
 * Envoyer un événement générique à Google Analytics
 */
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, string | number | boolean>
) => {
  if (!isGtagAvailable()) return;
  
  window.gtag('event', eventName, eventParams);
};

/**
 * Tracker la création d'un personnage
 */
export const trackCharacterCreation = (talent: string, stats: {
  dexterite: number;
  chance: number;
  pointsDeVieMax: number;
}) => {
  trackEvent('create_character', {
    event_category: 'character',
    talent: talent,
    dexterite: stats.dexterite,
    chance: stats.chance,
    hp_max: stats.pointsDeVieMax,
  });
};

/**
 * Tracker le lancement de dés
 */
export const trackDiceRoll = (
  diceType: string, // '1d6', '2d6', etc.
  result: number,
  context?: string // 'character_creation', 'combat', 'luck_test', etc.
) => {
  trackEvent('dice_roll', {
    event_category: 'gameplay',
    dice_type: diceType,
    result: result,
    context: context || 'general',
  });
};

/**
 * Tracker le début d'un combat
 */
export const trackCombatStart = (
  enemyName: string,
  playerStats: { habilete: number; endurance: number }
) => {
  trackEvent('combat_start', {
    event_category: 'combat',
    enemy: enemyName,
    player_habilete: playerStats.habilete,
    player_endurance: playerStats.endurance,
  });
};

/**
 * Tracker la fin d'un combat
 */
export const trackCombatEnd = (
  enemyName: string,
  result: 'victory' | 'defeat' | 'flee',
  roundsCount: number,
  remainingEndurance: number
) => {
  trackEvent('combat_end', {
    event_category: 'combat',
    enemy: enemyName,
    result: result,
    rounds: roundsCount,
    remaining_endurance: remainingEndurance,
  });
};

/**
 * Tracker un test de chance
 */
export const trackLuckTest = (
  success: boolean,
  currentLuck: number,
  context?: string
) => {
  trackEvent('luck_test', {
    event_category: 'gameplay',
    success: success ? 'yes' : 'no',
    current_luck: currentLuck,
    context: context || 'general',
  });
};

/**
 * Tracker l'export d'un personnage
 */
export const trackCharacterExport = (characterName: string) => {
  trackEvent('character_export', {
    event_category: 'character',
    character_name: characterName,
  });
};

/**
 * Tracker l'import d'un personnage
 */
export const trackCharacterImport = (characterName: string) => {
  trackEvent('character_import', {
    event_category: 'character',
    character_name: characterName,
  });
};

/**
 * Tracker la suppression d'un personnage
 */
export const trackCharacterDelete = (characterName: string) => {
  trackEvent('character_delete', {
    event_category: 'character',
    character_name: characterName,
  });
};

/**
 * Tracker la progression dans le livre
 */
export const trackProgress = (
  characterName: string,
  paragraph: number,
  totalParagraphs: number
) => {
  trackEvent('story_progress', {
    event_category: 'gameplay',
    character: characterName,
    paragraph: paragraph,
    completion_percentage: Math.round((paragraph / totalParagraphs) * 100),
  });
};
