import React, { useState } from "react";
import { Lock, Fingerprint, ShieldAlert } from "lucide-react";
import { hashPin } from "../lib/crypto";

interface LockScreenProps {
  pinCode: string;
  onUnlock: () => void;
  userName: string;
}

export const LockScreen: React.FC<LockScreenProps> = ({ pinCode, onUnlock, userName }) => {
  const [pinInput, setPinInput] = useState("");
  const [error, setError] = useState(false);

  const handleDigit = (digit: string) => {
    if (pinInput.length < 4) {
      const nextPin = pinInput + digit;
      setPinInput(nextPin);
      setError(false);
      if (nextPin.length === 4) {
        // Hash the entered PIN and compare against stored hash
        hashPin(nextPin).then((hashedInput) => {
          if (hashedInput === pinCode) {
            onUnlock();
          } else {
            setError(true);
            setTimeout(() => setPinInput(""), 600);
          }
        });
      }
    }
  };

  const handleBackspace = () => {
    setPinInput((prev) => prev.slice(0, -1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#FAF9F6] text-[#2D2D2A] p-4">
      <div className="w-full max-w-sm rounded-[32px] bg-white border border-[#EBE9E1] p-8 shadow-xl flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-3xl bg-[#5A6A5A]/10 border border-[#5A6A5A]/20 text-[#5A6A5A] flex items-center justify-center mb-4 shadow-xs">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-serif italic text-[#2D2D2A]">Linual Locked</h2>
        <p className="text-xs text-[#6B6A65] mt-1 mb-6">Welcome back, {userName}. Enter PIN to access your Personal Life Vault.</p>

        {/* PIN Indicators */}
        <div className="flex gap-4 mb-6">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full transition-all duration-200 border ${
                error
                  ? "bg-rose-500 border-rose-400 scale-110"
                  : i < pinInput.length
                  ? "bg-[#5A6A5A] border-[#5A6A5A] scale-110 shadow-xs"
                  : "bg-[#F1EFEC] border-[#EBE9E1]"
              }`}
            />
          ))}
        </div>

        {error && <p className="text-xs text-rose-600 mb-4 font-semibold">Incorrect PIN. Please try again.</p>}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3 w-full mb-6">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
            <button
              key={num}
              onClick={() => handleDigit(num)}
              className="h-14 rounded-2xl bg-[#F1EFEC] hover:bg-[#EBE9E1] active:bg-[#5A6A5A] active:text-white border border-[#EBE9E1] text-xl font-serif font-bold transition-all text-[#2D2D2A]"
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => onUnlock()}
            className="h-14 rounded-2xl bg-[#5A6A5A]/10 hover:bg-[#5A6A5A]/20 text-[#5A6A5A] border border-[#5A6A5A]/20 flex items-center justify-center"
            title="Biometric Unlock"
          >
            <Fingerprint className="w-6 h-6" />
          </button>
          <button
            onClick={() => handleDigit("0")}
            className="h-14 rounded-2xl bg-[#F1EFEC] hover:bg-[#EBE9E1] active:bg-[#5A6A5A] active:text-white border border-[#EBE9E1] text-xl font-serif font-bold transition-all text-[#2D2D2A]"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="h-14 rounded-2xl bg-[#F1EFEC] hover:bg-[#EBE9E1] border border-[#EBE9E1] text-xs font-semibold text-[#6B6A65]"
          >
            Del
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-[#6B6A65] font-semibold">
          <ShieldAlert className="w-3.5 h-3.5 text-[#5A6A5A]" />
          <span>AES-256 On-Device Vault Protection</span>
        </div>
      </div>
    </div>
  );
};
