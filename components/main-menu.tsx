"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useLanguage } from "@/hooks/use-language"
import { Play, BookOpen, X } from "lucide-react"

interface MainMenuProps {
  onStartGame: () => void
}

export function MainMenu({ onStartGame }: MainMenuProps) {
  const [showInstructions, setShowInstructions] = useState(false)
  const { language, setLanguage, t } = useLanguage()

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div
        className="absolute inset-0 bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-100"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(139, 69, 19, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(160, 82, 45, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(205, 133, 63, 0.1) 0%, transparent 50%)
          `,
        }}
      />

      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-r from-amber-800 via-yellow-800 to-amber-800 border-b-4 border-amber-900">
        <div
          className="w-full h-full opacity-60"
          style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              transparent 0px,
              transparent 15px,
              #8B4513 15px,
              #8B4513 20px,
              transparent 20px,
              transparent 35px,
              #8B4513 35px,
              #8B4513 40px
            )`,
          }}
        />
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-r from-amber-800 via-yellow-800 to-amber-800 border-t-4 border-amber-900">
        <div
          className="w-full h-full opacity-60"
          style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              transparent 0px,
              transparent 15px,
              #8B4513 15px,
              #8B4513 20px,
              transparent 20px,
              transparent 35px,
              #8B4513 35px,
              #8B4513 40px
            )`,
          }}
        />
      </div>

      <div className="absolute left-0 top-16 bottom-16 w-24 bg-gradient-to-b from-amber-200 via-yellow-100 to-amber-200">
        <div
          className="w-full h-full opacity-80"
          style={{
            backgroundImage: `
            linear-gradient(180deg, 
              #D2B48C 0%, 
              #DDD5C7 10%, 
              #E6D7C3 20%, 
              #DDD5C7 30%, 
              #D2B48C 40%,
              #DDD5C7 50%,
              #E6D7C3 60%,
              #DDD5C7 70%,
              #D2B48C 80%,
              #DDD5C7 90%,
              #D2B48C 100%
            )
          `,
          }}
        >
          {/* Column Capital */}
          <div className="w-full h-20 bg-gradient-to-b from-amber-300 to-amber-200 border-b-2 border-amber-400 relative">
            <div className="absolute inset-2 border-2 border-amber-500 rounded-sm opacity-60" />
            <div className="absolute bottom-0 left-2 right-2 h-4 bg-amber-400 rounded-t-lg" />
          </div>
        </div>
      </div>

      <div className="absolute right-0 top-16 bottom-16 w-24 bg-gradient-to-b from-amber-200 via-yellow-100 to-amber-200">
        <div
          className="w-full h-full opacity-80"
          style={{
            backgroundImage: `
            linear-gradient(180deg, 
              #D2B48C 0%, 
              #DDD5C7 10%, 
              #E6D7C3 20%, 
              #DDD5C7 30%, 
              #D2B48C 40%,
              #DDD5C7 50%,
              #E6D7C3 60%,
              #DDD5C7 70%,
              #D2B48C 80%,
              #DDD5C7 90%,
              #D2B48C 100%
            )
          `,
          }}
        >
          {/* Column Capital */}
          <div className="w-full h-20 bg-gradient-to-b from-amber-300 to-amber-200 border-b-2 border-amber-400 relative">
            <div className="absolute inset-2 border-2 border-amber-500 rounded-sm opacity-60" />
            <div className="absolute bottom-0 left-2 right-2 h-4 bg-amber-400 rounded-t-lg" />
          </div>
        </div>
      </div>

      <div className="absolute top-20 right-28 z-10">
        <div className="flex gap-2 bg-amber-100/80 backdrop-blur-sm rounded-lg p-2 border-2 border-amber-300">
          <button
            onClick={() => setLanguage("pt-br")}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${
              language === "pt-br"
                ? "bg-amber-600 text-white shadow-md"
                : "bg-transparent text-amber-800 hover:bg-amber-200"
            }`}
          >
            <span className="text-lg">🇧🇷</span>
            <span className="text-sm font-medium">PT-BR</span>
          </button>
          <button
            onClick={() => setLanguage("en")}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${
              language === "en"
                ? "bg-amber-600 text-white shadow-md"
                : "bg-transparent text-amber-800 hover:bg-amber-200"
            }`}
          >
            <span className="text-lg">🇬🇧</span>
            <span className="text-sm font-medium">EN</span>
          </button>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-24">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1
            className="text-8xl font-bold text-amber-900 mb-4 tracking-wider drop-shadow-lg"
            style={{
              fontFamily: "var(--font-cinzel), serif",
              textShadow: "3px 3px 6px rgba(139, 69, 19, 0.4)",
              letterSpacing: "0.15em",
            }}
          >
            OLÍMPICOS
          </h1>
          <p
            className="text-2xl text-amber-800 font-medium tracking-wide"
            style={{ fontFamily: "var(--font-cinzel), serif" }}
          >
            {t("instructionsTitle").split(" - ")[1] || "JOGO DE MITOLOGIA GREGA"}
          </p>
        </div>

        <div className="mb-12">
          <div className="w-32 h-32 mx-auto relative">
            <div
              className="w-full h-full bg-gradient-to-br from-amber-600 to-amber-800 rounded-full shadow-2xl"
              style={{
                clipPath: "polygon(20% 10%, 80% 10%, 90% 30%, 85% 70%, 70% 85%, 30% 85%, 15% 70%, 10% 30%)",
              }}
            />
            <div
              className="absolute inset-4 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full"
              style={{
                clipPath: "polygon(25% 15%, 75% 15%, 85% 35%, 80% 65%, 65% 80%, 35% 80%, 20% 65%, 15% 35%)",
              }}
            />
            {/* Helmet crest */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
              <div className="w-8 h-16 bg-gradient-to-t from-red-600 to-red-400 rounded-t-full opacity-80" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Button
            onClick={onStartGame}
            size="lg"
            className="w-80 h-16 bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 text-white text-xl font-bold border-4 border-amber-900 shadow-2xl transform hover:scale-105 transition-all duration-200"
            style={{
              fontFamily: "var(--font-cinzel), serif",
              letterSpacing: "0.05em",
              textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            <Play className="w-6 h-6 mr-3" />
            {t("startGame")}
          </Button>

          <Button
            onClick={() => setShowInstructions(true)}
            variant="outline"
            size="lg"
            className="w-80 h-14 bg-amber-100/80 hover:bg-amber-200/90 text-amber-900 text-lg font-semibold border-4 border-amber-600 shadow-xl transform hover:scale-105 transition-all duration-200"
            style={{
              fontFamily: "var(--font-cinzel), serif",
              letterSpacing: "0.05em",
            }}
          >
            <BookOpen className="w-5 h-5 mr-3" />
            {t("howToPlay")}
          </Button>
        </div>
      </div>

      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent className="w-[95vw] max-w-4xl max-h-[85vh] overflow-y-auto bg-gradient-to-br from-amber-50 to-yellow-50 border-4 border-amber-600 p-4 sm:p-6">
          <DialogHeader className="relative">
            <button
              onClick={() => setShowInstructions(false)}
              className="absolute -top-2 -right-2 w-8 h-8 bg-amber-600 hover:bg-amber-700 text-white rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <DialogTitle
              className="text-xl sm:text-2xl lg:text-3xl font-bold text-amber-900 text-center mb-4 sm:mb-6 pr-8"
              style={{ fontFamily: "var(--font-cinzel), serif" }}
            >
              {t("instructionsTitle")}
            </DialogTitle>
          </DialogHeader>

          <div
            className="space-y-4 sm:space-y-6 text-amber-900 bg-gradient-to-br from-yellow-50 to-amber-50 p-4 sm:p-6 rounded-lg border-2 border-amber-300"
            style={{
              backgroundImage: `
                radial-gradient(circle at 10% 20%, rgba(139, 69, 19, 0.05) 0%, transparent 50%),
                radial-gradient(circle at 90% 80%, rgba(160, 82, 45, 0.05) 0%, transparent 50%)
              `,
            }}
          >
            <div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 text-amber-800">{t("objective")}</h3>
              <p className="text-sm sm:text-base leading-relaxed">{t("objectiveText")}</p>
            </div>

            <div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 text-amber-800">{t("howToPlayTitle")}</h3>
              <ol className="space-y-2 sm:space-y-3 text-sm sm:text-base leading-relaxed">
                {[
                  "Na sua vez, clique no dado para rolá-lo.",
                  "Seu peão andará o número de casas indicado.",
                  "Se parar em uma casa temática, você responderá a uma pergunta. Se acertar, ganha o artefato daquele tema (se ainda não o tiver).",
                  "A dificuldade da pergunta aumenta conforme você coleta mais artefatos.",
                  "Cuidado com as Casas Especiais! Elas podem te ajudar ou atrapalhar.",
                ].map((step, index) => (
                  <li key={index} className="flex gap-2 sm:gap-3">
                    <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">
                      {index + 1}
                    </span>
                    <span className="flex-1">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 text-amber-800">{t("victoryCondition")}</h3>
              <p className="text-sm sm:text-base leading-relaxed font-medium bg-amber-100 p-3 sm:p-4 rounded-lg border-l-4 border-amber-600">
                {t("victoryConditionText")}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
