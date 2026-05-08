"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";

type Plan = {
  key: "starter" | "pro" | "enterprise";
  monthly: number | "custom";
  yearly: number | "custom";
  features: string[];
  cta: { href: string };
  highlight?: boolean;
};

const PLANS: Plan[] = [
  {
    key: "starter",
    monthly: 0,
    yearly: 0,
    features: ["basicSearch", "topLeagues", "standardStats", "communitySupport"],
    cta: { href: "/auth/sign-up" },
  },
  {
    key: "pro",
    monthly: 49,
    yearly: 39,
    features: ["advancedMetrics", "globalLeagues", "heatmaps", "videoHighlights", "prioritySupport"],
    cta: { href: "/auth/sign-up?plan=pro" },
    highlight: true,
  },
  {
    key: "enterprise",
    monthly: "custom",
    yearly: "custom",
    features: ["apiAccess", "rawFeeds", "customIntegration", "accountManager", "sla"],
    cta: {
      href: "mailto:hello@scoutingreport.africa?subject=Enterprise%20enquiry",
    },
  },
];

export function PricingPlans() {
  const t = useTranslations("pricing");
  const [yearly, setYearly] = useState(false);

  return (
    <>
      <div className="inline-flex bg-[#111] border border-white/10 rounded-full p-1.5">
        <button
          type="button"
          onClick={() => setYearly(false)}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
            !yearly
              ? "bg-zinc-800 text-white shadow-sm"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          {t("monthly")}
        </button>
        <button
          type="button"
          onClick={() => setYearly(true)}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
            yearly
              ? "bg-zinc-800 text-white shadow-sm"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          {t("yearly")} <span className="text-orange-500 ml-1.5">{t("savings")}</span>
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-12">
        {PLANS.map((plan) => {
          const price = yearly ? plan.yearly : plan.monthly;
          const isExternal = plan.cta.href.startsWith("mailto:");
          const ButtonEl = isExternal ? "a" : Link;
          const baseBtn =
            "w-full py-3.5 rounded-md font-medium transition-colors block text-center";
          const btnClass = plan.highlight
            ? `${baseBtn} bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-600/20`
            : `${baseBtn} border border-white/20 hover:bg-white/10`;
          return (
            <div
              key={plan.key}
              className={
                plan.highlight
                  ? "bg-[#111] border-2 border-orange-500 rounded-2xl p-8 flex flex-col relative transform md:-translate-y-4 shadow-2xl shadow-orange-500/10"
                  : "bg-[#0B0B0B] border border-white/10 rounded-2xl p-8 flex flex-col hover:border-white/20 transition-colors"
              }
            >
              {plan.highlight ? (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                  {t("mostPopular")}
                </div>
              ) : null}
              <div className="text-xl font-bold mb-2">{t(`plans.${plan.key}.name`)}</div>
              <div className="flex items-end gap-1 mb-8">
                {price === "custom" ? (
                  <span className="text-4xl font-bold tracking-tight">{t("custom")}</span>
                ) : (
                  <>
                    <span className="text-4xl font-bold">${price}</span>
                    <span className="text-zinc-500 mb-1">
                      {price === 0 ? t("intervals.forever") : yearly ? t("intervals.yearly") : t("intervals.monthly")}
                    </span>
                  </>
                )}
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((featureKey) => (
                  <li
                    key={featureKey}
                    className={`flex items-center gap-3 text-sm ${
                      plan.highlight ? "text-zinc-200" : "text-zinc-300"
                    }`}
                  >
                    <CheckCircle2
                      className={`w-5 h-5 flex-shrink-0 ${
                        plan.highlight ? "text-orange-500" : "text-zinc-600"
                      }`}
                    />{" "}
                    {t(`plans.${plan.key}.features.${featureKey}`)}
                  </li>
                ))}
              </ul>
              <ButtonEl href={plan.cta.href} className={btnClass}>
                {t(`plans.${plan.key}.cta`)}
              </ButtonEl>
            </div>
          );
        })}
      </div>
    </>
  );
}
