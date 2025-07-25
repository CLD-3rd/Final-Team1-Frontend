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
  const [latestResult, setLatestResult] = useState(null);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [resultHistory, setResultHistory] = useState([]);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
  const fetchAll = async () => {
    if (!user || isLoading) return;

    try {
      // 1. 사용자 기본 정보 확인
      const currentUser = await authAPI.getCurrentUser();
      console.log("✅ /auth/me 응답:", currentUser);

      // 2. 전체 테스트 결과 → 최신 성향 추출용
      const resultData = await testAPI.getTestResultHistory(user.id); // 이름 충돌 방지
      console.log("📦 전체 테스트 기록:", resultData);
      setResultHistory(resultData);

      if (resultData && resultData.length > 0) {
        const sorted = resultData.sort((a, b) => b.testId - a.testId);
        const latest = sorted[0];
        console.log("🎯 최신 성향 결과:", latest);
        setLatestResult(latest);
      }


      // 3. 추천 히스토리 목록
      const historyData = await contentAPI.getMypage(user.id);
      console.log("📦 마이페이지 추천 히스토리:", historyData);

      // testId 기준 내림차순 정렬
      const sortedHistory = historyData.sort((a, b) => b.testId - a.testId);
      setHistory(sortedHistory); // ✅ 추천 히스토리 저장

    } catch (err) {
      console.error("❌ 데이터 로딩 실패:", err);
      toast({
        title: "오류",
        description: "마이페이지 정보를 불러오는 중 문제가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  fetchAll();
}, [user, isLoading]);

    const getTestInfoById = (testId) => {
      return resultHistory.find(r => r.testId === testId);
    }

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
                <p className="text-lg font-bold">
                  {latestResult ? latestResult.userType : "테스트를 완료해주세요"}
                </p>
                {latestResult && (
                  <p className="text-sm text-gray-600 mt-1">{latestResult.typeDescription}</p>
                )}
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
                  <Button onClick={() => navigate("/test")}>테스트하러 가기</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {history.map((item, index) => {
                    const testInfo = getTestInfoById(item.testId); // ← 여기서 매칭
                    return (
                      <div
                        key={index}
                        className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => handleHistoryClick(item)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="text-lg font-semibold">
                              {testInfo?.userType || "성향 없음"}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {testInfo?.typeDescription || "설명 없음"}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              {testInfo?.createdAt ? formatDate(testInfo.createdAt) : "날짜 없음"}
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            상세보기
                          </Button>
                        </div>
                      </div>
                    );
                  })}
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
                    {recommendations?.Movie?.map((movie, index) => (
                      <div key={index} className="flex items-start gap-4 bg-gray-100 p-4 rounded-lg shadow-sm">
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
                            <p className="text-sm text-gray-600 mt-1">
                              개봉일: {new Date(movie.release_date).toLocaleDateString("ko-KR")}
                            </p>
                          )}

                          {movie.overview && (
                            <p className="text-sm text-gray-700 mt-2 line-clamp-4">
                              설명: {movie.overview}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                   {/*  Book 탭 */}

                <TabsContent value="books" className="mt-6">
                  <div className="grid gap-4">
                    {recommendations?.Book?.map((book, index) => (
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

                  {/* Music 탭 */}
                  <TabsContent value="music" className="mt-6">
                    <div className="grid gap-4">
                      {recommendations?.Music?.map((music, index) => (
                        <div key={index} className="flex items-start gap-4 bg-gray-100 p-4 rounded-lg shadow-sm">
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
                              <p className="text-sm text-gray-700 mt-1">아티스트: {music.artist}</p>
                            )}
                          </div>
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
