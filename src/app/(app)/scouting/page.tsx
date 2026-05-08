import type { Metadata } from "next";
import { ClipboardCheck, Eye, FileText, Route } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = {
  title: "Scouting",
  description: "Structured workflows for live reports, player context, and recruitment decisions.",
};

const workflow = [
  {
    title: "Identify",
    description: "Find players through trusted regional coverage and clear role criteria.",
    icon: Eye,
  },
  {
    title: "Evaluate",
    description: "Capture technical, tactical, physical, and mentality notes in one report structure.",
    icon: ClipboardCheck,
  },
  {
    title: "Explain",
    description: "Turn observations into concise recruitment evidence that travels well inside a club.",
    icon: FileText,
  },
];

export default function ScoutingPage() {
  return (
    <div className="container mx-auto max-w-6xl px-6 py-8">
      <PageHeader
        eyebrow="Workflow"
        title="Scouting"
        description="A focused scouting surface for turning live observations into repeatable recruitment intelligence."
      />

      <section className="grid gap-4 md:grid-cols-3">
        {workflow.map((step) => (
          <article
            key={step.title}
            className="rounded-lg border border-border/60 bg-card/40 p-5"
          >
            <step.icon className="h-6 w-6 text-orange-500" />
            <h2 className="mt-4 text-lg font-semibold">{step.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {step.description}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-8 rounded-lg border border-border/60 bg-muted/30 p-6">
        <div className="flex gap-3">
          <Route className="mt-1 h-5 w-5 shrink-0 text-orange-500" />
          <div>
            <h2 className="font-semibold">Built For Regional Ground Truth</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              ScoutingReport Africa keeps the emphasis on human notes, role fit, and match context so clubs can separate highlight noise from durable player evidence.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
