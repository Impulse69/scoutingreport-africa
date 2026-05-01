import { notFound } from "next/navigation";

export default async function ComparisonPage({
  params,
}: {
  params: Promise<{ a: string; b: string }>;
}) {
  const { a, b } = await params;
  if (!a || !b) notFound();
  notFound();
}
