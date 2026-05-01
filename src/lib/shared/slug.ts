import slugifyFn from "slugify";

export function playerSlug(fullName: string, discriminator?: string): string {
  const base = slugifyFn(fullName, {
    lower: true,
    strict: true,
    locale: "en",
  });
  return discriminator ? `${base}-${discriminator}` : base;
}
