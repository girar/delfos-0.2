// File: src/routes/delfos/game/components/DeckCard.ts

export class DeckCard {
  private cards: string[];
  private currentIndex: number;

  constructor(cards: string[]) {
    this.cards = cards;
    this.currentIndex = 0;
  }

  /**
   * Returns true if there are still cards remaining in the deck.
   */
  hasCards(): boolean {
    return this.currentIndex < this.cards.length;
  }

  /**
   * Returns the current card image URL (face) if available;
   * otherwise, returns null.
   */
  getCurrentFace(): string | null {
    return this.hasCards() ? this.cards[this.currentIndex] : null;
  }

  /**
   * Advances to the next card in the deck.
   */
  drawNextCard(): void {
    if (this.hasCards()) {
      this.currentIndex++;
    }
  }
}
