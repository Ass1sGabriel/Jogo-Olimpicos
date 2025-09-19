"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, User } from "lucide-react"

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

interface TurnIndicatorProps {
  currentPlayer: Player
  turnCount: number
  totalPlayers: number
  gamePhase: string
}

export default function TurnIndicator({ currentPlayer, turnCount, totalPlayers, gamePhase }: TurnIndicatorProps) {
  const roundNumber = Math.ceil(turnCount / totalPlayers)

  return (
    <Card className="p-4 bg-gradient-to-r from-amber-100 to-yellow-100 border-2 border-amber-400">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full ${currentPlayer.bgColor} flex items-center justify-center text-xl border-2 border-amber-500`}
          >
            {currentPlayer.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-amber-700" />
              <span className={`font-bold ${currentPlayer.color}`}>
                {currentPlayer.customName || currentPlayer.name}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-amber-700">
              <Clock className="w-3 h-3" />
              <span>
                Turno {turnCount} • Rodada {roundNumber}
              </span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <Badge
            variant="outline"
            className={`${
              gamePhase === "question"
                ? "bg-blue-100 text-blue-800"
                : gamePhase === "playing"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
            }`}
          >
            {gamePhase === "question" ? "Respondendo" : gamePhase === "playing" ? "Jogando" : "Aguardando"}
          </Badge>
          <div className="text-xs text-amber-600 mt-1">Posição: {currentPlayer.position + 1}/60</div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="mt-3">
        <div className="flex justify-between text-xs text-amber-600 mb-1">
          <span>Progresso no tabuleiro</span>
          <span>{Math.round((currentPlayer.position / 59) * 100)}%</span>
        </div>
        <div className="w-full bg-amber-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-amber-500 to-yellow-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(currentPlayer.position / 59) * 100}%` }}
          />
        </div>
      </div>
    </Card>
  )
}
