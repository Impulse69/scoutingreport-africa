"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
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
      toast.success("Profile updated");
      router.refresh();
    });

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="display-name" className="block text-sm font-medium">
          Display name
        </label>
        <Input
          id="display-name"
          value={displayName}
          maxLength={80}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Shown as the author on your reports"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="bio" className="block text-sm font-medium">
          Bio
        </label>
        <Textarea
          id="bio"
          rows={3}
          value={bio}
          maxLength={500}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Where you scout and which competitions you cover."
        />
        <p className="text-right text-xs tabular-nums text-muted-foreground">
          {bio.length}/500
        </p>
      </div>

      <Button type="button" onClick={submit} disabled={pending || !dirty}>
        {pending ? (
          <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
        ) : (
          <Save className="mr-1.5 h-4 w-4" />
        )}
        Save changes
      </Button>
    </div>
  );
}
