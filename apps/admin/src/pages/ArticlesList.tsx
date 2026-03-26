import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useApi } from "@/hooks/useApi";

interface Article {
  id: string;
  title: string;
  slug: string;
  locale: string;
  status: string;
  publishedAt: string | null;
}

export default function ArticlesList() {
  const api = useApi();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Article[]>("/api/articles?status=all")
      .then(setArticles)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleDelete(id: string) {
    if (!confirm("Delete this article?")) return;
    try {
      await api.del(`/api/articles/${id}`);
      setArticles((prev) => prev.filter((a) => a.id !== id));
    } catch {
      alert("Failed to delete article");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Articles</h1>
        <Link
          to="/articles/new"
          className="bg-[#189541] hover:bg-[#26c159] text-white font-medium rounded-lg px-5 py-2.5 transition-colors"
        >
          + New Article
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
            ) : articles.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-gray-400">
                  No articles yet
                </td>
              </tr>
            ) : (
              articles.map((a) => (
                <tr key={a.id} className="border-b border-[#072c38] last:border-0">
                  <td className="px-5 py-3 text-white">{a.title}</td>
                  <td className="px-5 py-3 text-gray-400 uppercase text-xs">
                    {a.locale}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-block text-xs font-medium px-2 py-0.5 rounded ${
                        a.status === "published"
                          ? "bg-[#189541]/20 text-[#26c159]"
                          : "bg-yellow-900/30 text-yellow-400"
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-400 text-sm">
                    {a.publishedAt
                      ? new Date(a.publishedAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-5 py-3 space-x-3">
                    <Link
                      to={`/articles/${a.id}`}
                      className="text-[#26c159] hover:underline text-sm"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(a.id)}
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
