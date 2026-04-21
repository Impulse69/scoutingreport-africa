import { notFound } from "next/navigation";

export default async function PlayerProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // Placeholder: until Supabase is connected, every profile 404s.
  if (!slug) notFound();
  notFound();
}
