import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  GameSession,
  GameSettings,
  GameCard,
  Player,
  PlayerRoundState,
  RoundPhase,
} from '@/types/game'
import { buildDeck, shuffleDeck } from '@/lib/deck'
import { calculateScore, hasDuplicateNumber, generateId } from '@/lib/utils'

interface GameStore {
  session: GameSession | null
  settings: GameSettings

  updateSettings: (settings: Partial<GameSettings>) => void
  createSession: (names: string[]) => void
  resetGame: () => void

  startRound: () => void
  endRound: () => void

  dealNextCard: () => GameCard | null
  resolveDealingAction: (targetIndex: number) => void
  skipDealingAction: () => void

  hitPlayer: () => GameCard | null
  stayPlayer: () => void
  advanceToNextPlayer: () => void

  resolveActionCard: (targetIndex: number) => void
  resolveFlipThreeCard: () => GameCard | null
  resolveFlipThreeAction: (targetIndex: number) => void
  skipFlipThreeAction: () => void
  useSecondChance: (discard: boolean) => void

  setRoundPhase: (phase: RoundPhase) => void
}

function createPlayerRoundState(playerId: string): PlayerRoundState {
  return {
    playerId,
    numberCards: [],
    modifierCards: [],
    actionCards: [],
    hasSecondChance: false,
    isActive: true,
    hasStayed: false,
    isBusted: false,
    isFrozen: false,
    roundScore: 0,
    hasFlipSeven: false,
  }
}

function findNextActivePlayer(
  roundStates: PlayerRoundState[],
  currentIndex: number,
): number {
  const len = roundStates.length
  for (let i = 1; i <= len; i++) {
    const idx = (currentIndex + i) % len
    const state = roundStates[idx]!
    if (state.isActive && !state.hasStayed && !state.isBusted && !state.isFrozen) {
      return idx
    }
  }
  return -1
}

function hasAnyActivePlayer(roundStates: PlayerRoundState[]): boolean {
  return roundStates.some(
    s => s.isActive && !s.hasStayed && !s.isBusted && !s.isFrozen,
  )
}

/**
 * Draw a card from the deck, reshuffling discard if needed.
 * Returns [card, updatedDeck, updatedDiscard] without mutating.
 */
function drawFromDeck(
  deck: GameCard[],
  discardPile: GameCard[],
): { card: GameCard; deck: GameCard[]; discardPile: GameCard[] } | null {
  let d = [...deck]
  let dp = [...discardPile]

  if (d.length === 0) {
    if (dp.length === 0) return null
    d = shuffleDeck(dp)
    dp = []
  }

  const card = d.pop()!
  return { card, deck: d, discardPile: dp }
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      session: null,
      settings: { targetScore: 200 },

      updateSettings: (partial) => {
        set((state) => ({
          settings: { ...state.settings, ...partial },
        }))
      },

      createSession: (names) => {
        const players: Player[] = names.map((name) => ({
          id: generateId(),
          name,
          totalScore: 0,
        }))
        const deck = shuffleDeck(buildDeck())
        const session: GameSession = {
          id: generateId(),
          status: 'playing',
          players,
          deck,
          discardPile: [],
          dealerIndex: 0,
          currentRound: 1,
          roundStates: players.map((p) => createPlayerRoundState(p.id)),
          currentPlayerIndex: 1 % players.length,
          roundPhase: 'dealing',
          dealingPlayerIndex: 1 % players.length,
          roundHistory: [],
        }
        set({ session })
      },

      resetGame: () => {
        set({ session: null })
      },

      startRound: () => {
        const { session } = get()
        if (!session) return
        let deck = [...session.deck]
        let discardPile = [...session.discardPile]
        if (deck.length === 0) {
          deck = shuffleDeck(discardPile)
          discardPile = []
        }
        if (deck.length < session.players.length * 2) {
          deck = shuffleDeck([...deck, ...discardPile])
          discardPile = []
        }
        const startIdx = (session.dealerIndex + 1) % session.players.length
        set({
          session: {
            ...session,
            status: 'playing',
            deck,
            discardPile,
            roundStates: session.players.map((p) => createPlayerRoundState(p.id)),
            currentPlayerIndex: startIdx,
            roundPhase: 'dealing',
            dealingPlayerIndex: startIdx,
            pendingAction: undefined,
            flipThreeState: undefined,
          },
        })
      },

      endRound: () => {
        const { session, settings } = get()
        if (!session) return

        const roundStates = session.roundStates.map((rs) => {
          const score = calculateScore(rs)
          return { ...rs, roundScore: score }
        })

        const players = session.players.map((p) => {
          const rs = roundStates.find((r) => r.playerId === p.id)
          return { ...p, totalScore: p.totalScore + (rs?.roundScore ?? 0) }
        })

        const roundResult = {
          round: session.currentRound,
          scores: roundStates.map((rs) => ({
            playerId: rs.playerId,
            score: rs.roundScore,
          })),
        }

        const anyoneWon = players.some((p) => p.totalScore >= settings.targetScore)

        set({
          session: {
            ...session,
            players,
            roundStates,
            roundHistory: [...session.roundHistory, roundResult],
            currentRound: session.currentRound + 1,
            dealerIndex: (session.dealerIndex + 1) % session.players.length,
            status: anyoneWon ? 'game-over' : 'round-summary',
            roundPhase: 'round-end',
          },
        })
      },

      dealNextCard: () => {
        const { session } = get()
        if (!session) return null

        const draw = drawFromDeck(session.deck, session.discardPile)
        if (!draw) return null

        const { card } = draw
        let { deck, discardPile } = draw

        const idx = session.dealingPlayerIndex
        const roundStates = [...session.roundStates]
        const playerState = { ...roundStates[idx]! }

        if (card.type === 'number') {
          playerState.numberCards = [...playerState.numberCards, card]
          if (playerState.numberCards.length >= 7) {
            playerState.hasFlipSeven = true
          }
          roundStates[idx] = playerState

          const nextDealIdx = (idx + 1) % roundStates.length
          const allDealt = roundStates.every((s) => s.numberCards.length >= 1 || !s.isActive)
          const startIdx = (session.dealerIndex + 1) % session.players.length
          const isBackToStart =
            nextDealIdx === startIdx && roundStates[nextDealIdx]!.numberCards.length >= 1

          if (allDealt && isBackToStart) {
            set({
              session: {
                ...session,
                deck,
                discardPile,
                roundStates,
                roundPhase: 'player-turn',
                currentPlayerIndex: startIdx,
              },
            })
          } else {
            set({
              session: {
                ...session,
                deck,
                discardPile,
                roundStates,
                dealingPlayerIndex: nextDealIdx,
              },
            })
          }
          return card
        }

        if (card.type === 'modifier') {
          playerState.modifierCards = [...playerState.modifierCards, card]
          roundStates[idx] = playerState
          set({
            session: {
              ...session,
              deck,
              discardPile,
              roundStates,
            },
          })
          return card
        }

        if (card.type === 'action') {
          playerState.actionCards = [...playerState.actionCards, card]

          if (card.action === 'second-chance') {
            playerState.hasSecondChance = true
            roundStates[idx] = playerState
            set({
              session: {
                ...session,
                deck,
                discardPile,
                roundStates,
              },
            })
            return card
          }

          roundStates[idx] = playerState
          set({
            session: {
              ...session,
              deck,
              discardPile,
              roundStates,
              pendingAction: {
                card,
                sourcePlayerIndex: idx,
              },
            },
          })
          return card
        }

        return card
      },

      resolveDealingAction: (targetIndex) => {
        const { session } = get()
        if (!session?.pendingAction) return

        const { card } = session.pendingAction
        const roundStates = [...session.roundStates]

        if (card.action === 'freeze') {
          const target = { ...roundStates[targetIndex]! }
          target.isFrozen = true
          target.isActive = false
          target.roundScore = calculateScore(target)
          roundStates[targetIndex] = target

          set({
            session: {
              ...session,
              roundStates,
              pendingAction: undefined,
            },
          })
          return
        }

        if (card.action === 'flip-three') {
          set({
            session: {
              ...session,
              roundStates,
              pendingAction: undefined,
              flipThreeState: {
                targetPlayerIndex: targetIndex,
                cardsRemaining: 3,
                pendingActions: [],
              },
              roundPhase: 'flip-three',
            },
          })
          return
        }

        set({
          session: {
            ...session,
            roundStates,
            pendingAction: undefined,
          },
        })
      },

      skipDealingAction: () => {
        const { session } = get()
        if (!session?.pendingAction) return
        set({
          session: {
            ...session,
            pendingAction: undefined,
          },
        })
      },

      setRoundPhase: (phase) => {
        const { session } = get()
        if (!session) return
        set({ session: { ...session, roundPhase: phase } })
      },

      hitPlayer: () => {
        const { session } = get()
        if (!session) return null

        const draw = drawFromDeck(session.deck, session.discardPile)
        if (!draw) return null

        const { card } = draw
        const { deck, discardPile } = draw

        const idx = session.currentPlayerIndex
        const roundStates = [...session.roundStates]
        const playerState = { ...roundStates[idx]! }

        if (card.type === 'number') {
          if (hasDuplicateNumber(playerState, card.value!)) {
            if (playerState.hasSecondChance) {
              playerState.numberCards = [...playerState.numberCards, card]
              roundStates[idx] = playerState
              set({
                session: {
                  ...session,
                  deck,
                  discardPile,
                  roundStates,
                  pendingAction: {
                    card,
                    sourcePlayerIndex: idx,
                  },
                  roundPhase: 'resolving-action',
                },
              })
              return card
            }
            playerState.isBusted = true
            playerState.isActive = false
            playerState.numberCards = [...playerState.numberCards, card]
            playerState.roundScore = 0
            roundStates[idx] = playerState
          } else {
            playerState.numberCards = [...playerState.numberCards, card]
            if (playerState.numberCards.length >= 7) {
              playerState.hasFlipSeven = true
              playerState.isActive = false
              playerState.hasStayed = true
            }
            roundStates[idx] = playerState
          }

          set({ session: { ...session, deck, discardPile, roundStates } })
          return card
        }

        if (card.type === 'modifier') {
          playerState.modifierCards = [...playerState.modifierCards, card]
          roundStates[idx] = playerState
          set({ session: { ...session, deck, discardPile, roundStates } })
          return card
        }

        if (card.type === 'action') {
          playerState.actionCards = [...playerState.actionCards, card]

          if (card.action === 'second-chance') {
            playerState.hasSecondChance = true
            roundStates[idx] = playerState
            set({ session: { ...session, deck, discardPile, roundStates } })
            return card
          }

          roundStates[idx] = playerState
          set({
            session: {
              ...session,
              deck,
              discardPile,
              roundStates,
              pendingAction: {
                card,
                sourcePlayerIndex: idx,
              },
              roundPhase: 'resolving-action',
            },
          })
          return card
        }

        return card
      },

      stayPlayer: () => {
        const { session } = get()
        if (!session) return

        const idx = session.currentPlayerIndex
        const roundStates = [...session.roundStates]
        const playerState = { ...roundStates[idx]! }
        playerState.hasStayed = true
        playerState.isActive = false
        playerState.roundScore = calculateScore(playerState)
        roundStates[idx] = playerState

        set({ session: { ...session, roundStates } })
      },

      advanceToNextPlayer: () => {
        const { session } = get()
        if (!session) return

        if (!hasAnyActivePlayer(session.roundStates)) {
          set({
            session: { ...session, roundPhase: 'round-end' },
          })
          return
        }

        const next = findNextActivePlayer(
          session.roundStates,
          session.currentPlayerIndex,
        )
        if (next === -1) {
          set({
            session: { ...session, roundPhase: 'round-end' },
          })
          return
        }

        set({
          session: {
            ...session,
            currentPlayerIndex: next,
            roundPhase: 'player-turn',
          },
        })
      },

      resolveActionCard: (targetIndex) => {
        const { session } = get()
        if (!session?.pendingAction) return

        const { card } = session.pendingAction
        const roundStates = [...session.roundStates]

        if (card.action === 'freeze') {
          const target = { ...roundStates[targetIndex]! }
          target.isFrozen = true
          target.isActive = false
          target.roundScore = calculateScore(target)
          roundStates[targetIndex] = target

          set({
            session: {
              ...session,
              roundStates,
              pendingAction: undefined,
              roundPhase: 'player-turn',
            },
          })
          return
        }

        if (card.action === 'flip-three') {
          set({
            session: {
              ...session,
              roundStates,
              pendingAction: undefined,
              flipThreeState: {
                targetPlayerIndex: targetIndex,
                cardsRemaining: 3,
                pendingActions: [],
              },
              roundPhase: 'flip-three',
            },
          })
          return
        }
      },

      resolveFlipThreeCard: () => {
        const { session } = get()
        if (!session?.flipThreeState) return null

        const draw = drawFromDeck(session.deck, session.discardPile)
        if (!draw) return null

        const { card } = draw
        let { deck, discardPile } = draw

        const { targetPlayerIndex, cardsRemaining } = session.flipThreeState
        const roundStates = [...session.roundStates]
        const playerState = { ...roundStates[targetPlayerIndex]! }

        if (card.type === 'number') {
          if (hasDuplicateNumber(playerState, card.value!) && !playerState.hasSecondChance) {
            playerState.isBusted = true
            playerState.isActive = false
            playerState.numberCards = [...playerState.numberCards, card]
            playerState.roundScore = 0
            roundStates[targetPlayerIndex] = playerState
          } else if (hasDuplicateNumber(playerState, card.value!) && playerState.hasSecondChance) {
            playerState.hasSecondChance = false
            discardPile = [...discardPile, card]
            roundStates[targetPlayerIndex] = playerState
            set({
              session: {
                ...session,
                deck,
                discardPile,
                roundStates,
                flipThreeState: {
                  ...session.flipThreeState,
                  cardsRemaining: cardsRemaining - 1,
                  pendingActions: session.flipThreeState.pendingActions,
                },
              },
            })
            return card
          } else {
            playerState.numberCards = [...playerState.numberCards, card]
            if (playerState.numberCards.length >= 7) {
              playerState.hasFlipSeven = true
              playerState.isActive = false
              playerState.hasStayed = true
            }
          }
          roundStates[targetPlayerIndex] = playerState
        } else if (card.type === 'modifier') {
          playerState.modifierCards = [...playerState.modifierCards, card]
          roundStates[targetPlayerIndex] = playerState
        } else if (card.type === 'action') {
          playerState.actionCards = [...playerState.actionCards, card]
          if (card.action === 'second-chance') {
            playerState.hasSecondChance = true
          }
          roundStates[targetPlayerIndex] = playerState
        }

        const remaining = cardsRemaining - 1

        set({
          session: {
            ...session,
            deck,
            discardPile,
            roundStates,
            flipThreeState: {
              ...session.flipThreeState,
              cardsRemaining: remaining,
              pendingActions: session.flipThreeState.pendingActions,
            },
          },
        })

        return card
      },

      resolveFlipThreeAction: (targetIndex) => {
        const { session } = get()
        if (!session?.flipThreeState) return
        const pa = session.flipThreeState.pendingActions
        if (pa.length === 0) return
        const card = pa[0]!
        const rest = pa.slice(1)
        const roundStates = [...session.roundStates]

        if (card.action === 'freeze') {
          const target = { ...roundStates[targetIndex]! }
          target.isFrozen = true
          target.isActive = false
          target.roundScore = calculateScore(target)
          roundStates[targetIndex] = target
        }

        set({
          session: {
            ...session,
            roundStates,
            flipThreeState: {
              ...session.flipThreeState,
              pendingActions: rest,
            },
          },
        })
      },

      skipFlipThreeAction: () => {
        const { session } = get()
        if (!session?.flipThreeState) return
        set({
          session: {
            ...session,
            flipThreeState: undefined,
            roundPhase: 'player-turn',
          },
        })
      },

      useSecondChance: (discard) => {
        const { session } = get()
        if (!session?.pendingAction) return

        const idx = session.pendingAction.sourcePlayerIndex
        const roundStates = [...session.roundStates]
        const playerState = { ...roundStates[idx]! }

        if (discard) {
          const dupCard = session.pendingAction.card
          playerState.numberCards = playerState.numberCards.filter(
            (c) => c.id !== dupCard.id,
          )
          playerState.hasSecondChance = false
          roundStates[idx] = playerState

          set({
            session: {
              ...session,
              roundStates,
              discardPile: [...session.discardPile, dupCard],
              pendingAction: undefined,
              roundPhase: 'player-turn',
            },
          })
        } else {
          playerState.isBusted = true
          playerState.isActive = false
          playerState.roundScore = 0
          roundStates[idx] = playerState

          set({
            session: {
              ...session,
              roundStates,
              pendingAction: undefined,
              roundPhase: 'player-turn',
            },
          })
        }
      },
    }),
    {
      name: 'flip7-game',
      partialize: (state) => ({
        session: state.session,
        settings: state.settings,
      }),
    },
  ),
)
