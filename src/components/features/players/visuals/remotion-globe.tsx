"use client";

import React, { useRef, useEffect } from "react";
import { Player, PlayerRef } from "@remotion/player";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { Activity, Crosshair, Radio, ShieldCheck, TrendingUp } from "lucide-react";
import Globe from "@/remotion/Globe";

const intelligenceFrames = [
  [
    {
      label: "Talent Signal",
      value: "84.6",
      detail: "U-20 wingers",
      delta: "+12%",
      icon: TrendingUp,
      pos: { left: 80, top: 120 },
    },
    {
      label: "Live Reports",
      value: "1,248",
      detail: "verified this month",
      delta: "54 nations",
      icon: ShieldCheck,
      pos: { right: 80, top: 220 },
    },
    {
      label: "Scout Network",
      value: "500+",
      detail: "ground observers",
      delta: "CAF wide",
      icon: Radio,
      pos: { left: 100, bottom: 200 },
    },
  ],
  [
    {
      label: "Form Index",
      value: "91.2",
      detail: "last 6 reports",
      delta: "+8%",
      icon: TrendingUp,
      pos: { left: 80, top: 120 },
    },
    {
      label: "New Profiles",
      value: "312",
      detail: "added this week",
      delta: "18 leagues",
      icon: ShieldCheck,
      pos: { right: 80, top: 220 },
    },
    {
      label: "Coverage",
      value: "39",
      detail: "active markets",
      delta: "live",
      icon: Radio,
      pos: { left: 100, bottom: 200 },
    },
  ],
  [
    {
      label: "Edge Score",
      value: "76.8",
      detail: "undervalued players",
      delta: "+5%",
      icon: TrendingUp,
      pos: { left: 80, top: 120 },
    },
    {
      label: "Verified",
      value: "94%",
      detail: "human checked",
      delta: "QA pass",
      icon: ShieldCheck,
      pos: { right: 80, top: 220 },
    },
    {
      label: "Watchlist",
      value: "2.7k",
      detail: "tracked prospects",
      delta: "rising",
      icon: Radio,
      pos: { left: 100, bottom: 200 },
    },
  ],
];

const trackedHubs = ["Lagos", "Cairo", "Nairobi", "Casablanca"];

const GlobeWithOverlays: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const segmentDuration = Math.floor(durationInFrames / intelligenceFrames.length);
  const currentSegmentIndex = Math.floor(frame / segmentDuration) % intelligenceFrames.length;
  const cards = intelligenceFrames[currentSegmentIndex];
  const segmentFrame = frame % segmentDuration;

  return (
    <AbsoluteFill className="bg-transparent overflow-visible font-sans flex items-center justify-center">
      
      {/* Globe Container - Takes up the center */}
      <div className="absolute w-[600px] h-[600px] rounded-full flex items-center justify-center">
        <Globe />
      </div>

      {/* Static Overlays */}
      <div className="absolute top-[60px] left-1/2 -translate-x-1/2 flex items-center gap-3 rounded-full border border-white/10 bg-[#111]/80 px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-zinc-300 shadow-2xl backdrop-blur-md">
        <Activity className="h-4 w-4 text-cyan-500" />
        Continental Intelligence
      </div>

      <div className="absolute bottom-[60px] right-[60px] w-[260px] rounded-xl border border-white/10 bg-white/90 p-5 text-stone-950 shadow-2xl backdrop-blur-md z-10">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-stone-600">
            <Crosshair className="h-4 w-4 text-orange-600" />
            Active Hubs
          </div>
          <span className="h-2 w-2 rounded-full bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.9)]" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {trackedHubs.map((hub) => (
            <div key={hub} className="rounded-lg border border-stone-200 bg-stone-100/50 px-3 py-2">
              <div className="text-[11px] font-semibold text-stone-800">{hub}</div>
              <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-stone-300/50">
                <div className="h-full w-3/4 rounded-full bg-cyan-500" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* The Dark Floating Cards requested by the user */}
      <div className="absolute bottom-[100px] left-[60px] bg-[#111] border border-white/10 p-4 rounded-xl shadow-2xl backdrop-blur-md z-20 hover:scale-105 transition-transform cursor-default">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
            <Activity className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <div className="text-xs font-semibold text-zinc-400">Match Accuracy</div>
            <div className="text-xl font-bold text-blue-500">98.2%</div>
          </div>
        </div>
      </div>

      {/* Animated Stats Cards */}
      {cards.map((card, idx) => {
        const Icon = card.icon;
        const staggerDelay = idx * 10;
        
        const cardOpacity = interpolate(
          segmentFrame,
          [staggerDelay, staggerDelay + 25, segmentDuration - 25, segmentDuration],
          [0, 1, 1, 0],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );
        
        const cardTranslateY = interpolate(
          segmentFrame,
          [staggerDelay, staggerDelay + 25, segmentDuration - 25, segmentDuration],
          [20, 0, 0, -20],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );

        return (
          <div
            key={card.label}
            className="absolute w-[200px] rounded-xl border border-stone-200 bg-white/95 p-4 text-stone-950 shadow-2xl backdrop-blur-md z-10"
            style={{
              ...card.pos,
              opacity: cardOpacity,
              transform: `translateY(${cardTranslateY}px)`,
            }}
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-stone-500">
                <Icon className="h-4 w-4 text-cyan-600" />
                {card.label}
              </div>
              <span className="rounded bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                {card.delta}
              </span>
            </div>
            <div className="font-mono text-3xl font-black tabular-nums text-orange-700">{card.value}</div>
            <div className="mt-1 text-xs font-medium text-stone-500">{card.detail}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export const RemotionGlobe = () => {
  const playerRef = useRef<PlayerRef>(null);

  useEffect(() => {
    // Attempt to force playback in case autoPlay is blocked by browser policies
    if (playerRef.current) {
      try {
        playerRef.current.play();
      } catch (e) {
        console.error("Autoplay failed:", e);
      }
    }
  }, []);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[800px] flex items-center justify-center overflow-visible">
      {/* Decorative background glow behind the entire composition */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-orange-600/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Main Remotion Player */}
      <div className="absolute inset-0 overflow-visible pointer-events-none z-0">
        <Player
          ref={playerRef}
          component={GlobeWithOverlays}
          durationInFrames={420}
          compositionWidth={800}
          compositionHeight={800}
          fps={30}
          acknowledgeRemotionLicense
          style={{
            width: "100%",
            height: "100%",
            overflow: "visible",
          }}
          loop
          autoPlay
          controls={false}
        />
      </div>
    </div>
  );
};
