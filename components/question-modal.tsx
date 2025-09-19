"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, XCircle, Lightbulb } from "lucide-react"

interface Question {
  id: number
  tema: string
  dificuldade: number
  pergunta: string
  opcoes: string[]
  respostaCorreta: number
  explicacao: string
}

interface QuestionModalProps {
  isOpen: boolean
  onClose: () => void
  question: Question | null
  onAnswer: (correct: boolean) => void
  timeLimit: number
  useFiftyFifty?: boolean
  onUseFiftyFifty?: () => void
}

export default function QuestionModal({
  isOpen,
  onClose,
  question,
  onAnswer,
  timeLimit,
  useFiftyFifty = false,
  onUseFiftyFifty,
}: QuestionModalProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [timeLeft, setTimeLeft] = useState(timeLimit)
  const [isAnswered, setIsAnswered] = useState(false)
  const [fiftyFiftyUsed, setFiftyFiftyUsed] = useState(false)
  const [hiddenOptions, setHiddenOptions] = useState<number[]>([])

  useEffect(() => {
    if (isOpen && question) {
      setSelectedAnswer(null)
      setShowResult(false)
      setTimeLeft(timeLimit)
      setIsAnswered(false)
      setFiftyFiftyUsed(false)
      setHiddenOptions([])
    }
  }, [isOpen, question, timeLimit])

  useEffect(() => {
    if (!isOpen || !question || isAnswered) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up
          setIsAnswered(true)
          setShowResult(true)
          setTimeout(() => {
            onAnswer(false)
            onClose()
          }, 3000)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen, question, isAnswered, onAnswer, onClose])

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered || hiddenOptions.includes(answerIndex)) return

    setSelectedAnswer(answerIndex)
    setIsAnswered(true)
    setShowResult(true)

    const isCorrect = answerIndex === question?.respostaCorreta

    setTimeout(() => {
      onAnswer(isCorrect)
      onClose()
    }, 3000)
  }

  const handleFiftyFifty = () => {
    if (!question || fiftyFiftyUsed) return

    setFiftyFiftyUsed(true)

    // Hide 2 wrong answers, keeping the correct one and one random wrong one
    const wrongAnswers = question.opcoes.map((_, index) => index).filter((index) => index !== question.respostaCorreta)

    // Randomly select 2 wrong answers to hide
    const shuffled = wrongAnswers.sort(() => 0.5 - Math.random())
    const toHide = shuffled.slice(0, 2)

    setHiddenOptions(toHide)
    onUseFiftyFifty?.()
  }

  if (!question) return null

  const getDifficultyLabel = (difficulty: number) => {
    switch (difficulty) {
      case 1:
        return { label: "Fácil", color: "bg-green-500" }
      case 2:
        return { label: "Médio", color: "bg-yellow-500" }
      case 3:
        return { label: "Difícil", color: "bg-red-500" }
      default:
        return { label: "Normal", color: "bg-gray-500" }
    }
  }

  const difficultyInfo = getDifficultyLabel(question.dificuldade)
  const progressPercentage = (timeLeft / timeLimit) * 100

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-300">
        <DialogHeader>
          <div className="flex items-center justify-between mb-4">
            <DialogTitle className="text-2xl font-bold text-amber-900">Pergunta - {question.tema}</DialogTitle>
            <Badge className={`${difficultyInfo.color} text-white`}>{difficultyInfo.label}</Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Timer */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-700" />
                <span className="text-sm font-medium text-amber-700">Tempo restante: {timeLeft}s</span>
              </div>

              {/* Fifty-Fifty Power */}
              {useFiftyFifty && !fiftyFiftyUsed && !isAnswered && (
                <Button
                  onClick={handleFiftyFifty}
                  variant="outline"
                  size="sm"
                  className="border-purple-300 text-purple-700 hover:bg-purple-50 bg-transparent"
                >
                  <Lightbulb className="w-4 h-4 mr-1" />
                  50/50
                </Button>
              )}
            </div>
            <Progress
              value={progressPercentage}
              className="h-2"
              style={{
                background: progressPercentage > 30 ? "#10b981" : progressPercentage > 10 ? "#f59e0b" : "#ef4444",
              }}
            />
          </div>

          {/* Question */}
          <div className="bg-white/80 p-6 rounded-lg border border-amber-200">
            <h3 className="text-lg font-semibold text-amber-900 mb-4 leading-relaxed">{question.pergunta}</h3>

            {/* Answer Options */}
            <div className="grid gap-3">
              {question.opcoes.map((opcao, index) => {
                const isHidden = hiddenOptions.includes(index)
                const isSelected = selectedAnswer === index
                const isCorrect = index === question.respostaCorreta

                let buttonClass = "w-full p-4 text-left border-2 rounded-lg transition-all duration-200 "

                if (isHidden) {
                  buttonClass += "opacity-30 cursor-not-allowed bg-gray-100 border-gray-200"
                } else if (showResult) {
                  if (isCorrect) {
                    buttonClass += "bg-green-100 border-green-400 text-green-800"
                  } else if (isSelected && !isCorrect) {
                    buttonClass += "bg-red-100 border-red-400 text-red-800"
                  } else {
                    buttonClass += "bg-white border-amber-200 text-amber-700"
                  }
                } else {
                  buttonClass += "bg-white border-amber-200 text-amber-700 hover:bg-amber-50 hover:border-amber-300"
                }

                return (
                  <Button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={isAnswered || isHidden}
                    className={buttonClass}
                    variant="ghost"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium">
                        {String.fromCharCode(65 + index)}. {isHidden ? "---" : opcao}
                      </span>
                      {showResult && isCorrect && <CheckCircle className="w-5 h-5 text-green-600" />}
                      {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-600" />}
                    </div>
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Result and Explanation */}
          {showResult && (
            <div
              className={`p-4 rounded-lg border-2 ${
                selectedAnswer === question.respostaCorreta
                  ? "bg-green-50 border-green-300"
                  : "bg-red-50 border-red-300"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {selectedAnswer === question.respostaCorreta ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-bold text-green-800">Correto!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span className="font-bold text-red-800">{timeLeft === 0 ? "Tempo esgotado!" : "Incorreto!"}</span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{question.explicacao}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
