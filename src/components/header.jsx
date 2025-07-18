"use client"

import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "./auth-provider"
import { Button } from "./ui/button"

export function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary">
          성향 테스트
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground">안녕하세요, {user.name}님</span>
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