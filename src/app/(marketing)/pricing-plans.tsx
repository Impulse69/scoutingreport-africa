"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Sparkles, Shield, Zap } from "lucide-react";
import { useTranslations } from "next-intl";

type Plan = {
  key: "starter" | "pro" | "enterprise";
  monthly: number | "custom";
  yearly: number | "custom";
  features: string[];
  cta: { href: string };
  badge?: string;
  highlight?: boolean;
};

const PLANS: Plan[] = [
  {
    key: "starter",
    monthly: 0,
    yearly: 0,
    features: ["basicSearch", "topLeagues", "standardStats", "communitySupport"],
    cta: { href: "/auth/sign-up" },
    badge: "Free Explorer",
  },
  {
    key: "pro",
    monthly: 49,
    yearly: 39,
    features: ["advancedMetrics", "globalLeagues", "heatmaps", "videoHighlights", "prioritySupport"],
    cta: { href: "/auth/sign-up?plan=pro" },
    badge: "Professional Scout",
    highlight: true,
  },
  {
    key: "enterprise",
    monthly: "custom",
    yearly: "custom",
    features: ["apiAccess", "rawFeeds", "customIntegration", "accountManager", "sla"],
    cta: {
      href: "mailto:hello@scoutingreport.africa?subject=Enterprise%20Club%20Inquiry",
    },
    badge: "Club & Agency",
  },
];

export function PricingPlans() {
  const t = useTranslations("pricing");
  const [yearly, setYearly] = useState(false);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Billing Switcher */}
      <div className="inline-flex items-center bg-[#0c1218] border border-white/10 rounded-2xl p-1.5 shadow-inner">
        <button
          type="button"
          onClick={() => setYearly(false)}
          className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
            !yearly
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          {t("monthly")}
        </button>
        <button
          type="button"
          onClick={() => setYearly(true)}
          className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            yearly
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <span>{t("yearly")}</span>
          <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] uppercase font-extrabold tracking-wider">
            Save 20%
          </span>
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl w-full mx-auto mt-12">
        {PLANS.map((plan) => {
          const price = yearly ? plan.yearly : plan.monthly;
          const isExternal = plan.cta.href.startsWith("mailto:");
          const ButtonEl = isExternal ? "a" : Link;

          return (
            <div
              key={plan.key}
              className={`rounded-3xl p-8 flex flex-col relative transition-all duration-300 ${
                plan.highlight
                  ? "bg-gradient-to-b from-[#111c1e] to-[#0d1419] border-2 border-emerald-500/50 shadow-2xl shadow-emerald-500/10 md:-translate-y-4"
                  : "bg-[#0c1218]/90 border border-white/10 hover:border-white/20"
              }`}
            >
              {plan.highlight ? (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3" /> Most Popular for Scouts
                </div>
              ) : null}

              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  {plan.badge}
                </span>
                {plan.highlight && (
                  <Zap className="h-4 w-4 text-amber-400 fill-amber-400" />
                )}
              </div>

              <h3 className="text-2xl font-black tracking-tight text-white mb-2">
                {t(`plans.${plan.key}.name`)}
              </h3>

              <div className="flex items-baseline gap-1.5 my-6">
                {price === "custom" ? (
                  <span className="text-4xl font-black text-white tracking-tight">Custom SLA</span>
                ) : (
                  <>
                    <span className="text-4xl font-black text-white">${price}</span>
                    <span className="text-xs text-slate-400 font-medium">
                      {price === 0
                        ? "forever"
                        : yearly
                        ? "/month (billed annually)"
                        : "/month"}
                    </span>
                  </>
                )}
              </div>

              <div className="border-t border-white/5 my-4" />

              <ul className="space-y-3.5 mb-8 flex-1">
                {plan.features.map((featureKey) => (
                  <li
                    key={featureKey}
                    className="flex items-start gap-3 text-xs text-slate-300 font-medium"
                  >
                    <CheckCircle2
                      className={`h-4 w-4 shrink-0 mt-0.5 ${
                        plan.highlight ? "text-emerald-400" : "text-slate-500"
                      }`}
                    />
                    <span>{t(`plans.${plan.key}.features.${featureKey}`)}</span>
                  </li>
                ))}
              </ul>

              <ButtonEl
                href={plan.cta.href}
                className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-center transition-all ${
                  plan.highlight
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25"
                    : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                }`}
              >
                {t(`plans.${plan.key}.cta`)}
              </ButtonEl>
            </div>
          );
        })}
      </div>
    </div>
  );
}
