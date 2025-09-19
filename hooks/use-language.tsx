"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext } from "react"

type Language = "pt-br" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

interface LanguageProviderProps {
  children: React.ReactNode
}

const translations = {
  "pt-br": {
    startGame: "Iniciar Jogo",
    howToPlay: "Como Jogar",
    language: "Idioma",
    instructionsTitle: "MANUAL DE INSTRUÇÕES - OLÍMPICOS",
    objective: "Objetivo:",
    objectiveText:
      "Ser o primeiro jogador a coletar 7 artefatos divinos (um de cada tema) e chegar ao final do tabuleiro no Monte Olimpo.",
    howToPlayTitle: "Como Jogar:",
    victoryCondition: "Condição de Vitória:",
    victoryConditionText:
      "Após coletar os 7 artefatos, corra para ser o primeiro a chegar exatamente na casa final do tabuleiro.",
    close: "Fechar",
  },
  en: {
    startGame: "Start Game",
    howToPlay: "How to Play",
    language: "Language",
    instructionsTitle: "INSTRUCTION MANUAL - OLYMPICS",
    objective: "Objective:",
    objectiveText:
      "Be the first player to collect 7 divine artifacts (one of each theme) and reach the end of the board on Mount Olympus.",
    howToPlayTitle: "How to Play:",
    victoryCondition: "Victory Condition:",
    victoryConditionText:
      "After collecting all 7 artifacts, race to be the first to reach exactly the final space on the board.",
    close: "Close",
  },
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>("pt-br")

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem("olimpicos-language") as Language
    if (savedLanguage && (savedLanguage === "pt-br" || savedLanguage === "en")) {
      setLanguageState(savedLanguage)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("olimpicos-language", lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)["pt-br"]] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}
