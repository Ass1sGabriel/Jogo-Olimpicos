"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Settings, Users, Play, RotateCcw } from "lucide-react"
import QuestionModal from "@/components/question-modal"
import TurnIndicator from "@/components/turn-indicator"
import SpecialEventModal from "@/components/special-event-modal"
import PowerActivationModal from "@/components/power-activation-modal"
import VictoryModal from "@/components/victory-modal"
import questionsData from "@/data/questions.json"

// Game constants
const BOARD_SPACES = 60
const THEMES = ["Ilíada", "Odisseia", "Deuses", "Criaturas", "Titãs", "Heróis", "Mitos"]
const ARTIFACTS = {
  Ilíada: "⚔️",
  Odisseia: "🏺",
  Deuses: "⚡",
  Criaturas: "🐍",
  Titãs: "🏔️",
  Heróis: "🛡️",
  Mitos: "📜",
}

const PLAYER_ARCHETYPES = [
  { name: "Hoplita", icon: "🛡️", color: "text-red-700", bgColor: "bg-red-100" },
  { name: "Filósofo", icon: "📚", color: "text-blue-700", bgColor: "bg-blue-100" },
  { name: "Sacerdotisa", icon: "🏛️", color: "text-purple-700", bgColor: "bg-purple-100" },
  { name: "Atleta", icon: "🏃", color: "text-green-700", bgColor: "bg-green-100" },
  { name: "Oráculo", icon: "🔮", color: "text-indigo-700", bgColor: "bg-indigo-100" },
  { name: "Artesão", icon: "🏺", color: "text-orange-700", bgColor: "bg-orange-100" },
  { name: "Poeta", icon: "🎭", color: "text-pink-700", bgColor: "bg-pink-100" },
  { name: "Guerreiro", icon: "⚔️", color: "text-gray-700", bgColor: "bg-gray-100" },
]

const DICE_ICONS = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6]

interface Player {
  id: number
  name: string
  customName?: string
  position: number
  artifacts: string[]
  color: string
  bgColor: string
  icon: string
  isActive: boolean
  specialPowers: string[]
}

interface Question {
  id: number
  tema: string
  dificuldade: number
  pergunta: string
  opcoes: string[]
  respostaCorreta: number
  explicacao: string
}

interface GameState {
  players: Player[]
  currentPlayer: number
  diceValue: number
  isRolling: boolean
  gamePhase: "setup" | "playing" | "question" | "ended"
  winner: number | null
  turnCount: number
  gameHistory: string[]
  currentQuestion: Question | null
  waitingForSpaceAction: boolean
  specialEvent: {
    isOpen: boolean
    eventName: string
    eventDescription: string
    eventEffect: string
    playerName: string
  } | null
  powerActivation: {
    isOpen: boolean
    context: "question" | "turn" | "movement"
    availablePowers: string[]
  } | null
  victoryType: "artifacts" | "finish" | "timeout" | null
  gameStartTime: number
}

export default function OlimpicosGame() {
  const [gameState, setGameState] = useState<GameState>({
    players: [
      {
        id: 1,
        name: "Hoplita",
        position: 0,
        artifacts: [],
        color: "text-red-700",
        bgColor: "bg-red-100",
        icon: "🛡️",
        isActive: true,
        specialPowers: [],
      },
      {
        id: 2,
        name: "Filósofo",
        position: 0,
        artifacts: [],
        color: "text-blue-700",
        bgColor: "bg-blue-100",
        icon: "📚",
        isActive: true,
        specialPowers: [],
      },
    ],
    currentPlayer: 0,
    diceValue: 1,
    isRolling: false,
    gamePhase: "setup",
    winner: null,
    turnCount: 0,
    gameHistory: [],
    currentQuestion: null,
    waitingForSpaceAction: false,
    specialEvent: null,
    powerActivation: null,
    victoryType: null,
    gameStartTime: 0,
  })

  const [setupConfig, setSetupConfig] = useState({
    playerCount: 2,
    selectedArchetypes: [0, 1, 2, 3],
  })

  const addPlayer = () => {
    if (gameState.players.length >= 4) return

    const availableArchetypes = PLAYER_ARCHETYPES.filter(
      (archetype) => !gameState.players.some((player) => player.name === archetype.name),
    )

    if (availableArchetypes.length === 0) return

    const newArchetype = availableArchetypes[0]
    const newPlayer: Player = {
      id: gameState.players.length + 1,
      name: newArchetype.name,
      position: 0,
      artifacts: [],
      color: newArchetype.color,
      bgColor: newArchetype.bgColor,
      icon: newArchetype.icon,
      isActive: true,
      specialPowers: [],
    }

    setGameState((prev) => ({
      ...prev,
      players: [...prev.players, newPlayer],
    }))
  }

  const removePlayer = (playerId: number) => {
    if (gameState.players.length <= 2) return

    setGameState((prev) => ({
      ...prev,
      players: prev.players.filter((p) => p.id !== playerId),
      currentPlayer: prev.currentPlayer >= prev.players.length - 1 ? 0 : prev.currentPlayer,
    }))
  }

  const updatePlayerArchetype = (playerId: number, archetypeIndex: number) => {
    const archetype = PLAYER_ARCHETYPES[archetypeIndex]

    setGameState((prev) => ({
      ...prev,
      players: prev.players.map((player) =>
        player.id === playerId
          ? {
              ...player,
              name: archetype.name,
              icon: archetype.icon,
              color: archetype.color,
              bgColor: archetype.bgColor,
            }
          : player,
      ),
    }))
  }

  const updatePlayerCustomName = (playerId: number, customName: string) => {
    setGameState((prev) => ({
      ...prev,
      players: prev.players.map((player) =>
        player.id === playerId ? { ...player, customName: customName.trim() || undefined } : player,
      ),
    }))
  }

  const startGame = () => {
    setGameState((prev) => ({
      ...prev,
      gamePhase: "playing",
      turnCount: 1,
      gameHistory: ["Jogo iniciado! Que os deuses favoreçam os corajosos!"],
      gameStartTime: Date.now(),
    }))
  }

  const resetGame = () => {
    setGameState((prev) => ({
      ...prev,
      players: prev.players.map((player) => ({
        ...player,
        position: 0,
        artifacts: [],
        specialPowers: [],
      })),
      currentPlayer: 0,
      diceValue: 1,
      isRolling: false,
      gamePhase: "setup",
      winner: null,
      turnCount: 0,
      gameHistory: [],
      currentQuestion: null,
      waitingForSpaceAction: false,
      specialEvent: null,
      powerActivation: null,
      victoryType: null,
      gameStartTime: 0,
    }))
  }

  const addToHistory = (message: string) => {
    setGameState((prev) => ({
      ...prev,
      gameHistory: [...prev.gameHistory.slice(-9), message],
    }))
  }

  const getQuestionDifficulty = (artifactCount: number): number => {
    if (artifactCount <= 2) return 1 // Easy
    if (artifactCount <= 5) return 2 // Medium
    return 3 // Hard
  }

  const getTimeLimit = (difficulty: number): number => {
    switch (difficulty) {
      case 1:
        return 30 // Easy: 30 seconds
      case 2:
        return 20 // Medium: 20 seconds
      case 3:
        return 15 // Hard: 15 seconds
      default:
        return 25
    }
  }

  const getRandomQuestion = (theme: string, difficulty: number): Question | null => {
    const availableQuestions = questionsData.questions.filter((q) => q.tema === theme && q.dificuldade === difficulty)

    if (availableQuestions.length === 0) {
      // Fallback to any difficulty for this theme
      const fallbackQuestions = questionsData.questions.filter((q) => q.tema === theme)
      if (fallbackQuestions.length === 0) return null
      return fallbackQuestions[Math.floor(Math.random() * fallbackQuestions.length)]
    }

    return availableQuestions[Math.floor(Math.random() * availableQuestions.length)]
  }

  const handleSpaceAction = () => {
    const currentPlayerData = gameState.players[gameState.currentPlayer]
    const space = boardSpaces[currentPlayerData.position]
    const playerName = currentPlayerData.customName || currentPlayerData.name

    if (space.type === "theme") {
      if (!checkForQuestionPowers()) {
        // No powers available, proceed with question
        showQuestion(space, currentPlayerData, playerName)
      }
    } else if (space.type === "special") {
      handleSpecialSpace()
    } else {
      advanceToNextPlayer()
    }
  }

  const advanceToNextPlayer = () => {
    setGameState((prev) => ({
      ...prev,
      waitingForSpaceAction: false,
      currentPlayer: (prev.currentPlayer + 1) % prev.players.length,
    }))
  }

  const SPECIAL_EVENTS = [
    {
      name: "Oráculo de Delfos",
      description:
        "A Pítia sussurra segredos dos deuses em seus ouvidos, concedendo sabedoria para as próximas perguntas.",
      effects: {
        power: "50/50",
        message: "recebeu o poder do Oráculo (50/50)!",
      },
    },
    {
      name: "Fúria de Ares",
      description: "O deus da guerra está furioso! Sua ira o empurra para trás no campo de batalha.",
      effects: {
        movement: -3,
        message: "sofreu a Fúria de Ares e voltou 3 casas!",
      },
    },
    {
      name: "Bênção de Atena",
      description: "A deusa da sabedoria sorri para você, concedendo uma segunda chance.",
      effects: {
        extraTurn: true,
        message: "recebeu a Bênção de Atena e pode jogar novamente!",
      },
    },
    {
      name: "Labirinto de Creta",
      description: "Você se perde nos corredores do terrível labirinto do Minotauro.",
      effects: {
        power: "Skip Turn",
        message: "se perdeu no Labirinto de Creta e perderá o próximo turno!",
      },
    },
    {
      name: "Atalho do Hermes",
      description: "O mensageiro dos deuses oferece um caminho mais rápido através dos céus.",
      effects: {
        teleport: true,
        message: "usou o Atalho do Hermes!",
      },
    },
    {
      name: "Favor de Zeus",
      description: "O rei dos deuses concede sua proteção divina contra adversidades.",
      effects: {
        power: "Shield",
        message: "recebeu o Favor de Zeus (Escudo Divino)!",
      },
    },
    {
      name: "Maldição de Hades",
      description: "O senhor do submundo marca você com sua maldição sombria.",
      effects: {
        movement: -2,
        power: "Cursed",
        message: "foi amaldiçoado por Hades!",
      },
    },
    {
      name: "Sabedoria de Apolo",
      description: "O deus da luz e do conhecimento ilumina sua mente com sabedoria divina.",
      effects: {
        power: "Divine Insight",
        message: "recebeu a Sabedoria de Apolo!",
      },
    },
  ]

  const handleSpecialSpace = () => {
    const currentPlayerData = gameState.players[gameState.currentPlayer]
    const playerName = currentPlayerData.customName || currentPlayerData.name
    const spaceIndex = currentPlayerData.position

    const eventIndex = spaceIndex % SPECIAL_EVENTS.length
    const event = SPECIAL_EVENTS[eventIndex]

    setGameState((prev) => ({
      ...prev,
      specialEvent: {
        isOpen: true,
        eventName: event.name,
        eventDescription: event.description,
        eventEffect: event.effects.message,
        playerName: playerName,
      },
    }))
  }

  const applySpecialEventEffect = () => {
    if (!gameState.specialEvent) return

    const currentPlayerData = gameState.players[gameState.currentPlayer]
    const playerName = currentPlayerData.customName || currentPlayerData.name
    const spaceIndex = currentPlayerData.position
    const eventIndex = spaceIndex % SPECIAL_EVENTS.length
    const event = SPECIAL_EVENTS[eventIndex]

    setGameState((prev) => {
      const newPlayers = [...prev.players]
      const player = newPlayers[prev.currentPlayer]
      let shouldAdvanceTurn = true
      let historyMessage = `${playerName} ${event.effects.message}`

      // Apply effects based on event
      if (event.effects.power && !player.specialPowers.includes(event.effects.power)) {
        player.specialPowers.push(event.effects.power)
      }

      if (event.effects.movement) {
        const newPosition = Math.max(0, player.position + event.effects.movement)
        player.position = newPosition
        historyMessage = `${playerName} ${event.effects.message} Nova posição: ${newPosition + 1}`
      }

      if (event.effects.extraTurn) {
        shouldAdvanceTurn = false
      }

      if (event.effects.teleport) {
        // Find next space of same theme
        const currentSpace = boardSpaces[player.position]
        if (currentSpace.theme) {
          for (let i = player.position + 1; i < BOARD_SPACES; i++) {
            if (boardSpaces[i].theme === currentSpace.theme) {
              player.position = i
              historyMessage = `${playerName} ${event.effects.message} Avançou para a posição ${i + 1}!`
              break
            }
          }
        }
        if (!historyMessage.includes("Avançou")) {
          historyMessage = `${playerName} tentou usar o Atalho do Hermes, mas não encontrou outro espaço do mesmo tema.`
        }
      }

      return {
        ...prev,
        players: newPlayers,
        waitingForSpaceAction: false,
        currentPlayer: shouldAdvanceTurn ? (prev.currentPlayer + 1) % prev.players.length : prev.currentPlayer,
        gameHistory: [...prev.gameHistory.slice(-9), historyMessage],
        specialEvent: null,
      }
    })
  }

  const activatePower = (powerName: string) => {
    setGameState((prev) => {
      const newPlayers = [...prev.players]
      const player = newPlayers[prev.currentPlayer]

      // Remove the used power
      player.specialPowers = player.specialPowers.filter((p) => p !== powerName)

      const playerName = player.customName || player.name
      const historyMessage = `${playerName} usou o poder ${powerName}!`

      return {
        ...prev,
        players: newPlayers,
        gameHistory: [...prev.gameHistory.slice(-9), historyMessage],
        powerActivation: null,
      }
    })
  }

  const checkForQuestionPowers = () => {
    const currentPlayerData = gameState.players[gameState.currentPlayer]
    const questionPowers = currentPlayerData.specialPowers.filter((power) =>
      ["50/50", "Time Freeze", "Divine Insight"].includes(power),
    )

    if (questionPowers.length > 0) {
      setGameState((prev) => ({
        ...prev,
        powerActivation: {
          isOpen: true,
          context: "question",
          availablePowers: questionPowers,
        },
      }))
      return true
    }
    return false
  }

  const showQuestion = (space: any, currentPlayerData: any, playerName: string) => {
    const difficulty = getQuestionDifficulty(currentPlayerData.artifacts.length)
    const question = getRandomQuestion(space.theme, difficulty)

    if (question) {
      setGameState((prev) => ({
        ...prev,
        gamePhase: "question",
        currentQuestion: question,
        waitingForSpaceAction: false,
      }))

      addToHistory(
        `${playerName} parou em ${space.theme} e deve responder uma pergunta ${
          difficulty === 1 ? "fácil" : difficulty === 2 ? "média" : "difícil"
        }`,
      )
    } else {
      advanceToNextPlayer()
    }
  }

  const checkVictoryConditions = (
    players: Player[],
  ): { winner: Player | null; victoryType: "artifacts" | "finish" | null } => {
    // Check for artifact victory (all 7 artifacts)
    for (const player of players) {
      if (player.artifacts.length >= 7) {
        return { winner: player, victoryType: "artifacts" }
      }
    }

    // Check for finish line victory (reached Mount Olympus)
    for (const player of players) {
      if (player.position >= BOARD_SPACES - 1) {
        return { winner: player, victoryType: "finish" }
      }
    }

    return { winner: null, victoryType: null }
  }

  const endGameWithWinner = (winner: Player, victoryType: "artifacts" | "finish" | "timeout") => {
    setGameState((prev) => ({
      ...prev,
      gamePhase: "ended",
      winner: winner.id,
      victoryType: victoryType,
    }))

    const playerName = winner.customName || winner.name
    let victoryMessage = ""

    switch (victoryType) {
      case "artifacts":
        victoryMessage = `🏆 ${playerName} venceu coletando todos os 7 artefatos sagrados!`
        break
      case "finish":
        victoryMessage = `🏆 ${playerName} venceu alcançando o Monte Olimpo!`
        break
      case "timeout":
        victoryMessage = `🏆 ${playerName} venceu com mais artefatos!`
        break
    }

    addToHistory(victoryMessage)
  }

  const handleQuestionAnswer = (correct: boolean) => {
    const currentPlayerData = gameState.players[gameState.currentPlayer]
    const playerName = currentPlayerData.customName || currentPlayerData.name
    const question = gameState.currentQuestion

    if (correct && question) {
      // Award artifact if player doesn't have it
      setGameState((prev) => {
        const newPlayers = [...prev.players]
        const player = newPlayers[prev.currentPlayer]
        let historyMessage = ""

        if (!player.artifacts.includes(question.tema)) {
          player.artifacts.push(question.tema)
          historyMessage = `${playerName} respondeu corretamente e ganhou o artefato ${question.tema}!`
        } else {
          historyMessage = `${playerName} respondeu corretamente, mas já possui o artefato ${question.tema}.`
        }

        const { winner, victoryType } = checkVictoryConditions(newPlayers)
        if (winner && victoryType) {
          setTimeout(() => endGameWithWinner(winner, victoryType), 1000)
        }

        return {
          ...prev,
          players: newPlayers,
          gamePhase: "playing",
          currentQuestion: null,
          currentPlayer: (prev.currentPlayer + 1) % prev.players.length,
          gameHistory: [...prev.gameHistory.slice(-9), historyMessage],
        }
      })
    } else {
      setGameState((prev) => ({
        ...prev,
        gamePhase: "playing",
        currentQuestion: null,
        currentPlayer: (prev.currentPlayer + 1) % prev.players.length,
        gameHistory: [...prev.gameHistory.slice(-9), `${playerName} errou a pergunta.`],
      }))
    }
  }

  const useFiftyFifty = () => {
    setGameState((prev) => {
      const newPlayers = [...prev.players]
      const player = newPlayers[prev.currentPlayer]
      player.specialPowers = player.specialPowers.filter((power) => power !== "50/50")

      return {
        ...prev,
        players: newPlayers,
      }
    })
  }

  const rollDice = () => {
    if (gameState.isRolling || gameState.gamePhase !== "playing") return

    const currentPlayerData = gameState.players[gameState.currentPlayer]

    // Check if player should skip turn
    if (currentPlayerData.specialPowers.includes("Skip Turn")) {
      setGameState((prev) => {
        const newPlayers = [...prev.players]
        const player = newPlayers[prev.currentPlayer]
        player.specialPowers = player.specialPowers.filter((power) => power !== "Skip Turn")

        const playerName = player.customName || player.name

        return {
          ...prev,
          players: newPlayers,
          currentPlayer: (prev.currentPlayer + 1) % prev.players.length,
          turnCount: prev.currentPlayer === prev.players.length - 1 ? prev.turnCount + 1 : prev.turnCount,
          gameHistory: [...prev.gameHistory.slice(-9), `${playerName} perdeu o turno devido ao Labirinto de Creta.`],
        }
      })
      return
    }

    setGameState((prev) => ({ ...prev, isRolling: true }))

    // Animate dice roll
    let rollCount = 0
    const rollInterval = setInterval(() => {
      setGameState((prev) => ({ ...prev, diceValue: Math.floor(Math.random() * 6) + 1 }))
      rollCount++

      if (rollCount >= 10) {
        clearInterval(rollInterval)
        const finalValue = Math.floor(Math.random() * 6) + 1

        setGameState((prev) => {
          const newPlayers = [...prev.players]
          const currentPlayerData = newPlayers[prev.currentPlayer]
          const oldPosition = currentPlayerData.position
          const newPosition = Math.min(currentPlayerData.position + finalValue, BOARD_SPACES - 1)
          currentPlayerData.position = newPosition

          const playerName = currentPlayerData.customName || currentPlayerData.name
          const historyMessage = `${playerName} rolou ${finalValue} e moveu da posição ${oldPosition + 1} para ${newPosition + 1}`

          const { winner, victoryType } = checkVictoryConditions(newPlayers)
          if (winner && victoryType) {
            setTimeout(() => endGameWithWinner(winner, victoryType), 2000) // Delay to show movement first
          }

          return {
            ...prev,
            diceValue: finalValue,
            isRolling: false,
            players: newPlayers,
            turnCount: prev.currentPlayer === prev.players.length - 1 ? prev.turnCount + 1 : prev.turnCount,
            gameHistory: [...prev.gameHistory.slice(-9), historyMessage],
            waitingForSpaceAction: true,
          }
        })
      }
    }, 100)
  }

  // Auto-trigger space action when player lands
  useEffect(() => {
    if (gameState.waitingForSpaceAction && gameState.gamePhase === "playing") {
      const timer = setTimeout(() => {
        handleSpaceAction()
      }, 1000) // 1 second delay for better UX

      return () => clearTimeout(timer)
    }
  }, [gameState.waitingForSpaceAction, gameState.gamePhase])

  const generateBoardSpaces = () => {
    const spaces = []
    for (let i = 0; i < BOARD_SPACES; i++) {
      let spaceType = "normal"
      let theme = ""

      if (i === 0) {
        spaceType = "start"
      } else if (i === BOARD_SPACES - 1) {
        spaceType = "finish"
      } else if (i % 8 === 0) {
        spaceType = "special"
      } else {
        spaceType = "theme"
        theme = THEMES[i % THEMES.length]
      }

      spaces.push({ id: i, type: spaceType, theme })
    }
    return spaces
  }

  const boardSpaces = generateBoardSpaces()
  const DiceIcon = DICE_ICONS[gameState.diceValue - 1]
  const currentPlayerData = gameState.players[gameState.currentPlayer]

  const winnerData = gameState.winner ? gameState.players.find((p) => p.id === gameState.winner) : null

  const gameStats = {
    totalTurns: gameState.turnCount,
    totalRounds: Math.ceil(gameState.turnCount / gameState.players.length),
    gameTime: gameState.gameStartTime
      ? Math.floor((Date.now() - gameState.gameStartTime) / 1000 / 60) + " minutos"
      : undefined,
  }

  if (gameState.gamePhase === "setup") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 p-4">
        {/* Greek Key Pattern Header */}
        <div className="w-full h-8 bg-gradient-to-r from-amber-800 to-yellow-800 mb-6 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 20px, #8B4513 20px, #8B4513 40px)`,
            }}
          />
        </div>

        {/* Game Title */}
        <div className="text-center mb-8">
          <h1
            className="text-6xl font-bold text-amber-900 mb-2 tracking-wider"
            style={{
              fontFamily: "serif",
              textShadow: "2px 2px 4px rgba(139, 69, 19, 0.3)",
              letterSpacing: "0.1em",
            }}
          >
            OLÍMPICOS
          </h1>
          <p className="text-xl text-amber-800 font-medium">Configuração do Jogo</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="p-8 bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-300">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 text-amber-700" />
              <h2 className="text-2xl font-bold text-amber-900">Configurar Jogadores</h2>
            </div>

            <div className="space-y-6">
              {/* Player Configuration */}
              <div className="grid gap-4">
                {gameState.players.map((player, index) => (
                  <Card key={player.id} className="p-4 border border-amber-200">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-full ${player.bgColor} flex items-center justify-center text-2xl`}
                      >
                        {player.icon}
                      </div>

                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`archetype-${player.id}`}>Arquétipo</Label>
                          <Select
                            value={PLAYER_ARCHETYPES.findIndex((a) => a.name === player.name).toString()}
                            onValueChange={(value) => updatePlayerArchetype(player.id, Number.parseInt(value))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {PLAYER_ARCHETYPES.map((archetype, idx) => (
                                <SelectItem key={idx} value={idx.toString()}>
                                  {archetype.icon} {archetype.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor={`name-${player.id}`}>Nome Personalizado (Opcional)</Label>
                          <Input
                            id={`name-${player.id}`}
                            placeholder={player.name}
                            value={player.customName || ""}
                            onChange={(e) => updatePlayerCustomName(player.id, e.target.value)}
                            maxLength={15}
                          />
                        </div>
                      </div>

                      {gameState.players.length > 2 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removePlayer(player.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remover
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>

              {/* Add Player Button */}
              {gameState.players.length < 4 && (
                <Button
                  onClick={addPlayer}
                  variant="outline"
                  className="w-full border-dashed border-2 border-amber-300 text-amber-700 hover:bg-amber-50 bg-transparent"
                >
                  + Adicionar Jogador ({gameState.players.length}/4)
                </Button>
              )}

              {/* Start Game Button */}
              <div className="flex justify-center pt-6">
                <Button
                  onClick={startGame}
                  size="lg"
                  className="bg-amber-700 hover:bg-amber-800 text-white px-8 py-3 text-lg font-bold"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Iniciar Jogo
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Greek Key Pattern Footer */}
        <div className="w-full h-8 bg-gradient-to-r from-amber-800 to-yellow-800 mt-6 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 20px, #8B4513 20px, #8B4513 40px)`,
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 p-4">
      {/* Greek Key Pattern Header */}
      <div className="w-full h-8 bg-gradient-to-r from-amber-800 to-yellow-800 mb-6 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 20px, #8B4513 20px, #8B4513 40px)`,
          }}
        />
      </div>

      {/* Game Title and Controls */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-4 mb-4">
          <h1
            className="text-4xl md:text-6xl font-bold text-amber-900 tracking-wider"
            style={{
              fontFamily: "serif",
              textShadow: "2px 2px 4px rgba(139, 69, 19, 0.3)",
              letterSpacing: "0.1em",
            }}
          >
            OLÍMPICOS
          </h1>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="border-amber-300 bg-transparent">
                <Settings className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Configurações do Jogo</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Turno: {gameState.turnCount}</span>
                  <Badge variant="outline">Rodada {Math.ceil(gameState.turnCount / gameState.players.length)}</Badge>
                </div>
                <Button onClick={resetGame} variant="outline" className="w-full bg-transparent">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reiniciar Jogo
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <p className="text-lg text-amber-800 font-medium">
          Turno: {currentPlayerData.customName || currentPlayerData.name}
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Player HUDs */}
        <div className="lg:col-span-1 space-y-4">
          {/* Turn Indicator Component */}
          <TurnIndicator
            currentPlayer={currentPlayerData}
            turnCount={gameState.turnCount}
            totalPlayers={gameState.players.length}
            gamePhase={gameState.gamePhase}
          />

          {gameState.players.map((player, index) => (
            <Card
              key={player.id}
              className={`p-4 border-2 transition-all duration-300 ${
                index === gameState.currentPlayer
                  ? "border-amber-500 bg-amber-50 shadow-lg"
                  : "border-amber-200 bg-white/80"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-full ${player.bgColor} flex items-center justify-center text-xl`}>
                  {player.icon}
                </div>
                <div>
                  <h3 className={`font-bold ${player.color}`}>{player.customName || player.name}</h3>
                  <p className="text-sm text-amber-700">Posição: {player.position + 1}</p>
                </div>
              </div>

              {/* Artifacts Collection */}
              <div className="grid grid-cols-4 gap-1 mb-2">
                {THEMES.map((theme) => (
                  <div
                    key={theme}
                    className={`w-8 h-8 rounded border-2 flex items-center justify-center text-sm ${
                      player.artifacts.includes(theme) ? "bg-amber-200 border-amber-400" : "bg-gray-100 border-gray-300"
                    }`}
                    title={theme}
                  >
                    {player.artifacts.includes(theme) ? ARTIFACTS[theme] : ""}
                  </div>
                ))}
              </div>

              <div className="text-xs text-amber-600">Artefatos: {player.artifacts.length}/7</div>

              {/* Special Powers */}
              {player.specialPowers.length > 0 && (
                <div className="mt-2">
                  <div className="text-xs text-purple-600 font-medium">Poderes:</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {player.specialPowers.map((power, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {power}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}

          {/* Dice Section */}
          <Card className="p-6 bg-gradient-to-br from-amber-100 to-yellow-100 border-2 border-amber-300">
            <div className="text-center">
              <h3 className="font-bold text-amber-900 mb-4">Dado dos Deuses</h3>
              <div className="flex justify-center mb-4">
                <div
                  className={`w-16 h-16 border-2 border-amber-600 rounded-lg bg-white flex items-center justify-center transition-transform duration-200 ${
                    gameState.isRolling ? "animate-spin" : ""
                  }`}
                >
                  <DiceIcon className="w-8 h-8 text-amber-800" />
                </div>
              </div>
              <Button
                onClick={rollDice}
                disabled={gameState.isRolling || gameState.gamePhase !== "playing" || gameState.waitingForSpaceAction}
                className="w-full bg-amber-700 hover:bg-amber-800 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                {gameState.isRolling
                  ? "Rolando..."
                  : gameState.waitingForSpaceAction
                    ? "Processando..."
                    : gameState.gamePhase === "question"
                      ? "Respondendo pergunta..."
                      : "Lançar Dado"}
              </Button>
            </div>
          </Card>

          {/* Game History */}
          <Card className="p-4 bg-white/80 border border-amber-200">
            <h3 className="font-bold text-amber-900 mb-2 text-sm">Histórico do Jogo</h3>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {gameState.gameHistory.slice(-5).map((entry, idx) => (
                <p key={idx} className="text-xs text-amber-700 leading-relaxed">
                  {entry}
                </p>
              ))}
            </div>
          </Card>
        </div>

        {/* Game Board */}
        <div className="lg:col-span-3">
          <Card className="p-6 bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-300 min-h-[600px]">
            <h2 className="text-2xl font-bold text-amber-900 mb-4 text-center">Tabuleiro da Grécia Antiga</h2>

            {/* Board Grid */}
            <div className="grid grid-cols-10 gap-2 max-w-4xl mx-auto">
              {boardSpaces.map((space, index) => {
                const playersOnSpace = gameState.players.filter((p) => p.position === index)

                return (
                  <div
                    key={space.id}
                    className={`
                      relative w-12 h-12 border-2 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-300
                      ${space.type === "start" ? "bg-green-200 border-green-400" : ""}
                      ${space.type === "finish" ? "bg-yellow-200 border-yellow-500" : ""}
                      ${space.type === "special" ? "bg-purple-200 border-purple-400" : ""}
                      ${space.type === "theme" ? "bg-blue-100 border-blue-300" : ""}
                      ${space.type === "normal" ? "bg-gray-100 border-gray-300" : ""}
                    `}
                  >
                    {/* Space Number */}
                    <span className="absolute top-0 left-0 text-[8px] text-gray-600 p-0.5">{index + 1}</span>

                    {/* Space Content */}
                    {space.type === "start" && <span>🏛️</span>}
                    {space.type === "finish" && <span>🏔️</span>}
                    {space.type === "special" && <span>⚡</span>}
                    {space.type === "theme" && <span>{ARTIFACTS[space.theme]}</span>}

                    {/* Players on this space */}
                    {playersOnSpace.length > 0 && (
                      <div className="absolute -top-2 -right-2 flex flex-wrap">
                        {playersOnSpace.map((player) => (
                          <span key={player.id} className="text-xs">
                            {player.icon}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Legend */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-200 border border-green-400 rounded"></div>
                <span>Início</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
                <span>Tema</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-200 border border-purple-400 rounded"></div>
                <span>Especial</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-200 border border-yellow-500 rounded"></div>
                <span>Monte Olimpo</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Greek Key Pattern Footer */}
      <div className="w-full h-8 bg-gradient-to-r from-amber-800 to-yellow-800 mt-6 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 20px, #8B4513 20px, #8B4513 40px)`,
          }}
        />
      </div>

      {/* Special Event Modal */}
      {gameState.specialEvent && (
        <SpecialEventModal
          isOpen={gameState.specialEvent.isOpen}
          onClose={applySpecialEventEffect}
          eventName={gameState.specialEvent.eventName}
          eventDescription={gameState.specialEvent.eventDescription}
          eventEffect={gameState.specialEvent.eventEffect}
          playerName={gameState.specialEvent.playerName}
        />
      )}

      {/* Power Activation Modal */}
      {gameState.powerActivation && (
        <PowerActivationModal
          isOpen={gameState.powerActivation.isOpen}
          onClose={() => {
            // If closing without using power, proceed with normal action
            if (gameState.powerActivation?.context === "question") {
              const currentPlayerData = gameState.players[gameState.currentPlayer]
              const space = boardSpaces[currentPlayerData.position]
              const playerName = currentPlayerData.customName || currentPlayerData.name
              showQuestion(space, currentPlayerData, playerName)
            }
            setGameState((prev) => ({ ...prev, powerActivation: null }))
          }}
          onActivate={activatePower}
          availablePowers={gameState.powerActivation.availablePowers}
          playerName={currentPlayerData.customName || currentPlayerData.name}
          context={gameState.powerActivation.context}
        />
      )}

      {/* Victory Modal */}
      {gameState.gamePhase === "ended" && winnerData && gameState.victoryType && (
        <VictoryModal
          isOpen={true}
          onClose={() => setGameState((prev) => ({ ...prev, gamePhase: "playing" }))}
          onPlayAgain={resetGame}
          winner={winnerData}
          allPlayers={gameState.players}
          victoryType={gameState.victoryType}
          gameStats={gameStats}
        />
      )}

      {/* Question Modal */}
      <QuestionModal
        isOpen={gameState.gamePhase === "question"}
        onClose={() => setGameState((prev) => ({ ...prev, gamePhase: "playing", currentQuestion: null }))}
        question={gameState.currentQuestion}
        onAnswer={handleQuestionAnswer}
        timeLimit={gameState.currentQuestion ? getTimeLimit(gameState.currentQuestion.dificuldade) : 30}
        useFiftyFifty={currentPlayerData?.specialPowers.includes("50/50")}
        onUseFiftyFifty={useFiftyFifty}
      />
    </div>
  )
}
