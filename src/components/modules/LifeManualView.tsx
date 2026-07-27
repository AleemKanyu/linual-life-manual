import React, { useState } from "react";
import {
  User,
  Shield,
  FileText,
  Award,
  Users,
  Calendar,
  Lock,
  Eye,
  EyeOff,
  Plus,
  Trash2,
} from "lucide-react";
import { StorageEngine } from "../../lib/storage";
import { UserProfile, IdentityDocument, Certificate, FamilyMember, TimelineEvent } from "../../types";

export const LifeManualView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<"profile" | "documents" | "certificates" | "family" | "timeline">("profile");

  const [profile, setProfile] = useState<UserProfile>(StorageEngine.getAppState().userProfile);
  const [docs, setDocs] = useState<IdentityDocument[]>(StorageEngine.getDocuments());
  const [certs, setCerts] = useState<Certificate[]>(StorageEngine.getCertificates());
  const [family, setFamily] = useState<FamilyMember[]>(StorageEngine.getFamily());
  const [timeline, setTimeline] = useState<TimelineEvent[]>(StorageEngine.getTimeline());

  // Show/Hide decrypted numbers state
  const [decryptedMap, setDecryptedMap] = useState<Record<string, boolean>>({});

  // New item modal states
  const [showDocModal, setShowDocModal] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState("");
  const [newDocType] = useState<IdentityDocument["type"]>("Passport");
  const [newDocNumber, setNewDocNumber] = useState("");
  const [newDocExpiry] = useState("2030-12-31");

  const [showCertModal, setShowCertModal] = useState(false);
  const [newCertTitle, setNewCertTitle] = useState("");
  const [newCertIssuer, setNewCertIssuer] = useState("");
  const [newCertCategory] = useState<Certificate["category"]>("Academic");

  const [showFamilyModal, setShowFamilyModal] = useState(false);
  const [newFamName, setNewFamName] = useState("");
  const [newFamRel, setNewFamRel] = useState("Parent");
  const [newFamContact, setNewFamContact] = useState("");

  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const [newTmTitle, setNewTmTitle] = useState("");
  const [newTmYear, setNewTmYear] = useState(new Date().getFullYear().toString());
  const [newTmCategory, setNewTmCategory] = useState("Milestone");
  const [newTmDesc, setNewTmDesc] = useState("");

  // Save profile changes
  const handleSaveProfile = () => {
    const appState = StorageEngine.getAppState();
    appState.userProfile = profile;
    StorageEngine.setAppState(appState);
    alert("Profile saved successfully to your secure Life Vault!");
  };

  const toggleDecrypt = (id: string) => {
    setDecryptedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDeleteDoc = (id: string) => {
    if (!confirm("Delete this identity document? This cannot be undone.")) return;
    setDocs(StorageEngine.deleteDocument(id));
  };

  const handleDeleteCert = (id: string) => {
    if (!confirm("Delete this certificate? This cannot be undone.")) return;
    setCerts(StorageEngine.deleteCertificate(id));
  };

  const handleDeleteFamily = (id: string) => {
    if (!confirm("Remove this family member? This cannot be undone.")) return;
    setFamily(StorageEngine.deleteFamily(id));
  };

  const handleDeleteTimeline = (id: string) => {
    if (!confirm("Delete this timeline milestone? This cannot be undone.")) return;
    setTimeline(StorageEngine.deleteTimeline(id));
  };

  const handleAddFamily = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFamName) return;
    const newMember: FamilyMember = {
      id: "fam_" + Date.now(),
      name: newFamName,
      relationship: newFamRel,
      birthday: "1990-01-01",
      contact: newFamContact || "+1 555-0000",
    };
    const updated = [newMember, ...family];
    setFamily(updated);
    StorageEngine.setFamily(updated);
    setShowFamilyModal(false);
    setNewFamName("");
    setNewFamContact("");
  };

  const handleAddTimeline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTmTitle) return;
    const newEvent: TimelineEvent = {
      id: "tm_" + Date.now(),
      title: newTmTitle,
      year: newTmYear,
      date: new Date().toISOString().split("T")[0],
      category: newTmCategory,
      description: newTmDesc || "Personal milestone.",
    };
    const updated = [newEvent, ...timeline];
    setTimeline(updated);
    StorageEngine.setTimeline(updated);
    setShowTimelineModal(false);
    setNewTmTitle("");
    setNewTmDesc("");
  };

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle || !newDocNumber) return;
    const newDoc: IdentityDocument = {
      id: "doc_" + Date.now(),
      title: newDocTitle,
      type: newDocType,
      documentNumber: newDocNumber,
      issueDate: new Date().toISOString().split("T")[0],
      expiryDate: newDocExpiry,
      isEncrypted: true,
    };
    const updated = [newDoc, ...docs];
    setDocs(updated);
    StorageEngine.setDocuments(updated);
    setShowDocModal(false);
    setNewDocTitle("");
    setNewDocNumber("");
  };

  const handleAddCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCertTitle || !newCertIssuer) return;
    const newCert: Certificate = {
      id: "cert_" + Date.now(),
      title: newCertTitle,
      issuer: newCertIssuer,
      category: newCertCategory,
      issueDate: new Date().toISOString().split("T")[0],
    };
    const updated = [newCert, ...certs];
    setCerts(updated);
    StorageEngine.setCertificates(updated);
    setShowCertModal(false);
    setNewCertTitle("");
    setNewCertIssuer("");
  };

  return (
    <div className="space-y-6 pb-12 text-[#2D2D2A] max-w-full overflow-x-hidden">
      {/* Module Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-[32px] border border-[#EBE9E1] shadow-xs max-w-full overflow-hidden">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-serif italic text-[#2D2D2A] flex items-center gap-2 truncate">
            <Shield className="w-6 h-6 text-[#5A6A5A] shrink-0" />
            <span className="truncate">Life Manual — Digital Identity Vault</span>
          </h2>
          <p className="text-xs text-[#6B6A65] mt-1">
            Centralized secure storage for personal identification, certificates, family records, and chronological life timeline.
          </p>
        </div>

        {/* Subtab Navigation */}
        <div className="flex items-center gap-1 bg-[#F1EFEC] p-1.5 rounded-2xl border border-[#EBE9E1] text-xs font-semibold overflow-x-auto no-scrollbar max-w-full shrink-0">
          {[
            { key: "profile", label: "Profile", icon: User },
            { key: "documents", label: "Identity Docs", icon: FileText },
            { key: "certificates", label: "Certificates", icon: Award },
            { key: "family", label: "Family Tree", icon: Users },
            { key: "timeline", label: "Timeline", icon: Calendar },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeSubTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveSubTab(tab.key as any)}
                className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-medium transition-all shrink-0 whitespace-nowrap ${
                  active ? "bg-[#5A6A5A] text-white shadow-xs" : "text-[#6B6A65] hover:text-[#2D2D2A]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. PERSONAL PROFILE SUBTAB */}
      {activeSubTab === "profile" && (
        <div className="rounded-[32px] bg-white border border-[#EBE9E1] p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#EBE9E1] pb-4">
            <h3 className="text-base font-serif italic font-bold text-[#2D2D2A]">Personal Identity Details</h3>
            <button
              onClick={handleSaveProfile}
              className="px-5 py-2.5 rounded-2xl bg-[#5A6A5A] hover:bg-[#4f5f4f] text-white text-xs font-semibold transition-all shadow-xs"
            >
              Save Profile Changes
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Photo & Nickname Column */}
            <div className="flex flex-col items-center text-center p-6 rounded-3xl bg-[#F1EFEC] border border-[#EBE9E1] space-y-3">
              <img
                src={profile.photoUrl}
                alt={profile.fullName}
                className="w-24 h-24 rounded-3xl object-cover border-2 border-[#5A6A5A] shadow-md"
              />
              <div>
                <div className="font-bold text-base text-[#2D2D2A]">{profile.fullName}</div>
                <div className="text-xs text-[#B07D62] font-semibold">"{profile.nickname}"</div>
              </div>
              <div className="text-[11px] text-[#6B6A65] bg-white px-3 py-1 rounded-full border border-[#EBE9E1]">
                {profile.degreeMajor}
              </div>
            </div>

            {/* Editable Fields Column 1 */}
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[#6B6A65] font-semibold mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value, nickname: e.target.value })}
                  className="w-full bg-[#F1EFEC] border border-[#EBE9E1] rounded-2xl px-3 py-2 text-[#2D2D2A]"
                />
              </div>
              <div>
                <label className="block text-[#6B6A65] font-semibold mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={profile.dob}
                  onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                  className="w-full bg-[#F1EFEC] border border-[#EBE9E1] rounded-2xl px-3 py-2 text-[#2D2D2A]"
                />
              </div>
              <div>
                <label className="block text-[#6B6A65] font-semibold mb-1">Blood Group</label>
                <input
                  type="text"
                  value={profile.bloodGroup}
                  onChange={(e) => setProfile({ ...profile, bloodGroup: e.target.value })}
                  className="w-full bg-[#F1EFEC] border border-[#EBE9E1] rounded-2xl px-3 py-2 text-[#2D2D2A]"
                />
              </div>
              <div>
                <label className="block text-[#6B6A65] font-semibold mb-1">Height (cm) & Weight (kg)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={profile.heightCm}
                    onChange={(e) => setProfile({ ...profile, heightCm: Number(e.target.value) })}
                    className="bg-[#F1EFEC] border border-[#EBE9E1] rounded-2xl px-3 py-2 text-[#2D2D2A]"
                  />
                  <input
                    type="number"
                    value={profile.weightKg}
                    onChange={(e) => setProfile({ ...profile, weightKg: Number(e.target.value) })}
                    className="bg-[#F1EFEC] border border-[#EBE9E1] rounded-2xl px-3 py-2 text-[#2D2D2A]"
                  />
                </div>
              </div>
            </div>

            {/* Editable Fields Column 2 */}
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[#6B6A65] font-semibold mb-1">College / University</label>
                <input
                  type="text"
                  value={profile.collegeName}
                  onChange={(e) => setProfile({ ...profile, collegeName: e.target.value })}
                  className="w-full bg-[#F1EFEC] border border-[#EBE9E1] rounded-2xl px-3 py-2 text-[#2D2D2A]"
                />
              </div>
              <div>
                <label className="block text-[#6B6A65] font-semibold mb-1">Student ID Number</label>
                <input
                  type="text"
                  value={profile.studentIdNumber}
                  onChange={(e) => setProfile({ ...profile, studentIdNumber: e.target.value })}
                  className="w-full bg-[#F1EFEC] border border-[#EBE9E1] rounded-2xl px-3 py-2 text-[#2D2D2A]"
                />
              </div>
              <div>
                <label className="block text-[#6B6A65] font-semibold mb-1">Emergency Contact</label>
                <input
                  type="text"
                  value={`${profile.emergencyContacts[0]?.name || ""} (${profile.emergencyContacts[0]?.phone || ""})`}
                  onChange={(e) => {
                    const updated = [...profile.emergencyContacts];
                    if (updated[0]) updated[0].name = e.target.value;
                    setProfile({ ...profile, emergencyContacts: updated });
                  }}
                  className="w-full bg-[#F1EFEC] border border-[#EBE9E1] rounded-2xl px-3 py-2 text-[#2D2D2A]"
                />
              </div>
              <div>
                <label className="block text-[#6B6A65] font-semibold mb-1">Address</label>
                <input
                  type="text"
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  className="w-full bg-[#F1EFEC] border border-[#EBE9E1] rounded-2xl px-3 py-2 text-[#2D2D2A]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. IDENTITY DOCUMENTS SUBTAB */}
      {activeSubTab === "documents" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-serif italic font-bold text-[#2D2D2A]">Encrypted Identity Vault</h3>
            <button
              onClick={() => setShowDocModal(true)}
              className="px-4 py-2 rounded-2xl bg-[#5A6A5A] hover:bg-[#4f5f4f] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Document</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {docs.map((doc) => {
              const isDecrypted = decryptedMap[doc.id];
              return (
                <div key={doc.id} className="p-6 rounded-[28px] bg-white border border-[#EBE9E1] space-y-3 relative shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-[#5A6A5A]/10 text-[#5A6A5A] flex items-center justify-center">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#2D2D2A]">{doc.title}</div>
                        <div className="text-[10px] text-[#6B6A65]">{doc.type}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleDecrypt(doc.id)}
                        className="p-1.5 rounded-lg bg-[#F1EFEC] hover:bg-[#EBE9E1] text-[#6B6A65]"
                        title={isDecrypted ? "Mask Number" : "Decrypt View"}
                      >
                        {isDecrypted ? <EyeOff className="w-3.5 h-3.5 text-[#B07D62]" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => handleDeleteDoc(doc.id)}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600"
                        title="Delete Document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#F1EFEC] border border-[#EBE9E1] text-xs flex items-center justify-between min-w-0">
                    <span className="text-[#6B6A65]">Doc No:</span>
                    <span className="text-[#2D2D2A] font-bold truncate max-w-[180px]">
                      {isDecrypted ? doc.documentNumber : doc.documentNumber.replace(/.(?=.{4})/g, "•")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#6B6A65]">
                    <span>Expiry: {doc.expiryDate}</span>
                    <span className="text-[#5A6A5A] font-semibold flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      Encrypted
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. CERTIFICATES SUBTAB */}
      {activeSubTab === "certificates" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-serif italic font-bold text-[#2D2D2A]">Academic & Professional Certificates</h3>
            <button
              onClick={() => setShowCertModal(true)}
              className="px-4 py-2 rounded-2xl bg-[#5A6A5A] hover:bg-[#4f5f4f] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Certificate</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certs.map((c) => (
              <div key={c.id} className="p-6 rounded-[28px] bg-white border border-[#EBE9E1] flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-[#B07D62]/10 text-[#B07D62] flex items-center justify-center shrink-0 border border-[#B07D62]/20">
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#2D2D2A] truncate">{c.title}</div>
                    <div className="text-[11px] text-[#6B6A65] truncate">{c.issuer}</div>
                    <div className="text-[10px] text-[#6B6A65] mt-0.5">Issued: {c.issueDate}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#F1EFEC] text-[#5A6A5A] font-semibold border border-[#EBE9E1]">
                    {c.category}
                  </span>
                  <button
                    onClick={() => handleDeleteCert(c.id)}
                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600"
                    title="Delete Certificate"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. FAMILY TREE SUBTAB */}
      {activeSubTab === "family" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-serif italic font-bold text-[#2D2D2A]">Family & Relatives Directory</h3>
            <button
              onClick={() => setShowFamilyModal(true)}
              className="px-4 py-2 rounded-2xl bg-[#5A6A5A] hover:bg-[#4f5f4f] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Member</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {family.map((f) => (
              <div key={f.id} className="p-6 rounded-[28px] bg-white border border-[#EBE9E1] space-y-2 shadow-xs relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#2D2D2A]">{f.name}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#B07D62]/10 text-[#B07D62] font-semibold border border-[#B07D62]/20 uppercase tracking-wider">
                      {f.relationship}
                    </span>
                    <button
                      onClick={() => handleDeleteFamily(f.id)}
                      className="p-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600"
                      title="Delete Relative"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="text-xs text-[#6B6A65]">Birthday: {f.birthday}</div>
                <div className="text-xs text-[#6B6A65]">Phone: {f.contact}</div>
                {f.notes && <div className="text-[11px] text-[#6B6A65] italic mt-2 border-t border-[#EBE9E1] pt-2">{f.notes}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. TIMELINE SUBTAB */}
      {activeSubTab === "timeline" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-serif italic font-bold text-[#2D2D2A]">Chronological Life Milestones</h3>
            <button
              onClick={() => setShowTimelineModal(true)}
              className="px-4 py-2 rounded-2xl bg-[#5A6A5A] hover:bg-[#4f5f4f] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Event</span>
            </button>
          </div>
          <div className="relative border-l-2 border-[#5A6A5A]/30 ml-4 pl-6 space-y-6">
            {timeline.map((tm) => (
              <div key={tm.id} className="relative group">
                <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-[#5A6A5A] border-2 border-white shadow-xs" />
                <div className="p-6 rounded-[28px] bg-white border border-[#EBE9E1] space-y-1 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#5A6A5A]">{tm.year} — {tm.date}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F1EFEC] text-[#6B6A65]">{tm.category}</span>
                      <button
                        onClick={() => handleDeleteTimeline(tm.id)}
                        className="p-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600"
                        title="Delete Milestone"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="text-base font-serif italic font-bold text-[#2D2D2A]">{tm.title}</div>
                  <div className="text-xs text-[#6B6A65] leading-relaxed">{tm.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Doc Modal */}
      {showDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-[32px] bg-white border border-[#EBE9E1] space-y-4 shadow-xl">
            <h3 className="text-xl font-serif italic font-bold text-[#2D2D2A]">Add New Identity Document</h3>
            <form onSubmit={handleAddDocument} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#6B6A65] font-semibold mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Driver's License"
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  className="w-full bg-[#F1EFEC] border border-[#EBE9E1] rounded-2xl px-3 py-2 text-[#2D2D2A]"
                />
              </div>
              <div>
                <label className="block text-[#6B6A65] font-semibold mb-1">Document Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DL-99201940"
                  value={newDocNumber}
                  onChange={(e) => setNewDocNumber(e.target.value)}
                  className="w-full bg-[#F1EFEC] border border-[#EBE9E1] rounded-2xl px-3 py-2 text-[#2D2D2A]"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDocModal(false)}
                  className="w-1/2 py-2.5 rounded-2xl bg-[#F1EFEC] text-[#2D2D2A] hover:bg-[#EBE9E1] font-semibold border border-[#EBE9E1]"
                >
                  Cancel
                </button>
                <button type="submit" className="w-1/2 py-2.5 rounded-2xl bg-[#5A6A5A] hover:bg-[#4f5f4f] text-white font-semibold shadow-xs">
                  Save Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Cert Modal */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-[32px] bg-white border border-[#EBE9E1] space-y-4 shadow-xl">
            <h3 className="text-xl font-serif italic font-bold text-[#2D2D2A]">Add Certificate Record</h3>
            <form onSubmit={handleAddCertificate} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#6B6A65] font-semibold mb-1">Certificate Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AWS Certified Architect"
                  value={newCertTitle}
                  onChange={(e) => setNewCertTitle(e.target.value)}
                  className="w-full bg-[#F1EFEC] border border-[#EBE9E1] rounded-2xl px-3 py-2 text-[#2D2D2A]"
                />
              </div>
              <div>
                <label className="block text-[#6B6A65] font-semibold mb-1">Issuing Organization</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amazon Web Services"
                  value={newCertIssuer}
                  onChange={(e) => setNewCertIssuer(e.target.value)}
                  className="w-full bg-[#F1EFEC] border border-[#EBE9E1] rounded-2xl px-3 py-2 text-[#2D2D2A]"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCertModal(false)}
                  className="w-1/2 py-2.5 rounded-2xl bg-[#F1EFEC] text-[#2D2D2A] hover:bg-[#EBE9E1] font-semibold border border-[#EBE9E1]"
                >
                  Cancel
                </button>
                <button type="submit" className="w-1/2 py-2.5 rounded-2xl bg-[#5A6A5A] hover:bg-[#4f5f4f] text-white font-semibold shadow-xs">
                  Save Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
