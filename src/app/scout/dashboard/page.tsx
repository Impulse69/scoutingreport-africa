import type { Metadata } from "next";
import Link from "next/link";
import { FileText, UserPlus, FileEdit, Archive } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/shared/utils";

export const metadata: Metadata = { title: "Scout dashboard" };

export default function ScoutDashboardPage() {
  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Scout Workspace</h1>
        <p className="mt-2 text-muted-foreground">
          Create new player scout reports and manage your existing portfolio.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Quick Actions */}
        <Link href="/scout/reports/new" className="group">
          <Card className="h-full border-2 border-dashed bg-transparent transition-all hover:bg-stone-50 dark:hover:bg-stone-900 hover:border-orange-500/50">
            <CardHeader className="flex flex-col items-center justify-center h-full text-center py-10 space-y-4">
              <div className="rounded-full bg-orange-100 p-4 text-orange-600 group-hover:scale-110 transition-transform">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <CardTitle className="text-lg">New Report</CardTitle>
                <CardDescription className="mt-1">Evaluate a player</CardDescription>
              </div>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/scout/players/new" className="group">
          <Card className="h-full border-2 border-dashed bg-transparent transition-all hover:bg-stone-50 dark:hover:bg-stone-900 hover:border-stone-400/50">
            <CardHeader className="flex flex-col items-center justify-center h-full text-center py-10 space-y-4">
              <div className="rounded-full bg-stone-100 p-4 text-stone-600 group-hover:scale-110 transition-transform">
                <UserPlus className="w-8 h-8" />
              </div>
              <div>
                <CardTitle className="text-lg">Add Player</CardTitle>
                <CardDescription className="mt-1">Add to database</CardDescription>
              </div>
            </CardHeader>
          </Card>
        </Link>
        
        {/* Placeholder stats */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-2 bg-stone-900 text-stone-50 overflow-hidden relative">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-orange-600/20 rounded-full blur-3xl opacity-50 pointer-events-none" />
          <CardHeader>
            <CardTitle className="text-stone-50">Overview</CardTitle>
            <CardDescription className="text-stone-400">Your reporting activity this month</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-4xl font-black text-white">0</span>
              <p className="text-xs text-stone-400 font-mono uppercase tracking-wider">Drafts</p>
            </div>
            <div className="space-y-1">
              <span className="text-4xl font-black text-white">0</span>
              <p className="text-xs text-stone-400 font-mono uppercase tracking-wider">Published</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="pt-8 border-t">
        <h2 className="text-xl font-bold mb-4">Recent Drafts</h2>
        <Card className="flex flex-col items-center justify-center py-16 text-center shadow-none bg-stone-50/50">
           <Archive className="w-12 h-12 text-stone-300 mb-4" />
           <h3 className="text-stone-600 font-medium">No drafts found</h3>
           <p className="text-sm text-stone-400 mt-1 max-w-sm">You don't have any in-progress reports. Start a new evaluation to see it here.</p>
           <Link href="/scout/reports/new" className={cn(buttonVariants({ variant: "outline" }), "mt-6")}>
             Start a Report
           </Link>
        </Card>
      </div>

    </div>
  );
}
