// src/components/search/SearchDrawer.jsx
import React, { useEffect, useState, useRef } from "react"
import { contentAPI  } from "../../lib/api" // axios 인스턴스 (프로젝트에 이미 있음)
const noImage = "/no-image.png";

export default function SearchDrawer({ open, onClose }) {
  const [type, setType] = useState("movie") // movie | book | music
  const [q, setQ] = useState("")
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState([])
  const [error, setError] = useState("")
  const [hasSearched, setHasSearched] = useState(false); 
  const lastReqId = useRef(0); // ✅ 추가: 최신 요청 토큰

  useEffect(() => {
    if (!open) return;
    setError("");
  }, [open]);

  // ✅ 분류(type) 바뀌면 결과/에러/입력값까지 초기화 (요청 레이스도 무시)
  useEffect(() => {
    setItems([]);
    setError("");
    setHasSearched(false);
    setQ("");                 // ← 검색창도 초기화
    lastReqId.current++;      // 진행 중이던 검색 응답은 무시되도록 토큰 증가
  }, [type]);

  const IMG_BASE = import.meta.env.VITE_TMDB_IMAGE_BASE || "https://image.tmdb.org/t/p/w342";

  // 프론트(type) → 백엔드(content) & 파라미터 매핑
  const toBackendParams = (t, input) => {
    const content =
      t === "movie" ? "MOVIE" : t === "book" ? "BOOK" : "MUSIC"
    if (content === "MOVIE") return { content, query: input }
    if (content === "BOOK")  return { content, title: input }
    // MUSIC: "제목 - 가수" 파싱
    const { title, artist } = parseMusicQuery(input)
    return { content, title, artist }
  }

  const search = async (e) => {
    e.preventDefault();

    if (!q.trim()) {
      setError("제목을 입력해 주세요.");
      setHasSearched(true);
      return;
    }
     // 음악은 "제목 - 가수"가 모두 있어야 함
    if (type === "music") {
      const { title, artist } = parseMusicQuery(q)
      if (!title || !artist) {
      setError("음악 검색은 '가수 - 노래 제목' 형식으로 입력해 주세요. (예: 봄날 - 방탄소년단)")
      return
      }
    }

    setError("")
    setLoading(true)
    setItems([])

    const reqId = ++lastReqId.current;

    try {
      const params = toBackendParams(type, q.trim())
      const data = await contentAPI.search(params)

      // 백엔드 응답이 items 혹은 results 배열일 수 있으니 안전하게 처리
      const list =
       Array.isArray(data?.items) ? data.items
       : Array.isArray(data?.results) ? data.results
       : Array.isArray(data?.content) ? data.content                  // 페이지네이션 형태 대비
       : Array.isArray(data?.documents) ? data.documents              // 외부 API 프록시 대비
       : Array.isArray(data) ? data
       : (data ? [data] : [])                                         // 🔑 단일 객체면 감싸기

      setItems(list)
    } catch (err) {
      if (lastReqId.current !== reqId) return;
      setError("검색 중 오류가 발생했습니다.");
      // eslint-disable-next-line no-console
      console.error(err);
    } finally {
      if (lastReqId.current === reqId) {
        setLoading(false);
        setHasSearched(true);
      }
    }
  };

  const parseMusicQuery = (raw) => {
  const s = (raw || "").replace(/\s{2,}/g, " ").trim()
  // 구분자 기준으로 최대 2개만 취함
  const parts = s.split(/\s*[-–—]\s*|\s*,\s*|\s*\|\s*/).filter(Boolean)
  const [title, artist] = [parts[0] || "", parts[1] || ""]
  return { title: title.trim(), artist: artist.trim() }
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

      {/* 슬라이드 패널 (오른쪽) */}
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
              onChange={(e) => setType(e.target.value)} // 초기화는 useEffect([type])에서
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
                 type === "music"
                   ? "노래 제목  - 가수 "
                   : "제목 입력"
               }
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="제목"
            />

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60"
              disabled={loading}
            >
              검색
            </button>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}
        </form>

        {/* 결과 */}
        <div className="px-5 pb-6 overflow-y-auto h-[calc(100vh-56px-132px)]">
          {loading && <p className="opacity-80">검색 중…</p>}
          {!loading && hasSearched && items.length === 0 && (
            <p className="opacity-60">검색 결과가 없습니다.</p>
          )}

          <ul className="grid gap-3">
            {items.map((it, idx) => (
              <li key={idx} className="rounded-xl bg-neutral-800 p-3 flex gap-3">
                {/* 백엔드가 image 경로를 다르게 줄 수도 있으니 안전하게 접근 */}
                  {(() => {
                    let thumb = null;

                    if (type === "music") {
                      // 🎵 음악: 앨범 이미지가 없으면 기본 이미지
                      thumb = it.album || noImage;
                    } else {
                      // 🎬 영화/📚 책: 이미지 없으면 기본 이미지
                      thumb =
                        it.image ||
                        it.poster ||
                        (it.poster_path ? `${IMG_BASE}${it.poster_path}` : null) ||
                        noImage;
                    }

                    return (
                      <img
                        src={thumb}
                        alt={it.title || it.name || ""}
                        className="w-20 h-28 object-cover rounded-lg flex-none"
                      />
                    );
                  })()}
                {/* 영화 */}
                <div className="min-w-0">
                <div className="text-xs uppercase opacity-60">
                  {it.type || (type === "movie" ? "movie" : type)}
                </div>

                <div className="font-semibold truncate">
                  {it.title || it.name || "-"}
                </div>


                {it.release_date && (
                  <div className="text-xs opacity-70 mt-0.5">
                    {it.release_date}
                    {/* 예쁘게: new Date(it.release_date).toLocaleDateString('ko-KR') */}
                  </div>
                )}

                  {/* 음악 */}
                  {(it.artist || it.singer) && (
                    <div className="opacity-80">{it.artist || it.singer}</div>
                  )}

                  {/* 책 */}
                  {it.author && (
                  <p className="opacity-80 text-sm mt-1 line-clamp-3">
                    {it.author}
                  </p>
                )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
}
