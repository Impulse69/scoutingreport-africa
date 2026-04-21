import type { Metadata } from "next";

export const metadata: Metadata = { title: "Invite scout" };

export default function InviteScoutPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold tracking-tight">Invite a scout</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Send a magic-link invitation. Lands in Phase 2.
      </p>
    </div>
  );
}
