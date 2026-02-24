import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";
import { useAuth } from "../contexts/AuthContext";
import AuthLayout from "../components/AuthLayout";
import SocialButtons from "../components/SocialButtons";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      if (res.data.success) {
        await checkAuth();
        navigate("/");
      }
    } catch (err: unknown) {
      const msg =
        (err as any).response?.data?.message ?? "Login failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      type="login"
      onToggle={() => navigate("/register")}
      title=""
      footerText="Don't have an account yet?"
      footerLinkText="Sign up"
      onFooterLinkClick={() => navigate("/register")}
    >
      <form onSubmit={handleLogin} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700 ml-1">
            Email address
          </label>
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all text-sm placeholder:text-gray-300"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center px-1">
            <label className="text-sm font-semibold text-gray-700">
              Password
            </label>
            <button
              type="button"
              className="text-[11px] font-bold text-gray-900 border-b-2 border-gray-900 leading-tight"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all text-sm placeholder:text-gray-300 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
        </div>

        {error && (
          <p className="text-xs text-red-500 bg-red-50 p-2 rounded-lg border border-red-100 text-center">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-gray-900 text-white font-semibold text-sm shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:bg-gray-800 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>

        <SocialButtons />
      </form>
    </AuthLayout>
  );
};

export default Login;

