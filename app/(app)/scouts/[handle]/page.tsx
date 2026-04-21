import { notFound } from "next/navigation";

export default async function ScoutProfilePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  if (!handle) notFound();
  notFound();
}
