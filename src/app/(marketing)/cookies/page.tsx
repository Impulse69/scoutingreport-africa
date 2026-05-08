import type { Metadata } from "next";

export const metadata: Metadata = { title: "Cookie Policy" };

export default function CookiesPage() {
  return (
    <div className="container mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-bold tracking-tight">Cookie Policy</h1>
      <p className="mt-4 text-sm text-muted-foreground">Last updated: 2026-05-06</p>
      <div className="mt-8 space-y-4 text-muted-foreground leading-relaxed">
        <p>
          We use the minimum cookies required to keep you signed in and to
          remember your preferences (theme, language). Specifically:
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <span className="font-semibold text-foreground">Session</span> — issued
            by Supabase Auth to keep you signed in.
          </li>
          <li>
            <span className="font-semibold text-foreground">NEXT_LOCALE</span> —
            stores the language you picked from the language switcher.
          </li>
          <li>
            <span className="font-semibold text-foreground">theme</span> — light /
            dark / system preference.
          </li>
        </ul>
        <p>
          We do not use third-party advertising or tracking cookies. You can
          clear cookies in your browser at any time without losing access to the
          platform — you&apos;ll just need to sign in again.
        </p>
      </div>
    </div>
  );
}
