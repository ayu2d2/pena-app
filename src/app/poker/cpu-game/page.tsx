'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft,
  DollarSign,
  User,
  Bot,
  Heart,
  Diamond,
  Club,
  Spade
} from 'lucide-react'
import { 
  Card, 
  Player, 
  GameState, 
  createDeck, 
  dealCard, 
  evaluateHand, 
  decideCPUAction,
  getHandRankName,
  getCardSymbol,
  getCardColor
} from '@/lib/poker/gameLogic'

export default function CPUGamePage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [loading, setLoading] = useState(true)
  const [gamePhase, setGamePhase] = useState<'betting' | 'action-selection' | 'showdown' | 'game-over'>('betting')
  const [betAmount, setBetAmount] = useState(10)
  const [message, setMessage] = useState('')
  const [dealerMessage, setDealerMessage] = useState('ポーカーテーブルへようこそ！')
  const [playerThoughts, setPlayerThoughts] = useState<{[playerId: string]: string}>({})
  const [isDealing, setIsDealing] = useState(false)
  const [dealingStep, setDealingStep] = useState(0)
  const [currentPlayerTurn, setCurrentPlayerTurn] = useState(0)
  const [gameMode, setGameMode] = useState<'casual' | 'realistic'>('casual')
  const [gameResult, setGameResult] = useState<'win' | 'lose' | 'tie' | null>(null)
  
  // ゲーム終了処理の重複実行を防ぐフラグ
  const gameEndingRef = useRef(false)

  // URLパラメータからモードを取得
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const mode = urlParams.get('mode') as 'casual' | 'realistic'
    if (mode) {
      setGameMode(mode)
    }
  }, [])

  // ゲームオーバー時の全処理停止フラグ
  const isGameOver = gamePhase === 'game-over'

  // ディーラーのセリフ集
  const dealerPhrases = {
    welcome: [
      "いらっしゃいませ、お客様。本日はテキサスホールデムをお楽しみください。",
      "ポーカーテーブルへようこそ。幸運をお祈りしております。",
      "本日のゲームを開始いたします。皆様、準備はよろしいでしょうか？"
    ],
    dealing: [
      "カードを配らせていただきます。",
      "各プレイヤーにカードをお配りします。",
      "ホールカードの配布を行います。"
    ],
    flop: [
      "場に共通カードを開きます。",
      "場のカードの第一段階です。",,
      "3枚のカードが場に出ました。"
    ],
    turn: [
      "ターンカードを公開いたします。",
      "4枚目の場のカードです。",
      "局面が変わってまいりました。"
    ],
    river: [
      "リバーカードです。最後のカードになります。",
      "5枚目のカード、運命の一枚です。",
      "すべての場のカードが出揃いました。"
    ],
    showdown: [
      "ショーダウンの時間です。カードをお見せください。",
      "勝負の決着をつけましょう。",
      "結果を確認いたします。"
    ],
    win: [
      "おめでとうございます！見事な勝利です！",
      "素晴らしいハンドでした！",
      "お見事でした。次のゲームもお楽しみください。"
    ],
    lose: [
      "残念でした。次のチャンスに期待しましょう。",
      "今回は運に恵まれませんでしたね。",
      "また挑戦をお待ちしております。"
    ]
  }

  // プレイヤーの思考パターン
  const playerThoughtPatterns = {
    strong: [
      "これは良いハンドだ...",
      "勝てそうな予感が...",
      "強気で行こう",
      "レイズのチャンスかも",
      "このハンドなら勝負できる"
    ],
    weak: [
      "うーん、微妙なカードだな...",
      "慎重に行こう",
      "フォールドを考えるべきか",
      "様子を見よう",
      "リスクは避けたい"
    ],
    medium: [
      "どうしようかな...",
      "悩ましい局面だ",
      "他のプレイヤーの出方次第だな",
      "コールしてみるか",
      "チャンスを待とう"
    ],
    bluff: [
      "ここはブラフで行ってみる",
      "強そうに見せかけよう",
      "相手を揺さぶってみる",
      "演技力が問われる場面だ",
      "度胸勝負だ"
    ]
  }

  const getRandomPhrase = (phrases: string[]) => {
    return phrases[Math.floor(Math.random() * phrases.length)]
  }

  const setDealerSpeech = (category: keyof typeof dealerPhrases) => {
    const phrases = dealerPhrases[category] as string[]
    if (phrases && phrases.length > 0) {
      const phrase = getRandomPhrase(phrases)
      setDealerMessage(phrase)
    }
  }

  const generatePlayerThought = (player: Player, gameState: GameState) => {
    if (!player.isCPU) return ""
    
    const hand = evaluateHand(player.holeCards, gameState.communityCards)
    const handStrength = hand.rankValue / 10000
    
    let category: keyof typeof playerThoughtPatterns
    if (handStrength > 0.7) category = 'strong'
    else if (handStrength > 0.4) category = 'medium'
    else if (Math.random() > 0.8) category = 'bluff'
    else category = 'weak'
    
    return getRandomPhrase(playerThoughtPatterns[category])
  }

  useEffect(() => {
    initializeGame()
  }, [])

  // カード配布アニメーション
  const animateCardDealing = async (gameState: GameState) => {
    setIsDealing(true)
    setDealerSpeech('dealing')
    
    // プレイヤーごとに順番にカードを配る演出
    for (let cardRound = 0; cardRound < 2; cardRound++) {
      for (let playerIndex = 0; playerIndex < gameState.players.length; playerIndex++) {
        setDealingStep(playerIndex + cardRound * gameState.players.length)
        await new Promise(resolve => setTimeout(resolve, 400)) // 400msの間隔
      }
    }
    
    setIsDealing(false)
    setDealingStep(0)
    
    // プレイヤーの思考を生成
    const thoughts: {[playerId: string]: string} = {}
    gameState.players.forEach(player => {
      thoughts[player.id] = generatePlayerThought(player, gameState)
    })
    setPlayerThoughts(thoughts)
    
    setTimeout(() => {
      setDealerMessage("ベッティングラウンドを開始いたします。")
    }, 1000)
  }

  const initializeGame = async () => {
    try {
      // デモモード: ローカルストレージから認証情報を確認
      const userInfo = localStorage.getItem('penaapp_user')
      
      if (!userInfo) {
        setLoading(false)
        return
      }
      
      const userData = JSON.parse(userInfo)
      setCurrentUser(userData)
      startNewGame(userData)
    } catch (error) {
      console.error('ゲーム初期化エラー:', error)
    } finally {
      setLoading(false)
    }
  }

  const startNewGame = (user: any) => {
    // ゲーム終了フラグをリセット
    gameEndingRef.current = false
    setGameResult(null)
    
    const deck = createDeck()
    let remainingDeck = [...deck]

    // プレイヤーを作成（1人 + 5CPU）
    const humanPlayer: Player = {
      id: user.id || 'demo-user',
      name: user.display_name || user.name || 'あなた',
      chips: Math.min(user.total_points || 1000, 1000),
      holeCards: [],
      currentBet: 0,
      status: 'active',
      isDealer: false,
      isCPU: false
    }

    const cpuNames = ['タナカ', 'サトウ', 'ヤマダ', 'ワタナベ']
    const cpuPlayers: Player[] = cpuNames.map((name, index) => ({
      id: `cpu-${index}`,
      name: name,
      chips: 800 + Math.floor(Math.random() * 400), // 800-1200のランダム
      holeCards: [],
      currentBet: 0,
      status: 'active',
      isDealer: index === 0, // 最初のCPUがディーラー
      isCPU: true
    }))

    const allPlayers = [humanPlayer, ...cpuPlayers]

    // リアルモードの場合、ブラインドを自動設定
    if (gameMode === 'realistic') {
      // スモールブラインドとビッグブラインドを設定
      const dealerIndex = allPlayers.findIndex(p => p.isDealer)
      const sbIndex = (dealerIndex + 1) % allPlayers.length
      const bbIndex = (dealerIndex + 2) % allPlayers.length
      
      allPlayers[sbIndex].currentBet = 5  // スモールブラインド
      allPlayers[sbIndex].chips -= 5
      allPlayers[bbIndex].currentBet = 10 // ビッグブラインド
      allPlayers[bbIndex].chips -= 10
    }

    // 全プレイヤーにカードを配る
    for (let i = 0; i < 2; i++) {
      for (const player of allPlayers) {
        const { card, remainingDeck: newDeck } = dealCard(remainingDeck)
        player.holeCards.push(card)
        remainingDeck = newDeck
      }
    }

    const newGameState: GameState = {
      players: allPlayers,
      communityCards: [],
      pot: gameMode === 'realistic' ? 15 : 0, // リアルモードは初期ポットにブラインド
      currentPlayerIndex: 0,
      phase: 'preflop',
      smallBlind: 5,
      bigBlind: 10,
      deck: remainingDeck
    }

    setGameState(newGameState)
    
    if (gameMode === 'realistic') {
      setGamePhase('action-selection')
      setMessage('リアルモード：スモールブラインド(5pt)、ビッグブラインド(10pt)が設定されました。アクションを選択してください。')
    } else {
      setGamePhase('betting')
      setMessage('カジュアルモード：5人テーブルでポーカーゲーム開始！ベット額を決めましょう。')
    }
    
    setDealerSpeech('welcome')
  }

  const startRound = async () => {
    if (!gameState || !currentUser) return

    const updatedGameState = { ...gameState }
    
    setDealerMessage("ゲームを開始いたします。まずはアンティを頂戴いたします。")
    
    // 全プレイヤーのブラインドベット
    updatedGameState.players.forEach(player => {
      player.chips -= betAmount
      player.currentBet = betAmount
    })
    updatedGameState.pot = betAmount * updatedGameState.players.length

    setGameState(updatedGameState)
    
    // カード配布アニメーション
    await animateCardDealing(updatedGameState)
    
    setGamePhase('action-selection')
    setCurrentPlayerTurn(0)
    setMessage('あなたのターンです。アクションを選択してください。')
  }

  const handlePlayerAction = (action: 'fold' | 'call' | 'raise' | 'check') => {
    if (!gameState) return

    const updatedGameState = { ...gameState }
    const player = updatedGameState.players[0] // 人間プレイヤーは常に最初

    switch (action) {
      case 'fold':
        player.status = 'folded'
        setGameState(updatedGameState) // 状態を更新
        endGame(updatedGameState, 'lose') // ゲーム終了処理を呼び出し
        return

      case 'call':
        const callAmount = Math.min(50, player.chips)
        player.chips -= callAmount
        player.currentBet += callAmount
        updatedGameState.pot += callAmount
        break

      case 'raise':
        const raiseAmount = Math.min(100, player.chips)
        player.chips -= raiseAmount
        player.currentBet += raiseAmount
        updatedGameState.pot += raiseAmount
        break

      case 'check':
        break
    }

    // 全CPUのターンを処理
    processCPUTurns(updatedGameState)
  }

  const processCPUTurns = async (gameState: GameState) => {
    const humanPlayer = gameState.players[0]
    
    // 既にゲームオーバーの場合や人間プレイヤーがフォールドしている場合は処理しない
    if (isGameOver || humanPlayer.status === 'folded') {
      return
    }
    
    const cpuPlayers = gameState.players.filter(p => p.isCPU && p.status === 'active')
    
    setDealerMessage("他のプレイヤーのアクションをお待ちください...")
    
    for (let i = 0; i < cpuPlayers.length; i++) {
      const cpuPlayer = cpuPlayers[i]
      if (cpuPlayer.status !== 'active') continue
      
      // CPUプレイヤーのターンを強調
      const playerIndex = gameState.players.findIndex(p => p.id === cpuPlayer.id)
      setCurrentPlayerTurn(playerIndex)
      
      // 現在のターンのプレイヤーのみ思考を表示
      const thought = generatePlayerThought(cpuPlayer, gameState)
      setPlayerThoughts({ [cpuPlayer.id]: thought })
      
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000))
      
      const callAmount = Math.max(0, Math.max(...gameState.players.map(p => p.currentBet)) - cpuPlayer.currentBet)
      const cpuAction = decideCPUAction(cpuPlayer, gameState, callAmount)
      
      // アクションメッセージ
      let actionMessage = ""
      switch (cpuAction) {
        case 'fold':
          cpuPlayer.status = 'folded'
          actionMessage = `${cpuPlayer.name}がフォールドしました。`
          break
        case 'call':
          const callAmt = Math.min(callAmount, cpuPlayer.chips)
          cpuPlayer.chips -= callAmt
          cpuPlayer.currentBet += callAmt
          gameState.pot += callAmt
          actionMessage = `${cpuPlayer.name}がコールしました。(${callAmt}ポイント)`
          break
        case 'raise':
          const raiseAmt = Math.min(60 + Math.floor(Math.random() * 40), cpuPlayer.chips)
          cpuPlayer.chips -= raiseAmt
          cpuPlayer.currentBet += raiseAmt
          gameState.pot += raiseAmt
          actionMessage = `${cpuPlayer.name}がレイズしました！(${raiseAmt}ポイント)`
          break
        case 'check':
          actionMessage = `${cpuPlayer.name}がチェックしました。`
          break
      }
      
      setDealerMessage(actionMessage)
      setGameState({...gameState})
      
      // 次のプレイヤーまで少し待機
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    setCurrentPlayerTurn(-1)
    
    // アクティブプレイヤーのチェック - 1人以下になったら即座にゲーム終了
    const activePlayers = gameState.players.filter(p => p.status === 'active')
    if (activePlayers.length <= 1 && !gameEndingRef.current) {
      setTimeout(() => {
        endGame(gameState, 'win')
      }, 1000)
      return
    }
    
    // フロップを開く
    setTimeout(() => {
      dealCommunityCards(gameState)
    }, 1000)
  }

  const dealCommunityCards = async (gameState: GameState) => {
    // 既にゲームオーバーの場合は処理しない
    if (isGameOver) {
      return
    }
    
    let remainingDeck = [...gameState.deck]

    setDealerSpeech('flop')
    
    // フロップ（3枚）を一枚ずつアニメーション
    const newCommunityCards: Card[] = []
    for (let i = 0; i < 3; i++) {
      const { card, remainingDeck: deck } = dealCard(remainingDeck)
      newCommunityCards.push(card)
      gameState.communityCards = [...newCommunityCards]
      remainingDeck = deck
      setGameState({...gameState})
      await new Promise(resolve => setTimeout(resolve, 800))
    }

    gameState.deck = remainingDeck
    gameState.phase = 'flop'

    // プレイヤーの新しい思考を生成
    const thoughts: {[playerId: string]: string} = {}
    gameState.players.forEach(player => {
      thoughts[player.id] = generatePlayerThought(player, gameState)
    })
    setPlayerThoughts(thoughts)

    setGameState(gameState)
    
    setTimeout(() => {
      // ゲームオーバーでない場合のみshowdownを実行
      if (!isGameOver) {
        showdown(gameState)
      }
    }, 3000)
  }

  const showdown = async (gameState: GameState) => {
    // 既にゲームオーバーまたはゲーム終了処理中の場合は処理しない
    if (gamePhase === 'game-over' || gameEndingRef.current) {
      return
    }
    
    const activePlayers = gameState.players.filter(p => p.status === 'active')
    const humanPlayer = gameState.players[0]
    
    // アクティブプレイヤーが1人以下の場合はshowdownは実行しない
    if (activePlayers.length <= 1) {
      return
    }
    
    setDealerSpeech('showdown')
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 全プレイヤーのハンドを評価
    const playerHands = activePlayers.map(player => ({
      player,
      hand: evaluateHand(player.holeCards, gameState.communityCards)
    }))

    // 最強ハンドを見つける
    playerHands.sort((a, b) => b.hand.rankValue - a.hand.rankValue)
    const winner = playerHands[0]

    setGamePhase('showdown')

    // 結果を判定（ゲーム終了処理中でない場合のみ）
    if (!gameEndingRef.current) {
      if (winner.player.id === humanPlayer.id) {
        setDealerSpeech('win')
        endGame(gameState, 'win')
      } else if (humanPlayer.status === 'folded') {
        setDealerSpeech('lose')
        endGame(gameState, 'lose')
      } else {
        // 同じハンドランクの場合は引き分け
        const humanHand = playerHands.find(p => p.player.id === humanPlayer.id)
        if (humanHand && humanHand.hand.rankValue === winner.hand.rankValue) {
          setDealerMessage("引き分けです。ポットを分配いたします。")
          endGame(gameState, 'tie')
        } else {
          setDealerSpeech('lose')
          endGame(gameState, 'lose')
        }
      }
    }
  }

  const endGame = (gameState: GameState, result: 'win' | 'lose' | 'tie') => {
    console.log(`endGame called with result: ${result}, gameEndingRef.current: ${gameEndingRef.current}, gamePhase: ${gamePhase}`)
    
    // 既にゲーム終了処理中の場合は処理しない（重複防止）
    if (gameEndingRef.current || gamePhase === 'game-over') {
      console.log('endGame aborted - already ending or game over')
      return
    }
    
    // ゲーム終了処理中フラグを設定
    gameEndingRef.current = true
    console.log('endGame proceeding - flag set to true')
    
    const humanPlayer = gameState.players[0]
    const activePlayers = gameState.players.filter(p => p.status === 'active')
    
    let winnings = 0
    if (result === 'win') {
      winnings = gameState.pot
    } else if (result === 'tie') {
      winnings = Math.floor(gameState.pot / activePlayers.length)
    }
    
    humanPlayer.chips += winnings

    let resultMessage = ''
    switch (result) {
      case 'win':
        resultMessage = `🎉 勝利！${winnings}ポイント獲得しました！`
        break
      case 'lose':
        resultMessage = `😔 敗北...${betAmount}ポイント失いました。`
        break
      case 'tie':
        resultMessage = `🤝 引き分け。${winnings}ポイント戻ってきました。`
        break
    }

    setMessage(resultMessage)
    setGamePhase('game-over')
    setGameResult(result)
    setGameState(gameState)

    // ユーザーのポイントを更新（実際のアプリではサーバーで処理）
    updateUserPoints(humanPlayer.chips - (currentUser?.total_points || 1000))
  }

  const updateUserPoints = async (pointChange: number) => {
    // 実際のアプリケーションではSupabaseでポイントを更新
    console.log(`ポイント変更: ${pointChange}`)
  }

  const renderCard = (card: Card, isHidden = false, isAnimated = false) => {
    if (isHidden) {
      return (
        <div className={`w-12 h-18 sm:w-16 sm:h-24 bg-gradient-to-br from-blue-900 to-blue-800 border-2 border-blue-600 rounded-lg flex items-center justify-center shadow-lg transform transition-transform duration-300 ${isAnimated ? 'hover:scale-105' : ''}`}>
          <div className="text-white text-xs">🂠</div>
        </div>
      )
    }

    const color = getCardColor(card.suit)
    const symbol = getCardSymbol(card.suit)

    return (
      <div className={`w-12 h-18 sm:w-16 sm:h-24 bg-gradient-to-br from-white to-gray-50 border-2 border-gray-300 rounded-lg flex flex-col items-center justify-center shadow-lg transform transition-all duration-300 ${isAnimated ? 'hover:scale-105 hover:shadow-xl' : ''}`}>
        <div className={`text-sm sm:text-lg font-bold ${color}`}>
          {card.rank}
        </div>
        <div className={`text-lg sm:text-xl ${color}`}>
          {symbol}
        </div>
      </div>
    )
  }

  const getPlayerPosition = (index: number, total: number) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
    const radius = isMobile ? 120 : 140 // モバイルでは少し小さく
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius
    return { x, y }
  }

  // プレイヤーの心理を順番に表示
  const showPlayerThoughtsSequentially = async (gameState: GameState) => {
    setPlayerThoughts({}) // リセット
    
    for (let i = 0; i < gameState.players.length; i++) {
      const player = gameState.players[i]
      if (player.isCPU && player.status === 'active') {
        const thought = generatePlayerThought(player, gameState)
        setPlayerThoughts(prev => ({
          ...prev,
          [player.id]: thought
        }))
        await new Promise(resolve => setTimeout(resolve, 1000)) // 1秒間隔で順番に表示
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full mx-auto"></div>
          <div className="text-amber-100 text-lg font-medium">ゲームを準備中...</div>
        </div>
      </div>
    )
  }

  if (!currentUser || !gameState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md">
          {!currentUser ? (
            <>
              <div className="text-red-400 text-xl font-semibold">ログインが必要です</div>
              <div className="text-amber-100">ポーカーゲームを楽しむためにはログインしてください</div>
              <Button 
                onClick={() => window.location.href = '/auth'}
                className="bg-amber-600 hover:bg-amber-700 text-white font-medium px-6 py-3 rounded-lg shadow-lg transition-all duration-200 hover:scale-105"
              >
                ログイン
              </Button>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold mb-4">ゲームを準備中...</h1>
              <Button onClick={() => window.location.href = '/poker'}>
                ポーカーホームに戻る
              </Button>
            </>
          )}
        </div>
      </div>
    )
  }

  const humanPlayer = gameState.players[0]
  const cpuPlayer = gameState.players[1]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-gray-800 to-slate-900 relative overflow-hidden">
      {/* 背景の装飾 */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-emerald-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-600 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-teal-600 rounded-full blur-2xl"></div>
      </div>

      {/* ヘッダー - モバイル最適化 */}
      <div className="bg-black/40 backdrop-blur-sm border-b border-white/10 p-3 md:p-4 relative z-10">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => window.location.href = '/poker'}
            className="text-white hover:bg-white/10 p-2 md:p-3"
          >
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline ml-2">戻る</span>
          </Button>
          
          {/* ディーラーエリア - モバイル最適化 */}
          <div className="text-center flex-1 mx-2 md:mx-8">
            <div className="bg-gradient-to-r from-emerald-900/80 to-teal-900/80 rounded-xl p-2 md:p-4 border border-emerald-600/40 backdrop-blur-sm shadow-xl">
              <div className="flex items-center justify-center gap-2 mb-1 md:mb-2">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-xs md:text-sm font-bold">🎩</span>
                </div>
                <span className="text-emerald-200 font-semibold text-sm md:text-base">ディーラー</span>
              </div>
              <div className="text-white text-xs md:text-sm font-medium leading-relaxed">{dealerMessage}</div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-white font-bold text-lg md:text-xl flex items-center gap-1">
              <span className="text-emerald-400">💰</span>
              <span className="text-sm md:text-base">ポット:</span>
              <span className="text-emerald-300">{gameState.pot}pt</span>
            </div>
            <div className="text-teal-300 text-xs md:text-sm font-medium capitalize">{gameState.phase}</div>
            <div className={`text-xs font-medium px-2 py-1 rounded-md mt-1 ${
              gameMode === 'realistic' 
                ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30' 
                : 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
            }`}>
              {gameMode === 'realistic' ? '🎯 リアルモード' : '🎮 カジュアル'}
            </div>
            </div>
          </div>
        </div>      {/* メインゲームエリア - モバイル最適化 */}
      <div className="container mx-auto px-2 md:px-4 py-4 relative z-10">
        {/* ポーカーテーブル */}
        <div className="relative max-w-4xl mx-auto">
          {/* テーブル背景 - レスポンシブサイズ */}
          <div className="relative bg-gradient-to-br from-emerald-800 via-slate-800 to-gray-900 rounded-full w-80 h-80 sm:w-96 sm:h-96 lg:w-[500px] lg:h-[500px] mx-auto border-4 md:border-8 border-emerald-700/60 shadow-2xl">
            {/* 内側の装飾 - より洗練されたデザイン */}
            <div className="absolute inset-2 md:inset-4 bg-gradient-to-br from-emerald-800/60 to-slate-900/80 rounded-full border-2 md:border-4 border-emerald-600/40 backdrop-blur-sm">
              <div className="absolute inset-4 md:inset-8 bg-gradient-to-br from-slate-800/90 to-gray-900/90 rounded-full flex items-center justify-center shadow-inner">
                <div className="text-center space-y-1 md:space-y-2">
                  <div className="text-emerald-300 font-bold text-base md:text-lg lg:text-2xl tracking-wider">💰 POT</div>
                  <div className="text-white font-bold text-xl md:text-2xl lg:text-3xl bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
                    {gameState.pot}pt
                  </div>
                </div>
              </div>
            </div>

            {/* プレイヤー席を円形配置 */}
            {gameState.players.map((player, index) => {
              const position = getPlayerPosition(index, gameState.players.length)
              const isHuman = !player.isCPU
              const isCurrentPlayer = index === currentPlayerTurn
              const isDealingToPlayer = isDealing && dealingStep >= index
              const playerThought = playerThoughts[player.id]

              return (
                <div
                  key={player.id}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${isCurrentPlayer ? 'z-30' : 'z-10'}`}
                  style={{
                    left: `calc(50% + ${position.x}px)`,
                    top: `calc(50% + ${position.y}px)`,
                  }}
                >
                  {/* プレイヤー情報 - より洗練されたデザイン */}
                  <div className={`text-center mb-2 transition-all duration-500 rounded-xl p-2 md:p-3 border-2 shadow-lg backdrop-blur-sm ${
                    isHuman 
                      ? 'bg-gradient-to-br from-blue-800/80 to-slate-800/80 border-blue-500/40' 
                      : 'bg-gradient-to-br from-gray-800/80 to-slate-800/80 border-gray-500/40'
                  } ${
                    isCurrentPlayer 
                      ? 'border-emerald-400 shadow-emerald-400/40 shadow-xl scale-110 animate-pulse' 
                      : player.status === 'folded' 
                        ? 'border-gray-600 opacity-50 grayscale' 
                        : ''
                  } ${isDealingToPlayer ? 'animate-bounce' : ''}`}>
                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center mx-auto mb-1 shadow-lg transition-all duration-300 ${
                      isHuman 
                        ? 'bg-gradient-to-br from-blue-600 to-blue-700' 
                        : 'bg-gradient-to-br from-gray-600 to-gray-700'
                    } ${isCurrentPlayer ? 'animate-pulse ring-2 ring-emerald-400 ring-offset-2 ring-offset-transparent' : ''}`}>
                      {isHuman ? (
                        <User className="w-4 h-4 md:w-5 md:h-5 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 md:w-5 md:h-5 text-white" />
                      )}
                    </div>
                    <div className="text-white text-xs md:text-sm font-bold tracking-wide">{player.name}</div>
                    
                    {/* 人間プレイヤーは常に表示、CPUは自分のターンの時のみ詳細表示 */}
                    {isHuman || isCurrentPlayer ? (
                      <>
                        <div className="text-emerald-300 text-xs md:text-sm font-semibold flex items-center justify-center gap-1">
                          <span className="text-emerald-400">💰</span>
                          {player.chips}pt
                        </div>
                        {player.currentBet > 0 && (
                          <div className="text-teal-400 text-xs font-medium animate-pulse flex items-center justify-center gap-1">
                            <span>🎯</span>
                            ベット: {player.currentBet}pt
                          </div>
                        )}
                      </>
                    ) : null}
                    {player.status === 'folded' && (
                      <div className="text-red-400 text-xs font-medium">❌ フォールド</div>
                    )}
                    {isCurrentPlayer && !isHuman && (
                      <div className="text-yellow-300 text-xs animate-pulse">考え中...</div>
                    )}
                  </div>

                  {/* プレイヤーのカード */}
                  <div className={`flex gap-1 justify-center transition-all duration-500 ${
                    player.status === 'folded' ? 'relative' : ''
                  }`}>
                    {/* フォールド時のオーバーレイ */}
                    {player.status === 'folded' && (
                      <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/20 rounded-lg">
                        <div className="text-red-400 text-xs font-bold bg-black/60 px-2 py-1 rounded-md border border-red-400/30">
                          FOLD
                        </div>
                      </div>
                    )}
                    {player.holeCards.map((card, cardIndex) => (
                      <div key={cardIndex} className={`transform transition-all duration-500 ${
                        isDealing && dealingStep === index + cardIndex * gameState.players.length
                          ? 'animate-bounce scale-110'
                          : 'hover:scale-110'
                      } ${
                        player.status === 'folded' ? 'opacity-40 grayscale filter blur-[1px] scale-95' : ''
                      }`}>
                        {renderCard(card, !isHuman && gamePhase !== 'showdown', true)}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* 場のカード（テーブル下部） */}
          <div className="mt-8 text-center">
            <h3 className="text-white text-lg sm:text-xl font-bold mb-4 flex items-center justify-center gap-2">
              <Spade className="w-5 h-5 text-yellow-400" />
              場のカード
              <Heart className="w-5 h-5 text-red-400" />
            </h3>
            <div className="flex justify-center gap-2 sm:gap-4 bg-black/40 rounded-xl p-4 backdrop-blur-sm border border-yellow-600/30">
              {gameState.communityCards.map((card, index) => (
                <div key={index} className="transform hover:scale-110 transition-transform">
                  {renderCard(card, false, true)}
                </div>
              ))}
              {/* プレースホルダー */}
              {Array.from({ length: 5 - gameState.communityCards.length }).map((_, index) => (
                <div key={`placeholder-${index}`} className="w-12 h-18 sm:w-16 sm:h-24 border-2 border-dashed border-yellow-600/30 rounded-lg flex items-center justify-center">
                  <div className="text-yellow-600/50 text-xs">?</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* メッセージとアクションエリア */}
        <div className="mt-8 max-w-4xl mx-auto">
          {/* メッセージ */}
          <div className="text-center mb-6">
            <div className="bg-gradient-to-r from-amber-900/80 to-yellow-900/80 rounded-xl p-4 text-white border border-amber-600 backdrop-blur-sm">
              <div className="text-lg font-semibold">{message}</div>
              {gamePhase === 'showdown' && gameState && (
                <div className="mt-2 text-sm space-y-1">
                  {gameState.players.map(player => {
                    const hand = evaluateHand(player.holeCards, gameState.communityCards)
                    return (
                      <div key={player.id} className={`${player.isCPU ? 'text-red-300' : 'text-blue-300'}`}>
                        {player.name}: {getHandRankName(hand.rank)}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* アクションエリア */}
          <div className="text-center">
            {gamePhase === 'betting' && (
              <div className="space-y-6">
                <div className="bg-black/40 rounded-xl p-6 backdrop-blur-sm border border-yellow-600/30">
                  <div className="text-white mb-4">
                    <label className="block text-lg font-medium mb-4">ベット額を選択</label>
                    <div className="flex items-center justify-center gap-6">
                      <Button
                        onClick={() => setBetAmount(Math.max(10, betAmount - 10))}
                        variant="outline"
                        className="bg-red-600/20 border-red-400 text-red-200 hover:bg-red-600/40 px-6 py-3"
                      >
                        -10
                      </Button>
                      <div className="bg-gradient-to-r from-yellow-600 to-amber-600 rounded-lg px-8 py-4">
                        <span className="text-xl md:text-2xl font-bold text-white">{betAmount}</span>
                        <span className="text-amber-200 ml-2 text-sm md:text-base">ポイント</span>
                      </div>
                      <Button
                        onClick={() => setBetAmount(Math.min(200, betAmount + 10))}
                        variant="outline"
                        className="bg-green-600/30 border-green-400 text-green-200 hover:bg-green-600/50 px-4 md:px-6 py-2 md:py-3 rounded-lg font-bold transition-all duration-200 hover:scale-105"
                      >
                        +10
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={() => {
                      setGamePhase('game-over')
                      setMessage('🚪 敗北 - ゲームを降りました')
                      setDealerMessage('お疲れ様でした。またのご参加をお待ちしております。')
                    }}
                    className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-3 text-lg font-bold rounded-xl shadow-lg"
                  >
                    🚪 降りる
                  </Button>
                  <Button
                    onClick={startRound}
                    className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-8 md:px-12 py-3 md:py-4 text-lg md:text-xl font-bold rounded-xl shadow-xl transform transition-all duration-200 hover:scale-105"
                  >
                    🎰 ゲーム開始
                  </Button>
                </div>
              </div>
            )}

            {gamePhase === 'action-selection' && (
              <div className="grid grid-cols-2 gap-3 md:gap-4 max-w-lg md:max-w-2xl mx-auto">
                <Button
                  onClick={() => handlePlayerAction('fold')}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 md:py-4 text-sm md:text-lg font-semibold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105"
                >
                  🙅‍♂️ フォールド
                </Button>
                <Button
                  onClick={() => handlePlayerAction('check')}
                  className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white py-4 text-lg font-semibold rounded-xl shadow-lg transform transition-transform hover:scale-105"
                >
                  ✋ チェック
                </Button>
                <Button
                  onClick={() => handlePlayerAction('call')}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 text-lg font-semibold rounded-xl shadow-lg transform transition-transform hover:scale-105"
                >
                  💰 コール
                </Button>
                <Button
                  onClick={() => handlePlayerAction('raise')}
                  className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white py-4 text-lg font-semibold rounded-xl shadow-lg transform transition-transform hover:scale-105"
                >
                  🚀 レイズ
                </Button>
              </div>
            )}

            {gamePhase === 'game-over' && (
              <div className={`rounded-2xl p-8 backdrop-blur-sm border max-w-md mx-auto ${
                gameResult === 'win' 
                  ? 'bg-emerald-900/60 border-emerald-500/30' 
                  : gameResult === 'tie'
                  ? 'bg-yellow-900/60 border-yellow-500/30'
                  : 'bg-red-900/60 border-red-500/30'
              }`}>
                <div className="text-center space-y-6">
                  {gameResult === 'win' && (
                    <>
                      <div className="text-emerald-400 text-6xl mb-4">🎉</div>
                      <h2 className="text-2xl font-bold text-emerald-400 mb-2">勝利！</h2>
                      <p className="text-emerald-200 mb-6">素晴らしいプレイでした！</p>
                    </>
                  )}
                  
                  {gameResult === 'tie' && (
                    <>
                      <div className="text-yellow-400 text-6xl mb-4">🤝</div>
                      <h2 className="text-2xl font-bold text-yellow-400 mb-2">引き分け</h2>
                      <p className="text-yellow-200 mb-6">惜しい勝負でした！</p>
                    </>
                  )}
                  
                  {gameResult === 'lose' && (
                    <>
                      <div className="text-red-400 text-6xl mb-4">💀</div>
                      <h2 className="text-2xl font-bold text-red-400 mb-2">敗北</h2>
                      <p className="text-gray-300 mb-6">またチャレンジしてみましょう！</p>
                    </>
                  )}
                  
                  <div className="space-y-4">
                    <Button
                      onClick={() => startNewGame(currentUser)}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 text-lg font-bold rounded-xl shadow-lg transform transition-transform hover:scale-105 w-full"
                    >
                      🔄 リトライ
                    </Button>
                    <Button
                      onClick={() => window.location.href = '/poker'}
                      variant="outline"
                      className="bg-gray-600/20 border-gray-400 text-gray-200 hover:bg-gray-600/40 px-8 py-3 text-lg rounded-xl w-full"
                    >
                      🏠 ポーカーホームに戻る
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
