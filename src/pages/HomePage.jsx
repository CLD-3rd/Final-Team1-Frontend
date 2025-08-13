import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Header } from "../components/header"
import SearchDrawer from "../components/search/SearchDrawer" // ⬅️ 드로어 컴포넌트

export default function HomePage() {
  const [open, setOpen] = useState(false)

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

        <div className="text-center">
          <Link to="/test">
            <Button size="lg" className="px-12 py-4 text-lg">
              테스트하러가기
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
