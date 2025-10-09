import React, { useEffect, useState } from "react";
import { Users, Target, Heart, Shield, ArrowRight, Zap, CheckCircle, Lock, Smartphone, Clock, TrendingUp } from "lucide-react";

const AboutPage = ({ onNavigate }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const values = [
    {
      icon: Target,
      title: "Mission-Driven",
      description: "Simple, focused tools that help you achieve more every single day."
    },
    {
      icon: Heart,
      title: "User-Centric",
      description: "Design that's friendly, clear, and accessible to everyone."
    },
    {
      icon: Shield,
      title: "Trust & Security",
      description: "Your privacy and data are protected with enterprise-grade security."
    }
  ];

  const whatWeDo = [
    {
      icon: CheckCircle,
      title: "Smart Task Organization",
      description: "Automatically categorize, prioritize, and schedule your tasks with intelligent algorithms that learn from your patterns."
    },
    {
      icon: Zap,
      title: "Lightning-Fast Performance",
      description: "No lag, no delays. TaskMaster is built for speed, ensuring you can add, edit, and complete tasks in milliseconds."
    },
    {
      icon: Lock,
      title: "Privacy-First Approach",
      description: "Your tasks are encrypted end-to-end. We never sell your data or track your behavior for advertising."
    },
    {
      icon: Smartphone,
      title: "Works Everywhere",
      description: "Seamlessly sync across all your devices - desktop, mobile, tablet. Your tasks follow you wherever you go."
    },
    {
      icon: Clock,
      title: "Time Tracking Built-In",
      description: "Understand how you spend your time with automatic tracking and detailed analytics to boost productivity."
    },
    {
      icon: TrendingUp,
      title: "Progress Insights",
      description: "Beautiful visualizations show your productivity trends, helping you identify patterns and improve continuously."
    }
  ];

  const whyDifferent = [
    {
      title: "No Overwhelming Features",
      description: "Unlike complex project management tools, we focus on what matters: getting things done. Clean, simple, effective.",
      color: "from-emerald-600 to-teal-600"
    },
    {
      title: "Truly Intuitive Interface",
      description: "No tutorials needed. Our interface is so natural, you'll feel like an expert from day one. Designed by real users, for real users.",
      color: "from-blue-600 to-indigo-600"
    },
    {
      title: "Blazing Fast",
      description: "Most task apps are slow and clunky. We obsess over performance. Every interaction feels instant and responsive.",
      color: "from-purple-600 to-pink-600"
    },
    {
      title: "Smart, Not Complicated",
      description: "AI-powered suggestions without the complexity. Get intelligent recommendations that actually make sense for your workflow.",
      color: "from-orange-600 to-red-600"
    }
  ];

  const team = [
    { name: "Sarah Johnson", role: "Founder & CEO", avatar: "👩‍💼" },
    { name: "Mike Chen", role: "Lead Developer", avatar: "👨‍💻" },
    { name: "Emily Rodriguez", role: "UX Designer", avatar: "👩‍🎨" }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900">
      {/* Ambient blobs */}
      <div className="pointer-events-none select-none absolute inset-0 opacity-40 dark:opacity-20">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-tr from-emerald-300 to-sky-300 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-tr from-lime-300 to-teal-300 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-12">
        {/* Hero */}
        <section
           className={`mt-15 transition-all duration-700 ease-out
           ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
        >
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 px-4 py-1.5 text-sm font-medium mb-6">
              <Users className="h-4 w-4" />
              <span>About TaskMaster</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Task management that feels like magic
            </h1>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed">
              We believe productivity tools should be simple, beautiful, and actually help you get things done. 
              TaskMaster is built for people who want clarity, not complexity.
            </p>

            {/* <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => onNavigate && onNavigate("signup")}
                className="group inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold text-white transition
                  bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30"
              >
                Get started free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
              <button
                onClick={() => onNavigate && onNavigate("contact")}
                className="inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold
                  border border-emerald-600/20 text-emerald-700 hover:text-emerald-800 dark:text-emerald-300 dark:hover:text-emerald-200
                  bg-white/80 dark:bg-zinc-900/60 hover:bg-white shadow-sm transition"
              >
                Contact us
              </button>
            </div> */}
          </div>
        </section>

        {/* Quick stats */}
        <section className="grid grid-cols-2 md:grid-cols-4  mt-23 gap-4">
          {[
            { k: "50K+", v: "Active Users" },
            { k: "500K+", v: "Tasks Completed" },
            { k: "120+", v: "Countries" },
            { k: "99.9%", v: "Uptime" }
          ].map((s, i) => (
            <div
              key={i}
              className="rounded-2xl border border-zinc-200/70 dark:border-white/10 bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl p-5 text-center
              hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
            >
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{s.k}</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">{s.v}</div>
            </div>
          ))}
        </section>

        {/* What We Do */}
        <section className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-3">What We Do</h2>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              TaskMaster combines powerful features with simplicity to help you manage your tasks effortlessly
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whatWeDo.map(({ icon: Icon, title, description }, i) => (
              <div
                key={i}
                className="group rounded-2xl border border-zinc-200/70 dark:border-white/10 bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl p-6
                hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 shadow-lg shadow-emerald-500/20 mb-4">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Different */}
        <section className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-3">
              Why TaskMaster is Different
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              We're not just another task manager. Here's what makes us stand out from the crowd
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {whyDifferent.map(({ title, description, color }, i) => (
              <div
                key={i}
                className="group rounded-2xl border border-zinc-200/70 dark:border-white/10 bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl p-8
                hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
              >
                <div className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${color} text-white text-xs font-bold mb-4`}>
                  {i + 1}
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">{title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6 text-center">Our Core Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map(({ icon: Icon, title, description }, i) => (
              <div
                key={i}
                className="group rounded-2xl border border-zinc-200/70 dark:border-white/10 bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl p-6
                hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 shadow-lg shadow-emerald-500/20">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-white">{title}</h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        {/* <section className="mt-16">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6 text-center">Meet Our Team</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((m, i) => (
              <div
                key={i}
                className="rounded-2xl border border-zinc-200/70 dark:border-white/10 bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl p-8 text-center
                hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
              >
                <div className="text-6xl mb-4">{m.avatar}</div>
                <div className="font-bold text-lg text-zinc-900 dark:text-white">{m.name}</div>
                <div className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">{m.role}</div>
              </div>
            ))}
          </div>
        </section> */}

        {/* CTA */}
        {/* <section
          className={`mt-16 rounded-3xl border border-emerald-600/20 bg-gradient-to-r from-emerald-600 to-teal-600 p-10 text-center text-white
          shadow-xl transition-all duration-700 ease-out ${mounted ? "opacity-100" : "opacity-0"}`}
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-2">Ready to transform your productivity?</h3>
          <p className="text-lg text-emerald-50/90 mb-6">Join thousands of users who are getting more done with TaskMaster</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => onNavigate && onNavigate("signup")}
              className="inline-flex items-center gap-2 rounded-xl bg-white text-emerald-700 hover:text-emerald-800 px-6 py-3 font-semibold
              shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
            >
              Start free today
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => onNavigate && onNavigate("services")}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 text-white hover:bg-white/10 px-6 py-3 font-semibold
              transition-all duration-300"
            >
              Explore features
            </button>
          </div>
        </section> */}
      </div>
    </div>
  );
};

export default AboutPage;