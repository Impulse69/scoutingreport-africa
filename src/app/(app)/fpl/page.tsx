import type { Metadata } from "next";
import { CalendarDays, LineChart, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = {
  title: "FPL",
  description: "Fantasy football planning views for fixture context, player form, and squad decisions.",
};

const tools = [
  {
    title: "Fixture Lens",
    description: "Track upcoming runs and identify where form meets opportunity.",
    icon: CalendarDays,
  },
  {
    title: "Form Signals",
    description: "Separate sustainable output from short-term points swings.",
    icon: LineChart,
  },
  {
    title: "Risk Checks",
    description: "Balance minutes, role security, injury flags, and transfer timing.",
    icon: ShieldCheck,
  },
];

export default function FplPage() {
  return (
    <div className="container mx-auto max-w-6xl px-6 py-8">
      <PageHeader
        eyebrow="Fantasy"
        title="FPL"
        description="Fantasy football planning built around scouting context, role clarity, and fixture timing."
      />

      <section className="grid gap-4 md:grid-cols-3">
        {tools.map((tool) => (
          <article
            key={tool.title}
            className="rounded-lg border border-border/60 bg-card/40 p-5"
          >
            <tool.icon className="h-6 w-6 text-orange-500" />
            <h2 className="mt-4 text-lg font-semibold">{tool.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {tool.description}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-8 rounded-lg border border-border/60 bg-muted/30 p-6">
        <h2 className="font-semibold">Decision Board</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          Use the FPL space for shortlist planning, transfer timing, captaincy context, and player monitoring as fantasy features come online.
        </p>
      </section>
    </div>
  );
}
