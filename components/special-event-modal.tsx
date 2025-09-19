"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Zap, Shield, Compass, Eye, Swords, Crown, Scroll } from "lucide-react"

interface SpecialEventModalProps {
  isOpen: boolean
  onClose: () => void
  eventName: string
  eventDescription: string
  eventEffect: string
  playerName: string
  eventIcon?: string
}

const EVENT_ICONS = {
  "Oráculo de Delfos": Eye,
  "Fúria de Ares": Swords,
  "Bênção de Atena": Shield,
  "Labirinto de Creta": Compass,
  "Atalho do Hermes": Zap,
  "Favor de Zeus": Crown,
  "Maldição de Hades": Sparkles,
  "Sabedoria de Apolo": Scroll,
}

const EVENT_COLORS = {
  "Oráculo de Delfos": "from-indigo-500 to-purple-600",
  "Fúria de Ares": "from-red-500 to-orange-600",
  "Bênção de Atena": "from-blue-500 to-cyan-600",
  "Labirinto de Creta": "from-gray-500 to-slate-600",
  "Atalho do Hermes": "from-yellow-500 to-amber-600",
  "Favor de Zeus": "from-purple-500 to-pink-600",
  "Maldição de Hades": "from-gray-700 to-black",
  "Sabedoria de Apolo": "from-orange-500 to-yellow-500",
}

export default function SpecialEventModal({
  isOpen,
  onClose,
  eventName,
  eventDescription,
  eventEffect,
  playerName,
  eventIcon,
}: SpecialEventModalProps) {
  const [showEffect, setShowEffect] = useState(false)

  const IconComponent = EVENT_ICONS[eventName] || Sparkles
  const gradientColor = EVENT_COLORS[eventName] || "from-purple-500 to-pink-600"

  useEffect(() => {
    if (isOpen) {
      setShowEffect(false)
      const timer = setTimeout(() => setShowEffect(true), 500)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-300">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-amber-900 mb-4">Evento Especial!</DialogTitle>
        </DialogHeader>

        <div className="text-center space-y-6">
          {/* Event Icon with Animation */}
          <div
            className={`mx-auto w-20 h-20 rounded-full bg-gradient-to-r ${gradientColor} flex items-center justify-center shadow-lg ${showEffect ? "animate-pulse" : ""}`}
          >
            <IconComponent className="w-10 h-10 text-white" />
          </div>

          {/* Event Name */}
          <div>
            <Badge variant="outline" className="text-lg px-4 py-2 bg-white border-amber-400">
              {eventName}
            </Badge>
          </div>

          {/* Player Name */}
          <p className="text-lg font-semibold text-amber-800">{playerName}</p>

          {/* Event Description */}
          <div className="bg-white/80 rounded-lg p-4 border border-amber-200">
            <p className="text-amber-700 text-sm leading-relaxed">{eventDescription}</p>
          </div>

          {/* Event Effect */}
          {showEffect && (
            <div className="bg-gradient-to-r from-amber-100 to-yellow-100 rounded-lg p-4 border-2 border-amber-400 animate-fade-in">
              <h4 className="font-bold text-amber-900 mb-2">Efeito:</h4>
              <p className="text-amber-800 font-medium">{eventEffect}</p>
            </div>
          )}

          {/* Close Button */}
          <Button onClick={onClose} className="w-full bg-amber-700 hover:bg-amber-800 text-white font-bold py-3">
            Continuar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
