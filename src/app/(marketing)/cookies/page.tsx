import type { Metadata } from "next";

export const metadata: Metadata = { title: "Cookie Policy" };

export default function CookiesPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-8">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
        Cookie Policy
      </h1>
      <p className="mt-4 text-sm text-muted-foreground">Last updated: 2026-05-06</p>
      <div className="mt-8 space-y-4 text-sm leading-6 text-muted-foreground">
        <p>
          We use the minimum cookies required to keep you signed in and to
          remember your language preference. Specifically:
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <span className="font-semibold text-foreground">Session</span> -
            issued by Supabase Auth to keep you signed in.
          </li>
          <li>
            <span className="font-semibold text-foreground">NEXT_LOCALE</span> -
            stores the language you picked from the language switcher.
          </li>
        </ul>
        <p>
          We do not use third-party advertising or tracking cookies. You can
          clear cookies in your browser at any time without losing access to the
          platform. You will just need to sign in again.
        </p>
      </div>
    </div>
  );
}
