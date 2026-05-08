"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Save } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CAF_COUNTRIES,
  POSITION_CODES,
  PREFERRED_FEET,
  type PreferredFoot,
} from "@/lib/shared/constants";
import { createPlayer } from "@/lib/features/players/actions";

export function PlayerCreateForm({ defaultName = "" }: { defaultName?: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  const [fullName, setFullName] = useState(defaultName);
  const [commonName, setCommonName] = useState("");
  const [dob, setDob] = useState("");
  const [nat, setNat] = useState("");
  const [pos, setPos] = useState("");
  const [foot, setFoot] = useState<PreferredFoot>("unknown");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [club, setClub] = useState("");
  const [bio, setBio] = useState("");

  const submit = (status: "draft" | "published") =>
    start(async () => {
      const res = await createPlayer({
        full_name: fullName.trim(),
        common_name: commonName.trim() || null,
        date_of_birth: dob,
        nationality_code: nat as never, // zod enforces enum membership
        primary_position_code: pos as never,
        secondary_position_codes: [],
        preferred_foot: foot,
        height_cm: height ? Number.parseInt(height, 10) : null,
        weight_kg: weight ? Number.parseInt(weight, 10) : null,
        current_club: club.trim() || null,
        current_competition_id: null,
        photo_url: null,
        bio: bio.trim() || null,
        status,
      });
      if ("error" in res) {
        toast.error(res.error);
        return;
      }
      toast.success(status === "published" ? "Player published" : "Player saved as draft");
      // Send the scout straight into a new report on this player.
      router.push(`/scout/reports/new?player=${res.id}`);
    });

  return (
    <div className="space-y-6">
      <Section title="Identity">
        <Field label="Full name" full>
          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="As registered (e.g. Mohamed Salah Hamed Mahrous Ghaly)"
            required
          />
        </Field>
        <Field label="Common name (optional)">
          <Input
            value={commonName}
            onChange={(e) => setCommonName(e.target.value)}
            placeholder="e.g. Mo Salah"
          />
        </Field>
        <Field label="Date of birth">
          <Input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            required
          />
        </Field>
      </Section>

      <Section title="Nationality & position">
        <Field label="Nationality">
          <Select value={nat || undefined} onValueChange={(v) => setNat(v ?? "")}>
            <SelectTrigger>
              <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent>
              {CAF_COUNTRIES.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.flagEmoji} {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Primary position">
          <Select value={pos || undefined} onValueChange={(v) => setPos(v ?? "")}>
            <SelectTrigger>
              <SelectValue placeholder="Position" />
            </SelectTrigger>
            <SelectContent>
              {POSITION_CODES.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Preferred foot">
          <Select
            value={foot}
            onValueChange={(v) => setFoot((v ?? "unknown") as PreferredFoot)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PREFERRED_FEET.map((f) => (
                <SelectItem key={f} value={f} className="capitalize">
                  {f}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </Section>

      <Section title="Physical & club">
        <Field label="Height (cm)">
          <Input
            type="number"
            min={140}
            max={220}
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="180"
          />
        </Field>
        <Field label="Weight (kg)">
          <Input
            type="number"
            min={40}
            max={120}
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="75"
          />
        </Field>
        <Field label="Current club" full>
          <Input
            value={club}
            onChange={(e) => setClub(e.target.value)}
            placeholder="e.g. Al Ahly · Egyptian Premier League"
          />
        </Field>
        <Field label="Short bio (optional)" full>
          <Textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="One paragraph — academy, breakthrough, current role."
          />
        </Field>
      </Section>

      <div className="sticky bottom-4 z-30 flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-[#0E0E0E]/95 px-4 py-3 shadow-2xl backdrop-blur">
        <p className="font-mono text-[11px] text-zinc-500">Adding a new player</p>
        <div className="flex-1" />
        <Button
          type="button"
          variant="outline"
          disabled={pending || !fullName || !dob || !nat || !pos}
          onClick={() => submit("draft")}
        >
          <Save className="mr-1.5 h-3.5 w-3.5" />
          Save draft
        </Button>
        <Button
          type="button"
          disabled={pending || !fullName || !dob || !nat || !pos}
          onClick={() => submit("published")}
          className="bg-orange-600 hover:bg-orange-700"
        >
          <UserPlus className="mr-1.5 h-3.5 w-3.5" />
          Publish & start report
        </Button>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-white/5 bg-[#0E0E0E]">
      <header className="border-b border-white/5 px-6 py-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-orange-500">
          {title}
        </p>
      </header>
      <div className="grid gap-4 px-6 py-5 md:grid-cols-2">{children}</div>
    </section>
  );
}

function Field({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-zinc-500">
        {label}
      </label>
      {children}
    </div>
  );
}
