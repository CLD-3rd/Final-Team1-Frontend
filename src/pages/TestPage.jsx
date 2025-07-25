"use client"

import React from 'react'
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom" // useNavigate 임포트
import { useAuth } from "../components/auth-provider" // 상대 경로로 변경
import { Header } from "../components/header" // 상대 경로로 변경
import { Button } from "../components/ui/button" // 상대 경로로 변경
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card" // 상대 경로로 변경
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group" // 상대 경로로 변경
import { Label } from "../components/ui/label" // 상대 경로로 변경
import { Progress } from "../components/ui/progress" // 상대 경로로 변경
import { testAPI, contentAPI } from "../lib/api" // 상대 경로로 변경
import { useToast } from "../hooks/use-toast" // 상대 경로로 변경

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
  const navigate = useNavigate() // useRouter 대신 useNavigate 사용
  const [answers, setAnswers] = useState({})
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login") // router.push 대신 navigate 사용
    }
  }, [user, isLoading, navigate]) // 의존성 배열에 navigate 추가

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">로딩 중...</div>
  }

  if (!user) {
    return null
  }

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

  // 테스트 결과 제출 (수정함)
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
      userId: user.id, // 반드시 존재해야 함
      userType: personality,
      typeDescription: typeDescription,
      completedAt: new Date().toISOString()
    }

    // 백엔드에 저장 + testId 응답 받기
    const response = await testAPI.saveTestResult(testResult)
    console.log("백엔드 응답:", response);
    //gemini 백엔드로 testid보내기
  
    const testId = response.testId
    const recommendation = await contentAPI.requestRecommendation(testId)

    console.log("✅ 추천 생성 완료");

    // 3. book/music/movie 추천 요청 보내기 (응답은 무시)
    await contentAPI.bookRecommendation(testId);
    await contentAPI.musicRecommendation(testId);
    await contentAPI.movieRecommendation(testId);
    console.log("📚 음악/책/영화 추천 저장 완료");

    // 결과 페이지로 이동 (testId 넘기기)
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
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">성향 테스트</h1>
              <span className="text-sm text-muted-foreground">
                {currentQuestion + 1} / {questions.length}
              </span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{questions[currentQuestion]}</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={answers[currentQuestion]?.toString() || ""}
                onValueChange={(value) => handleAnswerChange(currentQuestion, value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="5" id="5" />
                  <Label htmlFor="5">매우 그렇다 (5점)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="4" id="4" />
                  <Label htmlFor="4">그렇다 (4점)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="3" id="3" />
                  <Label htmlFor="3">보통이다 (3점)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2" id="2" />
                  <Label htmlFor="2">아니다 (2점)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id="1" />
                  <Label htmlFor="1">매우 아니다 (1점)</Label>
                </div>
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
