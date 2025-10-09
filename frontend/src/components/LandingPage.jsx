 import React, { useEffect, useState } from "react";
 import heroImage from "../assets/checklist.jpg";
import heroPoster from "../assets/simon.png";


const LandingPage = ({ onNavigate, isAuthenticated }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const features = [
    { k: "Capture", v: "Quick add, keyboard shortcuts, templates" },
    { k: "Plan", v: "Smart due dates, priorities, schedules" },
    { k: "Focus", v: "Distraction-free mode, batch actions" },
    { k: "Remind", v: "Email/push reminders, snooze, repeats" },
    { k: "Collaborate", v: "Share lists, comments, mentions" },
    { k: "Insights", v: "Progress, streaks, completion trends" },
  ];

  const differentiators = [
    { t: "Opinionated simplicity", d: "Every screen reduces choices, so you ship faster." },
    { t: "Real-time without noise", d: "Live sync for teams, minus the notification fatigue." },
    { t: "Privacy-first", d: "Minimal data collection and transparent controls." },
    { t: "Fast everywhere", d: "Optimized for low-end devices and spotty networks." },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-black dark:via-black dark:to-black">
      {/* Background video — replace with your assets */}
      <div className="absolute inset-0 -z-10">
      <video
  className="h-full w-full object-cover motion-reduce:hidden"
  autoPlay
  muted
  loop
  playsInline
  poster={heroPoster}
  aria-hidden="true"
>
  <source src={heroPoster} type="video/mp4" />
</video>

        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Hero with side image */}
      <section className="relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-14">
          <div className="grid items-center gap-8 lg:gap-12 lg:grid-cols-2">
            {/* Left: copy + actions */}
            <div
              className={`backdrop-blur-md bg-white/70 dark:bg-black/30 border border-white/30 dark:border-white/10 rounded-3xl p-8 sm:p-10 shadow-xl transition-all duration-700 ease-out
              ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"} motion-reduce:transition-none`}
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 text-blue-800 px-4 py-1.5 text-sm font-medium dark:bg-white/10 dark:text-white/90">
                Simple. Fast. Focused.
              </span>

              <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight text-black dark:text-white">
                Organize your work, beautifully
              </h1>

              <p className="mt-3 text-lg text-zinc-700 dark:text-zinc-200">
                Plan, track, and ship without the clutter.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                {isAuthenticated ? (
                  <button
                    onClick={() => onNavigate && onNavigate("dashboard")}
                    className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5"
                  >
                    Go to Dashboard
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => onNavigate && onNavigate("signup")}
                      className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5"
                    >
                      Get Started
                    </button>
                    <button
                      onClick={() => onNavigate && onNavigate("login")}
                      className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold border border-black/10 text-black bg-white hover:bg-zinc-50 dark:text-white dark:bg-black/40 dark:border-white/10 dark:hover:bg-black/60 transition"
                    >
                      Sign In
                    </button>
                  </>
                )}
              </div>

              {/* Quick highlights */}
              <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
                {[
                  { k: "Fast", v: "Instant sync" },
                  { k: "Secure", v: "Private by default" },
                  { k: "Clean", v: "No distractions" },
                ].map((item, i) => (
                  <div
                    key={item.k}
                    style={{ transitionDelay: `${100 * i}ms` }}
                    className={`rounded-xl border border-black/10 bg-white/70 text-black dark:text-white dark:bg-black/30 dark:border-white/10 p-3 text-center transition-all duration-500
                    ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"} hover:-translate-y-0.5 hover:shadow`}
                  >
                    <div className="font-semibold">{item.k}</div>
                    <div className="text-zinc-600 dark:text-zinc-300">{item.v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: big hero image — replace with your asset */}
            <div
              className={`transition-all duration-700 ease-out
              ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}`}
            >
              <div className="group relative rounded-3xl overflow-hidden bg-white/70 dark:bg-black/30 border border-white/30 dark:border-white/10 backdrop-blur-md shadow-2xl">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/10 to-transparent dark:from-white/5" />
               <img
  src={heroImage}
  alt="Done"
  loading="eager"
  className="h-[520px] w-full object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-[1.02] group-hover:-rotate-[0.25deg] motion-reduce:transform-none"
/>

                <div className="absolute bottom-4 right-4">
                  <span className="rounded-lg bg-black/60 text-white text-xs px-3 py-1.5 shadow-md backdrop-blur-sm dark:bg-white/20">
                    Live preview
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What it does */}
      <section className="relative pb-6 sm:pb-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white">
              What TaskMaster does
            </h2>
            <p className="mt-2 text-zinc-700 dark:text-zinc-300">
              Everything you need to capture, plan, and complete work — without bloat.
            </p>
          </div>

          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div
                key={f.k}
                style={{ transitionDelay: `${80 * i}ms` }}
                className={`rounded-2xl bg-white/80 dark:bg-black/40 border border-black/10 dark:border-white/10 p-5 backdrop-blur-md shadow-sm hover:shadow-lg transition-all duration-500
                ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"} hover:-translate-y-0.5`}
              >
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 6h14M5 18h10" />
                  </svg>
                </div>
                <div className="mt-3 font-semibold text-black dark:text-white">{f.k}</div>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{f.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why it's different */}
      <section className="relative pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <div
              className={`rounded-3xl bg-white/80 dark:bg-black/40 border border-black/10 dark:border-white/10 p-6 sm:p-8 backdrop-blur-md shadow-xl transition-all duration-700
              ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}`}
            >
              <h3 className="text-xl sm:text-2xl font-bold text-black dark:text-white">
                Why Done! is different
              </h3>
              <p className="mt-2 text-zinc-700 dark:text-zinc-300">
                Built for momentum: fewer clicks, clearer context, faster outcomes.
              </p>

              <ul className="mt-5 space-y-4">
                {differentiators.map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white">
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <div>
                      <div className="font-semibold text-black dark:text-white">{item.t}</div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">{item.d}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => onNavigate && onNavigate(isAuthenticated ? "dashboard" : "signup")}
                  className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5"
                >
                  {isAuthenticated ? "Open Dashboard" : "Start Free"}
                </button>
                {!isAuthenticated && (
                  <button
                    onClick={() => onNavigate && onNavigate("login")}
                    className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold border border-black/10 text-black bg-white hover:bg-zinc-50 dark:text-white dark:bg-black/40 dark:border-white/10 dark:hover:bg-black/60 transition"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>

            <div
              className={`rounded-3xl border border-blue-600/20 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 dark:from-blue-500/10 dark:to-indigo-500/10 p-6 sm:p-8 shadow-xl transition-all duration-700
              ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}`}
            >
              <h4 className="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">
                Designed for clarity
              </h4>
              <div className="mt-4 grid sm:grid-cols-2 gap-4">
                {[
                  { h: "Zero-config onboarding", p: "Set up in minutes with sensible defaults." },
                  { h: "One-click triage", p: "Archive, snooze, or schedule in a tap." },
                  { h: "Context at a glance", p: "Status, priority, and due dates always visible." },
                  { h: "Works offline", p: "Keep moving, even with weak internet." },
                ].map((b, i) => (
                  <div
                    key={i}
                    style={{ transitionDelay: `${80 * i}ms` }}
                    className={`rounded-2xl bg-white/80 dark:bg-black/40 border border-black/10 dark:border-white/10 p-4 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-500
                    ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"} hover:-translate-y-0.5`}
                  >
                    <div className="font-semibold text-black dark:text-white">{b.h}</div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{b.p}</p>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-sm text-zinc-600 dark:text-zinc-400">
                Built with a blue/white/black system theme for crisp contrast and readability.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;