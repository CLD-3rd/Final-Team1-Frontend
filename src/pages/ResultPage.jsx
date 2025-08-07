"use client"

import React, { useState, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { useAuth } from "../components/auth-provider"
import { Header } from "../components/header"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { testAPI, contentAPI } from "../lib/api"
import { useToast } from "../hooks/use-toast"

export default function ResultPage() {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()
  const [latestResult, setLatestResult] = useState(null)
  const [testDetail, setTestDetail] = useState(null)
  const [recommendations, setRecommendations] = useState(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const [searchParams] = useSearchParams()
  const testId = searchParams.get("testId")

  useEffect(() => {
    const fetchBoth = async () => {
      if (!user || isLoading) return

      try {
        if (testId) {
          const res = await contentAPI.getTestHistory(testId)
          setTestDetail(res)
          setRecommendations(res.Recommend)
        }

        const history = await testAPI.getTestResultHistory(user.id)
        if (history && history.length > 0) {
          const sorted = history.sort((a, b) => b.testId - a.testId)
          setLatestResult(sorted[0])
        }
      } catch (error) {
        toast({
          title: "오류",
          description: "결과를 불러오는 중 문제가 발생했습니다.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchBoth()
  }, [user, isLoading, testId])

  if (isLoading || loading) {
    return <div className="flex justify-center items-center min-h-screen">로딩 중...</div>
  }

  if (!user || !recommendations) return null

  return (
    <div className="min-h-screen bg-background text-foreground dark:bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 상단 - 성향 결과 */}
          <div className="h-96 mb-8">
            <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white h-full">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl mb-4">테스트 결과</CardTitle>
                <div className="text-6xl mb-4">🎯</div>
                <h2 className="text-4xl font-bold mb-4">
                  {latestResult?.userType || "성향 없음"}
                </h2>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-lg opacity-90 mb-6">
                  {latestResult?.typeDescription || "설명 없음"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 하단 - 추천 콘텐츠 */}
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

                {/* 영화 */}
                <TabsContent value="movies" className="mt-6">
                  <div className="grid gap-4">
                    {recommendations?.Movie?.map((movie, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-sm"
                      >
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

                {/* 책 */}
                <TabsContent value="books" className="mt-6">
                  <div className="grid gap-4">
                    {recommendations?.Book?.map((book, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-sm"
                      >
                        {book.image && (
                          <img
                            src={book.image}
                            alt={book.title}
                            className="w-24 h-36 object-cover rounded-md"
                          />
                        )}
                        <div>
                          <h3 className="text-lg font-semibold">{book.title}</h3>
                          {book.author && (
                            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">저자: {book.author}</p>
                          )}
                          {book.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                              설명: {book.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* 음악 */}
                <TabsContent value="music" className="mt-6">
                  <div className="grid gap-4">
                    {recommendations?.Music?.map((music, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-sm"
                      >
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
                            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                              아티스트: {music.artist}
                            </p>
                          )}
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
