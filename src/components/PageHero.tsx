import Container from "@/components/Container";
import HeaderPattern, { type HeaderPatternId } from "@/components/HeaderPattern";
import type { PageHeaderItem } from "@/lib/content";

/**
 * 전면 어두운 헤더 (Magnific 참고).
 *
 * 왜 어둡게 가나 — 기존 헤더는 7개 페이지의 평균 명도가 94.6~97.3% 로
 * 폭이 2.7%p 밖에 안 됐다. 무늬 모양이 달라도 "흰 종이 위 옅은 회색 선"이라는
 * 같은 옷을 입고 있어서 한눈에 구별되지 않았다.
 * 명도를 벌리는 것이 인상을 바꾸는 가장 큰 지렛대다.
 *
 * 겹 순서 (아래 → 위)
 *  1. 페이지별 바탕색 (`.hero-grade--*`)
 *  2. 큰 번짐 두 덩이 — 페이지마다 다른 색
 *  3. `HeaderPattern` 무늬 (색은 `--hp-*` 변수로 어두운 테마를 받는다)
 *  4. 그레인 — 평평한 그라데이션에 깊이를 준다
 *  5. 왼쪽 스크림 — 글자가 무늬를 이기게 한다
 *  6. 글
 *
 * 관리자에서 사진을 올리면 사진이 1~3 을 대신하고, 듀오톤으로 물들여
 * 어느 사진이든 브랜드 색으로 통일된다.
 */
export default function PageHero({
  eyebrow,
  pageId,
  header,
  aside,
  children,
}: {
  eyebrow: string;
  pageId: HeaderPatternId;
  header: PageHeaderItem;
  /** 오른쪽 세로 목록 — 이 페이지가 다루는 것들. 활성 한 줄만 밝다 */
  aside?: { label: string; active?: boolean }[];
  /** 기본 subtitle 대신 직접 넣고 싶을 때 */
  children?: React.ReactNode;
}) {
  return (
    <section className={`hero hero-grade--${pageId}`}>
      {header.bgImage ? (
        <>
          {/* 사진은 흑백으로 깐 뒤 브랜드 색을 얹는다 — 어떤 사진이든 한 세트가 된다 */}
          <div
            className="hero__photo"
            style={{ backgroundImage: `url(${header.bgImage})` }}
          />
          <div className="hero__duotone" />
        </>
      ) : (
        <>
          <span className="hero__blob hero__blob--a" />
          <span className="hero__blob hero__blob--b" />
          <HeaderPattern pageId={pageId} />
        </>
      )}

      <div className="hero__grain" />
      <div className="hero__scrim" />

      <Container className="hero__inner">
        <div className="hero__text">
          <p className="hero__eyebrow">{eyebrow}</p>
          <h1
            className="hero__title"
            style={{ fontSize: header.titleSize }}
            data-reveal="words"
          >
            {header.title}
          </h1>

          {children ??
            (header.subtitle ? (
              <p
                className="hero__sub"
                style={
                  {
                    fontSize: header.subtitleSize,
                    "--d": "220ms",
                  } as React.CSSProperties
                }
                data-reveal
              >
                {header.subtitle}
              </p>
            ) : null)}
        </div>

        {aside && aside.length > 0 && (
          <ul className="hero__aside" aria-hidden="true">
            {aside.map((a, i) => (
              <li
                key={a.label}
                className={a.active ? "is-active" : undefined}
                data-reveal
                style={{ "--d": `${300 + i * 70}ms` } as React.CSSProperties}
              >
                {a.label}
              </li>
            ))}
          </ul>
        )}
      </Container>
    </section>
  );
}
