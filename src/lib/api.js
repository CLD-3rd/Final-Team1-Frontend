// API 호출을 위한 기본 설정
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080"
const CONTENT_SERVER_BASE_URL = import.meta.env.VITE_CONTENT_API_URL || "http://localhost:8081/api"
const INFO_SERVER_BASE_URL = import.meta.env.VITE_INFO_SERVER_API_URL || "http://localhost:8082/api"


import { MOCK_RECOMMENDATIONS } from "./mock-data"


// 기본 fetch 설정
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`

  const defaultOptions = {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, defaultOptions)
    
    // 401 에러는 조용히 처리
    if (response.status === 401) {
      console.log("🔒 로그인이 필요한 서비스입니다.")
      throw new Error("Unauthorized")
    }

    // 응답의 Content-Type 헤더 확인
    const contentType = response.headers.get("content-type")
    console.log("Response Content-Type:", contentType) // 디버깅

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
      console.log("No JSON content-type, returning status-only response") // 디버깅
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
    if (error.message === "Unauthorized") {
      throw error
    }
    console.error("API request failed:", error)
    throw error
  }
}


// 컨텐츠 서버용 요청 --------------
// 8081 content 서버용 요청 함수 추가
const contentApiRequest = async (endpoint, options = {}) => {
  const url = `${CONTENT_SERVER_BASE_URL}${endpoint}`;

  const defaultOptions = {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  };

  const response = await fetch(url, defaultOptions);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || "Unknown error"}`);
  }
  const data = await response.json();           
  console.log(`📦 [contentApiRequest] ${url} 응답:`, data);
  return data;  
};

//---------------------------------------------

// 8082 테스트 서버용 요청 함수 추가
const testApiRequest = async (endpoint, options = {}) => {
  const url = `${INFO_SERVER_BASE_URL}${endpoint}`;
  const token = localStorage.getItem("accessToken");

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

// 로그 상태를 추적하기 위한 변수
let isAuthChecked = false;

// 인증 관련 API
export const authAPI = {
  
  // 로그인
  login: async (accountId, password) => {
    try {
      const response = await apiRequest("/login", {
        method: "POST",
        body: JSON.stringify({ accountId, password }),
      })
        console.log("Login response:", response) // 디버깅용
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
  register: async (username, accountId, password) => {
    try {
      const response = await apiRequest("/auth/join", {
        method: "POST",
        body: JSON.stringify({ username, accountId, password }),
      })
      return response
    } catch (error) {
      console.error("Register failed:", error)
      throw error
    }
  },

  // 로그아웃
  logout: async () => {
    try {
      await apiRequest("/auth/logout", {
        method: "POST",
      })
      // HttpOnly 쿠키는 서버에서 제거됨
      isAuthChecked = false // 로그아웃 시 상태 초기화
    } catch (error) {
      console.error("Logout failed:", error)
      throw error
    }
  },

  // 현재 사용자 정보 조회
  getCurrentUser: async () => {
    try {
      const response = await apiRequest("/auth/me")
      if (!response.success && !isAuthChecked) {
        console.log("👤 현재 비로그인 상태입니다.")
        isAuthChecked = true
      }
      return response.data
    } catch (error) {
      if (!isAuthChecked) {
        console.log("👤 현재 비로그인 상태입니다.")
        isAuthChecked = true
      }
      return null
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

  // 아이디 중복 확인
  checkAccountId: async (accountId) => {
    try {
      const response = await apiRequest(`/auth/duplicate?accountId=${encodeURIComponent(accountId)}`, {
        method: "GET"
      })
      return response
    } catch (error) {
      console.error("AccountId check failed:", error)
      throw error
    }
  },

}

// 테스트 관련 API (수정함)
export const testAPI = {
  saveTestResult: async (testData) => {
    try {
      const userId = testData.userId || localStorage.getItem("userId"); // 없으면 로컬에서 가져옴

      if (!userId) {
        throw new Error("User ID is missing");
      }

      const response = await testApiRequest(`/test/save?id=${userId}`, {
        method: "POST",
        body: JSON.stringify(testData),
      });

      return response; // { testId: ... }
    } catch (error) {
      console.log("Backend API not available, saving to localStorage (dev mode)...");

      const history = JSON.parse(localStorage.getItem("dev-test-history") || "[]");
      const newResult = {
        id: Date.now().toString(),
        ...testData,
        userId: testData.userId || localStorage.getItem("userId"), // 저장 시에도 userId 포함
        completedAt: testData.completedAt || new Date().toISOString(),
      };
      history.unshift(newResult);
      localStorage.setItem("dev-test-history", JSON.stringify(history));

      return { testId: newResult.id };
    }
  },


// 테스트 히스토리 조회 (수정)

getTestResultHistory: async (userIdParam) => {
  try {
    const userId = userIdParam || localStorage.getItem("userId");

    if (!userId) {
      throw new Error("User ID is missing");
    }

    return await testApiRequest(`/test/history?id=${userId}`);
  } catch (error) {
    console.log("Backend API not available, using localStorage (dev mode)...");

    const history = JSON.parse(localStorage.getItem("dev-test-history") || "[]");
    return history.filter(item => item.userId === userIdParam || localStorage.getItem("userId"));
  }
},




  getRecommendations: async (personalityOrUserType) => {
    try {
      return await apiRequest(`/recommendations/${personalityOrUserType}`)
    } catch (error) {
      console.log("Backend API not available, using mock data (dev mode)...")

      // personalityOrUserType이 없으면 기본값 사용
      const key = personalityOrUserType || "균형잡힌 분석형";
      return MOCK_RECOMMENDATIONS[key] || MOCK_RECOMMENDATIONS["균형잡힌 분석형"];
    }
  },

  // 공유 URL 가져오기
  getShareUrl: async (testId, name) => {
    try {
      return await contentApiRequest(`/response/share/${testId}/${encodeURIComponent(name)}`, {
        method: "GET",
      });
    } catch (error) {
      console.log("Share URL API 호출 실패:", error);
      throw error;
    }
  },

  // 공유 데이터 가져오기 (value 파라미터로)
  getSharedData: async (value) => {
    try {
      return await contentApiRequest(`/response/share?value=${encodeURIComponent(value)}`, {
        method: "GET",
      });
    } catch (error) {
      console.log("Shared data API 호출 실패:", error);
      throw error;
    }
  },
    
}


// 컨텐츠 서버(Gemini) API - content 서버 호출
export const contentAPI = {
  requestRecommendation: async (testId) => {
    try {
      return await contentApiRequest(`/gemini/recommend?testId=${testId}`, {
        method: "POST",
      })
    } catch (error) {
      console.log("Recommendation API 호출 실패:", error)
      throw error
    }
  },

  //테스트 결과 조회 api 
  getTestHistory: async (testId) => {
  try {
    return await contentApiRequest(`/response/history?testId=${encodeURIComponent(testId)}`);

  } catch (error) {
    console.log("Backend API not available, using localStorage (dev mode)...");

    const history = JSON.parse(localStorage.getItem("dev-test-history") || "[]");
    return history.find(item => item.id === testId); // id는 로컬 저장 기준
  }
},

//mypage 컨텐츠 히스토리 조회 api
getMypage: async (userId, page, size) => {
  try {
    return await contentApiRequest(`/response/history?userId=${encodeURIComponent(userId)}&page=${page}&size=${size}`);
  } catch (error) {
    console.log("Backend API not available, using localStorage (dev mode)...");

    const history = JSON.parse(localStorage.getItem("dev-test-history") || "[]");
    return history.filter(item => item.userId === userId);
  }
},

// 3. Book 상세 조회
  bookRecommendation: async (testId) => {
    try {
      return await contentApiRequest(`/content/book?testId=${testId}`);
    } catch (error) {
      console.log("Book API 호출 실패:", error);
      throw error;
    }
  },

  // 4. Music 상세 조회
  musicRecommendation: async (testId) => {
    try {
      return await contentApiRequest(`/content/music?testId=${testId}`);
    } catch (error) {
      console.log("Music API 호출 실패:", error);
      throw error;
    }
  },

  // 5. Movie 상세 조회 (선택)
  movieRecommendation: async (testId) => {
    try {
      return await contentApiRequest(`/content/movie?testId=${testId}`);
    } catch (error) {
      console.log("Movie API 호출 실패:", error);
      throw error;
    }
  },


  //검색 API
  search: async (params) => {
  // params 예: { content:"MOVIE", query:"인터스텔라" }
  //            { content:"BOOK",  title:"미움받을 용기" }
  //            { content:"MUSIC", artist:"비비", title:"밤양갱" }
  const qs = new URLSearchParams(params).toString()
  // contentApiRequest는 CONTENT_SERVER_BASE_URL (기본 http://localhost:8081/api)로 요청 보냄
  
  return await contentApiRequest(`/content/search?${qs}`, { method: "GET" })
},


 // 랭킹 조회
  getRanking: async (type, size = 3) => {
    try {
      const result = await contentApiRequest(`/response/ranking?type=${encodeURIComponent(type)}&size=${size}`)
      
      // 백엔드가 응답했지만 데이터가 없는 경우
      if (!result || !result.Recommend) {
        return {
          testId: null,
          Recommend: {
            Book: [],
            Music: [],
            Movie: []
          }
        }
      }
      
      return result
    } catch (error) {
      console.log("Backend API call failed:", error)
      
      // API 호출이 완전히 실패한 경우에만 빈 데이터 반환
      return {
        testId: null,
        Recommend: {
          Book: [],
          Music: [],
          Movie: []
        }
      }
    }
  }

}

// 검색 api

// const client = axios.create({
//   baseURL: "/api", // gateway 통해 /content로 라우팅된다고 가정
// });





// export const searchContent = async ({ type, query }) => {
//   const { data } = await client.get("/content/search", {
//     params: { type, query },
//   });
//   return data; // List<ContentDto>
// };
