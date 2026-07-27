import React, { useState } from "react";
import { Target, Plus, CheckCircle2, Calendar, Trash2 } from "lucide-react";
import { StorageEngine } from "../../lib/storage";
import { Goal, GoalCategory, GoalPriority, GoalTimeframe } from "../../types";
import { GoalsWatermark } from "../Watermarks";

interface GoalsViewProps {
  onXpChange: (delta: number) => void;
}

export const GoalsView: React.FC<GoalsViewProps> = ({ onXpChange }) => {
  const [goals, setGoals] = useState<Goal[]>(StorageEngine.getGoals());
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [showAddModal, setShowAddModal] = useState(false);

  // New goal form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<GoalCategory>("Academic");
  const [timeframe, setTimeframe] = useState<GoalTimeframe>("Annual");
  const [deadline, setDeadline] = useState("2026-12-31");
  const [priority, setPriority] = useState<GoalPriority>("High");

  const categories = ["All", "Academic", "Spiritual", "Physical", "Financial", "Mental", "Career", "Personal"];

  const filteredGoals = activeCategory === "All" ? goals : goals.filter((g) => g.category === activeCategory);

  const handleDeleteGoal = (id: string) => {
    if (!confirm("Delete this goal and all its milestones? This cannot be undone.")) return;
    setGoals(StorageEngine.deleteGoal(id));
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    const newGoal: Goal = {
      id: "g_" + Date.now(),
      title,
      description,
      category,
      timeframe,
      deadline,
      progress: 0,
      priority,
      milestones: [
        { id: "m1_" + Date.now(), title: "Initial Planning & Research", completed: false },
        { id: "m2_" + Date.now(), title: "Midway Execution Checkpoint", completed: false },
      ],
      createdAt: new Date().toISOString().split("T")[0],
    };
    const updated = [newGoal, ...goals];
    setGoals(updated);
    StorageEngine.setGoals(updated);
    setShowAddModal(false);
    setTitle("");
    setDescription("");
    onXpChange(15);
  };

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    const updated = goals.map((g) => {
      if (g.id !== goalId) return g;
      const updatedMilestones = g.milestones.map((m) => (m.id === milestoneId ? { ...m, completed: !m.completed } : m));
      const completedCount = updatedMilestones.filter((m) => m.completed).length;
      const newProgress = Math.round((completedCount / updatedMilestones.length) * 100);
      return { ...g, milestones: updatedMilestones, progress: newProgress };
    });
    setGoals(updated);
    StorageEngine.setGoals(updated);
    onXpChange(10);
  };

  const deleteGoal = (id: string) => {
    const updated = goals.filter((g) => g.id !== id);
    setGoals(updated);
    StorageEngine.setGoals(updated);
  };

  return (
    <div className="space-y-6 pb-12 text-[#2D2D2A]">
      {/* Header */}
      <div className="relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-[32px] border border-[#EBE9E1] shadow-xs">
        <GoalsWatermark className="absolute right-0 top-0 w-48 h-48 opacity-15" />
        <div className="relative z-10">
          <h2 className="text-2xl font-serif italic text-[#2D2D2A] flex items-center gap-2">
            <Target className="w-6 h-6 text-[#5A6A5A]" />
            <span>Goals & Milestones Matrix</span>
          </h2>
          <p className="text-xs text-[#6B6A65] mt-1">
            Track Vision, Annual, Monthly, Weekly, and Daily goals with actionable milestones.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-2xl bg-[#5A6A5A] hover:bg-[#4f5f4f] text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Goal</span>
        </button>
      </div>

      {/* Categories Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat
                ? "bg-[#5A6A5A] text-white shadow-xs"
                : "bg-white border border-[#EBE9E1] text-[#6B6A65] hover:text-[#2D2D2A] hover:bg-[#F1EFEC]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Goals Grid */}
      {filteredGoals.length === 0 ? (
        <div className="p-8 rounded-[32px] bg-white border border-[#EBE9E1] text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-[#5A6A5A]/10 text-[#5A6A5A] mx-auto flex items-center justify-center font-bold">
            <Target className="w-6 h-6 text-[#5A6A5A]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-serif italic font-bold text-[#2D2D2A]">No Growth Goals Set Yet</h3>
            <p className="text-xs text-[#6B6A65] max-w-md mx-auto">
              Define annual or quarterly milestones to track your life progress and earn XP per goal milestone completed!
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 rounded-2xl bg-[#5A6A5A] text-white text-xs font-semibold hover:bg-[#4f5f4f] transition-all shadow-xs inline-flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Your First Goal</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGoals.map((g) => (
            <div key={g.id} className="p-6 rounded-[28px] bg-white border border-[#EBE9E1] space-y-4 relative group shadow-xs">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] px-3 py-1 rounded-full bg-[#B07D62]/10 text-[#B07D62] font-semibold border border-[#B07D62]/20 uppercase tracking-wider">
                    {g.category} • {g.timeframe}
                  </span>
                  <h3 className="text-xl font-serif italic font-bold text-[#2D2D2A] mt-3">{g.title}</h3>
                  <p className="text-xs text-[#6B6A65] mt-1 leading-relaxed">{g.description}</p>
                </div>

                <button
                  onClick={() => handleDeleteGoal(g.id)}
                  className="text-[#6B6A65] hover:text-rose-600 p-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete Goal"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#6B6A65] font-medium">Completion</span>
                  <span className="text-[#5A6A5A] font-bold">{g.progress}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-[#EBE9E1] overflow-hidden">
                  <div
                    className="h-full bg-[#5A6A5A] rounded-full transition-all duration-500"
                    style={{ width: `${g.progress}%` }}
                  />
                </div>
              </div>

              {/* Milestones Checklist */}
              <div className="space-y-2 border-t border-[#EBE9E1] pt-3">
                <div className="text-xs font-semibold text-[#2D2D2A]">Milestones:</div>
                {g.milestones.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => toggleMilestone(g.id, m.id)}
                    className="flex items-center gap-2.5 text-xs text-[#2D2D2A] hover:text-[#5A6A5A] cursor-pointer p-1.5 rounded-xl hover:bg-[#F1EFEC] transition-colors"
                  >
                    <CheckCircle2
                      className={`w-4 h-4 shrink-0 ${m.completed ? "text-[#5A6A5A]" : "text-[#EBE9E1]"}`}
                    />
                    <span className={m.completed ? "line-through text-[#6B6A65]" : ""}>{m.title}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#6B6A65] border-t border-[#EBE9E1] pt-3">
                <span className="flex items-center gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Deadline: {g.deadline}</span>
                </span>
                <span className="text-[#B07D62] font-semibold">{g.priority} Priority</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-[32px] bg-white border border-[#EBE9E1] space-y-4 shadow-xl">
            <h3 className="text-xl font-serif italic font-bold text-[#2D2D2A]">Create New Growth Goal</h3>
            <form onSubmit={handleCreateGoal} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#6B6A65] font-semibold mb-1">Goal Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Build an AI Agent Startup"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#F1EFEC] border border-[#EBE9E1] rounded-2xl px-4 py-2.5 text-[#2D2D2A] focus:outline-none focus:border-[#5A6A5A]"
                />
              </div>

              <div>
                <label className="block text-[#6B6A65] font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Why is this goal important for your life operating system?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#F1EFEC] border border-[#EBE9E1] rounded-2xl px-4 py-2.5 text-[#2D2D2A] focus:outline-none focus:border-[#5A6A5A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#6B6A65] font-semibold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-[#F1EFEC] border border-[#EBE9E1] rounded-2xl px-3 py-2 text-[#2D2D2A]"
                  >
                    {categories.filter((c) => c !== "All").map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#6B6A65] font-semibold mb-1">Timeframe</label>
                  <select
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value as any)}
                    className="w-full bg-[#F1EFEC] border border-[#EBE9E1] rounded-2xl px-3 py-2 text-[#2D2D2A]"
                  >
                    {["Vision", "Annual", "Monthly", "Weekly", "Daily"].map((tf) => (
                      <option key={tf} value={tf}>{tf}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#6B6A65] font-semibold mb-1">Deadline Date</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full bg-[#F1EFEC] border border-[#EBE9E1] rounded-2xl px-3 py-2 text-[#2D2D2A]"
                  />
                </div>

                <div>
                  <label className="block text-[#6B6A65] font-semibold mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-[#F1EFEC] border border-[#EBE9E1] rounded-2xl px-3 py-2 text-[#2D2D2A]"
                  >
                    {["Low", "Medium", "High", "Critical"].map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-2.5 rounded-2xl bg-[#F1EFEC] text-[#2D2D2A] font-semibold hover:bg-[#EBE9E1] border border-[#EBE9E1]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-2xl bg-[#5A6A5A] hover:bg-[#4f5f4f] text-white font-semibold shadow-xs"
                >
                  Create Goal (+15 XP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
