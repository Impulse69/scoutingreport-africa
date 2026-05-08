import type { Metadata } from "next";
import { Trophy, MapPin, BarChart3 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = {
  title: "Leagues",
  description: "Track African football competitions, club context, and league-level scouting signals.",
};

const leagueRegions = [
  {
    name: "North Africa",
    detail: "Egypt, Morocco, Tunisia, Algeria, and Libya",
    signal: "Senior-ready profiles with continental tournament experience.",
  },
  {
    name: "West Africa",
    detail: "Nigeria, Ghana, Ivory Coast, Senegal, and Mali",
    signal: "High-output academies and fast-moving domestic transfer pathways.",
  },
  {
    name: "East & Southern Africa",
    detail: "Kenya, Tanzania, South Africa, Zambia, and beyond",
    signal: "Emerging leagues with rising club infrastructure and resale upside.",
  },
];

export default function LeaguesPage() {
  return (
    <div className="container mx-auto max-w-6xl px-6 py-8">
      <PageHeader
        eyebrow="Coverage"
        title="Leagues"
        description="League intelligence for scouts who need to understand the competition around the player, not just the profile in isolation."
      />

      <section className="grid gap-4 md:grid-cols-3">
        {leagueRegions.map((region) => (
          <article
            key={region.name}
            className="rounded-lg border border-border/60 bg-card/40 p-5"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-orange-500/10 text-orange-500">
              <MapPin className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold">{region.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{region.detail}</p>
            <p className="mt-4 text-sm leading-6">{region.signal}</p>
          </article>
        ))}
      </section>

      <section className="mt-8 grid gap-4 rounded-lg border border-border/60 bg-muted/30 p-5 md:grid-cols-2">
        <div className="flex gap-3">
          <Trophy className="mt-1 h-5 w-5 shrink-0 text-orange-500" />
          <div>
            <h2 className="font-semibold">Competition Context</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Compare league strength, travel demands, age profiles, and club development environments.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <BarChart3 className="mt-1 h-5 w-5 shrink-0 text-orange-500" />
          <div>
            <h2 className="font-semibold">Scouting Signals</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Prioritize markets with the clearest pathway from domestic performance to senior recruitment.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
