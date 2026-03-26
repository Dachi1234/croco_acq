import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/", { replace: true });
    } catch (err: any) {
      setError(err.message ?? "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#001a24]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-[#00131a] border border-[#072c38] rounded-xl p-8 space-y-6"
      >
        <h1 className="text-2xl font-bold text-white text-center">
          Acquisition Admin
        </h1>

        {error && (
          <div className="bg-red-900/40 border border-red-700 text-red-300 text-sm rounded-lg px-4 py-2.5">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#001a24] border border-[#072c38] rounded-lg px-3.5 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#189541] transition-colors"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#001a24] border border-[#072c38] rounded-lg px-3.5 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#189541] transition-colors"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-[#189541] hover:bg-[#26c159] disabled:opacity-50 text-white font-medium rounded-lg py-2.5 transition-colors cursor-pointer"
        >
          {submitting ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
  );
}
