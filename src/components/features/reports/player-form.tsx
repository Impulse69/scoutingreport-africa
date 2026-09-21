"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Save, Globe, EyeOff, ScrollText } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CAF_COUNTRIES,
  POSITIONS,
  PREFERRED_FEET,
  type PlayerStatus,
  type PreferredFoot,
} from "@/lib/shared/constants";
import {
  createPlayer,
  updatePlayer,
  setPlayerStatus,
} from "@/lib/features/players/actions";
import type { CompetitionOption } from "@/lib/features/reports/queries";
import type { ClubOption } from "@/lib/features/clubs/queries";

export type PlayerFormValues = {
  id: string;
  slug: string;
  status: PlayerStatus;
  full_name: string;
  common_name: string | null;
  date_of_birth: string;
  nationality_code: string;
  primary_position_code: string;
  preferred_foot: PreferredFoot;
  height_cm: number | null;
  weight_kg: number | null;
  current_club_id: string | null;
  current_competition_id: string | null;
  secondary_position_codes: string[];
  photo_url: string | null;
  bio: string | null;
};

type Props = (
  | { mode: "create"; defaultName?: string; initial?: undefined }
  | { mode: "edit"; initial: PlayerFormValues; defaultName?: undefined }
) & { clubs: ClubOption[]; competitions: CompetitionOption[] };

/**
 * Single form for both creating and editing a player. Edit mode adds
 * publish/unpublish, without which a player saved as a draft could never reach
 * the public roster.
 */
export function PlayerForm(props: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();

  const init = props.mode === "edit" ? props.initial : null;

  const [fullName, setFullName] = useState(init?.full_name ?? props.defaultName ?? "");
  const [commonName, setCommonName] = useState(init?.common_name ?? "");
  const [dob, setDob] = useState(init?.date_of_birth ?? "");
  const [nat, setNat] = useState(init?.nationality_code ?? "");
  const [pos, setPos] = useState(init?.primary_position_code ?? "");
  const [foot, setFoot] = useState<PreferredFoot>(init?.preferred_foot ?? "unknown");
  const [height, setHeight] = useState(init?.height_cm ? String(init.height_cm) : "");
  const [weight, setWeight] = useState(init?.weight_kg ? String(init.weight_kg) : "");
  const [clubId, setClubId] = useState(init?.current_club_id ?? "");
  const [competitionId, setCompetitionId] = useState(
    init?.current_competition_id ?? "",
  );
  const [bio, setBio] = useState(init?.bio ?? "");
  const [status, setStatusLocal] = useState<PlayerStatus>(init?.status ?? "draft");

  const incomplete = !fullName || !dob || !nat || !pos;

  const payload = (nextStatus: PlayerStatus) => ({
    full_name: fullName.trim(),
    common_name: commonName.trim() || null,
    date_of_birth: dob,
    nationality_code: nat as never, // zod enforces enum membership server-side
    primary_position_code: pos as never,
    secondary_position_codes: init?.secondary_position_codes ?? [],
    preferred_foot: foot,
    height_cm: height ? Number.parseInt(height, 10) : null,
    weight_kg: weight ? Number.parseInt(weight, 10) : null,
    current_club_id: clubId || null,
    current_competition_id: competitionId || null,
    photo_url: init?.photo_url ?? null,
    bio: bio.trim() || null,
    status: nextStatus,
  });

  const save = (nextStatus: PlayerStatus, thenReport: boolean) =>
    start(async () => {
      if (props.mode === "create") {
        const res = await createPlayer(payload(nextStatus));
        if ("error" in res) {
          toast.error(res.error);
          return;
        }
        toast.success(
          nextStatus === "published" ? "Player published" : "Player saved as draft",
        );
        router.push(
          thenReport ? `/scout/reports/new?player=${res.id}` : `/players/${res.slug}`,
        );
        return;
      }

      const res = await updatePlayer(props.initial.id, payload(nextStatus));
      if ("error" in res) {
        toast.error(res.error);
        return;
      }
      setStatusLocal(nextStatus);
      toast.success("Changes saved");
      router.push(`/players/${res.slug}`);
      router.refresh();
    });

  const togglePublished = () =>
    start(async () => {
      if (props.mode !== "edit") return;
      const next: PlayerStatus = status === "published" ? "draft" : "published";
      const res = await setPlayerStatus(props.initial.id, next);
      if ("error" in res) {
        toast.error(res.error);
        return;
      }
      setStatusLocal(next);
      toast.success(next === "published" ? "Player published" : "Moved back to draft");
      router.refresh();
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
              {POSITIONS.map((p) => (
                <SelectItem key={p.code} value={p.code}>
                  {p.name} ({p.code})
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
          <Select
            value={clubId || "unassigned"}
            onValueChange={(value) =>
              setClubId(value === "unassigned" ? "" : (value ?? ""))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a verified club" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unassigned">Free agent / not assigned</SelectItem>
              {props.clubs.map((club) => (
                <SelectItem key={club.id} value={club.id}>
                  {club.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {props.clubs.length === 0 && (
            <p className="mt-1 text-xs text-muted-foreground">
              No verified club records are available.
            </p>
          )}
        </Field>
        <Field label="Current competition" full>
          <Select
            value={competitionId || "unassigned"}
            onValueChange={(value) =>
              setCompetitionId(value === "unassigned" ? "" : (value ?? ""))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a verified competition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unassigned">Not assigned</SelectItem>
              {props.competitions.map((competition) => (
                <SelectItem key={competition.id} value={competition.id}>
                  {competition.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {props.competitions.length === 0 && (
            <p className="mt-1 text-xs text-muted-foreground">
              No verified competition records are available.
            </p>
          )}
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

      <div className="sticky bottom-0 z-30 flex flex-wrap items-center gap-3 border-t border-border bg-background px-4 py-3">
        <p className="text-xs text-muted-foreground">
          {props.mode === "create" ? (
            "Adding a new player"
          ) : (
            <>
              Editing ·{" "}
              <span
                className={
                  status === "published" ? "text-primary" : "text-muted-foreground"
                }
              >
                {status}
              </span>
            </>
          )}
        </p>
        <div className="flex-1" />

        {props.mode === "edit" ? (
          <>
            <Button
              type="button"
              variant="outline"
              disabled={pending}
              onClick={togglePublished}
            >
              {status === "published" ? (
                <>
                  <EyeOff className="mr-1.5 h-3.5 w-3.5" />
                  Unpublish
                </>
              ) : (
                <>
                  <Globe className="mr-1.5 h-3.5 w-3.5" />
                  Publish
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={pending}
              onClick={() => router.push(`/scout/reports/new?player=${props.initial.id}`)}
            >
              <ScrollText className="mr-1.5 h-3.5 w-3.5" />
              New report
            </Button>
            <Button
              type="button"
              disabled={pending || incomplete}
              onClick={() => save(status, false)}
            >
              <Save className="mr-1.5 h-3.5 w-3.5" />
              Save changes
            </Button>
          </>
        ) : (
          <>
            <Button
              type="button"
              variant="outline"
              disabled={pending || incomplete}
              onClick={() => save("draft", true)}
            >
              <Save className="mr-1.5 h-3.5 w-3.5" />
              Save draft
            </Button>
            <Button
              type="button"
              disabled={pending || incomplete}
              onClick={() => save("published", true)}
            >
              <UserPlus className="mr-1.5 h-3.5 w-3.5" />
              Publish & start report
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-border bg-card">
      <header className="border-b border-border px-5 py-3.5">
        <h2 className="text-base font-semibold text-foreground">
          {title}
        </h2>
      </header>
      <div className="grid gap-4 p-5 md:grid-cols-2">{children}</div>
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
      <Label className="mb-1.5">
        {label}
      </Label>
      {children}
    </div>
  );
}
