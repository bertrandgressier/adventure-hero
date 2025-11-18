export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainError';
  }
}

export class CharacterNotFoundError extends DomainError {
  constructor(id: string) {
    super(`Character with id ${id} not found`);
    this.name = 'CharacterNotFoundError';
  }
}
