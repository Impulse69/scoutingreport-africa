import type { Metadata } from "next";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold tracking-tight">About</h1>
      <div className="mt-8 space-y-4 text-muted-foreground">
        <p>
          ScoutingReport Africa is a scouting platform that publishes
          human-written, structured reports on footballers across African
          competitions — CAF continental tournaments, domestic leagues,
          women's football, and youth academies.
        </p>
        <p>
          Commercial scouting platforms rely on match-event APIs that cover a
          handful of top leagues well and everything else patchily. The gap
          between what those tools can tell you about a player from the
          Egyptian Premier League and what they can tell you about a 17-year-old
          in the Guinean second division is enormous. That gap is the point of
          this site.
        </p>
        <p>
          Every report follows the same 10-section template — player
          information, match context, technical/tactical/physical/mentality
          ratings, strengths, risks, and a final recruitment recommendation —
          so a report from any scout in any competition is comparable to any
          other.
        </p>
        <h2 className="pt-4 text-2xl font-semibold text-foreground">
          Scouts: get in touch
        </h2>
        <p>
          The platform is in early access and we are onboarding a founding
          group of scouts. To apply, email{" "}
          <a className="text-primary underline" href="mailto:hello@scoutingreport.africa">
            hello@scoutingreport.africa
          </a>{" "}
          with a sample report or a link to your prior work.
        </p>
      </div>
    </div>
  );
}
