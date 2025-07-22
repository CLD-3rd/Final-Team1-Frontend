"use client"

import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Header } from "../components/header"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Separator } from "../components/ui/separator"
import { useToast } from "../hooks/use-toast"
import { authAPI } from "../lib/api"

export default function RegisterPage() {
  const [username, setUsername] = useState("")
  const [accountId, setAccountId] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isAccountIdValid, setIsAccountIdValid] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  // 중복확인
  const checkAccountId = async () => {
    if (!accountId.trim()) {
      toast({
        description: "아이디를 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await authAPI.checkAccountId(accountId)
      setIsAccountIdValid(true)
      toast({
        description: "사용 가능한 아이디입니다."
      })
    } catch (error) {
      setIsAccountIdValid(false)
      toast({
        description: "이미 사용중인 아이디입니다.",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!isAccountIdValid) {
      toast({
        description: "아이디 중복확인을 해주세요.",
        variant: "destructive",
      })
      return
    }

    if (password !== confirmPassword) {
      toast({
        description: "비밀번호가 일치하지 않습니다.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await authAPI.register(username, accountId, password)
      if (response.success) {
        toast({
          description: "회원가입이 완료되었습니다."
        })
        navigate("/login")
      }
    } catch (error) {
      toast({
        description: "회원가입 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">회원가입</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">이름</Label>
                  <Input
                    id="username"
                    placeholder="홍길동"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountId">아이디</Label>
                  <div className="flex gap-2">
                    <Input
                      id="accountId"
                      placeholder="사용할 아이디"
                      value={accountId}
                      onChange={(e) => {
                        setAccountId(e.target.value)
                        setIsAccountIdValid(false)
                      }}
                      required
                    />
                    <Button 
                      type="button" 
                      onClick={checkAccountId}
                    >
                      중복확인
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">비밀번호</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="비밀번호 (6자 이상)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="비밀번호 확인"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={!isAccountIdValid || isLoading}
                >
                  {isLoading ? "처리중..." : "회원가입"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
