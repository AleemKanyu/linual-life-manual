import React from "react";

export const SalahWatermark: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`pointer-events-none select-none opacity-10 mix-blend-multiply ${className}`}
  >
    {/* Geometric Islamic Arch Motif */}
    <path
      d="M100 20 C140 20 170 50 170 95 V180 H30 V95 C30 50 60 20 100 20 Z"
      stroke="#5A6A5A"
      strokeWidth="2"
      strokeDasharray="4 4"
    />
    <path
      d="M100 35 C130 35 155 60 155 95 V170 H45 V95 C45 60 70 35 100 35 Z"
      stroke="#5A6A5A"
      strokeWidth="1.5"
    />
    {/* Crescent Moon */}
    <path
      d="M100 65 A 15 15 0 1 0 115 80 A 12 12 0 1 1 100 65 Z"
      fill="#5A6A5A"
    />
    {/* Star */}
    <polygon
      points="118,65 120,70 125,70 121,73 123,78 118,75 113,78 115,73 111,70 116,70"
      fill="#5A6A5A"
    />
    {/* Geometric Eight-Point Star Grid */}
    <rect x="75" y="105" width="50" height="50" stroke="#5A6A5A" strokeWidth="1" transform="rotate(0 100 130)" />
    <rect x="75" y="105" width="50" height="50" stroke="#5A6A5A" strokeWidth="1" transform="rotate(45 100 130)" />
  </svg>
);

export const HabitsWatermark: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`pointer-events-none select-none opacity-10 mix-blend-multiply ${className}`}
  >
    {/* Organic Botanical Leaf Branch */}
    <path d="M40 170 Q 100 130 160 30" stroke="#5A6A5A" strokeWidth="2" strokeLinecap="round" />
    <path d="M90 135 C 70 120 60 90 85 85 C 100 95 100 120 90 135 Z" fill="#5A6A5A" opacity="0.6" />
    <path d="M120 105 C 140 90 150 60 125 55 C 110 65 110 90 120 105 Z" fill="#B07D62" opacity="0.6" />
    <path d="M60 155 C 45 140 35 120 55 115 C 65 125 65 145 60 155 Z" fill="#5A6A5A" opacity="0.5" />
    <circle cx="160" cy="30" r="6" fill="#B07D62" />
    <circle cx="145" cy="45" r="4" fill="#5A6A5A" />
  </svg>
);

export const JournalWatermark: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`pointer-events-none select-none opacity-10 mix-blend-multiply ${className}`}
  >
    {/* Vintage Quill & Open Journal Sketch */}
    <rect x="30" y="60" width="65" height="90" rx="4" stroke="#B07D62" strokeWidth="2" />
    <rect x="105" y="60" width="65" height="90" rx="4" stroke="#B07D62" strokeWidth="2" />
    <line x1="42" y1="80" x2="82" y2="80" stroke="#B07D62" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="42" y1="95" x2="82" y2="95" stroke="#B07D62" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="42" y1="110" x2="72" y2="110" stroke="#B07D62" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="117" y1="80" x2="157" y2="80" stroke="#B07D62" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="117" y1="95" x2="157" y2="95" stroke="#B07D62" strokeWidth="1.5" strokeLinecap="round" />
    {/* Ink Quill Feather */}
    <path d="M165 25 C 130 50 110 90 95 145 M165 25 C 150 45 135 60 145 75 C 135 70 120 85 130 100" stroke="#5A6A5A" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const GoalsWatermark: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`pointer-events-none select-none opacity-10 mix-blend-multiply ${className}`}
  >
    {/* Compass Rose & Mountain Emblem */}
    <circle cx="100" cy="100" r="75" stroke="#B07D62" strokeWidth="1.5" strokeDasharray="6 3" />
    <circle cx="100" cy="100" r="60" stroke="#5A6A5A" strokeWidth="1" />
    {/* Compass Needle */}
    <polygon points="100,30 110,100 100,90 90,100" fill="#B07D62" />
    <polygon points="100,170 110,100 100,110 90,100" fill="#5A6A5A" opacity="0.6" />
    {/* Mountain Peak Lines */}
    <path d="M40 140 L 85 75 L 120 120 L 160 65 L 180 140 Z" stroke="#5A6A5A" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);
