'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Flame } from "lucide-react"

// Mock quiz data
const quizData = {
  title: "Math Quiz",
  questions: [
    {
      question: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      correctAnswer: 1
    },
    {
      question: "What is 10 - 7?",
      options: ["1", "2", "3", "4"],
      correctAnswer: 2
    },
    {
      question: "What is 3 x 4?",
      options: ["10", "11", "12", "13"],
      correctAnswer: 2
    }
  ]
}

const AttemptQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(new Array(quizData.questions.length).fill(-1))
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [dayStreak, setDayStreak] = useState(5) // Mock day streak

  const handleAnswerSelect = (answer: number) => {
    const newSelectedAnswers = [...selectedAnswers]
    newSelectedAnswers[currentQuestion] = answer
    setSelectedAnswers(newSelectedAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setQuizCompleted(true)
    }
  }

  const calculateScore = () => {
    return selectedAnswers.reduce((score, answer, index) => {
      return score + (answer === quizData.questions[index].correctAnswer ? 1 : 0)
    }, 0)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{quizData.title}</h1>
        <div className="flex items-center space-x-2">
          <Flame className="text-orange-500" />
          <span className="font-semibold">{dayStreak} Day Streak</span>
        </div>
      </div>
      {!quizCompleted ? (
        <div className="space-y-6">
          <div className="p-4 border rounded-md">
            <h2 className="text-lg font-semibold mb-4">Question {currentQuestion + 1}</h2>
            <p className="mb-4">{quizData.questions[currentQuestion].question}</p>
            <RadioGroup onValueChange={(value) => handleAnswerSelect(parseInt(value))}>
              {quizData.questions[currentQuestion].options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <Button onClick={handleNext} className="w-full">
            {currentQuestion < quizData.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </Button>
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
          <p className="text-xl mb-4">Your score: {calculateScore()} / {quizData.questions.length}</p>
          <Button onClick={() => window.location.reload()}>Attempt Again</Button>
        </div>
      )}
    </div>
  )
}

export default AttemptQuiz;