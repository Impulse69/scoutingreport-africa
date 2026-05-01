import { Suspense } from "react";
import { SignInForm } from "./sign-in-form";

export const metadata = { title: "Sign in" };

export default function SignInPage() {
  return (
    <div className="w-full max-w-[350px] mx-auto">
      <div className="flex flex-col space-y-2 text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-stone-900 dark:text-white">
          Welcome back
        </h1>
        <p className="text-stone-500 text-sm">
          Access your scouting portal across the continent.
        </p>
      </div>
      <Suspense fallback={<div className="h-12 rounded-none bg-stone-100 dark:bg-stone-900 animate-pulse" />}>
        <SignInForm />
      </Suspense>
    </div>
  );
}
