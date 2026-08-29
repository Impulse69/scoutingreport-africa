import { Suspense } from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { SignInForm } from "./sign-in-form";
import { DevQuickLogin } from "../dev-quick-login";
import { Shield } from "lucide-react";

export const metadata = { title: "Sign In · ScoutingReport Africa" };

export default async function SignInPage() {
  const t = await getTranslations("auth.signIn");
  return (
    <div className="mx-auto w-full">
      <div className="mb-6 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
          <Shield className="h-3 w-3" />
          <span>{t("eyebrow")}</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-white">
          {t("title")}
        </h1>
        <p className="text-xs text-slate-400 leading-relaxed">
          {t("subtitle")}
        </p>
      </div>

      <Suspense
        fallback={
          <div className="space-y-3">
            <div className="h-12 animate-pulse rounded-2xl bg-white/5" />
            <div className="h-12 animate-pulse rounded-2xl bg-white/5" />
          </div>
        }
      >
        <SignInForm />
      </Suspense>

      <Suspense fallback={null}>
        <DevQuickLogin />
      </Suspense>

      <p className="mt-8 text-center text-xs text-slate-400">
        {t("noAccount")}{" "}
        <Link
          href="/auth/sign-up"
          className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          {t("createOne")}
        </Link>
      </p>
    </div>
  );
}
