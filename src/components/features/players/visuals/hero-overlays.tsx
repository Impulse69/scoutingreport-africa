"use client";

import { useEffect, useState } from "react";
import { Activity, Compass, TrendingUp, Crosshair, Radio } from "lucide-react";

const HUB_SETS: { hubs: string[] }[] = [
  { hubs: ["Lagos", "Cairo", "Nairobi", "Casablanca"] },
  { hubs: ["Dakar", "Accra", "Addis Ababa", "Cape Town"] },
  { hubs: ["Kampala", "Tunis", "Algiers", "Maputo"] },
];

const SIGNAL_SETS: {
  label: string;
  icon: typeof TrendingUp;
  value: string;
  detail: string;
  delta: string;
}[] = [
  { label: "Talent Signal", icon: TrendingUp, value: "84.6", detail: "U-20 wingers", delta: "+12%" },
  { label: "Form Index", icon: Crosshair, value: "91.2", detail: "last 6 reports", delta: "+8%" },
  { label: "Edge Score", icon: Radio, value: "76.8", detail: "undervalued players", delta: "+5%" },
];

const CYCLE_MS = 4500;

export function HeroOverlays() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), CYCLE_MS);
    return () => clearInterval(id);
  }, []);

  const hubIdx = tick % HUB_SETS.length;
  const sigIdx = tick % SIGNAL_SETS.length;
  const hubs = HUB_SETS[hubIdx];
  const sig = SIGNAL_SETS[sigIdx];
  const SigIcon = sig.icon;

  return (
    <>
      {/* CONTINENTAL INTELLIGENCE pill — always-on */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-[11px] font-bold  tracking-wide text-muted-foreground">
        <Activity className="h-3.5 w-3.5 text-primary" />
        Continental Intelligence
      </div>

      {/* Active Hubs — fades between sets. Outer fixes position; inner animates. */}
      <div className="absolute bottom-6 right-2 sm:right-6 w-[220px] z-10">
        <div
          key={`hubs-${hubIdx}`}
          className="hero-fade rounded-xl border border-border bg-card p-4 text-muted-foreground"
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] font-bold  tracking-[0.2em] text-muted-foreground">
              <Compass className="h-3.5 w-3.5 text-primary" />
              Active Hubs
            </div>
            <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(6,182,212,0.9)]" />
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {hubs.hubs.map((hub) => (
              <div
                key={hub}
                className="rounded-md border border-border bg-muted/60 px-2.5 py-1.5"
              >
                <div className="text-[10px] font-semibold text-muted-foreground">{hub}</div>
                <div className="mt-1 h-0.5 overflow-hidden rounded-full bg-border">
                  <div className="h-full w-3/4 rounded-full bg-primary" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Talent / Form / Edge — fades between sets, positioned mid-left */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 sm:left-2 w-[200px] z-10">
        <div
          key={`sig-${sigIdx}`}
          className="hero-fade rounded-xl border border-border bg-card p-4 text-muted-foreground"
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[10px] font-bold  tracking-[0.18em] text-muted-foreground">
              <SigIcon className="h-3.5 w-3.5 text-primary" />
              {sig.label}
            </div>
            <span className="rounded bg-muted px-1.5 py-0.5 text-[9px] font-bold text-primary">
              {sig.delta}
            </span>
          </div>
          <div className="font-mono text-2xl font-semibold tabular-nums text-primary">
            {sig.value}
          </div>
          <div className="mt-1 text-[10px] font-medium text-muted-foreground">{sig.detail}</div>
        </div>
      </div>

      {/* Animation styles (.hero-fade + @keyframes hero-cycle) live in
          globals.css — styled-jsx blocks cause Turbopack to hang. */}
    </>
  );
}
