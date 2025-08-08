"use client"

import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../components/auth-provider"
import { Header } from "../components/header"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Separator } from "../components/ui/separator"
import { useToast } from "../hooks/use-toast"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const success = await login(username, password)
      if (success) {
        toast({
          title: "로그인 성공",
          description: "환영합니다!",
        })
        navigate("/")
      } else {
        toast({
          title: "로그인 실패",
          description: "아이디 또는 비밀번호를 확인해주세요.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "오류",
        description: "로그인 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/oauth2/authorization/google`
  }

  return (
    <div className="min-h-screen bg-background text-foreground dark:bg-background">
      <Header />

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card className="bg-white dark:bg-muted text-gray-900 dark:text-foreground">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl dark:text-white">로그인</CardTitle>
              <p className="text-muted-foreground dark:text-gray-300">
                계정에 로그인하여 성향 테스트를 시작하세요
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">아이디</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="아이디를 입력하세요"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">비밀번호</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "로그인 중..." : "로그인"}
                </Button>
              </form>

              <Separator />

              <Button
                variant="outline"
                className="w-full bg-transparent dark:border-gray-600"
                onClick={handleGoogleLogin}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  {/* (svg 생략) */}
                </svg>
                구글로 로그인
              </Button>

              <div className="text-center">
                <p className="text-sm text-muted-foreground dark:text-gray-300">
                  계정이 없으신가요?{" "}
                  <Link to="/register" className="text-primary hover:underline">
                    회원가입
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
