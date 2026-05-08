import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
      <p className="mt-4 text-sm text-muted-foreground">Last updated: 2026-05-06</p>
      <div className="mt-8 space-y-4 text-muted-foreground leading-relaxed">
        <p>
          By using ScoutingReport Africa you agree to use the platform for
          lawful, professional football scouting and editorial purposes. You
          retain copyright in any reports you author; you grant us a
          non-exclusive licence to display them within the platform.
        </p>
        <p>
          The platform is provided &quot;as is&quot; with no warranty as to
          accuracy or fitness for any particular purpose. Recruitment decisions
          based on platform data are made at your own risk.
        </p>
        <p>
          We may suspend accounts that violate these terms, abuse the system,
          or attempt to scrape data outside the API rate limits.
        </p>
        <p>
          Questions:{" "}
          <a className="text-orange-500 underline" href="mailto:hello@scoutingreport.africa">
            hello@scoutingreport.africa
          </a>
          .
        </p>
      </div>
    </div>
  );
}
