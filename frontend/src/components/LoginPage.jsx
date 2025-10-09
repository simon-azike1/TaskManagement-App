import React, { useMemo, useState } from "react";
import { authAPI } from "../services/servicesApi";

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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900">
      <div className="pointer-events-none select-none absolute inset-0 opacity-40 dark:opacity-20">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-tr from-emerald-300 to-sky-300 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-tr from-lime-300 to-teal-300 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-md px-4 py-12">
        <div className="rounded-3xl border border-zinc-200/70 dark:border-white/10 bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl shadow-xl p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 shadow-lg shadow-emerald-500/20">
              <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12a8 8 0 11-16 0 8 8 0 0116 0z" />
              </svg>
            </div>
            <h1 className="mt-4 text-3xl font-bold text-zinc-900 dark:text-white">Welcome back</h1>
            <p className="text-zinc-600 dark:text-zinc-300">Sign in to continue to your account</p>
          </div>

          {displayError && (
            <div
              role="alert"
              aria-live="assertive"
              className="mb-6 flex items-start gap-3 rounded-xl border border-rose-200/60 bg-rose-50/80 p-4 text-rose-700 dark:border-rose-400/30 dark:bg-rose-950/30 dark:text-rose-300"
            >
              <svg className="h-5 w-5 mt-0.5 flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm">{displayError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <div className="group">
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Email
              </label>
              <div
                className={`relative rounded-xl border bg-white/70 dark:bg-zinc-900/60 transition-shadow
                ${touched.email && fieldErrors.email ? "border-rose-400/60 focus-within:ring-rose-400/40" : "border-zinc-300/70 dark:border-white/10 focus-within:ring-emerald-500/30"}
                focus-within:ring-4`}
              >
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
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
                  className="w-full rounded-xl border-0 bg-transparent pl-10 pr-3 py-3.5 text-zinc-900 placeholder-zinc-400 outline-none dark:text-white"
                />
              </div>
              {touched.email && fieldErrors.email && (
                <p id="email-error" className="mt-1.5 text-xs text-rose-600 dark:text-rose-400">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="group">
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Password
              </label>
              <div
                className={`relative rounded-xl border bg-white/70 dark:bg-zinc-900/60 transition-shadow
                ${touched.password && fieldErrors.password ? "border-rose-400/60 focus-within:ring-rose-400/40" : "border-zinc-300/70 dark:border-white/10 focus-within:ring-emerald-500/30"}
                focus-within:ring-4`}
              >
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="11" width="18" height="10" rx="2" />
                    <path d="M7 11V8a5 5 0 0110 0v3" />
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
                  className="w-full rounded-xl border-0 bg-transparent pl-10 pr-12 py-3.5 text-zinc-900 placeholder-zinc-400 outline-none dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l3.59 3.59A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {touched.password && fieldErrors.password && (
                <p id="password-error" className="mt-1.5 text-xs text-rose-600 dark:text-rose-400">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center cursor-pointer">
                {/* <input type="checkbox" className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500" />
                <span className="ml-2 text-zinc-700 dark:text-zinc-300">Remember me</span> */}
              </label>
              {/* <button type="button" className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium">
                Forgot password?
              </button> */}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`group relative inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 font-semibold text-white transition
                ${loading ? "bg-emerald-400 cursor-not-allowed" : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30"}`}
            >
              {loading && (
                <svg className="h-5 w-5 animate-spin text-white/90" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-90" d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              )}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
            Don&apos;t have an account?{" "}
            <button
              onClick={() => onNavigate && onNavigate("signup")}
              className="font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
