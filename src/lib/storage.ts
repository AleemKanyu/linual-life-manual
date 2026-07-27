import {
  AppState,
  UserProfile,
  Goal,
  SalahLog,
  Habit,
  HabitLog,
  JournalEntry,
  Transaction,
  BudgetLimit,
  HealthMetrics,
  MealLog,
  WorkoutLog,
  Course,
  Assignment,
  Book,
  Skill,
  Task,
  Note,
  IdentityDocument,
  Certificate,
  FamilyMember,
  TimelineEvent,
  Contact,
  Memory,
  Badge,
} from "../types";
import { encryptAES, decryptAES, legacyXorDecrypt, hashPin as cryptoHashPin } from "./crypto";

const STORAGE_KEYS = {
  APP_STATE: "linual_app_state_v1",
  GOALS: "linual_goals_v1",
  SALAH: "linual_salah_v1",
  HABITS: "linual_habits_v1",
  HABIT_LOGS: "linual_habit_logs_v1",
  JOURNAL: "linual_journal_v1",
  FINANCE: "linual_finance_v1",
  BUDGETS: "linual_budgets_v1",
  HEALTH: "linual_health_v1",
  MEALS: "linual_meals_v1",
  WORKOUTS: "linual_workouts_v1",
  COURSES: "linual_courses_v1",
  ASSIGNMENTS: "linual_assignments_v1",
  BOOKS: "linual_books_v1",
  SKILLS: "linual_skills_v1",
  TASKS: "linual_tasks_v1",
  NOTES: "linual_notes_v1",
  DOCUMENTS: "linual_documents_v1",
  CERTIFICATES: "linual_certificates_v1",
  FAMILY: "linual_family_v1",
  TIMELINE: "linual_timeline_v1",
  CONTACTS: "linual_contacts_v1",
  MEMORIES: "linual_memories_v1",
};

const defaultUserProfile: UserProfile = {
  fullName: "User",
  nickname: "User",
  photoUrl: "",
  dob: "",
  bloodGroup: "",
  heightCm: 0,
  weightKg: 0,
  address: "",
  phone: "",
  email: "",
  languages: ["English"],
  collegeName: "University",
  degreeMajor: "General Focus",
  currentSemester: "Year 1",
  studentIdNumber: "",
  emergencyContacts: [],
};

const defaultBadges: Badge[] = [
  { id: "b1", title: "Early Fajr Sentinel", description: "Prayed Fajr on time for 7 consecutive days", icon: "moon", xpReward: 100, unlocked: false },
  { id: "b2", title: "Atomic Habit Master", description: "Maintained a 14-day habit streak", icon: "flame", xpReward: 150, unlocked: false },
  { id: "b3", title: "LifeOS Explorer", description: "Completed initial onboarding setup", icon: "compass", xpReward: 50, unlocked: true },
];

const defaultAppState: AppState = {
  onboardingCompleted: false,
  isOnboarded: false,
  userProfile: defaultUserProfile,
  security: {
    pinEnabled: true,
    pinCode: "1234",
    biometricEnabled: true,
    autoLockMinutes: 5,
    isLocked: false,
  },
  vaultPin: "1234",
  pinEnabled: true,
  userXp: 0,
  badges: defaultBadges,
  xp: 0,
  level: 1,
  activeModules: {
    dashboard: true,
    manual: true,
    goals: true,
    salah: true,
    habits: true,
    journal: true,
    finance: true,
    health: true,
    learning: true,
    tasks: true,
    relationships: true,
    assistant: true,
    rewards: true,
  },
  theme: "dark",
  offlineSyncPendingCount: 0,
  lastSyncedAt: new Date().toISOString(),
};

const defaultGoals: Goal[] = [];

export const getTodayDateStr = (): string => new Date().toISOString().split("T")[0];

const defaultSalah: SalahLog = {
  date: getTodayDateStr(),
  fajr: "pending",
  dhuhr: "pending",
  asr: "pending",
  maghrib: "pending",
  isha: "pending",
  witr: "pending",
  tahajjud: false,
  tahajjudXpClaimed: false,
  quranPagesRead: 0,
  dhikrCount: 0,
  fasting: false,
  fastingXpClaimed: false,
  notes: "",
};

const defaultHabits: Habit[] = [];
const defaultHabitLogs: HabitLog[] = [];
const defaultJournal: JournalEntry[] = [];
const defaultFinance: Transaction[] = [];

const defaultBudgets: BudgetLimit[] = [
  { category: "Food", limit: 300 },
  { category: "Transport", limit: 100 },
  { category: "Entertainment", limit: 50 },
  { category: "Education", limit: 100 },
  { category: "Shopping", limit: 100 },
];

const defaultHealth: HealthMetrics = {
  date: getTodayDateStr(),
  weightKg: 0,
  sleepHours: 0,
  waterMl: 0,
  steps: 0,
  caloriesBurned: 0,
};

const defaultMeals: MealLog[] = [];
const defaultWorkouts: WorkoutLog[] = [];
const defaultCourses: Course[] = [];
const defaultAssignments: Assignment[] = [];
const defaultBooks: Book[] = [];
const defaultSkills: Skill[] = [];
const defaultTasks: Task[] = [];
const defaultNotes: Note[] = [];
const defaultDocuments: IdentityDocument[] = [];
const defaultCertificates: Certificate[] = [];
const defaultFamily: FamilyMember[] = [];
const defaultTimeline: TimelineEvent[] = [];
const defaultContacts: Contact[] = [];
const defaultMemories: Memory[] = [];

export class StorageEngine {
  private static getItem<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.warn(`Error reading key ${key} from storage`, e);
      return fallback;
    }
  }

  private static setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`Error saving key ${key} to storage`, e);
    }
  }

  static getAppState(): AppState {
    const raw = this.getItem<AppState>(STORAGE_KEYS.APP_STATE, defaultAppState);
    return {
      ...defaultAppState,
      ...raw,
      userProfile: {
        ...defaultUserProfile,
        ...(raw?.userProfile || {}),
      },
      security: {
        ...defaultAppState.security,
        ...(raw?.security || {}),
      },
      activeModules: {
        ...defaultAppState.activeModules,
        ...(raw?.activeModules || {}),
      },
    };
  }
  static setAppState(state: AppState): void {
    this.setItem(STORAGE_KEYS.APP_STATE, state);
  }

  static addXp(delta: number): number {
    const state = this.getAppState();
    const newXp = (state.userXp || 0) + delta;
    const updatedState = { ...state, userXp: newXp, xp: newXp };
    this.setAppState(updatedState);
    return newXp;
  }

  static getGoals(): Goal[] { return this.getItem(STORAGE_KEYS.GOALS, defaultGoals); }
  static setGoals(goals: Goal[]): void { this.setItem(STORAGE_KEYS.GOALS, goals); }

  static getSalahLog(): SalahLog { return this.getItem(STORAGE_KEYS.SALAH, defaultSalah); }
  static setSalahLog(log: SalahLog): void { this.setItem(STORAGE_KEYS.SALAH, log); }

  static getHabits(): Habit[] { return this.getItem(STORAGE_KEYS.HABITS, defaultHabits); }
  static setHabits(habits: Habit[]): void { this.setItem(STORAGE_KEYS.HABITS, habits); }

  static getHabitLogs(): HabitLog[] { return this.getItem(STORAGE_KEYS.HABIT_LOGS, defaultHabitLogs); }
  static setHabitLogs(logs: HabitLog[]): void { this.setItem(STORAGE_KEYS.HABIT_LOGS, logs); }

  static getJournal(): JournalEntry[] { return this.getItem(STORAGE_KEYS.JOURNAL, defaultJournal); }
  static setJournal(entries: JournalEntry[]): void { this.setItem(STORAGE_KEYS.JOURNAL, entries); }

  static getFinance(): Transaction[] { return this.getItem(STORAGE_KEYS.FINANCE, defaultFinance); }
  static setFinance(txs: Transaction[]): void { this.setItem(STORAGE_KEYS.FINANCE, txs); }

  static getBudgets(): BudgetLimit[] { return this.getItem(STORAGE_KEYS.BUDGETS, defaultBudgets); }
  static setBudgets(budgets: BudgetLimit[]): void { this.setItem(STORAGE_KEYS.BUDGETS, budgets); }

  static getHealth(): HealthMetrics { return this.getItem(STORAGE_KEYS.HEALTH, defaultHealth); }
  static setHealth(health: HealthMetrics): void { this.setItem(STORAGE_KEYS.HEALTH, health); }

  static getMeals(): MealLog[] { return this.getItem(STORAGE_KEYS.MEALS, defaultMeals); }
  static setMeals(meals: MealLog[]): void { this.setItem(STORAGE_KEYS.MEALS, meals); }

  static getWorkouts(): WorkoutLog[] { return this.getItem(STORAGE_KEYS.WORKOUTS, defaultWorkouts); }
  static setWorkouts(workouts: WorkoutLog[]): void { this.setItem(STORAGE_KEYS.WORKOUTS, workouts); }

  static getCourses(): Course[] { return this.getItem(STORAGE_KEYS.COURSES, defaultCourses); }
  static setCourses(courses: Course[]): void { this.setItem(STORAGE_KEYS.COURSES, courses); }

  static getAssignments(): Assignment[] { return this.getItem(STORAGE_KEYS.ASSIGNMENTS, defaultAssignments); }
  static setAssignments(assignments: Assignment[]): void { this.setItem(STORAGE_KEYS.ASSIGNMENTS, assignments); }

  static getBooks(): Book[] { return this.getItem(STORAGE_KEYS.BOOKS, defaultBooks); }
  static setBooks(books: Book[]): void { this.setItem(STORAGE_KEYS.BOOKS, books); }

  static getSkills(): Skill[] { return this.getItem(STORAGE_KEYS.SKILLS, defaultSkills); }
  static setSkills(skills: Skill[]): void { this.setItem(STORAGE_KEYS.SKILLS, skills); }

  static getTasks(): Task[] { return this.getItem(STORAGE_KEYS.TASKS, defaultTasks); }
  static setTasks(tasks: Task[]): void { this.setItem(STORAGE_KEYS.TASKS, tasks); }

  static getNotes(): Note[] { return this.getItem(STORAGE_KEYS.NOTES, defaultNotes); }
  static setNotes(notes: Note[]): void { this.setItem(STORAGE_KEYS.NOTES, notes); }

  static getDocuments(): IdentityDocument[] { return this.getItem(STORAGE_KEYS.DOCUMENTS, defaultDocuments); }
  static setDocuments(docs: IdentityDocument[]): void { this.setItem(STORAGE_KEYS.DOCUMENTS, docs); }

  static getCertificates(): Certificate[] { return this.getItem(STORAGE_KEYS.CERTIFICATES, defaultCertificates); }
  static setCertificates(certs: Certificate[]): void { this.setItem(STORAGE_KEYS.CERTIFICATES, certs); }

  static getFamily(): FamilyMember[] { return this.getItem(STORAGE_KEYS.FAMILY, defaultFamily); }
  static setFamily(family: FamilyMember[]): void { this.setItem(STORAGE_KEYS.FAMILY, family); }

  static getTimeline(): TimelineEvent[] { return this.getItem(STORAGE_KEYS.TIMELINE, defaultTimeline); }
  static setTimeline(timeline: TimelineEvent[]): void { this.setItem(STORAGE_KEYS.TIMELINE, timeline); }

  static getContacts(): Contact[] { return this.getItem(STORAGE_KEYS.CONTACTS, defaultContacts); }
  static setContacts(contacts: Contact[]): void { this.setItem(STORAGE_KEYS.CONTACTS, contacts); }

  static getMemories(): Memory[] { return this.getItem(STORAGE_KEYS.MEMORIES, defaultMemories); }
  static setMemories(memories: Memory[]): void { this.setItem(STORAGE_KEYS.MEMORIES, memories); }

  /** Generic item deletion helper for array storage keys */
  private static deleteItem<T extends { id: string }>(getFn: () => T[], setFn: (items: T[]) => void, id: string): T[] {
    const updated = getFn().filter((item) => item.id !== id);
    setFn(updated);
    return updated;
  }

  static deleteTask(id: string): Task[] { return this.deleteItem(() => this.getTasks(), (items) => this.setTasks(items), id); }
  static deleteNote(id: string): Note[] { return this.deleteItem(() => this.getNotes(), (items) => this.setNotes(items), id); }
  static deleteTransaction(id: string): Transaction[] { return this.deleteItem(() => this.getFinance(), (items) => this.setFinance(items), id); }
  static deleteGoal(id: string): Goal[] { return this.deleteItem(() => this.getGoals(), (items) => this.setGoals(items), id); }
  static deleteHabit(id: string): Habit[] {
    const remainingHabits = this.deleteItem(() => this.getHabits(), (items) => this.setHabits(items), id);
    const updatedLogs = this.getHabitLogs().filter((l) => l.habitId !== id);
    this.setHabitLogs(updatedLogs);
    return remainingHabits;
  }
  static deleteDocument(id: string): IdentityDocument[] { return this.deleteItem(() => this.getDocuments(), (items) => this.setDocuments(items), id); }
  static deleteCertificate(id: string): Certificate[] { return this.deleteItem(() => this.getCertificates(), (items) => this.setCertificates(items), id); }
  static deleteFamily(id: string): FamilyMember[] { return this.deleteItem(() => this.getFamily(), (items) => this.setFamily(items), id); }
  static deleteTimeline(id: string): TimelineEvent[] { return this.deleteItem(() => this.getTimeline(), (items) => this.setTimeline(items), id); }
  static deleteCourse(id: string): Course[] { return this.deleteItem(() => this.getCourses(), (items) => this.setCourses(items), id); }

  static async exportBackup(password?: string): Promise<string> {
    const backupData = {
      version: "3.0",
      timestamp: new Date().toISOString(),
      appState: this.getAppState(),
      goals: this.getGoals(),
      salah: this.getSalahLog(),
      habits: this.getHabits(),
      habitLogs: this.getHabitLogs(),
      journal: this.getJournal(),
      finance: this.getFinance(),
      budgets: this.getBudgets(),
      health: this.getHealth(),
      meals: this.getMeals(),
      workouts: this.getWorkouts(),
      courses: this.getCourses(),
      assignments: this.getAssignments(),
      books: this.getBooks(),
      skills: this.getSkills(),
      tasks: this.getTasks(),
      notes: this.getNotes(),
      documents: this.getDocuments(),
      certificates: this.getCertificates(),
      family: this.getFamily(),
      timeline: this.getTimeline(),
    };

    const rawJson = JSON.stringify(backupData, null, 2);

    if (password && password.trim().length > 0) {
      const encrypted = await encryptAES(rawJson, password.trim());
      return JSON.stringify({
        isProtected: true,
        encryptionVersion: "aes-256-gcm",
        version: "3.0",
        timestamp: new Date().toISOString(),
        payload: encrypted,
      }, null, 2);
    }

    return rawJson;
  }

  static async importBackup(jsonString: string, password?: string): Promise<{ success: boolean; requiresPassword?: boolean; error?: string }> {
    try {
      let parsed = JSON.parse(jsonString);

      if (parsed && parsed.isProtected === true) {
        if (!password || password.trim().length === 0) {
          return { success: false, requiresPassword: true, error: "This backup is password protected." };
        }

        try {
          let rawJson: string;

          if (parsed.encryptionVersion === "aes-256-gcm" && parsed.payload?.salt) {
            // New AES-256-GCM encrypted backup (v3.0+)
            rawJson = await decryptAES(parsed.payload, password.trim());
          } else {
            // Legacy XOR-encoded backup (v2.0) — backwards compatible import
            rawJson = legacyXorDecrypt(parsed.payload, password);
          }

          parsed = JSON.parse(rawJson);
        } catch (e) {
          return { success: false, requiresPassword: true, error: "Incorrect backup password!" };
        }
      }

      const data = parsed;
      if (!data || typeof data !== "object") return { success: false, error: "Invalid backup format." };

      if (data.appState) {
        // Force onboarded when restoring a backup
        const restoredState = { ...data.appState, isOnboarded: true, onboardingCompleted: true };
        this.setAppState(restoredState);
      }
      if (Array.isArray(data.goals)) this.setGoals(data.goals);
      if (data.salah) this.setSalahLog(data.salah);
      if (Array.isArray(data.habits)) this.setHabits(data.habits);
      if (Array.isArray(data.habitLogs)) this.setHabitLogs(data.habitLogs);
      if (Array.isArray(data.journal)) this.setJournal(data.journal);
      if (Array.isArray(data.finance)) this.setFinance(data.finance);
      if (Array.isArray(data.budgets)) this.setBudgets(data.budgets);
      if (data.health) this.setHealth(data.health);
      if (Array.isArray(data.meals)) this.setMeals(data.meals);
      if (Array.isArray(data.workouts)) this.setWorkouts(data.workouts);
      if (Array.isArray(data.courses)) this.setCourses(data.courses);
      if (Array.isArray(data.assignments)) this.setAssignments(data.assignments);
      if (Array.isArray(data.books)) this.setBooks(data.books);
      if (Array.isArray(data.skills)) this.setSkills(data.skills);
      if (Array.isArray(data.tasks)) this.setTasks(data.tasks);
      if (Array.isArray(data.notes)) this.setNotes(data.notes);
      if (Array.isArray(data.documents)) this.setDocuments(data.documents);
      if (Array.isArray(data.certificates)) this.setCertificates(data.certificates);
      if (Array.isArray(data.family)) this.setFamily(data.family);
      if (Array.isArray(data.timeline)) this.setTimeline(data.timeline);

      return { success: true };
    } catch (e) {
      console.error("Failed to import vault backup:", e);
      return { success: false, error: "Corrupted or invalid JSON backup file." };
    }
  }

  /**
   * Hash a PIN using SHA-256 for secure storage.
   */
  static async hashPin(pin: string): Promise<string> {
    return cryptoHashPin(pin);
  }

  static resetAll(): void {
    localStorage.clear();
  }

  static resetToEmpty(): void {
    localStorage.clear();
    const emptyAppState = {
      ...defaultAppState,
      isOnboarded: false,
      onboardingCompleted: false,
      userXp: 0,
      xp: 0,
      userProfile: {
        ...defaultUserProfile,
        fullName: "New User",
        nickname: "User",
      },
    };
    this.setAppState(emptyAppState);
    this.setGoals([]);
    this.setSalahLog(defaultSalah);
    this.setHabits([]);
    this.setHabitLogs([]);
    this.setJournal([]);
    this.setFinance([]);
    this.setBudgets([]);
    this.setHealth(defaultHealth);
    this.setMeals([]);
    this.setWorkouts([]);
    this.setCourses([]);
    this.setAssignments([]);
    this.setBooks([]);
    this.setSkills([]);
    this.setTasks([]);
    this.setNotes([]);
    this.setDocuments([]);
    this.setCertificates([]);
    this.setFamily([]);
    this.setTimeline([]);
  }
}
