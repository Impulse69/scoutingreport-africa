import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

/**
 * Split layout: a plain informational panel on the left, the form on the right.
 *
 * The previous version claimed "200+ scouted African prodigies" and coverage
 * "across all 54 CAF national associations" — neither is true of the current
 * database. The panel now describes what the product does rather than asserting
 * a catalogue size.
 */
const POINTS = [
  "Structured reports covering technical, tactical, physical and mentality",
  "Every rating attributable to the scout who watched the match",
  "Private watchlists and notes for tracking players over time",
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Informational panel */}
      <div className="hidden w-1/2 flex-col justify-between border-r border-border bg-muted p-12 lg:flex">
        <Link href="/" className="inline-flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
            SR
          </span>
          <span className="text-sm font-semibold tracking-tight">
            ScoutingReport Africa
          </span>
        </Link>

        <div className="max-w-md space-y-6">
          <h2 className="text-3xl font-semibold tracking-tight">
            Scouting reports that travel inside a club.
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">
            A consistent, attributable written record behind African football
            talent — so a decision on a player in Kumasi rests on the same kind of
            evidence as one in Lisbon.
          </p>

          <ul className="space-y-3">
            {POINTS.map((point) => (
              <li key={point} className="flex items-start gap-2.5 text-sm">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span className="text-muted-foreground">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} ScoutingReport Africa
        </p>
      </div>

      {/* Form area */}
      <main className="flex flex-1 flex-col">
        <header className="sticky top-0 z-50 border-b border-border bg-background p-4 lg:hidden">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-xs font-semibold text-primary-foreground">
                SR
              </span>
              <span className="text-sm font-semibold">ScoutingReport Africa</span>
            </Link>
            <Link
              href="/"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Back to home
            </Link>
          </div>
        </header>

        <div className="flex flex-1 items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </main>
    </div>
  );
}
