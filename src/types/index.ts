export type PrayerStatus = 'on_time' | 'late' | 'qaza' | 'missed' | 'pending';

export type GoalCategory = 'Physical' | 'Mental' | 'Spiritual' | 'Academic' | 'Financial' | 'Career' | 'Personal';
export type GoalPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type GoalTimeframe = 'Vision' | 'Annual' | 'Monthly' | 'Weekly' | 'Daily';

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: GoalCategory;
  timeframe: GoalTimeframe;
  deadline: string;
  progress: number; // 0 to 100
  priority: GoalPriority;
  milestones: Milestone[];
  notes?: string;
  createdAt: string;
}

export interface SalahLog {
  date: string; // YYYY-MM-DD
  fajr: PrayerStatus;
  dhuhr: PrayerStatus;
  asr: PrayerStatus;
  maghrib: PrayerStatus;
  isha: PrayerStatus;
  witr: PrayerStatus;
  tahajjud?: boolean;
  tahajjudXpClaimed?: boolean;
  quranPagesRead?: number;
  dhikrCount?: number;
  fasting?: boolean;
  fastingXpClaimed?: boolean;
  notes?: string;
}

export interface Habit {
  id: string;
  name: string;
  category: string;
  type: 'checkbox' | 'numeric' | 'timer';
  target: number;
  unit?: string;
  frequency: 'daily' | 'weekly';
  streak: number;
  longestStreak: number;
  color: string;
}

export interface HabitLog {
  habitId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  xpClaimed?: boolean;
  value?: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  type: 'Daily' | 'Gratitude' | 'Dream' | 'Travel';
  title: string;
  content: string;
  tags: string[];
  mood: number; // 1-10
  energy?: number; // 1-10
  stress?: number; // 1-10
  happiness?: number; // 1-10
  audioNoteUrl?: string;
  aiSummary?: string;
}

export interface Transaction {
  id: string;
  date: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: 'Food' | 'Transport' | 'Education' | 'Entertainment' | 'Shopping' | 'Medical' | 'Allowance' | 'Savings' | 'Other';
  notes?: string;
}

export interface BudgetLimit {
  category: string;
  limit: number;
}

export interface HealthMetrics {
  date: string;
  weightKg?: number;
  sleepHours?: number;
  waterMl: number;
  steps: number;
  caloriesBurned?: number;
}

export interface MealLog {
  id: string;
  date: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
  name: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

export interface WorkoutLog {
  id: string;
  date: string;
  title: string;
  category: 'Gym' | 'Yoga' | 'Stretching' | 'Walking' | 'Cardio';
  durationMins: number;
  caloriesBurned: number;
  notes?: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  instructor: string;
  creditHours: number;
  targetGrade: string;
  attendanceTotal: number;
  attendanceAttended: number;
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  dueDate: string;
  priority: GoalPriority;
  completed: boolean;
  score?: number;
  maxScore?: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  type: 'Book' | 'Article' | 'Research Paper';
  totalPages: number;
  pagesRead: number;
  status: 'To Read' | 'Reading' | 'Completed';
  highlights?: string[];
}

export interface Skill {
  id: string;
  name: string;
  category: 'Programming' | 'Writing' | 'Public Speaking' | 'Design' | 'Languages' | 'Other';
  hoursPracticed: number;
  targetHours: number;
  projectsBuiltCount: number;
}

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: GoalPriority;
  category: string;
  completed: boolean;
  recurring?: 'daily' | 'weekly' | 'none';
  subtasks?: { id: string; title: string; completed: boolean }[];
}

export interface Note {
  id: string;
  folder: string;
  title: string;
  content: string;
  tags: string[];
  updatedAt: string;
  category?: string;
}

export interface IdentityDocument {
  id: string;
  title: string;
  type: 'Passport' | 'Aadhaar' | 'PAN' | 'Driving Licence' | 'Student ID' | 'Birth Certificate' | 'Medical Card' | 'Other';
  documentNumber: string;
  issueDate: string;
  expiryDate: string;
  notes?: string;
  isEncrypted: boolean;
  filePreviewUrl?: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  category: 'Academic' | 'Professional' | 'Competition' | 'Volunteer' | 'Scholarships' | 'Sports';
  issueDate: string;
  credentialUrl?: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: 'Parent' | 'Sibling' | 'Grandparent' | 'Relative' | 'Friend' | 'Mentor';
  birthday: string;
  contact: string;
  notes?: string;
}

export interface Contact {
  id: string;
  name: string;
  relationship: string;
  birthday: string;
  phone: string;
  email?: string;
  giftIdeas?: string[];
}

export interface Memory {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  photoUrl: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  unlocked: boolean;
}

export interface TimelineEvent {
  id: string;
  year: string;
  date: string;
  title: string;
  category: 'Education' | 'Award' | 'Trip' | 'Milestone' | 'Personal';
  description: string;
  imageUrl?: string;
}

export interface UserProfile {
  fullName: string;
  nickname: string;
  photoUrl: string;
  dob: string;
  bloodGroup: string;
  heightCm: number;
  weightKg: number;
  address: string;
  phone: string;
  email: string;
  languages: string[];
  collegeName: string;
  degreeMajor: string;
  currentSemester: string;
  studentIdNumber: string;
  emergencyContacts: { name: string; relation: string; phone: string }[];
}

export interface SecuritySettings {
  pinEnabled: boolean;
  pinCode: string;
  biometricEnabled: boolean;
  autoLockMinutes: number;
  isLocked: boolean;
}

export interface AppState {
  onboardingCompleted?: boolean;
  isOnboarded: boolean;
  userProfile: UserProfile;
  security: SecuritySettings;
  vaultPin: string;
  pinEnabled: boolean;
  userXp: number;
  badges: Badge[];
  xp: number;
  level: number;
  activeModules: Record<string, boolean>;
  theme: 'dark' | 'light';
  offlineSyncPendingCount: number;
  lastSyncedAt: string;
}
