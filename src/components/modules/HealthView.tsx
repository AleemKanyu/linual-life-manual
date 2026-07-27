import React, { useState } from "react";
import { Activity, Dumbbell, Utensils, Moon, Flame } from "lucide-react";
import { StorageEngine } from "../../lib/storage";
import { MealLog, WorkoutLog, HealthMetrics } from "../../types";

interface HealthViewProps {
  onXpChange: (delta: number) => void;
}

export const HealthView: React.FC<HealthViewProps> = ({ onXpChange }) => {
  const [health] = useState<HealthMetrics>(StorageEngine.getHealth());
  const [meals, setMeals] = useState<MealLog[]>(StorageEngine.getMeals());
  const [workouts, setWorkouts] = useState<WorkoutLog[]>(StorageEngine.getWorkouts());

  const [showMealModal, setShowMealModal] = useState(false);
  const [mealName, setMealName] = useState("");
  const [mealType] = useState<MealLog["mealType"]>("Breakfast");
  const [calories, setCalories] = useState(500);
  const [protein, setProtein] = useState(25);

  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [workoutTitle, setWorkoutTitle] = useState("");
  const [workoutCat, setWorkoutCat] = useState<WorkoutLog["category"]>("Gym");
  const [duration, setDuration] = useState(45);

  const totalCalories = meals.reduce((acc, curr) => acc + curr.calories, 0);
  const totalProtein = meals.reduce((acc, curr) => acc + curr.proteinG, 0);

  const handleAddMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealName) return;
    const newMeal: MealLog = {
      id: "m_" + Date.now(),
      date: new Date().toISOString().split("T")[0],
      mealType,
      name: mealName,
      calories: Number(calories),
      proteinG: Number(protein),
      carbsG: 40,
      fatG: 12,
    };
    const updated = [newMeal, ...meals];
    setMeals(updated);
    StorageEngine.setMeals(updated);
    setShowMealModal(false);
    setMealName("");
    onXpChange(10);
  };

  const handleAddWorkout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workoutTitle) return;
    const newWorkout: WorkoutLog = {
      id: "w_" + Date.now(),
      date: new Date().toISOString().split("T")[0],
      title: workoutTitle,
      category: workoutCat,
      durationMins: Number(duration),
      caloriesBurned: Number(duration) * 7,
    };
    const updated = [newWorkout, ...workouts];
    setWorkouts(updated);
    StorageEngine.setWorkouts(updated);
    setShowWorkoutModal(false);
    setWorkoutTitle("");
    onXpChange(20);
  };

  return (
    <div className="space-y-6 pb-12 text-[#2D2D2A]">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-[32px] border border-[#EBE9E1] shadow-xs">
        <div>
          <h2 className="text-2xl font-serif italic text-[#2D2D2A] flex items-center gap-2">
            <Activity className="w-6 h-6 text-[#5A6A5A]" />
            <span>Health, Nutrition & Workout Hub</span>
          </h2>
          <p className="text-xs text-[#6B6A65] mt-1">
            Track weight, sleep quality, step count, meal macros, and workout sessions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMealModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-[#F1EFEC] hover:bg-[#EBE9E1] text-[#2D2D2A] font-semibold text-xs flex items-center gap-1.5 border border-[#EBE9E1]"
          >
            <Utensils className="w-3.5 h-3.5 text-[#B07D62]" />
            <span>Log Meal</span>
          </button>
          <button
            onClick={() => setShowWorkoutModal(true)}
            className="px-5 py-2.5 rounded-2xl bg-[#5A6A5A] hover:bg-[#4f5f4f] text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs"
          >
            <Dumbbell className="w-3.5 h-3.5" />
            <span>Log Workout (+20 XP)</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-[28px] bg-white border border-[#EBE9E1] space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#6B6A65] font-semibold">
            <span>Sleep Duration</span>
            <Moon className="w-4 h-4 text-[#5A6A5A]" />
          </div>
          <div className="text-2xl font-serif text-[#2D2D2A] font-bold">{health.sleepHours} hrs</div>
          <span className="text-[10px] text-[#5A6A5A] font-semibold">
            {health.sleepHours >= 7.5 ? "7.5h Target Met" : "Target: 7.5h"}
          </span>
        </div>

        <div className="p-5 rounded-[28px] bg-white border border-[#EBE9E1] space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#6B6A65] font-semibold">
            <span>Daily Step Count</span>
            <Flame className="w-4 h-4 text-[#B07D62]" />
          </div>
          <div className="text-2xl font-serif text-[#2D2D2A] font-bold">{health.steps} steps</div>
          <span className="text-[10px] text-[#6B6A65]">
            {health.steps > 0 ? `${Math.min(100, Math.round((health.steps / 10000) * 100))}% of 10,000 goal` : "Target: 10,000 steps"}
          </span>
        </div>

        <div className="p-5 rounded-[28px] bg-white border border-[#EBE9E1] space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#6B6A65] font-semibold">
            <span>Calories Consumed</span>
            <Utensils className="w-4 h-4 text-[#B07D62]" />
          </div>
          <div className="text-2xl font-serif text-[#2D2D2A] font-bold">{totalCalories} kcal</div>
          <span className="text-[10px] text-[#6B6A65]">{totalProtein}g Protein</span>
        </div>

        <div className="p-5 rounded-[28px] bg-white border border-[#EBE9E1] space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#6B6A65] font-semibold">
            <span>Body Weight</span>
            <Activity className="w-4 h-4 text-[#5A6A5A]" />
          </div>
          <div className="text-2xl font-serif text-[#2D2D2A] font-bold">{health.weightKg} kg</div>
          <span className="text-[10px] text-[#5A6A5A] font-semibold">Healthy BMI Range</span>
        </div>
      </div>

      {/* Main Split: Meals & Workouts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Meal Logs */}
        <div className="rounded-[32px] bg-white border border-[#EBE9E1] p-6 sm:p-8 space-y-4 shadow-xs">
          <h3 className="text-base font-serif italic font-bold text-[#2D2D2A] flex items-center gap-2">
            <Utensils className="w-4 h-4 text-[#B07D62]" />
            <span>Today's Nutrition Logs</span>
          </h3>

          <div className="space-y-3">
            {meals.map((m) => (
              <div key={m.id} className="p-4 rounded-2xl bg-[#F1EFEC] border border-[#EBE9E1] flex items-center justify-between">
                <div>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#B07D62]/10 text-[#B07D62] font-semibold border border-[#B07D62]/20 uppercase tracking-wider">{m.mealType}</span>
                  <div className="text-xs font-bold text-[#2D2D2A] mt-1">{m.name}</div>
                </div>
                <div className="text-right text-xs">
                  <div className="text-[#B07D62] font-bold">{m.calories} kcal</div>
                  <div className="text-[10px] text-[#6B6A65]">{m.proteinG}g Protein</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Workout Logs */}
        <div className="rounded-[32px] bg-white border border-[#EBE9E1] p-6 sm:p-8 space-y-4 shadow-xs">
          <h3 className="text-base font-serif italic font-bold text-[#2D2D2A] flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-[#5A6A5A]" />
            <span>Workout & Exercise History</span>
          </h3>

          <div className="space-y-3">
            {workouts.map((w) => (
              <div key={w.id} className="p-4 rounded-2xl bg-[#F1EFEC] border border-[#EBE9E1] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#2D2D2A]">{w.title}</span>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#5A6A5A]/10 text-[#5A6A5A] font-semibold border border-[#5A6A5A]/20 uppercase tracking-wider">
                    {w.category}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#6B6A65] pt-1">
                  <span>Duration: {w.durationMins} mins</span>
                  <span className="text-[#B07D62] font-bold">{w.caloriesBurned} kcal burned</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Log Meal Modal */}
      {showMealModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md p-6 sm:p-8 rounded-[32px] bg-white border border-[#EBE9E1] space-y-4 shadow-xl">
            <h3 className="text-xl font-serif italic font-bold text-[#2D2D2A]">Log Nutrition Meal</h3>
            <form onSubmit={handleAddMeal} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#6B6A65] font-semibold mb-1">Meal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grilled Salmon with Rice"
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                  className="w-full bg-[#F1EFEC] border border-[#EBE9E1] rounded-2xl px-3 py-2 text-[#2D2D2A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#6B6A65] font-semibold mb-1">Calories (kcal)</label>
                  <input
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(Number(e.target.value))}
                    className="w-full bg-[#F1EFEC] border border-[#EBE9E1] rounded-2xl px-3 py-2 text-[#2D2D2A]"
                  />
                </div>
                <div>
                  <label className="block text-[#6B6A65] font-semibold mb-1">Protein (g)</label>
                  <input
                    type="number"
                    value={protein}
                    onChange={(e) => setProtein(Number(e.target.value))}
                    className="w-full bg-[#F1EFEC] border border-[#EBE9E1] rounded-2xl px-3 py-2 text-[#2D2D2A]"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowMealModal(false)}
                  className="w-1/2 py-2.5 rounded-2xl bg-[#F1EFEC] text-[#2D2D2A] hover:bg-[#EBE9E1] font-semibold border border-[#EBE9E1]"
                >
                  Cancel
                </button>
                <button type="submit" className="w-1/2 py-2.5 rounded-2xl bg-[#5A6A5A] hover:bg-[#4f5f4f] text-white font-semibold shadow-xs">
                  Save Meal (+10 XP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Workout Modal */}
      {showWorkoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md p-6 sm:p-8 rounded-[32px] bg-white border border-[#EBE9E1] space-y-4 shadow-xl">
            <h3 className="text-xl font-serif italic font-bold text-[#2D2D2A]">Log Workout Session</h3>
            <form onSubmit={handleAddWorkout} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#6B6A65] font-semibold mb-1">Workout Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Full Body Strength Training"
                  value={workoutTitle}
                  onChange={(e) => setWorkoutTitle(e.target.value)}
                  className="w-full bg-[#F1EFEC] border border-[#EBE9E1] rounded-2xl px-3 py-2 text-[#2D2D2A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#6B6A65] font-semibold mb-1">Category</label>
                  <select
                    value={workoutCat}
                    onChange={(e) => setWorkoutCat(e.target.value as any)}
                    className="w-full bg-[#F1EFEC] border border-[#EBE9E1] rounded-2xl px-3 py-2 text-[#2D2D2A]"
                  >
                    {["Gym", "Yoga", "Stretching", "Walking", "Cardio"].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[#6B6A65] font-semibold mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full bg-[#F1EFEC] border border-[#EBE9E1] rounded-2xl px-3 py-2 text-[#2D2D2A]"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWorkoutModal(false)}
                  className="w-1/2 py-2.5 rounded-2xl bg-[#F1EFEC] text-[#2D2D2A] hover:bg-[#EBE9E1] font-semibold border border-[#EBE9E1]"
                >
                  Cancel
                </button>
                <button type="submit" className="w-1/2 py-2.5 rounded-2xl bg-[#5A6A5A] hover:bg-[#4f5f4f] text-white font-semibold shadow-xs">
                  Save Workout (+20 XP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
