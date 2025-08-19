import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * UTC 시간을 한국 시간으로 변환하는 함수
 * @param {string|Date} dateString - UTC 시간 문자열 또는 Date 객체
 * @returns {Date} 한국 시간 Date 객체
 */
export const convertToKST = (dateString) => {
  const date = new Date(dateString)
  // UTC 시간에 9시간을 더해서 한국 시간으로 변환
  return new Date(date.getTime() + (9 * 60 * 60 * 1000))
}

/**
 * 한국 시간으로 포맷팅하는 함수
 * @param {string|Date} dateString - UTC 시간 문자열 또는 Date 객체
 * @returns {string} 한국 시간으로 포맷팅된 문자열
 */
export const formatToKST = (dateString) => {
  const kstDate = convertToKST(dateString)
  return kstDate.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Seoul"
  })
}

/**
 * 한국 시간으로 날짜만 포맷팅하는 함수
 * @param {string|Date} dateString - UTC 시간 문자열 또는 Date 객체
 * @returns {string} 한국 시간으로 포맷팅된 날짜 문자열
 */
export const formatDateToKST = (dateString) => {
  const kstDate = convertToKST(dateString)
  return kstDate.toLocaleDateString("ko-KR", {
    timeZone: "Asia/Seoul"
  })
}
