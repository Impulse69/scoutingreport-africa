import { Suspense } from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { SignInForm } from "./sign-in-form";
import { DevQuickLogin } from "../dev-quick-login";

export const metadata = { title: "Sign in" };

export default async function SignInPage() {
  const t = await getTranslations("auth.signIn");

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
        <SignInForm />
      </Suspense>

      <Suspense fallback={null}>
        <DevQuickLogin />
      </Suspense>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        {t("noAccount")}{" "}
        <Link
          href="/auth/sign-up"
          className="font-medium text-primary hover:underline"
        >
          {t("createOne")}
        </Link>
      </p>
    </div>
  );
}
