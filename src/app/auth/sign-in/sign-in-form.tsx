"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/core/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function SignInForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);

  async function onMagicLink(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });
    setPending(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div className="bg-orange-50 dark:bg-orange-950/30 p-6 border border-orange-100 dark:border-orange-500/20 text-center">
        <p className="text-sm text-orange-900 dark:text-orange-400 font-medium">
          Magic link sent to <br />
          <span className="font-bold">{email}</span>
        </p>
        <p className="text-xs text-orange-700/60 dark:text-orange-400/60 mt-2">
          Click the link in your inbox to sign in instantly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onMagicLink} className="space-y-4">
      <Input
        id="magic-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="name@scoutingreport.africa"
        className="h-12 rounded-none border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 focus-visible:ring-0 focus-visible:border-orange-600 transition-all placeholder:text-stone-400"
      />
      <Button
        type="submit"
        className="w-full h-12 rounded-none bg-orange-600 hover:bg-orange-700 text-white font-bold uppercase tracking-widest text-[11px] transition-all active:scale-[0.98]"
        disabled={pending}
      >
        {pending ? "Sending..." : "Send Magic Link"}
      </Button>
      <p className="pt-4 text-[10px] uppercase tracking-[0.2em] text-stone-400 text-center">
        Passwordless · No password to forget.
      </p>
    </form>
  );
}
