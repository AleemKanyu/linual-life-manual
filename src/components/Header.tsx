import React from "react";
import { Search, PanelLeft, Sparkles, Lock } from "lucide-react";

interface HeaderProps {
  userName: string;
  xp: number;
  onOpenSearch: () => void;
  onOpenAI: () => void;
  onLock: () => void;
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenAI,
  onLock,
  onToggleSidebar,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#EBE9E1] px-4 pt-[max(0.5rem,env(safe-area-inset-top))] pb-2 text-[#2D2D2A] transition-colors">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Sidebar Menu Toggle & Search */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl bg-[#F1EFEC] hover:bg-[#EBE9E1] text-[#2D2D2A] transition-all shadow-xs flex items-center justify-center cursor-pointer focus:outline-none"
            title="Toggle Navigation Menu (Ctrl+B)"
            aria-label="Toggle Navigation Menu"
          >
            <PanelLeft className="w-5 h-5 text-[#5A6A5A]" />
          </button>

          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="py-1.5 px-3 rounded-xl bg-[#F1EFEC] hover:bg-[#EBE9E1] text-[#2D2D2A] text-xs flex items-center gap-2 transition-all border border-[#EBE9E1]"
          >
            <Search className="w-4 h-4 text-[#5A6A5A]" />
            <span className="text-[#6B6A65] font-medium hidden sm:inline">Search life vault...</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-[#6B6A65] font-mono border border-[#EBE9E1]">⌘K</span>
          </button>
        </div>

        {/* Right Actions: AI Companion & Vault Lock */}
        <div className="flex items-center gap-2">
          {/* AI Assistant Quick Trigger */}
          <button
            onClick={onOpenAI}
            className="px-3 py-1.5 rounded-xl bg-[#5A6A5A]/10 hover:bg-[#5A6A5A]/20 text-[#5A6A5A] text-xs font-semibold flex items-center gap-1.5 border border-[#5A6A5A]/20 transition-all cursor-pointer"
            title="Linual AI Companion"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#B07D62]" />
            <span className="hidden sm:inline">Linual AI</span>
          </button>

          {/* Lock Vault Screen Button */}
          <button
            onClick={onLock}
            className="p-2 rounded-xl bg-[#F1EFEC] hover:bg-rose-50 text-[#6B6A65] hover:text-rose-600 transition-all border border-[#EBE9E1] flex items-center justify-center cursor-pointer"
            title="Lock Vault Screen"
            aria-label="Lock Vault Screen"
          >
            <Lock className="w-4 h-4 text-[#6B6A65]" />
          </button>
        </div>
      </div>
    </header>
  );
};
