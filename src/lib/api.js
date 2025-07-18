// API 호출을 위한 기본 설정
// Vite 환경 변수는 import.meta.env.VITE_ 접두사를 사용합니다.
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api"

import { MOCK_RECOMMENDATIONS } from "./mock-data" // 상대 경로로 변경

// 기본 fetch 설정
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`

  const defaultOptions = {
    credentials: "include", // 쿠키 자동 전송
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, defaultOptions)

    if (!response.ok) {
      // HTTP 에러 발생 시 에러 메시지 포함
      const errorData = await response.json().catch(() => ({ message: response.statusText }))
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || "Unknown error"}`)
    }

    return await response.json()
  } catch (error) {
    console.error("API request failed:", error)
    throw error
  }
}

// 인증 관련 API
export const authAPI = {
  // 로그인
  login: async (email, password) => {
    return apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  },

  // 회원가입
  register: async (name, email, password) => {
    return apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    })
  },

  // 로그아웃
  logout: async () => {
    return apiRequest("/auth/logout", {
      method: "POST",
    })
  },

  // 현재 사용자 정보 조회
  getCurrentUser: async () => {
    return apiRequest("/auth/me")
  },

  // 토큰 검증
  validateToken: async () => {
    return apiRequest("/auth/validate")
  },
}

// 테스트 관련 API
export const testAPI = {
  saveTestResult: async (testData) => {
    try {
      return await apiRequest("/test/save", {
        method: "POST",
        body: JSON.stringify(testData),
      })
    } catch (error) {
      console.log("Backend API not available, saving to localStorage (dev mode)...")

      // 로컬 스토리지에 저장 (개발용)
      const history = JSON.parse(localStorage.getItem("dev-test-history") || "[]")
      const newResult = {
        id: Date.now().toString(),
        ...testData,
        completedAt: testData.completedAt || new Date().toISOString(),
      }
      history.unshift(newResult) // 최신 결과가 맨 앞으로 오도록
      localStorage.setItem("dev-test-history", JSON.stringify(history))

      return { success: true, result: newResult }
    }
  },

  getTestHistory: async () => {
    try {
      return await apiRequest("/test/history")
    } catch (error) {
      console.log("Backend API not available, using localStorage (dev mode)...")

      // 로컬 스토리지에서 조회 (개발용)
      const history = JSON.parse(localStorage.getItem("dev-test-history") || "[]")
      return history
    }
  },

  getRecommendations: async (personality) => {
    try {
      return await apiRequest(`/recommendations/${personality}`)
    } catch (error) {
      console.log("Backend API not available, using mock data (dev mode)...")

      // 목업 데이터 반환 (개발용)
      return MOCK_RECOMMENDATIONS[personality] || MOCK_RECOMMENDATIONS["균형잡힌 분석형"]
    }
  },
}
