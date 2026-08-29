import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ScrollText, ShieldCheck, User, Compass, Sparkles } from "lucide-react";
import { getMyProfile } from "@/lib/features/profile/actions";
import { SettingsForm } from "./settings-form";

export const metadata: Metadata = { title: "Scout Profile Settings & Focus" };

const ROLE_BLURB: Record<string, string> = {
  user: "Free Explorer account: browse all player dossiers, manage personal recruitment watchlists, and view fantasy analytics.",
  scout:
    "Verified Scout account: register new prospect profiles, draft structured assessments, and publish scouting reports to the network roster.",
  admin:
    "Platform Administrator: full department clearance, user role management, system audits, and player database governance.",
};

export default async function SettingsPage() {
  const profile = await getMyProfile();
  if (!profile) redirect("/auth/sign-in?next=/settings");

  return (
    <div className="container mx-auto max-w-3xl space-y-8 px-4 lg:px-8 py-10">
      {/* Header */}
      <div className="space-y-2 pb-6 border-b border-white/10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
          <Compass className="h-3.5 w-3.5" /> Department Preferences
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Scout Account & Settings
        </h1>
        <p className="text-xs text-slate-400">
          Manage your scout profile identity, bio credentials, and departmental role permissions.
        </p>
      </div>

      {/* Profile Form */}
      <section className="rounded-3xl border border-white/10 bg-[#0c1218] p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center gap-2 pb-4 border-b border-white/5">
          <User className="h-4 w-4 text-emerald-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            Scout Bio & Signature
          </h2>
        </div>

        <SettingsForm
          initialDisplayName={profile.displayName ?? ""}
          initialBio={profile.bio ?? ""}
        />
      </section>

      {/* Account & Role Metadata */}
      <section className="rounded-3xl border border-white/10 bg-[#0c1218] p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center gap-2 pb-4 border-b border-white/5">
          <ShieldCheck className="h-4 w-4 text-amber-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            Departmental Clearance & Access
          </h2>
        </div>

        <dl className="space-y-4">
          <div className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-[#121921] border border-white/5">
            <dt className="text-xs font-bold text-slate-400">Account Email</dt>
            <dd className="text-xs font-mono font-semibold text-white truncate">
              {profile.email ?? "—"}
            </dd>
          </div>

          <div className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-[#121921] border border-white/5">
            <dt className="text-xs font-bold text-slate-400">Assigned Role</dt>
            <dd>
              <span
                className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-wider ${
                  profile.role === "admin"
                    ? "border-amber-500/40 bg-amber-500/15 text-amber-300"
                    : profile.role === "scout"
                    ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
                    : "border-white/10 bg-white/5 text-slate-300"
                }`}
              >
                {profile.role.toUpperCase()}
              </span>
            </dd>
          </div>

          {profile.createdAt && (
            <div className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-[#121921] border border-white/5">
              <dt className="text-xs font-bold text-slate-400">Accredited Since</dt>
              <dd className="text-xs font-mono text-slate-300">
                {new Date(profile.createdAt).toLocaleDateString()}
              </dd>
            </div>
          )}
        </dl>

        <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-xs leading-relaxed text-slate-300">
          <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
          <span>{ROLE_BLURB[profile.role]}</span>
        </div>

        {profile.role !== "user" && (
          <div className="pt-2">
            <Link
              href="/scout"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-emerald-500/15 hover:text-emerald-300 text-white border border-white/10 text-xs font-bold transition-all"
            >
              <ScrollText className="h-4 w-4" />
              <span>Open Scout Workspace →</span>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
