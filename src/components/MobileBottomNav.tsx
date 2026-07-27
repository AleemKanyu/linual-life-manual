import React from "react";
import { LayoutDashboard, MoonStar, CheckSquare, Wallet, Menu } from "lucide-react";

interface MobileBottomNavProps {
  activeModule: string;
  onSelectModule: (key: string) => void;
  onOpenMobileDrawer: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeModule,
  onSelectModule,
  onOpenMobileDrawer,
}) => {
  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "salah", label: "Salah", icon: MoonStar },
    { key: "habits", label: "Habits", icon: CheckSquare },
    { key: "finance", label: "Finance", icon: Wallet },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EBE9E1] px-2 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))] shadow-lg flex items-center justify-around text-[#2D2D2A]">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeModule === item.key;
        return (
          <button
            key={item.key}
            onClick={() => onSelectModule(item.key)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all ${
              isActive ? "text-[#5A6A5A] font-bold scale-105" : "text-[#6B6A65] font-medium"
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? "text-[#5A6A5A]" : "text-[#6B6A65]"}`} />
            <span className="text-[10px] font-semibold">{item.label}</span>
          </button>
        );
      })}

      {/* 5th Button: Open More Mobile Drawer */}
      <button
        onClick={onOpenMobileDrawer}
        className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[#6B6A65] font-medium hover:text-[#2D2D2A]"
      >
        <Menu className="w-5 h-5 text-[#6B6A65]" />
        <span className="text-[10px] font-semibold">More</span>
      </button>
    </nav>
  );
};
