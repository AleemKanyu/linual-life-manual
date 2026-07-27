import React from "react";
import { BookOpen, Compass, ShieldCheck, Target, CheckSquare, Wallet, GraduationCap, FolderLock, Sparkles, ArrowRight, Layers } from "lucide-react";

export const SystemGuideView: React.FC = () => {
  return (
    <div className="space-y-6 pb-12 text-[#2D2D2A]">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-[#EBE9E1] shadow-xs space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#5A6A5A]/10 text-[#5A6A5A] flex items-center justify-center font-serif font-bold text-xl border border-[#5A6A5A]/20">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] px-3 py-0.5 rounded-full bg-[#5A6A5A]/10 text-[#5A6A5A] font-extrabold uppercase tracking-wider">
              Linual LifeOS User Guide
            </span>
            <h2 className="text-2xl font-serif italic text-[#2D2D2A] mt-1">System Architecture & Personal Flow Guide</h2>
          </div>
        </div>
        <p className="text-xs text-[#6B6A65] leading-relaxed max-w-3xl">
          Welcome to Linual LifeOS — your private, offline-first personal operating system and digital manual.
          This guide outlines the general flow of managing your daily routines, long-term goals, financial allowance, and encrypted identity vault.
        </p>
      </div>

      {/* Recommended 4-Pillar Daily System Flow */}
      <div className="rounded-[32px] bg-white border border-[#EBE9E1] p-6 sm:p-8 space-y-4 shadow-xs">
        <h3 className="text-base font-serif italic font-bold text-[#2D2D2A] flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#5A6A5A]" />
          <span>Recommended Daily Operating Workflow</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-5 rounded-2xl bg-[#FAF9F6] border border-[#EBE9E1] space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#5A6A5A]">
              <span className="w-6 h-6 rounded-full bg-[#5A6A5A] text-white flex items-center justify-center text-[10px]">1</span>
              <span>Morning Ritual & Daily Habits</span>
            </div>
            <p className="text-[#6B6A65] text-[11px] leading-relaxed">
              Start your day by logging daily Salah, water intake, habit streaks, and reviewing pending tasks on your Dashboard. Earn +10 XP per completed item!
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF9F6] border border-[#EBE9E1] space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#5A6A5A]">
              <span className="w-6 h-6 rounded-full bg-[#5A6A5A] text-white flex items-center justify-center text-[10px]">2</span>
              <span>Deep Work & Student Study</span>
            </div>
            <p className="text-[#6B6A65] text-[11px] leading-relaxed">
              Use the built-in 25-minute Pomodoro timer in the Student module to focus on coursework, assignments, and reading books.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF9F6] border border-[#EBE9E1] space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#5A6A5A]">
              <span className="w-6 h-6 rounded-full bg-[#5A6A5A] text-white flex items-center justify-center text-[10px]">3</span>
              <span>Finance & Expense Tracking</span>
            </div>
            <p className="text-[#6B6A65] text-[11px] leading-relaxed">
              Record daily expenses and income in the Finance module. Keep track of category budget thresholds and overall savings.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF9F6] border border-[#EBE9E1] space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#5A6A5A]">
              <span className="w-6 h-6 rounded-full bg-[#5A6A5A] text-white flex items-center justify-center text-[10px]">4</span>
              <span>Evening Reflection & Identity Vault</span>
            </div>
            <p className="text-[#6B6A65] text-[11px] leading-relaxed">
              Reflect in your journal, log mood/energy metrics, update your encrypted Life Manual identity vault, and export a 1-click JSON backup.
            </p>
          </div>
        </div>
      </div>

      {/* Module Overview Map */}
      <div className="rounded-[32px] bg-white border border-[#EBE9E1] p-6 sm:p-8 space-y-4 shadow-xs">
        <h3 className="text-base font-serif italic font-bold text-[#2D2D2A]">Module Quick Reference Guide</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          {[
            { title: "Life Manual", icon: FolderLock, desc: "Encrypted passport/ID vault, family tree, certificates & milestones." },
            { title: "Salah & Islamic", icon: Compass, desc: "Daily Salah times, Quran pages read, dhikr counter & spiritual notes." },
            { title: "Goals & Matrix", icon: Target, desc: "Quarterly/annual goal roadmap with progress percentage bars." },
            { title: "Habit Heatmap", icon: CheckSquare, desc: "Atomic habit tracking with day streak counters & canvas celebration." },
            { title: "Finance Vault", icon: Wallet, desc: "Allowance tracking, expense categorization & budget limit alerts." },
            { title: "Student Planner", icon: GraduationCap, desc: "Course GPA targets, problem set deadlines & Pomodoro study timer." },
          ].map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.title} className="p-4 rounded-2xl bg-[#F1EFEC] border border-[#EBE9E1] space-y-1">
                <div className="flex items-center gap-2 font-bold text-[#2D2D2A]">
                  <Icon className="w-4 h-4 text-[#5A6A5A]" />
                  <span>{m.title}</span>
                </div>
                <p className="text-[11px] text-[#6B6A65] leading-relaxed">{m.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
