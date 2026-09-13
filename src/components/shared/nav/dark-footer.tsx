import Link from "next/link";

export function DarkFooter() {
  return (
    <footer className="border-t border-border bg-background text-xs text-muted-foreground">
      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
                SR
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold tracking-tight text-foreground">
                  ScoutingReport Africa
                </span>
                <span className="text-xs text-muted-foreground">
                  African football scouting platform
                </span>
              </div>
            </div>

            <p className="max-w-sm text-sm leading-6 text-muted-foreground">
              Structured scout reports, player profiles, and watchlists for
              African football recruitment.
            </p>
          </div>

          <FooterColumn
            title="Players"
            links={[
              ["Players", "/players"],
              ["Forwards", "/players?pos=FWD"],
              ["Midfielders", "/players?pos=MID"],
              ["Defenders", "/players?pos=DEF"],
              ["Goalkeepers", "/players?pos=GK"],
            ]}
          />
          <FooterColumn
            title="Scout"
            links={[
              ["Leagues", "/leagues"],
              ["Scout", "/scout"],
              ["Scouting", "/scouting"],
              ["Watchlists", "/watchlists"],
              ["FPL", "/fpl"],
            ]}
          />
          <FooterColumn
            title="Platform"
            links={[
              ["Dashboard", "/dashboard"],
              ["About", "/about"],
              ["Terms", "/terms"],
              ["Privacy", "/privacy"],
              ["Cookies", "/cookies"],
            ]}
          />
        </div>
      </div>

      <div className="border-t border-border bg-muted py-5">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-6 text-xs text-muted-foreground sm:flex-row">
          <div>
            © {new Date().getFullYear()} ScoutingReport Africa. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-primary">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-primary">
              Privacy
            </Link>
            <Link href="/scout" className="text-primary hover:underline">
              Scout
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: [label: string, href: string][];
}) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      <ul className="space-y-2">
        {links.map(([label, href]) => (
          <li key={`${label}-${href}`}>
            <Link href={href} className="hover:text-primary">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
