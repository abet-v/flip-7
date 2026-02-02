export type CardType = 'number' | 'modifier' | 'action'
export type ActionType = 'freeze' | 'flip-three' | 'second-chance'
export type ModifierType = 'x2' | '+2' | '+4' | '+6' | '+8' | '+10'

export interface GameCard {
  id: string
  type: CardType
  value?: number
  action?: ActionType
  modifier?: ModifierType
}

export interface Player {
  id: string
  name: string
  totalScore: number
}

export interface PlayerRoundState {
  playerId: string
  numberCards: GameCard[]
  modifierCards: GameCard[]
  actionCards: GameCard[]
  hasSecondChance: boolean
  isActive: boolean
  hasStayed: boolean
  isBusted: boolean
  isFrozen: boolean
  roundScore: number
  hasFlipSeven: boolean
}

export type RoundPhase =
  | 'dealing'
  | 'player-turn'
  | 'resolving-action'
  | 'flip-three'
  | 'round-end'

export type GameStatus = 'setup' | 'playing' | 'round-summary' | 'game-over'

export interface GameSession {
  id: string
  status: GameStatus
  players: Player[]
  deck: GameCard[]
  discardPile: GameCard[]
  dealerIndex: number
  currentRound: number
  roundStates: PlayerRoundState[]
  currentPlayerIndex: number
  roundPhase: RoundPhase
  dealingPlayerIndex: number
  pendingAction?: {
    card: GameCard
    sourcePlayerIndex: number
  }
  flipThreeState?: {
    targetPlayerIndex: number
    cardsRemaining: number
    pendingActions: GameCard[]
  }
  roundHistory: RoundResult[]
}

export interface RoundResult {
  round: number
  scores: { playerId: string; score: number }[]
}

export interface GameSettings {
  targetScore: number
}
