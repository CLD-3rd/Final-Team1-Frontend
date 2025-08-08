"use client"

import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../components/auth-provider"
import { Header } from "../components/header"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group"
import { Label } from "../components/ui/label"
import { Progress } from "../components/ui/progress"
import { testAPI, contentAPI } from "../lib/api"
import { useToast } from "../hooks/use-toast"

const questions = [
  "나는 새로운 사람들과 만나는 것을 좋아한다",
  "나는 계획을 세우고 그대로 실행하는 것을 선호한다",
  "나는 감정보다는 논리적으로 판단하는 편이다",
  "나는 마감일이 다가와야 일을 시작하는 편이다",
  "나는 파티나 모임에서 에너지를 얻는다",
  "나는 세부사항보다는 큰 그림을 보는 것을 좋아한다",
  "나는 다른 사람의 감정을 잘 이해한다",
  "나는 즉흥적인 결정을 내리는 것을 좋아한다",
  "나는 혼자 있는 시간이 필요하다",
  "나는 실용적이고 현실적인 해결책을 선호한다",
  "나는 갈등 상황을 피하려고 한다",
  "나는 여러 가지 일을 동시에 처리하는 것을 좋아한다",
  "나는 사교적이고 외향적이다",
  "나는 미래의 가능성에 대해 생각하는 것을 좋아한다",
  "나는 객관적이고 분석적으로 사고한다",
  "나는 구조화되고 조직적인 환경을 선호한다",
  "나는 팀워크보다는 개인 작업을 선호한다",
  "나는 전통적인 방법보다는 새로운 방법을 시도한다",
  "나는 결정을 내릴 때 다른 사람의 의견을 고려한다",
  "나는 융통성 있고 적응력이 좋다",
]

export default function TestPage() {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()
  const [answers, setAnswers] = useState({})
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login")
    }
  }, [user, isLoading, navigate])

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">로딩 중...</div>
  }

  if (!user) return null

  const handleAnswerChange = (questionIndex, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: Number.parseInt(value),
    }))
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0)
      const averageScore = totalScore / questions.length

      let personality = ""
      let typeDescription = ""

      if (averageScore >= 4) {
        personality = "D형 (지배형)"
        typeDescription = "당신은 도전적이고 리더십이 강한 D형입니다!"
      } else if (averageScore >= 3) {
        personality = "I형 (사교형)"
        typeDescription = "당신은 활발하고 사람을 좋아하는 I형입니다!"
      } else if (averageScore >= 2) {
        personality = "S형 (안정형)"
        typeDescription = "당신은 따뜻하고 성실한 S형입니다!"
      } else {
        personality = "C형 (신중형)"
        typeDescription = "당신은 분석적이고 꼼꼼한 C형입니다!"
      }

      const testResult = {
        userId: user.id,
        userType: personality,
        typeDescription: typeDescription,
        completedAt: new Date().toISOString(),
      }

      const response = await testAPI.saveTestResult(testResult)
      const testId = response.testId
      await contentAPI.requestRecommendation(testId)
      await contentAPI.bookRecommendation(testId)
      await contentAPI.musicRecommendation(testId)
      await contentAPI.movieRecommendation(testId)

      navigate(`/result?testId=${testId}`)

      toast({
        title: "테스트 완료",
        description: "결과를 확인해보세요!",
      })
    } catch (error) {
      console.error("Test submission failed:", error)
      toast({
        title: "오류",
        description: "테스트 결과 저장 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100
  const isAnswered = answers[currentQuestion] !== undefined
  const allAnswered = questions.every((_, index) => answers[index] !== undefined)

  return (
    <div className="min-h-screen bg-background text-foreground dark:bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">성향 테스트</h1>
              <span className="text-sm text-muted-foreground dark:text-gray-300">
                {currentQuestion + 1} / {questions.length}
              </span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>

          <Card className="bg-white dark:bg-muted">
            <CardHeader>
              <CardTitle className="text-lg dark:text-white">{questions[currentQuestion]}</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={answers[currentQuestion]?.toString() || ""}
                onValueChange={(value) => handleAnswerChange(currentQuestion, value)}
              >
                {[5, 4, 3, 2, 1].map((val) => (
                  <div key={val} className="flex items-center space-x-2">
                    <RadioGroupItem value={val.toString()} id={val.toString()} />
                    <Label htmlFor={val.toString()} className="dark:text-gray-300">
                      {val === 5 && "매우 그렇다 (5점)"}
                      {val === 4 && "그렇다 (4점)"}
                      {val === 3 && "보통이다 (3점)"}
                      {val === 2 && "아니다 (2점)"}
                      {val === 1 && "매우 아니다 (1점)"}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
              이전
            </Button>

            {currentQuestion === questions.length - 1 ? (
              <Button onClick={handleSubmit} disabled={!allAnswered || isSubmitting}>
                {isSubmitting ? "결과 저장 중..." : "결과 확인하기"}
              </Button>
            ) : (
              <Button onClick={handleNext} disabled={!isAnswered}>
                다음
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
