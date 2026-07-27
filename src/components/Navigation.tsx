import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  FolderLock,
  MoonStar,
  Target,
  CheckSquare,
  BookMarked,
  Wallet,
  Activity,
  GraduationCap,
  ListTodo,
  Users,
  Compass,
  Trophy,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
  Award,
} from "lucide-react";
import { calculateLevel } from "../lib/xpEngine";

export interface NavItem {
  key: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  shortcut?: string;
}

export interface NavCategory {
  id: string;
  title: string;
  items: NavItem[];
}

export const NAV_CATEGORIES: NavCategory[] = [
  {
    id: "core",
    title: "CORE",
    items: [
      { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, shortcut: "⌘1" },
      { key: "manual", label: "Life Manual", icon: FolderLock, shortcut: "⌘2" },
    ],
  },
  {
    id: "routines",
    title: "DAILY ROUTINES",
    items: [
      { key: "salah", label: "Salah & Islamic", icon: MoonStar, badge: "Islamic", shortcut: "⌘3" },
      { key: "habits", label: "Habits", icon: CheckSquare, shortcut: "⌘4" },
      { key: "journal", label: "Journal & Mood", icon: BookMarked, shortcut: "⌘5" },
    ],
  },
  {
    id: "growth",
    title: "GROWTH TRACKERS",
    items: [
      { key: "goals", label: "Goals", icon: Target, shortcut: "⌘6" },
      { key: "finance", label: "Finance", icon: Wallet, shortcut: "⌘7" },
      { key: "health", label: "Health & Gym", icon: Activity, shortcut: "⌘8" },
      { key: "learning", label: "Learning & GPA", icon: GraduationCap, badge: "Student", shortcut: "⌘9" },
    ],
  },
  {
    id: "planner",
    title: "PLANNER & SYSTEM",
    items: [
      { key: "tasks", label: "Tasks & Notes", icon: ListTodo },
      { key: "relationships", label: "Relationships", icon: Users },
      { key: "guide", label: "User Guide & Flow", icon: Compass },
      { key: "rewards", label: "Rewards & XP", icon: Trophy },
      { key: "settings", label: "Settings", icon: Settings },
    ],
  },
];

// Flat export for backwards compatibility
export const NAV_ITEMS: NavItem[] = NAV_CATEGORIES.flatMap((cat) => cat.items);

interface NavigationProps {
  activeModule: string;
  onSelectModule: (key: string) => void;
  activeModulesMap: Record<string, boolean>;
  userName?: string;
  userXp?: number;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeModule,
  onSelectModule,
  activeModulesMap,
  userName = "Life Explorer",
  userXp = 0,
  isCollapsed: controlledIsCollapsed,
  onToggleCollapse,
  isMobileOpen: controlledIsMobileOpen,
  onCloseMobile,
}) => {
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [showLevelTooltip, setShowLevelTooltip] = useState<boolean>(false);

  const isCollapsed = controlledIsCollapsed ?? false;
  const isMobileOpen = controlledIsMobileOpen ?? false;

  const toggleCollapse = () => {
    onToggleCollapse?.();
  };

  const closeMobile = () => {
    onCloseMobile?.();
  };

  // Keyboard shortcut handling (Ctrl+B or Cmd+\)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle collapse/expand with Ctrl+B or Cmd+\
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      if ((cmdOrCtrl && e.key.toLowerCase() === "b") || (e.metaKey && e.key === "\\")) {
        e.preventDefault();
        toggleCollapse();
        return;
      }

      // Close mobile drawer on Escape
      if (e.key === "Escape" && isMobileOpen) {
        e.preventDefault();
        closeMobile();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileOpen, isCollapsed]);

  // Handle category expand/collapse
  const toggleCategory = (catId: string) => {
    setCollapsedCategories((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  // Handle module selection with haptic feedback
  const handleSelect = (key: string) => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(8);
      } catch (err) {
        // Safe fallback for environments that disable haptics
      }
    }
    onSelectModule(key);
    if (isMobileOpen) {
      closeMobile();
    }
  };

  const levelInfo = calculateLevel(userXp);

  // Filter visible categories based on activeModulesMap
  const visibleCategories = NAV_CATEGORIES.map((cat) => ({
    ...cat,
    items: cat.items.filter(
      (item) =>
        item.key === "settings" ||
        item.key === "rewards" ||
        activeModulesMap[item.key] !== false
    ),
  })).filter((cat) => cat.items.length > 0);

  // Spring physics config
  const springTransition = { type: "spring", stiffness: 300, damping: 30 };

  return (
    <>
      {/* ========================================================= */}
      {/* 1. DESKTOP & TABLET DOCKED SIDEBAR (Hidden on <768px Mobile) */}
      {/* ========================================================= */}
      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed ? 68 : 240,
        }}
        transition={springTransition}
        className="hidden md:flex flex-col h-[calc(100vh-61px)] sticky top-[61px] z-20 bg-white/90 backdrop-blur-md border-r border-[#EBE9E1] text-[#2D2D2A] select-none shrink-0"
      >
        {/* Sidebar Header: Brand & Collapse Toggle Button */}
        <div className="p-3.5 border-b border-[#EBE9E1] flex items-center justify-between gap-2 overflow-hidden">
          {!isCollapsed ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2.5 min-w-0"
            >
              <img
                src="./app_icon.png"
                alt="Linual Icon"
                className="w-8 h-8 rounded-xl object-cover shadow-xs border border-[#EBE9E1] shrink-0"
              />
              <div className="truncate">
                <span className="font-serif font-bold text-base text-[#2D2D2A] italic">Linual</span>
                <p className="text-[10px] text-[#6B6A65] truncate">Personal Life Manual</p>
              </div>
            </motion.div>
          ) : (
            <div className="w-full flex justify-center">
              <img
                src="./app_icon.png"
                alt="Linual Icon"
                className="w-8 h-8 rounded-xl object-cover shadow-xs border border-[#EBE9E1]"
              />
            </div>
          )}

          {/* Expand/Collapse Toggle Button */}
          <button
            onClick={toggleCollapse}
            className="p-1.5 rounded-xl hover:bg-[#F1EFEC] text-[#6B6A65] hover:text-[#2D2D2A] transition-all cursor-pointer shrink-0"
            title={isCollapsed ? "Expand Sidebar (Ctrl+B / Cmd+\\)" : "Collapse Sidebar (Ctrl+B / Cmd+\\)"}
            aria-label="Toggle Sidebar Collapse"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-[#5A6A5A]" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-[#5A6A5A]" />
            )}
          </button>
        </div>

        {/* Categorized Modules Navigation List */}
        <div className="flex-1 overflow-y-auto no-scrollbar py-3 px-2 space-y-4">
          {visibleCategories.map((cat) => {
            const isCatCollapsed = collapsedCategories[cat.id];
            return (
              <div key={cat.id} className="space-y-1">
                {/* Category Header Label (Expanded Mode) */}
                {!isCollapsed && (
                  <button
                    onClick={() => toggleCategory(cat.id)}
                    className="w-full flex items-center justify-between px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#6B6A65] hover:text-[#2D2D2A] transition-colors group cursor-pointer"
                  >
                    <span>{cat.title}</span>
                    <ChevronDown
                      className={`w-3 h-3 text-[#6B6A65] transition-transform duration-200 ${
                        isCatCollapsed ? "-rotate-90" : ""
                      }`}
                    />
                  </button>
                )}

                {/* Collapsed Category Divider Line */}
                {isCollapsed && (
                  <div className="my-2 border-t border-[#EBE9E1]/80 w-8 mx-auto" />
                )}

                {/* Module Items */}
                {(!isCatCollapsed || isCollapsed) && (
                  <div className="space-y-0.5">
                    {cat.items.map((item) => {
                      const Icon = item.icon;
                      const isSelected = activeModule === item.key;
                      return (
                        <div
                          key={item.key}
                          className="relative group"
                          onMouseEnter={() => setHoveredItem(item.key)}
                          onMouseLeave={() => setHoveredItem(null)}
                        >
                          <button
                            onClick={() => handleSelect(item.key)}
                            className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer relative ${
                              isCollapsed ? "justify-center" : "justify-start"
                            } ${
                              isSelected
                                ? "bg-[#5A6A5A] text-white shadow-xs font-semibold"
                                : "text-[#6B6A65] hover:text-[#2D2D2A] hover:bg-[#F1EFEC]"
                            }`}
                          >
                            {/* Selected Active Indicator Accent Line */}
                            {isSelected && !isCollapsed && (
                              <motion.div
                                layoutId="activeIndicator"
                                className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#B07D62] rounded-r-full"
                              />
                            )}

                            <Icon
                              className={`w-4 h-4 shrink-0 transition-transform ${
                                isSelected ? "text-white scale-105" : "text-[#5A6A5A]"
                              }`}
                            />

                            {!isCollapsed && (
                              <div className="flex-1 flex items-center justify-between min-w-0">
                                <span className="truncate">{item.label}</span>
                                {item.badge && (
                                  <span
                                    className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider shrink-0 ml-1 ${
                                      isSelected
                                        ? "bg-white/20 text-white"
                                        : "bg-[#B07D62]/10 text-[#B07D62] border border-[#B07D62]/20"
                                    }`}
                                  >
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                            )}
                          </button>

                          {/* Floating Tooltip in Collapsed Rail Mode */}
                          {isCollapsed && hoveredItem === item.key && (
                            <motion.div
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -8 }}
                              transition={{ duration: 0.15 }}
                              className="absolute left-full ml-2.5 top-1/2 -translate-y-1/2 z-50 bg-[#2D2D2A] text-white text-xs px-3 py-1.5 rounded-xl shadow-lg whitespace-nowrap flex items-center gap-2 pointer-events-none border border-[#2D2D2A]/80"
                            >
                              <span className="font-semibold">{item.label}</span>
                              {item.badge && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#B07D62] text-white font-bold uppercase">
                                  {item.badge}
                                </span>
                              )}
                              {item.shortcut && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/20 text-white/90 font-mono">
                                  {item.shortcut}
                                </span>
                              )}
                              {/* Arrow */}
                              <div className="absolute right-full top-1/2 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-[#2D2D2A]" />
                            </motion.div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* User Level Summary Card (Bottom Sidebar) */}
        <div className="p-3 border-t border-[#EBE9E1] bg-[#FAF9F6]/80 relative">
          {!isCollapsed ? (
            <div className="p-2.5 rounded-2xl bg-white border border-[#EBE9E1] shadow-xs space-y-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-[#B07D62]/15 border border-[#B07D62]/30 text-[#B07D62] flex items-center justify-center font-bold text-xs shrink-0">
                  Lvl {levelInfo.level}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-[#2D2D2A] truncate">{userName}</div>
                  <div className="text-[10px] text-[#B07D62] font-semibold truncate">{levelInfo.title}</div>
                </div>
              </div>

              {/* XP Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px] text-[#6B6A65]">
                  <span>XP Level Progress</span>
                  <span className="font-bold text-[#2D2D2A]">{userXp} XP</span>
                </div>
                <div className="w-full h-1.5 bg-[#EBE9E1] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-linear-to-r from-[#5A6A5A] to-[#B07D62] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${levelInfo.progressPercent}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Collapsed Avatar Level Badge */
            <div
              className="flex justify-center relative cursor-pointer"
              onMouseEnter={() => setShowLevelTooltip(true)}
              onMouseLeave={() => setShowLevelTooltip(false)}
            >
              <div className="w-9 h-9 rounded-2xl bg-[#B07D62]/15 border border-[#B07D62]/30 text-[#B07D62] flex items-center justify-center font-extrabold text-xs shadow-xs hover:scale-105 transition-transform">
                L{levelInfo.level}
              </div>

              {/* Floating Level Tooltip Card */}
              {showLevelTooltip && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  className="absolute left-full ml-3 bottom-0 z-50 w-52 bg-[#2D2D2A] text-white p-3 rounded-2xl shadow-xl border border-[#2D2D2A]/80 text-xs space-y-2 pointer-events-none"
                >
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#B07D62]" />
                    <div className="font-bold text-white truncate">{userName}</div>
                  </div>
                  <div className="text-[11px] text-amber-200 font-medium">
                    Level {levelInfo.level} — {levelInfo.title}
                  </div>
                  <div className="space-y-1 pt-1 border-t border-white/10">
                    <div className="flex justify-between text-[10px] text-gray-300">
                      <span>Progress</span>
                      <span>{levelInfo.progressPercent}% ({userXp} XP)</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#B07D62] rounded-full"
                        style={{ width: `${levelInfo.progressPercent}%` }}
                      />
                    </div>
                  </div>
                  {/* Arrow */}
                  <div className="absolute right-full bottom-3 border-y-4 border-y-transparent border-r-4 border-r-[#2D2D2A]" />
                </motion.div>
              )}
            </div>
          )}
        </div>
      </motion.aside>

      {/* ========================================================= */}
      {/* 2. MOBILE OFF-CANVAS DRAWER SYSTEM (<768px & Frame Modes) */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop Blur Mask */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeMobile}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Slide-in Drawer Window */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={springTransition}
              className="relative w-72 max-w-[80vw] h-full bg-white/95 backdrop-blur-md border-r border-[#EBE9E1] text-[#2D2D2A] flex flex-col z-50 shadow-2xl overflow-hidden"
            >
              {/* Universal Top Status Bar Spacer */}
              <div className="w-full bg-[#FAF9F6] h-[max(1.75rem,env(safe-area-inset-top))] shrink-0 border-b border-[#EBE9E1]" />

              {/* Drawer Header */}
              <div className="p-4 border-b border-[#EBE9E1] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-[#5A6A5A] text-white flex items-center justify-center font-serif font-bold text-base shadow-xs">
                    L
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-serif font-bold text-base text-[#2D2D2A] italic">Linual</span>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#5A6A5A]/10 text-[#5A6A5A] font-semibold border border-[#5A6A5A]/20">
                        LifeOS
                      </span>
                    </div>
                    <p className="text-[10px] text-[#6B6A65]">Personal Life Manual</p>
                  </div>
                </div>

                <button
                  onClick={closeMobile}
                  className="p-2 rounded-xl hover:bg-[#F1EFEC] text-[#6B6A65] hover:text-[#2D2D2A] transition-all cursor-pointer"
                  aria-label="Close drawer"
                >
                  <X className="w-5 h-5 text-[#2D2D2A]" />
                </button>
              </div>

              {/* Drawer Categorized List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-4">
                {visibleCategories.map((cat) => (
                  <div key={cat.id} className="space-y-1">
                    <div className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#6B6A65]">
                      {cat.title}
                    </div>
                    <div className="space-y-0.5">
                      {cat.items.map((item) => {
                        const Icon = item.icon;
                        const isSelected = activeModule === item.key;
                        return (
                          <button
                            key={item.key}
                            onClick={() => handleSelect(item.key)}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-medium transition-all cursor-pointer ${
                              isSelected
                                ? "bg-[#5A6A5A] text-white shadow-xs font-semibold"
                                : "text-[#6B6A65] hover:text-[#2D2D2A] hover:bg-[#F1EFEC]"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Icon
                                className={`w-4 h-4 ${
                                  isSelected ? "text-white" : "text-[#5A6A5A]"
                                }`}
                              />
                              <span>{item.label}</span>
                            </div>
                            {item.badge && (
                              <span
                                className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                                  isSelected
                                    ? "bg-white/20 text-white"
                                    : "bg-[#B07D62]/10 text-[#B07D62] border border-[#B07D62]/20"
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Drawer Bottom User Card */}
              <div className="p-4 pb-[max(1rem,env(safe-area-inset-bottom))] border-t border-[#EBE9E1] bg-[#FAF9F6]">
                <div className="p-3 rounded-2xl bg-white border border-[#EBE9E1] shadow-xs space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#B07D62]/15 border border-[#B07D62]/30 text-[#B07D62] flex items-center justify-center font-bold text-xs shrink-0">
                      Lvl {levelInfo.level}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-[#2D2D2A] truncate">{userName}</div>
                      <div className="text-[10px] text-[#B07D62] font-semibold truncate">{levelInfo.title}</div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-[#6B6A65]">
                      <span>Level Progress</span>
                      <span className="font-bold text-[#2D2D2A]">{userXp} XP</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#EBE9E1] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-linear-to-r from-[#5A6A5A] to-[#B07D62] rounded-full"
                        style={{ width: `${levelInfo.progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
