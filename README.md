# TOPPING — 주식회사 토핑인터랙티브 웹사이트

Next.js 15 (App Router) + TypeScript + Tailwind CSS v4

---

## 시작하기

VS Code에서 이 폴더를 열고, 터미널(Ctrl+`)에서:

```bash
npm install
npm run dev
```

→ http://localhost:3000

> 이 폴더에는 `node_modules`가 없습니다. **`npm install`을 반드시 먼저 실행**하세요.

## 추천 VS Code 확장

- Tailwind CSS IntelliSense
- ESLint
- Prettier
- Error Lens

---

## 폴더 구조

```
src/
  app/
    layout.tsx        공통 레이아웃 + JSON-LD 구조화 데이터
    globals.css       디자인 토큰 (버건디 + 웜 뉴트럴)
    page.tsx          Home
    ai/               AI 업무지원시스템  ★ 간판 페이지
    work/             수행 실적 (필터)
    service/          UIUX 서비스 · 방법론(모달)
    solution/         솔루션 지원
    about/            회사 소개
    contact/          문의
    sitemap.ts        sitemap.xml 자동 생성
    robots.ts         robots.txt (네이버 Yeti 포함)
  components/         공통 컴포넌트
  content/            ★ 모든 텍스트·데이터가 여기 있음
public/logos/         클라이언트 로고 21개 (수집 후 배치)
```

### content/ 가 핵심입니다

페이지 코드를 고치지 않고 **`src/content/` 안의 파일만 수정**하면 사이트 내용이 바뀝니다.
나중에 관리자 페이지를 붙일 때, 이 파일들이 DB로 옮겨갈 자리입니다.

| 파일 | 내용 |
|---|---|
| `site.ts` | 회사 정보 · 히어로 카피 · 숫자 · GNB |
| `ai-projects.ts` | AI 프로젝트 3건 · AI 역량 10 |
| `works.ts` | 실적 27건 (+ AI 3건은 자동 합산) |
| `clients.ts` | 클라이언트 21개 |
| `solutions.ts` | 솔루션 5종 · X-Converting 8단계 |
| `methodology.ts` | 인지심리학 10법칙 · UIUX FLOW · 표준정의서 목차 |

---

## 디자인 표준

`src/app/globals.css`의 `@theme` 블록에 토큰이 정의돼 있습니다.

- **악센트: 버건디** `--color-accent-600: #8B2035` — 화면의 5% 이내로만
- **뉴트럴: 웜 그레이** — 배경은 순백이 아닌 `#FAFAF9`
- 위계는 **굵기로** 만들고 색으로 만들지 않습니다
- 포커스 링을 지우지 않습니다

Tailwind 유틸리티로 바로 쓸 수 있습니다: `bg-accent-600`, `text-n-800`, `border-n-100`

---

## 지금 상태 / 남은 작업

### 동작하는 것
- 7개 페이지 라우팅 · 반응형 · GNB
- 실적 필터 (AI / 금융 / 공공 / 제조 / 기타)
- 참고자료 모달 (`<dialog>` — 37단계 FLOW, 표준정의서 목차)
- sitemap.xml · robots.txt · JSON-LD

### TODO
- [ ] `src/content/site.ts`의 `url` → 실제 도메인으로 교체
- [ ] 클라이언트 로고 21개를 `public/logos/`에 넣고 `clients.ts`의 `logo` 채우기
- [ ] 미식별 로고 1건 확인 (`clients.ts`의 `tbd`)
- [ ] 이미지 자산 추가 → `ProjectCard`의 "이미지 준비 중" 자리 교체
- [ ] `/ai` 페이지 본문 보강 (TODO 주석 위치)
- [ ] 문의 폼 제출 처리 — Route Handler + 메일 발송
- [ ] `/terms`, `/privacy` 페이지
- [ ] 로고 · 파비콘 · OG 이미지
- [ ] 관리자 페이지 (`app/admin/`) — 프론트 완료 후

---

## 관리자를 나중에 붙일 때

지금 구조 그대로 `src/app/admin/` 폴더를 추가하면 됩니다.
`content/`의 타입 정의가 그대로 DB 스키마가 됩니다. 화면 설계는 프로젝트 문서
`topping7-cms-admin.md` 참조.
