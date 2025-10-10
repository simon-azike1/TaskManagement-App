import React, { useMemo, useState, useEffect } from "react";
import ProfessionalFooter from "./Footer";
import { authAPI } from "../services/servicesApi";
import { Sparkles } from "lucide-react";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(values) {
  const errors = {};
  if (!values.email.trim()) errors.email = "Email is required";
  else if (!emailRegex.test(values.email.trim())) errors.email = "Enter a valid email";
  if (!values.password) errors.password = "Password is required";
  else if (values.password.length < 8) errors.password = "At least 8 characters";
  return errors;
}

const LoginPage = ({ onNavigate, onLogin, error: propError }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const fieldErrors = useMemo(() => validate({ email, password }), [email, password]);
  const displayError = propError || apiError;

  function handleBlur(e) {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError("");
    setTouched({ email: true, password: true });

    if (Object.keys(fieldErrors).length > 0) return;

    setLoading(true);
    try {
      const res = await authAPI.login({ email: email.trim(), password });
      const userData = res?.data?.data?.user || res?.data?.user;
      const token = res?.data?.data?.token || res?.data?.token;

      if (token) authAPI.setToken(token);
      if (userData && token && onLogin) onLogin(userData);
    } catch (err) {
      const msg = err?.response?.data?.message || "Invalid email or password";
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-black">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className={`relative mx-auto max-w-md px-4 py-12 transition-all duration-700 ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        <div className="rounded-3xl border border-blue-800/40 bg-black/40 backdrop-blur-xl shadow-2xl shadow-blue-900/20 p-6 sm:p-8 transition-all duration-500 hover:border-blue-700/50 hover:shadow-blue-800/30">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 shadow-lg shadow-blue-500/50 group hover:scale-110 hover:rotate-3 transition-all duration-300 cursor-pointer">
              <svg className="h-7 w-7 text-white transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12a8 8 0 11-16 0 8 8 0 0116 0z" />
              </svg>
            </div>
            <div className="flex items-center justify-center gap-2 mt-4">
              <h1 className="text-3xl font-bold text-blue-100">Welcome back</h1>
              <Sparkles className="h-5 w-5 text-blue-400 animate-pulse" />
            </div>
            <p className="text-blue-200/70 mt-2">Sign in to continue to your account</p>
          </div>

          {/* Error Alert */}
          {displayError && (
            <div
              role="alert"
              aria-live="assertive"
              className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-900/20 p-4 text-red-200 backdrop-blur-sm animate-shake"
            >
              <svg className="h-5 w-5 mt-0.5 flex-none animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm">{displayError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <div className="group">
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-blue-200">
                Email
              </label>
              <div
                className={`relative rounded-xl border bg-blue-950/30 backdrop-blur-sm transition-all duration-300
                ${touched.email && fieldErrors.email 
                  ? "border-red-500/60 focus-within:ring-4 focus-within:ring-red-500/20" 
                  : "border-blue-800/40 focus-within:ring-4 focus-within:ring-blue-500/20 hover:border-blue-700/50"}
                focus-within:shadow-lg focus-within:shadow-blue-500/10`}
              >
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-blue-400/70 transition-colors group-focus-within:text-blue-400">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l9 6 9-6" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 8v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8" />
                  </svg>
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={handleBlur}
                  aria-invalid={Boolean(touched.email && fieldErrors.email)}
                  aria-describedby={touched.email && fieldErrors.email ? "email-error" : undefined}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border-0 bg-transparent pl-10 pr-3 py-3.5 text-blue-100 placeholder-blue-400/40 outline-none transition-colors focus:placeholder-blue-300/50"
                />
              </div>
              {touched.email && fieldErrors.email && (
                <p id="email-error" className="mt-1.5 text-xs text-red-400 animate-fadeIn">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="group">
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-blue-200">
                Password
              </label>
              <div
                className={`relative rounded-xl border bg-blue-950/30 backdrop-blur-sm transition-all duration-300
                ${touched.password && fieldErrors.password 
                  ? "border-red-500/60 focus-within:ring-4 focus-within:ring-red-500/20" 
                  : "border-blue-800/40 focus-within:ring-4 focus-within:ring-blue-500/20 hover:border-blue-700/50"}
                focus-within:shadow-lg focus-within:shadow-blue-500/10`}
              >
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-blue-400/70 transition-colors group-focus-within:text-blue-400">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="11" width="18" height="10" rx="2" strokeWidth="2" />
                    <path d="M7 11V8a5 5 0 0110 0v3" strokeWidth="2" />
                  </svg>
                </span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={handleBlur}
                  aria-invalid={Boolean(touched.password && fieldErrors.password)}
                  aria-describedby={touched.password && fieldErrors.password ? "password-error" : undefined}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border-0 bg-transparent pl-10 pr-12 py-3.5 text-blue-100 placeholder-blue-400/40 outline-none transition-colors focus:placeholder-blue-300/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-2 text-blue-400/70 hover:text-blue-300 hover:bg-blue-800/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40 group"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l3.59 3.59A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {touched.password && fieldErrors.password && (
                <p id="password-error" className="mt-1.5 text-xs text-red-400 animate-fadeIn">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`group relative inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 font-semibold text-white transition-all duration-300 overflow-hidden
                ${loading 
                  ? "bg-blue-600/50 cursor-not-allowed" 
                  : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-95"}`}
            >
              {!loading && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
              )}
              {loading && (
                <svg className="h-5 w-5 animate-spin text-white/90" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-90" d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              )}
              <span className="relative z-10">{loading ? "Signing in..." : "Sign In"}</span>
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-sm text-blue-200/70">
            Don&apos;t have an account?{" "}
            <button
              onClick={() => onNavigate && onNavigate("signup")}
              className="font-semibold text-blue-400 hover:text-blue-300 transition-colors duration-300 hover:underline underline-offset-4"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
      
      <ProfessionalFooter onNavigate={onNavigate} />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;