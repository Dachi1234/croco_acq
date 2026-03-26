import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-[#001a24]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
