"use client"

import React from 'react'
import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom" // useNavigate 임포트
import { useAuth } from "../components/auth-provider" // 상대 경로로 변경
import { Header } from "../components/header" // 상대 경로로 변경
import { Button } from "../components/ui/button" // 상대 경로로 변경
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card" // 상대 경로로 변경
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs" // 상대 경로로 변경
import { testAPI,contentAPI   } from "../lib/api" // 상대 경로로 변경
import { useToast } from "../hooks/use-toast" // 상대 경로로 변경

export default function ResultPage() {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate() // useRouter 대신 useNavigate 사용
  const [testResult, setTestResult] = useState(null)
  const [recommendations, setRecommendations] = useState(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const [searchParams] = useSearchParams();
  const testId = searchParams.get("testId");
console.log("넘겨받은 testId:", testId);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login") // router.push 대신 navigate 사용
      return
    }

  //   if (user) {
  //     fetchLatestResult()
  //   }
  // }, [user, isLoading, navigate]) // 의존성 배열에 navigate 추가
  if (user && testId) {
    console.log("📦 testId 기반 기록 요청:", testId)  // ✅ 로그로 확인
    contentAPI.getTestHistory(testId)  // 이 호출이 있는지?
      .then((res) => {
        console.log("✅ 받아온 기록 전체:", res)
        setTestResult(res) // 여기서 testResult로 저장
        setRecommendations(res.Recommend) // 추천 결과도 저장
      })
      .catch(err => console.error("❌ 요청 실패:", err))
  }
}, [user, isLoading, testId])

const fetchLatestResult = async () => {
  try {
    if (testId) {
      // testId가 있으면 해당 ID로 추천만 불러오기
      const recs = await contentAPI.requestRecommendation(testId)
      setRecommendations(recs)
    } else {
      //  testId가 없으면 기존 로직으로 사용자 기반 최신 결과 조회
      // const history = await testAPI.getTestHistory(user.id)
     // user.id를 인자로 전달
     const history = await testAPI.getTestResultHistory(user.id);

      if (history.length === 0) {
        navigate("/test")
        return
      }

      const latestResult = history[0]
      setTestResult(latestResult)

      const recs = await testAPI.getRecommendations(latestResult.personality || latestResult.userType)
      setRecommendations(recs)
    }
  } catch (error) {
    console.error("추천 조회 실패:", error)
    toast({
      title: "오류",
      description: "추천 정보를 불러오는 중 문제가 발생했습니다.",
      variant: "destructive",
    })
    navigate("/test")
  } finally {
    setLoading(false)
  }
}



  if (isLoading || loading) {
    return <div className="flex justify-center items-center min-h-screen">로딩 중...</div>
  }

    if (!user || !recommendations) {
    return null
  }
  // if (!user || !testResult || !recommendations) {
  //   return null
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 상단 절반 - 성향 결과 */}
          <div className="h-96 mb-8">
            <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white h-full">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl mb-4">테스트 결과</CardTitle>
                <div className="text-6xl mb-4">🎯</div>
                <h2 className="text-4xl font-bold mb-4">{testResult.personality || testResult.userType || "성향 정보 없음"}</h2>
                {/* <p className="text-xl opacity-90">평균 점수: {testResult.score.toFixed(1)}점</p> */}
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-lg opacity-90 mb-6">
                  {["D", "I", "S", "C"].includes(testResult.personality || testResult.userType) ? (
                    <>
                      {testResult.personality === "D" || testResult.userType === "D"
                        ? "당신은 사교적이고 리더십이 뛰어난 성향입니다. 새로운 도전을 즐기고 팀을 이끄는 것을 좋아합니다."
                        : testResult.personality === "I" || testResult.userType === "I"
                        ? "당신은 논리적이면서도 감정적 균형을 잘 맞추는 성향입니다. 신중하게 판단하고 합리적인 결정을 내립니다."
                        : testResult.personality === "S" || testResult.userType === "S"
                        ? "당신은 깊이 있게 생각하고 신중한 성향입니다. 혼자만의 시간을 소중히 여기고 내면의 성찰을 중요하게 생각합니다."
                        : testResult.personality === "C" || testResult.userType === "C"
                        ? "당신은 창의적이고 혁신적인 성향입니다. 새로운 아이디어와 가능성을 탐구하는 것을 좋아합니다."
                        : null}
                    </>
                  ) : (
                    "성향 설명을 찾을 수 없습니다."
                  )}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 하단 절반 - 추천 컨텐츠 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">맞춤 추천 컨텐츠</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="movies" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="movies">🎬 영화</TabsTrigger>
                  <TabsTrigger value="books">📚 책</TabsTrigger>
                  <TabsTrigger value="music">🎵 음악</TabsTrigger>
                </TabsList>

                <TabsContent value="movies" className="mt-6">
                  <div className="grid gap-4">
                    {recommendations?.Recommend?.Movie?.map((movie, index) => (
                      <div key={index} className="flex items-start gap-4 bg-gray-100 p-4 rounded-lg shadow-sm">
                        {movie.poster && (
                          <img
                            src={movie.poster}
                            alt={movie.title}
                            className="w-24 h-36 object-cover rounded-md"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold">제목: {movie.title}</h3>
                          {movie.releaseDate && (
                            <p className="text-sm text-gray-600 mt-1">
                              개봉일: {new Date(movie.releaseDate).toLocaleDateString("ko-KR")}
                            </p>
                          )}
                          {movie.description && (
                            <p className="text-sm text-gray-700 mt-2 line-clamp-4">
                            설명:  {movie.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="books" className="mt-6">
                  <div className="grid gap-4">
                    {recommendations?.Recommend?.Book?.map((book, index) => (
                      <div key={index} className="flex items-start gap-4 bg-gray-100 p-4 rounded-lg shadow-sm">
                        {book.image && (
                          <img
                            src={book.image}
                            alt={book.title}
                            className="w-24 h-36 object-cover rounded-md"
                          />
                        )}
                        <div>
                          <h3 className="text-lg font-semibold">{book.title}</h3>
                          {book.author && <p className="text-sm text-gray-700 mt-1">저자: {book.author}</p>}
                          {book.description && <p className="text-sm text-gray-600 mt-2">설명: {book.description}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="music" className="mt-6">
                  <div className="grid gap-4">
                    {recommendations?.Recommend?.Music?.map((music, index) => (
                      <div key={index} className="flex items-start gap-4 bg-gray-100 p-4 rounded-lg shadow-sm">
                        {music.elbum && (
                          <img
                            src={music.elbum}
                            alt={music.title}
                            className="w-24 h-24 object-cover rounded-md"
                          />
                        )}
                        <div>
                          <h3 className="text-lg font-semibold">제목: {music.title}</h3>
                          {music.artist && <p className="text-sm text-gray-700 mt-1">아티스트: {music.artist}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

              </Tabs>
            </CardContent>
          </Card>

          <div className="text-center mt-8">
            <Button onClick={() => navigate("/test")} className="mr-4">
              다시 테스트하기
            </Button>
            <Button variant="outline" onClick={() => navigate("/")}>
              홈으로 돌아가기
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
