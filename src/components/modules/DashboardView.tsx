import React, { useState, useMemo } from "react";
import {
  Sparkles,
  CheckCircle2,
  Calendar,
  Flame,
  Droplet,
  BookOpen,
  DollarSign,
  Activity,
  ArrowRight,
  Zap,
} from "lucide-react";
import { StorageEngine } from "../../lib/storage";
import { calculateDailyBalanceScore } from "../../lib/xpEngine";
import { SalahLog, Habit, Task, Goal, Transaction, HealthMetrics } from "../../types";
import { DualCalendarHeader } from "../DualCalendarHeader";
import { getHijriDate } from "../../lib/hijriCalendar";

interface DashboardViewProps {
  onNavigate: (moduleKey: string) => void;
  onOpenAI: () => void;
  onXpChange: (delta: number) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate, onOpenAI, onXpChange }) => {
  const appState = StorageEngine.getAppState();
  const profile = appState?.userProfile || { fullName: "User", nickname: "User", avatarUrl: "", bio: "" };
  const userXp = appState?.userXp || 0;
  const [salah, setSalah] = useState<SalahLog>(() => StorageEngine.getSalahLog() || { date: "", fajr: "pending", dhuhr: "pending", asr: "pending", maghrib: "pending", isha: "pending", witr: "pending", quranPagesRead: 0, dhikrCount: 0, fasting: false, notes: "" });
  const [habits] = useState<Habit[]>(() => StorageEngine.getHabits() || []);
  const [tasks, setTasks] = useState<Task[]>(() => StorageEngine.getTasks() || []);
  const [goals] = useState<Goal[]>(() => StorageEngine.getGoals() || []);
  const [txs] = useState<Transaction[]>(() => StorageEngine.getFinance() || []);
  const [health, setHealth] = useState<HealthMetrics>(() => StorageEngine.getHealth() || { date: "", weightKg: 0, sleepHours: 0, waterMl: 0, steps: 0, caloriesBurned: 0 });
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // Memoized date and calculations for performance
  const todayHijri = useMemo(() => getHijriDate(), []);
  const dailyScore = useMemo(() => calculateDailyBalanceScore(salah, [], tasks, [], []), [salah, tasks]);
  const netBalance = useMemo(
    () => (txs.filter((t) => t.type === "income").reduce((a, c) => a + c.amount, 0) - txs.filter((t) => t.type === "expense").reduce((a, c) => a + c.amount, 0)).toFixed(2),
    [txs]
  );

  // Water increment
  const addWater = (amountMl: number) => {
    const currentMl = health?.waterMl || 0;
    const updated = { ...health, waterMl: currentMl + amountMl };
    setHealth(updated);
    StorageEngine.setHealth(updated);
    onXpChange(5);
  };

  // Toggle Salah status
  const toggleSalah = (prayerKey: "fajr" | "dhuhr" | "asr" | "maghrib" | "isha" | "witr") => {
    const current = salah[prayerKey];
    const order: Array<"pending" | "on_time" | "late" | "qaza" | "missed"> = ["pending", "on_time", "late", "qaza", "missed"];
    const nextIdx = (order.indexOf(current) + 1) % order.length;
    const nextStatus = order[nextIdx];
    const updated = { ...salah, [prayerKey]: nextStatus };
    setSalah(updated);
    StorageEngine.setSalahLog(updated);
    if (nextStatus === "on_time") onXpChange(10);
  };

  // Toggle Task
  const toggleTask = (taskId: string) => {
    const updated = tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t));
    setTasks(updated);
    StorageEngine.setTasks(updated);
    onXpChange(10);
  };

  // Fetch AI Daily Briefing with offline error handling
  const generateAiBriefing = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch("/api/ai/daily-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lifeContext: { profile, salah, habits, tasks, goals } }),
      });
      if (!res.ok) throw new Error("API unavailable");
      const data = await res.json();
      if (data.summary) {
        setAiSummary(data.summary);
      } else {
        setAiSummary("Linual AI: Maintain consistency across Fajr, habits, and tasks today for maximum Life XP!");
      }
    } catch (e) {
      console.warn("AI service offline, using fallback briefing:", e);
      setAiSummary("Linual AI: Vault initialized. Keep up daily prayers, habits, and tasks to boost your Life XP!");
    } finally {
      setLoadingAi(false);
    }
  };

  const getSalahBadgeStyle = (status: string) => {
    switch (status) {
      case "on_time":
        return "bg-white/20 text-white border-white/30";
      case "late":
        return "bg-amber-100/20 text-amber-100 border-amber-200/30";
      case "qaza":
        return "bg-orange-100/20 text-orange-100 border-orange-200/30";
      case "missed":
        return "bg-rose-100/20 text-rose-100 border-rose-200/30";
      default:
        return "bg-white/10 text-white/60 border-white/10";
    }
  };

  return (
    <div className="space-y-8 pb-12 text-[#2D2D2A]">
      {/* Header Greeting Bar */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 bg-white p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] border border-[#EBE9E1] shadow-xs">
        <div>
          <p className="text-xs font-semibold tracking-widest text-[#B07D62] uppercase mb-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{todayHijri.fullDualString}</span>
          </p>
          <h1 className="text-3xl sm:text-4xl font-serif italic text-[#2D2D2A]">
            Assalamu Alaikum, {profile.nickname || profile.fullName || "User"}
          </h1>
          <p className="text-xs sm:text-sm text-[#6B6A65] mt-1">
            Welcome to your digital life manual. Here is your holistic progress overview across spiritual, academic, health, and financial pillars.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-[#F1EFEC] px-6 py-3.5 rounded-3xl border border-[#EBE9E1] self-start sm:self-auto">
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-wider text-[#6B6A65] font-bold">Life XP</span>
            <span className="text-lg font-bold text-[#5A6A5A]">{userXp} XP</span>
          </div>
          <div className="w-11 h-11 rounded-full border-4 border-[#5A6A5A] border-t-[#EBE9E1] flex flex-col items-center justify-center text-[11px] font-black text-[#5A6A5A]">
            {dailyScore.overallScore}
          </div>
        </div>
      </header>

      {/* Dual Gregorian & Hijri Calendar Integration Card */}
      <DualCalendarHeader onXpChange={onXpChange} variant="full" />

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Primary Vision Banner */}
        <section className="lg:col-span-8 bg-white rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 border border-[#EBE9E1] flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#6B6A65] opacity-70">Primary Vision</h2>
              <button
                onClick={generateAiBriefing}
                disabled={loadingAi}
                className="px-4 py-1.5 rounded-full bg-[#F1EFEC] hover:bg-[#EBE9E1] text-[#5A6A5A] font-semibold text-xs transition-all flex items-center gap-1.5 border border-[#EBE9E1] cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#B07D62]" />
                <span>{loadingAi ? "Analyzing..." : "Generate AI Briefing"}</span>
              </button>
            </div>

            {goals.length > 0 ? (
              <div>
                <h3 className="text-2xl sm:text-4xl font-serif leading-snug text-[#2D2D2A]">
                  {goals[0].title}
                </h3>
                {goals[0].description && (
                  <p className="text-xs sm:text-sm text-[#6B6A65] mt-2 leading-relaxed">
                    {goals[0].description}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-2 py-2">
                <h3 className="text-xl sm:text-3xl font-serif leading-snug text-[#2D2D2A] italic">
                  Define Your Primary Vision
                </h3>
                <p className="text-xs sm:text-sm text-[#6B6A65] leading-relaxed">
                  No primary goal set yet. Add your first goal to define your personal vision and track milestones.
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-12 mt-6 pt-6 border-t border-[#EBE9E1]">
            {goals.length > 0 ? (
              <>
                <div>
                  <p className="text-3xl font-serif text-[#5A6A5A]">{goals[0].targetYear || new Date().getFullYear()}</p>
                  <p className="text-[10px] uppercase tracking-widest text-[#6B6A65] font-bold">Target Year</p>
                </div>
                <div className="flex-1">
                  <div className="h-2.5 bg-[#F0EEE6] rounded-full overflow-hidden">
                    <div className="h-full bg-[#5A6A5A] rounded-full transition-all duration-500" style={{ width: `${goals[0].progress ?? goals[0].progressPercent ?? 0}%` }}></div>
                  </div>
                  <p className="text-[10px] uppercase tracking-widest text-[#6B6A65] font-bold mt-2">
                    {goals[0].progress ?? goals[0].progressPercent ?? 0}% Goal Completion
                  </p>
                </div>
              </>
            ) : (
              <button
                onClick={() => onNavigate("goals")}
                className="px-5 py-2.5 rounded-2xl bg-[#5A6A5A] hover:bg-[#4f5f4f] text-white text-xs font-semibold transition-all shadow-xs w-fit cursor-pointer"
              >
                Set Primary Goal →
              </button>
            )}
          </div>
        </section>

        {/* Salah Status Card */}
        <section
          onClick={() => onNavigate("salah")}
          className="lg:col-span-4 bg-[#5A6A5A] text-white rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 flex flex-col justify-between shadow-md cursor-pointer hover:bg-[#4f5f4f] transition-all group"
        >
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest opacity-70">Salah Status</h2>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 bg-white/10 rounded-full">
                Spiritual
              </span>
            </div>
            <div className="flex flex-col gap-3.5">
              {(
                [
                  { key: "fajr", label: "Fajr" },
                  { key: "dhuhr", label: "Dhuhr" },
                  { key: "asr", label: "Asr" },
                  { key: "maghrib", label: "Maghrib" },
                  { key: "isha", label: "Isha" },
                ] as const
              ).map((p) => {
                const status = salah[p.key] || "pending";
                return (
                  <button
                    key={p.key}
                    type="button"
                    aria-label={`Toggle ${p.label} prayer status`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSalah(p.key);
                    }}
                    className="w-full flex justify-between items-center py-1 border-b border-white/10 hover:border-white/30 transition-colors text-left cursor-pointer"
                  >
                    <span className="font-serif text-lg italic">{p.label}</span>
                    <span
                      className={`px-3 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-widest border ${getSalahBadgeStyle(
                        status
                      )}`}
                    >
                      {status.replace("_", " ")}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/80 font-medium">
            <span>Log All Prayers & Quran →</span>
            <Zap className="w-4 h-4 text-amber-200" />
          </div>
        </section>
      </div>

      {/* AI Daily Briefing Box */}
      {aiSummary && (
        <div className="rounded-[32px] bg-white border border-[#B07D62]/40 p-6 sm:p-8 shadow-sm text-[#2D2D2A]">
          <div className="flex items-center justify-between mb-3 border-b border-[#EBE9E1] pb-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#B07D62]">
              <Sparkles className="w-4 h-4 text-[#B07D62]" />
              <span>Linual AI Daily Briefing & Timeblock Schedule</span>
            </div>
            <button onClick={() => setAiSummary(null)} className="text-xs text-[#6B6A65] hover:text-[#2D2D2A]">
              Dismiss
            </button>
          </div>
          <div className="text-xs text-[#2D2D2A] space-y-2 whitespace-pre-line leading-relaxed font-normal">
            {aiSummary}
          </div>
        </div>
      )}

      {/* Second Grid Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Daily Habits Card */}
        <section className="md:col-span-4 bg-[#F1EFEC] rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 border border-[#EBE9E1]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#6B6A65]">Daily Habits</h2>
            <button
              onClick={() => onNavigate("habits")}
              className="text-xs text-[#5A6A5A] hover:underline font-semibold"
            >
              View All
            </button>
          </div>
          <div className="space-y-5">
            {habits.length === 0 ? (
              <p className="text-xs text-[#6B6A65] italic py-2">No active habits. Add a habit to start tracking daily momentum.</p>
            ) : (
              habits.slice(0, 3).map((habit) => (
                <div key={habit.id} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-[#EBE9E1] shadow-xs">
                    {habit.category === "Spiritual" ? (
                      <BookOpen className="w-5 h-5 text-[#5A6A5A]" />
                    ) : habit.category === "Health" ? (
                      <Activity className="w-5 h-5 text-[#B07D62]" />
                    ) : (
                      <Zap className="w-5 h-5 text-[#5A6A5A]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-[#2D2D2A]">{habit.name}</p>
                    <p className="text-[10px] text-[#6B6A65] uppercase tracking-widest font-semibold mt-0.5">
                      Streak: {habit.streak} Days
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Finance Mini Card */}
        <section
          onClick={() => onNavigate("finance")}
          className="md:col-span-4 bg-white rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 border border-[#EBE9E1] flex flex-col justify-between shadow-xs cursor-pointer hover:border-[#5A6A5A]/50 transition-all"
        >
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#6B6A65] mb-4">Wallet & Finances</h2>
            <div className="text-3xl font-serif text-[#5A6A5A] mb-1">
              ${netBalance}
            </div>
            <p className="text-[10px] uppercase tracking-widest text-[#6B6A65] font-bold mb-6">
              Net Balance
            </p>
          </div>
          <div>
            <div className="flex items-end gap-1.5 h-16 pt-2">
              <div className="w-full bg-[#B07D62] rounded-t-lg" style={{ height: "40%" }}></div>
              <div className="w-full bg-[#B07D62] rounded-t-lg" style={{ height: "65%" }}></div>
              <div className="w-full bg-[#B07D62] rounded-t-lg" style={{ height: "30%" }}></div>
              <div className="w-full bg-[#5A6A5A] rounded-t-lg" style={{ height: "90%" }}></div>
              <div className="w-full bg-[#EBE9E1] rounded-t-lg" style={{ height: "15%" }}></div>
              <div className="w-full bg-[#EBE9E1] rounded-t-lg" style={{ height: "10%" }}></div>
            </div>
            <p className="text-[10px] text-[#6B6A65] font-semibold mt-2 text-right">View Transaction History →</p>
          </div>
        </section>

        {/* AI Quick Insight */}
        <section className="md:col-span-4 bg-[#B07D62] text-white rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 border border-[#B07D62] flex flex-col justify-between shadow-md">
          <div>
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest opacity-80">AI Insight</h2>
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
            <p className="font-serif text-lg sm:text-xl leading-relaxed italic">
              "Your vault is initialized with a clean slate. Log daily prayers, habits, and goals to unlock tailored timeblock advice."
            </p>
          </div>
          <button
            onClick={onOpenAI}
            className="mt-6 px-5 py-2.5 bg-white/15 hover:bg-white/25 rounded-full text-[10px] font-bold uppercase tracking-widest text-white transition-all text-center border border-white/20 cursor-pointer"
          >
            Ask Linual AI Assistant →
          </button>
        </section>
      </div>

      {/* Today's Priority Tasks & Water Intake Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-8 bg-white rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 border border-[#EBE9E1] space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#2D2D2A]">Today's Priority Tasks</h3>
            <button
              onClick={() => onNavigate("tasks")}
              className="text-xs text-[#5A6A5A] hover:underline font-semibold"
            >
              Manage Tasks →
            </button>
          </div>

          <div className="space-y-2.5">
            {tasks.length === 0 ? (
              <p className="text-xs text-[#6B6A65] italic py-3">No pending tasks for today. Add a task to start organizing your day.</p>
            ) : (
              tasks.slice(0, 4).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  aria-label={`Toggle task completion for ${t.title}`}
                  onClick={() => toggleTask(t.id)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                    t.completed
                      ? "bg-[#F1EFEC] border-[#EBE9E1] text-[#6B6A65] line-through"
                      : "bg-white border-[#EBE9E1] text-[#2D2D2A] hover:border-[#5A6A5A]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className={`w-4 h-4 ${t.completed ? "text-[#5A6A5A]" : "text-[#EBE9E1]"}`} />
                    <span className="text-xs font-semibold">{t.title}</span>
                  </div>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#F1EFEC] text-[#6B6A65] font-mono">
                    {t.category}
                  </span>
                </button>
              ))
            )}
          </div>
        </section>

        {/* Hydration Widget */}
        <section className="lg:col-span-4 bg-[#F1EFEC] rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 border border-[#EBE9E1] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-[#6B6A65] font-bold uppercase tracking-widest mb-2">
              <span>Water Hydration</span>
              <Droplet className="w-4 h-4 text-[#5A6A5A]" />
            </div>
            <div className="text-2xl font-serif text-[#5A6A5A] my-2">{(health?.waterMl || 0)} / 3000 ml</div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => addWater(250)}
              className="flex-1 py-2 text-xs rounded-xl bg-white hover:bg-[#EBE9E1] text-[#2D2D2A] font-medium border border-[#EBE9E1] shadow-xs"
            >
              +250ml
            </button>
            <button
              onClick={() => addWater(500)}
              className="flex-1 py-2 text-xs rounded-xl bg-[#5A6A5A] hover:bg-[#4f5f4f] text-white font-medium shadow-xs"
            >
              +500ml
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
