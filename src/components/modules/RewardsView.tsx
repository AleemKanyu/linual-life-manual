import React from "react";
import { Trophy, Award, Zap, Moon, Flame, GraduationCap, Wallet, Check, Lock } from "lucide-react";
import { StorageEngine } from "../../lib/storage";
import { calculateLevel, calculateDailyBalanceScore } from "../../lib/xpEngine";

export const RewardsView: React.FC = () => {
  const appState = StorageEngine.getAppState();
  const xp = appState.userXp;
  const levelInfo = calculateLevel(xp);
  const badges = appState.badges;

  const renderBadgeIcon = (iconKey: string) => {
    switch (iconKey.toLowerCase()) {
      case "moon":
      case "fajr":
        return <Moon className="w-5 h-5 text-[#B07D62]" />;
      case "flame":
      case "fire":
      case "streak":
        return <Flame className="w-5 h-5 text-[#B07D62]" />;
      case "graduation-cap":
      case "academic":
      case "scholar":
        return <GraduationCap className="w-5 h-5 text-[#B07D62]" />;
      case "wallet":
      case "finance":
      case "money":
        return <Wallet className="w-5 h-5 text-[#B07D62]" />;
      default:
        return <Award className="w-5 h-5 text-[#B07D62]" />;
    }
  };

  const salah = StorageEngine.getSalahLog();
  const tasks = StorageEngine.getTasks();
  const balanceScore = calculateDailyBalanceScore(salah, [], tasks, [], []);

  return (
    <div className="space-y-6 pb-12 text-[#2D2D2A]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-[32px] border border-[#EBE9E1] shadow-xs">
        <div>
          <h2 className="text-2xl font-serif italic text-[#2D2D2A] flex items-center gap-2">
            <Trophy className="w-6 h-6 text-[#5A6A5A]" />
            <span>Gamification, XP & Life Balance Score</span>
          </h2>
          <p className="text-xs text-[#6B6A65] mt-1">
            Level up your personal life operating system through consistent spiritual, physical, academic, and financial habits.
          </p>
        </div>
      </div>

      {/* Hero Level Progress Card */}
      <div className="rounded-[32px] bg-white border border-[#EBE9E1] p-6 md:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-[#5A6A5A] text-white font-serif font-bold text-2xl flex items-center justify-center shadow-xs">
              L{levelInfo.level}
            </div>
            <div>
              <div className="text-xs text-[#B07D62] font-semibold uppercase tracking-wider">
                Current Level Title
              </div>
              <h3 className="text-2xl font-serif italic font-bold text-[#2D2D2A]">{levelInfo.title}</h3>
              <p className="text-xs text-[#6B6A65] mt-0.5">{xp} Total XP Accumulated</p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-[#6B6A65]">Next Level Requirement</div>
            <div className="text-base font-bold text-[#5A6A5A]">
              {levelInfo.xpInCurrentLevel} / {levelInfo.xpForNextLevel} XP
            </div>
          </div>
        </div>

        {/* Level XP Bar */}
        <div className="space-y-1.5">
          <div className="w-full h-3 rounded-full bg-[#F0EEE6] overflow-hidden">
            <div
              className="h-full bg-[#5A6A5A] rounded-full transition-all duration-500"
              style={{ width: `${levelInfo.progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-[#6B6A65] font-semibold">
            <span>{levelInfo.currentXp} / {levelInfo.level * 500} XP</span>
            <span>{levelInfo.progressPercent}% Progress</span>
          </div>
        </div>
      </div>

      {/* Holistic Life Pillar Scores */}
      <div className="rounded-[32px] bg-white border border-[#EBE9E1] p-6 sm:p-8 space-y-4 shadow-xs">
        <h3 className="text-base font-serif italic font-bold text-[#2D2D2A] flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#B07D62]" />
          <span>Holistic Daily Balance Pillars</span>
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: "Spiritual & Salah", score: balanceScore.spiritualScore, color: "text-[#5A6A5A]" },
            { label: "Daily Productivity", score: balanceScore.productivityScore, color: "text-[#B07D62]" },
            { label: "Health & Fitness", score: balanceScore.healthScore, color: "text-[#5A6A5A]" },
            { label: "Academic & Learning", score: balanceScore.studyScore, color: "text-[#5A6A5A]" },
            { label: "Finance & Budget", score: balanceScore.financeScore, color: "text-[#B07D62]" },
          ].map((pillar) => (
            <div key={pillar.label} className="p-4 rounded-2xl bg-[#F1EFEC] border border-[#EBE9E1] text-center space-y-1">
              <div className="text-[11px] text-[#6B6A65] font-semibold">{pillar.label}</div>
              <div className={`text-xl font-bold ${pillar.color}`}>{pillar.score} / 100</div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievement Badges Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-serif italic font-bold text-[#2D2D2A] flex items-center gap-2">
          <Award className="w-4 h-4 text-[#B07D62]" />
          <span>Unlocked Badges & Trophies</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`p-6 rounded-[28px] border transition-all flex flex-col justify-between space-y-3 shadow-xs ${
                b.unlocked
                  ? "bg-white border-[#5A6A5A]/40"
                  : "bg-white/60 border-[#EBE9E1] opacity-60"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#B07D62]/10 text-[#B07D62] flex items-center justify-center font-bold text-xl border border-[#B07D62]/20 shrink-0">
                  {renderBadgeIcon(b.icon)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#2D2D2A]">{b.title}</h4>
                  <p className="text-[10px] text-[#6B6A65] mt-0.5">{b.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] pt-2 border-t border-[#EBE9E1]">
                <span className="text-[#B07D62] font-semibold">+{b.xpReward} XP Reward</span>
                <span className={`flex items-center gap-1 ${b.unlocked ? "text-[#5A6A5A] font-bold" : "text-[#6B6A65]"}`}>
                  {b.unlocked ? (
                    <>
                      <Check className="w-3 h-3 text-[#5A6A5A]" />
                      <span>Unlocked</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3 h-3 text-[#6B6A65]" />
                      <span>Locked</span>
                    </>
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
