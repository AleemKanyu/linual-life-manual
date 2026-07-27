import React, { useState } from "react";
import { Search, X, FileText, Award, Target, CheckCircle2, BookOpen, User, DollarSign, Calendar } from "lucide-react";
import { StorageEngine } from "../lib/storage";

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateModule: (moduleKey: string) => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose, onNavigateModule }) => {
  const [query, setQuery] = useState("");

  if (!isOpen) return null;

  const docs = StorageEngine.getDocuments();
  const certs = StorageEngine.getCertificates();
  const goals = StorageEngine.getGoals();
  const tasks = StorageEngine.getTasks();
  const notes = StorageEngine.getNotes();
  const journal = StorageEngine.getJournal();
  const family = StorageEngine.getFamily();
  const txs = StorageEngine.getFinance();

  const q = query.toLowerCase().trim();

  const results = q === "" ? [] : [
    ...docs.filter((d) => d.title.toLowerCase().includes(q) || d.type.toLowerCase().includes(q)).map((d) => ({
      id: d.id,
      title: d.title,
      type: `Identity Doc (${d.type})`,
      icon: FileText,
      module: "manual",
    })),
    ...certs.filter((c) => c.title.toLowerCase().includes(q) || c.issuer.toLowerCase().includes(q)).map((c) => ({
      id: c.id,
      title: `${c.title} — ${c.issuer}`,
      type: "Certificate",
      icon: Award,
      module: "manual",
    })),
    ...goals.filter((g) => g.title.toLowerCase().includes(q) || g.description.toLowerCase().includes(q)).map((g) => ({
      id: g.id,
      title: g.title,
      type: `Goal (${g.category})`,
      icon: Target,
      module: "goals",
    })),
    ...tasks.filter((t) => t.title.toLowerCase().includes(q)).map((t) => ({
      id: t.id,
      title: t.title,
      type: `Task (${t.priority})`,
      icon: CheckCircle2,
      module: "tasks",
    })),
    ...notes.filter((n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)).map((n) => ({
      id: n.id,
      title: n.title,
      type: `Note (${n.folder})`,
      icon: BookOpen,
      module: "tasks",
    })),
    ...journal.filter((j) => j.title.toLowerCase().includes(q) || j.content.toLowerCase().includes(q)).map((j) => ({
      id: j.id,
      title: j.title,
      type: `Journal (${j.type})`,
      icon: Calendar,
      module: "journal",
    })),
    ...family.filter((f) => f.name.toLowerCase().includes(q) || f.relationship.toLowerCase().includes(q)).map((f) => ({
      id: f.id,
      title: `${f.name} (${f.relationship})`,
      type: "Family & Contact",
      icon: User,
      module: "manual",
    })),
    ...txs.filter((t) => t.title.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)).map((t) => ({
      id: t.id,
      title: `${t.title} ($${t.amount})`,
      type: `Transaction (${t.category})`,
      icon: DollarSign,
      module: "finance",
    })),
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-3 sm:px-4 bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-2xl max-h-[85vh] rounded-[32px] bg-white border border-[#EBE9E1] shadow-xl overflow-hidden flex flex-col text-[#2D2D2A]">
        {/* Search Header */}
        <div className="flex items-center gap-3 p-4 sm:p-5 border-b border-[#EBE9E1]">
          <Search className="w-5 h-5 text-[#5A6A5A]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documents, goals, notes, finances, certificates, family..."
            className="flex-1 bg-transparent text-sm text-[#2D2D2A] placeholder-[#6B6A65] focus:outline-none"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-[#6B6A65] hover:text-[#2D2D2A]">
              <X className="w-4 h-4" />
            </button>
          )}
          <button onClick={onClose} className="px-3 py-1 text-xs rounded-xl bg-[#F1EFEC] text-[#6B6A65] hover:text-[#2D2D2A] border border-[#EBE9E1]">
            Esc
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto p-3">
          {query.trim() === "" ? (
            <div className="p-8 text-center text-xs text-[#6B6A65]">
              Type keywords to search across your Linual Personal Life Operating System.
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#6B6A65]">No matching records found for "{query}".</div>
          ) : (
            <div className="space-y-1">
              {results.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={`${item.id}-${idx}`}
                    onClick={() => {
                      onNavigateModule(item.module);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-[#F1EFEC] text-left transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-[#5A6A5A]/10 text-[#5A6A5A] flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-bold text-[#2D2D2A] group-hover:text-[#5A6A5A] truncate">{item.title}</div>
                        <div className="text-[11px] text-[#6B6A65]">{item.type}</div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-[#5A6A5A] opacity-0 group-hover:opacity-100 transition-opacity">Open →</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
