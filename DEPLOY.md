# 배포 가이드 — GitHub → Vercel

최종 수정: 2026-09-30 · 프로덕션 빌드 통과 확인 (`next build` 성공, 29개 경로)

순서를 지키는 게 중요합니다. **1 → 2 → 3 → 4 → 5 → 6 → 7**.
특히 3번(환경변수)을 건너뛰면 배포가 반드시 실패합니다.

---

## 1. GitHub에 올리기

VS Code 터미널에서 (개발 서버가 도는 터미널 말고 **새 터미널**):

```bash
git add -A
git commit -m "feat: 토핑인터랙티브 사이트 + 관리자"
```

### 원격 저장소가 아직 없다면

GitHub에서 새 저장소를 만든 뒤 (README 체크 해제):

```bash
git remote add origin https://github.com/babara77/topping-web.git
git branch -M main
git push -u origin main
```

### 이미 연결돼 있다면

```bash
git push
```

> `.env.local` 은 `.gitignore` 에 있어 올라가지 않습니다. **정상입니다.**
> 키는 Vercel 대시보드에 따로 넣습니다 (3번).
>
> ⚠️ `SUPABASE_SERVICE_ROLE_KEY` 는 **DB 전체 권한**을 가진 키입니다.
> 절대 코드에 적거나, 화면 캡처에 나오게 하거나, 커밋에 포함시키지 마세요.

---

## 2. Vercel 프로젝트 연결

1. [vercel.com/new](https://vercel.com/new)
2. GitHub 저장소 선택 → **Import**
3. Framework Preset 이 **Next.js** 로 잡히는지 확인 (자동)
4. Root Directory: 그대로 (`./`)
5. **Deploy 를 누르기 전에 3번의 환경변수를 먼저 넣습니다**

---

## 3. 환경변수 — 이걸 빼면 반드시 실패합니다 ★

Vercel 프로젝트 → **Settings → Environment Variables**
4개 모두 **Production / Preview / Development 전부 체크**.

| Name | 값 |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `.env.local` 과 동일 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `.env.local` 과 동일 |
| `SUPABASE_SERVICE_ROLE_KEY` | `.env.local` 과 동일 |
| `NEXT_PUBLIC_SITE_URL` | 배포 주소 (예: `https://topping-web.vercel.app`) |

- 값은 **`.env.local` 에서 복사**합니다. 손으로 치지 않습니다
- `NEXT_PUBLIC_SITE_URL` 은 첫 배포 후 실제 주소를 확인하고 채운 뒤 **재배포**합니다
  (sitemap.xml · robots.txt · OG 태그 · 구조화 데이터가 이 값을 씁니다)
- 나중에 자체 도메인을 붙이면 이 값도 그 도메인으로 바꿉니다

---

## 4. Supabase 설정 보완

배포 주소가 정해지면 Supabase 대시보드에서:

**Authentication → URL Configuration**
- `Site URL` → 배포 주소
- `Redirect URLs` 에 배포 주소 추가

이걸 안 하면 배포된 사이트에서 **관리자 로그인·이메일 인증이 실패**합니다.
(로컬에서는 되는데 배포본에서만 안 되는 증상이면 십중팔구 이겁니다.)

---

## 5. 배포 후 확인

| 확인 | 주소 | 기대 |
|---|---|---|
| 공개 9페이지 | `/` `/ai` `/work` `/service` `/solution` `/about` `/contact` `/terms` `/privacy` | 전부 200 |
| 사이트맵 | `/sitemap.xml` | 9개 URL이 **배포 주소**로 나옴 (localhost 면 3번 재배포 누락) |
| robots | `/robots.txt` | `/admin` 차단 + sitemap 주소 |
| 관리자 로그인 | `/admin/login` | 로그인 성공 |
| 관리자 저장 반영 | `/admin/site` 에서 히어로 수정 → `/` 새로고침 | 바뀐 문구가 보임 |
| 관리자 차단 | 로그아웃 상태로 `/admin/site` | 로그인으로 튕김 |

---

## 6. 검색엔진 등록 (배포 주소 확정 후)

**소유확인 코드는 코드를 고칠 필요 없습니다.** 관리자 → **검색엔진** 화면 맨 위에
칸이 있습니다. 거기에 넣고 저장하면 태그가 자동으로 붙습니다.

| 엔진 | 도구 | 작업 |
|---|---|---|
| **네이버** | [서치어드바이저](https://searchadvisor.naver.com) | 소유확인(HTML 태그) → 사이트맵 제출 → **웹페이지 수집 요청** ← 국내 B2B 최우선 |
| Google | [Search Console](https://search.google.com/search-console) | 소유확인(HTML 태그) → 사이트맵 제출 → 색인 요청 |
| Bing | Webmaster Tools | GSC 연동으로 임포트 (따로 할 일 거의 없음) |
| Daum | 검색등록 | 신규 등록 신청 |

**HTML 태그 방식 소유확인 순서**
1. 서치콘솔/서치어드바이저에서 `<meta name="google-site-verification" content="XXXX">` 를 받습니다
2. **`content="` 안의 값(XXXX)만** 복사합니다. 태그 전체가 아닙니다
3. 관리자 → 검색엔진 → 해당 칸에 붙여넣고 **저장**
4. 배포본 새로고침 후, 서치콘솔에서 **확인** 버튼

> 자체 도메인을 붙일 예정이라면 **도메인 확정 후에** 등록하는 편이 낫습니다. 주소가 바뀌면 다시 해야 합니다.

---

## 7. 남은 이미지 자산

| 파일 | 위치 | 용도 |
|---|---|---|
| `favicon.svg` | `public/` | 브라우저 탭 아이콘 |
| `favicon.ico` | `public/` | 구형 브라우저용 |
| `apple-touch-icon.png` (180×180) | `public/` | 아이폰 홈화면 |
| 기본 공유 이미지 (1200×630) | 관리자 → 검색엔진 → 각 페이지 『공유 이미지』 | 카톡·슬랙 링크 미리보기 |

코드는 이미 이 파일들을 찾도록 돼 있습니다. `public/` 에 넣기만 하면 붙습니다.
**없어도 배포·동작에는 지장이 없습니다** — 탭 아이콘이 기본 모양일 뿐입니다.

---

## 관리자에서 고칠 수 있는 것 (코드 수정 불필요)

| 화면 | 내용 |
|---|---|
| 사이트 정보 | 상호·대표자·주소·전화·이메일·설명 · 히어로 3줄 · 약관 시행일 |
| 목록 관리 | 숫자 타일 · AI 역량 · 서비스 분야 · 인지심리학 · UIUX FLOW · 표준 목차 · X-Converting · EASY GUIDE · 상단 메뉴 · **이용약관** · **개인정보처리방침** |
| 검색엔진 | 페이지별 검색 제목·설명·공유 이미지 · 소유확인 코드 |
| 클라이언트 / AI 프로젝트 / 실적 / 솔루션 | 항목 추가·수정·삭제, 이미지, 대체텍스트 |
| 이미지 | 업로드한 이미지 관리 |
| 문의 접수함 | 들어온 문의 확인 |

회사 주소를 바꾸면 **푸터·회사소개·문의 페이지·약관 본문·검색엔진용 구조화 데이터가 전부 같이** 바뀝니다.

---

## 문제가 생기면

| 증상 | 원인 십중팔구 |
|---|---|
| 배포는 됐는데 500 | 환경변수 4개 중 누락 (3번) |
| 로컬은 되는데 배포본 로그인 실패 | Supabase Auth URL 미설정 (4번) |
| sitemap.xml 이 localhost | `NEXT_PUBLIC_SITE_URL` 넣고 **재배포** 안 함 |
| 관리자에서 저장했는데 사이트에 안 보임 | 새로고침 (Ctrl+F5). 그래도 안 되면 Vercel 재배포 |
| 관리자 화면이 "데이터가 없습니다" | 대시보드 → 상태 점검에서 빨간 테이블 확인 |
