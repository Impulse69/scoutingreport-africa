import { Suspense } from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { SignUpForm } from "./sign-up-form";
import { DevQuickLogin } from "../dev-quick-login";

export const metadata = { title: "Create account" };

export default async function SignUpPage() {
  const t = await getTranslations("auth.signUp");
  return (
    <div className="mx-auto w-full">
      <div className="mb-8">
        <div className="mb-5 inline-flex items-center border border-stone-200 bg-stone-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 dark:border-stone-800 dark:bg-stone-900/60 dark:text-stone-400">
          {t("eyebrow")}
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-stone-950 dark:text-white">
          {t("title")}
        </h1>
        <p className="mt-3 max-w-sm text-sm leading-6 text-stone-500 dark:text-stone-400">
          {t("subtitle")}
        </p>
      </div>

      <Suspense
        fallback={
          <div className="space-y-3">
            <div className="h-12 animate-pulse rounded-lg bg-stone-100 dark:bg-stone-900" />
            <div className="h-12 animate-pulse rounded-lg bg-stone-100 dark:bg-stone-900" />
            <div className="h-12 animate-pulse rounded-lg bg-stone-100 dark:bg-stone-900" />
          </div>
        }
      >
        <SignUpForm />
      </Suspense>

      <Suspense fallback={null}>
        <DevQuickLogin />
      </Suspense>

      <p className="mt-8 text-center text-sm text-stone-500 dark:text-stone-400">
        {t("haveAccount")}{" "}
        <Link
          href="/auth/sign-in"
          className="font-semibold text-orange-600 hover:text-orange-500 transition-colors"
        >
          {t("signInLink")}
        </Link>
      </p>
    </div>
  );
}
