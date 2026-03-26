import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useApi } from "@/hooks/useApi";

interface Promotion {
  id: string;
  title: string;
  slug: string;
  locale: string;
  status: string;
  publishedAt: string | null;
}

export default function PromotionsList() {
  const api = useApi();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Promotion[]>("/api/promotions?status=all")
      .then(setPromotions)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleDelete(id: string) {
    if (!confirm("Delete this promotion?")) return;
    try {
      await api.del(`/api/promotions/${id}`);
      setPromotions((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert("Failed to delete promotion");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Promotions</h1>
        <Link
          to="/promotions/new"
          className="bg-[#189541] hover:bg-[#26c159] text-white font-medium rounded-lg px-5 py-2.5 transition-colors"
        >
          + New Promotion
        </Link>
      </div>

      <div className="bg-[#00131a] border border-[#072c38] rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#072c38] text-gray-400 text-sm">
              <th className="px-5 py-3 font-medium">Title</th>
              <th className="px-5 py-3 font-medium">Locale</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Published</th>
              <th className="px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-gray-400">
                  Loading…
                </td>
              </tr>
            ) : promotions.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-gray-400">
                  No promotions yet
                </td>
              </tr>
            ) : (
              promotions.map((p) => (
                <tr key={p.id} className="border-b border-[#072c38] last:border-0">
                  <td className="px-5 py-3 text-white">{p.title}</td>
                  <td className="px-5 py-3 text-gray-400 uppercase text-xs">
                    {p.locale}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-block text-xs font-medium px-2 py-0.5 rounded ${
                        p.status === "published"
                          ? "bg-[#189541]/20 text-[#26c159]"
                          : "bg-yellow-900/30 text-yellow-400"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-400 text-sm">
                    {p.publishedAt
                      ? new Date(p.publishedAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-5 py-3 space-x-3">
                    <Link
                      to={`/promotions/${p.id}`}
                      className="text-[#26c159] hover:underline text-sm"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-red-400 hover:underline text-sm cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
