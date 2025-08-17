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
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [pageSize] = useState(5)
  const [pageLoading, setPageLoading] = useState(false)
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


      // 3. 전체 테스트 결과 개수를 사용해서 총 페이지 수 계산
      const totalResults = resultData ? resultData.length : 0;
      const calculatedTotalPages = Math.max(1, Math.ceil(totalResults / pageSize));
      setTotalPages(calculatedTotalPages);
      console.log(`총 ${totalResults}개 결과, ${calculatedTotalPages} 페이지`);

      // 4. 추천 히스토리 목록
      const historyData = await contentAPI.getMypage(user.id, 0, pageSize);
      console.log("📦 마이페이지 추천 히스토리:", historyData);

      if (historyData && historyData.length > 0) {
        // 각 히스토리 항목에 createdAt 필드가 없으면 현재 시간을 추가
        const historyWithDates = historyData.map(item => ({
          ...item,
          createdAt: item.createdAt || new Date().toISOString()
        }));
        // testId 기준 내림차순 정렬
        const sortedHistory = historyWithDates.sort((a, b) => b.testId - a.testId);
        setHistory(sortedHistory); // ✅ 추천 히스토리 저장
      } else {
        setHistory([]);
      }

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

  const goToPage = async (page) => {
    if (page === currentPage || pageLoading || page < 0 || page >= totalPages) return;

    setPageLoading(true);
    try {
      const pageData = await contentAPI.getMypage(user.id, page, pageSize);

      if (pageData && pageData.length > 0) {
        const sortedPageData = pageData.sort((a, b) => b.testId - a.testId);
        setHistory(sortedPageData);
      } else {
        setHistory([]);
      }

      setCurrentPage(page);
    } catch (error) {
      console.error("페이지 로드 실패:", error);
      toast({
        title: "오류",
        description: "페이지를 불러오는 중 문제가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setPageLoading(false);
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
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-background dark:text-foreground">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">마이페이지</h1>

          {/* 사용자 정보 */}
          <Card className="mb-8 bg-white dark:bg-muted">
            <CardHeader>
              <CardTitle>내 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-700 dark:text-white mb-2">이름</h3>
                  <p className="text-lg">{user.username}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 dark:text-white mb-2">내 성향</h3>
                  <p className="text-lg font-bold">
                    {latestResult ? latestResult.userType : "테스트를 완료해주세요"}
                  </p>
                  {latestResult && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {latestResult.typeDescription}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 추천 히스토리 */}
          <Card className="bg-white dark:bg-muted">
            <CardHeader>
              <CardTitle>추천받은 컨텐츠 히스토리</CardTitle>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-300 mb-4">아직 테스트를 완료하지 않았습니다.</p>
                  <Button onClick={() => navigate("/test")}>테스트하러 가기</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {history.map((item, index) => {
                    const testInfo = getTestInfoById(item.testId)
                    return (
                      <div
                        key={index}
                        className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-muted transition-colors cursor-pointer"
                        onClick={() => handleHistoryClick(item)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="text-lg font-semibold">
                              {testInfo?.userType || "성향 없음"}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                              {testInfo?.typeDescription || "설명 없음"}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-400 mt-2">
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

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-6">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 0 || pageLoading}
                      >
                        이전
                      </Button>

                      {Array.from({ length: totalPages }, (_, index) => (
                        <Button
                          key={index}
                          variant={currentPage === index ? "default" : "outline"}
                          size="sm"
                          onClick={() => goToPage(index)}
                          disabled={pageLoading}
                          className={currentPage === index ? "bg-primary text-primary-foreground" : ""}
                        >
                          {pageLoading && currentPage === index ? "..." : index + 1}
                        </Button>
                      ))}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage >= totalPages - 1 || pageLoading}
                      >
                        다음
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>



          {/* 선택된 히스토리 상세 */}
          {selectedHistory && recommendations && (
            <Card className="mt-8 bg-white dark:bg-muted">
              <CardHeader>
                <CardTitle>
                  {selectedHistory.personality} - {formatDate(selectedHistory.createdAt)}
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

                  {/* Book */}
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

                  {/* Music 탭 */}
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
                              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">아티스트: {music.artist}</p>
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
