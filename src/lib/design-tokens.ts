/**
 * SVG 전용 색상 상수 — globals.css 디자인 토큰의 사본.
 *
 * SVG 는 Tailwind 클래스를 못 받고 실제 색상값을 요구한다.
 * globals.css 의 토큰을 바꾸면 이 파일도 같이 바꿔야 한다.
 * 목업(`components/mockup`)과 헤더 배경(`components/HeaderPattern`)이 함께 쓴다.
 */
export const C = {
  n0: "#FFFFFF",
  n25: "#FAFAF9",
  n50: "#F5F5F4",
  n100: "#EAE9E7",
  n200: "#D6D3D1",
  n400: "#A8A29E",
  n600: "#57534E",
  n800: "#292524",
  n900: "#1C1917",

  a50: "#FBF3F5",
  a100: "#F5E1E6",
  a200: "#E8BFC9",
  a600: "#8B2035",
  a800: "#6E1829",
  a900: "#3F0D18",

  /* 일러스트 전용 파스텔 — 그림 안에서만. UI 컨트롤에는 쓰지 않는다 */
  sand100: "#FBEADA",
  sand300: "#F0C79E",
  sand600: "#C9813C",
  teal100: "#DDEDEA",
  teal300: "#A6CFC8",
  teal600: "#3F7F76",
  iris100: "#E4E5F2",
  iris300: "#B3B7DB",
  iris600: "#5A62A0",

  success: "#166534",
  successBg: "#DCFCE7",
  warning: "#A16207",
  warningBg: "#FEF3C7",
  danger: "#B91C1C",
} as const;

/** SVG 안의 모든 글자에 쓰는 글꼴 스택. */
export const FONT =
  "Pretendard Variable, Pretendard, -apple-system, system-ui, sans-serif";
