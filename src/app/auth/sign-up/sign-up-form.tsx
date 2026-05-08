"use client";

import { type FormEvent, useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail, User } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/core/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next") ?? "/";
  const next = nextParam.startsWith("/") ? nextParam : "/";
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

    // If a session exists immediately, the project has email confirmation off.
    if (data.session) {
      toast.success("Welcome aboard");
      router.replace(next);
      router.refresh();
      return;
    }

    setPending(false);
    setConfirmationSent(email);
  }

  async function onGoogleSignUp() {
    setGooglePending(true);
    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });

    if (error) {
      setGooglePending(false);
      toast.error(error.message);
    }
  }

  if (confirmationSent) {
    return (
      <div className="space-y-4 rounded-xl border border-orange-500/30 bg-orange-500/5 p-6">
        <Mail className="h-6 w-6 text-orange-500" />
        <div className="space-y-2">
          <h2 className="text-lg font-bold tracking-tight text-stone-950 dark:text-white">
            Check your inbox
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            We sent a confirmation link to{" "}
            <span className="font-mono text-stone-900 dark:text-white">
              {confirmationSent}
            </span>
            . Click it to activate your account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="h-12 w-full justify-center rounded-lg border-stone-200 bg-white text-stone-900 shadow-sm hover:bg-stone-50 dark:border-stone-800 dark:bg-stone-950 dark:text-white dark:hover:bg-stone-900"
        disabled={pending || googlePending}
        onClick={onGoogleSignUp}
      >
        <span className="mr-2 flex size-5 items-center justify-center rounded-full border border-stone-200 bg-white text-xs font-black text-stone-800">
          G
        </span>
        {googlePending ? "Opening Google..." : "Continue with Google"}
      </Button>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
        <div className="h-px bg-stone-200 dark:bg-stone-800" />
        <span>Or with email</span>
        <div className="h-px bg-stone-200 dark:bg-stone-800" />
      </div>

      <form onSubmit={onSignUp} className="space-y-4">
        <div className="space-y-2">
          <Label
            htmlFor="display_name"
            className="text-xs uppercase tracking-[0.14em] text-stone-500"
          >
            Display name
          </Label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
            <Input
              id="display_name"
              autoComplete="name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              className="h-12 rounded-lg border-stone-200 bg-white pl-10 text-stone-950 placeholder:text-stone-400 focus-visible:border-orange-600 focus-visible:ring-orange-600/20 dark:border-stone-800 dark:bg-stone-950 dark:text-white"
              maxLength={120}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="text-xs uppercase tracking-[0.14em] text-stone-500"
          >
            Email
          </Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@scoutingreport.africa"
              className="h-12 rounded-lg border-stone-200 bg-white pl-10 text-stone-950 placeholder:text-stone-400 focus-visible:border-orange-600 focus-visible:ring-orange-600/20 dark:border-stone-800 dark:bg-stone-950 dark:text-white"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="text-xs uppercase tracking-[0.14em] text-stone-500"
          >
            Password
          </Label>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="h-12 rounded-lg border-stone-200 bg-white px-10 text-stone-950 placeholder:text-stone-400 focus-visible:border-orange-600 focus-visible:ring-orange-600/20 dark:border-stone-800 dark:bg-stone-950 dark:text-white"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 transition-colors hover:text-stone-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600/40 dark:hover:text-stone-200"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((value) => !value)}
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="h-12 w-full rounded-lg bg-orange-600 text-[11px] font-bold uppercase tracking-[0.18em] text-white shadow-sm shadow-orange-900/10 transition-all hover:bg-orange-700 active:scale-[0.99]"
          disabled={pending || googlePending}
        >
          {pending ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <p className="text-center text-xs leading-5 text-stone-500 dark:text-stone-400">
        By signing up you agree to our{" "}
        <a href="/terms" className="underline hover:text-stone-700 dark:hover:text-stone-200">
          terms
        </a>{" "}
        and{" "}
        <a href="/privacy" className="underline hover:text-stone-700 dark:hover:text-stone-200">
          privacy policy
        </a>
        .
      </p>
    </div>
  );
}
