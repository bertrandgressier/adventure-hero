/**
 * Tests d'intégration pour vérifier le flux complet:
 * Hook → Service → Repository → IndexedDB
 * 
 * Ces tests utilisent une vraie base IndexedDB (via happy-dom)
 * pour valider l'intégration complète.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { CharacterService } from '@/src/application/services/CharacterService';
import { IndexedDBCharacterRepository } from '@/src/infrastructure/repositories/IndexedDBCharacterRepository';
import { Character } from '@/src/domain/entities/Character';

describe('Integration: CharacterService + IndexedDBRepository', () => {
  let service: CharacterService;
  let repository: IndexedDBCharacterRepository;

  beforeEach(async () => {
    // Créer une nouvelle instance pour chaque test
    repository = new IndexedDBCharacterRepository();
    service = new CharacterService(repository);
  });

  it('devrait créer et récupérer un personnage', async () => {
    // Créer
    const created = await service.createCharacter({
      name: 'Gandalf',
      book: 'La Harpe des Quatre Saisons',
      talent: 'instinct',
      stats: {
        dexterite: 7,
        chance: 5,
        chanceInitiale: 5,
        pointsDeVieMax: 32,
        pointsDeVieActuels: 32,
      },
    });

    expect(created.name).toBe('Gandalf');

    // Récupérer
    const retrieved = await service.getCharacter(created.id);
    
    expect(retrieved).not.toBeNull();
    expect(retrieved?.name).toBe('Gandalf');
    expect(retrieved?.getStats().dexterite).toBe(7);
  });

  it('devrait persister les modifications de stats', async () => {
    // Créer
    const character = await service.createCharacter({
      name: 'Aragorn',
      book: 'La Harpe des Quatre Saisons',
      talent: 'discretion',
      stats: {
        dexterite: 8,
        chance: 6,
        chanceInitiale: 6,
        pointsDeVieMax: 36,
        pointsDeVieActuels: 36,
      },
    });

    // Modifier
    const updated = await service.updateCharacterStats(character.id, {
      dexterite: 10,
    });

    expect(updated.getStats().dexterite).toBe(10);

    // Vérifier persistance
    const retrieved = await service.getCharacter(character.id);
    expect(retrieved?.getStats().dexterite).toBe(10);
  });

  it('devrait persister les dégâts', async () => {
    const character = await service.createCharacter({
      name: 'Legolas',
      book: 'La Harpe des Quatre Saisons',
      talent: 'discretion',
      stats: {
        dexterite: 9,
        chance: 7,
        chanceInitiale: 7,
        pointsDeVieMax: 40,
        pointsDeVieActuels: 40,
      },
    });

    // Appliquer dégâts
    await service.applyDamage(character.id, 15);

    // Vérifier persistance
    const retrieved = await service.getCharacter(character.id);
    expect(retrieved?.getStats().pointsDeVieActuels).toBe(25);
  });

  it('devrait persister les soins', async () => {
    const character = await service.createCharacter({
      name: 'Gimli',
      book: 'La Harpe des Quatre Saisons',
      talent: 'instinct',
      stats: {
        dexterite: 6,
        chance: 4,
        chanceInitiale: 4,
        pointsDeVieMax: 30,
        pointsDeVieActuels: 15,
      },
    });

    // Soigner
    await service.healCharacter(character.id, 10);

    // Vérifier persistance
    const retrieved = await service.getCharacter(character.id);
    expect(retrieved?.getStats().pointsDeVieActuels).toBe(25);
  });

  it('devrait persister l\'équipement d\'arme', async () => {
    const character = await service.createCharacter({
      name: 'Boromir',
      book: 'La Harpe des Quatre Saisons',
      talent: 'instinct',
      stats: {
        dexterite: 7,
        chance: 5,
        chanceInitiale: 5,
        pointsDeVieMax: 32,
        pointsDeVieActuels: 32,
      },
    });

    // Équiper arme
    await service.equipWeapon(character.id, {
      name: 'Épée de Gondor',
      attackPoints: 4,
    });

    // Vérifier persistance
    const retrieved = await service.getCharacter(character.id);
    expect(retrieved?.getInventory().weapon).toEqual({
      name: 'Épée de Gondor',
      attackPoints: 4,
    });
  });

  it('devrait persister l\'ajout d\'objets', async () => {
    const character = await service.createCharacter({
      name: 'Sam',
      book: 'La Harpe des Quatre Saisons',
      talent: 'discretion',
      stats: {
        dexterite: 5,
        chance: 8,
        chanceInitiale: 8,
        pointsDeVieMax: 28,
        pointsDeVieActuels: 28,
      },
    });

    // Ajouter objets
    await service.addItemToInventory(character.id, {
      name: 'Corde',
      possessed: true,
      type: 'item',
    });

    await service.addItemToInventory(character.id, {
      name: 'Potion',
      possessed: true,
      type: 'item',
    });

    // Vérifier persistance
    const retrieved = await service.getCharacter(character.id);
    const items = retrieved?.getInventory().items || [];
    
    expect(items).toHaveLength(2);
    expect(items[0].name).toBe('Corde');
    expect(items[1].name).toBe('Potion');
  });

  it('devrait persister le changement de paragraphe', async () => {
    const character = await service.createCharacter({
      name: 'Frodo',
      book: 'La Harpe des Quatre Saisons',
      talent: 'instinct',
      stats: {
        dexterite: 6,
        chance: 9,
        chanceInitiale: 9,
        pointsDeVieMax: 30,
        pointsDeVieActuels: 30,
      },
    });

    // Aller à différents paragraphes
    await service.goToParagraph(character.id, 42);
    await service.goToParagraph(character.id, 105);

    // Vérifier persistance
    const retrieved = await service.getCharacter(character.id);
    const progress = retrieved?.getProgress();
    
    expect(progress?.currentParagraph).toBe(105);
    expect(progress?.history).toEqual([1, 42, 105]);
  });

  it('devrait lister plusieurs personnages', async () => {
    // Créer 3 personnages
    await service.createCharacter({
      name: 'Gandalf',
      book: 'La Harpe des Quatre Saisons',
      talent: 'instinct',
      stats: {
        dexterite: 7,
        chance: 5,
        chanceInitiale: 5,
        pointsDeVieMax: 32,
        pointsDeVieActuels: 32,
      },
    });

    await service.createCharacter({
      name: 'Aragorn',
      book: 'La Harpe des Quatre Saisons',
      talent: 'discretion',
      stats: {
        dexterite: 8,
        chance: 6,
        chanceInitiale: 6,
        pointsDeVieMax: 36,
        pointsDeVieActuels: 36,
      },
    });

    await service.createCharacter({
      name: 'Legolas',
      book: 'La Harpe des Quatre Saisons',
      talent: 'discretion',
      stats: {
        dexterite: 9,
        chance: 7,
        chanceInitiale: 7,
        pointsDeVieMax: 40,
        pointsDeVieActuels: 40,
      },
    });

    // Lister
    const all = await service.getAllCharacters();
    
    // Devrait avoir au moins les 3 créés
    expect(all.length).toBeGreaterThanOrEqual(3);
    
    const names = all.map(c => c.name);
    expect(names).toContain('Gandalf');
    expect(names).toContain('Aragorn');
    expect(names).toContain('Legolas');
  });

  it('devrait dupliquer un personnage avec persistance', async () => {
    const original = await service.createCharacter({
      name: 'Gandalf',
      book: 'La Harpe des Quatre Saisons',
      talent: 'instinct',
      stats: {
        dexterite: 7,
        chance: 5,
        chanceInitiale: 5,
        pointsDeVieMax: 32,
        pointsDeVieActuels: 32,
      },
    });

    // Modifier l'original
    await service.equipWeapon(original.id, {
      name: 'Glamdring',
      attackPoints: 5,
    });

    // Dupliquer
    const copy = await service.duplicateCharacter(original.id);

    // Vérifier que la copie existe en DB
    const retrieved = await service.getCharacter(copy.id);
    
    expect(retrieved).not.toBeNull();
    expect(retrieved?.name).toBe('Gandalf (Copie)');
    expect(retrieved?.getStats().dexterite).toBe(7);
    
    // Les deux doivent exister
    const all = await service.getAllCharacters();
    const hasOriginal = all.some(c => c.id === original.id);
    const hasCopy = all.some(c => c.id === copy.id);
    
    expect(hasOriginal).toBe(true);
    expect(hasCopy).toBe(true);
  });

  it('devrait supprimer un personnage', async () => {
    const character = await service.createCharacter({
      name: 'Test Delete',
      book: 'La Harpe des Quatre Saisons',
      talent: 'instinct',
      stats: {
        dexterite: 5,
        chance: 5,
        chanceInitiale: 5,
        pointsDeVieMax: 20,
        pointsDeVieActuels: 20,
      },
    });

    // Vérifier qu'il existe
    let retrieved = await service.getCharacter(character.id);
    expect(retrieved).not.toBeNull();

    // Supprimer
    await service.deleteCharacter(character.id);

    // Vérifier qu'il n'existe plus
    retrieved = await service.getCharacter(character.id);
    expect(retrieved).toBeNull();
  });
});
