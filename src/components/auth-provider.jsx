"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { authAPI } from "../lib/api" // 상대 경로로 변경
import { getCookie, deleteCookie } from "../lib/cookie-utils" // 상대 경로로 변경
import { TEST_ACCOUNTS, MOCK_TEST_HISTORY } from "../lib/mock-data" // 상대 경로로 변경

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = getCookie("auth-token")
      if (token) {
        const userData = await authAPI.getCurrentUser()
        setUser(userData)
      }
    } catch (error) {
      console.log("Backend API not available, checking local storage for dev user...")

      // 백엔드가 없을 경우 로컬 스토리지 확인
      const savedUser = localStorage.getItem("dev-user")
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      // 먼저 백엔드 API 시도
      const response = await authAPI.login(email, password)
      if (response.success) {
        setUser(response.user)
        return true
      }
    } catch (error) {
      console.log("Backend API not available, trying test accounts...")

      // 백엔드가 없을 경우 테스트 계정으로 fallback
      const testAccount = TEST_ACCOUNTS.find((account) => account.email === email && account.password === password)

      if (testAccount) {
        const userData = {
          id: testAccount.id,
          name: testAccount.name,
          email: testAccount.email,
          personality: "외향적 리더형", // 테스트 계정의 기본 성향
        }
        setUser(userData)

        // 로컬 스토리지에 임시 저장 (개발용)
        localStorage.setItem("dev-user", JSON.stringify(userData))
        localStorage.setItem("dev-test-history", JSON.stringify(MOCK_TEST_HISTORY))

        return true
      }
    }
    return false
  }

  const register = async (name, email, password) => {
    try {
      const response = await authAPI.register(name, email, password)
      if (response.success) {
        setUser(response.user)
        return true
      }
    } catch (error) {
      console.log("Backend API not available, creating test account...")

      // 백엔드가 없을 경우 임시 계정 생성
      const userData = {
        id: Date.now().toString(),
        name: name,
        email: email,
        personality: null,
      }
      setUser(userData)
      localStorage.setItem("dev-user", JSON.stringify(userData))
      return true
    }
    return false
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error("Logout failed:", error)
    } finally {
      // 클라이언트 상태 초기화
      setUser(null)
      deleteCookie("auth-token")
      localStorage.removeItem("dev-user") // 개발용 로컬 스토리지도 삭제
      localStorage.removeItem("dev-test-history") // 개발용 테스트 히스토리도 삭제
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
