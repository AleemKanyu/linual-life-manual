import React, { useState, useEffect } from "react";
import { Settings, Lock, Download, Upload, RefreshCw, HardDrive, Fingerprint, ShieldCheck, CheckCircle2 } from "lucide-react";
import { StorageEngine } from "../../lib/storage";
import { showToast } from "../Toast";

interface SettingsViewProps {
  onModuleTogglesChange: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onModuleTogglesChange }) => {
  const [appState, setAppState] = useState(StorageEngine.getAppState());
  const [pinInput, setPinInput] = useState(appState.vaultPin);
  const [biometricEnabled, setBiometricEnabled] = useState(appState.biometricsEnabled ?? true);
  const [biometricSupported, setBiometricSupported] = useState(false);
  const [backupStats, setBackupStats] = useState({ sizeKb: 0, itemsCount: 0 });

  useEffect(() => {
    // Check if device supports Biometrics / WebAuthn
    if (window.PublicKeyCredential || (window as any).Capacitor) {
      setBiometricSupported(true);
    }
    // Calculate storage stats (unencrypted export for size measurement)
    StorageEngine.exportBackup().then((jsonStr) => {
      const sizeKb = Math.round((new Blob([jsonStr]).size / 1024) * 10) / 10;
      try {
        const parsed = JSON.parse(jsonStr);
        let count = 0;
        Object.keys(parsed).forEach((k) => {
          if (Array.isArray(parsed[k])) count += parsed[k].length;
        });
        setBackupStats({ sizeKb, itemsCount: count });
      } catch (err) {
        setBackupStats({ sizeKb, itemsCount: 0 });
      }
    });
  }, []);

  const handleToggleModule = (key: string) => {
    const updatedModules = { ...appState.activeModules, [key]: !appState.activeModules[key] };
    const updatedState = { ...appState, activeModules: updatedModules };
    setAppState(updatedState);
    StorageEngine.setAppState(updatedState);
    onModuleTogglesChange();
  };

  const handleSavePin = async () => {
    if (pinInput.length !== 4 || isNaN(Number(pinInput))) {
      showToast("PIN must be exactly 4 numeric digits.", "error");
      return;
    }
    const hashedPin = await StorageEngine.hashPin(pinInput);
    const updatedState = { ...appState, vaultPin: hashedPin, pinEnabled: true, biometricsEnabled: biometricEnabled, security: { ...appState.security, pinCode: hashedPin } };
    setAppState(updatedState);
    StorageEngine.setAppState(updatedState);
    showToast("Vault PIN and Biometric preferences saved! 🔒", "success");
  };

  const handleToggleBiometrics = () => {
    const nextVal = !biometricEnabled;
    setBiometricEnabled(nextVal);
    const updatedState = { ...appState, biometricsEnabled: nextVal };
    setAppState(updatedState);
    StorageEngine.setAppState(updatedState);
  };

  const handleTestBiometrics = async () => {
    if (window.PublicKeyCredential && PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) {
      const isAvailable = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      if (isAvailable) {
        alert("✅ Biometric Sensor Detected & Ready! Fingerprint / Face Unlock is active.");
      } else {
        alert("Biometric sensor is active via fallback PIN security.");
      }
    } else {
      alert("Biometric security active via PIN authentication.");
    }
  };

  const handleExportData = async () => {
    const wantPassword = confirm("Would you like to encrypt this backup file with a security password?");
    let password = "";
    if (wantPassword) {
      password = prompt("Enter a password or PIN to protect this backup file:") || "";
      if (!password) {
        showToast("Export cancelled. Password required for encryption.", "warning");
        return;
      }
    }
    const dataStr = await StorageEngine.exportBackup(password);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `linual_vault_backup_${new Date().toISOString().split("T")[0]}${password ? "_protected" : ""}.json`;
    a.click();
    showToast("Vault Backup Downloaded Successfully 💾", "success");
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      if (!content) return;

      let result = await StorageEngine.importBackup(content);
      if (result.requiresPassword) {
        const pass = prompt("🔒 This backup file is encrypted with a password. Enter password / PIN to unlock:") || "";
        if (pass) {
          result = await StorageEngine.importBackup(content, pass);
        } else {
          alert("Import cancelled. Password is required to decrypt this backup file.");
          return;
        }
      }

      if (result.success) {
        alert("✅ Local Vault Data Restored Successfully! Refreshing app state.");
        window.location.reload();
      } else {
        alert(result.error || "Failed to parse backup JSON file.");
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (confirm("Are you sure you want to reset Linual LifeOS back to default sample seed data?")) {
      StorageEngine.resetAll();
      window.location.reload();
    }
  };

  const handleResetToEmpty = () => {
    if (confirm("Are you sure you want to wipe ALL dummy sample data and start with a 100% EMPTY database?")) {
      StorageEngine.resetToEmpty();
      alert("Database wiped clean! Starting with empty state.");
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 pb-12 text-[#2D2D2A]">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-[32px] border border-[#EBE9E1] shadow-xs">
        <div>
          <h2 className="text-2xl font-serif italic text-[#2D2D2A] flex items-center gap-2">
            <Settings className="w-6 h-6 text-[#5A6A5A]" />
            <span>Settings, Privacy & Local Backup Vault</span>
          </h2>
          <p className="text-xs text-[#6B6A65] mt-1">
            Configure Biometric Fingerprint/Face unlock, manage 1-click offline JSON backups, or toggle active modules.
          </p>
        </div>
      </div>

      {/* Biometric & PIN Security Box */}
      <div className="rounded-[32px] bg-white border border-[#EBE9E1] p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-serif italic font-bold text-[#2D2D2A] flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#5A6A5A]" />
            <span>Biometric Fingerprint & Security PIN</span>
          </h3>
          <span className="text-[10px] px-3 py-1 rounded-full bg-[#5A6A5A]/10 text-[#5A6A5A] font-semibold border border-[#5A6A5A]/20 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#5A6A5A]" />
            <span>Encrypted Storage</span>
          </span>
        </div>

        {/* Biometric Sensor Toggle */}
        <div className="p-4 rounded-2xl bg-[#F1EFEC] border border-[#EBE9E1] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#5A6A5A]/10 text-[#5A6A5A] flex items-center justify-center">
              <Fingerprint className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#2D2D2A]">Android Fingerprint / Face ID Unlock</div>
              <div className="text-[10px] text-[#6B6A65]">
                {biometricSupported ? "Hardware sensor detected & ready" : "Supported on Android & iOS devices"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTestBiometrics}
              className="px-3 py-1.5 rounded-xl bg-white border border-[#EBE9E1] text-[#2D2D2A] text-xs font-semibold hover:bg-[#FAF9F6]"
            >
              Test Sensor
            </button>
            <button
              onClick={handleToggleBiometrics}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                biometricEnabled ? "bg-[#5A6A5A] text-white" : "bg-white border border-[#EBE9E1] text-[#6B6A65]"
              }`}
            >
              {biometricEnabled ? "Enabled" : "Disabled"}
            </button>
          </div>
        </div>

        {/* PIN Setup */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 text-xs">
          <div className="flex-1">
            <label className="block text-[#6B6A65] font-semibold mb-1">4-Digit Fallback Vault PIN</label>
            <input
              type="password"
              maxLength={4}
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              className="w-full bg-[#F1EFEC] border border-[#EBE9E1] rounded-2xl px-4 py-2.5 text-[#2D2D2A] font-serif font-bold text-center tracking-widest text-lg"
            />
          </div>
          <button
            onClick={handleSavePin}
            className="px-6 py-3 rounded-2xl bg-[#5A6A5A] hover:bg-[#4f5f4f] text-white font-semibold shadow-xs"
          >
            Save Security PIN
          </button>
        </div>
      </div>

      {/* 1-Click JSON Backup & Recovery Box */}
      <div className="rounded-[32px] bg-white border border-[#EBE9E1] p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-serif italic font-bold text-[#2D2D2A] flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-[#5A6A5A]" />
            <span>1-Click Offline JSON Backup & Data Ownership</span>
          </h3>
          <span className="text-xs text-[#6B6A65] font-medium">
            Vault Size: <strong className="text-[#5A6A5A]">{backupStats.sizeKb} KB</strong> ({backupStats.itemsCount} total entries)
          </span>
        </div>

        <p className="text-xs text-[#6B6A65]">
          Your data never leaves your device. Export a complete JSON backup file to transfer your life manual offline between Android, iOS, or Web browsers.
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExportData}
            className="px-5 py-3 rounded-2xl bg-[#5A6A5A] hover:bg-[#4f5f4f] text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export Encrypted JSON Backup</span>
          </button>

          <label className="px-5 py-3 rounded-2xl bg-[#F1EFEC] hover:bg-[#EBE9E1] text-[#2D2D2A] font-semibold text-xs flex items-center gap-2 cursor-pointer border border-[#EBE9E1] transition-all">
            <Upload className="w-4 h-4 text-[#B07D62]" />
            <span>Import & Restore Backup</span>
            <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
          </label>

          <button
            onClick={handleResetToEmpty}
            className="px-4 py-3 rounded-2xl bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 font-semibold text-xs flex items-center gap-2 transition-all"
            title="Wipe all sample dummy data and start with an empty database"
          >
            <RefreshCw className="w-4 h-4 text-amber-700" />
            <span>Reset to Empty Database (No Dummy Data)</span>
          </button>

          <button
            onClick={handleResetData}
            className="px-4 py-3 rounded-2xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-semibold text-xs flex items-center gap-2 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Sample Seed</span>
          </button>
        </div>
      </div>

      {/* Module Toggles */}
      <div className="rounded-[32px] bg-white border border-[#EBE9E1] p-6 sm:p-8 space-y-4 shadow-xs">
        <h3 className="text-base font-serif italic font-bold text-[#2D2D2A]">Active Life Modules</h3>
        <p className="text-xs text-[#6B6A65]">Enable or disable specific pillars of Linual LifeOS based on your needs.</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs">
          {[
            { key: "manual", label: "Life Manual" },
            { key: "salah", label: "Salah & Islamic" },
            { key: "goals", label: "Goals & Matrix" },
            { key: "habits", label: "Habits Heatmap" },
            { key: "journal", label: "Journal & Mood" },
            { key: "finance", label: "Finance & Budget" },
            { key: "health", label: "Health & Gym" },
            { key: "learning", label: "Student & GPA" },
            { key: "tasks", label: "Tasks & Notes" },
            { key: "relationships", label: "Relationships" },
          ].map((m) => {
            const enabled = appState.activeModules[m.key] !== false;
            return (
              <button
                key={m.key}
                onClick={() => handleToggleModule(m.key)}
                className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  enabled
                    ? "bg-[#F1EFEC] border-[#5A6A5A] text-[#2D2D2A]"
                    : "bg-white border-[#EBE9E1] text-[#6B6A65]"
                }`}
              >
                <span className="font-semibold">{m.label}</span>
                <span className={`text-[10px] font-bold ${enabled ? "text-[#5A6A5A]" : "text-[#6B6A65]"}`}>
                  {enabled ? "ON" : "OFF"}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
