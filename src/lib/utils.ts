import type { PlayerRoundState } from '@/types/game'

export function calculateScore(state: PlayerRoundState): number {
  if (state.isBusted) return 0

  // Sum number card values
  let sum = state.numberCards.reduce((acc, card) => acc + (card.value ?? 0), 0)

  // Apply x2 modifier first
  const hasX2 = state.modifierCards.some(c => c.modifier === 'x2')
  if (hasX2) {
    sum *= 2
  }

  // Apply bonus modifiers
  for (const card of state.modifierCards) {
    if (card.modifier && card.modifier !== 'x2') {
      const bonus = parseInt(card.modifier.replace('+', ''), 10)
      sum += bonus
    }
  }

  // Flip 7 bonus
  if (state.hasFlipSeven) {
    sum += 15
  }

  return sum
}

export function hasDuplicateNumber(state: PlayerRoundState, newValue: number): boolean {
  return state.numberCards.some(card => card.value === newValue)
}

export function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}
