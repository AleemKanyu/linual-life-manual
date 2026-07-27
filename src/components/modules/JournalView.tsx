import React, { useState } from "react";
import { BookMarked, Mic, Plus, Calendar, Tag, Sparkles, Volume2, Smile, Meh, Frown, Check } from "lucide-react";
import { StorageEngine } from "../../lib/storage";
import { JournalEntry } from "../../types";
import { CharacterArtImage } from "../GeneratedArt";

interface JournalViewProps {
  onXpChange: (delta: number) => void;
}

export const JournalView: React.FC<JournalViewProps> = ({ onXpChange }) => {
  const [entries, setEntries] = useState<JournalEntry[]>(StorageEngine.getJournal());
  const [showAddModal, setShowAddModal] = useState(false);

  // New entry form
  const [type, setType] = useState<JournalEntry["type"]>("Daily");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("Reflection, Mindset");
  const [mood, setMood] = useState(8);
  const [energy] = useState(7);
  const [stress] = useState(3);

  // Voice note recording simulation
  const [recordedAudio, setRecordedAudio] = useState(false);

  const handleCreateEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    const newEntry: JournalEntry = {
      id: "j_" + Date.now(),
      date: new Date().toISOString().split("T")[0],
      type,
      title,
      content,
      tags: tagsInput.split(",").map((t) => t.trim()),
      mood,
      energy,
      stress,
      audioNoteUrl: recordedAudio ? "voice_memo_simulated.mp3" : undefined,
      aiSummary: `High reflection score on ${type} thoughts.`,
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    StorageEngine.setJournal(updated);
    setShowAddModal(false);
    setTitle("");
    setContent("");
    setRecordedAudio(false);
    onXpChange(15);
  };

  const getMoodLabel = (score: number) => {
    if (score >= 8) return "Peaceful & Inspired";
    if (score >= 6) return "Balanced & Calmer";
    if (score >= 4) return "Neutral";
    return "Stressed or Tired";
  };

  const getMoodIcon = (score: number) => {
    if (score >= 6) return <Smile className="w-4 h-4 text-[#5A6A5A]" />;
    if (score >= 4) return <Meh className="w-4 h-4 text-amber-600" />;
    return <Frown className="w-4 h-4 text-[#B07D62]" />;
  };

  return (
    <div className="space-y-6 pb-12 text-[#2D2D2A]">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 bg-white p-5 sm:p-7 rounded-[32px] border border-[#EBE9E1] shadow-xs">
        <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 min-w-0 flex-1">
          <div className="w-14 h-14 sm:w-20 sm:h-20 shrink-0 rounded-2xl bg-[#F1EFEC] border border-[#EBE9E1] p-1 flex items-center justify-center overflow-hidden shadow-xs">
            <CharacterArtImage type="journal" className="w-full h-full" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg sm:text-2xl font-serif italic text-[#2D2D2A] leading-tight">
              Journal & Emotional Mood Tracker
            </h2>
            <p className="text-xs text-[#6B6A65] mt-1 leading-normal">
              Reflect on daily thoughts, gratitude, dreams, voice logs, and mood correlations.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto justify-center px-4 py-2.5 rounded-2xl bg-[#5A6A5A] hover:bg-[#4f5f4f] text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Reflection</span>
        </button>
      </div>

      {/* Mood Correlation Insights Box */}
      <div className="rounded-[28px] bg-white border border-[#B07D62]/40 p-6 space-y-2 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-[#B07D62]">
          <Sparkles className="w-4 h-4 text-[#B07D62]" />
          <span>Linual AI Mood Correlation Insights</span>
        </div>
        <p className="text-xs text-[#2D2D2A] leading-relaxed">
          {entries.length >= 3
            ? `Based on your ${entries.length} reflections: Average mood score is ${(entries.reduce((a, c) => a + (c.moodScore || 5), 0) / entries.length).toFixed(1)}/10. Logging reflections regularly enhances emotional self-awareness.`
            : "Log 3+ daily reflections to unlock AI mood correlation analytics between your prayers, sleep, and emotional state."}
        </p>
      </div>

      {/* Journal Entries List */}
      {entries.length === 0 ? (
        <div className="p-12 text-center bg-white border border-[#EBE9E1] rounded-[32px] space-y-3">
          <BookMarked className="w-10 h-10 mx-auto text-[#5A6A5A]/60" />
          <h3 className="text-lg font-serif italic font-bold text-[#2D2D2A]">No Journal Entries Yet</h3>
          <p className="text-xs text-[#6B6A65] max-w-sm mx-auto">
            Log daily reflections, gratitude notes, dreams, or mood logs to track your personal growth journey.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-2 px-5 py-2.5 rounded-2xl bg-[#5A6A5A] hover:bg-[#4f5f4f] text-white font-semibold text-xs inline-flex items-center gap-2 transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Write First Reflection (+10 XP)</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((j) => (
          <div key={j.id} className="p-6 rounded-[28px] bg-white border border-[#EBE9E1] space-y-3 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EBE9E1] pb-3">
              <div className="flex items-center gap-3">
                <span className="text-[10px] px-3 py-1 rounded-full bg-[#B07D62]/10 text-[#B07D62] font-semibold uppercase tracking-wider border border-[#B07D62]/20">
                  {j.type}
                </span>
                <h3 className="text-lg font-serif italic font-bold text-[#2D2D2A]">{j.title}</h3>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#6B6A65]">
                <Calendar className="w-3.5 h-3.5" />
                <span>{j.date}</span>
              </div>
            </div>

            <p className="text-xs text-[#2D2D2A] leading-relaxed whitespace-pre-line">{j.content}</p>

            {/* Voice note indicator */}
            {j.audioNoteUrl && (
              <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-[#F1EFEC] border border-[#EBE9E1] text-xs text-[#5A6A5A] font-semibold w-fit">
                <Volume2 className="w-4 h-4" />
                <span>Voice Memo Attached (0:45)</span>
              </div>
            )}

            {/* Footer tags and mood rating */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] text-[#6B6A65]">
              <div className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#6B6A65]" />
                {j.tags.map((t, idx) => (
                  <span key={idx} className="bg-[#F1EFEC] text-[#2D2D2A] px-2.5 py-0.5 rounded-lg border border-[#EBE9E1]">
                    #{t}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2">
                {getMoodIcon(j.mood)}
                <span className="text-[#B07D62] font-semibold">{getMoodLabel(j.mood)}</span>
                <span className="text-[#6B6A65]">({j.mood}/10)</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Add Journal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-[32px] bg-white border border-[#EBE9E1] space-y-4 shadow-xl">
            <h3 className="text-xl font-serif italic font-bold text-[#2D2D2A]">Write New Journal Entry</h3>
            <form onSubmit={handleCreateEntry} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#6B6A65] font-semibold mb-1">Reflection Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full bg-[#F1EFEC] border border-[#EBE9E1] rounded-2xl px-3 py-2 text-[#2D2D2A]"
                  >
                    {["Daily", "Gratitude", "Dream", "Travel"].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#6B6A65] font-semibold mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full bg-[#F1EFEC] border border-[#EBE9E1] rounded-2xl px-3 py-2 text-[#2D2D2A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#6B6A65] font-semibold mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Quiet Morning Reflection & Energy"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#F1EFEC] border border-[#EBE9E1] rounded-2xl px-4 py-2.5 text-[#2D2D2A] focus:outline-none focus:border-[#5A6A5A]"
                />
              </div>

              <div>
                <label className="block text-[#6B6A65] font-semibold mb-1">Journal Content</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Express your thoughts freely..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-[#F1EFEC] border border-[#EBE9E1] rounded-2xl px-4 py-2.5 text-[#2D2D2A] focus:outline-none focus:border-[#5A6A5A]"
                />
              </div>

              {/* Mood Slider */}
              <div>
                <div className="flex justify-between text-[#6B6A65] mb-1 font-medium">
                  <span>Mood Score (1-10)</span>
                  <span className="text-[#B07D62] font-bold flex items-center gap-1.5">
                    {getMoodIcon(mood)}
                    <span>{mood}/10 — {getMoodLabel(mood)}</span>
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={mood}
                  onChange={(e) => setMood(Number(e.target.value))}
                  className="w-full accent-[#5A6A5A]"
                />
              </div>

              {/* Voice memo simulator */}
              <div className="p-3.5 rounded-2xl bg-[#F1EFEC] border border-[#EBE9E1] flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#2D2D2A]">
                  <Mic className="w-4 h-4 text-[#5A6A5A]" />
                  <span>{recordedAudio ? "Voice Memo Recorded!" : "Record Voice Note"}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setRecordedAudio(!recordedAudio)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all ${
                    recordedAudio ? "bg-[#5A6A5A] text-white" : "bg-[#B07D62] text-white"
                  }`}
                >
                  <span className="flex items-center gap-1">
                    {recordedAudio && <Check className="w-3 h-3 text-white" />}
                    <span>{recordedAudio ? "Recorded" : "Simulate Record"}</span>
                  </span>
                </button>
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
                  Save Reflection (+15 XP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
