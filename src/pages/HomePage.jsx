import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Header } from "../components/header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { contentAPI } from "../lib/api"
import SearchDrawer from "../components/search/SearchDrawer" // ⬅️ 드로어 컴포넌트

export default function HomePage() {
  const [open, setOpen] = useState(false)
  

  // 설정 변수들
  const RANKING_SIZE = 3 // 랭킹에서 표시할 아이템 개수
  const AUTO_TAB_INTERVAL = 10000 // 자동 탭 전환 간격 (ms)

  const [allRankingData, setAllRankingData] = useState({})
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("D형")
  const [isAutoPlaying] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isDiscModalOpen, setIsDiscModalOpen] = useState(false)

  const personalityTypes = [
    { value: "D형 (지배형)", label: "D형 (지배형)", shortLabel: "D형" },
    { value: "I형 (사교형)", label: "I형 (사교형)", shortLabel: "I형" },
    { value: "S형 (안정형)", label: "S형 (안정형)", shortLabel: "S형" },
    { value: "C형 (신중형)", label: "C형 (신중형)", shortLabel: "C형" },
  ]

  const tabs = ["D형", "I형", "S형", "C형"]

  useEffect(() => {
    fetchAllRankings()
  }, [])

  const openModal = (item, type) => {
    setSelectedItem({ ...item, type })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedItem(null)
  }

  const openDiscModal = () => {
    setIsDiscModalOpen(true)
  }

  const closeDiscModal = () => {
    setIsDiscModalOpen(false)
  }

  // 자동 탭 전환 기능
  useEffect(() => {
    if (!isAutoPlaying || isPaused) return

    const interval = setInterval(() => {
      setIsTransitioning(true)
      
      setTimeout(() => {
        setActiveTab(current => {
          const currentIndex = tabs.indexOf(current)
          const nextIndex = (currentIndex + 1) % tabs.length
          return tabs[nextIndex]
        })
        
        setTimeout(() => {
          setIsTransitioning(false)
        }, 150)
      }, 150)
    }, AUTO_TAB_INTERVAL) // 자동 탭 전환 간격

    return () => clearInterval(interval)
  }, [isAutoPlaying, isPaused])

  const fetchAllRankings = async () => {
    setLoading(true)
    try {
      const promises = personalityTypes.map(async (type) => {
        const data = await contentAPI.getRanking(type.value, RANKING_SIZE)
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

      {/* 왼쪽 고정 돋보기 버튼 (홈에서만 노출) */}
      <button
        onClick={() => setOpen(true)}
        className="fixed right-5 bottom-24 z-50 w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white
                  flex items-center justify-center shadow-lg"
        aria-label="검색 열기"
        title="검색"
      >
        {/* 돋보기 아이콘 */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path fillRule="evenodd" d="M10.5 3a7.5 7.5 0 015.916 12.195l3.194 3.195a1.125 1.125 0 01-1.59 1.59l-3.195-3.194A7.5 7.5 0 1110.5 3zm0 2.25a5.25 5.25 0 100 10.5 5.25 5.25 0 000-10.5z" clipRule="evenodd" />
        </svg>
      </button>

      {/* 검색 슬라이드 패널 */}
      <SearchDrawer open={open} onClose={() => setOpen(false)} />

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
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">성향별 인기 콘텐츠</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
              각 성향별로 가장 많이 추천받은 인기 콘텐츠를 확인해보세요
            </p>
            <Button 
              onClick={openDiscModal}
              variant="outline"
              className="px-6 py-2 text-lg border-2 border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-200"
            >
              📊 DISC 성향이란?
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">로딩 중...</p>
            </div>
          ) : (
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab} 
              className="w-full"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="flex justify-center mb-8">
                <div className="bg-white dark:bg-muted rounded-lg shadow-lg p-2 inline-flex gap-2">
                  <TabsList className="bg-transparent grid grid-cols-4 gap-2 h-auto p-0">
                    <TabsTrigger 
                      value="D형" 
                      className="text-lg px-6 py-3 rounded-md bg-transparent border-0 shadow-none data-[state=active]:bg-red-100 dark:data-[state=active]:bg-red-800 data-[state=active]:text-red-700 dark:data-[state=active]:text-red-200 hover:bg-red-50 dark:hover:bg-red-900 transition-all duration-200 relative after:hidden"
                    >
                      <svg className="w-5 h-5 mr-2 inline-block" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M13 3L9 12l4 9 4-9-4-9zM4 12l2-4v8l-2-4z"/>
                      </svg>
                      D형
                    </TabsTrigger>
                    <TabsTrigger 
                      value="I형" 
                      className="text-lg px-6 py-3 rounded-md bg-transparent border-0 shadow-none data-[state=active]:bg-yellow-100 dark:data-[state=active]:bg-yellow-800 data-[state=active]:text-yellow-700 dark:data-[state=active]:text-yellow-200 hover:bg-yellow-50 dark:hover:bg-yellow-900 transition-all duration-200 relative after:hidden"
                    >
                      <svg className="w-5 h-5 mr-2 inline-block" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                      </svg>
                      I형
                    </TabsTrigger>
                    <TabsTrigger 
                      value="S형" 
                      className="text-lg px-6 py-3 rounded-md bg-transparent border-0 shadow-none data-[state=active]:bg-green-100 dark:data-[state=active]:bg-green-800 data-[state=active]:text-green-700 dark:data-[state=active]:text-green-200 hover:bg-green-50 dark:hover:bg-green-900 transition-all duration-200 relative after:hidden"
                    >
                      <svg className="w-5 h-5 mr-2 inline-block" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 22c4.97 0 9-4.03 9-9-4.97 0-9 4.03-9 9zM5.6 10.25c0-1.06.87-1.93 1.93-1.93 1.07 0 1.93.87 1.93 1.93 0 1.07-.86 1.93-1.93 1.93-1.06 0-1.93-.86-1.93-1.93zM12 5.29c0-1.39 1.13-2.52 2.52-2.52S17.04 3.9 17.04 5.29c0 1.4-1.13 2.52-2.52 2.52S12 6.69 12 5.29z"/>
                      </svg>
                      S형
                    </TabsTrigger>
                    <TabsTrigger 
                      value="C형" 
                      className="text-lg px-6 py-3 rounded-md bg-transparent border-0 shadow-none data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-800 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900 transition-all duration-200 relative after:hidden"
                    >
                      <svg className="w-5 h-5 mr-2 inline-block" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      C형
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>

              {personalityTypes.map((personalityType) => (
                <TabsContent key={personalityType.shortLabel} value={personalityType.shortLabel} className="mt-8">
                  <div className={`transition-all duration-200 ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                    {(() => {
                      const typeData = allRankingData[personalityType.value]
                      return (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                          {/* 영화 섹션 */}
                          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-purple-100 dark:border-purple-900/30 animate-fade-in">
                            <div className="text-center mb-4">
                              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-3 shadow-lg">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
                                </svg>
                              </div>
                              <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                인기 영화
                              </h3>
                            </div>
                            <div className="space-y-3">
                              {typeData?.Recommend?.Movie && typeData.Recommend.Movie.length > 0 ? (
                                typeData.Recommend.Movie.slice(0, RANKING_SIZE).map((movie, index) => (
                                  <div 
                                    key={index} 
                                    className="group/item relative bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-xl p-3 hover:from-purple-100/70 hover:to-pink-100/70 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20 transition-all duration-200 border border-purple-100/50 dark:border-purple-800/30 cursor-pointer"
                                    onClick={() => openModal(movie, 'movie')}
                                  >
                                    <div className="flex items-start gap-2">
                                      <div className="relative flex-shrink-0">
                                        <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg z-10">
                                          <span className="font-bold text-xs text-white">#{index + 1}</span>
                                        </div>
                                        <div className="relative overflow-hidden rounded-lg shadow-lg group-hover/item:shadow-xl transition-shadow duration-200">
                                          <img 
                                            src={movie.poster_path || "/no-image.png"} 
                                            alt={movie.title}
                                            className="w-14 h-14 object-cover transform group-hover/item:scale-105 transition-transform duration-200 flex-shrink-0"
                                          />
                                        </div>
                                      </div>
                                      <div className="flex-grow min-w-0 overflow-hidden">
                                        <h4 className="font-bold text-xs text-gray-900 dark:text-white mb-1 leading-tight group-hover/item:text-purple-600 dark:group-hover/item:text-purple-400 transition-colors duration-200 truncate">{movie.title}</h4>
                                        {movie.overview && (
                                          <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-1 leading-tight truncate">{movie.overview}</p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="text-center py-4">
                                  <p className="text-gray-500 dark:text-gray-400 text-sm">데이터가 없습니다</p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* 책 섹션 */}
                          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-blue-100 dark:border-blue-900/30 animate-fade-in" style={{ animationDelay: '100ms' }}>
                            <div className="text-center mb-4">
                              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl mb-3 shadow-lg">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zM3 18.5V7c1.1-.35 2.3-.5 3.5-.5 1.34 0 3.13.41 4.5.99v11.5C9.63 18.41 7.84 18 6.5 18c-1.2 0-2.4.15-3.5.5z"/>
                                </svg>
                              </div>
                              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                인기 도서
                              </h3>
                            </div>
                            <div className="space-y-3">
                              {typeData?.Recommend?.Book && typeData.Recommend.Book.length > 0 ? (
                                typeData.Recommend.Book.slice(0, RANKING_SIZE).map((book, index) => (
                                  <div 
                                    key={index}
                                    className="group/item relative bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-xl p-3 hover:from-blue-100/70 hover:to-indigo-100/70 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20 transition-all duration-200 border border-blue-100/50 dark:border-blue-800/30 cursor-pointer"
                                    onClick={() => openModal(book, 'book')}
                                  >
                                    <div className="flex items-start gap-2">
                                      <div className="relative flex-shrink-0">
                                        <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg z-10">
                                          <span className="font-bold text-xs text-white">#{index + 1}</span>
                                        </div>
                                        <div className="relative overflow-hidden rounded-lg shadow-lg group-hover/item:shadow-xl transition-shadow duration-200">
                                          <img 
                                            src={book.image || "/no-image.png"} 
                                            alt={book.title}
                                            className="w-14 h-14 object-cover transform group-hover/item:scale-105 transition-transform duration-200 flex-shrink-0"
                                          />
                                        </div>
                                      </div>
                                      <div className="flex-grow min-w-0 overflow-hidden">
                                        <h4 className="font-bold text-xs text-gray-900 dark:text-white mb-1 leading-tight group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-colors duration-200 truncate">{book.title}</h4>
                                        {book.author && (
                                          <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1 truncate">저자: {book.author}</p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="text-center py-4">
                                  <p className="text-gray-500 dark:text-gray-400 text-sm">데이터가 없습니다</p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* 음악 섹션 */}
                          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-green-100 dark:border-green-900/30 animate-fade-in" style={{ animationDelay: '200ms' }}>
                            <div className="text-center mb-4">
                              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl mb-3 shadow-lg">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                                </svg>
                              </div>
                              <h3 className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                인기 음악
                              </h3>
                            </div>
                            <div className="space-y-3">
                              {typeData?.Recommend?.Music && typeData.Recommend.Music.length > 0 ? (
                                typeData.Recommend.Music.slice(0, RANKING_SIZE).map((music, index) => (
                                  <div 
                                    key={index}
                                    className="group/item relative bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-xl p-3 hover:from-green-100/70 hover:to-emerald-100/70 dark:hover:from-green-900/20 dark:hover:to-emerald-900/20 transition-all duration-200 border border-green-100/50 dark:border-green-800/30 cursor-pointer"
                                    onClick={() => openModal(music, 'music')}
                                  >
                                    <div className="flex items-start gap-2">
                                      <div className="relative flex-shrink-0">
                                        <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg z-10">
                                          <span className="font-bold text-xs text-white">#{index + 1}</span>
                                        </div>
                                        <div className="relative overflow-hidden rounded-xl shadow-lg group-hover/item:shadow-xl transition-shadow duration-200">
                                          <img 
                                            src={music.album || "/no-image.png"} 
                                            alt={music.title}
                                            className="w-14 h-14 object-cover transform group-hover/item:scale-105 transition-transform duration-200 flex-shrink-0"
                                          />
                                        </div>
                                      </div>
                                      <div className="flex-grow min-w-0 overflow-hidden">
                                        <h4 className="font-bold text-xs text-gray-900 dark:text-white mb-1 leading-tight group-hover/item:text-green-600 dark:group-hover/item:text-green-400 transition-colors duration-200 truncate">{music.title}</h4>
                                        {music.artist && (
                                          <p className="text-xs text-green-600 dark:text-green-400 font-medium mb-1 truncate">아티스트: {music.artist}</p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="text-center py-4">
                                  <p className="text-gray-500 dark:text-gray-400 text-sm">데이터가 없습니다</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                </TabsContent>
              ))}

            </Tabs>
          )}
        </div>
      </main>

      {/* 컨텐츠 상세 모달 */}
      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={closeModal}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              {/* 헤더 */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedItem.type === 'movie' && '🎬 영화 정보'}
                  {selectedItem.type === 'book' && '📚 도서 정보'}
                  {selectedItem.type === 'music' && '🎵 음악 정보'}
                </h2>
                <button 
                  onClick={closeModal}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* 컨텐츠 */}
              <div className="flex flex-col md:flex-row gap-6">
                {/* 이미지 */}
                <div className="flex-shrink-0">
                  {selectedItem.type === 'movie' && (
                    <img 
                      src={selectedItem.poster_path || "/no-image.png"} 
                      alt={selectedItem.title}
                      className="w-48 h-64 object-cover rounded-lg shadow-lg mx-auto md:mx-0"
                    />
                  )}
                  {selectedItem.type === 'book' && (
                    <img 
                      src={selectedItem.image || "/no-image.png"} 
                      alt={selectedItem.title}
                      className="w-48 h-64 object-cover rounded-lg shadow-lg mx-auto md:mx-0"
                    />
                  )}
                  {selectedItem.type === 'music' && (
                    <img 
                      src={selectedItem.album || "/no-image.png"} 
                      alt={selectedItem.title}
                      className="w-48 h-48 object-cover rounded-lg shadow-lg mx-auto md:mx-0"
                    />
                  )}
                </div>

                {/* 정보 */}
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{selectedItem.title}</h3>
                  
                  {selectedItem.type === 'movie' && (
                    <>
                      {selectedItem.release_date && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                          <span className="font-medium">개봉일:</span> {new Date(selectedItem.release_date).toLocaleDateString()}
                        </p>
                      )}
                      {selectedItem.overview && (
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">줄거리</h4>
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{selectedItem.overview}</p>
                        </div>
                      )}
                    </>
                  )}

                  {selectedItem.type === 'book' && (
                    <>
                      {selectedItem.author && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                          <span className="font-medium">저자:</span> {selectedItem.author}
                        </p>
                      )}
                      {selectedItem.description && (
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">내용 소개</h4>
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{selectedItem.description}</p>
                        </div>
                      )}
                    </>
                  )}

                  {selectedItem.type === 'music' && (
                    <>
                      {selectedItem.artist && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                          <span className="font-medium">아티스트:</span> {selectedItem.artist}
                        </p>
                      )}
                      {selectedItem.description && (
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">설명</h4>
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{selectedItem.description}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DISC 성향 설명 모달 */}
      {isDiscModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={closeDiscModal}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-8">
              {/* 헤더 */}
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">📊 DISC 성향이란?</h2>
                <button 
                  onClick={closeDiscModal}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* 컨텐츠 */}
              <div className="flex flex-col lg:flex-row gap-8">
                {/* 좌측 이미지 */}
                {/* <div className="flex-shrink-0">
                  <div className="w-80 h-80 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900 rounded-2xl flex items-center justify-center shadow-xl">
                    <div className="text-center p-6">
                      <div className="text-6xl mb-4">🧠</div>
                      <div className="text-2xl font-bold text-gray-700 dark:text-gray-200">DISC</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300 mt-2">성향 분석 시스템</div>
                    </div>
                  </div>
                </div> */}

                {/* 우측 설명 */}
                <div className="flex-grow">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">DISC란?</h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        DISC는 인간의 행동 패턴을 4가지 주요 성향으로 분류하는 성격 유형 분석 도구입니다. 
                        각 성향은 개인의 일상적인 행동, 의사소통 방식, 그리고 의사결정 과정에서 나타나는 
                        특징적인 패턴을 나타냅니다.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                        <h4 className="font-bold text-red-700 dark:text-red-300 mb-2">🔥 D형 (지배형)</h4>
                        <p className="text-sm text-red-600 dark:text-red-400">
                          직접적이고 결단력 있는 리더십을 가진 성향. 빠른 의사결정과 목표 지향적 행동을 선호합니다.
                        </p>
                      </div>

                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <h4 className="font-bold text-yellow-700 dark:text-yellow-300 mb-2">⭐ I형 (사교형)</h4>
                        <p className="text-sm text-yellow-600 dark:text-yellow-400">
                          낙관적이고 사교적인 성향. 사람들과의 상호작용을 즐기며 창의적이고 영감을 주는 특성이 있습니다.
                        </p>
                      </div>

                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                        <h4 className="font-bold text-green-700 dark:text-green-300 mb-2">🌱 S형 (안정형)</h4>
                        <p className="text-sm text-green-600 dark:text-green-400">
                          안정적이고 협조적인 성향. 팀워크를 중시하며 신뢰할 수 있고 일관성 있는 행동을 보입니다.
                        </p>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                        <h4 className="font-bold text-blue-700 dark:text-blue-300 mb-2">🔍 C형 (신중형)</h4>
                        <p className="text-sm text-blue-600 dark:text-blue-400">
                          체계적이고 정확한 성향. 논리적 사고와 품질을 중시하며 세부사항에 주의를 기울입니다.
                        </p>
                      </div>
                    </div>

                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800">
                      <h4 className="font-bold text-indigo-700 dark:text-indigo-300 mb-2">💡 DISC의 활용</h4>
                      <p className="text-sm text-indigo-600 dark:text-indigo-400">
                        DISC 성향 분석을 통해 자신의 강점과 약점을 파악하고, 더 나은 의사소통과 관계 형성을 도모할 수 있습니다. 
                        또한 개인에게 맞는 컨텐츠와 활동을 추천받아 더욱 만족스러운 삶을 살 수 있도록 도와줍니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
