export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainError';
  }
}

export class CharacterNotFoundError extends DomainError {
  constructor(id: string) {
    super(`Le personnage avec l'ID ${id} n'existe pas`);
    this.name = 'CharacterNotFoundError';
  }
}
