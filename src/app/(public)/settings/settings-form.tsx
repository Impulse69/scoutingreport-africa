"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateMyProfile } from "@/lib/features/profile/actions";

export function SettingsForm({
  initialDisplayName,
  initialBio,
}: {
  initialDisplayName: string;
  initialBio: string;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [bio, setBio] = useState(initialBio);

  const dirty = displayName !== initialDisplayName || bio !== initialBio;

  const submit = () =>
    start(async () => {
      const res = await updateMyProfile({ displayName, bio });
      if ("error" in res) {
        toast.error(res.error);
        return;
      }
      toast.success("Scout profile updated");
      router.refresh();
    });

  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="display-name"
          className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400"
        >
          Scout Display Name
        </label>
        <input
          id="display-name"
          value={displayName}
          maxLength={80}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="e.g. Chief Scout - West Africa Desk"
          className="w-full h-11 px-4 rounded-xl border border-white/10 bg-[#121921] text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
        />
      </div>

      <div>
        <label
          htmlFor="bio"
          className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400"
        >
          Scouting Focus & Regions
        </label>
        <textarea
          id="bio"
          rows={3}
          value={bio}
          maxLength={500}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Describe your regional coverage (e.g. WAFU tournaments, Nigeria NPFL, Senegal Ligue 1, U20 tournaments)..."
          className="w-full p-4 rounded-xl border border-white/10 bg-[#121921] text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
        />
        <p className="mt-1 text-right text-[10px] text-slate-500 font-mono">
          {bio.length} / 500 characters
        </p>
      </div>

      <button
        type="button"
        onClick={submit}
        disabled={pending || !dirty}
        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 text-xs font-black uppercase tracking-wider shadow-md shadow-emerald-500/20 disabled:opacity-50 transition-all flex items-center gap-1.5"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        <span>Save Changes</span>
      </button>
    </div>
  );
}
