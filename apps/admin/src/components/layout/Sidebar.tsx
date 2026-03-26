import { NavLink } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  FileText,
  Tag,
  Home,
  ImageIcon,
  Settings,
  LogOut,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const navItems: { to: string; label: string; icon: LucideIcon }[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/articles", label: "Articles", icon: FileText },
  { to: "/promotions", label: "Promotions", icon: Tag },
  { to: "/homepage", label: "Homepage", icon: Home },
  { to: "/media", label: "Media", icon: ImageIcon },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-[#072c38] bg-[#00131a]">
      <div className="border-b border-[#072c38] px-6 py-5">
        <span className="text-lg font-bold tracking-tight text-white">
          Acquisition Admin
        </span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#189541] text-white"
                  : "text-gray-400 hover:bg-[#072c38] hover:text-white"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-[#072c38] px-3 py-4">
        <button
          onClick={logout}
          className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 transition-colors hover:bg-[#072c38] hover:text-white"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
