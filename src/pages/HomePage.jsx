import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Header } from "../components/header"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { contentAPI } from "../lib/api"

export default function HomePage() {
  const [allRankingData, setAllRankingData] = useState({})
  const [loading, setLoading] = useState(false)

  const personalityTypes = [
    { value: "D형 (지배형)", label: "D형 (지배형)", shortLabel: "D형" },
    { value: "I형 (사교형)", label: "I형 (사교형)", shortLabel: "I형" },
    { value: "S형 (안정형)", label: "S형 (안정형)", shortLabel: "S형" },
    { value: "C형 (신중형)", label: "C형 (신중형)", shortLabel: "C형" },
  ]

  useEffect(() => {
    fetchAllRankings()
  }, [])

  const fetchAllRankings = async () => {
    setLoading(true)
    try {
      const promises = personalityTypes.map(async (type) => {
        const data = await contentAPI.getRanking(type.value, 3)
        return { type: type.value, shortLabel: type.shortLabel, data }
      })
      
      const results = await Promise.all(promises)
      const rankingMap = {}
      results.forEach(result => {
        rankingMap[result.type] = { ...result.data, shortLabel: result.shortLabel }
      })
      
      setAllRankingData(rankingMap)
    } catch (error) {
      console.error("Failed to fetch rankings:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Header />

      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            나만의 성향을 발견하세요
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            간단한 테스트를 통해 당신의 성향을 알아보고,
            <br />
            맞춤형 영화, 책, 음악을 추천받아보세요.
          </p>

          <div className="bg-white dark:bg-muted rounded-lg shadow-lg p-8 mb-12 text-gray-800 dark:text-foreground">
            <h2 className="text-2xl font-semibold mb-4">테스트 소개</h2>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">📝</span>
                </div>
                <h3 className="font-semibold mb-2">간단한 설문</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  20개의 질문으로 구성된 간단한 성향 테스트
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="font-semibold mb-2">정확한 분석</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  과학적 근거를 바탕으로 한 성향 분석
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">🎁</span>
                </div>
                <h3 className="font-semibold mb-2">맞춤 추천</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  당신의 성향에 맞는 컨텐츠 추천
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mb-16">
          <Link to="/test">
            <Button size="lg" className="px-12 py-4 text-lg">
              테스트하러가기
            </Button>
          </Link>
        </div>

        {/* 성향별 인기 콘텐츠 랭킹 섹션 */}
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">성향별 인기 콘텐츠</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              각 성향별로 가장 많이 추천받은 인기 콘텐츠를 확인해보세요
            </p>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">로딩 중...</p>
            </div>
          ) : (
            <Tabs defaultValue="movies" className="w-full">
              <div className="flex justify-center mb-8">
                <div className="bg-white dark:bg-muted rounded-lg shadow-lg p-2 inline-flex gap-2">
                  <TabsList className="bg-transparent grid grid-cols-3 gap-2 h-auto p-0">
                    <TabsTrigger 
                      value="movies" 
                      className="text-lg px-6 py-3 rounded-md bg-transparent border-0 shadow-none data-[state=active]:bg-purple-100 dark:data-[state=active]:bg-purple-800 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-200 hover:bg-purple-50 dark:hover:bg-purple-900 transition-all duration-200 relative after:hidden"
                    >
                      🎬 영화
                    </TabsTrigger>
                    <TabsTrigger 
                      value="books" 
                      className="text-lg px-6 py-3 rounded-md bg-transparent border-0 shadow-none data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-800 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900 transition-all duration-200 relative after:hidden"
                    >
                      📚 책
                    </TabsTrigger>
                    <TabsTrigger 
                      value="music" 
                      className="text-lg px-6 py-3 rounded-md bg-transparent border-0 shadow-none data-[state=active]:bg-green-100 dark:data-[state=active]:bg-green-800 data-[state=active]:text-green-700 dark:data-[state=active]:text-green-200 hover:bg-green-50 dark:hover:bg-green-900 transition-all duration-200 relative after:hidden"
                    >
                      🎵 음악
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>

              <TabsContent value="movies" className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                  {personalityTypes.map((personalityType) => {
                    const typeData = allRankingData[personalityType.value]
                    return (
                      <div key={personalityType.value} className="bg-white dark:bg-muted rounded-lg shadow-lg p-6">
                        <h3 className="text-xl font-bold text-center mb-4 text-purple-600 dark:text-purple-400">
                          {typeData?.shortLabel || personalityType.shortLabel}
                        </h3>
                        <div className="space-y-3">
                          {typeData?.Recommend?.Movie && typeData.Recommend.Movie.length > 0 ? (
                            typeData.Recommend.Movie.map((movie, index) => (
                              <div key={index} className="flex items-start gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center">
                                  <span className="font-bold text-sm text-purple-600 dark:text-purple-300">#{index + 1}</span>
                                </div>
                                <div className="flex-grow min-w-0">
                                  <h4 className="font-semibold text-sm text-gray-900 dark:text-white truncate">{movie.title}</h4>
                                  {movie.overview && (
                                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{movie.overview}</p>
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">데이터가 없습니다</p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </TabsContent>

              <TabsContent value="books" className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                  {personalityTypes.map((personalityType) => {
                    const typeData = allRankingData[personalityType.value]
                    return (
                      <div key={personalityType.value} className="bg-white dark:bg-muted rounded-lg shadow-lg p-6">
                        <h3 className="text-xl font-bold text-center mb-4 text-blue-600 dark:text-blue-400">
                          {typeData?.shortLabel || personalityType.shortLabel}
                        </h3>
                        <div className="space-y-3">
                          {typeData?.Recommend?.Book && typeData.Recommend.Book.length > 0 ? (
                            typeData.Recommend.Book.map((book, index) => (
                              <div key={index} className="flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
                                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                                  <span className="font-bold text-sm text-blue-600 dark:text-blue-300">#{index + 1}</span>
                                </div>
                                <div className="flex-grow min-w-0">
                                  <h4 className="font-semibold text-sm text-gray-900 dark:text-white truncate">{book.title}</h4>
                                  {book.author && (
                                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">저자: {book.author}</p>
                                  )}
                                  {book.description && (
                                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{book.description}</p>
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">데이터가 없습니다</p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </TabsContent>

              <TabsContent value="music" className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                  {personalityTypes.map((personalityType) => {
                    const typeData = allRankingData[personalityType.value]
                    return (
                      <div key={personalityType.value} className="bg-white dark:bg-muted rounded-lg shadow-lg p-6">
                        <h3 className="text-xl font-bold text-center mb-4 text-green-600 dark:text-green-400">
                          {typeData?.shortLabel || personalityType.shortLabel}
                        </h3>
                        <div className="space-y-3">
                          {typeData?.Recommend?.Music && typeData.Recommend.Music.length > 0 ? (
                            typeData.Recommend.Music.map((music, index) => (
                              <div key={index} className="flex items-start gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                                <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                                  <span className="font-bold text-sm text-green-600 dark:text-green-300">#{index + 1}</span>
                                </div>
                                <div className="flex-grow min-w-0">
                                  <h4 className="font-semibold text-sm text-gray-900 dark:text-white truncate">{music.title}</h4>
                                  {music.artist && (
                                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">아티스트: {music.artist}</p>
                                  )}
                                  {music.description && (
                                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{music.description}</p>
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">데이터가 없습니다</p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
    </div>
  )
}
