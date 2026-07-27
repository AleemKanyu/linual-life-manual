import React, { useState } from "react";
import { CheckSquare, Flame, Plus, Calendar, Check, Trash2 } from "lucide-react";
import confetti from "canvas-confetti";
import { StorageEngine } from "../../lib/storage";
import { Habit, HabitLog } from "../../types";
import { CharacterArtImage } from "../GeneratedArt";

interface HabitTrackerViewProps {
  onXpChange: (delta: number) => void;
}

export const HabitTrackerView: React.FC<HabitTrackerViewProps> = ({ onXpChange }) => {
  const [habits, setHabits] = useState<Habit[]>(() => StorageEngine.getHabits());
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>(() => StorageEngine.getHabitLogs());
  const [showAddModal, setShowAddModal] = useState(false);

  const handleDeleteHabit = (id: string) => {
    if (!confirm("Delete this habit and its streak data? This cannot be undone.")) return;
    setHabits(StorageEngine.deleteHabit(id));
    setHabitLogs(StorageEngine.getHabitLogs());
  };

  // New habit state
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Health");
  const [type] = useState<Habit["type"]>("checkbox");
  const [target] = useState(1);
  const [unit] = useState("");

  const todayStr = new Date().toISOString().split("T")[0];

  const handleToggleHabit = (habitId: string) => {
    const existingLogIndex = habitLogs.findIndex((l) => l.habitId === habitId && l.date === todayStr);
    let updatedLogs = [...habitLogs];
    let isCompleted = false;
    let isFirstXpClaim = false;

    if (existingLogIndex >= 0) {
      const existingLog = updatedLogs[existingLogIndex];
      isCompleted = !existingLog.completed;
      isFirstXpClaim = isCompleted && !existingLog.xpClaimed;
      updatedLogs[existingLogIndex] = {
        ...existingLog,
        completed: isCompleted,
        xpClaimed: existingLog.xpClaimed || isFirstXpClaim,
      };
    } else {
      isCompleted = true;
      isFirstXpClaim = true;
      updatedLogs.push({ habitId, date: todayStr, completed: true, xpClaimed: true });
    }

    setHabitLogs(updatedLogs);
    StorageEngine.setHabitLogs(updatedLogs);

    // Update streak
    const updatedHabits = habits.map((h) => {
      if (h.id === habitId) {
        const newStreak = isCompleted ? h.streak + 1 : Math.max(0, h.streak - 1);
        const longest = Math.max(newStreak, h.longestStreak);
        return { ...h, streak: newStreak, longestStreak: longest };
      }
      return h;
    });

    setHabits(updatedHabits);
    StorageEngine.setHabits(updatedHabits);

    if (isFirstXpClaim) {
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 } });
      onXpChange(10);
    }
  };

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;
    const newHabit: Habit = {
      id: "h_" + Date.now(),
      name: trimmedName,
      category,
      type,
      target,
      unit,
      frequency: "daily",
      streak: 1,
      longestStreak: 1,
      color: "#5A6A5A",
    };
    const updated = [...habits, newHabit];
    setHabits(updated);
    StorageEngine.setHabits(updated);
    setShowAddModal(false);
    setName("");
    onXpChange(15);
  };

  return (
    <div className="space-y-6 pb-12 text-[#2D2D2A]">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 bg-white p-5 sm:p-7 rounded-[32px] border border-[#EBE9E1] shadow-xs">
        <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 min-w-0 flex-1">
          <div className="w-14 h-14 sm:w-20 sm:h-20 shrink-0 rounded-2xl bg-[#F1EFEC] border border-[#EBE9E1] p-1 flex items-center justify-center overflow-hidden shadow-xs">
            <CharacterArtImage type="habit" className="w-full h-full" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg sm:text-2xl font-serif italic text-[#2D2D2A] leading-tight">
              Habit Tracker & Consistency Matrix
            </h2>
            <p className="text-xs text-[#6B6A65] mt-1 leading-normal">
              Build unshakeable daily momentum through atomic habits, streaks, and target tracking.
            </p>
          </div>
        </div>

        <button
          type="button"
          aria-label="Add Custom Habit"
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto justify-center px-4 py-2.5 rounded-2xl bg-[#5A6A5A] hover:bg-[#4f5f4f] text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Habit</span>
        </button>
      </div>

      {/* Habit Cards */}
      {habits.length === 0 ? (
        <div className="p-12 text-center bg-white border border-[#EBE9E1] rounded-[32px] space-y-3">
          <CheckSquare className="w-10 h-10 mx-auto text-[#5A6A5A]/60" />
          <h3 className="text-lg font-serif italic font-bold text-[#2D2D2A]">No Habits Tracked Yet</h3>
          <p className="text-xs text-[#6B6A65] max-w-sm mx-auto">
            Build unshakeable daily momentum through atomic habits, streaks, and target tracking.
          </p>
          <button
            type="button"
            aria-label="Add First Habit"
            onClick={() => setShowAddModal(true)}
            className="mt-2 px-5 py-2.5 rounded-2xl bg-[#5A6A5A] hover:bg-[#4f5f4f] text-white font-semibold text-xs inline-flex items-center gap-2 transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Habit (+15 XP)</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {habits.map((h) => {
          const log = habitLogs.find((l) => l.habitId === h.id && l.date === todayStr);
          const isDone = log?.completed;

          return (
            <div
              key={h.id}
              className={`p-6 rounded-[28px] border transition-all flex flex-col justify-between space-y-4 shadow-xs ${
                isDone
                  ? "bg-[#F1EFEC] border-[#5A6A5A]/40"
                  : "bg-white border-[#EBE9E1] hover:border-[#5A6A5A]/30"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#B07D62]/10 text-[#B07D62] font-semibold border border-[#B07D62]/20 uppercase tracking-wider">
                    {h.category}
                  </span>
                  <h3 className="text-base font-serif italic font-bold text-[#2D2D2A] mt-2">{h.name}</h3>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="flex items-center gap-1 text-xs text-[#B07D62] font-bold bg-[#B07D62]/10 border border-[#B07D62]/20 px-2.5 py-1 rounded-xl">
                    <Flame className="w-3.5 h-3.5 text-[#B07D62]" />
                    <span>{h.streak}d streak</span>
                  </div>
                  <button
                    type="button"
                    aria-label={`Delete habit ${h.name}`}
                    onClick={() => handleDeleteHabit(h.id)}
                    className="p-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                    title="Delete Habit"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Toggle Button */}
              <button
                type="button"
                aria-label={`Toggle completion for ${h.name}`}
                onClick={() => handleToggleHabit(h.id)}
                className={`w-full py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer ${
                  isDone
                    ? "bg-[#5A6A5A] text-white"
                    : "bg-[#F1EFEC] hover:bg-[#EBE9E1] text-[#2D2D2A] border border-[#EBE9E1]"
                }`}
              >
                <Check className={`w-4 h-4 ${isDone ? "text-white" : "text-[#6B6A65]"}`} />
                <span>{isDone ? "Completed for Today! (+10 XP)" : "Mark Complete Today"}</span>
              </button>

              <div className="flex items-center justify-between text-[11px] text-[#6B6A65] pt-2 border-t border-[#EBE9E1]">
                <span>Best Streak: {h.longestStreak} days</span>
                <span className="font-medium text-[#2D2D2A]">Target: {h.target} {h.unit}</span>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* 30-Day Habit Contribution Heatmap */}
      <div className="rounded-[32px] bg-white border border-[#EBE9E1] p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-serif italic font-bold text-[#2D2D2A] flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#5A6A5A]" />
            <span>30-Day Atomic Habit Heatmap</span>
          </h3>
          <div className="flex items-center gap-1.5 text-[11px] text-[#6B6A65] font-semibold">
            <span>Less</span>
            <div className="w-3 h-3 rounded bg-[#F1EFEC] border border-[#EBE9E1]" />
            <div className="w-3 h-3 rounded bg-[#B07D62]/40 border border-[#B07D62]/50" />
            <div className="w-3 h-3 rounded bg-[#5A6A5A]/70 border border-[#5A6A5A]/80" />
            <div className="w-3 h-3 rounded bg-[#5A6A5A] border border-[#5A6A5A]" />
            <span>More</span>
          </div>
        </div>

        {/* 30-Day GitHub-style Heatmap Grid */}
        <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-15 gap-2 pt-1">
          {Array.from({ length: 30 }).map((_, idx) => {
            const dayOffset = 29 - idx;
            const targetDate = new Date(Date.now() - dayOffset * 86400000);
            const dateStr = targetDate.toISOString().split("T")[0];
            const displayDate = targetDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });

            const logsOnDay = habitLogs.filter((l) => l.date === dateStr && l.completed);
            const totalHabits = Math.max(1, habits.length);
            const ratio = logsOnDay.length / totalHabits;

            let intensity = 0;
            if (ratio > 0.66) intensity = 3;
            else if (ratio > 0.33) intensity = 2;
            else if (logsOnDay.length > 0) intensity = 1;

            const colorClasses = [
              "bg-[#F1EFEC] border-[#EBE9E1]",
              "bg-[#B07D62]/40 border-[#B07D62]/50 text-[#2D2D2A]",
              "bg-[#5A6A5A]/70 border-[#5A6A5A]/80 text-white",
              "bg-[#5A6A5A] border-[#5A6A5A] text-white shadow-xs font-bold",
            ];

            return (
              <div
                key={dateStr}
                className={`p-2 rounded-xl border ${colorClasses[intensity]} flex flex-col justify-between h-14 text-left transition-all hover:scale-105 cursor-pointer`}
                title={`${displayDate}: ${logsOnDay.length} habits logged`}
              >
                <div className="text-[9px] opacity-70">{displayDate.split(" ")[1]}</div>
                <div className="text-xs font-mono font-bold">{logsOnDay.length}✓</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Habit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md p-6 sm:p-8 rounded-[32px] bg-white border border-[#EBE9E1] space-y-4 shadow-xl">
            <h3 className="text-xl font-serif italic font-bold text-[#2D2D2A]">Add New Daily Habit</h3>
            <form onSubmit={handleAddHabit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#6B6A65] font-semibold mb-1">Habit Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Read 20 mins before bed"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#F1EFEC] border border-[#EBE9E1] rounded-2xl px-4 py-2.5 text-[#2D2D2A] focus:outline-none focus:border-[#5A6A5A]"
                />
              </div>

              <div>
                <label className="block text-[#6B6A65] font-semibold mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#F1EFEC] border border-[#EBE9E1] rounded-2xl px-3 py-2 text-[#2D2D2A]"
                >
                  {["Health", "Spiritual", "Academic", "Physical", "Mental", "Finance"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-2.5 rounded-2xl bg-[#F1EFEC] text-[#2D2D2A] hover:bg-[#EBE9E1] font-semibold border border-[#EBE9E1]"
                >
                  Cancel
                </button>
                <button type="submit" className="w-1/2 py-2.5 rounded-2xl bg-[#5A6A5A] hover:bg-[#4f5f4f] text-white font-semibold shadow-xs">
                  Save Habit (+15 XP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
