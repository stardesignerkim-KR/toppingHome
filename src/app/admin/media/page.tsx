"use client";

import { useState } from "react";

type PageHeader = {
  page_id: string;
  page_name: string;
  bg_image_url?: string;
  header_title?: string;
  header_subtitle?: string;
  title_font_size?: number;
  title_text_color?: string;
  subtitle_font_size?: number;
  subtitle_text_color?: string;
};

export default function MediaPage() {
  const [headers, setHeaders] = useState<PageHeader[]>([
    { page_id: "home", page_name: "홈" },
    { page_id: "ai", page_name: "AI" },
    { page_id: "work", page_name: "Work" },
    { page_id: "service", page_name: "Service" },
    { page_id: "solution", page_name: "Solution" },
    { page_id: "about", page_name: "About" },
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<PageHeader | null>(null);

  const handleImageUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: Vercel Blob에 업로드
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setHeaders(
          headers.map((h) =>
            h.page_id === id ? { ...h, bg_image_url: url } : h
          )
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (id: string) => {
    if (editData) {
      setHeaders(
        headers.map((h) => (h.page_id === id ? editData : h))
      );
    }
    setEditingId(null);
    setEditData(null);
  };

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">이미지 및 헤더 관리</h1>

      <div className="space-y-8">
        {headers.map((header) => (
          <div
            key={header.page_id}
            className="rounded border border-n-100 bg-n-25 p-6"
          >
            <h2 className="mb-4 text-lg font-bold">{header.page_name} 페이지</h2>

            {editingId === header.page_id ? (
              <div className="space-y-6">
                {/* 배경 이미지 */}
                <div>
                  <label className="mb-2 block font-medium">배경 이미지</label>
                  <div className="mb-4 flex h-40 items-center justify-center rounded border-2 border-dashed border-n-200 bg-n-0">
                    {editData?.bg_image_url ? (
                      <img
                        src={editData.bg_image_url}
                        alt="Background"
                        className="max-h-full max-w-full"
                      />
                    ) : (
                      <span className="text-n-400">이미지 없음</span>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(header.page_id, e)}
                    className="w-full"
                  />
                </div>

                {/* 제목 */}
                <div>
                  <label className="mb-2 block font-medium">제목</label>
                  <input
                    type="text"
                    value={editData?.header_title || ""}
                    onChange={(e) =>
                      setEditData(
                        editData
                          ? { ...editData, header_title: e.target.value }
                          : null
                      )
                    }
                    className="w-full rounded border border-n-100 px-4 py-2"
                  />
                </div>

                {/* 제목 크기와 색상 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium">제목 크기</label>
                    <input
                      type="number"
                      value={editData?.title_font_size || 48}
                      onChange={(e) =>
                        setEditData(
                          editData
                            ? {
                                ...editData,
                                title_font_size: parseInt(e.target.value),
                              }
                            : null
                        )
                      }
                      className="w-full rounded border border-n-100 px-4 py-2"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">제목 색상</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={editData?.title_text_color || "#000000"}
                        onChange={(e) =>
                          setEditData(
                            editData
                              ? {
                                  ...editData,
                                  title_text_color: e.target.value,
                                }
                              : null
                          )
                        }
                        className="h-10 w-16 rounded border border-n-100"
                      />
                      <input
                        type="text"
                        value={editData?.title_text_color || "#000000"}
                        onChange={(e) =>
                          setEditData(
                            editData
                              ? {
                                  ...editData,
                                  title_text_color: e.target.value,
                                }
                              : null
                          )
                        }
                        className="flex-1 rounded border border-n-100 px-4 py-2"
                      />
                    </div>
                  </div>
                </div>

                {/* 부제 */}
                <div>
                  <label className="mb-2 block font-medium">부제</label>
                  <input
                    type="text"
                    value={editData?.header_subtitle || ""}
                    onChange={(e) =>
                      setEditData(
                        editData
                          ? { ...editData, header_subtitle: e.target.value }
                          : null
                      )
                    }
                    className="w-full rounded border border-n-100 px-4 py-2"
                  />
                </div>

                {/* 저장 버튼 */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSave(header.page_id)}
                    className="rounded bg-accent-600 px-4 py-2 text-white hover:bg-accent-700"
                  >
                    저장
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setEditData(null);
                    }}
                    className="rounded border border-n-200 px-4 py-2 hover:bg-n-50"
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {/* 배경 이미지 미리보기 */}
                <div className="mb-4 flex h-32 items-center justify-center rounded border border-n-100 bg-n-0">
                  {header.bg_image_url ? (
                    <img
                      src={header.bg_image_url}
                      alt={header.page_name}
                      className="max-h-full max-w-full"
                    />
                  ) : (
                    <span className="text-sm text-n-400">배경 이미지 없음</span>
                  )}
                </div>

                {header.header_title && (
                  <p className="mb-2 font-bold">{header.header_title}</p>
                )}
                {header.header_subtitle && (
                  <p className="mb-4 text-sm text-n-600">
                    {header.header_subtitle}
                  </p>
                )}

                <button
                  onClick={() => {
                    setEditingId(header.page_id);
                    setEditData(header);
                  }}
                  className="rounded border border-n-200 px-4 py-2 text-sm hover:bg-n-50"
                >
                  수정
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
