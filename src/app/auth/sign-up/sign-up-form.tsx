"use client";

import { type FormEvent, useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail, User, Loader2, ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/core/supabase/client";
import { startGoogleOAuth } from "@/lib/core/auth/google-oauth";
import { toast } from "sonner";

export function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next") ?? "/dashboard";
  const next = nextParam.startsWith("/") ? nextParam : "/dashboard";
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [googlePending, setGooglePending] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState<string | null>(null);

  async function onSignUp(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setPending(true);
    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName.trim() || undefined },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });

    if (error) {
      setPending(false);
      toast.error(error.message);
      return;
    }

    if (data.session) {
      toast.success("Welcome to ScoutingReport Africa");
      router.replace(next);
      router.refresh();
      return;
    }

    setPending(false);
    setConfirmationSent(email);
  }

  async function onGoogleSignUp() {
    setGooglePending(true);
    try {
      await startGoogleOAuth(next);
    } catch (error) {
      setGooglePending(false);
      toast.error(error instanceof Error ? error.message : "Could not open Google sign-up.");
    }
  }

  if (confirmationSent) {
    return (
      <div className="space-y-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
        <Mail className="h-8 w-8 text-emerald-400 mx-auto" />
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-white">Check Your Inbox</h2>
          <p className="text-xs text-slate-300">
            We sent a verification link to <span className="font-mono text-emerald-300 font-bold">{confirmationSent}</span>. Click it to activate your scout account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        type="button"
        disabled={pending || googlePending}
        onClick={onGoogleSignUp}
        className="h-12 w-full rounded-2xl border border-white/10 bg-[#0c1218] hover:bg-[#121921] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-black text-slate-950">
          G
        </span>
        <span>{googlePending ? "Opening Google..." : "Continue with Google"}</span>
      </button>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
        <div className="h-px bg-white/10" />
        <span>Or With Email</span>
        <div className="h-px bg-white/10" />
      </div>

      <form onSubmit={onSignUp} className="space-y-4">
        <div className="space-y-1.5">
          <label
            htmlFor="display_name"
            className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block"
          >
            Scout / Analyst Name
          </label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              id="display_name"
              autoComplete="name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Samuel Eto'o"
              maxLength={120}
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/10 bg-[#121921] text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block"
          >
            Work Email
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="scout@club.com"
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/10 bg-[#121921] text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block"
          >
            Password (Min 8 Chars)
          </label>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="w-full h-11 pl-10 pr-10 rounded-xl border border-white/10 bg-[#121921] text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-200 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={pending || googlePending}
          className="w-full h-11 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
        >
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <span>Create Scout Account</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <p className="text-center text-[11px] text-slate-400">
        By signing up, you agree to our{" "}
        <a href="/terms" className="underline text-emerald-400 hover:text-emerald-300">
          Terms
        </a>{" "}
        and{" "}
        <a href="/privacy" className="underline text-emerald-400 hover:text-emerald-300">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}
