import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ScrollText, ShieldCheck } from "lucide-react";
import { getMyProfile } from "@/lib/features/profile/actions";
import { SettingsForm } from "./settings-form";

export const metadata: Metadata = { title: "Settings" };

const ROLE_BLURB: Record<string, string> = {
  user: "You can browse players, keep watchlists and take private notes. Publishing reports needs a scout account, which an admin grants.",
  scout:
    "You can create player profiles and publish scouting reports to the public roster.",
  admin:
    "Full access, including other people's players and reports, and role changes.",
};

export default async function SettingsPage() {
  const profile = await getMyProfile();
  if (!profile) redirect("/auth/sign-in?next=/settings");

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8 px-6 py-8">
      <header className="border-b border-border pb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Your profile and account details.
        </p>
      </header>

      {/* Profile */}
      <section className="rounded-lg border border-border bg-card">
        <header className="border-b border-border px-5 py-3.5">
          <h2 className="text-sm font-semibold">Profile</h2>
        </header>
        <div className="p-5">
          <SettingsForm
            initialDisplayName={profile.displayName ?? ""}
            initialBio={profile.bio ?? ""}
          />
        </div>
      </section>

      {/* Account */}
      <section className="rounded-lg border border-border bg-card">
        <header className="border-b border-border px-5 py-3.5">
          <h2 className="text-sm font-semibold">Account</h2>
        </header>

        <div className="space-y-4 p-5">
          <dl className="divide-y divide-border">
            <div className="flex items-center justify-between gap-4 py-2.5 first:pt-0">
              <dt className="text-sm text-muted-foreground">Email</dt>
              <dd className="truncate text-sm font-medium">
                {profile.email ?? "—"}
              </dd>
            </div>

            <div className="flex items-center justify-between gap-4 py-2.5">
              <dt className="text-sm text-muted-foreground">Role</dt>
              <dd>
                <span className="rounded-md border border-border bg-muted px-2.5 py-0.5 text-xs font-medium capitalize">
                  {profile.role}
                </span>
              </dd>
            </div>

            {profile.createdAt && (
              <div className="flex items-center justify-between gap-4 py-2.5 last:pb-0">
                <dt className="text-sm text-muted-foreground">Member since</dt>
                <dd className="text-sm tabular-nums">
                  {new Date(profile.createdAt).toLocaleDateString()}
                </dd>
              </div>
            )}
          </dl>

          <p className="flex items-start gap-2.5 rounded-md border border-border bg-muted p-4 text-sm leading-6 text-muted-foreground">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>{ROLE_BLURB[profile.role]}</span>
          </p>

          {profile.role !== "user" && (
            <Link
              href="/scout"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
            >
              <ScrollText className="h-4 w-4" />
              Scout workspace
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
