import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-8">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
        Privacy Policy
      </h1>
      <p className="mt-4 text-sm text-muted-foreground">Last updated: 2026-05-06</p>
      <div className="mt-8 space-y-4 text-sm leading-6 text-muted-foreground">
        <p>
          ScoutingReport Africa collects only the data required to operate the
          platform: the email address you sign up with, the reports you author,
          and basic session telemetry to keep accounts secure.
        </p>
        <p>
          We do not sell or share personal data with advertisers. Aggregated,
          anonymised analytics are used to improve the product. You can request
          export or deletion of your data at any time by writing to{" "}
          <a className="text-primary underline" href="mailto:privacy@scoutingreport.africa">
            privacy@scoutingreport.africa
          </a>
          .
        </p>
        <p>
          A full GDPR-aligned policy is being prepared. Until it ships, the
          summary above governs all data handling on the platform.
        </p>
      </div>
    </div>
  );
}
