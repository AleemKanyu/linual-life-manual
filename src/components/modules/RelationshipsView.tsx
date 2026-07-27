import React, { useState } from "react";
import { Users, Calendar, Gift, Image, Phone, Plus, Trash2, Heart } from "lucide-react";
import { StorageEngine } from "../../lib/storage";
import { Contact, Memory } from "../../types";
import { showToast } from "../Toast";

export const RelationshipsView: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>(() => StorageEngine.getContacts());
  const [memories, setMemories] = useState<Memory[]>(() => StorageEngine.getMemories());

  // Add Contact State
  const [showAddContact, setShowAddContact] = useState(false);
  const [cName, setCName] = useState("");
  const [cRel, setCRel] = useState("Friend");
  const [cBirthday, setCBirthday] = useState("1998-05-15");
  const [cPhone, setCPhone] = useState("");
  const [cGifts, setCGifts] = useState("");

  // Add Memory State
  const [showAddMemory, setShowAddMemory] = useState(false);
  const [mTitle, setMTitle] = useState("");
  const [mDate, setMDate] = useState(new Date().toISOString().split("T")[0]);
  const [mLoc, setMLoc] = useState("");
  const [mDesc, setMDesc] = useState("");

  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cName) return;
    const newContact: Contact = {
      id: "cnt_" + Date.now(),
      name: cName,
      relationship: cRel,
      birthday: cBirthday,
      phone: cPhone || "+1 555-0199",
      giftIdeas: cGifts ? cGifts.split(",").map((g) => g.trim()) : [],
    };
    const updated = [newContact, ...contacts];
    setContacts(updated);
    StorageEngine.setContacts(updated);
    setShowAddContact(false);
    setCName("");
    setCPhone("");
    setCGifts("");
    showToast("✨ Relationship contact saved!");
  };

  const handleDeleteContact = (id: string) => {
    if (!confirm("Remove this contact from your inner circle?")) return;
    const updated = contacts.filter((c) => c.id !== id);
    setContacts(updated);
    StorageEngine.setContacts(updated);
    showToast("Contact deleted");
  };

  const handleCreateMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mTitle) return;
    const newMemory: Memory = {
      id: "mem_" + Date.now(),
      title: mTitle,
      date: mDate,
      location: mLoc || "Home",
      description: mDesc || "Cherished life memory.",
      photoUrl: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=500&auto=format&fit=crop",
    };
    const updated = [newMemory, ...memories];
    setMemories(updated);
    StorageEngine.setMemories(updated);
    setShowAddMemory(false);
    setMTitle("");
    setMDesc("");
    setMLoc("");
    showToast("📸 Life memory saved to gallery!");
  };

  const handleDeleteMemory = (id: string) => {
    if (!confirm("Delete this memory from gallery?")) return;
    const updated = memories.filter((m) => m.id !== id);
    setMemories(updated);
    StorageEngine.setMemories(updated);
    showToast("Memory deleted");
  };

  return (
    <div className="space-y-6 pb-12 text-[#2D2D2A]">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 bg-white p-5 sm:p-7 rounded-[32px] border border-[#EBE9E1] shadow-xs">
        <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 min-w-0 flex-1">
          <div className="w-14 h-14 sm:w-20 sm:h-20 shrink-0 rounded-2xl bg-[#F1EFEC] border border-[#EBE9E1] p-2 flex items-center justify-center overflow-hidden shadow-xs text-[#B07D62]">
            <Heart className="w-8 h-8 fill-[#B07D62]/20" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg sm:text-2xl font-serif italic text-[#2D2D2A] leading-tight">
              Relationships, Birthdays & Memories Vault
            </h2>
            <p className="text-xs text-[#6B6A65] mt-1 leading-normal">
              Maintain meaningful relationships, upcoming birthday reminders, gift ideas, and shared photo memories.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <button
            onClick={() => setShowAddContact(true)}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl bg-[#5A6A5A] hover:bg-[#4f5f4f] text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Contact</span>
          </button>
          <button
            onClick={() => setShowAddMemory(true)}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl bg-[#B07D62] hover:bg-[#9d6d54] text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <Image className="w-4 h-4" />
            <span>Add Memory</span>
          </button>
        </div>
      </div>

      {/* Contacts & Birthdays */}
      <div className="space-y-4">
        <h3 className="text-base font-serif italic font-bold text-[#2D2D2A] flex items-center gap-2">
          <Gift className="w-4 h-4 text-[#B07D62]" />
          <span>Inner Circle & Birthday Reminders ({contacts.length})</span>
        </h3>

        {contacts.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-[28px] border border-[#EBE9E1] text-xs text-[#6B6A65]">
            No contacts recorded yet. Click "Add Contact" to build your inner circle vault.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {contacts.map((c) => (
              <div key={c.id} className="p-6 rounded-[28px] bg-white border border-[#EBE9E1] space-y-3 shadow-xs relative">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-serif italic font-bold text-[#2D2D2A]">{c.name}</h4>
                    <p className="text-[11px] text-[#6B6A65]">{c.relationship}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#B07D62]/10 text-[#B07D62] font-semibold border border-[#B07D62]/20 uppercase tracking-wider">
                      {c.relationship}
                    </span>
                    <button
                      onClick={() => handleDeleteContact(c.id)}
                      className="p-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                      title="Delete Contact"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-[#6B6A65] border-t border-[#EBE9E1] pt-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#B07D62]" />
                    <span>Birthday: {c.birthday}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#6B6A65]" />
                    <span>{c.phone}</span>
                  </div>
                  {c.giftIdeas && c.giftIdeas.length > 0 && (
                    <div className="text-[11px] text-[#2D2D2A] mt-1">
                      <span className="text-[#6B6A65] font-semibold">Gift Ideas: </span>
                      {c.giftIdeas.join(", ")}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Memory Gallery */}
      <div className="space-y-4 pt-4 border-t border-[#EBE9E1]">
        <h3 className="text-base font-serif italic font-bold text-[#2D2D2A] flex items-center gap-2">
          <Image className="w-4 h-4 text-[#5A6A5A]" />
          <span>Cherished Life Memories Gallery ({memories.length})</span>
        </h3>

        {memories.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-[28px] border border-[#EBE9E1] text-xs text-[#6B6A65]">
            No life memories stored yet. Click "Add Memory" to preserve cherished moments.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {memories.map((m) => (
              <div key={m.id} className="p-6 rounded-[28px] bg-white border border-[#EBE9E1] space-y-3 flex gap-4 items-center shadow-xs relative">
                <img
                  src={m.photoUrl}
                  alt={m.title}
                  className="w-24 h-24 rounded-2xl object-cover border border-[#EBE9E1] shrink-0"
                />
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#5A6A5A] font-bold">{m.date} • {m.location}</span>
                    <button
                      onClick={() => handleDeleteMemory(m.id)}
                      className="p-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                      title="Delete Memory"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h4 className="text-base font-serif italic font-bold text-[#2D2D2A] truncate">{m.title}</h4>
                  <p className="text-xs text-[#6B6A65] leading-relaxed line-clamp-2">{m.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Contact Modal */}
      {showAddContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-[32px] bg-white border border-[#EBE9E1] space-y-4 shadow-xl">
            <h3 className="text-xl font-serif italic font-bold text-[#2D2D2A]">Add Relationship Contact</h3>
            <form onSubmit={handleCreateContact} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#6B6A65] font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tariq Ahmad"
                  value={cName}
                  onChange={(e) => setCName(e.target.value)}
                  className="w-full bg-[#F1EFEC] border border-[#EBE9E1] rounded-2xl px-3 py-2 text-[#2D2D2A]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#6B6A65] font-semibold mb-1">Relationship</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Brother, Mentor"
                    value={cRel}
                    onChange={(e) => setCRel(e.target.value)}
                    className="w-full bg-[#F1EFEC] border border-[#EBE9E1] rounded-2xl px-3 py-2 text-[#2D2D2A]"
                  />
                </div>
                <div>
                  <label className="block text-[#6B6A65] font-semibold mb-1">Birthday</label>
                  <input
                    type="date"
                    value={cBirthday}
                    onChange={(e) => setCBirthday(e.target.value)}
                    className="w-full bg-[#F1EFEC] border border-[#EBE9E1] rounded-2xl px-3 py-2 text-[#2D2D2A]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[#6B6A65] font-semibold mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="+1 555-0199"
                  value={cPhone}
                  onChange={(e) => setCPhone(e.target.value)}
                  className="w-full bg-[#F1EFEC] border border-[#EBE9E1] rounded-2xl px-3 py-2 text-[#2D2D2A]"
                />
              </div>
              <div>
                <label className="block text-[#6B6A65] font-semibold mb-1">Gift Ideas (comma separated)</label>
                <input
                  type="text"
                  placeholder="Fountain Pen, Book, Watch"
                  value={cGifts}
                  onChange={(e) => setCGifts(e.target.value)}
                  className="w-full bg-[#F1EFEC] border border-[#EBE9E1] rounded-2xl px-3 py-2 text-[#2D2D2A]"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddContact(false)}
                  className="w-1/2 py-2.5 rounded-2xl bg-[#F1EFEC] text-[#2D2D2A] hover:bg-[#EBE9E1] font-semibold border border-[#EBE9E1] cursor-pointer"
                >
                  Cancel
                </button>
                <button type="submit" className="w-1/2 py-2.5 rounded-2xl bg-[#5A6A5A] hover:bg-[#4f5f4f] text-white font-semibold shadow-xs cursor-pointer">
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Memory Modal */}
      {showAddMemory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-[32px] bg-white border border-[#EBE9E1] space-y-4 shadow-xl">
            <h3 className="text-xl font-serif italic font-bold text-[#2D2D2A]">Add Life Memory</h3>
            <form onSubmit={handleCreateMemory} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#6B6A65] font-semibold mb-1">Memory Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Graduation Ceremony 2026"
                  value={mTitle}
                  onChange={(e) => setMTitle(e.target.value)}
                  className="w-full bg-[#F1EFEC] border border-[#EBE9E1] rounded-2xl px-3 py-2 text-[#2D2D2A]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#6B6A65] font-semibold mb-1">Date</label>
                  <input
                    type="date"
                    value={mDate}
                    onChange={(e) => setMDate(e.target.value)}
                    className="w-full bg-[#F1EFEC] border border-[#EBE9E1] rounded-2xl px-3 py-2 text-[#2D2D2A]"
                  />
                </div>
                <div>
                  <label className="block text-[#6B6A65] font-semibold mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Campus Grounds"
                    value={mLoc}
                    onChange={(e) => setMLoc(e.target.value)}
                    className="w-full bg-[#F1EFEC] border border-[#EBE9E1] rounded-2xl px-3 py-2 text-[#2D2D2A]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[#6B6A65] font-semibold mb-1">Memory Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe this special day..."
                  value={mDesc}
                  onChange={(e) => setMDesc(e.target.value)}
                  className="w-full bg-[#F1EFEC] border border-[#EBE9E1] rounded-2xl px-3 py-2 text-[#2D2D2A]"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddMemory(false)}
                  className="w-1/2 py-2.5 rounded-2xl bg-[#F1EFEC] text-[#2D2D2A] hover:bg-[#EBE9E1] font-semibold border border-[#EBE9E1] cursor-pointer"
                >
                  Cancel
                </button>
                <button type="submit" className="w-1/2 py-2.5 rounded-2xl bg-[#B07D62] hover:bg-[#9d6d54] text-white font-semibold shadow-xs cursor-pointer">
                  Save Memory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
