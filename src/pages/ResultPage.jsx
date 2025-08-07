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
  const [latestResult, setLatestResult] = useState(null);     // 👉 상단 성향용
  const [testDetail, setTestDetail] = useState(null); 
  const [recommendations, setRecommendations] = useState(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const [searchParams] = useSearchParams();
  const testId = searchParams.get("testId");
console.log("넘겨받은 testId:", testId);

  useEffect(() => {
  const fetchBoth = async () => {
    if (!user || isLoading) return;

    try {
      // 1. testId로 상세 테스트 결과 조회
      if (testId) {
        const res = await contentAPI.getTestHistory(testId);
        console.log("✅ testId 기반 결과:", res);
        setTestDetail(res);
        setRecommendations(res.Recommend);
        console.log("✅ testId 기반 결과- Recommend만:", res.Recommend);
      }

       // 2. user.id로 테스트 기록 조회
      const history = await testAPI.getTestResultHistory(user.id);
      console.log("📦 전체 기록 목록:", history);

      if (history && history.length > 0) {
        const sorted = history.sort((a, b) => b.testId - a.testId);
        const latest = sorted[0];
        console.log("🔥 testId 가장 큰 최신 기록:", latest);
        setLatestResult(latest); //최신 결과 
      }

    } catch (error) {
      console.error("❌ 데이터 요청 실패:", error);
      toast({
        title: "오류",
        description: "결과를 불러오는 중 문제가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  fetchBoth();
}, [user, isLoading, testId]);


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
            </CardContent>
          </Card>

          <div className="text-center mt-8">
            <Button onClick={() => navigate("/test")} className="mr-4">
              다시 테스트하기
            </Button>
            <Button variant="outline" onClick={() => navigate("/") } className="mr-4">
              홈으로 돌아가기
            </Button>
            <Button
              variant="outline"
              onClick={async () => {
                try {
                  // 서버에서 공유 URL 가져오기
                  const shareResponse = await testAPI.getShareUrl(testId, user?.username || "사용자");
                  
                  // SharedResultPage로 이동하는 URL 생성 (value 파라미터로 shareResponse 전달)
                  const shareUrl = new URL(window.location.origin + "/shared-result");
                  shareUrl.searchParams.set("value", shareResponse.value);
                  
                  await navigator.clipboard.writeText(shareUrl);
                  toast({
                    title: "공유 링크 복사 완료!",
                    description: "결과 페이지 링크가 클립보드에 복사되었습니다.",
                  });
                } catch (err) {
                  console.error("공유 URL 가져오기 실패:", err);
                  toast({
                    title: "복사 실패",
                    description: "공유 링크를 가져오는데 실패했습니다. 다시 시도해주세요.",
                    variant: "destructive",
                  });
                }
              }}
            >
              공유하기
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
