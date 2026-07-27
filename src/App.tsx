import React, { useState, useEffect, Suspense } from "react";
import { StorageEngine } from "./lib/storage";
import { Header } from "./components/Header";
import { Navigation } from "./components/Navigation";
import { LockScreen } from "./components/LockScreen";
import { GlobalSearch } from "./components/GlobalSearch";
import { AIAssistantModal } from "./components/AIAssistantModal";
import { Onboarding } from "./components/Onboarding";
import { LinualSplashScreen } from "./components/SplashScreen";
import { ToastContainer } from "./components/Toast";
import { MobileBottomNav } from "./components/MobileBottomNav";
import { QuickAddFAB } from "./components/QuickAddFAB";

// Lazy-loaded Module Views — reduces initial bundle by loading on navigation
const DashboardView = React.lazy(() => import("./components/modules/DashboardView").then(m => ({ default: m.DashboardView })));
const LifeManualView = React.lazy(() => import("./components/modules/LifeManualView").then(m => ({ default: m.LifeManualView })));
const GoalsView = React.lazy(() => import("./components/modules/GoalsView").then(m => ({ default: m.GoalsView })));
const SalahTrackerView = React.lazy(() => import("./components/modules/SalahTrackerView").then(m => ({ default: m.SalahTrackerView })));
const HabitTrackerView = React.lazy(() => import("./components/modules/HabitTrackerView").then(m => ({ default: m.HabitTrackerView })));
const JournalView = React.lazy(() => import("./components/modules/JournalView").then(m => ({ default: m.JournalView })));
const FinanceView = React.lazy(() => import("./components/modules/FinanceView").then(m => ({ default: m.FinanceView })));
const HealthView = React.lazy(() => import("./components/modules/HealthView").then(m => ({ default: m.HealthView })));
const LearningView = React.lazy(() => import("./components/modules/LearningView").then(m => ({ default: m.LearningView })));
const TasksAndNotesView = React.lazy(() => import("./components/modules/TasksAndNotesView").then(m => ({ default: m.TasksAndNotesView })));
const RelationshipsView = React.lazy(() => import("./components/modules/RelationshipsView").then(m => ({ default: m.RelationshipsView })));
const RewardsView = React.lazy(() => import("./components/modules/RewardsView").then(m => ({ default: m.RewardsView })));
const SettingsView = React.lazy(() => import("./components/modules/SettingsView").then(m => ({ default: m.SettingsView })));
const SystemGuideView = React.lazy(() => import("./components/modules/SystemGuideView").then(m => ({ default: m.SystemGuideView })));

export default function App() {
  const [appState, setAppState] = useState(() => StorageEngine.getAppState());
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [activeModule, setActiveModule] = useState<string>("dashboard");
  const [isLocked, setIsLocked] = useState<boolean>(() => {
    const s = StorageEngine.getAppState();
    return Boolean(s.security?.pinEnabled && s.security?.isLocked);
  });
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [showAI, setShowAI] = useState<boolean>(false);

  // Sidebar & Mobile Drawer State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);

  // Global Keyboard Shortcuts (⌘K / Ctrl+K for Search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      if (cmdOrCtrl && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setShowSearch((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Sync state changes
  const refreshAppState = () => {
    setAppState(StorageEngine.getAppState());
  };

  const handleXpChange = (delta: number) => {
    const newXp = StorageEngine.addXp(delta);
    setAppState((prev) => ({ ...prev, userXp: newXp }));
  };

  const handleFinishOnboarding = () => {
    const freshState = StorageEngine.getAppState();
    setShowSplash(false);
    setAppState(freshState);
  };

  const handleToggleSidebar = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setIsMobileDrawerOpen((prev) => !prev);
    } else {
      setIsSidebarCollapsed((prev) => !prev);
    }
  };

  if (!appState.onboardingCompleted && !appState.isOnboarded) {
    return <Onboarding onComplete={handleFinishOnboarding} />;
  }

  if (isLocked) {
    return (
      <LockScreen
        pinCode={appState.security?.pinCode || appState.vaultPin || "1234"}
        onUnlock={() => setIsLocked(false)}
        userName={appState.userProfile?.fullName || "Vault Owner"}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#2D2D2A] flex flex-col font-sans selection:bg-[#5A6A5A]/20 selection:text-[#5A6A5A] pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
      {showSplash && <LinualSplashScreen onFinish={() => setShowSplash(false)} />}
      {/* App Header */}
      <Header
        userName={appState.userProfile.fullName}
        xp={appState.userXp}
        onOpenSearch={() => setShowSearch(true)}
        onOpenAI={() => setShowAI(true)}
        onLock={() => setIsLocked(true)}
        onToggleSidebar={handleToggleSidebar}
      />

      {/* Main App Layout Container: Docked Sidebar + Module View Content */}
      <div className="flex-1 flex w-full relative">
        {/* Navigation Sidebar & Off-Canvas Mobile Drawer */}
        <Navigation
          activeModule={activeModule}
          onSelectModule={setActiveModule}
          activeModulesMap={appState.activeModules}
          userName={appState.userProfile.fullName}
          userXp={appState.userXp}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
          isMobileOpen={isMobileDrawerOpen}
          onCloseMobile={() => setIsMobileDrawerOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 pb-24 md:pb-6 min-w-0 transition-all">
          <div className="w-full">
            <Suspense fallback={
              <div className="flex items-center justify-center py-24">
                <div className="w-8 h-8 border-3 border-[#EBE9E1] border-t-[#5A6A5A] rounded-full animate-spin" />
              </div>
            }>
              {renderModuleView(activeModule, setActiveModule, setShowAI, handleXpChange, refreshAppState)}
            </Suspense>
          </div>
        </main>
      </div>

      {/* Toast Notification Container */}
      <ToastContainer />

      {/* Mobile Bottom Navigation Dock */}
      <MobileBottomNav
        activeModule={activeModule}
        onSelectModule={setActiveModule}
        onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
      />

      {/* Quick-Add Universal FAB Button */}
      <QuickAddFAB onXpChange={handleXpChange} onRefreshData={refreshAppState} />

      {/* Global Modals */}
      {showSearch && (
        <GlobalSearch
          isOpen={showSearch}
          onClose={() => setShowSearch(false)}
          onNavigateModule={(mod) => setActiveModule(mod)}
        />
      )}

      {showAI && <AIAssistantModal onClose={() => setShowAI(false)} />}
    </div>
  );
}

// Module Renderer Function
function renderModuleView(
  moduleKey: string,
  onNavigate: (key: string) => void,
  onOpenAI: () => void,
  onXpChange: (delta: number) => void,
  onRefreshState: () => void
) {
  switch (moduleKey) {
    case "dashboard":
      return <DashboardView onNavigate={onNavigate} onOpenAI={onOpenAI} onXpChange={onXpChange} />;
    case "manual":
      return <LifeManualView />;
    case "salah":
      return <SalahTrackerView onXpChange={onXpChange} />;
    case "goals":
      return <GoalsView onXpChange={onXpChange} />;
    case "habits":
      return <HabitTrackerView onXpChange={onXpChange} />;
    case "journal":
      return <JournalView onXpChange={onXpChange} />;
    case "finance":
      return <FinanceView onXpChange={onXpChange} />;
    case "health":
      return <HealthView onXpChange={onXpChange} />;
    case "learning":
      return <LearningView onXpChange={onXpChange} />;
    case "tasks":
      return <TasksAndNotesView onXpChange={onXpChange} />;
    case "relationships":
      return <RelationshipsView />;
    case "rewards":
      return <RewardsView />;
    case "guide":
      return <SystemGuideView />;
    case "settings":
      return <SettingsView onModuleTogglesChange={onRefreshState} />;
    default:
      return <DashboardView onNavigate={onNavigate} onOpenAI={onOpenAI} onXpChange={onXpChange} />;
  }
}
