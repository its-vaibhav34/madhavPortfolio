import React from 'react';

export const HeroVisual: React.FC = () => {
  return (
    <div className="relative w-full max-w-xl mx-auto h-44 sm:h-52 overflow-hidden select-none pointer-events-none opacity-80">
      <svg
        className="w-full h-full text-zinc-300"
        viewBox="0 0 600 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* PCB Board Grid & Micro Vias */}
        <g stroke="currentColor" strokeWidth="0.75" strokeDasharray="1 7" opacity="0.35">
          <line x1="0" y1="40" x2="600" y2="40" />
          <line x1="0" y1="80" x2="600" y2="80" />
          <line x1="0" y1="120" x2="600" y2="120" />
          <line x1="0" y1="160" x2="600" y2="160" />
          <line x1="100" y1="0" x2="100" y2="200" />
          <line x1="200" y1="0" x2="200" y2="200" />
          <line x1="300" y1="0" x2="300" y2="200" />
          <line x1="400" y1="0" x2="400" y2="200" />
          <line x1="500" y1="0" x2="500" y2="200" />
        </g>

        {/* Primary Circuit Traces */}
        <path
          d="M 20 100 L 140 100 L 180 60 L 290 60 L 320 90 L 460 90 L 500 130 L 580 130"
          stroke="#71717a"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.4"
        />

        {/* Branch 1: GPIO Bus */}
        <path
          d="M 140 100 L 140 140 L 220 140 L 250 170 L 380 170"
          stroke="#a1a1aa"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.35"
        />

        {/* Branch 2: Differential Signal Pair */}
        <path
          d="M 290 60 L 290 30 L 410 30 L 440 60 L 560 60"
          stroke="#a1a1aa"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.3"
        />

        {/* Trace Accent with Cyan Pulse */}
        <path
          d="M 180 60 L 290 60 L 320 90 L 460 90"
          stroke="#06b6d4"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.75"
        />

        {/* Microcontroller Package Silhouette (IC1) */}
        <rect
          x="280"
          y="70"
          width="44"
          height="44"
          rx="4"
          fill="#fafafa"
          stroke="#71717a"
          strokeWidth="1"
        />
        <circle cx="288" cy="78" r="1.5" fill="#71717a" />
        {/* IC Pins */}
        <line x1="272" y1="80" x2="280" y2="80" stroke="#71717a" strokeWidth="1" />
        <line x1="272" y1="92" x2="280" y2="92" stroke="#71717a" strokeWidth="1" />
        <line x1="272" y1="104" x2="280" y2="104" stroke="#71717a" strokeWidth="1" />
        <line x1="324" y1="80" x2="332" y2="80" stroke="#71717a" strokeWidth="1" />
        <line x1="324" y1="92" x2="332" y2="92" stroke="#71717a" strokeWidth="1" />
        <line x1="324" y1="104" x2="332" y2="104" stroke="#71717a" strokeWidth="1" />

        {/* Connection Nodes / Test Vias */}
        <g fill="#fafafa" stroke="#71717a" strokeWidth="1.25">
          <circle cx="140" cy="100" r="3" />
          <circle cx="180" cy="60" r="3" />
          <circle cx="460" cy="90" r="3" />
          <circle cx="220" cy="140" r="3" />
          <circle cx="380" cy="170" r="3" />
          <circle cx="500" cy="130" r="3" />
        </g>

        {/* Active Heartbeat LED on Node */}
        <circle cx="180" cy="60" r="1.5" fill="#06b6d4" />
        <circle cx="180" cy="60" r="5" stroke="#06b6d4" strokeWidth="0.75" opacity="0.6">
          <animate
            attributeName="r"
            values="3;7;3"
            dur="3s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.8;0.1;0.8"
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Tiny Monospace Technical Labels */}
        <text x="286" y="95" fill="#a1a1aa" fontSize="8" fontFamily="monospace" fontWeight="500">MCU</text>
        <text x="24" y="95" fill="#a1a1aa" fontSize="7" fontFamily="monospace">TP1_3V3</text>
        <text x="465" y="85" fill="#a1a1aa" fontSize="7" fontFamily="monospace">I2C_SDA</text>
        <text x="505" y="145" fill="#a1a1aa" fontSize="7" fontFamily="monospace">GND</text>
        <text x="385" y="165" fill="#a1a1aa" fontSize="7" fontFamily="monospace">GPIO18</text>
      </svg>
    </div>
  );
};
