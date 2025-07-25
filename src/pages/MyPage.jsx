"use client"

import React from 'react'
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom" // useNavigate 임포트
import { useAuth } from "../components/auth-provider" // 상대 경로로 변경
import { Header } from "../components/header" // 상대 경로로 변경
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card" // 상대 경로로 변경
import { Button } from "../components/ui/button" // 상대 경로로 변경
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs" // 상대 경로로 변경
import { testAPI, authAPI,contentAPI } from "../lib/api" // 상대 경로로 변경
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
  if (!isLoading && user) {
    // ✅ 로그인된 상태에서 /auth/me 호출
    authAPI.getCurrentUser().then(currentUser => {
      console.log("✅ /auth/me 응답:", currentUser);
    });

    fetchMypage();
  }
}, [user, isLoading]);


  // 마이페이지 컨텐츠 히스토리 (수정)
const fetchMypage = async () => {
  try {
    const historyData = await contentAPI.getMypage(user.id); // ✅ 여기!
    console.log("📦 마이페이지 응답:", historyData);
    
     // testId 기준 내림차순 정렬 - 최신이 가장 위로 오게 하기 위함
    const sortedHistory = historyData.sort((a, b) => b.testId - a.testId);
    setHistory(sortedHistory);
origin/feat/test-to-connect-auth
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
};



  const handleHistoryClick = (item) => {
    console.log("📝 상세보기 클릭됨:", item); 
  setSelectedHistory(item);
  setRecommendations(item.Recommend); // 이미 응답 내에 있음
};

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
                  <p className="text-lg">{user.username}</p>
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

                  {/*  Movie 탭 */}
                  <TabsContent value="movies" className="mt-6">
                    <div className="grid gap-4">
                      {selectedHistory.Recommend?.Movie?.map((movie, index) => (
                        <div key={index} className="p-4 bg-gray-100 rounded-lg">
                          <h3 className="font-semibold">{movie.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">개봉일: {movie.releaseDate.slice(0, 10)}</p>
                          <p className="text-sm text-gray-600 mt-1">{movie.description}</p>
                          <img src={movie.poster} alt={movie.title} className="mt-2 w-32 rounded" />
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                   {/*  Book 탭 */}
                    <TabsContent value="books" className="mt-6">
                      <div className="grid gap-4">
                        {selectedHistory.Recommend?.Book?.map((book, index) => (
                          <div key={index} className="p-4 bg-gray-100 rounded-lg">
                            <h3 className="font-semibold">{book.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">저자: {book.author}</p>
                            <p className="text-sm text-gray-600 mt-1">{book.description}</p>
                            <img src={book.image} alt={book.title} className="mt-2 w-24 h-auto rounded" />
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                  {/* Music 탭 */}
                  <TabsContent value="music" className="mt-6">
                    <div className="grid gap-4">
                      {selectedHistory.Recommend?.Music?.map((music, index) => (
                        <div key={index} className="p-4 bg-gray-100 rounded-lg">
                          <h3 className="font-semibold">{music.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">아티스트: {music.artist}</p>
                          <img src={music.elbum} alt={music.title} className="mt-2 w-24 h-auto rounded" />
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
