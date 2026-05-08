import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

type SeedBody = {
  email?: string;
  password?: string;
  role?: "user" | "scout" | "admin";
  displayName?: string;
};

/**
 * Dev-only auth bypass. Creates a Supabase user with email already
 * confirmed (skipping the verification flow) and elevates them to a
 * given role. Hard-disabled in production.
 *
 * Required env: SUPABASE_SERVICE_ROLE_KEY (server-only, never NEXT_PUBLIC).
 *
 *   curl -XPOST http://localhost:3000/api/dev/seed-account \
 *     -H 'content-type: application/json' \
 *     -d '{"email":"scout@dev.local","password":"devpass123","role":"scout"}'
 */
export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return Response.json({ error: "Disabled in production" }, { status: 403 });
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!serviceKey || !url) {
    return Response.json(
      {
        error:
          "Missing SUPABASE_SERVICE_ROLE_KEY env var. Add it to .env.local — find it in Supabase dashboard → Project Settings → API.",
      },
      { status: 500 },
    );
  }

  let body: SeedBody;
  try {
    body = (await req.json()) as SeedBody;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const password = body.password ?? "";
  const role = body.role ?? "scout";

  if (!email || !/^.+@.+\..+$/.test(email)) {
    return Response.json({ error: "Invalid email" }, { status: 400 });
  }
  if (password.length < 6) {
    return Response.json({ error: "Password must be at least 6 chars" }, { status: 400 });
  }
  if (!["user", "scout", "admin"].includes(role)) {
    return Response.json({ error: "Invalid role" }, { status: 400 });
  }

  const admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Try to create — if already exists, fetch existing and update password + role
  let userId: string | null = null;

  const created = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      display_name: body.displayName?.trim() || email.split("@")[0],
    },
  });

  if (created.error) {
    if (
      created.error.message.toLowerCase().includes("already") ||
      created.error.message.toLowerCase().includes("registered")
    ) {
      // User exists — find them and update
      const list = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
      const existing = list.data?.users.find((u) => u.email === email);
      if (!existing) {
        return Response.json(
          { error: "User exists but lookup failed. Try a different email." },
          { status: 500 },
        );
      }
      userId = existing.id;
      const upd = await admin.auth.admin.updateUserById(existing.id, {
        password,
        email_confirm: true,
      });
      if (upd.error) {
        return Response.json({ error: upd.error.message }, { status: 500 });
      }
    } else {
      return Response.json({ error: created.error.message }, { status: 500 });
    }
  } else if (created.data?.user) {
    userId = created.data.user.id;
  }

  if (!userId) {
    return Response.json({ error: "Failed to resolve user id" }, { status: 500 });
  }

  // Elevate role on profiles row (auto-created by trigger).
  // Wait briefly for the trigger to fire.
  await new Promise((r) => setTimeout(r, 150));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: profErr } = await (admin as any)
    .from("profiles")
    .update({ role })
    .eq("id", userId);

  if (profErr) {
    return Response.json(
      { error: `User created but role update failed: ${profErr.message}` },
      { status: 500 },
    );
  }

  return Response.json({
    ok: true,
    userId,
    email,
    role,
    message: `Account ready. Sign in with ${email} / ${password}.`,
  });
}
