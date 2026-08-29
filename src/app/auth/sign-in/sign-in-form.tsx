"use client";

import { type FormEvent, useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail, Loader2, ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/core/supabase/client";
import { startGoogleOAuth } from "@/lib/core/auth/google-oauth";
import { toast } from "sonner";

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next") ?? "/dashboard";
  const next = nextParam.startsWith("/") ? nextParam : "/dashboard";
  const error = searchParams.get("error");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [googlePending, setGooglePending] = useState(false);

  async function onPasswordSignIn(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const supabase = createClient();

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setPending(false);
      toast.error(signInError.message);
      return;
    }

    toast.success("Welcome back to ScoutingReport Africa");
    router.replace(next);
    router.refresh();
  }

  async function onGoogleSignIn() {
    setGooglePending(true);
    try {
      await startGoogleOAuth(next);
    } catch (error) {
      setGooglePending(false);
      toast.error(error instanceof Error ? error.message : "Could not open Google sign-in.");
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs font-semibold text-red-300">
          {error}
        </div>
      )}

      <button
        type="button"
        disabled={pending || googlePending}
        onClick={onGoogleSignIn}
        className="h-12 w-full rounded-2xl border border-white/10 bg-[#0c1218] hover:bg-[#121921] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-black text-slate-950">
          G
        </span>
        <span>{googlePending ? "Opening Google..." : "Continue with Google"}</span>
      </button>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
        <div className="h-px bg-white/10" />
        <span>Or Email Access</span>
        <div className="h-px bg-white/10" />
      </div>

      <form onSubmit={onPasswordSignIn} className="space-y-4">
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block"
          >
            Scout Email
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
            Password
          </label>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
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
              <span>Sign In to Scout Hub</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
