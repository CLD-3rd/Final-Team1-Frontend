"use client"

import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "./auth-provider"
import { Button } from "./ui/button"
import { getInitialTheme, setTheme } from "../utils/theme"

export function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [theme, setThemeState] = useState("light")

  useEffect(() => {
    const initialTheme = getInitialTheme()
    setTheme(initialTheme)
    setThemeState(initialTheme)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    setThemeState(newTheme)
  }

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <header className="border-b bg-white dark:bg-background">
      <div className="container mx-auto px-2 py-2 flex justify-between items-center">
        <div className="flex items-center gap-4 min-h-[64px]">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-16 w-auto">
              <img
                src={theme === "dark" ? "/logo-dark.png" : "/logo.png"}
                alt="로고"
                className="h-full w-auto object-contain"
              />
            </div>
          </Link>

          {/* 다크모드 토글 버튼 - 로고 옆 */}
          <button
            onClick={toggleTheme}
            className="text-2xl"
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? "🌞" : "🌙"}
          </button>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground">
                안녕하세요, {user.username}님
              </span>
              <Link to="/mypage">
                <Button variant="outline" size="sm">
                  마이페이지
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                로그아웃
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" size="sm">
                  로그인
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">회원가입</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
