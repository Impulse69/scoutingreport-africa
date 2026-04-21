import { notFound } from "next/navigation";

export default async function ScoutReportPage({
  params,
}: {
  params: Promise<{ slug: string; reportId: string }>;
}) {
  const { slug, reportId } = await params;
  if (!slug || !reportId) notFound();
  notFound();
}
