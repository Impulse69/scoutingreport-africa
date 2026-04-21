"use client";

import * as React from "react";
import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

// ─── Glass Primitives ─────────────────────────────────────────────

export function GlassCard({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-none border-2 border-stone-200 bg-white shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

export function GlassField({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-none border-2 border-stone-200 bg-stone-50",
        "focus-within:border-orange-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-orange-500/20",
        "transition-colors",
        className
      )}
    >
      {children}
    </div>
  );
}

export function FieldLabel({ children, hint, optional }: { children: React.ReactNode; hint?: string; optional?: boolean }) {
  return (
    <div className="mb-2 flex items-baseline justify-between">
      <Label className="text-[13px] font-medium tracking-tight text-stone-700">
        {children}
        {optional && <span className="ml-1.5 font-mono text-[10px] uppercase tracking-widest text-stone-400">optional</span>}
      </Label>
      {hint && <span className="text-[12px] text-stone-400">{hint}</span>}
    </div>
  );
}

// ─── Interactive Components ───────────────────────────────────────

export function StarRow({ label, value = 0, onChange }: { label: string; value?: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0);
  const display = hover || value;
  return (
    <div className="group flex items-center justify-between rounded-none px-4 py-3 transition-colors hover:bg-orange-500/5 border-b border-stone-100 last:border-0">
      <span className="truncate text-[14px] font-medium text-stone-800">{label}</span>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onMouseEnter={() => setHover(n)}
              onClick={() => onChange(n === value ? 0 : n)}
              className="p-0.5 focus:outline-none"
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
            >
              <Star
                className={cn(
                  "h-[22px] w-[22px] transition-transform",
                  n <= display ? "fill-orange-600 text-orange-600" : "text-stone-300",
                  hover > 0 && n <= hover && "scale-110"
                )}
              />
            </button>
          ))}
        </div>
        <span className={cn("w-6 text-right font-mono text-[11px] tabular-nums font-bold", value ? "text-orange-700" : "text-stone-300")}>
          {value ? value.toFixed(1) : "—"}
        </span>
      </div>
    </div>
  );
}

export function Pills<T extends string>({
  options, value, onChange, multi = false, dense = false,
}: {
  options: readonly T[] | T[];
  value: T | T[] | null | undefined;
  onChange: (v: any) => void;
  multi?: boolean;
  dense?: boolean;
}) {
  const isSel = (o: T) => (multi ? (value as T[] | undefined)?.includes(o) : value === o);
  const toggle = (o: T) => {
    if (multi) {
      const arr = (value as T[] | undefined) ?? [];
      onChange(arr.includes(o) ? arr.filter((x) => x !== o) : [...arr, o]);
    } else {
      onChange(o === (value as T | null | undefined) ? null : o);
    }
  };
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => toggle(o)}
          className={cn(
            "rounded-none border-2 transition-all active:scale-[0.97] font-medium",
            dense ? "px-3 py-1.5 text-[12px]" : "px-3.5 py-2 text-[13px]",
            isSel(o)
              ? "border-stone-900 bg-stone-900 text-white"
              : "border-stone-200 bg-stone-50 text-stone-700 hover:border-orange-500 hover:bg-orange-50 hover:text-orange-800"
          )}
        >
          {isSel(o) && multi && <span className="mr-1.5 font-mono text-[10px] opacity-80">✓</span>}
          {o}
        </button>
      ))}
    </div>
  );
}

export function StepFrame({ stepNum, count, totalSteps, title, hint, children }: {
  stepNum: string; count: number; totalSteps: number; title: string; hint: string; children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-2.5">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] font-bold text-orange-700/80">Section {stepNum}</span>
          <span className="h-px w-8 bg-stone-300" />
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500 font-bold">
            {count} of {totalSteps}
          </span>
        </div>
        <h2 className="text-[34px] font-semibold leading-[1.05] tracking-tight text-stone-900">{title}</h2>
        <p className="mt-2 text-[15px] text-stone-500">{hint}</p>
      </div>
      {children}
    </div>
  );
}

export function ProgressRail({ stepIndex, steps, onJump }: { 
  stepIndex: number; 
  steps: readonly { id: string; n: string; label: string; hint: string }[];
  onJump: (i: number) => void 
}) {
  const pct = ((stepIndex + 1) / steps.length) * 100;
  return (
    <div>
      <div className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500">Progress</span>
          <span className="font-mono text-[11px] tabular-nums font-bold text-stone-400">
            {String(stepIndex + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
          </span>
        </div>
        <span className="font-mono text-[11px] tabular-nums font-bold text-orange-700">{Math.round(pct)}%</span>
      </div>
      <div className="relative h-1 overflow-hidden rounded-none bg-stone-200">
        <div
          className="absolute inset-y-0 left-0 bg-orange-600 transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-5 grid grid-cols-4 md:grid-cols-8 gap-2">
        {steps.map((s, i) => {
          const done = i < stepIndex;
          const active = i === stepIndex;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onJump(i)}
              className={cn("group text-left transition-all", active ? "" : "opacity-70 hover:opacity-100")}
            >
              <div className={cn(
                "mb-1.5 font-mono text-[10px] tracking-wider font-bold",
                active ? "text-orange-700" : done ? "text-stone-500" : "text-stone-400"
              )}>
                {done ? "✓ " : ""}{s.n}
              </div>
              <div className={cn(
                "text-[12px] font-medium leading-tight",
                active ? "text-stone-900" : "text-stone-500 group-hover:text-stone-800"
              )}>
                {s.label}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
