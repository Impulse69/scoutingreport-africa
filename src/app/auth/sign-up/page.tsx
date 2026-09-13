import { Suspense } from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { SignUpForm } from "./sign-up-form";
import { DevQuickLogin } from "../dev-quick-login";

export const metadata = { title: "Create an account" };

export default async function SignUpPage() {
  const t = await getTranslations("auth.signUp");

  return (
    <div className="w-full">
      <div className="mb-6 space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="text-sm leading-6 text-muted-foreground">{t("subtitle")}</p>
      </div>

      <Suspense
        fallback={
          <div className="space-y-3">
            <div className="h-10 rounded-md bg-muted" />
            <div className="h-10 rounded-md bg-muted" />
          </div>
        }
      >
        <SignUpForm />
      </Suspense>

      <Suspense fallback={null}>
        <DevQuickLogin />
      </Suspense>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        {t("hasAccount")}{" "}
        <Link
          href="/auth/sign-in"
          className="font-medium text-primary hover:underline"
        >
          {t("signIn")}
        </Link>
      </p>
    </div>
  );
}
