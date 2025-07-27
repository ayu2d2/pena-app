// ポーカーカードとゲームロジック

export interface Card {
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades'
  rank: 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K'
  value: number // A=1, 2-10=face value, J=11, Q=12, K=13
}

export interface Hand {
  cards: Card[]
  rank: HandRank
  rankValue: number
}

export type HandRank = 
  | 'high-card'
  | 'pair'
  | 'two-pair'
  | 'three-of-a-kind'
  | 'straight'
  | 'flush'
  | 'full-house'
  | 'four-of-a-kind'
  | 'straight-flush'
  | 'royal-flush'

export interface Player {
  id: string
  name: string
  chips: number
  holeCards: Card[]
  currentBet: number
  status: 'active' | 'folded' | 'all-in' | 'out'
  isDealer: boolean
  isCPU: boolean
}

export interface GameState {
  players: Player[]
  communityCards: Card[]
  pot: number
  currentPlayerIndex: number
  phase: 'preflop' | 'flop' | 'turn' | 'river' | 'showdown' | 'finished'
  smallBlind: number
  bigBlind: number
  deck: Card[]
}

// デッキを作成
export function createDeck(): Card[] {
  const suits: Card['suit'][] = ['hearts', 'diamonds', 'clubs', 'spades']
  const ranks: Card['rank'][] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
  const deck: Card[] = []

  for (const suit of suits) {
    for (const rank of ranks) {
      let value: number
      if (rank === 'A') value = 1
      else if (rank === 'J') value = 11
      else if (rank === 'Q') value = 12
      else if (rank === 'K') value = 13
      else value = parseInt(rank)

      deck.push({ suit, rank, value })
    }
  }

  return shuffleDeck(deck)
}

// デッキをシャッフル
export function shuffleDeck(deck: Card[]): Card[] {
  const newDeck = [...deck]
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]]
  }
  return newDeck
}

// カードを配る
export function dealCard(deck: Card[]): { card: Card; remainingDeck: Card[] } {
  if (deck.length === 0) {
    throw new Error('デッキにカードがありません')
  }
  const card = deck[0]
  const remainingDeck = deck.slice(1)
  return { card, remainingDeck }
}

// ハンドの強さを評価
export function evaluateHand(holeCards: Card[], communityCards: Card[]): Hand {
  const allCards = [...holeCards, ...communityCards]
  const bestHand = findBestHand(allCards)
  return bestHand
}

// 7枚から最高の5枚を見つける
function findBestHand(cards: Card[]): Hand {
  const combinations = getCombinations(cards, 5)
  let bestHand: Hand = {
    cards: combinations[0],
    rank: 'high-card',
    rankValue: 0
  }

  for (const combination of combinations) {
    const hand = evaluateFiveCards(combination)
    if (hand.rankValue > bestHand.rankValue) {
      bestHand = hand
    }
  }

  return bestHand
}

// 5枚のカードの組み合わせを取得
function getCombinations(cards: Card[], k: number): Card[][] {
  if (k === 1) return cards.map(card => [card])
  if (k === cards.length) return [cards]
  
  const combinations: Card[][] = []
  for (let i = 0; i <= cards.length - k; i++) {
    const head = cards[i]
    const tail = cards.slice(i + 1)
    const tailCombinations = getCombinations(tail, k - 1)
    for (const tailCombination of tailCombinations) {
      combinations.push([head, ...tailCombination])
    }
  }
  return combinations
}

// 5枚のカードを評価
function evaluateFiveCards(cards: Card[]): Hand {
  const sortedCards = [...cards].sort((a, b) => a.value - b.value)
  
  // ロイヤルフラッシュ
  if (isRoyalFlush(sortedCards)) {
    return { cards: sortedCards, rank: 'royal-flush', rankValue: 9000 }
  }
  
  // ストレートフラッシュ
  const straightFlushValue = getStraightFlushValue(sortedCards)
  if (straightFlushValue > 0) {
    return { cards: sortedCards, rank: 'straight-flush', rankValue: 8000 + straightFlushValue }
  }
  
  // フォーカード
  const fourOfAKindValue = getFourOfAKindValue(sortedCards)
  if (fourOfAKindValue > 0) {
    return { cards: sortedCards, rank: 'four-of-a-kind', rankValue: 7000 + fourOfAKindValue }
  }
  
  // フルハウス
  const fullHouseValue = getFullHouseValue(sortedCards)
  if (fullHouseValue > 0) {
    return { cards: sortedCards, rank: 'full-house', rankValue: 6000 + fullHouseValue }
  }
  
  // フラッシュ
  if (isFlush(sortedCards)) {
    const flushValue = getHighCardValue(sortedCards)
    return { cards: sortedCards, rank: 'flush', rankValue: 5000 + flushValue }
  }
  
  // ストレート
  const straightValue = getStraightValue(sortedCards)
  if (straightValue > 0) {
    return { cards: sortedCards, rank: 'straight', rankValue: 4000 + straightValue }
  }
  
  // スリーカード
  const threeOfAKindValue = getThreeOfAKindValue(sortedCards)
  if (threeOfAKindValue > 0) {
    return { cards: sortedCards, rank: 'three-of-a-kind', rankValue: 3000 + threeOfAKindValue }
  }
  
  // ツーペア
  const twoPairValue = getTwoPairValue(sortedCards)
  if (twoPairValue > 0) {
    return { cards: sortedCards, rank: 'two-pair', rankValue: 2000 + twoPairValue }
  }
  
  // ワンペア
  const pairValue = getPairValue(sortedCards)
  if (pairValue > 0) {
    return { cards: sortedCards, rank: 'pair', rankValue: 1000 + pairValue }
  }
  
  // ハイカード
  const highCardValue = getHighCardValue(sortedCards)
  return { cards: sortedCards, rank: 'high-card', rankValue: highCardValue }
}

// ヘルパー関数群
function isRoyalFlush(cards: Card[]): boolean {
  if (!isFlush(cards)) return false
  const values = cards.map(c => c.value).sort((a, b) => a - b)
  return JSON.stringify(values) === JSON.stringify([1, 10, 11, 12, 13]) // A, 10, J, Q, K
}

function getStraightFlushValue(cards: Card[]): number {
  if (!isFlush(cards)) return 0
  return getStraightValue(cards)
}

function isFlush(cards: Card[]): boolean {
  return cards.every(card => card.suit === cards[0].suit)
}

function getStraightValue(cards: Card[]): number {
  const values = cards.map(c => c.value).sort((a, b) => a - b)
  
  // A-5ストレート (wheel)
  if (JSON.stringify(values) === JSON.stringify([1, 2, 3, 4, 5])) {
    return 5 // 5ハイストレート
  }
  
  // 通常のストレート
  for (let i = 1; i < values.length; i++) {
    if (values[i] !== values[i-1] + 1) {
      return 0
    }
  }
  
  return values[values.length - 1] // 最高位のカード
}

function getFourOfAKindValue(cards: Card[]): number {
  const counts = getValueCounts(cards)
  for (const [value, count] of counts.entries()) {
    if (count === 4) return value
  }
  return 0
}

function getFullHouseValue(cards: Card[]): number {
  const counts = getValueCounts(cards)
  let threeValue = 0
  let pairValue = 0
  
  for (const [value, count] of counts.entries()) {
    if (count === 3) threeValue = value
    if (count === 2) pairValue = value
  }
  
  return threeValue > 0 && pairValue > 0 ? threeValue * 100 + pairValue : 0
}

function getThreeOfAKindValue(cards: Card[]): number {
  const counts = getValueCounts(cards)
  for (const [value, count] of counts.entries()) {
    if (count === 3) return value
  }
  return 0
}

function getTwoPairValue(cards: Card[]): number {
  const counts = getValueCounts(cards)
  const pairs: number[] = []
  
  for (const [value, count] of counts.entries()) {
    if (count === 2) pairs.push(value)
  }
  
  if (pairs.length === 2) {
    pairs.sort((a, b) => b - a) // 降順
    return pairs[0] * 100 + pairs[1]
  }
  
  return 0
}

function getPairValue(cards: Card[]): number {
  const counts = getValueCounts(cards)
  for (const [value, count] of counts.entries()) {
    if (count === 2) return value
  }
  return 0
}

function getHighCardValue(cards: Card[]): number {
  const values = cards.map(c => c.value === 1 ? 14 : c.value).sort((a, b) => b - a)
  let result = 0
  for (let i = 0; i < values.length; i++) {
    result += values[i] * Math.pow(100, 4 - i)
  }
  return result
}

function getValueCounts(cards: Card[]): Map<number, number> {
  const counts = new Map<number, number>()
  for (const card of cards) {
    const value = card.value === 1 ? 14 : card.value // Aを14として扱う
    counts.set(value, (counts.get(value) || 0) + 1)
  }
  return counts
}

// ハンドランク名を日本語で取得
export function getHandRankName(rank: HandRank): string {
  const names: Record<HandRank, string> = {
    'royal-flush': 'ロイヤルストレートフラッシュ',
    'straight-flush': 'ストレートフラッシュ',
    'four-of-a-kind': 'フォーカード',
    'full-house': 'フルハウス',
    'flush': 'フラッシュ',
    'straight': 'ストレート',
    'three-of-a-kind': 'スリーカード',
    'two-pair': 'ツーペア',
    'pair': 'ワンペア',
    'high-card': 'ハイカード'
  }
  return names[rank]
}

// CPUの行動を決定（シンプルAI）
export function decideCPUAction(
  player: Player, 
  gameState: GameState, 
  callAmount: number
): 'fold' | 'call' | 'raise' | 'check' {
  const hand = evaluateHand(player.holeCards, gameState.communityCards)
  const handStrength = hand.rankValue / 10000 // 0-1に正規化
  
  // 非常にシンプルなAI
  if (handStrength > 0.7) {
    // 強いハンド: レイズまたはコール
    return Math.random() > 0.3 ? 'raise' : 'call'
  } else if (handStrength > 0.4) {
    // 中程度のハンド: コールまたはチェック
    return callAmount === 0 ? 'check' : (Math.random() > 0.5 ? 'call' : 'fold')
  } else if (handStrength > 0.2) {
    // 弱いハンド: チェックまたはフォールド
    return callAmount === 0 ? 'check' : 'fold'
  } else {
    // 非常に弱いハンド: フォールド
    return callAmount === 0 ? 'check' : 'fold'
  }
}

export function getCardSymbol(suit: Card['suit']): string {
  const symbols = {
    hearts: '♥',
    diamonds: '♦',
    clubs: '♣',
    spades: '♠'
  }
  return symbols[suit]
}

export function getCardColor(suit: Card['suit']): string {
  return suit === 'hearts' || suit === 'diamonds' ? 'text-red-500' : 'text-gray-900'
}
