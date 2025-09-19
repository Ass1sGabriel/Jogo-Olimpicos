"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Zap, Shield, Clock, Star } from "lucide-react"

interface PowerActivationModalProps {
  isOpen: boolean
  onClose: () => void
  onActivate: (powerName: string) => void
  availablePowers: string[]
  playerName: string
  context: "question" | "turn" | "movement"
}

const POWER_INFO = {
  "50/50": {
    icon: Eye,
    name: "Oráculo 50/50",
    description: "Remove duas opções incorretas da pergunta atual",
    color: "from-indigo-500 to-purple-600",
    context: ["question"],
  },
  "Extra Turn": {
    icon: Zap,
    name: "Turno Extra",
    description: "Jogue novamente após este turno",
    color: "from-yellow-500 to-amber-600",
    context: ["turn"],
  },
  Shield: {
    icon: Shield,
    name: "Escudo Divino",
    description: "Protege contra o próximo efeito negativo",
    color: "from-blue-500 to-cyan-600",
    context: ["turn", "movement"],
  },
  "Time Freeze": {
    icon: Clock,
    name: "Congelar Tempo",
    description: "Dobra o tempo limite da próxima pergunta",
    color: "from-cyan-500 to-blue-600",
    context: ["question"],
  },
  "Divine Insight": {
    icon: Star,
    name: "Visão Divina",
    description: "Revela a resposta correta por 3 segundos",
    color: "from-purple-500 to-pink-600",
    context: ["question"],
  },
}

export default function PowerActivationModal({
  isOpen,
  onClose,
  onActivate,
  availablePowers,
  playerName,
  context,
}: PowerActivationModalProps) {
  const contextPowers = availablePowers.filter((power) => POWER_INFO[power]?.context.includes(context))

  if (contextPowers.length === 0) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg mx-auto bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-300">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-purple-900 mb-4">
            Ativar Poder Especial
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-center text-purple-800 font-medium">
            {playerName}, você possui poderes que podem ser usados agora:
          </p>

          <div className="space-y-3">
            {contextPowers.map((powerName) => {
              const power = POWER_INFO[powerName]
              if (!power) return null

              const IconComponent = power.icon

              return (
                <div
                  key={powerName}
                  className="bg-white/80 rounded-lg p-4 border border-purple-200 hover:border-purple-400 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-r ${power.color} flex items-center justify-center`}
                    >
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-purple-900">{power.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {powerName}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm text-purple-700 mb-3">{power.description}</p>

                  <Button
                    onClick={() => {
                      onActivate(powerName)
                      onClose()
                    }}
                    className={`w-full bg-gradient-to-r ${power.color} hover:opacity-90 text-white font-medium`}
                  >
                    Usar {power.name}
                  </Button>
                </div>
              )
            })}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 bg-white/80 border-purple-300 text-purple-700 hover:bg-purple-50"
            >
              Não Usar Poderes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
