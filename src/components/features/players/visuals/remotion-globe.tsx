"use client";

import React from "react";
import { Player } from "@remotion/player";
import Globe from "@/remotion/Globe";

export const RemotionGlobe = () => {
  return (
    <div className="relative aspect-square w-full max-w-[600px] mx-auto overflow-hidden rounded-full border border-stone-200 bg-stone-50/50 shadow-inner">
      <Player
        component={Globe}
        durationInFrames={300}
        compositionWidth={1080}
        compositionHeight={1080}
        fps={30}
        style={{
          width: "100%",
          height: "100%",
        }}
        loop
        autoPlay
        controls={false}
      />
    </div>
  );
};
