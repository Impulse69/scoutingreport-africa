import type { Metadata } from "next";

export const metadata: Metadata = { title: "Users" };

export default function AdminUsersPage() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold tracking-tight">Users</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        List users and manage roles. Lands in Phase 2.
      </p>
    </div>
  );
}
