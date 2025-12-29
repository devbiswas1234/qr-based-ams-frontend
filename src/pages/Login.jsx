import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { startTokenTimer } from "../utils/tokenTimer";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });

      // ✅ Save token & user
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // ✅ Start token auto-logout timer
      startTokenTimer();

      // ✅ Role-based redirect
      if (res.data.user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/user", { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage: "url('/src/assets/login-bg.png')", // 👈 your image
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Login Card */}
      <form
        onSubmit={handleLogin}
        className="relative z-10 w-full max-w-md bg-slate-900/90 backdrop-blur p-8 rounded-xl shadow-2xl border border-slate-700"
      >
        <h2 className="text-3xl font-bold text-center text-blue-400 mb-2">
          Attendance System
        </h2>
        <p className="text-center text-slate-400 mb-6">
          Login to continue
        </p>

        {error && (
          <div className="bg-red-500/20 text-red-400 p-2 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded font-semibold bg-blue-600 hover:bg-blue-700 transition text-white"
          >
            Login
          </button>
        </div>

        <p className="text-xs text-slate-500 text-center mt-6">
          © {new Date().getFullYear()} Attendance System
        </p>
      </form>
    </div>
  );
}
