"use client";

import { BoltIcon, EmailIcon, LockIcon } from "@shared/icons";

export function LoginForm() {
  return (
    <main className="relative z-10 flex min-h-screen items-center justify-center p-4">
      {/* Login Card */}
      <div className="w-full max-w-[440px] bg-bg-elevated/90 backdrop-blur-xl p-12 flex flex-col gap-6 border-l-[3px] border-neon-primary shadow-[-4px_0_15px_-4px_rgba(0,240,255,0.5)] animate-[pulse-glow_3s_infinite]">
        {/* Header */}
        <header className="flex flex-col gap-1">
          <h1 className="font-display text-2xl xs:text-[32px] leading-tight text-neon-primary tracking-tighter uppercase italic">
            INMORTAL_GAMING
          </h1>
          <p className="font-mono text-sm text-text-secondary uppercase">
            Secure Neural Gateway
          </p>
        </header>

        {/* Form */}
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => e.preventDefault()}
        >
          {/* Email */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="email"
              className="font-mono text-[13px] font-semibold text-neon-primary/80 uppercase flex items-center gap-2"
            >
              <EmailIcon className="h-4 w-4" />
              Neural ID (Email)
            </label>
            <input
              id="email"
              type="email"
              placeholder="RECRUIT_ID@NEURAL.LINK"
              className="w-full bg-bg-primary border border-white/10 px-4 py-3 font-mono text-base focus:outline-none focus:border-neon-primary focus:ring-1 focus:ring-neon-primary transition-all placeholder:text-text-muted/30"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="password"
              className="font-mono text-[13px] font-semibold text-neon-primary/80 uppercase flex items-center gap-2"
            >
              <LockIcon className="h-4 w-4" />
              Access Code (Password)
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••••••"
              className="w-full bg-bg-primary border border-white/10 px-4 py-3 font-mono text-base focus:outline-none focus:border-neon-primary focus:ring-1 focus:ring-neon-primary transition-all placeholder:text-text-muted/30"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="relative overflow-hidden mt-3 w-full bg-neon-primary text-bg-primary py-4 font-display text-sm xs:text-xl font-semibold uppercase font-bold tracking-widest active:scale-[0.98] transition-transform flex items-center justify-center gap-3 group"
          >
            <span className="relative z-10 flex items-center gap-3">
              INITIALIZE SESSION
              <BoltIcon className="h-5 w-5" />
            </span>
            {/* Hover slide overlay */}
            <span className="absolute inset-0 bg-neon-primary flex items-center justify-center -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
          </button>

          {/* Status */}
          <div className="flex items-center justify-center gap-2 py-1">
            <span className="h-2 w-2 rounded-full bg-neon-green shadow-[0_0_10px_#00ff88] animate-pulse" />
            <span className="font-mono text-[11px] text-neon-green/70 uppercase tracking-widest">
              Neural Link Active
            </span>
          </div>
        </form>

        {/* Footer links */}
        <footer className="flex flex-col gap-3 border-t border-white/5 pt-6">
          <a
            href="#"
            className="font-mono text-sm text-text-muted hover:text-neon-primary transition-colors uppercase text-center"
          >
            FORGOT CREDENTIALS?
          </a>
          <a
            href="#"
            className="font-mono text-sm text-text-secondary hover:text-neon-primary transition-colors uppercase text-center"
          >
            NEW RECRUIT?{" "}
            <span className="text-neon-primary font-bold underline underline-offset-4">
              REGISTER
            </span>
          </a>
        </footer>
      </div>
    </main>
  );
}
