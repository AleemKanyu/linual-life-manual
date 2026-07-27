import React, { useEffect, useState, useRef } from "react";
import { Sparkles, Shield, MoonStar, Target } from "lucide-react";

interface LinualSplashScreenProps {
  onFinish?: () => void;
}

export const LinualSplashScreen: React.FC<LinualSplashScreenProps> = ({ onFinish }) => {
  const [fade, setFade] = useState(false);
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setFade(true);
    }, 600);

    const timer2 = setTimeout(() => {
      if (onFinishRef.current) onFinishRef.current();
    }, 900);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAF9F6] text-[#2D2D2A] transition-opacity duration-500 ${
        fade ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Branding Logo Container */}
      <div className="flex flex-col items-center gap-4 text-center px-6">
        <div className="w-20 h-20 rounded-3xl bg-[#5A6A5A] text-white flex items-center justify-center shadow-lg shadow-[#5A6A5A]/20 animate-pulse">
          <Shield className="w-10 h-10 stroke-[1.8]" />
        </div>

        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-serif italic text-[#2D2D2A] tracking-tight">
            Linual
          </h1>
          <p className="text-xs text-[#6B6A65] tracking-wide">
            Your Personal Life Operating System & Digital Manual
          </p>
        </div>

        {/* Dynamic Indicator */}
        <div className="flex items-center gap-2 text-xs font-semibold text-[#5A6A5A] bg-[#F1EFEC] px-4 py-1.5 rounded-full border border-[#EBE9E1] mt-4">
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          <span>Synchronizing Life Data...</span>
        </div>
      </div>
    </div>
  );
};
