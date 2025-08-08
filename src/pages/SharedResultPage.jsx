"use client"

import React from 'react'
import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom"
import { Header } from "../components/header"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { useToast } from "../hooks/use-toast"
import { testAPI } from "../lib/api" // 상대 경로로 변경

export default function SharedResultPage() {
  const navigate = useNavigate()
  const [resultData, setResultData] = useState(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const fetchResultData = async () => {
      try {
        // URL 파라미터에서 결과 데이터 가져오기
        const value = searchParams.get("value") // 서버에서 받은 value 파라미터
        const userType = searchParams.get("userType")
        const typeDescription = searchParams.get("typeDescription")
        const recommendations = searchParams.get("recommendations")
        const testId = searchParams.get("testId") // testId도 가져오기

        // value 파라미터가 있으면 서버에서 데이터 가져오기
        if (value) {
          try {
            const sharedData = await testAPI.getSharedData(value);
            console.log("서버에서 받은 공유 데이터:", sharedData);
            
            setResultData({
              userType: "공유된 결과",
              typeDescription: `${sharedData.name}님의 결과입니다`,
              recommendations: sharedData.RecommendHistory?.body?.Recommend || null,
              testId: sharedData.RecommendHistory?.body?.testId || null,
              sharedValue: value,
              userName: sharedData.name
            });
          } catch (error) {
            console.error("공유 데이터 가져오기 실패:", error);
            toast({
              title: "오류",
              description: "공유된 결과를 불러오는데 실패했습니다.",
              variant: "destructive",
            });
            navigate("/");
          }
          return;
        }

        if (!userType) {
          toast({
            title: "오류",
            description: "유효하지 않은 결과 링크입니다.",
            variant: "destructive",
          })
          navigate("/")
          return
        }

        // recommendations가 있으면 JSON으로 파싱
        let parsedRecommendations = null
        if (recommendations) {
          try {
            parsedRecommendations = JSON.parse(decodeURIComponent(recommendations))
          } catch (e) {
            console.error("추천 데이터 파싱 실패:", e)
          }
        }

        setResultData({
          userType,
          typeDescription,
          recommendations: parsedRecommendations,
          testId // testId도 저장
        })

      } catch (error) {
        console.error("❌ 데이터 처리 실패:", error)
        toast({
          title: "오류",
          description: "결과를 불러오는 중 문제가 발생했습니다.",
          variant: "destructive",
        })
        navigate("/")
      } finally {
        setLoading(false)
      }
    }

    fetchResultData()
  }, [searchParams, navigate, toast])

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">로딩 중...</div>
  }

  if (!resultData) {
    return null
  }

  return (
    <div className="min-h-screen bg-background text-foreground dark:bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 상단 절반 - 성향 결과 */}
          <div className="h-96 mb-8">
            <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white h-full">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl mb-4">테스트 결과</CardTitle>
                <div className="text-6xl mb-4">🎯</div>
                <h2 className="text-4xl font-bold mb-4">
                  {resultData.userType || "성향 없음"}
                </h2>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-lg opacity-90 mb-6">
                  {resultData.typeDescription || "설명 없음"}
                </p>
                {/* {resultData.userName && (
                  <div className="mt-4 p-4 bg-white/10 rounded-lg">
                    <p className="text-sm opacity-90">공유자: {resultData.userName}</p>
                  </div>
                )} */}
              </CardContent>
            </Card>
          </div>

          {/* 하단 절반 - 추천 컨텐츠 */}
          {resultData.recommendations && (
            <Card className="bg-white dark:bg-muted">
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
                      {resultData.recommendations?.Movie?.map((movie, index) => (
                        <div key={index} className="flex items-start gap-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                          {movie.poster_path && (
                            <img
                              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                              alt={movie.title}
                              className="w-24 h-36 object-cover rounded-md"
                            />
                          )}
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold">제목: {movie.title}</h3>

                            {movie.release_date && (
                              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                개봉일: {new Date(movie.release_date).toLocaleDateString("ko-KR")}
                              </p>
                            )}

                            {movie.overview && (
                              <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 line-clamp-4">
                                설명: {movie.overview}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="books" className="mt-6">
                    <div className="grid gap-4">
                      {resultData.recommendations?.Book?.map((book, index) => (
                        <div key={index} className="flex items-start gap-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                          {book.image && (
                            <img
                              src={book.image}
                              alt={book.title}
                              className="w-24 h-36 object-cover rounded-md"
                            />
                          )}
                          <div>
                            <h3 className="text-lg font-semibold">{book.title}</h3>
                            {book.author && <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">저자: {book.author}</p>}
                            {book.description && <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">설명: {book.description}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="music" className="mt-6">
                    <div className="grid gap-4">
                      {resultData.recommendations?.Music?.map((music, index) => (
                        <div key={index} className="flex items-start gap-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                          {music.album && (
                            <img
                              src={music.album}
                              alt={music.title}
                              className="w-24 h-24 object-cover rounded-md"
                            />
                          )}
                          <div>
                            <h3 className="text-lg font-semibold">제목: {music.title}</h3>
                            {music.artist && (
                              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">아티스트: {music.artist}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                </Tabs>
              </CardContent>
            </Card>
          )}

          <div className="text-center mt-8">
            <Button variant="outline" onClick={() => navigate("/")} className="mr-4">
              홈으로 돌아가기
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
} 