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
      <div className="space-y-4 rounded-lg border border-border bg-card p-6 text-center">
        <Mail className="mx-auto h-8 w-8 text-primary" />
        <div className="space-y-2">
          <h2 className="text-base font-semibold">Check your inbox</h2>
          <p className="text-sm leading-6 text-muted-foreground">
            We sent a verification link to{" "}
            <span className="font-medium text-foreground">{confirmationSent}</span>.
            Open it to activate your account.
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
        className="flex h-10 w-full items-center justify-center gap-2 rounded-md border border-border bg-background text-sm font-medium transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:opacity-50"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full border border-border text-xs font-semibold">
          G
        </span>
        <span>{googlePending ? "Opening Google…" : "Continue with Google"}</span>
      </button>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-xs text-muted-foreground">
        <div className="h-px bg-border" />
        <span>or</span>
        <div className="h-px bg-border" />
      </div>

      <form onSubmit={onSignUp} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="display_name" className="block text-sm font-medium">
            Your name
          </label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="display_name"
              autoComplete="name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Shown as the author on your reports"
              maxLength={120}
              className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@club.com"
              className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-10 text-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">Minimum 8 characters.</p>
        </div>

        <button
          type="submit"
          disabled={pending || googlePending}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:opacity-50"
        >
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <span>Create account</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <p className="text-center text-xs text-muted-foreground">
        By signing up, you agree to our{" "}
        <a href="/terms" className="text-primary underline underline-offset-4">
          Terms
        </a>{" "}
        and{" "}
        <a href="/privacy" className="text-primary underline underline-offset-4">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}
