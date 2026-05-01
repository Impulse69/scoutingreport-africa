import { notFound } from "next/navigation";

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ slug: string; reportId: string }>;
}) {
  const { slug, reportId } = await params;
  if (!slug || !reportId) notFound();
  notFound();
}
