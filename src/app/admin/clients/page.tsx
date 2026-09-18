"use client";

import { useState } from "react";

type Client = {
  client_slug: string;
  client_name: string;
  industry: string;
  logo_url?: string;
  logo_dark_url?: string;
};

const INDUSTRIES = ["공공", "금융", "제조·에너지·물류", "기타"];

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([
    { client_slug: "sk", client_name: "SK이노베이션", industry: "제조·에너지·물류" },
    { client_slug: "emart", client_name: "이마트", industry: "기타" },
    { client_slug: "nhis", client_name: "국민건강보험공단", industry: "공공" },
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newClient, setNewClient] = useState<Partial<Client>>({
    client_slug: "",
    client_name: "",
    industry: "공공",
  });

  const handleAddClient = () => {
    if (newClient.client_slug && newClient.client_name) {
      setClients([
        ...clients,
        {
          client_slug: newClient.client_slug || "",
          client_name: newClient.client_name || "",
          industry: newClient.industry || "공공",
          logo_url: newClient.logo_url,
          logo_dark_url: newClient.logo_dark_url,
        },
      ]);
      setNewClient({ client_slug: "", client_name: "", industry: "공공" });
      setShowForm(false);
    }
  };

  const handleDeleteClient = (slug: string) => {
    setClients(clients.filter((c) => c.client_slug !== slug));
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">클라이언트 관리 (21개)</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded bg-accent-600 px-4 py-2 text-white hover:bg-accent-700"
        >
          + 추가
        </button>
      </div>

      {/* 추가 폼 */}
      {showForm && (
        <div className="mb-8 rounded border border-accent-600 bg-accent-50 p-6">
          <h2 className="mb-4 font-bold">새로운 클라이언트 추가</h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Slug (영문)"
              value={newClient.client_slug || ""}
              onChange={(e) =>
                setNewClient({ ...newClient, client_slug: e.target.value })
              }
              className="rounded border border-n-100 px-4 py-2"
            />
            <input
              type="text"
              placeholder="회사명"
              value={newClient.client_name || ""}
              onChange={(e) =>
                setNewClient({ ...newClient, client_name: e.target.value })
              }
              className="rounded border border-n-100 px-4 py-2"
            />
            <select
              value={newClient.industry || "공공"}
              onChange={(e) =>
                setNewClient({ ...newClient, industry: e.target.value })
              }
              className="rounded border border-n-100 px-4 py-2"
            >
              {INDUSTRIES.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                onClick={handleAddClient}
                className="rounded bg-accent-600 px-4 py-2 text-white hover:bg-accent-700"
              >
                저장
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="rounded border border-n-200 px-4 py-2 hover:bg-n-50"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 클라이언트 그리드 */}
      <div className="grid grid-cols-4 gap-4">
        {clients.map((client) => (
          <div
            key={client.client_slug}
            className="rounded border border-n-100 bg-n-25 p-4"
          >
            {/* 로고 영역 */}
            <div className="mb-4 flex h-24 items-center justify-center rounded border border-n-100 bg-n-0">
              {client.logo_url ? (
                <img
                  src={client.logo_url}
                  alt={client.client_name}
                  className="max-h-20 max-w-full"
                />
              ) : (
                <span className="text-xs text-n-400">로고 없음</span>
              )}
            </div>

            <h3 className="mb-2 text-sm font-bold">{client.client_name}</h3>
            <p className="mb-4 text-xs text-n-600">{client.industry}</p>

            <div className="flex gap-2">
              <button className="flex-1 rounded border border-n-200 px-2 py-1 text-xs hover:bg-n-50">
                로고
              </button>
              <button
                onClick={() => handleDeleteClient(client.client_slug)}
                className="rounded border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
