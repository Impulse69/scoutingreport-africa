"use client";

import { useState } from "react";

type PlayerPhotoProps = {
  src: string | null;
  name: string;
  size?: number;
  rounded?: "full" | "md" | "lg" | "xl";
  className?: string;
};

const radiusClass = {
  full: "rounded-full",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
};

/**
 * Renders a player headshot with a graceful fallback to initials.
 * Uses native <img> with `onError` so we can flip to placeholder
 * cleanly — next/image's optimizer + remote 404s don't play well together.
 */
export function PlayerPhoto({
  src,
  name,
  size = 80,
  rounded = "xl",
  className = "",
}: PlayerPhotoProps) {
  const [broken, setBroken] = useState(false);
  const showImg = !!src && !broken;

  const initials = name
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={`relative shrink-0 overflow-hidden border border-white/15 bg-stone-200 ${radiusClass[rounded]} ${className}`}
      style={{ width: size, height: size }}
    >
      {showImg ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          width={size}
          height={size}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={() => setBroken(true)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center font-mono font-bold text-stone-700"
          style={{ fontSize: Math.max(12, size / 5) }}
        >
          {initials}
        </div>
      )}
    </div>
  );
}
