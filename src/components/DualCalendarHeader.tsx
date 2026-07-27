import React, { useState, useEffect } from "react";
import { Calendar, Moon, Sparkles, ChevronLeft, ChevronRight, Sun, Flame, CheckCircle, Info } from "lucide-react";
import {
  getHijriDate,
  getFastingRecommendation,
  getIslamicEvent,
  HijriDateInfo,
} from "../lib/hijriCalendar";
import { StorageEngine } from "../lib/storage";

interface DualCalendarHeaderProps {
  onXpChange?: (delta: number) => void;
  variant?: "full" | "compact" | "badge";
  className?: string;
}

export const DualCalendarHeader: React.FC<DualCalendarHeaderProps> = ({
  onXpChange,
  variant = "full",
  className = "",
}) => {
  const [dayOffset, setDayOffset] = useState<number>(() => {
    const saved = localStorage.getItem("linual_hijri_offset");
    return saved ? parseInt(saved, 10) : 0;
  });

  const [isFastingLogged, setIsFastingLogged] = useState<boolean>(() => {
    const log = StorageEngine.getSalahLog();
    return log.fasting || false;
  });

  const [showOffsetInfo, setShowOffsetInfo] = useState<boolean>(false);

  // Sync state
  const currentDate = new Date();
  const hijriInfo: HijriDateInfo = getHijriDate(currentDate, dayOffset);
  const fastingRec = getFastingRecommendation(currentDate, hijriInfo);
  const islamicEvent = getIslamicEvent(hijriInfo);

  const handleAdjustOffset = (delta: number) => {
    const next = dayOffset + delta;
    setDayOffset(next);
    localStorage.setItem("linual_hijri_offset", next.toString());
  };

  const handleToggleFastingLog = () => {
    const nextState = !isFastingLogged;
    setIsFastingLogged(nextState);

    const currentSalah = StorageEngine.getSalahLog();
    const isFirstClaim = nextState && !currentSalah.fastingXpClaimed;
    const updated = {
      ...currentSalah,
      fasting: nextState,
      fastingXpClaimed: currentSalah.fastingXpClaimed || isFirstClaim,
    };
    StorageEngine.setSalahLog(updated);

    if (isFirstClaim && onXpChange) {
      // Award 25 XP for logging a Sunnah or mandatory fast
      onXpChange(25);
    }
  };

  if (variant === "badge") {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 border border-[#EBE9E1] text-xs shadow-xs text-[#2D2D2A] ${className}`}>
        <Moon className="w-3.5 h-3.5 text-[#5A6A5A]" />
        <span className="font-semibold text-[#5A6A5A]">{hijriInfo.formattedHijri}</span>
        <span className="text-[#EBE9E1]">|</span>
        <span className="text-[#6B6A65]">{currentDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-[#EBE9E1] shadow-xs ${className}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#5A6A5A]/10 border border-[#5A6A5A]/20 flex items-center justify-center text-[#5A6A5A]">
            <Moon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-[#2D2D2A]">{hijriInfo.formattedHijri}</span>
              {fastingRec.isFastingDay && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${fastingRec.badgeColor}`}>
                  {fastingRec.title}
                </span>
              )}
            </div>
            <div className="text-xs text-[#6B6A65] flex items-center gap-1.5 mt-0.5">
              <Calendar className="w-3 h-3 text-[#B07D62]" />
              <span>{hijriInfo.formattedGregorian}</span>
            </div>
          </div>
        </div>

        {/* Offset controls */}
        <div className="flex items-center gap-1 text-[11px] text-[#6B6A65]">
          <span>Hijri Adj:</span>
          <button
            onClick={() => handleAdjustOffset(-1)}
            className="w-5 h-5 rounded-md bg-[#F1EFEC] hover:bg-[#EBE9E1] flex items-center justify-center text-[#2D2D2A] font-bold"
            title="Subtract 1 day from Hijri calendar"
          >
            -
          </button>
          <span className="font-mono px-1">{dayOffset > 0 ? `+${dayOffset}` : dayOffset}d</span>
          <button
            onClick={() => handleAdjustOffset(1)}
            className="w-5 h-5 rounded-md bg-[#F1EFEC] hover:bg-[#EBE9E1] flex items-center justify-center text-[#2D2D2A] font-bold"
            title="Add 1 day to Hijri calendar"
          >
            +
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-5 sm:p-6 rounded-[32px] bg-linear-to-r from-white via-[#FAF9F6] to-[#F5F3ED] border border-[#EBE9E1] shadow-xs space-y-4 ${className}`}>
      {/* Top Banner Row: Dual Dates */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Date Headers */}
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#5A6A5A] text-white flex items-center justify-center shadow-xs shrink-0">
            <Moon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-base sm:text-lg font-serif italic font-bold text-[#2D2D2A]">
                {hijriInfo.formattedHijri}
              </span>
              <span className="text-xs font-serif italic text-[#B07D62] bg-[#B07D62]/10 px-2.5 py-0.5 rounded-full border border-[#B07D62]/20 font-semibold">
                {hijriInfo.year} AH
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#6B6A65] mt-1">
              <Calendar className="w-3.5 h-3.5 text-[#5A6A5A]" />
              <span>{hijriInfo.formattedGregorian}</span>
              <span className="text-[#EBE9E1]">|</span>
              <span className="text-[11px] font-mono text-[#5A6A5A]">Solar Cycle {currentDate.getFullYear()}</span>
            </div>
          </div>
        </div>

        {/* Right Action & Moon Sighting Adjustment Controls */}
        <div className="flex items-center gap-2.5 self-start lg:self-auto">
          {/* Moon Sighting Day Adjustment */}
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-2xl border border-[#EBE9E1] text-xs text-[#6B6A65] shadow-2xs">
            <span className="text-[11px] font-medium hidden sm:inline">Moon Adj:</span>
            <button
              type="button"
              aria-label="Subtract 1 day from Hijri calendar"
              onClick={() => handleAdjustOffset(-1)}
              className="p-1 rounded-lg hover:bg-[#F1EFEC] text-[#2D2D2A] font-bold cursor-pointer"
              title="Minus 1 Hijri Day (Moon Sighting Adjustment)"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-xs font-bold text-[#5A6A5A] px-1">
              {dayOffset > 0 ? `+${dayOffset}d` : dayOffset < 0 ? `${dayOffset}d` : "Exact"}
            </span>
            <button
              type="button"
              aria-label="Add 1 day to Hijri calendar"
              onClick={() => handleAdjustOffset(1)}
              className="p-1 rounded-lg hover:bg-[#F1EFEC] text-[#2D2D2A] font-bold cursor-pointer"
              title="Plus 1 Hijri Day (Moon Sighting Adjustment)"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Sunnah Fast Log Button */}
          {fastingRec.isFastingDay && (
            <button
              type="button"
              aria-label={isFastingLogged ? "Sunnah fast logged" : "Log today's Sunnah fast"}
              onClick={handleToggleFastingLog}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer ${
                isFastingLogged
                  ? "bg-[#5A6A5A] text-white border border-[#5A6A5A]"
                  : "bg-white hover:bg-[#F1EFEC] text-[#B07D62] border border-[#B07D62]/30"
              }`}
            >
              <CheckCircle className={`w-3.5 h-3.5 ${isFastingLogged ? "text-white" : "text-[#B07D62]"}`} />
              <span>{isFastingLogged ? "Fast Logged (+25 XP)" : "Log Today's Fast"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Highlights & Context Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-[#EBE9E1]">
        {/* Fasting Recommendation Banner */}
        <div
          className={`p-3 rounded-2xl border flex items-center justify-between text-xs ${
            fastingRec.isFastingDay
              ? "bg-[#B07D62]/10 border-[#B07D62]/30 text-[#2D2D2A]"
              : "bg-[#F1EFEC]/60 border-[#EBE9E1] text-[#6B6A65]"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Flame className={`w-4 h-4 ${fastingRec.isFastingDay ? "text-[#B07D62]" : "text-[#6B6A65]"}`} />
            <div>
              <div className="font-bold text-xs">
                {fastingRec.isFastingDay ? fastingRec.title : "Standard Day (No Special Sunnah Fast)"}
              </div>
              <div className="text-[11px] text-[#6B6A65] mt-0.5">
                {fastingRec.isFastingDay
                  ? fastingRec.description
                  : "Upcoming Sunnah Fasts: Mondays, Thursdays, and 13th-15th (White Days)"}
              </div>
            </div>
          </div>
          {fastingRec.isFastingDay && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#B07D62] text-white font-bold uppercase shrink-0 ml-2">
              Sunnah
            </span>
          )}
        </div>

        {/* Islamic Holy Day / Event Highlight */}
        <div className="p-3 rounded-2xl bg-white border border-[#EBE9E1] flex items-center justify-between text-xs text-[#2D2D2A]">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <div className="font-bold text-xs">
                {islamicEvent ? islamicEvent.name : `${hijriInfo.monthName} Season`}
              </div>
              <div className="text-[11px] text-[#6B6A65] mt-0.5">
                {islamicEvent ? islamicEvent.description : `Lunar Month ${hijriInfo.monthNumber} of 12 in Hijri Calendar`}
              </div>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#5A6A5A]/10 text-[#5A6A5A] font-semibold border border-[#5A6A5A]/20 shrink-0 ml-2">
            Hijri {hijriInfo.year}
          </span>
        </div>
      </div>
    </div>
  );
};
