import React, { useState, useEffect } from "react";
import { GraduationCap, BookOpen, AlertTriangle, Play, Pause, RotateCcw, CheckCircle2, Award, Trash2 } from "lucide-react";
import { StorageEngine } from "../../lib/storage";
import { Course, Assignment, Book, Skill } from "../../types";
import { CharacterArtImage } from "../GeneratedArt";

interface LearningViewProps {
  onXpChange: (delta: number) => void;
}

export const LearningView: React.FC<LearningViewProps> = ({ onXpChange }) => {
  const [courses, setCourses] = useState<Course[]>(StorageEngine.getCourses());
  const [assignments, setAssignments] = useState<Assignment[]>(StorageEngine.getAssignments());
  const [books] = useState<Book[]>(StorageEngine.getBooks());
  const [skills] = useState<Skill[]>(StorageEngine.getSkills());

  const handleDeleteCourse = (id: string) => {
    if (!confirm("Delete this course? This cannot be undone.")) return;
    setCourses(StorageEngine.deleteCourse(id));
  };

  // Pomodoro timer state
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      onXpChange(25);
      alert("Pomodoro Study Session Complete! Earned +25 XP!");
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const toggleAssignment = (id: string) => {
    const updated = assignments.map((a) => (a.id === id ? { ...a, completed: !a.completed } : a));
    setAssignments(updated);
    StorageEngine.setAssignments(updated);
    onXpChange(10);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6 pb-12 text-[#2D2D2A]">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 bg-white p-5 sm:p-7 rounded-[32px] border border-[#EBE9E1] shadow-xs">
        <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 min-w-0 flex-1">
          <div className="w-14 h-14 sm:w-20 sm:h-20 shrink-0 rounded-2xl bg-[#F1EFEC] border border-[#EBE9E1] p-1 flex items-center justify-center overflow-hidden shadow-xs">
            <CharacterArtImage type="learning" className="w-full h-full" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg sm:text-2xl font-serif italic text-[#2D2D2A] leading-tight">
              Academic Planner & Skill Builder
            </h2>
            <p className="text-xs text-[#6B6A65] mt-1 leading-normal">
              Manage course attendance %, GPA goals, assignments, reading list, and Pomodoro study sessions.
            </p>
          </div>
        </div>

        {/* GPA Badge */}
        <div className="px-3.5 py-1.5 rounded-2xl bg-[#F1EFEC] border border-[#EBE9E1] text-[#5A6A5A] font-bold text-xs shrink-0 flex items-center gap-2">
          <span>Target GPA: {courses.length > 0 ? "3.90 / 4.00" : "4.00 / 4.00"}</span>
        </div>
      </div>

      {/* Pomodoro Timer Bar */}
      <div className="rounded-[32px] bg-white border border-[#EBE9E1] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#F1EFEC] border border-[#EBE9E1] text-[#5A6A5A] text-2xl font-serif font-bold flex items-center justify-center">
            {formatTimer(timerSeconds)}
          </div>
          <div>
            <h3 className="text-base font-serif italic font-bold text-[#2D2D2A]">Pomodoro Focus Timer</h3>
            <p className="text-xs text-[#6B6A65]">Complete 25 minutes of deep academic study to earn +25 XP.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className={`px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all shadow-xs ${
              isTimerRunning ? "bg-[#B07D62] text-white" : "bg-[#5A6A5A] hover:bg-[#4f5f4f] text-white"
            }`}
          >
            {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isTimerRunning ? "Pause Timer" : "Start Focus Session"}</span>
          </button>
          <button
            onClick={() => {
              setIsTimerRunning(false);
              setTimerSeconds(25 * 60);
            }}
            className="p-2.5 rounded-2xl bg-[#F1EFEC] text-[#6B6A65] hover:text-[#2D2D2A] border border-[#EBE9E1]"
            title="Reset Timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Courses & Attendance Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-serif italic font-bold text-[#2D2D2A]">Enrolled Courses & Attendance Tracker</h3>
        {courses.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#6B6A65] bg-white rounded-[28px] border border-[#EBE9E1]">
            No academic courses registered. Add a course to track attendance, GPA goals, and study sessions.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {courses.map((c) => {
              const attendancePct = Math.round((c.attendanceAttended / c.attendanceTotal) * 100);
              const isWarning = attendancePct < 75;

              return (
                <div key={c.id} className="p-6 rounded-[28px] bg-white border border-[#EBE9E1] space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#5A6A5A]">{c.code}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#F1EFEC] text-[#6B6A65] font-semibold border border-[#EBE9E1]">
                        Grade: {c.targetGrade}
                      </span>
                      <button
                        onClick={() => handleDeleteCourse(c.id)}
                        className="p-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                        title="Delete Course"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-base font-serif italic font-bold text-[#2D2D2A]">{c.name}</h4>
                    <p className="text-[11px] text-[#6B6A65]">{c.instructor}</p>
                  </div>

                  {/* Attendance Bar */}
                  <div className="space-y-1 pt-2 border-t border-[#EBE9E1]">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-[#6B6A65]">Attendance ({c.attendanceAttended}/{c.attendanceTotal})</span>
                      <span className={`font-bold ${isWarning ? "text-rose-600" : "text-[#5A6A5A]"}`}>
                        {attendancePct}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#F0EEE6] overflow-hidden">
                      <div
                        className={`h-full ${isWarning ? "bg-rose-500" : "bg-[#5A6A5A]"}`}
                        style={{ width: `${attendancePct}%` }}
                      />
                    </div>
                    {isWarning && (
                      <div className="flex items-center gap-1 text-[10px] text-rose-600 font-semibold pt-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Low attendance warning (&lt;75%)</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Assignments List */}
      <div className="rounded-[32px] bg-white border border-[#EBE9E1] p-6 sm:p-8 space-y-4 shadow-xs">
        <h3 className="text-base font-serif italic font-bold text-[#2D2D2A]">Upcoming Assignments & Problem Sets</h3>
        <div className="space-y-2">
          {assignments.length === 0 ? (
            <div className="p-6 text-center text-xs text-[#6B6A65] italic bg-[#F1EFEC] rounded-2xl border border-[#EBE9E1]">
              No upcoming assignments. Add an assignment to track submission deadlines.
            </div>
          ) : (
            assignments.map((a) => (
              <div
                key={a.id}
                onClick={() => toggleAssignment(a.id)}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                  a.completed
                    ? "bg-[#F1EFEC] border-[#EBE9E1] text-[#6B6A65] line-through"
                    : "bg-white border-[#EBE9E1] text-[#2D2D2A] hover:border-[#5A6A5A]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className={`w-4 h-4 ${a.completed ? "text-[#5A6A5A]" : "text-[#EBE9E1]"}`} />
                  <div>
                    <div className="text-xs font-semibold">{a.title}</div>
                    <div className="text-[10px] text-[#6B6A65]">Due: {a.dueDate}</div>
                  </div>
                </div>
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#F1EFEC] text-[#5A6A5A] font-semibold">
                  {a.priority} Priority
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Reading List & Skill Builder Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Books & Papers */}
        <div className="rounded-[32px] bg-white border border-[#EBE9E1] p-6 sm:p-8 space-y-4 shadow-xs">
          <h3 className="text-base font-serif italic font-bold text-[#2D2D2A] flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#5A6A5A]" />
            <span>Reading List & Research Papers</span>
          </h3>
          <div className="space-y-3">
            {books.map((b) => {
              const pct = Math.round((b.pagesRead / b.totalPages) * 100);
              return (
                <div key={b.id} className="p-4 rounded-2xl bg-[#F1EFEC] border border-[#EBE9E1] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#2D2D2A]">{b.title}</span>
                    <span className="text-[10px] text-[#5A6A5A] font-bold">{pct}%</span>
                  </div>
                  <div className="text-[11px] text-[#6B6A65]">{b.author}</div>
                  <div className="w-full h-2 rounded-full bg-[#EBE9E1] overflow-hidden">
                    <div className="h-full bg-[#5A6A5A]" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Skill Builder */}
        <div className="rounded-[32px] bg-white border border-[#EBE9E1] p-6 sm:p-8 space-y-4 shadow-xs">
          <h3 className="text-base font-serif italic font-bold text-[#2D2D2A] flex items-center gap-2">
            <Award className="w-4 h-4 text-[#B07D62]" />
            <span>Skill Mastery Matrix</span>
          </h3>
          <div className="space-y-3">
            {skills.map((sk) => {
              const pct = Math.round((sk.hoursPracticed / sk.targetHours) * 100);
              return (
                <div key={sk.id} className="p-4 rounded-2xl bg-[#F1EFEC] border border-[#EBE9E1] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#2D2D2A]">{sk.name}</span>
                    <span className="text-[10px] text-[#B07D62] font-bold">
                      {sk.hoursPracticed} / {sk.targetHours} hrs
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#EBE9E1] overflow-hidden">
                    <div className="h-full bg-[#B07D62]" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
