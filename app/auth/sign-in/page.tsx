"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  async function onPasswordLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setPending(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Signed in successfully");
    router.refresh();
    router.push(next);
  }

  return (
    <div className="w-full max-w-[350px] mx-auto">
      <div className="flex flex-col space-y-2 text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-stone-900 dark:text-white">
          Welcome back
        </h1>
        <p className="text-stone-500 text-sm">
          Access your scouting portal across the continent.
        </p>
      </div>

      <Tabs defaultValue="magic" className="w-full">
        <TabsList className="grid w-full grid-cols-2 p-1 mb-8 bg-stone-100 dark:bg-stone-900 rounded-none border border-stone-200 dark:border-stone-800">
          <TabsTrigger 
            value="magic" 
            className="rounded-none text-[10px] uppercase tracking-widest font-bold transition-all data-[state=active]:bg-stone-900 dark:data-[state=active]:bg-white data-[state=active]:text-white dark:data-[state=active]:text-stone-900 shadow-none border-none"
          >
            Magic Link
          </TabsTrigger>
          <TabsTrigger 
            value="password" 
            className="rounded-none text-[10px] uppercase tracking-widest font-bold transition-all data-[state=active]:bg-stone-900 dark:data-[state=active]:bg-white data-[state=active]:text-white dark:data-[state=active]:text-stone-900 shadow-none border-none"
          >
            Password
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="magic" className="mt-0 space-y-4">
          {sent ? (
            <div className="bg-orange-50 dark:bg-orange-950/30 p-6 border border-orange-100 dark:border-orange-500/20 text-center">
              <p className="text-sm text-orange-900 dark:text-orange-400 font-medium">
                Magic link sent to <br />
                <span className="font-bold">{email}</span>
              </p>
              <p className="text-xs text-orange-700/60 dark:text-orange-400/60 mt-2">
                Click the link in your inbox to sign in instantly.
              </p>
            </div>
          ) : (
            <form onSubmit={onMagicLink} className="space-y-4">
              <div className="space-y-1">
                <Input
                  id="magic-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@scoutingreport.africa"
                  className="h-12 rounded-none border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 focus-visible:ring-0 focus-visible:border-orange-600 transition-all placeholder:text-stone-400"
                />
              </div>
              <Button type="submit" className="w-full h-12 rounded-none bg-orange-600 hover:bg-orange-700 text-white font-bold uppercase tracking-widest text-[11px] transition-all active:scale-[0.98]" disabled={pending}>
                {pending ? "Sending..." : "Send Magic Link"}
              </Button>
            </form>
          )}
        </TabsContent>

        <TabsContent value="password" className="mt-0 space-y-4">
          <form onSubmit={onPasswordLogin} className="space-y-4">
            <div className="space-y-1">
              <Input
                id="pass-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="h-12 rounded-none border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 focus-visible:ring-0 focus-visible:border-orange-600 transition-all placeholder:text-stone-400"
              />
            </div>
            <div className="space-y-1">
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="h-12 rounded-none border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 focus-visible:ring-0 focus-visible:border-orange-600 transition-all placeholder:text-stone-400"
              />
            </div>
            <Button type="submit" className="w-full h-12 rounded-none bg-stone-900 dark:bg-white text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-stone-200 font-bold uppercase tracking-widest text-[11px] transition-all active:scale-[0.98]" disabled={pending}>
              {pending ? "Signing in..." : "Secure Sign In"}
            </Button>
          </form>
          <div className="pt-6 border-t border-stone-100 dark:border-stone-900 mt-6">
            <p className="text-[9px] text-center text-stone-400 uppercase tracking-[0.2em]">
              Dev Mode Access: <span className="text-orange-600 font-bold">Scout123!</span>
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
