"use client"

import React from 'react'
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom" // useNavigate 임포트
import { useAuth } from "../components/auth-provider" // 상대 경로로 변경
import { Header } from "../components/header" // 상대 경로로 변경
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card" // 상대 경로로 변경
import { Button } from "../components/ui/button" // 상대 경로로 변경
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs" // 상대 경로로 변경
import { testAPI } from "../lib/api" // 상대 경로로 변경
import { useToast } from "../hooks/use-toast" // 상대 경로로 변경

export default function MyPage() {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate() // useRouter 대신 useNavigate 사용
  const [history, setHistory] = useState([])
  const [selectedHistory, setSelectedHistory] = useState(null)
  const [recommendations, setRecommendations] = useState(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login") // router.push 대신 navigate 사용
      return
    }

    if (user) {
      fetchTestHistory()
    }
  }, [user, isLoading]) 


  // 마이페이지 컨텐츠 히스토리 (수정)
const fetchTestHistory = async () => {
  try {
    const historyData = await testAPI.getTestResultHistory(user.id);
    console.log("API 응답 데이터:", historyData);
    setHistory(historyData);
  } catch (error) {
    console.error("Failed to fetch test history:", error);
    toast({
      title: "오류",
      description: "테스트 히스토리를 불러오는 중 오류가 발생했습니다.",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
}



  const handleHistoryClick = async (item) => {
    try {
      setSelectedHistory(item)
      // 해당 성향의 추천 컨텐츠 조회
      // const recs = await testAPI.getRecommendations(item.personality)
      const recs = await testAPI.getRecommendations(item.userType)  // userType으로 변경
      setRecommendations(recs)
    } catch (error) {
      console.error("Failed to fetch recommendations:", error)
      toast({
        title: "오류",
        description: "추천 컨텐츠를 불러오는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  if (isLoading || loading) {
    return <div className="flex justify-center items-center min-h-screen">로딩 중...</div>
  }

  if (!user) {
    return null
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">마이페이지</h1>

          {/* 사용자 정보 */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>내 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">이름</h3>
                  <p className="text-lg">{user.name}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">내 성향</h3>
                  <p className="text-lg">{history.length > 0 ? history[0].userType : "테스트를 완료해주세요"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 추천 히스토리 */}
          <Card>
            <CardHeader>
              <CardTitle>추천받은 컨텐츠 히스토리</CardTitle>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">아직 테스트를 완료하지 않았습니다.</p>
                  <Button onClick={() => navigate("/test")}>테스트하러 가기</Button> {/* navigate 사용 */}
                </div>
              ) : (
                <div className="space-y-4">
                  {history.map((item, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleHistoryClick(item)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">{item.userType}</p> {/*personality -> 수정: userType 사용 */}
                          <p className="text-sm text-gray-500">{formatDate(item.createdAt)}</p> {/* item.completedAt -> 수정: createdAt 사용 */}
                          {/* <p className="text-sm text-gray-600">점수: {item.score.toFixed(1)}점</p> */}
                          {/* <p className="text-sm text-gray-600">점수: {typeof item.score === "number" ? item.score.toFixed(1) : "-"}점</p> */}
                        </div>
                        <Button variant="outline" size="sm">
                          상세보기
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 선택된 히스토리 상세 */}
          {selectedHistory && recommendations && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>
                  {selectedHistory.personality} - {formatDate(selectedHistory.completedAt)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="movies" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="movies">🎬 영화</TabsTrigger>
                    <TabsTrigger value="books">📚 책</TabsTrigger>
                    <TabsTrigger value="music">🎵 음악</TabsTrigger>
                  </TabsList>

                  <TabsContent value="movies" className="mt-6">
                    <div className="grid gap-3">
                      {recommendations.movies?.map((movie, index) => (
                        <div key={index} className="p-3 bg-gray-100 rounded">
                          <h4 className="font-semibold">{movie.title}</h4>
                          {movie.description && <p className="text-sm text-gray-600 mt-1">{movie.description}</p>}
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="books" className="mt-6">
                    <div className="grid gap-3">
                      {recommendations.books?.map((book, index) => (
                        <div key={index} className="p-3 bg-gray-100 rounded">
                          <h4 className="font-semibold">{book.title}</h4>
                          {book.author && <p className="text-sm text-gray-600 mt-1">저자: {book.author}</p>}
                          {book.description && <p className="text-sm text-gray-600 mt-1">{book.description}</p>}
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="music" className="mt-6">
                    <div className="grid gap-3">
                      {recommendations.music?.map((artist, index) => (
                        <div key={index} className="p-3 bg-gray-100 rounded">
                          <h4 className="font-semibold">{artist.name}</h4>
                          {artist.genre && <p className="text-sm text-gray-600 mt-1">장르: {artist.genre}</p>}
                          {artist.description && <p className="text-sm text-gray-600 mt-1">{artist.description}</p>}
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="mt-6">
                  <Button variant="outline" onClick={() => setSelectedHistory(null)}>
                    닫기
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
