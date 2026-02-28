"use client";

import React from "react";

export function IndustrialGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base gradient - Deep forest green to charcoal */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#001a0f] via-[#01221a] to-[#0a1612]" />

      {/* Technical grid pattern */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.15]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="industrial-grid"
            x="0"
            y="0"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="#018856"
              strokeWidth="0.5"
            />
          </pattern>

          {/* Diagonal hatching - technical drawing style */}
          <pattern
            id="diagonal-hatch"
            x="0"
            y="0"
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="10"
              stroke="#018856"
              strokeWidth="0.3"
              opacity="0.5"
            />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#industrial-grid)" />
      </svg>

      {/* Subtle noise texture for industrial feel */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
        }}
      />

      {/* Animated spotlight effect - mechanical precision */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#018856] rounded-full blur-[120px] opacity-20 animate-pulse-slow" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-600 rounded-full blur-[140px] opacity-10 animate-pulse-slower" />

      {/* Geometric accent - precision tooling inspired */}
      <div className="absolute top-1/3 right-[10%] w-2 h-32 bg-gradient-to-b from-[#018856]/40 to-transparent rotate-12" />
      <div className="absolute bottom-1/3 left-[15%] w-2 h-24 bg-gradient-to-b from-emerald-500/30 to-transparent -rotate-12" />
    </div>
  );
}
