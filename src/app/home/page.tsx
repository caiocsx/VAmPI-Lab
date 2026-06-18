import { Link } from "react-router"

export function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0A0A0B] font-sans text-[#E4E4E7] selection:bg-[#FF5A5F] selection:text-white">
      <header className="sticky top-0 z-50 border-b border-[#1F1F23] bg-[#0A0A0B]/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <img src="/vampi-icon.png" alt="VAmPI Logo" className="h-12 w-12" />
            <span className="text-lg font-bold tracking-wider text-white">
              VAmPI <span className="font-light text-neutral-400">Lab</span>
            </span>
          </div>

          <nav className="hidden items-center gap-8 text-sm font-medium text-neutral-400 md:flex">
            <a
              href="#modules"
              className="relative text-[#FF5A5F] after:absolute after:-bottom-5.5 after:left-0 after:h-0.5 after:w-full after:bg-[#FF5A5F]"
            >
              Modules
            </a>
            <a
              href="#vulnerabilities"
              className="transition-colors hover:text-white"
            >
              Vulnerabilities
            </a>
            <a
              href="#leaderboard"
              className="transition-colors hover:text-white"
            >
              Leaderboard
            </a>
            <a href="#docs" className="transition-colors hover:text-white">
              Documentation
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-medium text-neutral-400 transition-colors hover:text-white"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="rounded bg-[#FF5A5F] px-4 py-2 text-sm font-medium text-white shadow-lg shadow-[#FF5A5F]/10 transition-colors hover:bg-[#ff4147]"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <section className="relative mx-auto max-w-7xl px-4 pt-20 pb-24 sm:px-6 md:pt-32 md:pb-40 lg:px-8">
        <div className="relative z-10 grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FF5A5F]/30 bg-[#FF5A5F]/10 px-3 py-1 text-xs font-semibold tracking-wider text-[#FF5A5F] uppercase">
              <span>🔥</span> Hands-On Labs
            </div>

            <h1 className="text-4xl leading-none font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              Master API Security with <br />
              <span className="text-[#FF5A5F]">VAmPI Lab UI</span>
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-neutral-400 sm:text-lg">
              A hands-on environment for exploring and understanding REST API
              vulnerabilities through interactive labs and demonstrations. Learn
              to defend by understanding the attack surface.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button className="group flex items-center gap-2 rounded bg-[#FF5A5F] px-6 py-3 font-medium text-white shadow-xl shadow-[#FF5A5F]/10 transition-all hover:bg-[#ff4147]">
                Get Started
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </button>
              <button className="rounded border border-[#2A2A30] bg-[#121214] px-6 py-3 font-medium text-neutral-300 transition-colors hover:border-[#3E3E46] hover:bg-[#161619]">
                Explore Vulnerabilities
              </button>
            </div>
          </div>

          <div className="flex justify-center lg:col-span-5">
            <div className="w-full max-w-md transform overflow-hidden rounded-xl border border-[#2A2A30] bg-[#121214] font-mono text-xs shadow-2xl transition-transform duration-300 hover:scale-[1.02] md:text-sm">
              <div className="flex items-center justify-between border-b border-[#2A2A30] bg-[#18181C] px-4 py-3">
                <span className="font-sans text-xs text-neutral-500">
                  Lab Terminal
                </span>
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-[#FF5F56]"></span>
                  <span className="h-3 w-3 rounded-full bg-[#FFBD2E]"></span>
                  <span className="h-3 w-3 rounded-full bg-[#27C93F]"></span>
                </div>
              </div>

              <div className="space-y-4 p-5 text-neutral-300">
                <div>
                  <span className="mr-2 text-[#FF5A5F]">&gt;</span>
                  <span className="text-neutral-200">
                    curl -X POST /api/login
                  </span>
                </div>
                <div className="pl-4 text-neutral-400">
                  {`{ "username": "admin" }`}
                </div>
                <div className="space-y-1 border-t border-[#1F1F23] pt-2">
                  <p className="text-emerald-400">HTTP/1.1 200 OK</p>
                  <p className="text-neutral-500">Set-Cookie: auth=... ;</p>
                </div>
                <div className="mt-4 flex animate-pulse items-center justify-between rounded border border-[#FF5A5F]/30 bg-[#FF5A5F]/10 p-3 text-xs font-bold tracking-wide text-[#FF5A5F]">
                  <span>AUTH VULNERABILITY DETECTED</span>
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="modules"
        className="border-t border-[#1F1F23] bg-[#0E0E10] py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Explore Common Vulnerabilities
            </h2>
            <p className="mt-2 text-sm text-neutral-400 sm:text-base">
              Targeted modules covering the OWASP Top 10 for APIs.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="group flex flex-col justify-between rounded-xl border border-[#222227] bg-[#121215] p-6 transition-all hover:border-[#32323A]">
              <div className="space-y-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#2C2C35] bg-[#1A1A22] text-neutral-400 transition-colors group-hover:text-[#FF5A5F]">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">
                  Broken Access Control
                </h3>
                <p className="text-sm leading-relaxed text-neutral-400">
                  Master vertical privilege escalation techniques and identify
                  IDOR vulnerabilities in RESTful endpoints.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-[#1F1F24] pt-4 font-mono text-xs">
                <span className="rounded border border-red-900/40 bg-red-950/50 px-2 py-0.5 text-[10px] font-bold text-red-400 uppercase">
                  Critical
                </span>
                <span className="text-neutral-500">Module 01</span>
              </div>
            </div>

            <div className="group flex flex-col justify-between rounded-xl border border-[#222227] bg-[#121215] p-6 transition-all hover:border-[#32323A]">
              <div className="space-y-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#2C2C35] bg-[#1A1A22] text-neutral-400 transition-colors group-hover:text-[#FF5A5F]">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m16-10a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">
                  User Enumeration
                </h3>
                <p className="text-sm leading-relaxed text-neutral-400">
                  Analyze subtle differences in auth error messages and timing
                  to map out existing user accounts.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-[#1F1F24] pt-4 font-mono text-xs">
                <span className="rounded border border-neutral-700 bg-neutral-800 px-2 py-0.5 text-[10px] font-bold text-neutral-300 uppercase">
                  Medium
                </span>
                <span className="text-neutral-500">Module 04</span>
              </div>
            </div>

            <div className="group flex flex-col justify-between rounded-xl border border-[#222227] bg-[#121215] p-6 transition-all hover:border-[#32323A]">
              <div className="space-y-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#2C2C35] bg-[#1A1A22] text-neutral-400 transition-colors group-hover:text-[#FF5A5F]">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.58 4 8 4s8-1.79 8-4M4 7c0-2.21 3.58-4 8-4s8 1.79 8 4m0 5c0 2.21-3.58 4-8 4s-8-1.79-8-4"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">
                  SQL Injection
                </h3>
                <p className="text-sm leading-relaxed text-neutral-400">
                  Manipulate database queries through unsanitized API inputs to
                  bypass authentication or extract sensitive data.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-[#1F1F24] pt-4 font-mono text-xs">
                <span className="rounded border border-orange-900/40 bg-orange-950/50 px-2 py-0.5 text-[10px] font-bold text-orange-400 uppercase">
                  High
                </span>
                <span className="text-neutral-500">Module 02</span>
              </div>
            </div>

            <div className="group flex flex-col justify-between rounded-xl border border-[#222227] bg-[#121215] p-6 transition-all hover:border-[#32323A]">
              <div className="space-y-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#2C2C35] bg-[#1A1A22] text-neutral-400 transition-colors group-hover:text-[#FF5A5F]">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">
                  JWT Analysis
                </h3>
                <p className="text-sm leading-relaxed text-neutral-400">
                  Explore token manipulation, algorithm switching, and weak
                  signing keys in JSON Web Token implementations.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-[#1F1F24] pt-4 font-mono text-xs">
                <span className="rounded border border-orange-900/40 bg-orange-950/50 px-2 py-0.5 text-[10px] font-bold text-orange-400 uppercase">
                  High
                </span>
                <span className="text-neutral-500">Module 05</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-[#222227] bg-gradient-to-r from-[#121215] to-[#18181C] p-8 shadow-xl md:p-12">
          <div className="pointer-events-none absolute top-1/2 right-0 h-72 w-72 -translate-y-1/2 rounded-full bg-[#FF5A5F]/10 blur-[100px]"></div>

          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl space-y-3">
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Ready to secure the future?
              </h2>
              <p className="text-sm leading-relaxed text-neutral-400 sm:text-base">
                Join thousands of security professionals mastering API
                protection. Deploy your first lab environment in seconds.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-4">
              <button className="rounded bg-[#FF5A5F] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#FF5A5F]/10 transition-colors hover:bg-[#ff4147]">
                Launch Dashboard
              </button>
              <button className="rounded border border-[#2A2A30] bg-[#0A0A0B] px-6 py-3.5 text-sm font-semibold text-neutral-300 transition-colors hover:border-[#3E3E46] hover:bg-[#121214]">
                View Documentation
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#1F1F23] bg-[#0A0A0B] py-12 text-xs text-neutral-500 sm:text-sm">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6 lg:px-8">
          <div className="space-y-1 text-center sm:text-left">
            <div className="text-sm font-bold tracking-wider text-white">
              VAmPI Lab
            </div>
            <p>© 2026 VAmPI Lab UI. Master the art of API Security.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-neutral-400">
            <a href="#privacy" className="transition-colors hover:text-white">
              Privacy Policy
            </a>
            <a href="#terms" className="transition-colors hover:text-white">
              Terms of Service
            </a>
            <a href="#github" className="transition-colors hover:text-white">
              Github Repository
            </a>
            <a href="#support" className="transition-colors hover:text-white">
              Contact Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
