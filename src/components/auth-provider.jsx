"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { authAPI } from "../lib/api"
import { TEST_ACCOUNTS, MOCK_TEST_HISTORY } from "../lib/mock-data"

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      // AccessToken은 HttpOnly 쿠키로 자동 전송됨
      const userData = await authAPI.getCurrentUser()
      console.log("Current user data:", userData) // 디버깅용
      setUser(userData)
    } catch (error) {
      console.log("Auth check failed, checking test accounts...")
      // 백엔드가 없을 경우 로컬 스토리지 확인
      const savedUser = localStorage.getItem("dev-user")
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (accountId, password) => {
    try {
      const response = await authAPI.login(accountId, password)
      console.log("Login response:", response) // 디버깅용

      if (response.success) {
        // 로그인 성공 후 사용자 정보 다시 조회
        await checkAuthStatus()
        return true
      }
    } catch (error) {
      console.log("Login failed, trying test accounts...")

      // 백엔드가 없을 경우 테스트 계정으로 fallback
      const testAccount = TEST_ACCOUNTS.find(
        (account) => account.username === username && account.password === password
      )

      if (testAccount) {
        const userData = {
          id: testAccount.id,
          name: testAccount.name,
          username: testAccount.username,
          personality: "외향적 리더형",
        }
        setUser(userData)
        localStorage.setItem("dev-user", JSON.stringify(userData))
        localStorage.setItem("dev-test-history", JSON.stringify(MOCK_TEST_HISTORY))
        return true
      }
    }
    return false
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error("Logout failed:", error)
    } finally {
      setUser(null)
      localStorage.removeItem("dev-user")
      localStorage.removeItem("dev-test-history")
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, checkAuthStatus }}>
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
