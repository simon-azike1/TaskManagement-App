import React, { useEffect, useState } from "react";
import {
  ListChecks,
  Edit3,
  Flag,
  Tags,
  Filter,
  Search,
  UserCog,
  Rocket,
  CheckCircle,
} from "lucide-react";

// Demo hero image (replace with your own)
const HERO_IMG =
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80";

const appServices = [
  {
    icon: ListChecks,
    title: "Plan your tasks",
    description: "Schedule work and keep momentum.",
    features: ["Set due dates", "Track status: pending/in‑progress/completed"],
  },
  {
    icon: Edit3,
    title: "Create & edit tasks",
    description: "Stay flexible as things change.",
    features: ["Add, update, delete tasks", "Mark complete/incomplete"],
  },
  {
    icon: Flag,
    title: "Prioritize tasks",
    description: "Focus on what matters first.",
    features: ["High/medium/low priority", "Sort or view by priority"],
  },
  {
    icon: Tags,
    title: "Categorize tasks",
    description: "Organize by themes or areas.",
    features: ["Assign categories", "Browse by category"],
  },
  {
    icon: Filter,
    title: "Filter & search",
    description: "Find the right work fast.",
    features: ["Filter by status", "Search title and content"],
  },
  {
    icon: UserCog,
    title: "Manage your profile",
    description: "Keep your account up to date.",
    features: ["View profile", "Edit basic details"],
  },
];

const quickStats = [
  { k: "6", v: "Core features" },
  { k: "∞", v: "Task changes" },
  { k: "Fast", v: "Real-time feel" },
  { k: "Simple", v: "Zero bloat" },
];

const ServicesPage = ({ onNavigate }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900">
      {/* Ambient blobs */}
      <div className="pointer-events-none select-none absolute inset-0 opacity-40 dark:opacity-20">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-tr from-blue-300 to-pink-300 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-tr from-pink-200 to-black blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-12">
        {/* Hero */}
        <section
          className={`flex flex-col md:flex-row items-center gap-8 py-8 sm:py-16 transition-all duration-700 ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-4 py-1.5 text-sm font-medium mb-6">
              <Rocket className="h-4 w-4" />
              <span>Our Services</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Exactly what you need to stay organized
            </h1>
            <p className="mt-3 text-zinc-600 dark:text-zinc-300">
              Plan tasks, stay focused, and keep your profile current — without the bloat.
            </p>
          </div>
          <div className="flex-1 flex justify-center md:justify-end">
            <img
              src={HERO_IMG}
              alt="Productivity illustration"
              className="rounded-2xl shadow-lg object-cover w-full max-w-xl h-64 md:h-80"
              style={{
                background:
                  "linear-gradient(135deg, rgba(219,234,254,0.6) 60%, rgba(249,231,248,0.6) 100%)",
              }}
            />
          </div>
        </section>

        {/* Quick stats */}
        <section className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickStats.map((s, i) => (
            <div
              key={i}
              className="rounded-2xl border border-zinc-200/70 dark:border-white/10 bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl p-5 text-center hover:-translate-y-0.5 hover:shadow-md transition"
            >
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {s.k}
              </div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">{s.v}</div>
            </div>
          ))}
        </section>

        {/* What we offer (limited to current capabilities) */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">
            What the app can do now
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {appServices.map(({ icon: Icon, title, description, features }, i) => (
              <div
                key={i}
                className="group rounded-2xl border border-zinc-200/70 dark:border-white/10 bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl p-6 hover:-translate-y-0.5 hover:shadow-md transition"
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-white">
                  {title}
                </h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {description}
                </p>
                <ul className="mt-3 space-y-1 text-sm">
                  {features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-2 text-blue-700 dark:text-blue-300"
                    >
                      <CheckCircle className="h-4 w-4" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ServicesPage;