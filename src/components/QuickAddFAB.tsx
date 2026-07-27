import React, { useState } from "react";
import { Plus, Droplet, DollarSign, CheckCircle2, Moon, X } from "lucide-react";
import { StorageEngine } from "../lib/storage";
import { showToast } from "./Toast";
import { Transaction, Task, PrayerStatus } from "../types";

interface QuickAddFABProps {
  onXpChange: (delta: number) => void;
  onRefreshData?: () => void;
}

export const QuickAddFAB: React.FC<QuickAddFABProps> = ({ onXpChange, onRefreshData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<"expense" | "task" | "salah" | null>(null);

  // Quick Expense states
  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseAmount, setExpenseAmount] = useState<number | "">("");

  // Quick Task states
  const [taskTitle, setTaskTitle] = useState("");

  const handleAddWater = () => {
    const current = StorageEngine.getHealth();
    const updated = { ...current, waterMl: (current.waterMl || 0) + 250 };
    StorageEngine.setHealth(updated);
    onXpChange(5);
    showToast("💧 +250ml Water Logged (+5 XP)", "info");
    setIsOpen(false);
    onRefreshData?.();
  };

  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseTitle || !expenseAmount) return;

    const newTx: Transaction = {
      id: "tx_" + Date.now(),
      date: new Date().toISOString().split("T")[0],
      title: expenseTitle,
      amount: Number(expenseAmount),
      type: "expense",
      category: "Other",
    };

    const currentTxs = StorageEngine.getFinance();
    StorageEngine.setFinance([newTx, ...currentTxs]);
    onXpChange(10);
    showToast(`💵 Logged $${expenseAmount} (${expenseTitle}) (+10 XP)`, "success");
    setActiveModal(null);
    setExpenseTitle("");
    setExpenseAmount("");
    setIsOpen(false);
    onRefreshData?.();
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle) return;

    const newTask: Task = {
      id: "task_" + Date.now(),
      title: taskTitle,
      dueDate: new Date().toISOString().split("T")[0],
      priority: "Medium",
      category: "Personal",
      completed: false,
    };

    const currentTasks = StorageEngine.getTasks();
    StorageEngine.setTasks([newTask, ...currentTasks]);
    onXpChange(10);
    showToast(`📝 Quick Task Saved: "${taskTitle}" (+10 XP)`, "success");
    setActiveModal(null);
    setTaskTitle("");
    setIsOpen(false);
    onRefreshData?.();
  };

  const handleQuickSalahToggle = (prayerKey: "fajr" | "dhuhr" | "asr" | "maghrib" | "isha") => {
    const salah = StorageEngine.getSalahLog();
    const updated = { ...salah, [prayerKey]: "on_time" as PrayerStatus };
    StorageEngine.setSalahLog(updated);
    onXpChange(10);
    showToast(`🌙 ${prayerKey.toUpperCase()} marked On Time (+10 XP)`, "success");
    setActiveModal(null);
    setIsOpen(false);
    onRefreshData?.();
  };

  return (
    <>
      {/* Floating Action Speed-Dial Menu */}
      <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40 flex flex-col items-end gap-2.5">
        {isOpen && (
          <div className="flex flex-col items-end gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
            {/* Quick Water Button */}
            <button
              onClick={handleAddWater}
              className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-[#EBE9E1] text-[#2D2D2A] text-xs font-semibold shadow-lg hover:bg-[#F1EFEC] transition-all cursor-pointer"
            >
              <span>+250ml Water</span>
              <div className="w-7 h-7 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
                <Droplet className="w-4 h-4" />
              </div>
            </button>

            {/* Quick Expense Button */}
            <button
              onClick={() => setActiveModal("expense")}
              className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-[#EBE9E1] text-[#2D2D2A] text-xs font-semibold shadow-lg hover:bg-[#F1EFEC] transition-all cursor-pointer"
            >
              <span>Quick Expense</span>
              <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </button>

            {/* Quick Task Button */}
            <button
              onClick={() => setActiveModal("task")}
              className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-[#EBE9E1] text-[#2D2D2A] text-xs font-semibold shadow-lg hover:bg-[#F1EFEC] transition-all cursor-pointer"
            >
              <span>Quick Task</span>
              <div className="w-7 h-7 rounded-xl bg-[#5A6A5A]/15 text-[#5A6A5A] flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </button>

            {/* Quick Salah Log */}
            <button
              onClick={() => setActiveModal("salah")}
              className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-[#EBE9E1] text-[#2D2D2A] text-xs font-semibold shadow-lg hover:bg-[#F1EFEC] transition-all cursor-pointer"
            >
              <span>Log Prayer</span>
              <div className="w-7 h-7 rounded-xl bg-[#B07D62]/15 text-[#B07D62] flex items-center justify-center">
                <Moon className="w-4 h-4" />
              </div>
            </button>
          </div>
        )}

        {/* Main Floating Action Plus Button */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className={`w-13 h-13 rounded-2xl text-white flex items-center justify-center shadow-xl transition-all cursor-pointer ${
            isOpen ? "bg-[#2D2D2A] rotate-45" : "bg-[#5A6A5A] hover:bg-[#4f5f4f] hover:scale-105"
          }`}
          title="Quick Action Menu"
          aria-label="Quick Action Menu"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Quick Expense Modal */}
      {activeModal === "expense" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs">
          <form onSubmit={handleSaveExpense} className="w-full max-w-sm max-h-[90vh] overflow-y-auto p-6 rounded-[32px] bg-white border border-[#EBE9E1] space-y-4 shadow-xl text-left">
            <h3 className="text-lg font-serif italic font-bold text-[#2D2D2A]">Record Quick Expense</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#6B6A65] font-semibold mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Coffee, Lunch"
                  value={expenseTitle}
                  onChange={(e) => setExpenseTitle(e.target.value)}
                  className="w-full bg-[#F1EFEC] border border-[#EBE9E1] rounded-2xl px-3 py-2 text-[#2D2D2A]"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-[#6B6A65] font-semibold mb-1">Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(Number(e.target.value))}
                  className="w-full bg-[#F1EFEC] border border-[#EBE9E1] rounded-2xl px-3 py-2 text-[#2D2D2A]"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setActiveModal(null)} className="w-1/3 py-2 rounded-2xl bg-[#F1EFEC] text-xs font-semibold">Cancel</button>
              <button type="submit" className="w-2/3 py-2 rounded-2xl bg-[#5A6A5A] text-white text-xs font-semibold shadow-xs">Save (+10 XP)</button>
            </div>
          </form>
        </div>
      )}

      {/* Quick Task Modal */}
      {activeModal === "task" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <form onSubmit={handleSaveTask} className="w-full max-w-sm p-6 rounded-[32px] bg-white border border-[#EBE9E1] space-y-4 shadow-xl text-left">
            <h3 className="text-lg font-serif italic font-bold text-[#2D2D2A]">Add Quick Task</h3>
            <div className="space-y-3 text-xs">
              <label className="block text-[#6B6A65] font-semibold">Task Title</label>
              <input
                type="text"
                required
                placeholder="What needs to be done?"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="w-full bg-[#F1EFEC] border border-[#EBE9E1] rounded-2xl px-3 py-2 text-[#2D2D2A]"
                autoFocus
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setActiveModal(null)} className="w-1/3 py-2 rounded-2xl bg-[#F1EFEC] text-xs font-semibold">Cancel</button>
              <button type="submit" className="w-2/3 py-2 rounded-2xl bg-[#5A6A5A] text-white text-xs font-semibold shadow-xs">Save Task (+10 XP)</button>
            </div>
          </form>
        </div>
      )}

      {/* Quick Salah Log Modal */}
      {activeModal === "salah" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-sm p-6 rounded-[32px] bg-white border border-[#EBE9E1] space-y-4 shadow-xl text-left">
            <h3 className="text-lg font-serif italic font-bold text-[#2D2D2A]">Mark Prayer On Time</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {(["fajr", "dhuhr", "asr", "maghrib", "isha"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => handleQuickSalahToggle(p)}
                  className="p-3 rounded-2xl bg-[#F1EFEC] hover:bg-[#5A6A5A] hover:text-white border border-[#EBE9E1] font-bold text-center capitalize transition-all"
                >
                  {p}
                </button>
              ))}
            </div>
            <button onClick={() => setActiveModal(null)} className="w-full py-2 rounded-2xl bg-[#F1EFEC] text-xs font-semibold">Cancel</button>
          </div>
        </div>
      )}
    </>
  );
};
