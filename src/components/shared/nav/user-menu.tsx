"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { createClient } from "@/lib/core/supabase/client";
import type { ProfileRole } from "@/lib/shared/constants";

export type UserMenuProps = {
  email: string | null;
  displayName: string | null;
  role: ProfileRole;
};

export function UserMenu({ email, displayName, role }: UserMenuProps) {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
    router.push("/");
  }

  const initials = (displayName ?? email ?? "?")
    .split(/\s+/)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="rounded-full" />}>
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {displayName ?? "Signed in"}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {email}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
                {role}
              </p>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/watchlists" />}>
          My watchlists
        </DropdownMenuItem>
        {(role === "scout" || role === "admin") && (
          <DropdownMenuItem render={<Link href="/scout/dashboard" />}>
            Scout dashboard
          </DropdownMenuItem>
        )}
        {role === "admin" && (
          <DropdownMenuItem render={<Link href="/admin/dashboard" />}>
            Admin dashboard
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
