"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Crown, Trophy, Star, Sparkles } from "lucide-react"
import { useState, useEffect } from "react"

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

interface VictoryModalProps {
  isOpen: boolean
  onClose: () => void
  onPlayAgain: () => void
  winner: Player
  allPlayers: Player[]
  victoryType: "artifacts" | "finish" | "timeout"
  gameStats: {
    totalTurns: number
    totalRounds: number
    gameTime?: string
  }
}

const ARTIFACTS = {
  Ilíada: "⚔️",
  Odisseia: "🏺",
  Deuses: "⚡",
  Criaturas: "🐍",
  Titãs: "🏔️",
  Heróis: "🛡️",
  Mitos: "📜",
}

export default function VictoryModal({
  isOpen,
  onClose,
  onPlayAgain,
  winner,
  allPlayers,
  victoryType,
  gameStats,
}: VictoryModalProps) {
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShowCelebration(false)
      const timer = setTimeout(() => setShowCelebration(true), 500)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const getVictoryMessage = () => {
    switch (victoryType) {
      case "artifacts":
        return `${winner.customName || winner.name} coletou todos os 7 artefatos sagrados!`
      case "finish":
        return `${winner.customName || winner.name} alcançou o Monte Olimpo!`
      case "timeout":
        return `${winner.customName || winner.name} venceu com mais artefatos!`
      default:
        return `${winner.customName || winner.name} é o vencedor!`
    }
  }

  const getVictoryDescription = () => {
    switch (victoryType) {
      case "artifacts":
        return "Reunindo todos os artefatos lendários da mitologia grega, você provou ser digno dos deuses!"
      case "finish":
        return "Sua jornada épica através da Grécia Antiga chegou ao fim no lar dos deuses!"
      case "timeout":
        return "Sua sabedoria e conhecimento sobre a mitologia grega foram superiores!"
      default:
        return "Uma vitória épica digna dos heróis da antiguidade!"
    }
  }

  // Sort players by artifacts count for final ranking
  const sortedPlayers = [...allPlayers].sort((a, b) => {
    if (b.artifacts.length !== a.artifacts.length) {
      return b.artifacts.length - a.artifacts.length
    }
    return b.position - a.position // Tiebreaker: position on board
  })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl mx-auto bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 border-4 border-yellow-400">
        <DialogHeader>
          <DialogTitle className="text-center text-3xl font-bold text-amber-900 mb-4">🏆 VITÓRIA ÉPICA! 🏆</DialogTitle>
        </DialogHeader>

        <div className="text-center space-y-6">
          {/* Winner Celebration */}
          <div className={`relative ${showCelebration ? "animate-bounce" : ""}`}>
            <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center shadow-2xl border-4 border-yellow-300">
              <div className="text-4xl">{winner.icon}</div>
              <Crown className="absolute -top-2 -right-2 w-8 h-8 text-yellow-600" />
            </div>

            {showCelebration && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Sparkles className="absolute -top-4 -left-4 w-6 h-6 text-yellow-500 animate-pulse" />
                <Star className="absolute -top-2 right-2 w-4 h-4 text-amber-500 animate-pulse" />
                <Sparkles className="absolute -bottom-2 -right-4 w-5 h-5 text-yellow-600 animate-pulse" />
                <Star className="absolute bottom-0 -left-2 w-3 h-3 text-amber-400 animate-pulse" />
              </div>
            )}
          </div>

          {/* Winner Name and Title */}
          <div>
            <h2 className="text-2xl font-bold text-amber-900 mb-2">{winner.customName || winner.name}</h2>
            <Badge className="text-lg px-4 py-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-amber-900 border-yellow-600">
              🏛️ Herói do Olimpo 🏛️
            </Badge>
          </div>

          {/* Victory Message */}
          <div className="bg-white/80 rounded-lg p-6 border-2 border-yellow-300">
            <h3 className="text-xl font-bold text-amber-800 mb-3">{getVictoryMessage()}</h3>
            <p className="text-amber-700 leading-relaxed">{getVictoryDescription()}</p>
          </div>

          {/* Winner's Artifacts */}
          <div className="bg-gradient-to-r from-amber-100 to-yellow-100 rounded-lg p-4 border-2 border-amber-300">
            <h4 className="font-bold text-amber-900 mb-3">Artefatos Coletados:</h4>
            <div className="flex justify-center gap-2 flex-wrap">
              {winner.artifacts.map((artifact, idx) => (
                <div
                  key={idx}
                  className="w-12 h-12 bg-amber-200 border-2 border-amber-400 rounded-lg flex items-center justify-center text-2xl"
                  title={artifact}
                >
                  {ARTIFACTS[artifact]}
                </div>
              ))}
              {winner.artifacts.length === 0 && <p className="text-amber-600 italic">Nenhum artefato coletado</p>}
            </div>
            <p className="text-sm text-amber-700 mt-2">
              {winner.artifacts.length}/7 artefatos • Posição final: {winner.position + 1}/60
            </p>
          </div>

          {/* Game Statistics */}
          <div className="bg-white/60 rounded-lg p-4 border border-amber-200">
            <h4 className="font-bold text-amber-900 mb-2">Estatísticas do Jogo:</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-amber-700">Total de Turnos:</span>
                <span className="font-bold text-amber-900 ml-2">{gameStats.totalTurns}</span>
              </div>
              <div>
                <span className="text-amber-700">Rodadas:</span>
                <span className="font-bold text-amber-900 ml-2">{gameStats.totalRounds}</span>
              </div>
            </div>
          </div>

          {/* Final Rankings */}
          <div className="bg-white/60 rounded-lg p-4 border border-amber-200">
            <h4 className="font-bold text-amber-900 mb-3">Classificação Final:</h4>
            <div className="space-y-2">
              {sortedPlayers.map((player, index) => (
                <div
                  key={player.id}
                  className={`flex items-center justify-between p-2 rounded ${
                    player.id === winner.id ? "bg-yellow-200 border border-yellow-400" : "bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-lg">
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}º`}
                    </span>
                    <div className={`w-8 h-8 rounded-full ${player.bgColor} flex items-center justify-center`}>
                      {player.icon}
                    </div>
                    <span className={`font-medium ${player.color}`}>{player.customName || player.name}</span>
                  </div>
                  <div className="text-right text-sm">
                    <div className="font-bold">{player.artifacts.length}/7 artefatos</div>
                    <div className="text-gray-600">Pos. {player.position + 1}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={onPlayAgain}
              className="flex-1 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-bold py-3 text-lg"
            >
              <Trophy className="w-5 h-5 mr-2" />
              Jogar Novamente
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-amber-400 text-amber-700 hover:bg-amber-50 font-bold py-3 bg-transparent"
            >
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
