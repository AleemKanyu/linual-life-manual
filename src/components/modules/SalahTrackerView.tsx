import React, { useState } from "react";
import { Moon, Check, Flame } from "lucide-react";
import { StorageEngine } from "../../lib/storage";
import { SalahLog, PrayerStatus } from "../../types";
import { DualCalendarHeader } from "../DualCalendarHeader";
import { CharacterArtImage } from "../GeneratedArt";

interface SalahTrackerViewProps {
  onXpChange: (delta: number) => void;
}

export const SalahTrackerView: React.FC<SalahTrackerViewProps> = ({ onXpChange }) => {
  const [salah, setSalah] = useState<SalahLog>(() => StorageEngine.getSalahLog());
  const [dhikrCount, setDhikrCount] = useState(salah.dhikrCount || 0);
  const [dhikrTarget] = useState(100);
  const [quranPages, setQuranPages] = useState(salah.quranPagesRead || 0);

  const prayersList: Array<{ key: keyof SalahLog; name: string; timeHint: string }> = [
    { key: "fajr", name: "Fajr", timeHint: "5:15 AM — Dawn" },
    { key: "dhuhr", name: "Dhuhr", timeHint: "1:15 PM — Midday" },
    { key: "asr", name: "Asr", timeHint: "4:45 PM — Afternoon" },
    { key: "maghrib", name: "Maghrib", timeHint: "8:20 PM — Sunset" },
    { key: "isha", name: "Isha", timeHint: "9:45 PM — Night" },
    { key: "witr", name: "Witr", timeHint: "Night Prayer" },
  ];

  const statusOptions: Array<{ value: PrayerStatus; label: string }> = [
    { value: "on_time", label: "On Time" },
    { value: "late", label: "Late" },
    { value: "qaza", label: "Qaza" },
    { value: "missed", label: "Missed" },
  ];

  const handleSetPrayerStatus = (prayerKey: keyof SalahLog, status: PrayerStatus) => {
    const previousStatus = salah[prayerKey];
    const updated = { ...salah, [prayerKey]: status };
    setSalah(updated);
    StorageEngine.setSalahLog(updated);
    // XP Guard: Only award +10 XP if status is changing TO on_time from another state
    if (status === "on_time" && previousStatus !== "on_time") {
      onXpChange(10);
    }
  };

  const handleIncrementDhikr = () => {
    const newCount = dhikrCount + 1;
    setDhikrCount(newCount);
    const updated = { ...salah, dhikrCount: newCount };
    setSalah(updated);
    StorageEngine.setSalahLog(updated);
    if (newCount % 33 === 0) onXpChange(5);
  };

  const handleAddQuranPages = (pages: number) => {
    const updatedPages = quranPages + pages;
    setQuranPages(updatedPages);
    const updated = { ...salah, quranPagesRead: updatedPages };
    setSalah(updated);
    StorageEngine.setSalahLog(updated);
    onXpChange(10);
  };

  const toggleTahajjud = () => {
    const nextTahajjud = !salah.tahajjud;
    const isFirstClaim = nextTahajjud && !salah.tahajjudXpClaimed;
    const updated: SalahLog = {
      ...salah,
      tahajjud: nextTahajjud,
      tahajjudXpClaimed: salah.tahajjudXpClaimed || isFirstClaim,
    };
    setSalah(updated);
    StorageEngine.setSalahLog(updated);
    if (isFirstClaim) onXpChange(20);
  };

  return (
    <div className="space-y-6 pb-12 text-[#2D2D2A]">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 bg-white p-5 sm:p-7 rounded-[32px] border border-[#EBE9E1] shadow-xs">
        <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 min-w-0 flex-1">
          <div className="w-14 h-14 sm:w-20 sm:h-20 shrink-0 rounded-2xl bg-[#F1EFEC] border border-[#EBE9E1] p-1 flex items-center justify-center overflow-hidden shadow-xs">
            <CharacterArtImage type="prayer" className="w-full h-full" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg sm:text-2xl font-serif italic text-[#2D2D2A] leading-tight">
              Salah & Islamic Growth Tracker
            </h2>
            <p className="text-xs text-[#6B6A65] mt-1 leading-normal">
              Track daily prayers, Tahajjud, Quran reading, daily dhikr counters, and Sunnah fasting records.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#F1EFEC] border border-[#EBE9E1] px-3 py-1.5 rounded-full text-xs text-[#5A6A5A] font-semibold shrink-0">
          <Flame className="w-4 h-4 text-[#B07D62]" />
          <span>{salah.fajr === "on_time" || salah.dhuhr === "on_time" ? "Prayer Active" : "Daily Prayer"}</span>
        </div>
      </div>

      {/* Dual Gregorian & Hijri Calendar Integration Header */}
      <DualCalendarHeader onXpChange={onXpChange} variant="full" />

      {/* 5 Daily Prayers + Witr Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {prayersList.map((p) => {
          const currentStatus = (salah[p.key] as PrayerStatus) || "pending";
          return (
            <div
              key={p.key}
              className="p-5 rounded-[28px] bg-white border border-[#EBE9E1] space-y-3 flex flex-col justify-between shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-serif italic font-bold text-[#2D2D2A]">{p.name}</div>
                  <div className="text-[11px] text-[#6B6A65]">{p.timeHint}</div>
                </div>
                <span
                  className={`text-[10px] px-3 py-1 rounded-full uppercase font-bold border tracking-wider ${
                    currentStatus === "on_time"
                      ? "bg-[#5A6A5A] text-white border-[#5A6A5A]"
                      : currentStatus === "late"
                      ? "bg-[#B07D62]/20 text-[#B07D62] border-[#B07D62]/30"
                      : currentStatus === "qaza"
                      ? "bg-amber-100 text-amber-800 border-amber-200"
                      : currentStatus === "missed"
                      ? "bg-rose-100 text-rose-800 border-rose-200"
                      : "bg-[#F1EFEC] text-[#6B6A65] border-[#EBE9E1]"
                  }`}
                >
                  {currentStatus.replace("_", " ")}
                </span>
              </div>

              {/* Status Radio Buttons */}
              <div className="grid grid-cols-4 gap-1.5 pt-3 border-t border-[#EBE9E1]">
                {statusOptions.map((opt) => {
                  const isSelected = currentStatus === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      aria-label={`Set ${p.name} status to ${opt.label}`}
                      onClick={() => handleSetPrayerStatus(p.key, opt.value)}
                      className={`py-1.5 rounded-xl text-[10px] font-semibold transition-all border ${
                        isSelected
                          ? "bg-[#5A6A5A] text-white border-[#5A6A5A] shadow-xs"
                          : "bg-[#F1EFEC] text-[#6B6A65] border-[#EBE9E1] hover:bg-[#EBE9E1]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Islamic Trackers Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tahajjud Card */}
        <div className="p-6 rounded-[28px] bg-white border border-[#EBE9E1] flex items-center justify-between shadow-xs">
          <div>
            <div className="text-base font-serif italic font-bold text-[#2D2D2A]">Tahajjud Night Prayer</div>
            <div className="text-xs text-[#6B6A65] mt-0.5">Spiritual excellence at night</div>
            <div className="text-[11px] text-[#B07D62] font-semibold mt-2">+20 XP Bonus</div>
          </div>
          <button
            type="button"
            aria-label="Toggle Tahajjud night prayer status"
            onClick={toggleTahajjud}
            className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-all ${
              salah.tahajjud
                ? "bg-[#5A6A5A] text-white border-[#5A6A5A] shadow-sm"
                : "bg-[#F1EFEC] text-[#6B6A65] border-[#EBE9E1]"
            }`}
          >
            <Check className="w-6 h-6" />
          </button>
        </div>

        {/* Digital Dhikr Counter */}
        <div className="p-6 rounded-[28px] bg-white border border-[#EBE9E1] space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-base font-serif italic font-bold text-[#2D2D2A]">Daily Dhikr Counter</span>
            <span className="text-xs text-[#5A6A5A] font-bold">{dhikrCount} / {dhikrTarget}</span>
          </div>
          <div className="flex items-center justify-between gap-2.5">
            <button
              type="button"
              aria-label="Increment Dhikr count"
              onClick={handleIncrementDhikr}
              className="flex-1 py-3 rounded-2xl bg-[#5A6A5A] hover:bg-[#4f5f4f] text-white font-bold text-xs shadow-xs transition-all text-center"
            >
              SubhanAllah / Alhamdulillah (+1)
            </button>
            <button
              type="button"
              aria-label="Reset Dhikr counter"
              onClick={() => {
                setDhikrCount(0);
                const updated = { ...salah, dhikrCount: 0 };
                setSalah(updated);
                StorageEngine.setSalahLog(updated);
              }}
              className="px-3 py-3 rounded-2xl bg-[#F1EFEC] hover:bg-[#EBE9E1] text-[#6B6A65] text-xs font-medium border border-[#EBE9E1]"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Quran Reading Tracker */}
        <div className="p-6 rounded-[28px] bg-white border border-[#EBE9E1] space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-base font-serif italic font-bold text-[#2D2D2A]">Quran Pages Read</span>
            <span className="text-xs text-[#B07D62] font-bold">{quranPages} Pages Today</span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Add 2 Quran pages read"
              onClick={() => handleAddQuranPages(2)}
              className="flex-1 py-2.5 rounded-xl bg-[#F1EFEC] hover:bg-[#EBE9E1] text-[#2D2D2A] text-xs font-semibold border border-[#EBE9E1]"
            >
              +2 Pages
            </button>
            <button
              type="button"
              aria-label="Add 5 Quran pages read"
              onClick={() => handleAddQuranPages(5)}
              className="flex-1 py-2.5 rounded-xl bg-[#F1EFEC] hover:bg-[#EBE9E1] text-[#2D2D2A] text-xs font-semibold border border-[#EBE9E1]"
            >
              +5 Pages
            </button>
            <button
              type="button"
              aria-label="Add 10 Quran pages read"
              onClick={() => handleAddQuranPages(10)}
              className="flex-1 py-2.5 rounded-xl bg-[#5A6A5A] text-white hover:bg-[#4f5f4f] text-xs font-semibold shadow-xs"
            >
              +10 Pages
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
