import Link from "next/link";
import {
  HeartPulse,
  Brain,
  Stethoscope,
  ShieldCheck,
  Globe,
  BarChart3,
  AlertTriangle,
  Pill,
  ArrowRight,
  MessageCircle,
  Check,
} from "lucide-react";

const FEATURES = [
  {
    icon: Stethoscope,
    title: "Symptom Checker",
    desc: "Describe your symptoms and get possible causes, urgency guidance, and when to seek care.",
    color: "text-teal-600",
    bg: "bg-teal-50 dark:bg-teal-950/50",
  },
  {
    icon: Brain,
    title: "Mental Health Support",
    desc: "Anxiety and depression screening tools, supportive guidance, and crisis escalation.",
    color: "text-violet-600",
    bg: "bg-violet-50 dark:bg-violet-950/50",
  },
  {
    icon: Pill,
    title: "Medication Guidance",
    desc: "Drug information, common side effects, and interaction awareness — always verify with your pharmacist.",
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950/50",
  },
  {
    icon: ShieldCheck,
    title: "Vaccination Reminders",
    desc: "Immunization schedules by age group and region, booster guidance, and travel vaccines.",
    color: "text-green-600",
    bg: "bg-green-50 dark:bg-green-950/50",
  },
  {
    icon: AlertTriangle,
    title: "Outbreak Alerts",
    desc: "Public health advisory awareness and guidance on where to find authoritative outbreak news.",
    color: "text-amber-600",
    bg: "bg-amber-50 dark:bg-amber-950/50",
  },
  {
    icon: Globe,
    title: "Multilingual Support",
    desc: "Ask your health questions in English, Spanish, French, Hindi, Chinese and more.",
    color: "text-indigo-600",
    bg: "bg-indigo-50 dark:bg-indigo-950/50",
  },
  {
    icon: BarChart3,
    title: "Health Statistics",
    desc: "Understand disease burden trends, how health data is reported, and where to find official dashboards.",
    color: "text-rose-600",
    bg: "bg-rose-50 dark:bg-rose-950/50",
  },
  {
    icon: HeartPulse,
    title: "Rural & Remote Access",
    desc: "Telehealth guidance, community health center locators, and alternatives when clinics are far.",
    color: "text-cyan-600",
    bg: "bg-cyan-50 dark:bg-cyan-950/50",
  },
  {
    icon: MessageCircle,
    title: "Health Literacy",
    desc: "Complex medical jargon translated to plain language, with links to trusted educational resources.",
    color: "text-orange-600",
    bg: "bg-orange-50 dark:bg-orange-950/50",
  },
];

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Create your account",
    desc: "Sign up in seconds with Google or email. Your conversation history is saved and synced.",
  },
  {
    step: "2",
    title: "Choose your focus mode",
    desc: "Select from Symptom Check, Mental Health, Medications, Vaccines, and more for context-aware answers.",
  },
  {
    step: "3",
    title: "Ask your question",
    desc: "Type naturally. HealthBot provides clear, evidence-based educational information powered by Gemini.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* ── Navbar ──────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-white/80 backdrop-blur-md dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600">
              <HeartPulse className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-[var(--foreground)]">
              HealthBot
            </span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm text-[var(--muted)] transition hover:text-[var(--foreground)]"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm text-[var(--muted)] transition hover:text-[var(--foreground)]"
            >
              How it works
            </a>
            <a
              href="#safety"
              className="text-sm text-[var(--muted)] transition hover:text-[var(--foreground)]"
            >
              Safety
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-[var(--foreground)] transition hover:text-teal-600"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-teal-700"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-cyan-50 to-white pt-20 pb-24 dark:from-slate-900 dark:via-teal-950/30 dark:to-slate-900">
        {/* decorative blob */}
        <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-teal-200/40 blur-3xl dark:bg-teal-800/20" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-cyan-200/40 blur-3xl dark:bg-cyan-800/20" />

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center gap-14 lg:flex-row lg:items-start">
            {/* Left — copy */}
            <div className="flex-1 text-center lg:text-left">
              <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700 dark:border-teal-800 dark:bg-teal-950/50 dark:text-teal-300">
                <HeartPulse className="h-3.5 w-3.5" />
                Powered by Google Gemini
              </span>
              <h1 className="mt-5 text-5xl font-bold leading-tight tracking-tight text-slate-900 dark:text-slate-50 lg:text-6xl">
                Your AI-powered
                <br />
                <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  health companion
                </span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                Get clear, evidence-based health education on symptoms,
                medications, vaccines, mental health, and more — available 24/7
                in your language.
              </p>
              <p className="mt-3 text-sm font-medium text-amber-600 dark:text-amber-400">
                ⚠️ Educational information only — not medical advice or emergency
                care.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-600/25 transition hover:bg-teal-700"
                >
                  Start for free
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-white px-6 py-3 text-sm font-semibold text-[var(--foreground)] shadow-sm transition hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700"
                >
                  See features
                </a>
              </div>
            </div>

            {/* Right — chat mockup */}
            <div className="w-full max-w-sm flex-shrink-0 lg:max-w-md">
              <div className="rounded-2xl border border-[var(--border)] bg-white shadow-2xl shadow-teal-900/10 dark:bg-slate-800">
                {/* Chat header */}
                <div className="flex items-center gap-3 border-b border-[var(--border)] px-4 py-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-600">
                    <HeartPulse className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--foreground)]">
                      HealthBot
                    </p>
                    <p className="text-xs text-green-500">● Online</p>
                  </div>
                </div>
                {/* Messages */}
                <div className="space-y-3 p-4">
                  <div className="max-w-[85%] rounded-xl rounded-tl-none bg-slate-100 px-3.5 py-2.5 text-sm text-slate-800 dark:bg-slate-700 dark:text-slate-100">
                    I&apos;ve had a headache for 2 days. Should I be concerned?
                  </div>
                  <div className="ml-auto max-w-[85%] rounded-xl rounded-tr-none bg-teal-600 px-3.5 py-2.5 text-sm text-white">
                    A 2-day headache can have several causes. Let me help you
                    understand the key red flags to watch for...
                  </div>
                  <div className="max-w-[85%] rounded-xl rounded-tl-none bg-slate-100 px-3.5 py-2.5 text-sm text-slate-800 dark:bg-slate-700 dark:text-slate-100">
                    What vaccines should I get for travel to Southeast Asia?
                  </div>
                  <div className="flex gap-1.5 px-2 py-2">
                    <div className="typing-dot h-2 w-2 rounded-full bg-teal-400" />
                    <div className="typing-dot h-2 w-2 rounded-full bg-teal-400" />
                    <div className="typing-dot h-2 w-2 rounded-full bg-teal-400" />
                  </div>
                </div>
                {/* Input */}
                <div className="flex items-center gap-2 border-t border-[var(--border)] px-3 py-3">
                  <div className="flex-1 rounded-lg border border-[var(--border)] bg-slate-50 px-3 py-2 text-sm text-slate-400 dark:bg-slate-700">
                    Ask a health question…
                  </div>
                  <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white">
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────── */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[var(--foreground)] sm:text-4xl">
              Everything for health literacy
            </h2>
            <p className="mt-4 text-[var(--muted)]">
              Nine specialised modes, each tuned for a different health education need.
            </p>
          </div>
          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="group rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-6 shadow-sm transition hover:shadow-md"
                >
                  <div
                    className={`inline-flex rounded-xl p-3 ${f.bg}`}
                  >
                    <Icon className={`h-6 w-6 ${f.color}`} />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-[var(--foreground)]">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────── */}
      <section
        id="how-it-works"
        className="bg-slate-50 py-24 dark:bg-slate-900/60"
      >
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[var(--foreground)] sm:text-4xl">
              Get started in 3 steps
            </h2>
          </div>
          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-600 text-xl font-bold text-white shadow-lg shadow-teal-600/30">
                  {item.step}
                </div>
                <h3 className="mt-5 text-base font-semibold text-[var(--foreground)]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-600/25 transition hover:bg-teal-700"
            >
              Create your free account
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Safety disclaimer ─────────────────────────────────── */}
      <section id="safety" className="py-20">
        <div className="mx-auto max-w-3xl px-6">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 dark:border-amber-900 dark:bg-amber-950/30">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/50">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-amber-900 dark:text-amber-200">
                  Important safety notice
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-amber-800 dark:text-amber-300">
                  HealthBot provides educational health information only and is{" "}
                  <strong>not a substitute</strong> for professional medical
                  advice, diagnosis, or treatment. Never delay seeking emergency
                  care because of something you read here. If you are
                  experiencing a medical emergency, call your local emergency
                  number immediately.
                </p>
                <ul className="mt-3 space-y-1">
                  {[
                    "Not for emergencies — call 911 or your local number",
                    "Cannot diagnose conditions or prescribe medication",
                    "Mental health crisis: call/text 988 (US)",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-xs text-amber-700 dark:text-amber-400"
                    >
                      <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="border-t border-[var(--border)] py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-600">
                <HeartPulse className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-[var(--foreground)]">
                HealthBot
              </span>
            </div>
            <p className="text-center text-xs text-[var(--muted)]">
              Educational use only. Not medical advice.{" "}
              <span className="hidden sm:inline">
                Always consult a qualified healthcare professional for personal
                medical guidance.
              </span>
            </p>
            <div className="flex gap-5 text-xs text-[var(--muted)]">
              <Link href="/login" className="hover:text-[var(--foreground)]">
                Sign in
              </Link>
              <Link href="/signup" className="hover:text-[var(--foreground)]">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
