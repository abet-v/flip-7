import type { GameCard, ActionType, ModifierType } from '@/types/game'

let cardIdCounter = 0

function createNumberCard(value: number): GameCard {
  return {
    id: `num-${value}-${cardIdCounter++}`,
    type: 'number',
    value,
  }
}

function createModifierCard(modifier: ModifierType): GameCard {
  return {
    id: `mod-${modifier}-${cardIdCounter++}`,
    type: 'modifier',
    modifier,
  }
}

function createActionCard(action: ActionType): GameCard {
  return {
    id: `act-${action}-${cardIdCounter++}`,
    type: 'action',
    action,
  }
}

export function buildDeck(): GameCard[] {
  cardIdCounter = 0
  const cards: GameCard[] = []

  // Numbers (79 cards): value × count, except 0 has 1 copy
  // 12×12, 11×11, 10×10, 9×9, 8×8, 7×7, 6×6, 5×5, 4×4, 3×3, 2×2, 1×1, 0×1
  for (let value = 12; value >= 1; value--) {
    for (let i = 0; i < value; i++) {
      cards.push(createNumberCard(value))
    }
  }
  cards.push(createNumberCard(0)) // 0 × 1

  // Modifiers (6 cards): 1 each
  const modifiers: ModifierType[] = ['x2', '+2', '+4', '+6', '+8', '+10']
  for (const mod of modifiers) {
    cards.push(createModifierCard(mod))
  }

  // Actions (9 cards): 3 each
  const actions: ActionType[] = ['freeze', 'flip-three', 'second-chance']
  for (const action of actions) {
    for (let i = 0; i < 3; i++) {
      cards.push(createActionCard(action))
    }
  }

  return cards
}

export function shuffleDeck(cards: GameCard[]): GameCard[] {
  const shuffled = [...cards]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i]!, shuffled[j]!] = [shuffled[j]!, shuffled[i]!]
  }
  return shuffled
}
