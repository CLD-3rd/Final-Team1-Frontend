// src/App.jsx

import React, { useEffect } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./components/auth-provider"
import { Toaster } from "./components/ui/toaster"
import { getInitialTheme, setTheme } from "./utils/theme"

// 페이지 컴포넌트
import HomePage from "./pages/HomePage"
import TestPage from "./pages/TestPage"
import ResultPage from "./pages/ResultPage"
import MyPage from "./pages/MyPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"

function App() {
  useEffect(() => {
    const initialTheme = getInitialTheme()
    setTheme(initialTheme)
  }, [])

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  )
}

export default App
