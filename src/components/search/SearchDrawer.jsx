// src/components/search/SearchDrawer.jsx
import React, { useEffect, useState } from "react"
import { testAPI } from "../../lib/api" // axios 인스턴스 (프로젝트에 이미 있음)

export default function SearchDrawer({ open, onClose }) {
  const [type, setType] = useState("movie") // movie | book | music
  const [q, setQ] = useState("")
  const [artist, setArtist] = useState("")
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState([])
  const [error, setError] = useState("")

  useEffect(() => {
    if (!open) return
    setError("")
  }, [open])

  // 프론트(type) → 백엔드(content) & 파라미터 매핑
  const toBackendParams = (t, title, singer) => {
    const content =
      t === "movie" ? "MOVIE" : t === "book" ? "BOOK" : "MUSIC"

    // 백엔드 스펙:
    // - 영화:  /api/content/search?content=MOVIE&query=영화제목
    // - 책:    /api/content/search?content=BOOK&title=책제목
    // - 음악:  /api/content/search?content=MUSIC&artist=가수명&title=노래제목
    if (content === "MOVIE") return { content, query: title }
    if (content === "BOOK") return { content, title: title }
    return { content, artist: singer, title: title }
  }

  const search = async (e) => {
    e.preventDefault()
    if (!q.trim()) {
      setError("제목을 입력해 주세요.")
      return
    }
    if (type === "music" && !artist.trim()) {
      setError("음악 검색은 가수도 함께 입력해 주세요.")
      return
    }

    setError("")
    setLoading(true)
    setItems([])

    try {
      const params = toBackendParams(type, q.trim(), artist.trim())
      const { data } = await testAPI.get("/api/content/search", { params })

      // 백엔드 응답이 items 혹은 results 배열일 수 있으니 안전하게 처리
      const list =
        Array.isArray(data?.items)
          ? data.items
          : Array.isArray(data?.results)
          ? data.results
          : Array.isArray(data)
          ? data
          : []

      setItems(list)
    } catch (err) {
      setError("검색 중 오류가 발생했습니다.")
      // 콘솔에도 남겨두면 디버깅 편함
      // eslint-disable-next-line no-console
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* 오버레이 */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* 왼쪽(또는 오른쪽으로 바꾸려면 left-0 → right-0) 슬라이드 패널 */}
      <aside
        className={`fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-neutral-900 text-white shadow-2xl
                    transition-transform duration-300 ${
                      open ? "translate-x-0" : "translate-x-full"
                    }`}
        aria-hidden={!open}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 h-14 border-b border-white/10">
          <h3 className="text-lg font-semibold">콘텐츠 검색</h3>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20"
          >
            닫기
          </button>
        </div>

        {/* 폼 */}
        <form onSubmit={search} className="p-5 flex flex-col gap-3">
          <div className="flex gap-2">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="px-3 py-2 rounded-xl bg-neutral-800 flex-none"
              aria-label="검색 대상"
            >
              <option value="movie">영화</option>
              <option value="book">책</option>
              <option value="music">음악</option>
            </select>

            <input
              className="flex-1 px-4 py-2 rounded-xl bg-neutral-800 placeholder-neutral-400"
              placeholder={
                type === "music" ? "노래 제목 (예: 밤양갱)" : "제목 입력"
              }
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="제목"
            />

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500"
            >
              검색
            </button>
          </div>

          {type === "music" && (
            <input
              className="px-4 py-2 rounded-xl bg-neutral-800 placeholder-neutral-400"
              placeholder="가수 (예: 비비)"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              aria-label="가수"
            />
          )}

          {error && <p className="text-red-400 text-sm">{error}</p>}
        </form>

        {/* 결과 */}
        <div className="px-5 pb-6 overflow-y-auto h-[calc(100vh-56px-132px)]">
          {loading && <p className="opacity-80">검색 중…</p>}
          {!loading && items.length === 0 && (
            <p className="opacity-60">검색 결과가 없습니다.</p>
          )}

          <ul className="grid gap-3">
            {items.map((it, idx) => (
              <li key={idx} className="rounded-xl bg-neutral-800 p-3 flex gap-3">
                {/* 백엔드가 image 경로를 다르게 줄 수도 있으니 안전하게 접근 */}
                {it.image && (
                  <img
                    src={it.image}
                    alt=""
                    className="w-20 h-28 object-cover rounded-lg flex-none"
                  />
                )}
                <div className="min-w-0">
                  <div className="text-xs uppercase opacity-60">
                    {it.type || (type === "movie" ? "movie" : type)}
                  </div>
                  <div className="font-semibold truncate">
                    {it.title || it.name || "-"}
                  </div>
                  {(it.artist || it.singer) && (
                    <div className="opacity-80">
                      {it.artist || it.singer}
                    </div>
                  )}
                  {it.summary && (
                    <p className="opacity-80 text-sm mt-1 line-clamp-3">
                      {it.summary}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  )
}
