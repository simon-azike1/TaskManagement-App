import React, { useMemo, useState } from "react";
import { authAPI } from "../services/servicesApi";

const emailRegex =
  // basic-but-practical email check
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function getPasswordStrength(password) {
  const lengthOk = password.length >= 8;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  const score = [lengthOk, hasLower, hasUpper, hasNumber, hasSymbol].filter(Boolean).length;

  if (!password) {
    return { score: 0, label: "Start typing a password", color: "bg-gray-300" };
  }
  if (score <= 2) {
    return { score, label: "Weak", color: "bg-rose-500" };
  }
  if (score === 3) {
    return { score, label: "Fair", color: "bg-amber-500" };
  }
  if (score === 4) {
    return { score, label: "Good", color: "bg-lime-500" };
  }
  return { score, label: "Strong", color: "bg-emerald-500" };
}

function validate(values) {
  const errors = {};
  if (!values.firstName.trim()) errors.firstName = "First name is required";
  if (!values.lastName.trim()) errors.lastName = "Last name is required";
  if (!values.email.trim()) errors.email = "Email is required";
  else if (!emailRegex.test(values.email)) errors.email = "Enter a valid email";
  if (!values.password) errors.password = "Password is required";
  else if (values.password.length < 8) errors.password = "At least 8 characters";
  if (!values.confirmPassword) errors.confirmPassword = "Please confirm your password";
  else if (values.confirmPassword !== values.password) errors.confirmPassword = "Passwords do not match";
  return errors;
}

const SignupPage = ({ onNavigate, onSignup, error: propError }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [touched, setTouched] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const fieldErrors = useMemo(() => validate(formData), [formData]);
  const strength = useMemo(() => getPasswordStrength(formData.password), [formData.password]);
  const displayError = propError || apiError;

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError("");

    // mark all as touched so errors show if any missing
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      confirmPassword: true
    });

    const anyError = Object.keys(fieldErrors).length > 0;
    if (anyError) return;

    setLoading(true);
    try {
      const res = await authAPI.register({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password
      });

      const userData = res?.data?.data?.user || res?.data?.user;
      const token = res?.data?.data?.token || res?.data?.token;

      if (userData && token && onSignup) onSignup(userData);
    } catch (err) {
      const msg = err?.response?.data?.message || "Signup failed. Please try again.";
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  }

  const filledBars = Math.min(4, Math.max(0, strength.score)); // 0..4
  const strengthBarColor =
    strength.score <= 1 ? "bg-rose-500" :
    strength.score === 2 ? "bg-amber-500" :
    strength.score === 3 ? "bg-lime-500" :
    "bg-emerald-500";

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-sky-50 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900">
      <div className="pointer-events-none select-none absolute inset-0 opacity-40 dark:opacity-20">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-tr from-indigo-300 to-fuchsia-300 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-tr from-sky-300 to-emerald-300 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left: Hero / Brand */}
          <div className="hidden lg:flex flex-col justify-between rounded-3xl border border-zinc-200/60 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-xl p-10">
            <div>
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-fuchsia-600 shadow-lg shadow-indigo-500/20">
                <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5 9 6.343 9 8s1.343 3 3 3z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.5 20a7.5 7.5 0 10-15 0h15z" />
                </svg>
              </div>
              <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                Create your account
              </h1>
              <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-300">
                A clean, modern onboarding with delightful details and accessible interactions.
              </p>
            </div>

            <ul className="mt-8 space-y-4">
              {[
                { label: "Inline validation and helpful guidance" },
                { label: "Strong password meter and toggle" },
                { label: "Keyboard and screen reader friendly" }
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="text-zinc-700 dark:text-zinc-200">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Form Card */}
          <div className="rounded-3xl border border-zinc-200/70 dark:border-white/10 bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl shadow-xl p-6 sm:p-8">
            <div className="text-center mb-6 lg:hidden">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-fuchsia-600 shadow-lg shadow-indigo-500/20">
                <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5 9 6.343 9 8s1.343 3 3 3z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.5 20a7.5 7.5 0 10-15 0h15z" />
                </svg>
              </div>
              <h2 className="mt-4 text-2xl font-bold text-zinc-900 dark:text-white">Create Account</h2>
              <p className="text-zinc-600 dark:text-zinc-300">Start managing your tasks today</p>
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
              {/* Names */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="group">
                  <label htmlFor="firstName" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    First name
                  </label>
                  <div
                    className={`relative rounded-xl border bg-white/70 dark:bg-zinc-900/60 transition-shadow
                    ${touched.firstName && fieldErrors.firstName ? "border-rose-400/60 focus-within:ring-rose-400/40" : "border-zinc-300/70 dark:border-white/10 focus-within:ring-indigo-500/30"}
                    focus-within:ring-4`}
                  >
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5 9 6.343 9 8s1.343 3 3 3z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.5 20a7.5 7.5 0 10-15 0h15z" />
                      </svg>
                    </span>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      value={formData.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-invalid={Boolean(touched.firstName && fieldErrors.firstName)}
                      aria-describedby={touched.firstName && fieldErrors.firstName ? "firstName-error" : undefined}
                      placeholder="John"
                      className="w-full rounded-xl border-0 bg-transparent pl-10 pr-3 py-3.5 text-zinc-900 placeholder-zinc-400 outline-none dark:text-white"
                    />
                  </div>
                  {touched.firstName && fieldErrors.firstName && (
                    <p id="firstName-error" className="mt-1.5 text-xs text-rose-600 dark:text-rose-400">
                      {fieldErrors.firstName}
                    </p>
                  )}
                </div>

                <div className="group">
                  <label htmlFor="lastName" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Last name
                  </label>
                  <div
                    className={`relative rounded-xl border bg-white/70 dark:bg-zinc-900/60 transition-shadow
                    ${touched.lastName && fieldErrors.lastName ? "border-rose-400/60 focus-within:ring-rose-400/40" : "border-zinc-300/70 dark:border-white/10 focus-within:ring-indigo-500/30"}
                    focus-within:ring-4`}
                  >
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5 9 6.343 9 8s1.343 3 3 3z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.5 20a7.5 7.5 0 10-15 0h15z" />
                      </svg>
                    </span>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      value={formData.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-invalid={Boolean(touched.lastName && fieldErrors.lastName)}
                      aria-describedby={touched.lastName && fieldErrors.lastName ? "lastName-error" : undefined}
                      placeholder="Doe"
                      className="w-full rounded-xl border-0 bg-transparent pl-10 pr-3 py-3.5 text-zinc-900 placeholder-zinc-400 outline-none dark:text-white"
                    />
                  </div>
                  {touched.lastName && fieldErrors.lastName && (
                    <p id="lastName-error" className="mt-1.5 text-xs text-rose-600 dark:text-rose-400">
                      {fieldErrors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="group">
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Email
                </label>
                <div
                  className={`relative rounded-xl border bg-white/70 dark:bg-zinc-900/60 transition-shadow
                  ${touched.email && fieldErrors.email ? "border-rose-400/60 focus-within:ring-rose-400/40" : "border-zinc-300/70 dark:border-white/10 focus-within:ring-indigo-500/30"}
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
                    value={formData.email}
                    onChange={handleChange}
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
                  ${touched.password && fieldErrors.password ? "border-rose-400/60 focus-within:ring-rose-400/40" : "border-zinc-300/70 dark:border-white/10 focus-within:ring-indigo-500/30"}
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
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={Boolean(touched.password && fieldErrors.password)}
                    aria-describedby={touched.password && fieldErrors.password ? "password-error" : "password-help"}
                    placeholder="At least 8 characters"
                    className="w-full rounded-xl border-0 bg-transparent pl-10 pr-12 py-3.5 text-zinc-900 placeholder-zinc-400 outline-none dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
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
                <div className="mt-2" aria-live="polite" id="password-help">
                  <div className="flex gap-1.5">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <span
                        key={i}
                        className={`h-1.5 w-full rounded-full transition-colors ${i < filledBars ? strengthBarColor : "bg-zinc-200 dark:bg-white/10"}`}
                      />
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">{strength.label}</p>
                </div>
                {touched.password && fieldErrors.password && (
                  <p id="password-error" className="mt-1.5 text-xs text-rose-600 dark:text-rose-400">
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="group">
                <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Confirm password
                </label>
                <div
                  className={`relative rounded-xl border bg-white/70 dark:bg-zinc-900/60 transition-shadow
                  ${touched.confirmPassword && fieldErrors.confirmPassword ? "border-rose-400/60 focus-within:ring-rose-400/40" : "border-zinc-300/70 dark:border-white/10 focus-within:ring-indigo-500/30"}
                  focus-within:ring-4`}
                >
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <rect x="3" y="11" width="18" height="10" rx="2" />
                      <path d="M7 11V8a5 5 0 0110 0v3" />
                    </svg>
                  </span>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={Boolean(touched.confirmPassword && fieldErrors.confirmPassword)}
                    aria-describedby={touched.confirmPassword && fieldErrors.confirmPassword ? "confirmPassword-error" : undefined}
                    placeholder="Re-enter your password"
                    className="w-full rounded-xl border-0 bg-transparent pl-10 pr-3 py-3.5 text-zinc-900 placeholder-zinc-400 outline-none dark:text-white"
                  />
                </div>
                {touched.confirmPassword && fieldErrors.confirmPassword && (
                  <p id="confirmPassword-error" className="mt-1.5 text-xs text-rose-600 dark:text-rose-400">
                    {fieldErrors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className={`group relative inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 font-semibold text-white transition
                ${loading ? "bg-indigo-400 cursor-not-allowed" : "bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-700 hover:to-fuchsia-700 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30"}`}
              >
                {loading && (
                  <svg className="h-5 w-5 animate-spin text-white/90" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-90" d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                )}
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
              Already have an account?{" "}
              <button
                onClick={() => onNavigate && onNavigate("login")}
                className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;