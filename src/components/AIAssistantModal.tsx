import React, { useState } from "react";
import { Sparkles, Send, X, Bot, User, RefreshCw, Lightbulb } from "lucide-react";
import { StorageEngine } from "../lib/storage";

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  sender: "user" | "bot";
  text: string;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({ isOpen = true, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Peace be upon you! I am **Linual AI**, your personal life operating assistant. Ask me anything about your goals, habits, Salah streak, financial budget, coursework, or schedule!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    "How much did I spend this month?",
    "Which habits need attention?",
    "Summarize my recent journal entries",
    "Plan a timeblocked schedule for today",
    "Show my current academic GPA & assignments",
  ];

  const handleSend = async (textToSend?: string) => {
    const prompt = textToSend || input;
    if (!prompt.trim() || loading) return;

    const userMsg: Message = { sender: "user", text: prompt };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      // Gather current life context from StorageEngine
      const lifeContext = {
        profile: StorageEngine.getAppState().userProfile,
        goals: StorageEngine.getGoals(),
        salah: StorageEngine.getSalahLog(),
        habits: StorageEngine.getHabits(),
        journal: StorageEngine.getJournal(),
        finance: StorageEngine.getFinance(),
        budgets: StorageEngine.getBudgets(),
        courses: StorageEngine.getCourses(),
        assignments: StorageEngine.getAssignments(),
        tasks: StorageEngine.getTasks(),
      };

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: prompt,
          lifeContext,
        }),
      });

      const data = await res.json();
      if (data.response) {
        setMessages((prev) => [...prev, { sender: "bot", text: data.response }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "I analyzed your Linual database, but hit a slight connection hiccup. Please try again." },
        ]);
      }
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error contacting Linual AI server. Please check your connectivity." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-2xl h-[650px] max-h-[90vh] rounded-[32px] bg-white border border-[#EBE9E1] shadow-xl flex flex-col overflow-hidden text-[#2D2D2A]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#EBE9E1] bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#5A6A5A] flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-serif italic font-bold text-[#2D2D2A] flex items-center gap-2">
                Linual AI Companion
                <span className="px-2.5 py-0.5 text-[10px] rounded-full bg-[#5A6A5A]/10 text-[#5A6A5A] font-semibold border border-[#5A6A5A]/20">
                  Gemini 3.6 Flash
                </span>
              </h3>
              <p className="text-[11px] text-[#6B6A65]">Contextual search & life management assistant</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-[#6B6A65] hover:text-[#2D2D2A] hover:bg-[#F1EFEC]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-3 border-b border-[#EBE9E1] bg-[#F1EFEC] flex items-center gap-2 overflow-x-auto no-scrollbar">
          <Lightbulb className="w-4 h-4 text-[#B07D62] shrink-0 ml-1" />
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp)}
              disabled={loading}
              className="px-3.5 py-1.5 rounded-full bg-white hover:bg-[#5A6A5A]/10 hover:border-[#5A6A5A] border border-[#EBE9E1] text-[11px] font-semibold text-[#2D2D2A] whitespace-nowrap transition-all shadow-xs"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
              {m.sender === "bot" && (
                <div className="w-8 h-8 rounded-xl bg-[#5A6A5A]/10 text-[#5A6A5A] border border-[#5A6A5A]/20 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[82%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  m.sender === "user"
                    ? "bg-[#5A6A5A] text-white rounded-br-none shadow-xs font-semibold"
                    : "bg-[#F1EFEC] text-[#2D2D2A] border border-[#EBE9E1] rounded-bl-none font-normal"
                }`}
              >
                {m.text}
              </div>
              {m.sender === "user" && (
                <div className="w-8 h-8 rounded-xl bg-[#B07D62]/10 text-[#B07D62] border border-[#B07D62]/20 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-3 text-xs text-[#5A6A5A] font-semibold">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Linual AI is reviewing your life vault...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3.5 border-t border-[#EBE9E1] bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Linual AI anything about your life..."
              className="flex-1 bg-[#F1EFEC] border border-[#EBE9E1] rounded-2xl px-4 py-2.5 text-xs text-[#2D2D2A] placeholder-[#6B6A65] focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-2xl bg-[#5A6A5A] hover:bg-[#4f5f4f] text-white disabled:opacity-50 transition-all shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
