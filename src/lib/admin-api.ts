/** 관리자 화면 공용 fetch 헬퍼. 실패는 반드시 Error 로 올려서 화면에 표시되게 한다. */
export async function api<T = unknown>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    cache: "no-store",
    ...init,
    headers: init?.body
      ? { "Content-Type": "application/json", ...(init.headers ?? {}) }
      : init?.headers,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((json as { error?: string })?.error ?? `HTTP ${res.status}`);
  return json as T;
}

/** 이미지 업로드 → 공개 URL 반환 (Vercel Blob) */
export async function uploadImage(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.error ?? "업로드 실패");
  return json.url as string;
}

export const INDUSTRIES = ["AI", "금융", "공공", "제조·에너지·물류", "기타"] as const;

/**
 * 여러 건을 순차 삭제한다. API 가 단건 삭제만 지원하므로 하나씩 호출한다.
 * 일부만 실패해도 나머지는 계속 진행하고, 결과를 모아서 돌려준다.
 */
export async function deleteMany(
  urls: string[]
): Promise<{ ok: number; failed: { url: string; error: string }[] }> {
  let ok = 0;
  const failed: { url: string; error: string }[] = [];
  for (const url of urls) {
    try {
      await api(url, { method: "DELETE" });
      ok += 1;
    } catch (e) {
      failed.push({ url, error: (e as Error).message });
    }
  }
  return { ok, failed };
}
