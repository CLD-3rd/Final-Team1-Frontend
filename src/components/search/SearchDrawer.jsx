// src/components/search/SearchDrawer.jsx
import React, { useEffect, useState } from "react"
import { testAPI } from "../../lib/api" // 경로 그대로 사용

export default function SearchDrawer({ open, onClose }) {
  const [type, setType] = useState("movie")
  const [q, setQ] = useState("")
  const [artist, setArtist] = useState("")
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState([])
  const [error, setError] = useState("")

  useEffect(() => {
    if (!open) return
    setError("")
  }, [open])

  const search = async (e) => {
    e.preventDefault()
    if (!q.trim()) {
      setError("제목을 입력해 주세요.")
      return
    }
    setError("")
    setLoading(true)
    setItems([])
    try {
      const params = { type, q: q.trim() }
      if (type === "music" && artist.trim()) params.artist = artist.trim()
      const { data } = await testAPI.get("/api/search", { params })
      setItems(data?.items ?? [])
    } catch (err) {
      setError("검색 중 오류가 발생했습니다.")
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
      {/* 왼쪽 슬라이드 패널 */}
      <aside
        className={`fixed left-0 top-0 bottom-0 z-50 w-full max-w-md bg-neutral-900 text-white shadow-2xl
                    transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}
        aria-hidden={!open}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 h-14 border-b border-white/10">
          <h3 className="text-lg font-semibold">콘텐츠 검색</h3>
          <button onClick={onClose} className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20">
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
              placeholder={type === "music" ? "제목 (예: 밤양갱)" : "제목 입력"}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="제목"
            />

            <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500">
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
          {!loading && items.length === 0 && <p className="opacity-60">검색 결과가 없습니다.</p>}

          <ul className="grid gap-3">
            {items.map((it, idx) => (
              <li key={idx} className="rounded-xl bg-neutral-800 p-3 flex gap-3">
                {it.image && (
                  <img src={it.image} alt="" className="w-20 h-28 object-cover rounded-lg flex-none" />
                )}
                <div className="min-w-0">
                  <div className="text-xs uppercase opacity-60">{it.type}</div>
                  <div className="font-semibold truncate">{it.title}</div>
                  {it.artist && <div className="opacity-80">{it.artist}</div>}
                  {it.summary && <p className="opacity-80 text-sm mt-1 line-clamp-3">{it.summary}</p>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  )
}
