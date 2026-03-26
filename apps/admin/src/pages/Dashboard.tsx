import { Link } from "react-router-dom";
import { FileText, Tag, Upload, Plus } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const stats: { label: string; value: string; color: string; icon: LucideIcon }[] = [
  { label: "Articles", value: "—", color: "border-[#189541]", icon: FileText },
  { label: "Promotions", value: "—", color: "border-[#26c159]", icon: Tag },
  { label: "Uploads", value: "—", color: "border-[#072c38]", icon: Upload },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-white">Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`border-l-4 ${s.color} rounded-xl bg-[#00131a] p-6`}
          >
            <div className="mb-2 flex items-center gap-2 text-gray-400">
              <s.icon size={16} />
              <p className="text-sm">{s.label}</p>
            </div>
            <p className="text-3xl font-bold text-white">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <Link
          to="/articles/new"
          className="inline-flex items-center gap-2 rounded-lg bg-[#189541] px-5 py-2.5 font-medium text-white transition-colors hover:bg-[#26c159]"
        >
          <Plus size={18} />
          New Article
        </Link>
        <Link
          to="/promotions/new"
          className="inline-flex items-center gap-2 rounded-lg bg-[#072c38] px-5 py-2.5 font-medium text-white transition-colors hover:bg-[#0d3d4a]"
        >
          <Plus size={18} />
          New Promotion
        </Link>
      </div>
    </div>
  );
}
