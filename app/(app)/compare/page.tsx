import type { Metadata } from "next";
import { Scale } from "lucide-react";

export const metadata: Metadata = { title: "Compare players" };

export default function ComparePickerPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Compare players</h1>
      <p className="mt-2 text-muted-foreground">
        Pick two scouted players to see their ratings side-by-side.
      </p>
      <div className="mt-10 rounded-lg border border-dashed bg-muted/20 p-12 text-center">
        <Scale className="mx-auto h-8 w-8 text-muted-foreground" />
        <p className="mt-3 font-medium">Comparison coming online soon</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Once the first scout reports are published, you'll be able to compare
          any two players on a radar chart.
        </p>
      </div>
    </div>
  );
}
