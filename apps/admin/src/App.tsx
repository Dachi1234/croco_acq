import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import AdminLayout from "@/components/layout/AdminLayout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import ArticlesList from "@/pages/ArticlesList";
import PromotionsList from "@/pages/PromotionsList";
import PostEditor from "@/pages/PostEditor";
import HomepageEditor from "@/pages/HomepageEditor";
import Settings from "@/pages/Settings";
import MediaLibrary from "@/pages/MediaLibrary";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-[#001a24] text-white">
        Loading...
      </div>
    );
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="articles" element={<ArticlesList />} />
            <Route path="articles/new" element={<PostEditor type="article" />} />
            <Route path="articles/:id" element={<PostEditor type="article" />} />
            <Route path="promotions" element={<PromotionsList />} />
            <Route path="promotions/new" element={<PostEditor type="promotion" />} />
            <Route path="promotions/:id" element={<PostEditor type="promotion" />} />
            <Route path="homepage" element={<HomepageEditor />} />
            <Route path="settings" element={<Settings />} />
            <Route path="media" element={<MediaLibrary />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
