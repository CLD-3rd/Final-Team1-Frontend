import React from "react"
import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Header } from "../components/header"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />

      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">나만의 성향을 발견하세요</h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            간단한 테스트를 통해 당신의 성향을 알아보고,
            <br />
            맞춤형 영화, 책, 음악을 추천받아보세요.
          </p>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <h2 className="text-2xl font-semibold mb-4">테스트 소개</h2>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">📝</span>
                </div>
                <h3 className="font-semibold mb-2">간단한 설문</h3>
                <p className="text-sm text-gray-600">20개의 질문으로 구성된 간단한 성향 테스트</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="font-semibold mb-2">정확한 분석</h3>
                <p className="text-sm text-gray-600">과학적 근거를 바탕으로 한 성향 분석</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">🎁</span>
                </div>
                <h3 className="font-semibold mb-2">맞춤 추천</h3>
                <p className="text-sm text-gray-600">당신의 성향에 맞는 컨텐츠 추천</p>
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
