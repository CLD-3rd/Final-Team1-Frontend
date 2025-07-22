// API 호출을 위한 기본 설정
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api"

import { MOCK_RECOMMENDATIONS } from "./mock-data"

// 기본 fetch 설정
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`

  const defaultOptions = {
    credentials: "include", // 쿠키 자동 전송을 위해 필수
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, defaultOptions)
    
    // 응답의 Content-Type 헤더 확인
    const contentType = response.headers.get("content-type")

    if (!response.ok) {
      let errorMessage = response.statusText
      if (contentType?.includes("application/json")) {
        const errorData = await response.json()
        errorMessage = errorData.message || errorMessage
      }
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorMessage}`)
    }

    // 응답이 비어있거나 JSON이 아닌 경우 처리
    if (!contentType || !contentType.includes("application/json")) {
      return {
        success: true,
        status: response.status
      }
    }

    // JSON 응답 파싱
    const data = await response.json()
    return {
      success: true,
      data,
      status: response.status
    }
  } catch (error) {
    console.error("API request failed:", error)
    throw error
  }
}

// 인증 관련 API
export const authAPI = {
  // 로그인
  login: async (accountId, password) => {
    try {
      const response = await apiRequest("/login", {
        method: "POST",
        body: JSON.stringify({ accountId, password }),
      })

      // 로그인 성공 시 바로 사용자 정보 조회
      if (response.success) {
        const userData = await apiRequest("/auth/me")
        return {
          success: true,
          user: userData.data
        }
      }

      return response
    } catch (error) {
      console.error("Login failed:", error)
      return {
        success: false,
        error: error.message
      }
    }
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
    try {
      await apiRequest("/auth/logout", {
        method: "POST",
      })
      // HttpOnly 쿠키는 서버에서 제거됨
    } catch (error) {
      console.error("Logout failed:", error)
      throw error
    }
  },

  // 현재 사용자 정보 조회
  getCurrentUser: async () => {
    try {
      const response = await apiRequest("/auth/me")
      return response.data
    } catch (error) {
      console.error("Failed to get current user:", error)
      throw error
    }
  },

  // 토큰 검증
  validateToken: async () => {
    try {
      const response = await apiRequest("/auth/validate")
      return response.data
    } catch (error) {
      console.error("Token validation failed:", error)
      throw error
    }
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
