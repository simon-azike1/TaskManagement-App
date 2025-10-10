 import React, { useEffect, useState } from "react";
 import { motion } from "framer-motion";
 import ProfessionalFooter from "./Footer";


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
      </div>
      {/* Hero with side image */}
      <section className="relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-14">
        <div className="grid items-center gap-8 lg:gap-12 lg:grid-cols-2">

          {/* LEFT: Text Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="backdrop-blur-md bg-white/70 dark:bg-black/30 border border-white/30 dark:border-white/10 rounded-3xl p-8 sm:p-10 shadow-xl">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full bg-blue-100 text-blue-800 
              px-4 py-1.5 text-sm font-medium dark:bg-white/10 dark:text-white/90">
              Simple. Fast. Focused.
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight text-black dark:text-white">
              Organize your work, beautifully
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
              className="mt-3 text-zinc-700 dark:text-zinc-200"
            >
              Chetro is a powerful task management platform designed to help you and your team stay organized,
              boost productivity, and achieve your goals efficiently.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mt-8 flex flex-col sm:flex-row gap-3"
            >
              {isAuthenticated ? (
                <button
                  onClick={() => onNavigate && onNavigate("dashboard")}
                  className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold text-white 
                             bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 
                             shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5"
                >
                  Go to Dashboard
                </button>
              ) : (
                <>
                  <button
                    onClick={() => onNavigate && onNavigate("signup")}
                    className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold text-white 
                               bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 
                               shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5"
                  >
                    Get Started
                  </button>
                  <button
                    onClick={() => onNavigate && onNavigate("login")}
                    className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold border 
                               border-black/10 text-black bg-white hover:bg-zinc-50 dark:text-white dark:bg-black/40 
                               dark:border-white/10 dark:hover:bg-black/60 transition"
                  >
                    Sign In
                  </button>
                </>
              )}
            </motion.div>

            {/* Quick Highlights */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { staggerChildren: 0.15 },
                },
              }}
              className="mt-6 grid grid-cols-3 gap-3 text-sm"
            >
              {[
                { k: "Fast", v: "Instant sync" },
                { k: "Secure", v: "Private by default" },
                { k: "Clean", v: "No distractions" },
              ].map((item) => (
                <motion.div
                  key={item.k}
                  variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
                  className="rounded-xl border border-black/10 bg-white/70 text-black dark:text-white 
                             dark:bg-black/30 dark:border-white/10 p-3 text-center hover:-translate-y-0.5 
                             hover:shadow transition-all duration-500"
                >
                  <div className="font-semibold">{item.k}</div>
                  <div className="text-zinc-600 dark:text-zinc-300">{item.v}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* RIGHT: Hero Image */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.9, ease: "easeOut" }}
          >
            <motion.div
              whileHover={{ scale: 1.02, rotate: -0.25 }}
              transition={{ type: "spring", stiffness: 120, damping: 10 }}
              className="group relative rounded-3xl overflow-hidden bg-white/70 dark:bg-black/30 border 
                         border-white/30 dark:border-white/10 backdrop-blur-md shadow-2xl"
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-20 
                              bg-gradient-to-b from-black/10 to-transparent dark:from-white/5" />
              <img
                src="https://cdn.pixabay.com/photo/2021/04/24/09/51/checklist-6203690_1280.jpg"
                alt="Tm"
                loading="eager"
                className="h-[520px] w-full object-cover transition-transform duration-700 ease-out 
                           will-change-transform group-hover:scale-[1.02] group-hover:-rotate-[0.25deg] 
                           motion-reduce:transform-none"
              />
              <div className="absolute bottom-4 right-4">
                <span className="rounded-lg bg-black/60 text-white text-xs px-3 py-1.5 shadow-md 
                                 backdrop-blur-sm dark:bg-white/20">
                  Live preview
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
      {/* What it does */}
       <section className="relative pb-6 sm:pb-10 mt-23">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
          className="max-w-3xl"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white">
            What Chetro does
          </h2>
          <p className="mt-2 text-zinc-700 dark:text-zinc-300">
            Everything you need to capture, plan, and complete work, without bloat.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.k}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                delay: i * 0.15,
                duration: 0.6,
                ease: "easeOut",
              }}
              viewport={{ once: true, amount: 0.2 }}
              className="rounded-2xl bg-white/80 dark:bg-black/40 border border-black/10 dark:border-white/10 
                         p-5 backdrop-blur-md shadow-sm hover:shadow-lg transition-all duration-500 
                         hover:-translate-y-0.5"
            >
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg 
                              bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 12h14M5 6h14M5 18h10"
                  />
                </svg>
              </div>

              <div className="mt-3 font-semibold text-black dark:text-white">{f.k}</div>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{f.v}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
     
     
      {/* Why it's different */}
         <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={mounted ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className="relative pb-20 mt-23"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="rounded-3xl bg-white/80 dark:bg-black/40 border border-black/10 dark:border-white/10 p-6 sm:p-8 backdrop-blur-md shadow-xl transition-all duration-700"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-black dark:text-white">
              Why Chetro is different!
            </h3>
            <p className="mt-2 text-zinc-700 dark:text-zinc-300">
              Built for momentum: fewer clicks, clearer context, faster outcomes.
            </p>

            <ul className="mt-5 space-y-4">
              {differentiators.map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
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
          </motion.div>

          {/* Right Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="rounded-3xl border border-blue-600/20 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 dark:from-blue-500/10 dark:to-indigo-500/10 p-6 sm:p-8 shadow-xl transition-all duration-700"
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
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={mounted ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.1 * i }}
                  className="rounded-2xl bg-white/80 dark:bg-black/40 border border-black/10 dark:border-white/10 p-4 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-500 hover:-translate-y-0.5"
                >
                  <div className="font-semibold text-black dark:text-white">{b.h}</div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{b.p}</p>
                </motion.div>
              ))}
            </div>
            <p className="mt-5 text-sm text-zinc-600 dark:text-zinc-400">
              Built with a blue/white/black system theme for crisp contrast and readability.
            </p>
          </motion.div>
        </div>
      </div>
    </motion.section>

  <ProfessionalFooter onNavigate={onNavigate} />
    </div>
  );
};

export default LandingPage;