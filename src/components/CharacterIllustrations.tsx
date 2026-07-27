import React from "react";

// 1. Prayer & Reflection Character Illustration
export const PrayerCharacterArt: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={`pointer-events-none select-none ${className}`}>
    {/* Background Moon & Star Glow */}
    <circle cx="170" cy="70" r="45" fill="#5A6A5A" fillOpacity="0.08" />
    <path d="M185 45 A 22 22 0 1 0 205 67 A 17 17 0 1 1 185 45 Z" fill="#B07D62" opacity="0.8" />
    <polygon points="150,40 152,45 157,45 153,48 155,53 150,50 145,53 147,48 143,45 148,45" fill="#5A6A5A" opacity="0.6" />

    {/* Prayer Rug */}
    <ellipse cx="120" cy="195" rx="80" ry="16" fill="#F1EFEC" stroke="#EBE9E1" strokeWidth="2" />
    <path d="M50 195 L 190 195" stroke="#B07D62" strokeWidth="2" strokeDasharray="4 4" />

    {/* Character Sitting in Prayer */}
    {/* Body / Robe */}
    <path d="M90 190 C 85 150 95 120 120 120 C 145 120 155 150 150 190 Z" fill="#5A6A5A" />
    {/* Head & Hood/Cap */}
    <circle cx="120" cy="100" r="18" fill="#5A6A5A" />
    <circle cx="120" cy="102" r="14" fill="#F1EFEC" opacity="0.9" />
    {/* Raised Hands in Dua / Prayer */}
    <path d="M108 145 C 105 130 112 125 115 125 M132 145 C 135 130 128 125 125 125" stroke="#B07D62" strokeWidth="3.5" strokeLinecap="round" />
    {/* Prayer Beads / Tasbih */}
    <circle cx="115" cy="132" r="2" fill="#B07D62" />
    <circle cx="118" cy="135" r="2" fill="#B07D62" />
    <circle cx="122" cy="135" r="2" fill="#B07D62" />
    <circle cx="125" cy="132" r="2" fill="#B07D62" />
  </svg>
);

// 2. Habit Nurturing Character Illustration
export const HabitCharacterArt: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={`pointer-events-none select-none ${className}`}>
    {/* Potted Plant */}
    <path d="M150 195 L 160 160 H 190 L 200 195 Z" fill="#B07D62" opacity="0.8" />
    <rect x="146" y="155" width="58" height="8" rx="3" fill="#B07D62" />
    {/* Plant Sprout */}
    <path d="M175 155 Q 175 125 160 110 C 180 115 195 135 175 155 Z" fill="#5A6A5A" />
    <path d="M175 140 Q 185 120 200 125 C 190 140 178 142 175 140 Z" fill="#5A6A5A" opacity="0.8" />

    {/* Water Drops */}
    <circle cx="148" cy="135" r="3" fill="#38BDF8" />
    <circle cx="142" cy="148" r="2.5" fill="#38BDF8" />

    {/* Character with Watering Can */}
    {/* Body */}
    <path d="M60 195 C 55 145 75 110 95 110 C 115 110 125 145 120 195 Z" fill="#5A6A5A" />
    <circle cx="95" cy="90" r="16" fill="#2D2D2A" />
    {/* Arm & Watering Can */}
    <path d="M110 125 L 140 125" stroke="#B07D62" strokeWidth="4" strokeLinecap="round" />
    <rect x="135" y="118" width="22" height="16" rx="3" fill="#2D2D2A" />
    <path d="M157 122 L 167 126" stroke="#2D2D2A" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

// 3. Cozy Journaling Character Illustration
export const JournalCharacterArt: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={`pointer-events-none select-none ${className}`}>
    {/* Cozy Armchair */}
    <path d="M40 185 C 40 140 60 130 120 130 C 180 130 200 140 200 185 Z" fill="#F1EFEC" stroke="#EBE9E1" strokeWidth="3" />
    <rect x="30" y="170" width="25" height="25" rx="6" fill="#EBE9E1" />
    <rect x="185" y="170" width="25" height="25" rx="6" fill="#EBE9E1" />

    {/* Character Writing */}
    <path d="M85 175 C 80 130 100 100 120 100 C 140 100 160 130 155 175 Z" fill="#5A6A5A" />
    <circle cx="120" cy="80" r="16" fill="#2D2D2A" />

    {/* Open Notebook & Pen */}
    <rect x="100" y="130" width="40" height="30" rx="3" fill="#B07D62" transform="rotate(-10 120 145)" />
    <rect x="104" y="133" width="16" height="24" fill="white" transform="rotate(-10 120 145)" />
    <rect x="122" y="133" width="16" height="24" fill="white" transform="rotate(-10 120 145)" />
    <line x1="145" y1="125" x2="135" y2="140" stroke="#2D2D2A" strokeWidth="2.5" strokeLinecap="round" />

    {/* Steaming Mug */}
    <rect x="175" y="145" width="14" height="16" rx="3" fill="#B07D62" />
    <path d="M182 140 Q 185 135 182 130" stroke="#B07D62" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
  </svg>
);

// 4. Financial Ledger Character Illustration
export const FinanceCharacterArt: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={`pointer-events-none select-none ${className}`}>
    {/* Growth Chart Background */}
    <path d="M130 150 L 160 120 L 185 130 L 215 85" stroke="#5A6A5A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="215" cy="85" r="5" fill="#5A6A5A" />

    {/* Coin Stacks */}
    <ellipse cx="170" cy="185" rx="14" ry="5" fill="#B07D62" />
    <ellipse cx="170" cy="178" rx="14" ry="5" fill="#B07D62" />
    <ellipse cx="170" cy="171" rx="14" ry="5" fill="#B07D62" />
    <ellipse cx="195" cy="185" rx="14" ry="5" fill="#5A6A5A" />
    <ellipse cx="195" cy="178" rx="14" ry="5" fill="#5A6A5A" />

    {/* Character with Ledger */}
    <path d="M50 190 C 45 140 65 110 90 110 C 115 110 130 140 125 190 Z" fill="#2D2D2A" />
    <circle cx="90" cy="90" r="16" fill="#B07D62" />
    <rect x="85" y="125" width="45" height="32" rx="4" fill="white" stroke="#EBE9E1" strokeWidth="2" />
    <line x1="92" y1="135" x2="120" y2="135" stroke="#5A6A5A" strokeWidth="2" strokeLinecap="round" />
    <line x1="92" y1="145" x2="112" y2="145" stroke="#B07D62" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// 5. Tasks Checklist Character Illustration
export const TasksCharacterArt: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={`pointer-events-none select-none ${className}`}>
    {/* Floating Clipboard */}
    <rect x="135" y="70" width="75" height="110" rx="8" fill="white" stroke="#EBE9E1" strokeWidth="3" />
    <rect x="155" y="62" width="35" height="12" rx="3" fill="#B07D62" />
    {/* Checkbox Rows */}
    <rect x="147" y="90" width="14" height="14" rx="3" fill="#5A6A5A" />
    <path d="M150 97 L 154 101 L 160 93" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="168" y1="97" x2="198" y2="97" stroke="#2D2D2A" strokeWidth="2" strokeLinecap="round" />

    <rect x="147" y="115" width="14" height="14" rx="3" fill="#5A6A5A" />
    <path d="M150 122 L 154 126 L 160 118" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="168" y1="122" x2="195" y2="122" stroke="#2D2D2A" strokeWidth="2" strokeLinecap="round" />

    <rect x="147" y="140" width="14" height="14" rx="3" fill="#F1EFEC" stroke="#EBE9E1" strokeWidth="1.5" />
    <line x1="168" y1="147" x2="192" y2="147" stroke="#6B6A65" strokeWidth="2" strokeLinecap="round" />

    {/* Character Holding Pen */}
    <path d="M45 190 C 40 140 60 110 85 110 C 110 110 125 140 120 190 Z" fill="#5A6A5A" />
    <circle cx="85" cy="90" r="16" fill="#2D2D2A" />
    <line x1="105" y1="130" x2="142" y2="105" stroke="#B07D62" strokeWidth="3.5" strokeLinecap="round" />
  </svg>
);

// 6. Learning & Ideas Character Illustration
export const LearningCharacterArt: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={`pointer-events-none select-none ${className}`}>
    {/* Floating Lightbulb & Sparkles */}
    <circle cx="170" cy="55" r="14" fill="#F59E0B" fillOpacity="0.2" />
    <path d="M170 43 C 163 43 158 48 158 55 C 158 60 162 64 164 67 H 176 C 178 64 182 60 182 55 C 182 48 177 43 170 43 Z" fill="#F59E0B" />
    <rect x="165" y="68" width="10" height="4" fill="#2D2D2A" />

    {/* Open Book */}
    <path d="M60 165 C 80 155 105 155 120 165 C 135 155 160 155 180 165 V 195 C 160 185 135 185 120 195 C 105 185 80 185 60 195 Z" fill="#F1EFEC" stroke="#EBE9E1" strokeWidth="2" />
    <path d="M120 165 V 195" stroke="#B07D62" strokeWidth="2" />

    {/* Character Reading */}
    <path d="M85 155 C 80 120 95 95 120 95 C 145 95 160 120 155 155 Z" fill="#5A6A5A" />
    <circle cx="120" cy="75" r="16" fill="#2D2D2A" />
    {/* Glasses */}
    <circle cx="114" cy="75" r="5" stroke="#B07D62" strokeWidth="1.5" fill="none" />
    <circle cx="126" cy="75" r="5" stroke="#B07D62" strokeWidth="1.5" fill="none" />
    <line x1="119" y1="75" x2="121" y2="75" stroke="#B07D62" strokeWidth="1.5" />
  </svg>
);
