import { List, Table } from "./LegalPage";

/**
 * 약관·개인정보처리방침 본문을 한 줄씩 받아 그린다.
 *
 * 관리자(`/admin/목록 관리 → 이용약관 / 개인정보처리방침`)에서 조마다
 * 본문을 여러 줄로 적는다. 줄 맨 앞 기호로 모양이 정해진다:
 *
 *   그냥 글          → 문단
 *   - 로 시작        → 번호 목록의 한 항목
 *   | 로 구분        → 표의 한 줄 (연달아 나오는 첫 줄이 머리글)
 *   # 로 시작        → 회색 보조 문단 (법정 안내문구 등)
 *
 * 법률 문서라 표를 못 쓰면 쓸모가 없어서, 표를 담을 수 있는
 * 최소한의 기호만 정했다. 익히는 데 1분이면 된다.
 */
export default function LegalBody({ items }: { items: string[] }) {
  const blocks: React.ReactNode[] = [];
  let bullets: string[] = [];
  let table: string[][] = [];

  const flushBullets = () => {
    if (bullets.length === 0) return;
    blocks.push(<List key={`l${blocks.length}`} items={bullets} />);
    bullets = [];
  };
  const flushTable = () => {
    if (table.length === 0) return;
    const [head, ...rows] = table;
    blocks.push(<Table key={`t${blocks.length}`} head={head} rows={rows} />);
    table = [];
  };
  const flushAll = () => {
    flushBullets();
    flushTable();
  };

  for (const raw of items) {
    const line = raw.trim();
    if (!line) continue;

    if (line.startsWith("|")) {
      flushBullets();
      table.push(
        line
          .replace(/^\||\|$/g, "")
          .split("|")
          .map((c) => c.trim())
      );
      continue;
    }
    if (line.startsWith("-")) {
      flushTable();
      bullets.push(line.slice(1).trim());
      continue;
    }
    flushAll();
    if (line.startsWith("#")) {
      blocks.push(
        <p key={`p${blocks.length}`} className="text-n-600">
          {line.slice(1).trim()}
        </p>
      );
    } else {
      blocks.push(<p key={`p${blocks.length}`}>{line}</p>);
    }
  }
  flushAll();

  return <>{blocks}</>;
}
