"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Lock, Save, Trash2, Check } from "lucide-react";
import { toast } from "sonner";
import {
  saveMyNoteForPlayer,
  deleteMyNoteForPlayer,
} from "@/lib/features/notes/actions";

type Props = {
  playerSlug: string;
  signedIn: boolean;
  initialNotes: string;
  initialUpdatedAt: string;
};

export function ScoutNotes({
  playerSlug,
  signedIn,
  initialNotes,
  initialUpdatedAt,
}: Props) {
  const [value, setValue] = useState(initialNotes);
  const [updatedAt, setUpdatedAt] = useState(initialUpdatedAt);
  const [savedFlash, setSavedFlash] = useState(false);
  const [pending, start] = useTransition();

  if (!signedIn) {
    return (
      <section className="rounded-xl border border-border bg-card">
        <header className="border-b border-border px-6 py-4 flex items-center gap-2">
          <Lock className="h-3.5 w-3.5 text-primary" />
          <p className="text-xs font-medium text-muted-foreground">
            Scout Notes — sign in required
          </p>
        </header>
        <div className="relative px-6 py-10 text-center">
          {/* Faded mock textarea behind the gate */}
          <div className="pointer-events-none mx-auto max-w-md select-none rounded-md border border-border bg-muted px-3 py-3 text-left text-xs text-muted-foreground opacity-60">
            Add your private scouting notes — fitness flags, video links, agent
            contact, recruiter recommendations…
          </div>
          <div className="mt-6 space-y-3">
            <p className="text-sm text-muted-foreground">
              Private notes are locked to authenticated scouts.
            </p>
            <p className="mx-auto max-w-md text-sm text-muted-foreground">
              Create an account to keep personal observations on every player you
              scout. Your notes are visible only to you and stored in your
              private workspace.
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <Link
                href={`/auth/sign-up?next=/players/${playerSlug}`}
                className="rounded-md bg-primary px-4 py-2 text-sm  tracking-normal text-primary-foreground hover:bg-accent transition-colors"
              >
                Create account
              </Link>
              <Link
                href={`/auth/sign-in?next=/players/${playerSlug}`}
                className="rounded-md border border-border bg-muted px-4 py-2 text-sm  tracking-normal text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const onSave = () => {
    start(async () => {
      const res = await saveMyNoteForPlayer(playerSlug, value);
      if ("error" in res) {
        toast.error(res.error);
      } else {
        setUpdatedAt(res.updatedAt);
        setSavedFlash(true);
        setTimeout(() => setSavedFlash(false), 1500);
        toast.success("Notes saved");
      }
    });
  };

  const onDelete = () => {
    if (!value && !initialNotes) return;
    if (!confirm("Delete your notes for this player? This can't be undone.")) return;
    start(async () => {
      const res = await deleteMyNoteForPlayer(playerSlug);
      if ("error" in res) {
        toast.error(res.error);
      } else {
        setValue("");
        setUpdatedAt("");
        toast.success("Notes deleted");
      }
    });
  };

  return (
    <section className="rounded-xl border border-border bg-card">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <p className="text-xs font-medium text-muted-foreground">
            Scout Notes — private to you
          </p>
          {updatedAt ? (
            <p className="mt-0.5 text-xs text-muted-foreground">
              Last saved {new Date(updatedAt).toLocaleString()}
            </p>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={pending}
            onClick={onDelete}
            className="rounded border border-border bg-muted px-2.5 py-1 text-xs  text-muted-foreground hover:bg-muted transition-colors disabled:opacity-40"
          >
            <Trash2 className="mr-1 inline h-3 w-3" />
            Delete
          </button>
          <button
            type="button"
            disabled={pending || value === initialNotes}
            onClick={onSave}
            className="rounded border border-border bg-muted px-2.5 py-1 text-xs  text-primary hover:bg-primary/20 transition-colors disabled:opacity-40"
          >
            {savedFlash ? (
              <>
                <Check className="mr-1 inline h-3 w-3" />
                Saved
              </>
            ) : pending ? (
              "Saving…"
            ) : (
              <>
                <Save className="mr-1 inline h-3 w-3" />
                Save
              </>
            )}
          </button>
        </div>
      </header>
      <div className="px-6 py-4">
        <textarea
          rows={5}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Add your private scouting notes — fitness flags, video links, agent contact, recruiter recommendations…"
          maxLength={2000}
          className="w-full resize-none rounded-md border border-border bg-muted px-3 py-2 text-sm text-muted-foreground placeholder:text-muted-foreground focus:border-border focus:outline-none"
        />
        <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
          <span>Private — only visible to you.</span>
          <span>{value.length} / 2000</span>
        </div>
      </div>
    </section>
  );
}
