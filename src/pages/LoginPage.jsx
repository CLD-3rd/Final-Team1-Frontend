"use client"

import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom" // useNavigate와 Link 임포트
import { useAuth } from "../components/auth-provider" // 상대 경로로 변경
import { Header } from "../components/header" // 상대 경로로 변경
import { Button } from "../components/ui/button" // 상대 경로로 변경
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card" // 상대 경로로 변경
import { Input } from "../components/ui/input" // 상대 경로로 변경
import { Label } from "../components/ui/label" // 상대 경로로 변경
import { Separator } from "../components/ui/separator" // 상대 경로로 변경
import { useToast } from "../hooks/use-toast" // 상대 경로로 변경

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate() // useRouter 대신 useNavigate 사용
  const { toast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const success = await login(email, password)
      if (success) {
        toast({
          title: "로그인 성공",
          description: "환영합니다!",
        })
        navigate("/") // router.push 대신 navigate 사용
      } else {
        toast({
          title: "로그인 실패",
          description: "이메일 또는 비밀번호를 확인해주세요.",
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
    // Google OAuth 로그인 - 백엔드 엔드포인트로 리다이렉트
    // Vite 환경 변수는 import.meta.env.VITE_ 접두사를 사용합니다.
    window.location.href = `${import.meta.env.VITE_API_URL || "http://localhost:8080/api"}/auth/google`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">로그인</CardTitle>
              <p className="text-muted-foreground">계정에 로그인하여 성향 테스트를 시작하세요</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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

              <Button variant="outline" className="w-full bg-transparent" onClick={handleGoogleLogin}>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                구글로 로그인
              </Button>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  계정이 없으신가요?{" "}
                  <Link to="/register" className="text-primary hover:underline">
                    회원가입
                  </Link>
                </p>
              </div>

              {/* 테스트 계정 안내 섹션을 더 명확하게 표시: */}
              <div className="text-center text-sm bg-blue-50 p-4 rounded-lg">
                <p className="font-semibold text-blue-800 mb-2">🧪 테스트 계정</p>
                <div className="space-y-1 text-blue-700">
                  <p>
                    <strong>계정 1:</strong> test@example.com / password123
                  </p>
                  <p>
                    <strong>계정 2:</strong> dev@example.com / dev123
                  </p>
                </div>
                <p className="text-xs text-blue-600 mt-2">* 백엔드 서버가 없어도 테스트 가능합니다</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
