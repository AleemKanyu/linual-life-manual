import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ShieldCheck, Upload, CheckCircle2, Lock, Sparkles, KeyRound } from "lucide-react";
import { StorageEngine } from "../lib/storage";

interface OnboardingProps {
  onComplete: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentPage, setCurrentPage] = useState<1 | 2 | 3>(1);
  const [showSetupModal, setShowSetupModal] = useState<boolean>(false);
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [pendingBackupJson, setPendingBackupJson] = useState<string>("");
  const [backupPasswordInput, setBackupPasswordInput] = useState<string>("");
  const [backupError, setBackupError] = useState<string>("");

  // Touch swipe states
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 40 && currentPage < 3) {
      setCurrentPage((prev) => (prev + 1) as 1 | 2 | 3);
    } else if (distance < -40 && currentPage > 1) {
      setCurrentPage((prev) => (prev - 1) as 1 | 2 | 3);
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Setup form states
  const [name, setName] = useState<string>("");
  const [pin, setPin] = useState<string>("1234");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNextPage = () => {
    if (currentPage === 1) setCurrentPage(2);
    else if (currentPage === 2) setCurrentPage(3);
  };

  const handleFinishSetup = async () => {
    StorageEngine.resetToEmpty();
    const state = StorageEngine.getAppState();
    state.isOnboarded = true;
    state.onboardingCompleted = true;
    const enteredName = name.trim() || "User";
    state.userProfile.fullName = enteredName;
    state.userProfile.nickname = enteredName;
    // Hash the PIN with SHA-256 before storing — never store plaintext
    const hashedPin = await StorageEngine.hashPin(pin || "1234");
    state.security.pinCode = hashedPin;
    state.vaultPin = hashedPin;
    StorageEngine.setAppState(state);
    onComplete();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      if (!content) return;
      
      const res = await StorageEngine.importBackup(content);
      if (res.requiresPassword) {
        setPendingBackupJson(content);
        setBackupError("");
        setShowPasswordModal(true);
      } else if (res.success) {
        alert("Backup restored successfully! Welcome back.");
        onComplete();
      } else {
        alert(res.error || "Failed to parse backup file.");
      }
    };
    reader.readAsText(file);
  };

  const handleDecryptAndRestore = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await StorageEngine.importBackup(pendingBackupJson, backupPasswordInput);
    if (res.success) {
      setShowPasswordModal(false);
      alert("Backup successfully unlocked and restored!");
      onComplete();
    } else {
      setBackupError(res.error || "Incorrect password.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#2D2D2A] flex flex-col justify-between p-6 sm:p-10 select-none relative overflow-hidden">
      {/* Top Header Logo Brand */}
      <div className="w-full flex items-center justify-between z-10 pt-[max(0.5rem,env(safe-area-inset-top))]">
        <div className="flex items-center gap-2.5">
          <img
            src="./app_icon.png"
            alt="Linual Icon"
            className="w-9 h-9 rounded-2xl object-cover shadow-xs border border-[#EBE9E1]"
          />
          <span className="font-serif italic font-bold text-xl text-[#2D2D2A]">Linual</span>
        </div>

        {currentPage < 3 && (
          <button
            onClick={() => setCurrentPage(3)}
            className="text-xs font-semibold text-[#6B6A65] hover:text-[#2D2D2A] px-3 py-1.5 rounded-xl hover:bg-[#EBE9E1]/50 transition-colors cursor-pointer"
          >
            Skip
          </button>
        )}
      </div>

      {/* Main Content Area (Smooth 3-Slide Horizontal Carousel Track) */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="w-full flex-1 overflow-hidden my-auto max-w-md mx-auto z-10 cursor-grab active:cursor-grabbing flex items-center"
      >
        <motion.div
          animate={{ x: `-${(currentPage - 1) * 100}%` }}
          transition={{ type: "spring", stiffness: 280, damping: 28 }}
          className="flex w-full h-full"
        >
          {/* Slide 1 */}
          <div className="w-full shrink-0 flex flex-col items-center justify-center text-center space-y-6 px-4 select-none">
            <div className="w-full h-64 sm:h-72 flex items-center justify-center pointer-events-none">
              <img
                src="./onboarding_1.png"
                alt="Personal Life Manual"
                className="max-h-full max-w-full object-contain rounded-3xl"
              />
            </div>
            <div className="space-y-2 px-2">
              <h1 className="text-2xl sm:text-3xl font-serif italic font-bold text-[#2D2D2A]">
                Personal Life Operating System
              </h1>
              <p className="text-xs sm:text-sm text-[#6B6A65] leading-relaxed max-w-sm mx-auto">
                An offline-first encrypted manual for your daily habits, goals, identity documents, and personal growth.
              </p>
            </div>
          </div>

          {/* Slide 2 */}
          <div className="w-full shrink-0 flex flex-col items-center justify-center text-center space-y-6 px-4 select-none">
            <div className="w-full h-64 sm:h-72 flex items-center justify-center pointer-events-none">
              <img
                src="./onboarding_2.png"
                alt="Track Habits & Goals"
                className="max-h-full max-w-full object-contain rounded-3xl"
              />
            </div>
            <div className="space-y-2 px-2">
              <h1 className="text-2xl sm:text-3xl font-serif italic font-bold text-[#2D2D2A]">
                Track Daily Habits & Goals
              </h1>
              <p className="text-xs sm:text-sm text-[#6B6A65] leading-relaxed max-w-sm mx-auto">
                Maintain atomic habit streaks, track Salah times, coursework, and allowance budgets with instant XP rewards.
              </p>
            </div>
          </div>

          {/* Slide 3 */}
          <div className="w-full shrink-0 flex flex-col items-center justify-center text-center space-y-6 px-4 select-none">
            <div className="w-full h-64 sm:h-72 flex items-center justify-center pointer-events-none">
              <img
                src="./onboarding_3.png"
                alt="100% Encrypted Vault"
                className="max-h-full max-w-full object-contain rounded-3xl"
              />
            </div>
            <div className="space-y-2 px-2">
              <h1 className="text-2xl sm:text-3xl font-serif italic font-bold text-[#2D2D2A]">
                100% On-Device & Private
              </h1>
              <p className="text-xs sm:text-sm text-[#6B6A65] leading-relaxed max-w-sm mx-auto">
                Your data never leaves your device. Protected by local AES-256 encryption & native biometric unlock.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Action Area (Buttons & Page Indicator Dots) */}
      <div className="w-full max-w-md mx-auto space-y-5 z-10 pb-[max(1rem,env(safe-area-inset-bottom))]">
        {/* Next / Action Buttons */}
        {currentPage < 3 ? (
          <button
            onClick={handleNextPage}
            className="w-full py-3.5 rounded-2xl bg-[#5A6A5A] hover:bg-[#4f5f4f] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer active:scale-98"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="space-y-3">
            <button
              onClick={() => setShowSetupModal(true)}
              className="w-full py-3.5 rounded-2xl bg-[#5A6A5A] hover:bg-[#4f5f4f] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer active:scale-98"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Create New Vault</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 rounded-2xl bg-white hover:bg-[#F1EFEC] text-[#2D2D2A] font-semibold text-xs border border-[#EBE9E1] flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4 text-[#B07D62]" />
              <span>Restore Local Backup</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        )}

        {/* Page Indicator Dots (Matching Photo Specs: • ○ ○) */}
        <div className="flex items-center justify-center gap-2 pt-1">
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page as 1 | 2 | 3)}
              className={`transition-all duration-300 ${
                currentPage === page
                  ? "w-7 h-2 rounded-full bg-[#5A6A5A]"
                  : "w-2 h-2 rounded-full bg-[#EBE9E1] hover:bg-[#5A6A5A]/40"
              }`}
              aria-label={`Go to page ${page}`}
            />
          ))}
        </div>
      </div>

      {/* Quick Setup Modal */}
      {showSetupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-sm p-6 sm:p-8 rounded-[32px] bg-white border border-[#EBE9E1] space-y-4 shadow-xl text-left">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-[#5A6A5A]" />
              <h3 className="text-xl font-serif italic font-bold text-[#2D2D2A]">Vault Setup</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#6B6A65] font-semibold mb-1">Enter Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#F1EFEC] border border-[#EBE9E1] rounded-2xl px-4 py-2.5 text-[#2D2D2A]"
                  placeholder="e.g. Alex"
                />
              </div>

              <div>
                <label className="block text-[#6B6A65] font-semibold mb-1">4-Digit Security PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full bg-[#F1EFEC] border border-[#EBE9E1] rounded-2xl px-4 py-2.5 text-center text-lg font-serif font-bold text-[#5A6A5A]"
                />
              </div>

              <p className="text-[11px] text-[#6B6A65] pt-1">
                Your new LifeOS vault will be created with a 100% clean slate. All data is encrypted locally on your device.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowSetupModal(false)}
                className="w-1/3 py-2.5 rounded-2xl bg-[#F1EFEC] text-[#2D2D2A] text-xs font-semibold hover:bg-[#EBE9E1]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleFinishSetup}
                className="w-2/3 py-2.5 rounded-2xl bg-[#5A6A5A] text-white text-xs font-semibold hover:bg-[#4f5f4f] transition-all shadow-xs"
              >
                Enter LifeOS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backup Password Decryption Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <form onSubmit={handleDecryptAndRestore} className="w-full max-w-sm p-6 rounded-[32px] bg-white border border-[#EBE9E1] space-y-4 shadow-xl text-left">
            <div className="flex items-center gap-2">
              <KeyRound className="w-6 h-6 text-[#B07D62]" />
              <h3 className="text-xl font-serif italic font-bold text-[#2D2D2A]">Encrypted Backup</h3>
            </div>
            <p className="text-xs text-[#6B6A65]">
              This backup file is encrypted with a password. Enter the password assigned to this backup file to recover your vault.
            </p>

            <div className="space-y-2 text-xs">
              <label className="block text-[#6B6A65] font-semibold">Backup Password / PIN</label>
              <input
                type="password"
                required
                value={backupPasswordInput}
                onChange={(e) => setBackupPasswordInput(e.target.value)}
                className="w-full bg-[#F1EFEC] border border-[#EBE9E1] rounded-2xl px-4 py-2.5 text-[#2D2D2A] focus:outline-none focus:border-[#5A6A5A]"
                placeholder="Enter password..."
              />
              {backupError && <p className="text-rose-600 font-bold text-[11px]">{backupError}</p>}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="w-1/3 py-2.5 rounded-2xl bg-[#F1EFEC] text-[#2D2D2A] text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-2/3 py-2.5 rounded-2xl bg-[#5A6A5A] text-white text-xs font-semibold hover:bg-[#4f5f4f] transition-all shadow-xs"
              >
                Decrypt & Restore
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
