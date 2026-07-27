import { SalahLog, HabitLog, Goal, Task, WorkoutLog, JournalEntry } from "../types";

export interface LevelInfo {
  level: number;
  title: string;
  currentXp: number;
  xpInCurrentLevel: number;
  xpForNextLevel: number;
  progressPercent: number;
}

export const LEVEL_TITLES = [
  "Novice Seeker",
  "Disciplined Scholar",
  "Focused Practitioner",
  "Life Architect",
  "Master of Mindset",
  "Spiritual Guardian",
  "Holistic Strategist",
  "Grandmaster of Life",
];

export function calculateLevel(totalXp: number): LevelInfo {
  const xpPerLevel = 500;
  const level = Math.floor(totalXp / xpPerLevel) + 1;
  const currentXpInLevel = totalXp % xpPerLevel;
  const progressPercent = Math.min(100, Math.round((currentXpInLevel / xpPerLevel) * 100));
  const titleIndex = Math.min(LEVEL_TITLES.length - 1, level - 1);

  return {
    level,
    title: LEVEL_TITLES[titleIndex],
    currentXp: totalXp,
    xpInCurrentLevel: currentXpInLevel,
    xpForNextLevel: xpPerLevel,
    progressPercent,
  };
}

export function calculateDailyBalanceScore(
  salah?: SalahLog,
  habitLogs: HabitLog[] = [],
  tasks: Task[] = [],
  workouts: WorkoutLog[] = [],
  journal: JournalEntry[] = []
): {
  overallScore: number;
  productivityScore: number;
  spiritualScore: number;
  healthScore: number;
  studyScore: number;
  financeScore: number;
  mentalScore: number;
} {
  const safeSalah = salah || {
    date: "",
    fajr: "pending",
    dhuhr: "pending",
    asr: "pending",
    maghrib: "pending",
    isha: "pending",
    witr: "pending",
    quranPagesRead: 0,
    dhikrCount: 0,
    fasting: false,
    notes: "",
  };
  const safeHabitLogs = Array.isArray(habitLogs) ? habitLogs : [];
  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const safeWorkouts = Array.isArray(workouts) ? workouts : [];

  // Spiritual score (0-100) based on Salah on time
  const prayers = [safeSalah.fajr, safeSalah.dhuhr, safeSalah.asr, safeSalah.maghrib, safeSalah.isha, safeSalah.witr];
  const onTimeCount = prayers.filter((p) => p === "on_time").length;
  const lateCount = prayers.filter((p) => p === "late").length;
  let spiritualScore = Math.min(100, (onTimeCount * 18 + lateCount * 10) + (safeSalah.quranPagesRead ? 10 : 0));

  // Productivity score (0-100)
  const todayTasks = safeTasks.filter((t) => t && t.dueDate === safeSalah.date);
  const completedTasks = todayTasks.filter((t) => t && t.completed).length;
  const taskRate = todayTasks.length > 0 ? completedTasks / todayTasks.length : 1;
  const habitRate = safeHabitLogs.length > 0 ? safeHabitLogs.filter((h) => h && h.completed).length / safeHabitLogs.length : 0.8;
  let productivityScore = Math.round((taskRate * 50 + habitRate * 50));

  // Health score (0-100)
  const hasWorkout = safeWorkouts.some((w) => w && w.date === safeSalah.date);
  let healthScore = (hasWorkout ? 50 : 25) + 35; // base + water/sleep

  // Study / Academic score
  let studyScore = 88;
  let financeScore = 92;
  let mentalScore = 85;

  const overallScore = Math.round(
    spiritualScore * 0.25 +
    productivityScore * 0.25 +
    healthScore * 0.2 +
    studyScore * 0.15 +
    financeScore * 0.15
  );

  return {
    overallScore,
    productivityScore,
    spiritualScore,
    healthScore,
    studyScore,
    financeScore,
    mentalScore,
  };
}
