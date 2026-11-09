"use client";

import { useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Award,
  Bell,
  BellRing,
  BookOpenCheck,
  Building2,
  CalendarClock,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  CircleDollarSign,
  Clock3,
  CreditCard,
  Download,
  Eye,
  EyeOff,
  FileText,
  Filter,
  GraduationCap,
  LayoutDashboard,
  Library,
  LockKeyhole,
  LineChart,
  LogOut,
  Mail,
  MapPin,
  Megaphone,
  Menu,
  MoreHorizontal,
  PanelLeftClose,
  Phone,
  Plus,
  ReceiptText,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  Sparkles,
  Trash2,
  TrendingUp,
  UserRound,
  Users,
  WalletCards,
  X,
} from "lucide-react";

type PageKey =
  | "dashboard"
  | "profile"
  | "courses"
  | "results"
  | "timetable"
  | "exams"
  | "fees"
  | "payments"
  | "notifications"
  | "announcements"
  | "settings";

type Profile = {
  name: string;
  matric: string;
  department: string;
  faculty: string;
  level: string;
  email: string;
  phone: string;
  bio: string;
};

type Course = {
  code: string;
  title: string;
  unit: number;
  type: "Core" | "Elective" | "General";
  instructor: string;
};

type Result = {
  code: string;
  title: string;
  unit: number;
  grade: string;
  point: number;
};
type Notice = {
  id: number;
  title: string;
  body: string;
  time: string;
  type: "academic" | "finance" | "event";
  read: boolean;
};
type Announcement = {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  tag: string;
  featured?: boolean;
};

type Exam = {
  code: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  color: string;
};

type TimetableItem = {
  time: string;
  code: string;
  title: string;
  room: string;
  tone: string;
};

type TimetableDay = {
  day: string;
  short: string;
  items: TimetableItem[];
};

type FeeItem = {
  id: number;
  label: string;
  amount: number;
  paid: number;
};

type Payment = {
  date: string;
  ref: string;
  type: string;
  amount: number;
  status: "Verified" | "Pending" | "Failed";
};

type PortalData = {
  profile: Profile;
  courses: Course[];
  registeredCodes: string[];
  results: Result[];
  notices: Notice[];
  announcements: Announcement[];
  examSchedule: Exam[];
  timetable: TimetableDay[];
  fees: FeeItem[];
  payments: Payment[];
  session: string;
  semester: string;
  gpa: string;
  cgpa: string;
  creditsCompleted: number;
  totalCredits: number;
  studentPassword: string;
};

type StudentAccount = {
  id: string;
  email: string;
  password: string;
  data: PortalData;
  createdAt: string;
};

const STORAGE_KEY = "northbridge-portal-state";
const AUTH_KEY = "northbridge-portal-auth";
const STUDENTS_KEY = "northbridge-portal-students";

const initialProfile: Profile = {
  name: "Amara Okafor",
  matric: "NBU/CSC/21/0842",
  department: "Computer Science",
  faculty: "Computing & Informatics",
  level: "400 Level",
  email: "amara.okafor@northbridge.edu",
  phone: "+234 803 555 0184",
  bio: "Curious problem-solver exploring the intersection of software, data, and human-centered design.",
};

const courseCatalog: Course[] = [
  {
    code: "CSC 401",
    title: "Advanced Algorithms",
    unit: 3,
    type: "Core",
    instructor: "Dr. K. Adebayo",
  },
  {
    code: "CSC 403",
    title: "Software Engineering",
    unit: 3,
    type: "Core",
    instructor: "Prof. A. Yusuf",
  },
  {
    code: "CSC 405",
    title: "Human Computer Interaction",
    unit: 3,
    type: "Core",
    instructor: "Dr. M. Bello",
  },
  {
    code: "CSC 407",
    title: "Distributed Systems",
    unit: 3,
    type: "Core",
    instructor: "Dr. E. Chukwu",
  },
  {
    code: "CSC 409",
    title: "Information Security",
    unit: 3,
    type: "Elective",
    instructor: "Engr. T. Nwosu",
  },
  {
    code: "EED 402",
    title: "Technology Entrepreneurship",
    unit: 2,
    type: "Elective",
    instructor: "Mrs. R. Okoro",
  },
  {
    code: "GST 402",
    title: "Research Methods",
    unit: 2,
    type: "General",
    instructor: "Dr. I. Danladi",
  },
  {
    code: "MTH 401",
    title: "Operations Research",
    unit: 3,
    type: "Elective",
    instructor: "Prof. O. Lawal",
  },
];

const initialRegistered = [
  "CSC 401",
  "CSC 403",
  "CSC 405",
  "CSC 407",
  "EED 402",
  "GST 402",
];

const results: Result[] = [
  {
    code: "CSC 401",
    title: "Advanced Algorithms",
    unit: 3,
    grade: "A",
    point: 5.0,
  },
  {
    code: "CSC 403",
    title: "Software Engineering",
    unit: 3,
    grade: "A-",
    point: 4.5,
  },
  {
    code: "CSC 405",
    title: "Human Computer Interaction",
    unit: 3,
    grade: "A",
    point: 5.0,
  },
  {
    code: "CSC 407",
    title: "Distributed Systems",
    unit: 3,
    grade: "B+",
    point: 4.0,
  },
  {
    code: "EED 402",
    title: "Technology Entrepreneurship",
    unit: 2,
    grade: "A",
    point: 5.0,
  },
  {
    code: "GST 402",
    title: "Research Methods",
    unit: 2,
    grade: "B+",
    point: 4.0,
  },
];

const initialNotices: Notice[] = [
  {
    id: 1,
    title: "Course registration closes Friday",
    body: "Remember to confirm your semester courses before 11:59 PM.",
    time: "18 min ago",
    type: "academic",
    read: false,
  },
  {
    id: 2,
    title: "Payment received",
    body: "Your ₦150,000 tuition payment has been verified.",
    time: "2 hours ago",
    type: "finance",
    read: false,
  },
  {
    id: 3,
    title: "Design club showcase",
    body: "The annual student showcase is happening in the Innovation Hub.",
    time: "Yesterday",
    type: "event",
    read: true,
  },
  {
    id: 4,
    title: "Academic advising week",
    body: "Book an appointment with your department adviser this week.",
    time: "2 days ago",
    type: "academic",
    read: true,
  },
];

const announcements: Announcement[] = [
  {
    id: 1,
    title: "2025/2026 second semester registration is now open",
    excerpt:
      "Students can review the new course catalogue and complete registration from their portal. Please confirm your selections before the deadline.",
    date: "May 12, 2026",
    tag: "Academic",
    featured: true,
  },
  {
    id: 2,
    title: "Northbridge innovation challenge",
    excerpt:
      "Submit your product idea and stand a chance to win a place in the summer accelerator cohort.",
    date: "May 08, 2026",
    tag: "Opportunity",
  },
  {
    id: 3,
    title: "Library extended study hours",
    excerpt:
      "The main library will remain open until 11:00 PM during the examination preparation period.",
    date: "May 03, 2026",
    tag: "Campus life",
  },
  {
    id: 4,
    title: "Student wellness check-in",
    excerpt:
      "Free confidential counseling sessions are available for all students through the Wellness Centre.",
    date: "Apr 28, 2026",
    tag: "Wellbeing",
  },
  {
    id: 5,
    title: "Faculty town hall recording",
    excerpt:
      "Missed the faculty town hall? The recording and notes are now available in the student resources hub.",
    date: "Apr 23, 2026",
    tag: "Faculty",
  },
];

const examSchedule = [
  {
    code: "CSC 401",
    title: "Advanced Algorithms",
    date: "Mon, Jun 08",
    time: "9:00 AM – 12:00 PM",
    venue: "ICT Hall A",
    color: "blue",
  },
  {
    code: "CSC 403",
    title: "Software Engineering",
    date: "Wed, Jun 10",
    time: "1:00 PM – 4:00 PM",
    venue: "Senate Building 2",
    color: "purple",
  },
  {
    code: "CSC 405",
    title: "Human Computer Interaction",
    date: "Fri, Jun 12",
    time: "9:00 AM – 12:00 PM",
    venue: "Design Studio",
    color: "orange",
  },
  {
    code: "CSC 407",
    title: "Distributed Systems",
    date: "Tue, Jun 16",
    time: "1:00 PM – 4:00 PM",
    venue: "ICT Hall B",
    color: "green",
  },
];

const timetable = [
  {
    day: "Monday",
    short: "Mon",
    items: [
      {
        time: "09:00 – 11:00",
        code: "CSC 401",
        title: "Advanced Algorithms",
        room: "ICT Hall A",
        tone: "blue",
      },
      {
        time: "14:00 – 16:00",
        code: "EED 402",
        title: "Technology Entrepreneurship",
        room: "Business Lab",
        tone: "orange",
      },
    ],
  },
  {
    day: "Tuesday",
    short: "Tue",
    items: [
      {
        time: "11:00 – 13:00",
        code: "CSC 403",
        title: "Software Engineering",
        room: "Senate Building 2",
        tone: "purple",
      },
    ],
  },
  {
    day: "Wednesday",
    short: "Wed",
    items: [
      {
        time: "09:00 – 11:00",
        code: "GST 402",
        title: "Research Methods",
        room: "Lecture Theatre 3",
        tone: "green",
      },
      {
        time: "14:00 – 16:00",
        code: "CSC 405",
        title: "Human Computer Interaction",
        room: "Design Studio",
        tone: "blue",
      },
    ],
  },
  {
    day: "Thursday",
    short: "Thu",
    items: [
      {
        time: "11:00 – 13:00",
        code: "CSC 407",
        title: "Distributed Systems",
        room: "ICT Hall B",
        tone: "pink",
      },
    ],
  },
  {
    day: "Friday",
    short: "Fri",
    items: [
      {
        time: "09:00 – 11:00",
        code: "CSC 401",
        title: "Advanced Algorithms",
        room: "ICT Hall A",
        tone: "blue",
      },
    ],
  },
];

const initialFees: FeeItem[] = [
  { id: 1, label: "Tuition fee", amount: 420000, paid: 355000 },
  { id: 2, label: "Technology levy", amount: 35000, paid: 35000 },
  { id: 3, label: "Library & student services", amount: 20000, paid: 20000 },
  { id: 4, label: "Examination fee", amount: 15000, paid: 15000 },
];

const initialPayments: Payment[] = [
  {
    date: "May 14, 2026",
    ref: "NB-2026-0514-8821",
    type: "Tuition fee",
    amount: 150000,
    status: "Verified",
  },
  {
    date: "Feb 02, 2026",
    ref: "NB-2026-0202-4190",
    type: "Tuition fee",
    amount: 205000,
    status: "Verified",
  },
  {
    date: "Jan 22, 2026",
    ref: "NB-2026-0122-1734",
    type: "Technology levy",
    amount: 35000,
    status: "Verified",
  },
  {
    date: "Oct 05, 2025",
    ref: "NB-2025-1005-7618",
    type: "Tuition fee",
    amount: 150000,
    status: "Verified",
  },
];

const initialPortalData: PortalData = {
  profile: initialProfile,
  courses: courseCatalog,
  registeredCodes: initialRegistered,
  results,
  notices: initialNotices,
  announcements,
  examSchedule: examSchedule as Exam[],
  timetable: timetable as TimetableDay[],
  fees: initialFees,
  payments: initialPayments,
  session: "2025 / 2026",
  semester: "Second semester",
  gpa: "4.52",
  cgpa: "4.52",
  creditsCompleted: 96,
  totalCredits: 120,
  studentPassword: "",
};

function createEmptyStudentData(
  profile: Profile,
  studentPassword: string,
): PortalData {
  return {
    profile,
    courses: [],
    registeredCodes: [],
    results: [],
    notices: [],
    announcements: [],
    examSchedule: [],
    timetable: [],
    fees: [],
    payments: [],
    session: "",
    semester: "",
    gpa: "",
    cgpa: "",
    creditsCompleted: 0,
    totalCredits: 0,
    studentPassword,
  };
}

const navGroups: {
  label: string;
  items: { key: PageKey; label: string; icon: LucideIcon }[];
}[] = [
  {
    label: "Workspace",
    items: [
      { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { key: "profile", label: "My Profile", icon: UserRound },
    ],
  },
  {
    label: "Academics",
    items: [
      { key: "courses", label: "Course Registration", icon: BookOpenCheck },
      { key: "results", label: "Academic Results", icon: GraduationCap },
      { key: "timetable", label: "Class Timetable", icon: CalendarDays },
      { key: "exams", label: "Examination Timetable", icon: CalendarClock },
    ],
  },
  {
    label: "Finance",
    items: [
      { key: "fees", label: "School Fees", icon: WalletCards },
      { key: "payments", label: "Payment History", icon: ReceiptText },
    ],
  },
  {
    label: "Community",
    items: [
      { key: "notifications", label: "Notifications", icon: Bell },
      { key: "announcements", label: "Announcements", icon: Megaphone },
    ],
  },
];

const pageDetails: Record<PageKey, { label: string; description: string }> = {
  dashboard: {
    label: "Dashboard",
    description: "Your academic overview at a glance.",
  },
  profile: {
    label: "My Profile",
    description: "Keep your student identity and contact details up to date.",
  },
  courses: {
    label: "Course Registration",
    description: "Build your semester schedule and confirm your courses.",
  },
  results: {
    label: "Academic Results",
    description: "Track your semester performance and academic progress.",
  },
  timetable: {
    label: "Class Timetable",
    description: "Your weekly classes, all in one place.",
  },
  exams: {
    label: "Examination Timetable",
    description: "Know what is next and arrive prepared.",
  },
  fees: {
    label: "School Fees",
    description: "Review your account balance and payment status.",
  },
  payments: {
    label: "Payment History",
    description: "A clear record of your tuition and campus payments.",
  },
  notifications: {
    label: "Notifications",
    description: "Stay on top of the updates that matter.",
  },
  announcements: {
    label: "Announcements",
    description: "News and important updates from Northbridge.",
  },
  settings: {
    label: "Settings",
    description: "Manage your account preferences and profile details.",
  },
};

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function cn(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function Avatar({
  name,
  size = "md",
}: {
  name: string;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-[#dce5ff] font-bold text-royal avatar-ring",
        size === "sm" && "h-8 w-8 text-[11px]",
        size === "md" && "h-10 w-10 text-xs",
        size === "lg" && "h-20 w-20 text-xl",
      )}
    >
      {initials(name)}
    </div>
  );
}

function StatusPill({
  children,
  tone = "blue",
}: {
  children: React.ReactNode;
  tone?: "blue" | "green" | "amber" | "red" | "slate" | "purple";
}) {
  const tones = {
    blue: "bg-[#eef2ff] text-royal",
    green: "bg-[#eaf8f1] text-[#198754]",
    amber: "bg-[#fff6df] text-[#a36b00]",
    red: "bg-[#fff0f1] text-[#c6374a]",
    slate: "bg-[#f1f3f7] text-[#63718b]",
    purple: "bg-[#f3efff] text-[#7653c9]",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}

function SectionTitle({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div>
        {eyebrow && (
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[.16em] text-royal">
            {eyebrow}
          </p>
        )}
        <h2 className="text-[17px] font-bold tracking-[-.02em] text-ink">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}

function Sidebar({
  activePage,
  open,
  onNavigate,
  onClose,
  unreadCount,
  onLogout,
}: {
  activePage: PageKey;
  open: boolean;
  onNavigate: (page: PageKey) => void;
  onClose: () => void;
  unreadCount: number;
  onLogout: () => void;
}) {
  return (
    <>
      <aside
        className={cn(
          "sidebar flex min-h-screen flex-col border-r border-line bg-white px-4 py-5",
          open && "open",
        )}
      >
        <div className="mb-8 flex items-center justify-between px-2">
          <button
            onClick={() => onNavigate("dashboard")}
            className="flex items-center gap-2.5 text-left"
            aria-label="Go to dashboard"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-white shadow-sm">
              <Library size={19} strokeWidth={2.4} />
            </span>
            <span>
              <span className="block text-[15px] font-extrabold leading-none tracking-[-.03em] text-ink">
                northbridge
              </span>
              <span className="mt-1 block text-[9px] font-semibold uppercase tracking-[.18em] text-slate-400">
                Student portal
              </span>
            </span>
          </button>
          <button
            className="button-quiet rounded-lg p-1.5 text-slate-400 md:hidden"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <PanelLeftClose size={17} />
          </button>
        </div>
        <nav className="scrollbar-thin flex-1 space-y-6 overflow-y-auto px-1">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[.16em] text-slate-400">
                {group.label}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = activePage === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => onNavigate(item.key)}
                      className={cn(
                        "nav-item flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold",
                        active
                          ? "bg-[#eef2ff] text-royal"
                          : "text-[#71809a] hover:bg-[#f6f8fc] hover:text-ink",
                      )}
                    >
                      <Icon size={17} strokeWidth={active ? 2.3 : 1.9} />
                      <span className="flex-1">{item.label}</span>
                      {item.key === "notifications" && unreadCount > 0 && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 text-[10px] text-white">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          <div>
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[.16em] text-slate-400">
              Account
            </p>
            <button
              onClick={() => onNavigate("settings")}
              className={cn(
                "nav-item flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold",
                activePage === "settings"
                  ? "bg-[#eef2ff] text-royal"
                  : "text-[#71809a] hover:bg-[#f6f8fc] hover:text-ink",
              )}
            >
              <Settings2 size={17} />
              <span>Settings</span>
            </button>
            <button
              onClick={onLogout}
              className="nav-item mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold text-[#71809a] hover:bg-[#fff1f2] hover:text-[#c6374a]"
            >
              <LogOut size={17} />
              <span>Log out</span>
            </button>
          </div>
        </nav>
        <div className="mt-6 rounded-2xl bg-[#f7f8fc] p-3.5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[11px] font-bold text-ink">Need help?</span>
            <CircleAlert size={14} className="text-slate-400" />
          </div>
          <p className="mb-3 text-[11px] leading-4 text-slate-500">
            Our student success team is here for you.
          </p>
          <button
            className="text-[11px] font-bold text-royal hover:underline"
            onClick={() => onNavigate("announcements")}
          >
            Visit support centre{" "}
            <ArrowRight size={12} className="ml-1 inline" />
          </button>
        </div>
        <div className="mt-4 flex items-center gap-2 border-t border-line px-2 pt-4">
          <Avatar name="Amara Okafor" size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-ink">Amara Okafor</p>
            <p className="text-[10px] text-slate-400">400 Level · CSC</p>
          </div>
          <MoreHorizontal size={16} className="text-slate-400" />
        </div>
      </aside>
      {open && <div className="mobile-overlay" onClick={onClose} />}
    </>
  );
}

function Header({
  page,
  profile,
  search,
  setSearch,
  onMenu,
  onNavigate,
  unreadCount,
}: {
  page: PageKey;
  profile: Profile;
  search: string;
  setSearch: (value: string) => void;
  onMenu: () => void;
  onNavigate: (page: PageKey) => void;
  unreadCount: number;
}) {
  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between gap-4 border-b border-line bg-white/90 px-4 backdrop-blur-md sm:px-7 lg:px-9">
      <div className="flex min-w-0 items-center gap-3">
        <button
          className="button-quiet rounded-xl p-2 text-slate-500 md:hidden"
          onClick={onMenu}
          aria-label="Open navigation"
        >
          <Menu size={21} />
        </button>
        <div className="hidden text-slate-300 sm:block">
          <ChevronRight size={17} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-bold text-ink">
            {pageDetails[page].label}
          </p>
          <p className="hidden truncate text-[11px] text-slate-400 sm:block">
            Northbridge University · 2025/2026 session
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2.5 sm:gap-4">
        <label className="relative hidden lg:block">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="form-input h-10 w-56 rounded-xl border border-line bg-[#f8f9fc] pl-9 pr-3 text-xs text-ink placeholder:text-slate-400"
            placeholder="Search portal..."
            aria-label="Search portal"
          />
        </label>
        <button
          onClick={() => onNavigate("notifications")}
          className="button-quiet relative rounded-xl p-2.5 text-slate-500"
          aria-label="View notifications"
        >
          <Bell size={19} strokeWidth={1.9} />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border-2 border-white bg-[#e25768]" />
          )}
        </button>
        <div className="hidden h-7 w-px bg-line sm:block" />
        <button
          onClick={() => onNavigate("profile")}
          className="flex items-center gap-2 text-left"
        >
          <Avatar name={profile.name} size="sm" />
          <span className="hidden sm:block">
            <span className="block max-w-[110px] truncate text-xs font-bold text-ink">
              {profile.name}
            </span>
            <span className="block text-[10px] text-slate-400">Student</span>
          </span>
          <ChevronDown size={14} className="hidden text-slate-400 sm:block" />
        </button>
      </div>
    </header>
  );
}

function DashboardCard({
  icon: Icon,
  label,
  value,
  detail,
  tone = "blue",
  progress,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
  tone?: "blue" | "green" | "orange" | "purple";
  progress?: number;
}) {
  const iconTone = {
    blue: "bg-[#eef2ff] text-royal",
    green: "bg-[#eaf8f1] text-[#198754]",
    orange: "bg-[#fff5e5] text-[#b77810]",
    purple: "bg-[#f2efff] text-[#7653c9]",
  };
  return (
    <div className="rounded-2xl border border-line bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-soft">
      <div className="mb-4 flex items-start justify-between">
        <span
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-xl",
            iconTone[tone],
          )}
        >
          <Icon size={18} />
        </span>
        <ArrowUpRight size={15} className="text-slate-300" />
      </div>
      <p className="text-[11px] font-semibold text-slate-400">{label}</p>
      <p className="mt-1 text-[23px] font-extrabold tracking-[-.04em] text-ink">
        {value}
      </p>
      <div className="mt-2 flex items-center justify-between gap-2">
        <p className="truncate text-[10px] font-medium text-slate-500">
          {detail}
        </p>
        {progress !== undefined && (
          <span className="text-[10px] font-bold text-royal">{progress}%</span>
        )}
      </div>
      {progress !== undefined && (
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#eef1f7]">
          <div
            className="h-full rounded-full bg-royal"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

function DashboardPage({
  data,
  onNavigate,
}: {
  data: PortalData;
  onNavigate: (page: PageKey) => void;
}) {
  const { profile, notices } = data;
  const registered = data.courses.filter((course) =>
    data.registeredCodes.includes(course.code),
  );
  const unread = notices.filter((notice) => !notice.read).length;
  const registeredUnits = registered.reduce(
    (sum, course) => sum + course.unit,
    0,
  );
  const outstandingFees = data.fees.reduce(
    (sum, fee) => sum + fee.amount - fee.paid,
    0,
  );
  const nextExam = data.examSchedule[0];
  const hasGpaData = data.results.length > 0 || Boolean(data.gpa);
  const degreeProgress = data.totalCredits
    ? Math.round((data.creditsCompleted / data.totalCredits) * 100)
    : 0;
  return (
    <div className="page-enter space-y-5">
      <section className="gradient-hero grid overflow-hidden rounded-3xl text-white shadow-soft lg:grid-cols-[1.45fr_.75fr]">
        <div className="grid-fade relative overflow-hidden p-6 sm:p-8">
          <div className="relative z-10">
            <div className="mb-5 flex items-center gap-2 text-[11px] font-semibold text-blue-100">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/15">
                <Sparkles size={13} />
              </span>
              Tuesday, May 19, 2026
            </div>
            <h1 className="max-w-md text-[28px] font-extrabold leading-[1.1] tracking-[-.04em] sm:text-[34px]">
              Good morning, {profile.name.split(" ")[0]}{" "}
              <span className="inline-block">👋</span>
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-6 text-blue-100">
              You&apos;re making great progress this semester. Here&apos;s your
              academic snapshot for today.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <button
                onClick={() => onNavigate("courses")}
                className="button-primary inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-ink"
              >
                Manage courses <ArrowRight size={14} />
              </button>
              <button
                onClick={() => onNavigate("timetable")}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/15"
              >
                View timetable
              </button>
            </div>
          </div>
          <div className="absolute -right-7 -top-10 h-56 w-56 rounded-full border border-white/10 bg-white/5" />
          <div className="absolute -bottom-28 right-20 h-64 w-64 rounded-full border border-white/10" />
        </div>
        <div className="flex items-center justify-between border-t border-white/10 bg-black/10 p-6 lg:border-l lg:border-t-0 sm:p-8">
          <div>
            <p className="text-[11px] font-semibold text-blue-100">
              Current academic session
            </p>
            <p className="mt-2 text-xl font-bold">
              {data.session || "Not set"}
            </p>
            <div className="mt-5 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#6ee7a1]" />
              <span className="text-xs text-blue-100">
                {data.semester || "Semester not set"}
              </span>
            </div>
          </div>
          <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-[7px] border-white/15">
            <div className="absolute inset-0 rounded-full border-[7px] border-transparent border-t-[#8ea6ff] border-r-[#8ea6ff] -rotate-45" />
            <div className="text-center">
              <p className="text-lg font-extrabold">Week 08</p>
              <p className="text-[9px] text-blue-100">of 14</p>
            </div>
          </div>
        </div>
      </section>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardCard
          icon={Award}
          label="Cumulative GPA"
          value={data.cgpa ? `${data.cgpa} / 5.00` : "—"}
          detail="↑ 0.18 from last semester"
          tone="blue"
        />
        <DashboardCard
          icon={BookOpenCheck}
          label="Registered courses"
          value={`${registered.length} courses`}
          detail={`${registeredUnits} credit units this semester`}
          tone="green"
          progress={Math.min(Math.round((registeredUnits / 24) * 100), 100)}
        />
        <DashboardCard
          icon={CircleDollarSign}
          label="Outstanding fees"
          value={`₦${outstandingFees.toLocaleString()}`}
          detail={
            data.fees.length ? "Current outstanding balance" : "No fees assessed"
          }
          tone="orange"
        />
        <DashboardCard
          icon={CalendarClock}
          label="Next examination"
          value={nextExam ? "Upcoming" : "—"}
          detail={
            nextExam
              ? `${nextExam.code} · ${nextExam.date}, ${nextExam.time.split("–")[0].trim()}`
              : "No examinations scheduled"
          }
          tone="purple"
        />
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.35fr_.9fr]">
        <section className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
          <SectionTitle
            eyebrow="Performance"
            title="GPA overview"
            action={
              <button
                onClick={() => onNavigate("results")}
                className="button-quiet inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold text-royal"
              >
                View results <ArrowRight size={13} />
              </button>
            }
          />
          <div className="mb-4 flex items-end gap-3">
            <p className="text-3xl font-extrabold tracking-[-.05em] text-ink">
              {data.gpa || "—"}
            </p>
            <StatusPill tone={hasGpaData ? "green" : "slate"}>
              {hasGpaData ? (
                <>
                  <TrendingUp size={12} /> Current GPA
                </>
              ) : (
                "No results yet"
              )}
            </StatusPill>
          </div>
          {hasGpaData ? (
            <>
          <div className="relative h-44">
            <div className="absolute inset-0 flex flex-col justify-between">
              <span className="border-t border-dashed border-[#edf0f5] text-[9px] text-slate-300">
                5.0
              </span>
              <span className="border-t border-dashed border-[#edf0f5] text-[9px] text-slate-300">
                4.0
              </span>
              <span className="border-t border-dashed border-[#edf0f5] text-[9px] text-slate-300">
                3.0
              </span>
              <span className="border-t border-dashed border-[#edf0f5] text-[9px] text-slate-300">
                2.0
              </span>
            </div>
            <div className="absolute inset-x-8 bottom-0 top-2 flex items-end justify-around gap-3">
              <div className="group flex h-full flex-1 items-end justify-center">
                <div className="relative h-[58%] w-full max-w-[32px] rounded-t-md bg-[#dfe6ff] transition group-hover:bg-[#c6d3ff]">
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400">
                    3.7
                  </span>
                </div>
              </div>
              <div className="group flex h-full flex-1 items-end justify-center">
                <div className="relative h-[70%] w-full max-w-[32px] rounded-t-md bg-[#dfe6ff] transition group-hover:bg-[#c6d3ff]">
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400">
                    4.1
                  </span>
                </div>
              </div>
              <div className="group flex h-full flex-1 items-end justify-center">
                <div className="relative h-[78%] w-full max-w-[32px] rounded-t-md bg-[#dfe6ff] transition group-hover:bg-[#c6d3ff]">
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400">
                    4.3
                  </span>
                </div>
              </div>
              <div className="group flex h-full flex-1 items-end justify-center">
                <div className="relative h-[90%] w-full max-w-[32px] rounded-t-md bg-royal shadow-[0_5px_12px_rgba(49,86,212,.22)] transition group-hover:bg-[#2748bf]">
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-royal">
                    4.5
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-2 flex justify-around pl-7 text-[10px] font-semibold text-slate-400">
            <span>Year 1</span>
            <span>Year 2</span>
            <span>Year 3</span>
            <span className="text-royal">Year 4</span>
          </div>
            </>
          ) : (
            <EmptyState
              icon={TrendingUp}
              title="No GPA history yet"
              text="Your GPA chart will appear after academic results are published."
            />
          )}
        </section>
        <section className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
          <SectionTitle
            eyebrow="Progress"
            title="Academic snapshot"
            action={
              <button
                onClick={() => onNavigate("results")}
                className="button-quiet rounded-lg p-1.5 text-slate-400"
                aria-label="View academic results"
              >
                <MoreHorizontal size={17} />
              </button>
            }
          />
          <div className="flex items-center gap-5">
            <div className="ring-chart relative flex h-32 w-32 shrink-0 items-center justify-center rounded-full">
              <div className="relative z-10 text-center">
                <p className="text-[25px] font-extrabold tracking-[-.05em] text-ink">
                  {degreeProgress}%
                </p>
                <p className="text-[10px] font-medium text-slate-400">
                  completed
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xl font-extrabold tracking-[-.03em] text-ink">
                  {data.creditsCompleted} / {data.totalCredits}
                </p>
                <p className="text-[11px] text-slate-400">
                  credit units earned
                </p>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-royal" />
                  Core courses{" "}
                  <span className="ml-auto font-bold text-ink">
                    {data.courses.length ? "Set by admin" : "—"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#dfe6ff]" />
                  Electives{" "}
                  <span className="ml-auto font-bold text-ink">
                    {data.courses.length ? "Set by admin" : "—"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 rounded-xl bg-[#f7f8fc] p-3.5">
            <div className="flex items-center gap-2">
              <CircleCheck size={15} className="text-[#198754]" />
              <p className="text-[11px] font-bold text-ink">
                {data.totalCredits
                  ? "You're on track to graduate"
                  : "Academic progress not set"}
              </p>
            </div>
            <p className="mt-1 pl-5 text-[10px] leading-4 text-slate-500">
              {data.totalCredits
                ? `Keep your current pace and complete ${Math.max(
                    data.totalCredits - data.creditsCompleted,
                    0,
                  )} more units.`
                : "Your administrator will add your academic plan here."}
            </p>
          </div>
        </section>
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
        <section className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
          <SectionTitle
            eyebrow="This week"
            title="Upcoming examinations"
            action={
              <button
                onClick={() => onNavigate("exams")}
                className="button-quiet inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold text-royal"
              >
                Full timetable <ArrowRight size={13} />
              </button>
            }
          />
          <div className="space-y-2">
            {data.examSchedule.length ? (
              data.examSchedule.slice(0, 3).map((exam, index) => (
              <div
                key={exam.code}
                className="flex items-center gap-3 rounded-xl border border-[#edf0f5] p-3 transition hover:border-[#cbd6ff] hover:bg-[#fbfcff]"
              >
                <div
                  className={cn(
                    "flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl text-center",
                    exam.color === "blue"
                      ? "bg-[#eef2ff] text-royal"
                      : exam.color === "purple"
                        ? "bg-[#f3efff] text-[#7653c9]"
                        : "bg-[#fff5e5] text-[#b77810]",
                  )}
                >
                  <span className="text-[9px] font-bold uppercase">Jun</span>
                  <span className="text-sm font-extrabold">
                    {exam.date.match(/\d+/)?.[0] || "—"}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-ink">
                    {exam.code} · {exam.title}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      <Clock3 size={11} /> {exam.time}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={11} /> {exam.venue}
                    </span>
                  </div>
                </div>
                <StatusPill tone={index === 0 ? "amber" : "slate"}>
                  {index === 0 ? "Soon" : "Upcoming"}
                </StatusPill>
              </div>
              ))
            ) : (
              <EmptyState
                icon={CalendarClock}
                title="No examinations scheduled"
                text="Your examination timetable will appear here when it is published."
              />
            )}
          </div>
        </section>
        <section className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
          <SectionTitle
            eyebrow="Stay informed"
            title="Recent announcements"
            action={
              <button
                onClick={() => onNavigate("announcements")}
                className="button-quiet inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold text-royal"
              >
                See all <ArrowRight size={13} />
              </button>
            }
          />
          <div className="space-y-4">
            {data.announcements.length ? (
              data.announcements.slice(0, 3).map((announcement, index) => (
              <button
                key={announcement.id}
                onClick={() => onNavigate("announcements")}
                className="group flex w-full items-start gap-3 text-left"
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                    index === 0
                      ? "bg-[#eef2ff] text-royal"
                      : index === 1
                        ? "bg-[#eaf8f1] text-[#198754]"
                        : "bg-[#fff5e5] text-[#b77810]",
                  )}
                >
                  <Megaphone size={15} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-bold text-ink group-hover:text-royal">
                    {announcement.title}
                  </span>
                  <span className="mt-1 block text-[10px] text-slate-400">
                    {announcement.date} · {announcement.tag}
                  </span>
                </span>
                <ChevronRight
                  size={14}
                  className="mt-1 shrink-0 text-slate-300 group-hover:text-royal"
                />
              </button>
              ))
            ) : (
              <EmptyState
                icon={Megaphone}
                title="No announcements yet"
                text="New university announcements will appear here."
              />
            )}
          </div>
        </section>
      </div>
      <section className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
        <SectionTitle
          eyebrow="Activity"
          title="Recent activity"
          action={
            <button
              onClick={() => onNavigate("notifications")}
              className="button-quiet inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold text-royal"
            >
              {unread} unread updates <ArrowRight size={13} />
            </button>
          }
        />
        <div className="grid gap-2 md:grid-cols-3">
          {data.registeredCodes.length || data.payments.length || data.results.length ? (
          [
            {
              icon: CheckCircle2,
              title: "Registration draft saved",
              detail: `${registered.length} courses · ${registeredUnits} credit units`,
              time: "Today, 10:42 AM",
              color: "text-[#198754] bg-[#eaf8f1]",
            },
            {
              icon: CreditCard,
              title: "Payment verified",
              detail: "₦150,000 tuition payment",
              time: "Yesterday, 4:16 PM",
              color: "text-royal bg-[#eef2ff]",
            },
            {
              icon: FileText,
              title: "Result published",
              detail: "Second semester results",
              time: "May 12, 2026",
              color: "text-[#7653c9] bg-[#f3efff]",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-center gap-3 rounded-xl bg-[#fafbfc] p-3"
            >
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                  item.color,
                )}
              >
                <item.icon size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-ink">
                  {item.title}
                </p>
                <p className="mt-0.5 truncate text-[10px] text-slate-400">
                  {item.detail}
                </p>
              </div>
              <span className="hidden text-right text-[9px] font-medium text-slate-400 lg:block">
                {item.time}
              </span>
            </div>
          ))
          ) : (
            <EmptyState
              icon={Activity}
              title="No recent activity"
              text="Your portal activity will appear here after records are added."
            />
          )}
        </div>
      </section>
    </div>
  );
}

function ProfilePage({
  profile,
  data,
  onNavigate,
}: {
  profile: Profile;
  data: PortalData;
  onNavigate: (page: PageKey) => void;
}) {
  return (
    <div className="page-enter space-y-5">
      <section className="gradient-hero overflow-hidden rounded-3xl p-6 text-white shadow-soft sm:p-8">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <Avatar name={profile.name} size="lg" />
          <div className="min-w-0 flex-1">
            <StatusPill tone="blue">
              <span className="bg-white/80 text-royal">Active student</span>
            </StatusPill>
            <h1 className="mt-3 text-2xl font-extrabold tracking-[-.04em] sm:text-3xl">
              {profile.name}
            </h1>
            <p className="mt-2 text-sm text-blue-100">
              {profile.department} · {profile.level}
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-blue-100">
              <span className="rounded-lg bg-white/10 px-2.5 py-1.5">
                {profile.matric}
              </span>
              <span className="rounded-lg bg-white/10 px-2.5 py-1.5">
                {data.session} session
              </span>
            </div>
          </div>
          <button
            onClick={() => onNavigate("settings")}
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/15"
          >
            <Settings2 size={14} /> Edit profile
          </button>
        </div>
      </section>
      <div className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
        <section className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
          <SectionTitle
            eyebrow="Student details"
            title="Personal information"
          />
          <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
            {[
              ["Full name", profile.name, UserRound],
              ["Matriculation number", profile.matric, FileText],
              ["Department", profile.department, GraduationCap],
              ["Faculty", profile.faculty, Building2],
              ["Email address", profile.email, Mail],
              ["Phone number", profile.phone, Phone],
            ].map(([label, value, Icon]) => (
              <div key={label as string}>
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[.11em] text-slate-400">
                  {label as string}
                </p>
                <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                  <Icon size={15} className="text-royal" />
                  {value as string}
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
          <SectionTitle eyebrow="Academic record" title="Your journey" />
          <div className="space-y-5">
            {[
              {
                label: "Current level",
                value: profile.level,
                detail: "Final year student",
                icon: GraduationCap,
              },
              {
                label: "Cumulative GPA",
                value: `${data.cgpa} / 5.00`,
                detail: "Top 10% of class",
                icon: Award,
              },
              {
                label: "Credits completed",
                value: `${data.creditsCompleted} / ${data.totalCredits}`,
                detail: `${data.totalCredits - data.creditsCompleted} units remaining`,
                icon: BookOpenCheck,
              },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef2ff] text-royal">
                  <item.icon size={18} />
                </span>
                <div className="flex-1">
                  <p className="text-[10px] font-semibold text-slate-400">
                    {item.label}
                  </p>
                  <p className="mt-0.5 text-sm font-extrabold text-ink">
                    {item.value}
                  </p>
                </div>
                <p className="text-right text-[10px] text-slate-400">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-xl border border-[#e6ebff] bg-[#f7f9ff] p-4">
            <p className="text-[10px] font-bold uppercase tracking-[.12em] text-royal">
              About me
            </p>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              {profile.bio}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="relative block">
      <Search
        size={15}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="form-input h-10 w-full rounded-xl border border-line bg-white pl-9 pr-3 text-xs text-ink placeholder:text-slate-400"
        placeholder={placeholder}
      />
    </label>
  );
}

function CourseRegistrationPage({
  registeredCodes,
  setRegisteredCodes,
  courses,
  search,
  showToast,
}: {
  registeredCodes: string[];
  setRegisteredCodes: (codes: string[]) => void;
  courses: Course[];
  search: string;
  showToast: (message: string) => void;
}) {
  const [localSearch, setLocalSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "registered" | "available">(
    "all",
  );
  const [confirmOpen, setConfirmOpen] = useState(false);
  const activeSearch = localSearch || search;
  const filtered = courses.filter((course) => {
    const matchesSearch = `${course.code} ${course.title} ${course.instructor}`
      .toLowerCase()
      .includes(activeSearch.toLowerCase());
    const registered = registeredCodes.includes(course.code);
    const matchesFilter =
      filter === "all" || (filter === "registered" ? registered : !registered);
    return matchesSearch && matchesFilter;
  });
  const totalUnits = courses
    .filter((course) => registeredCodes.includes(course.code))
    .reduce((sum, course) => sum + course.unit, 0);
  const toggleCourse = (code: string) =>
    setRegisteredCodes(
      registeredCodes.includes(code)
        ? registeredCodes.filter((item) => item !== code)
        : [...registeredCodes, code],
    );
  return (
    <div className="page-enter space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[.16em] text-royal">
            Second semester · 2025/2026
          </p>
          <h1 className="text-2xl font-extrabold tracking-[-.04em] text-ink">
            Course registration
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Select your courses for the semester and confirm when you&apos;re
            ready.
          </p>
        </div>
        <StatusPill tone="green">
          <CircleCheck size={13} /> Registration open
        </StatusPill>
      </div>
      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <section className="min-w-0 rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
          <div className="mb-5 flex flex-col gap-3 md:flex-row">
            <div className="flex-1">
              <SearchBar
                value={localSearch}
                onChange={setLocalSearch}
                placeholder="Search courses by code or name..."
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={15} className="text-slate-400" />
              <select
                value={filter}
                onChange={(event) =>
                  setFilter(event.target.value as typeof filter)
                }
                className="form-input h-10 rounded-xl border border-line bg-white px-3 text-xs font-semibold text-slate-600"
              >
                <option value="all">All courses</option>
                <option value="registered">Registered</option>
                <option value="available">Available</option>
              </select>
            </div>
          </div>
          <div className="table-scroll">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-line text-[10px] uppercase tracking-[.13em] text-slate-400">
                  <th className="pb-3 font-bold">Course</th>
                  <th className="pb-3 font-bold">Type</th>
                  <th className="pb-3 font-bold">Units</th>
                  <th className="pb-3 font-bold">Lecturer</th>
                  <th className="pb-3 text-right font-bold">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((course) => {
                  const isRegistered = registeredCodes.includes(course.code);
                  return (
                    <tr
                      key={course.code}
                      className="border-b border-[#f0f2f6] last:border-0"
                    >
                      <td className="py-4">
                        <p className="text-xs font-extrabold text-ink">
                          {course.code}
                        </p>
                        <p className="mt-1 text-[11px] text-slate-500">
                          {course.title}
                        </p>
                      </td>
                      <td className="py-4">
                        <StatusPill
                          tone={
                            course.type === "Core"
                              ? "blue"
                              : course.type === "Elective"
                                ? "purple"
                                : "slate"
                          }
                        >
                          {course.type}
                        </StatusPill>
                      </td>
                      <td className="py-4 text-xs font-bold text-ink">
                        {course.unit}
                      </td>
                      <td className="py-4 text-[11px] text-slate-500">
                        {course.instructor}
                      </td>
                      <td className="py-4 text-right">
                        {isRegistered ? (
                          <button
                            onClick={() => {
                              toggleCourse(course.code);
                              showToast(
                                `${course.code} removed from your draft.`,
                              );
                            }}
                            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[11px] font-bold text-[#c6374a] hover:bg-[#fff1f2]"
                          >
                            <Trash2 size={13} /> Remove
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              toggleCourse(course.code);
                              showToast(`${course.code} added to your draft.`);
                            }}
                            className="button-quiet inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[11px] font-bold text-royal"
                          >
                            <Plus size={14} /> Add course
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <EmptyState
                icon={Search}
                title="No courses found"
                text="Try another search or clear your filters."
                action={
                  <button
                    onClick={() => {
                      setLocalSearch("");
                      setFilter("all");
                    }}
                    className="text-xs font-bold text-royal"
                  >
                    Clear filters
                  </button>
                }
              />
            )}
          </div>
        </section>
        <aside className="space-y-5">
          <section className="rounded-2xl border border-line bg-white p-5 shadow-card">
            <SectionTitle
              eyebrow="Your selection"
              title="Registration summary"
            />
            <div className="mb-5 flex items-end justify-between">
              <div>
                <p className="text-3xl font-extrabold tracking-[-.05em] text-ink">
                  {registeredCodes.length}
                </p>
                <p className="text-[11px] text-slate-400">courses selected</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-extrabold tracking-[-.05em] text-royal">
                  {totalUnits}
                </p>
                <p className="text-[11px] text-slate-400">credit units</p>
              </div>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#eef1f7]">
              <div
                className="h-full rounded-full bg-royal"
                style={{ width: `${Math.min((totalUnits / 24) * 100, 100)}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-[10px] text-slate-400">
              <span>Minimum 15 units</span>
              <span>Maximum 24 units</span>
            </div>
            <button
              onClick={() => setConfirmOpen(true)}
              disabled={registeredCodes.length === 0}
              className="button-primary mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-royal px-4 py-3 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
            >
              Confirm registration <Check size={15} />
            </button>
            <p className="mt-3 text-center text-[10px] leading-4 text-slate-400">
              You can still edit your selection before confirming.
            </p>
          </section>
          <section className="rounded-2xl border border-[#e5eaff] bg-[#f7f9ff] p-5">
            <div className="mb-3 flex items-center gap-2">
              <ShieldCheck size={16} className="text-royal" />
              <p className="text-xs font-bold text-ink">Registration tip</p>
            </div>
            <p className="text-[11px] leading-5 text-slate-500">
              Make sure your selected courses do not clash with your timetable
              before final confirmation.
            </p>
          </section>
        </aside>
      </div>
      {confirmOpen && (
        <Modal
          title="Confirm course registration"
          onClose={() => setConfirmOpen(false)}
        >
          <p className="text-sm leading-6 text-slate-500">
            You are about to register{" "}
            <strong className="text-ink">
              {registeredCodes.length} courses
            </strong>{" "}
            totalling{" "}
            <strong className="text-ink">{totalUnits} credit units</strong>. You
            can contact your adviser if you need to make changes later.
          </p>
          <div className="mt-5 flex gap-2">
            <button
              onClick={() => setConfirmOpen(false)}
              className="button-quiet flex-1 rounded-xl border border-line px-4 py-2.5 text-xs font-bold text-slate-600"
            >
              Keep editing
            </button>
            <button
              onClick={() => {
                setConfirmOpen(false);
                showToast("Registration confirmed successfully.");
              }}
              className="button-primary flex-1 rounded-xl bg-royal px-4 py-2.5 text-xs font-bold text-white"
            >
              Confirm now
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function ResultTable({ results }: { results: Result[] }) {
  if (!results.length) {
    return (
      <EmptyState
        icon={GraduationCap}
        title="No academic results yet"
        text="Your academic results will appear here once they are published by the administrator."
      />
    );
  }
  return (
    <div className="table-scroll">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-line text-[10px] uppercase tracking-[.13em] text-slate-400">
            <th className="pb-3 font-bold">Course</th>
            <th className="pb-3 font-bold">Units</th>
            <th className="pb-3 font-bold">Grade</th>
            <th className="pb-3 font-bold">Grade point</th>
            <th className="pb-3 text-right font-bold">Status</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result) => (
            <tr
              key={result.code}
              className="border-b border-[#f0f2f6] last:border-0"
            >
              <td className="py-4">
                <p className="text-xs font-extrabold text-ink">{result.code}</p>
                <p className="mt-1 text-[11px] text-slate-500">
                  {result.title}
                </p>
              </td>
              <td className="py-4 text-xs font-semibold text-ink">
                {result.unit}
              </td>
              <td className="py-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#eaf8f1] text-xs font-extrabold text-[#198754]">
                  {result.grade}
                </span>
              </td>
              <td className="py-4 text-xs font-bold text-ink">
                {result.point.toFixed(1)}
              </td>
              <td className="py-4 text-right">
                <StatusPill tone="green">
                  <Check size={11} /> Passed
                </StatusPill>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ResultsPage({ data }: { data: PortalData }) {
  const weighted = data.results.reduce(
    (sum, item) => sum + item.unit * item.point,
    0,
  );
  const units = data.results.reduce((sum, item) => sum + item.unit, 0);
  const semesterGpa = units ? (weighted / units).toFixed(2) : "—";
  return (
    <div className="page-enter space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[.16em] text-royal">
            Academic record
          </p>
          <h1 className="text-2xl font-extrabold tracking-[-.04em] text-ink">
            Academic results
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Your current results and cumulative academic performance.
          </p>
        </div>
        <button className="button-quiet inline-flex w-fit items-center gap-2 rounded-xl border border-line px-3.5 py-2.5 text-xs font-bold text-slate-600">
          <Download size={14} /> Download transcript
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <DashboardCard
          icon={TrendingUp}
          label="Semester GPA"
          value={semesterGpa}
          detail="Second semester · 2025/2026"
          tone="blue"
        />
        <DashboardCard
          icon={Award}
          label="Cumulative GPA"
          value={data.cgpa ? `${data.cgpa} / 5.00` : "—"}
          detail={data.cgpa ? "Awaiting current standing" : "Not published yet"}
          tone="green"
        />
        <DashboardCard
          icon={BookOpenCheck}
          label="Total credits"
          value={`${data.creditsCompleted} units`}
          detail={
            data.totalCredits
              ? `${data.totalCredits - data.creditsCompleted} units remaining`
              : "Not set yet"
          }
          tone="purple"
        />
      </div>
      <section className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <SectionTitle
            eyebrow="Current semester"
            title="Second semester results"
          />
          <StatusPill tone="green">
            <CircleCheck size={12} /> Published May 12, 2026
          </StatusPill>
        </div>
        <ResultTable results={data.results} />
        <div className="mt-5 grid gap-3 rounded-xl bg-[#f8f9fc] p-4 text-xs sm:grid-cols-3">
          <div>
            <p className="text-[10px] text-slate-400">Registered units</p>
            <p className="mt-1 font-extrabold text-ink">{units} units</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400">Quality points</p>
            <p className="mt-1 font-extrabold text-ink">
              {weighted.toFixed(1)}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400">Academic standing</p>
            <p className="mt-1 font-extrabold text-[#198754]">Good standing</p>
          </div>
        </div>
      </section>
      <section className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
        <SectionTitle eyebrow="Progress over time" title="GPA history" />
        <div className="grid gap-3 sm:grid-cols-4">
          {[
            { term: "Year 1", value: "3.70", width: 74 },
            { term: "Year 2", value: "4.10", width: 82 },
            { term: "Year 3", value: "4.34", width: 87 },
            { term: "Year 4", value: "4.52", width: 91 },
          ].map((item) => (
            <div
              key={item.term}
              className="rounded-xl border border-[#edf0f5] p-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-slate-400">
                  {item.term}
                </span>
                <span className="text-xs font-extrabold text-ink">
                  {item.value}
                </span>
              </div>
              <div className="mt-3 h-1.5 rounded-full bg-[#eef1f7]">
                <div
                  className="h-full rounded-full bg-royal"
                  style={{ width: `${item.width}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function TimetablePage({ data }: { data: PortalData }) {
  const classItems = data.timetable.flatMap((day) => day.items);
  return (
    <div className="page-enter space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[.16em] text-royal">
            Week 08 · May 18 – 22
          </p>
          <h1 className="text-2xl font-extrabold tracking-[-.04em] text-ink">
            Class timetable
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Your weekly class schedule for the current semester.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="button-quiet rounded-xl border border-line p-2.5 text-slate-500"
            aria-label="Previous week"
          >
            <ArrowLeft size={15} />
          </button>
          <button className="button-quiet rounded-xl border border-line px-3.5 py-2.5 text-xs font-bold text-slate-600">
            Today
          </button>
          <button
            className="button-quiet rounded-xl border border-line p-2.5 text-slate-500"
            aria-label="Next week"
          >
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
      <section className="rounded-2xl border border-line bg-white p-4 shadow-card sm:p-6">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-royal" />
            <p className="text-xs font-bold text-ink">
              Second semester schedule
            </p>
          </div>
          <button className="button-quiet inline-flex items-center gap-2 rounded-lg px-2 py-1 text-[11px] font-bold text-royal">
            <Download size={13} /> Export
          </button>
        </div>
        <div className="grid gap-3 md:grid-cols-5">
          {data.timetable.length ? (
            data.timetable.map((day, dayIndex) => (
            <div key={day.day} className="min-w-0">
              <div
                className={cn(
                  "mb-3 rounded-xl px-3 py-2.5",
                  dayIndex === 1 ? "bg-[#eef2ff]" : "bg-[#f7f8fb]",
                )}
              >
                <p
                  className={cn(
                    "text-xs font-extrabold",
                    dayIndex === 1 ? "text-royal" : "text-ink",
                  )}
                >
                  {day.day}
                </p>
                <p className="mt-0.5 text-[10px] text-slate-400">
                  May {18 + dayIndex}
                </p>
              </div>
              <div className="space-y-3">
                {day.items.map((item) => (
                  <div
                    key={`${day.day}${item.code}${item.time}`}
                    className={cn(
                      "rounded-xl border-l-[3px] bg-[#fafbfc] p-3",
                      item.tone === "blue"
                        ? "border-l-royal"
                        : item.tone === "purple"
                          ? "border-l-[#7653c9]"
                          : item.tone === "orange"
                            ? "border-l-[#e7a138]"
                            : item.tone === "green"
                              ? "border-l-[#49a879]"
                              : "border-l-[#d060a5]",
                    )}
                  >
                    <p className="text-[10px] font-bold text-slate-400">
                      {item.time}
                    </p>
                    <p className="mt-2 text-[11px] font-extrabold leading-4 text-ink">
                      {item.code}
                    </p>
                    <p className="mt-1 text-[10px] leading-4 text-slate-500">
                      {item.title}
                    </p>
                    <div className="mt-3 flex items-center gap-1 text-[9px] font-medium text-slate-400">
                      <MapPin size={10} /> {item.room}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            ))
          ) : (
            <div className="md:col-span-5">
              <EmptyState
                icon={CalendarDays}
                title="No class timetable yet"
                text="Your class schedule will appear here when it is added by the administrator."
              />
            </div>
          )}
        </div>
      </section>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-line bg-white p-4 shadow-card">
          <p className="text-[10px] font-bold uppercase tracking-[.12em] text-slate-400">
            Classes this week
          </p>
          <p className="mt-2 text-2xl font-extrabold text-ink">
            {classItems.length || "—"}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            {classItems.length ? "Scheduled classes" : "No classes scheduled"}
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-4 shadow-card">
          <p className="text-[10px] font-bold uppercase tracking-[.12em] text-slate-400">
            Study blocks
          </p>
          <p className="mt-2 text-2xl font-extrabold text-ink">—</p>
          <p className="mt-1 text-[11px] text-slate-400">
            Study plan not set
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-4 shadow-card">
          <p className="text-[10px] font-bold uppercase tracking-[.12em] text-slate-400">
            Next class
          </p>
          <p className="mt-2 text-2xl font-extrabold text-ink">
            {classItems[0] ? classItems[0].time : "—"}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">CSC 403 · 11:00 AM</p>
        </div>
      </div>
    </div>
  );
}

function ExamsPage({ data }: { data: PortalData }) {
  return (
    <div className="page-enter space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[.16em] text-royal">
            Second semester · 2025/2026
          </p>
          <h1 className="text-2xl font-extrabold tracking-[-.04em] text-ink">
            Examination timetable
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Your examination schedule, venues and preparation checklist.
          </p>
        </div>
        <StatusPill tone={data.examSchedule.length ? "amber" : "slate"}>
          <Clock3 size={12} />
          {data.examSchedule.length
            ? "Upcoming examination"
            : "No examinations scheduled"}
        </StatusPill>
      </div>
      <section className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
        <SectionTitle
          eyebrow="Upcoming papers"
          title="June 2026 examination schedule"
          action={
            <button className="button-quiet inline-flex items-center gap-2 rounded-lg px-2 py-1 text-[11px] font-bold text-royal">
              <Download size={13} /> Download PDF
            </button>
          }
        />
        <div className="space-y-3">
          {data.examSchedule.length ? (
            data.examSchedule.map((exam, index) => (
            <div
              key={exam.code}
              className="grid gap-4 rounded-2xl border border-[#edf0f5] p-4 transition hover:border-[#cbd6ff] hover:shadow-sm md:grid-cols-[112px_1fr_auto] md:items-center"
            >
              <div
                className={cn(
                  "flex h-[72px] items-center justify-center rounded-xl text-center",
                  exam.color === "blue"
                    ? "bg-[#eef2ff] text-royal"
                    : exam.color === "purple"
                      ? "bg-[#f3efff] text-[#7653c9]"
                      : exam.color === "orange"
                        ? "bg-[#fff5e5] text-[#b77810]"
                        : "bg-[#eaf8f1] text-[#198754]",
                )}
              >
                <div>
                  <p className="text-[10px] font-bold uppercase">June</p>
                  <p className="text-2xl font-extrabold tracking-[-.05em]">
                    {[8, 10, 12, 16][index]}
                  </p>
                  <p className="text-[10px] font-semibold">2026</p>
                </div>
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-extrabold text-ink">
                    {exam.code} · {exam.title}
                  </p>
                  <StatusPill tone={index === 0 ? "amber" : "slate"}>
                    {index === 0 ? "Next up" : "Scheduled"}
                  </StatusPill>
                </div>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-slate-500">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 size={13} className="text-slate-400" /> {exam.time}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={13} className="text-slate-400" /> {exam.venue}
                  </span>
                </div>
              </div>
              <button className="button-quiet inline-flex items-center justify-center gap-1 rounded-lg px-2.5 py-2 text-[11px] font-bold text-royal md:justify-self-end">
                <CalendarDays size={14} /> Add to calendar
              </button>
            </div>
            ))
          ) : (
            <EmptyState
              icon={CalendarClock}
              title="No examination timetable yet"
              text="Your exam schedule will appear here when it is published by the administrator."
            />
          )}
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-[#e5eaff] bg-[#f7f9ff] p-5">
          <ShieldCheck size={19} className="text-royal" />
          <p className="mt-3 text-sm font-extrabold text-ink">
            Before your exam
          </p>
          <p className="mt-1 text-[11px] leading-5 text-slate-500">
            Arrive 30 minutes early with your student ID and permitted
            materials.
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
          <FileText size={19} className="text-[#7653c9]" />
          <p className="mt-3 text-sm font-extrabold text-ink">
            Exam regulations
          </p>
          <p className="mt-1 text-[11px] leading-5 text-slate-500">
            Review the latest exam conduct guidelines before your first paper.
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
          <Send size={19} className="text-[#198754]" />
          <p className="mt-3 text-sm font-extrabold text-ink">Need support?</p>
          <p className="mt-1 text-[11px] leading-5 text-slate-500">
            Contact your department adviser if you spot a timetable conflict.
          </p>
        </div>
      </section>
    </div>
  );
}

function FeesPage({
  data,
  onNavigate,
}: {
  data: PortalData;
  onNavigate: (page: PageKey) => void;
}) {
  const feeItems = data.fees;
  const totalFees = feeItems.reduce((sum, fee) => sum + fee.amount, 0);
  const paidFees = feeItems.reduce((sum, fee) => sum + fee.paid, 0);
  const outstandingFees = totalFees - paidFees;
  const paymentProgress = totalFees
    ? Math.round((paidFees / totalFees) * 100)
    : 0;
  return (
    <div className="page-enter space-y-5">
      <div>
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[.16em] text-royal">
          Finance · 2025/2026
        </p>
        <h1 className="text-2xl font-extrabold tracking-[-.04em] text-ink">
          School fees
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Review your fee breakdown and keep your account in good standing.
        </p>
      </div>
      <section className="gradient-hero overflow-hidden rounded-3xl p-6 text-white shadow-soft sm:p-8">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold text-blue-100">
              Outstanding balance
            </p>
            <p className="mt-2 text-4xl font-extrabold tracking-[-.06em]">
              ₦{outstandingFees.toLocaleString()}
            </p>
            <p className="mt-2 text-[11px] text-blue-100">
              {feeItems.length
                ? `Payment progress · ${paymentProgress}% paid`
                : "No fee assessment has been added yet"}
            </p>
          </div>
          <div className="w-full sm:max-w-[230px]">
            <div className="mb-2 flex justify-between text-[10px] font-semibold text-blue-100">
              <span>Payment progress</span>
              <span>{paymentProgress}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-white"
                style={{ width: `${paymentProgress}%` }}
              />
            </div>
            <button
              onClick={() => onNavigate("payments")}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-ink"
            >
              View payment history <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>
      <div className="grid gap-5 lg:grid-cols-[1fr_310px]">
        <section className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <SectionTitle eyebrow="Account statement" title="Fee breakdown" />
            <StatusPill tone={feeItems.length ? "amber" : "slate"}>
              <CircleAlert size={12} />
              {feeItems.length ? "Payment status pending" : "No fees assessed"}
            </StatusPill>
          </div>
          <div className="space-y-1">
            {feeItems.length ? (
              feeItems.map((fee) => (
              <div
                key={fee.label}
                className="flex items-center justify-between border-b border-[#f0f2f6] py-4 last:border-0"
              >
                <div>
                  <p className="text-xs font-bold text-ink">{fee.label}</p>
                  <p className="mt-1 text-[10px] text-slate-400">
                    Paid ₦{fee.paid.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-extrabold text-ink">
                    ₦{fee.amount.toLocaleString()}
                  </p>
                  <p
                    className={cn(
                      "mt-1 text-[10px] font-semibold",
                      fee.paid >= fee.amount
                        ? "text-[#198754]"
                        : "text-[#b77810]",
                    )}
                  >
                    {fee.paid >= fee.amount
                      ? "Paid in full"
                      : `Balance ₦${(fee.amount - fee.paid).toLocaleString()}`}
                  </p>
                </div>
              </div>
              ))
            ) : (
              <EmptyState
                icon={WalletCards}
                title="No school fees yet"
                text="Your fee breakdown will appear here when it is added by the administrator."
              />
            )}
          </div>
          <div className="mt-4 flex items-center justify-between rounded-xl bg-[#f7f8fc] p-4">
            <span className="text-xs font-bold text-ink">
              Total assessed fees
            </span>
            <span className="text-lg font-extrabold tracking-[-.03em] text-ink">
              ₦{totalFees.toLocaleString()}
            </span>
          </div>
        </section>
        <aside className="space-y-5">
          <section className="rounded-2xl border border-line bg-white p-5 shadow-card">
            <SectionTitle eyebrow="Payment options" title="Make a payment" />
            <p className="text-[11px] leading-5 text-slate-500">
              Pay your outstanding balance securely with your preferred payment
              method.
            </p>
            <button
              onClick={() => onNavigate("payments")}
              className="button-primary mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-royal px-4 py-3 text-xs font-bold text-white"
            >
              <CreditCard size={15} /> Continue to payment
            </button>
          </section>
          <section className="rounded-2xl border border-line bg-white p-5 shadow-card">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-slate-400" />
              <p className="text-xs font-bold text-ink">Need an invoice?</p>
            </div>
            <p className="mt-2 text-[11px] leading-5 text-slate-500">
              Download a statement for your records or scholarship application.
            </p>
            <button className="button-quiet mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold text-royal">
              <ArrowDownToLine size={13} /> Download statement
            </button>
          </section>
        </aside>
      </div>
    </div>
  );
}

function PaymentsPage({ data }: { data: PortalData }) {
  const payments = data.payments;
  const lastPayment = payments[0];
  const totalPaid = payments
    .filter((payment) => payment.status === "Verified")
    .reduce((sum, payment) => sum + payment.amount, 0);
  return (
    <div className="page-enter space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[.16em] text-royal">
            Finance · Account history
          </p>
          <h1 className="text-2xl font-extrabold tracking-[-.04em] text-ink">
            Payment history
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Every payment and verification, neatly recorded.
          </p>
        </div>
        <button className="button-quiet inline-flex w-fit items-center gap-2 rounded-xl border border-line px-3.5 py-2.5 text-xs font-bold text-slate-600">
          <Download size={14} /> Export history
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <DashboardCard
          icon={CircleDollarSign}
          label="Total paid"
          value={`₦${totalPaid.toLocaleString()}`}
          detail={`Across ${payments.length} transaction${payments.length === 1 ? "" : "s"}`}
          tone="green"
        />
        <DashboardCard
          icon={Clock3}
          label="Last payment"
          value={lastPayment?.date || "—"}
          detail={
            lastPayment
              ? `${lastPayment.type} · ₦${lastPayment.amount.toLocaleString()}`
              : "No payments recorded"
          }
          tone="blue"
        />
        <DashboardCard
          icon={ShieldCheck}
          label="Account status"
          value={payments.length ? "In good standing" : "No payment history"}
          detail={payments.length ? "Payment records available" : "Not set yet"}
          tone="purple"
        />
      </div>
      <section className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
        <SectionTitle
          eyebrow="Transactions"
          title="Recent payments"
          action={
            <select
              className="form-input h-9 rounded-lg border border-line bg-white px-2.5 text-[11px] font-semibold text-slate-500"
              defaultValue="all"
            >
              <option value="all">All years</option>
              <option>2026</option>
              <option>2025</option>
            </select>
          }
        />
        <div className="table-scroll">
          {payments.length ? (
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-line text-[10px] uppercase tracking-[.13em] text-slate-400">
                <th className="pb-3 font-bold">Date</th>
                <th className="pb-3 font-bold">Description</th>
                <th className="pb-3 font-bold">Reference</th>
                <th className="pb-3 font-bold">Amount</th>
                <th className="pb-3 text-right font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr
                  key={payment.ref}
                  className="border-b border-[#f0f2f6] last:border-0"
                >
                  <td className="py-4 text-xs font-semibold text-ink">
                    {payment.date}
                  </td>
                  <td className="py-4">
                    <p className="text-xs font-bold text-ink">{payment.type}</p>
                    <p className="mt-1 text-[10px] text-slate-400">
                      Bank transfer
                    </p>
                  </td>
                  <td className="py-4 text-[11px] font-medium text-slate-500">
                    {payment.ref}
                  </td>
                  <td className="py-4 text-xs font-extrabold text-ink">
                    ₦{payment.amount.toLocaleString()}
                  </td>
                  <td className="py-4 text-right">
                    <StatusPill
                      tone={
                        payment.status === "Verified"
                          ? "green"
                          : payment.status === "Pending"
                            ? "amber"
                            : "red"
                      }
                    >
                      {payment.status === "Verified" ? (
                        <Check size={11} />
                      ) : (
                        <CircleAlert size={11} />
                      )}{" "}
                      {payment.status}
                    </StatusPill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          ) : (
            <EmptyState
              icon={ReceiptText}
              title="No payment history yet"
              text="Payment records will appear here after they are added or verified."
            />
          )}
        </div>
      </section>
    </div>
  );
}

function NotificationsPage({
  notices,
  setNotices,
}: {
  notices: Notice[];
  setNotices: (notices: Notice[]) => void;
}) {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const visible = notices.filter((notice) => filter === "all" || !notice.read);
  const markAll = () =>
    setNotices(notices.map((notice) => ({ ...notice, read: true })));
  const toggleRead = (id: number) =>
    setNotices(
      notices.map((notice) =>
        notice.id === id ? { ...notice, read: !notice.read } : notice,
      ),
    );
  return (
    <div className="page-enter space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[.16em] text-royal">
            Your inbox
          </p>
          <h1 className="text-2xl font-extrabold tracking-[-.04em] text-ink">
            Notifications
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Important updates, reminders and activity from your portal.
          </p>
        </div>
        <button
          onClick={markAll}
          className="button-quiet inline-flex w-fit items-center gap-2 rounded-xl border border-line px-3.5 py-2.5 text-xs font-bold text-slate-600"
        >
          <CheckCircle2 size={14} /> Mark all as read
        </button>
      </div>
      <section className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex gap-1 rounded-xl bg-[#f6f7fb] p-1">
            <button
              onClick={() => setFilter("all")}
              className={cn(
                "rounded-lg px-3 py-1.5 text-[11px] font-bold",
                filter === "all"
                  ? "bg-white text-ink shadow-sm"
                  : "text-slate-400",
              )}
            >
              All ({notices.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={cn(
                "rounded-lg px-3 py-1.5 text-[11px] font-bold",
                filter === "unread"
                  ? "bg-white text-ink shadow-sm"
                  : "text-slate-400",
              )}
            >
              Unread ({notices.filter((notice) => !notice.read).length})
            </button>
          </div>
          <BellRing size={18} className="text-slate-300" />
        </div>
        <div className="divide-y divide-[#f0f2f6]">
          {visible.map((notice) => (
            <button
              key={notice.id}
              onClick={() => toggleRead(notice.id)}
              className={cn(
                "flex w-full items-start gap-3 py-4 text-left transition first:pt-2 last:pb-2",
                !notice.read && "bg-[#fafbff]",
              )}
            >
              <span
                className={cn(
                  "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                  notice.type === "academic"
                    ? "bg-[#eef2ff] text-royal"
                    : notice.type === "finance"
                      ? "bg-[#eaf8f1] text-[#198754]"
                      : "bg-[#fff5e5] text-[#b77810]",
                )}
              >
                {notice.type === "academic" ? (
                  <BookOpenCheck size={17} />
                ) : notice.type === "finance" ? (
                  <CreditCard size={17} />
                ) : (
                  <Megaphone size={17} />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-xs font-bold",
                      notice.read ? "text-slate-600" : "text-ink",
                    )}
                  >
                    {notice.title}
                  </span>
                  {!notice.read && (
                    <span className="h-1.5 w-1.5 rounded-full bg-royal" />
                  )}
                </span>
                <span className="mt-1 block text-[11px] leading-5 text-slate-500">
                  {notice.body}
                </span>
                <span className="mt-1.5 block text-[10px] text-slate-400">
                  {notice.time}
                </span>
              </span>
              <span className="mt-1 rounded-lg p-1.5 text-slate-300 hover:bg-[#f1f4fb] hover:text-royal">
                <Eye size={15} />
              </span>
            </button>
          ))}
          {visible.length === 0 && (
            <EmptyState
              icon={Bell}
              title="You are all caught up"
              text="There are no unread notifications right now."
            />
          )}
        </div>
      </section>
    </div>
  );
}

function AnnouncementsPage({
  search,
  announcements,
}: {
  search: string;
  announcements: Announcement[];
}) {
  const [localSearch, setLocalSearch] = useState("");
  const [tag, setTag] = useState("All");
  const activeSearch = localSearch || search;
  const tags = [
    "All",
    "Academic",
    "Opportunity",
    "Campus life",
    "Wellbeing",
    "Faculty",
  ];
  const filtered = announcements.filter(
    (item) =>
      `${item.title} ${item.excerpt} ${item.tag}`
        .toLowerCase()
        .includes(activeSearch.toLowerCase()) &&
      (tag === "All" || item.tag === tag),
  );
  const featured = filtered.find((item) => item.featured);
  const rest = filtered.filter((item) => item.id !== featured?.id);
  return (
    <div className="page-enter space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[.16em] text-royal">
            Northbridge news
          </p>
          <h1 className="text-2xl font-extrabold tracking-[-.04em] text-ink">
            Announcements
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            The latest updates from your faculty and university community.
          </p>
        </div>
        <div className="w-full sm:w-60">
          <SearchBar
            value={localSearch}
            onChange={setLocalSearch}
            placeholder="Search announcements..."
          />
        </div>
      </div>
      <div className="scrollbar-thin flex gap-2 overflow-x-auto pb-1">
        {tags.map((item) => (
          <button
            key={item}
            onClick={() => setTag(item)}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-2 text-[11px] font-bold",
              tag === item
                ? "bg-ink text-white"
                : "border border-line bg-white text-slate-500 hover:text-ink",
            )}
          >
            {item}
          </button>
        ))}
      </div>
      {featured && (
        <section className="gradient-hero overflow-hidden rounded-3xl p-6 text-white shadow-soft sm:p-8">
          <div className="max-w-2xl">
            <StatusPill tone="blue">
              <Megaphone size={12} /> Featured announcement
            </StatusPill>
            <h2 className="mt-4 text-2xl font-extrabold leading-tight tracking-[-.04em] sm:text-3xl">
              {featured.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-blue-100">
              {featured.excerpt}
            </p>
            <div className="mt-5 flex items-center gap-3 text-[11px] text-blue-100">
              <span>{featured.date}</span>
              <span className="h-1 w-1 rounded-full bg-blue-200" />
              <span>{featured.tag}</span>
            </div>
          </div>
        </section>
      )}
      {rest.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {rest.map((item) => (
            <AnnouncementCard key={item.id} announcement={item} />
          ))}
        </div>
      ) : (
        !featured && (
          <EmptyState
            icon={Megaphone}
            title="No announcements found"
            text="Try another search or topic."
            action={
              <button
                onClick={() => {
                  setLocalSearch("");
                  setTag("All");
                }}
                className="text-xs font-bold text-royal"
              >
                Clear filters
              </button>
            }
          />
        )
      )}
    </div>
  );
}

function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  return (
    <article className="group rounded-2xl border border-line bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-lg bg-[#eef2ff] px-2.5 py-1.5 text-[10px] font-bold text-royal">
          {announcement.tag}
        </span>
        <button
          className="button-quiet rounded-lg p-1.5 text-slate-300"
          aria-label="Open announcement"
        >
          <ArrowUpRight size={16} />
        </button>
      </div>
      <h2 className="mt-5 text-sm font-extrabold leading-5 text-ink group-hover:text-royal">
        {announcement.title}
      </h2>
      <p className="mt-2 text-xs leading-5 text-slate-500">
        {announcement.excerpt}
      </p>
      <div className="mt-5 flex items-center justify-between border-t border-[#f0f2f6] pt-4 text-[10px] text-slate-400">
        <span>{announcement.date}</span>
        <span className="font-bold text-royal">
          Read more <ArrowRight size={11} className="ml-0.5 inline" />
        </span>
      </div>
    </article>
  );
}

function SettingsPage({
  profile,
  setProfile,
  showToast,
}: {
  profile: Profile;
  setProfile: (profile: Profile) => void;
  showToast: (message: string) => void;
}) {
  const [form, setForm] = useState(profile);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [reminders, setReminders] = useState(true);
  useEffect(() => setForm(profile), [profile]);
  const update = (key: keyof Profile, value: string) =>
    setForm({ ...form, [key]: value });
  const save = () => {
    setProfile(form);
    showToast("Your profile settings have been saved.");
  };
  return (
    <div className="page-enter space-y-5">
      <div>
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[.16em] text-royal">
          Account preferences
        </p>
        <h1 className="text-2xl font-extrabold tracking-[-.04em] text-ink">
          Settings
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Personalize your portal experience and keep your contact information
          current.
        </p>
      </div>
      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <section className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
          <SectionTitle
            eyebrow="Profile details"
            title="Personal information"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Full name"
              value={form.name}
              onChange={(value) => update("name", value)}
            />
            <FormField
              label="Email address"
              value={form.email}
              onChange={(value) => update("email", value)}
              type="email"
            />
            <FormField
              label="Phone number"
              value={form.phone}
              onChange={(value) => update("phone", value)}
            />
            <FormField
              label="Department"
              value={form.department}
              onChange={(value) => update("department", value)}
            />
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-[.11em] text-slate-400">
                About me
                <textarea
                  value={form.bio}
                  onChange={(event) => update("bio", event.target.value)}
                  rows={3}
                  className="form-input mt-2 w-full resize-none rounded-xl border border-line bg-white px-3 py-2.5 text-xs text-ink"
                />
              </label>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={save}
              className="button-primary inline-flex items-center gap-2 rounded-xl bg-royal px-4 py-2.5 text-xs font-bold text-white"
            >
              <Check size={14} /> Save changes
            </button>
          </div>
        </section>
        <aside className="space-y-5">
          <section className="rounded-2xl border border-line bg-white p-5 shadow-card">
            <SectionTitle eyebrow="Preferences" title="Notifications" />
            <div className="space-y-4">
              <ToggleRow
                label="Email updates"
                detail="Announcements and academic news"
                value={emailUpdates}
                onChange={setEmailUpdates}
              />
              <ToggleRow
                label="Due date reminders"
                detail="Fees, exams and registrations"
                value={reminders}
                onChange={setReminders}
              />
            </div>
          </section>
          <section className="rounded-2xl border border-[#e5eaff] bg-[#f7f9ff] p-5">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-royal" />
              <p className="text-xs font-bold text-ink">Your data is private</p>
            </div>
            <p className="mt-2 text-[11px] leading-5 text-slate-500">
              This portfolio demo stores changes locally on your device only.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block text-[10px] font-bold uppercase tracking-[.11em] text-slate-400">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="form-input mt-2 h-11 w-full rounded-xl border border-line bg-white px-3 text-xs font-medium normal-case tracking-normal text-ink"
      />
    </label>
  );
}

function ToggleRow({
  label,
  detail,
  value,
  onChange,
}: {
  label: string;
  detail: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-xs font-bold text-ink">{label}</p>
        <p className="mt-1 text-[10px] leading-4 text-slate-400">{detail}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!value)}
        aria-label={`Toggle ${label}`}
        className={cn(
          "relative h-6 w-11 rounded-full transition",
          value ? "bg-royal" : "bg-slate-200",
        )}
      >
        <span
          className={cn(
            "absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition",
            value ? "left-6" : "left-1",
          )}
        />
      </button>
    </div>
  );
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/35 p-4 backdrop-blur-sm">
      <div
        className="w-full max-w-md rounded-2xl border border-line bg-white p-5 shadow-2xl sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg font-extrabold tracking-[-.03em] text-ink">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="button-quiet rounded-lg p-1.5 text-slate-400"
            aria-label="Close dialog"
          >
            <X size={17} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  text,
  action,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f1f4fb] text-slate-400">
        <Icon size={22} />
      </span>
      <p className="mt-4 text-sm font-bold text-ink">{title}</p>
      <p className="mt-1 max-w-xs text-xs leading-5 text-slate-400">{text}</p>
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

type AdminSection =
  | "overview"
  | "students"
  | "profile"
  | "courses"
  | "results"
  | "timetable"
  | "exams"
  | "fees"
  | "payments"
  | "notifications"
  | "announcements";

function AdminInput({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block text-[10px] font-bold uppercase tracking-[.1em] text-slate-400">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="form-input mt-2 h-10 w-full rounded-xl border border-line bg-white px-3 text-xs font-medium normal-case tracking-normal text-ink"
      />
    </label>
  );
}

function AdminTextarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-[10px] font-bold uppercase tracking-[.1em] text-slate-400">
      {label}
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={3}
        className="form-input mt-2 w-full resize-none rounded-xl border border-line bg-white px-3 py-2.5 text-xs font-medium normal-case tracking-normal text-ink"
      />
    </label>
  );
}

function AdminPanel({
  data,
  students,
  selectedStudentId,
  onSelectStudent,
  onUpdate,
  onLogout,
  showToast,
}: {
  data: PortalData;
  students: StudentAccount[];
  selectedStudentId: string | null;
  onSelectStudent: (id: string) => void;
  onUpdate: (patch: Partial<PortalData>) => void;
  onLogout: () => void;
  showToast: (message: string) => void;
}) {
  const [section, setSection] = useState<AdminSection>("overview");
  const [scheduleTab, setScheduleTab] = useState<"classes" | "exams">(
    "classes",
  );
  const updateCourse = (index: number, patch: Partial<Course>) =>
    onUpdate({
      courses: data.courses.map((course, itemIndex) =>
        itemIndex === index ? { ...course, ...patch } : course,
      ),
    });
  const updateResult = (index: number, patch: Partial<Result>) =>
    onUpdate({
      results: data.results.map((result, itemIndex) =>
        itemIndex === index ? { ...result, ...patch } : result,
      ),
    });
  const updateFee = (index: number, patch: Partial<FeeItem>) =>
    onUpdate({
      fees: data.fees.map((fee, itemIndex) =>
        itemIndex === index ? { ...fee, ...patch } : fee,
      ),
    });
  const updatePayment = (index: number, patch: Partial<Payment>) =>
    onUpdate({
      payments: data.payments.map((payment, itemIndex) =>
        itemIndex === index ? { ...payment, ...patch } : payment,
      ),
    });
  const updateNotice = (index: number, patch: Partial<Notice>) =>
    onUpdate({
      notices: data.notices.map((notice, itemIndex) =>
        itemIndex === index ? { ...notice, ...patch } : notice,
      ),
    });
  const updateAnnouncement = (index: number, patch: Partial<Announcement>) =>
    onUpdate({
      announcements: data.announcements.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    });
  const updateDay = (index: number, patch: Partial<TimetableDay>) =>
    onUpdate({
      timetable: data.timetable.map((day, dayIndex) =>
        dayIndex === index ? { ...day, ...patch } : day,
      ),
    });
  const updateClass = (
    dayIndex: number,
    itemIndex: number,
    patch: Partial<TimetableItem>,
  ) =>
    onUpdate({
      timetable: data.timetable.map((day, index) =>
        index === dayIndex
          ? {
              ...day,
              items: day.items.map((item, childIndex) =>
                childIndex === itemIndex ? { ...item, ...patch } : item,
              ),
            }
          : day,
      ),
    });
  const updateExam = (index: number, patch: Partial<Exam>) =>
    onUpdate({
      examSchedule: data.examSchedule.map((exam, itemIndex) =>
        itemIndex === index ? { ...exam, ...patch } : exam,
      ),
    });
  const totalFees = data.fees.reduce((sum, fee) => sum + fee.amount, 0);
  const paidFees = data.fees.reduce((sum, fee) => sum + fee.paid, 0);
  const unread = data.notices.filter((notice) => !notice.read).length;
  const adminNav: { key: AdminSection; label: string; icon: LucideIcon }[] = [
    { key: "overview", label: "Overview", icon: LayoutDashboard },
    { key: "students", label: "Student directory", icon: Users },
    { key: "profile", label: "Student profile", icon: UserRound },
    { key: "courses", label: "Courses", icon: BookOpenCheck },
    { key: "results", label: "Results & GPA", icon: GraduationCap },
    { key: "timetable", label: "Class timetable", icon: CalendarDays },
    { key: "exams", label: "Exam timetable", icon: CalendarClock },
    { key: "fees", label: "School fees", icon: WalletCards },
    { key: "payments", label: "Payment history", icon: ReceiptText },
    { key: "notifications", label: "Notifications", icon: Bell },
    { key: "announcements", label: "Announcements", icon: Megaphone },
  ];
  const title =
    adminNav.find((item) => item.key === section)?.label || "Overview";
  const selectedStudent = students.find(
    (student) => student.id === selectedStudentId,
  );
  const open = (next: AdminSection) => setSection(next);

  const renderEditor = () => {
    if (section === "students")
      return (
        <section className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
          <SectionTitle
            eyebrow="Student management"
            title="Student directory"
            action={
              <StatusPill tone="blue">
                <Users size={12} /> {students.length} accounts
              </StatusPill>
            }
          />
          <p className="mb-5 max-w-2xl text-xs leading-5 text-slate-500">
            Choose a student to open their personal record. Every edit made in
            the sections below belongs only to that selected student.
          </p>
          {students.length ? (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {students.map((student) => {
                const studentFees = student.data.fees.reduce(
                  (sum, fee) => sum + fee.amount - fee.paid,
                  0,
                );
                const isSelected = selectedStudentId === student.id;
                return (
                  <div
                    key={student.id}
                    className={cn(
                      "rounded-2xl border p-4 transition",
                      isSelected
                        ? "border-royal bg-[#f7f9ff] shadow-sm"
                        : "border-[#edf0f5] bg-white hover:border-[#cdd6f7] hover:shadow-sm",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#eef2ff] text-sm font-extrabold text-royal">
                        {student.data.profile.name
                          .split(" ")
                          .map((part) => part[0])
                          .join("")
                          .slice(0, 2)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-extrabold text-ink">
                          {student.data.profile.name}
                        </p>
                        <p className="mt-1 truncate text-[11px] text-slate-400">
                          {student.email}
                        </p>
                      </div>
                      {isSelected && <StatusPill tone="green">Selected</StatusPill>}
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-[10px]">
                      <div className="rounded-xl bg-[#f7f8fc] p-2.5">
                        <p className="font-bold uppercase tracking-[.08em] text-slate-400">
                          Matric no.
                        </p>
                        <p className="mt-1 truncate font-bold text-ink">
                          {student.data.profile.matric}
                        </p>
                      </div>
                      <div className="rounded-xl bg-[#f7f8fc] p-2.5">
                        <p className="font-bold uppercase tracking-[.08em] text-slate-400">
                          Level
                        </p>
                        <p className="mt-1 font-bold text-ink">
                          {student.data.profile.level}
                        </p>
                      </div>
                      <div className="rounded-xl bg-[#f7f8fc] p-2.5">
                        <p className="font-bold uppercase tracking-[.08em] text-slate-400">
                          GPA / CGPA
                        </p>
                        <p className="mt-1 font-bold text-ink">
                          {student.data.gpa} / {student.data.cgpa}
                        </p>
                      </div>
                      <div className="rounded-xl bg-[#f7f8fc] p-2.5">
                        <p className="font-bold uppercase tracking-[.08em] text-slate-400">
                          Outstanding
                        </p>
                        <p className="mt-1 font-bold text-ink">
                          â‚¦{studentFees.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        onSelectStudent(student.id);
                        open("profile");
                      }}
                      className="button-primary mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-royal px-3 text-xs font-bold text-white"
                    >
                      <UserRound size={14} /> Edit this student
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={Users}
              title="No student accounts yet"
              text="Students will appear here after they complete the signup form."
            />
          )}
        </section>
      );

    if (section === "overview")
      return (
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <DashboardCard
              icon={Users}
              label="Student accounts"
              value={`${students.length}`}
              detail="Signups available to edit"
              tone="blue"
            />
            <DashboardCard
              icon={BookOpenCheck}
              label="Course catalogue"
              value={`${data.courses.length}`}
              detail="Editable courses"
              tone="green"
            />
            <DashboardCard
              icon={CircleDollarSign}
              label="Outstanding fees"
              value={`₦${(totalFees - paidFees).toLocaleString()}`}
              detail={`${Math.round((paidFees / Math.max(totalFees, 1)) * 100)}% collected`}
              tone="orange"
            />
            <DashboardCard
              icon={Bell}
              label="Unread notifications"
              value={`${unread}`}
              detail="Visible to students"
              tone="purple"
            />
          </div>
          <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
            <section className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
              <SectionTitle
                eyebrow="Academic controls"
                title="Session and performance"
                action={
                  <StatusPill tone="green">
                    <Check size={12} /> Auto-save on
                  </StatusPill>
                }
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <AdminInput
                  label="Academic session"
                  value={data.session}
                  onChange={(value) => onUpdate({ session: value })}
                />
                <AdminInput
                  label="Current semester"
                  value={data.semester}
                  onChange={(value) => onUpdate({ semester: value })}
                />
                <AdminInput
                  label="Current GPA"
                  value={data.gpa}
                  onChange={(value) => onUpdate({ gpa: value })}
                />
                <AdminInput
                  label="Cumulative GPA / CGPA"
                  value={data.cgpa}
                  onChange={(value) => onUpdate({ cgpa: value })}
                />
                <AdminInput
                  label="Credits completed"
                  type="number"
                  value={data.creditsCompleted}
                  onChange={(value) =>
                    onUpdate({ creditsCompleted: Number(value) || 0 })
                  }
                />
                <AdminInput
                  label="Total degree credits"
                  type="number"
                  value={data.totalCredits}
                  onChange={(value) =>
                    onUpdate({ totalCredits: Number(value) || 0 })
                  }
                />
              </div>
              <p className="mt-4 text-[11px] leading-5 text-slate-400">
                Changes are saved immediately to localStorage and reflected in
                the student portal when you switch back to Student view.
              </p>
            </section>
            <section className="rounded-2xl border border-[#e5eaff] bg-[#f7f9ff] p-5">
              <SectionTitle
                eyebrow="Quick edit"
                title="Jump to a content area"
              />
              <div className="grid gap-2">
                {adminNav.slice(1).map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.key}
                      onClick={() => open(item.key)}
                      className="button-quiet flex items-center gap-3 rounded-xl bg-white px-3 py-3 text-left text-xs font-bold text-ink"
                    >
                      <Icon size={16} className="text-royal" />
                      <span className="flex-1">
                        Edit {item.label.toLowerCase()}
                      </span>
                      <ChevronRight size={14} className="text-slate-300" />
                    </button>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      );

    if (section === "profile")
      return (
        <section className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
          <SectionTitle
            eyebrow="Student record"
            title="Edit student profile"
            action={<StatusPill tone="blue">Visible in My Profile</StatusPill>}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminInput
              label="Full name"
              value={data.profile.name}
              onChange={(value) =>
                onUpdate({ profile: { ...data.profile, name: value } })
              }
            />
            <AdminInput
              label="Matriculation number"
              value={data.profile.matric}
              onChange={(value) =>
                onUpdate({ profile: { ...data.profile, matric: value } })
              }
            />
            <AdminInput
              label="Department"
              value={data.profile.department}
              onChange={(value) =>
                onUpdate({ profile: { ...data.profile, department: value } })
              }
            />
            <AdminInput
              label="Faculty"
              value={data.profile.faculty}
              onChange={(value) =>
                onUpdate({ profile: { ...data.profile, faculty: value } })
              }
            />
            <AdminInput
              label="Level"
              value={data.profile.level}
              onChange={(value) =>
                onUpdate({ profile: { ...data.profile, level: value } })
              }
            />
            <AdminInput
              label="Email"
              value={data.profile.email}
              onChange={(value) =>
                onUpdate({ profile: { ...data.profile, email: value } })
              }
            />
            <AdminInput
              label="Login password"
              type="text"
              value={data.studentPassword}
              onChange={(value) => onUpdate({ studentPassword: value })}
            />
            <AdminInput
              label="Phone"
              value={data.profile.phone}
              onChange={(value) =>
                onUpdate({ profile: { ...data.profile, phone: value } })
              }
            />
            <div className="sm:col-span-2">
              <AdminTextarea
                label="Bio"
                value={data.profile.bio}
                onChange={(value) =>
                  onUpdate({ profile: { ...data.profile, bio: value } })
                }
              />
            </div>
          </div>
          <div className="mt-5 rounded-xl bg-[#f7f8fc] p-3 text-[11px] text-slate-500">
            You are editing the selected student account. Changes to this
            profile, login details, academics, finance records and notices are
            saved only to this student.
          </div>
        </section>
      );

    if (section === "courses")
      return (
        <section className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
          <SectionTitle
            eyebrow="Academics"
            title="Course catalogue"
            action={
              <button
                onClick={() =>
                  onUpdate({
                    courses: [
                      ...data.courses,
                      {
                        code: `NEW ${data.courses.length + 100}`,
                        title: "New course",
                        unit: 3,
                        type: "Elective",
                        instructor: "Assign lecturer",
                      },
                    ],
                  })
                }
                className="button-primary inline-flex items-center gap-1.5 rounded-xl bg-royal px-3 py-2 text-[11px] font-bold text-white"
              >
                <Plus size={14} /> Add course
              </button>
            }
          />
          <div className="space-y-3">
            {data.courses.map((course, index) => (
              <div
                key={`${course.code}-${index}`}
                className="grid gap-3 rounded-xl border border-[#edf0f5] p-3 md:grid-cols-[.75fr_1.4fr_.45fr_.65fr_1fr_auto] md:items-end"
              >
                <AdminInput
                  label="Code"
                  value={course.code}
                  onChange={(value) => updateCourse(index, { code: value })}
                />
                <AdminInput
                  label="Title"
                  value={course.title}
                  onChange={(value) => updateCourse(index, { title: value })}
                />
                <AdminInput
                  label="Units"
                  type="number"
                  value={course.unit}
                  onChange={(value) =>
                    updateCourse(index, { unit: Number(value) || 0 })
                  }
                />
                <label className="block text-[10px] font-bold uppercase tracking-[.1em] text-slate-400">
                  Type
                  <select
                    value={course.type}
                    onChange={(event) =>
                      updateCourse(index, {
                        type: event.target.value as Course["type"],
                      })
                    }
                    className="form-input mt-2 h-10 w-full rounded-xl border border-line bg-white px-3 text-xs font-medium normal-case tracking-normal text-ink"
                  >
                    <option>Core</option>
                    <option>Elective</option>
                    <option>General</option>
                  </select>
                </label>
                <AdminInput
                  label="Lecturer"
                  value={course.instructor}
                  onChange={(value) =>
                    updateCourse(index, { instructor: value })
                  }
                />
                <button
                  onClick={() =>
                    onUpdate({
                      courses: data.courses.filter(
                        (_, itemIndex) => itemIndex !== index,
                      ),
                      registeredCodes: data.registeredCodes.filter(
                        (code) => code !== course.code,
                      ),
                    })
                  }
                  className="button-quiet rounded-lg p-2 text-[#c6374a]"
                  aria-label={`Delete ${course.code}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>
      );

    if (section === "results")
      return (
        <section className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
          <SectionTitle
            eyebrow="Academics"
            title="Results, GPA & CGPA"
            action={
              <button
                onClick={() =>
                  onUpdate({
                    results: [
                      ...data.results,
                      {
                        code: "NEW 000",
                        title: "New result",
                        unit: 3,
                        grade: "A",
                        point: 5,
                      },
                    ],
                  })
                }
                className="button-primary inline-flex items-center gap-1.5 rounded-xl bg-royal px-3 py-2 text-[11px] font-bold text-white"
              >
                <Plus size={14} /> Add result
              </button>
            }
          />
          <div className="mb-5 grid gap-4 rounded-xl bg-[#f7f8fc] p-4 sm:grid-cols-4">
            <AdminInput
              label="Semester GPA"
              value={data.gpa}
              onChange={(value) => onUpdate({ gpa: value })}
            />
            <AdminInput
              label="Cumulative GPA / CGPA"
              value={data.cgpa}
              onChange={(value) => onUpdate({ cgpa: value })}
            />
            <div className="sm:col-span-2 flex items-center text-[11px] leading-5 text-slate-500">
              Edit the GPA values above or update individual course grades
              below. The student dashboard and results page use these values.
            </div>
          </div>
          <div className="space-y-3">
            {data.results.map((result, index) => (
              <div
                key={`${result.code}-${index}`}
                className="grid gap-3 rounded-xl border border-[#edf0f5] p-3 md:grid-cols-[.7fr_1.4fr_.45fr_.55fr_.55fr_auto] md:items-end"
              >
                <AdminInput
                  label="Code"
                  value={result.code}
                  onChange={(value) => updateResult(index, { code: value })}
                />
                <AdminInput
                  label="Course title"
                  value={result.title}
                  onChange={(value) => updateResult(index, { title: value })}
                />
                <AdminInput
                  label="Units"
                  type="number"
                  value={result.unit}
                  onChange={(value) =>
                    updateResult(index, { unit: Number(value) || 0 })
                  }
                />
                <AdminInput
                  label="Grade"
                  value={result.grade}
                  onChange={(value) => updateResult(index, { grade: value })}
                />
                <AdminInput
                  label="Point"
                  type="number"
                  value={result.point}
                  onChange={(value) =>
                    updateResult(index, { point: Number(value) || 0 })
                  }
                />
                <button
                  onClick={() =>
                    onUpdate({
                      results: data.results.filter(
                        (_, itemIndex) => itemIndex !== index,
                      ),
                    })
                  }
                  className="button-quiet rounded-lg p-2 text-[#c6374a]"
                  aria-label={`Delete ${result.code}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>
      );

    if (section === "timetable")
      return (
        <section className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <SectionTitle eyebrow="Academics" title="Class timetable editor" />
            <div className="flex rounded-xl bg-[#f6f7fb] p-1">
              <button
                onClick={() => setScheduleTab("classes")}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-[11px] font-bold",
                  scheduleTab === "classes"
                    ? "bg-white text-ink shadow-sm"
                    : "text-slate-400",
                )}
              >
                Classes
              </button>
              <button
                onClick={() => setScheduleTab("exams")}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-[11px] font-bold",
                  scheduleTab === "exams"
                    ? "bg-white text-ink shadow-sm"
                    : "text-slate-400",
                )}
              >
                Exams
              </button>
            </div>
          </div>
          {scheduleTab === "classes" ? (
            <div className="space-y-4">
              {data.timetable.map((day, dayIndex) => (
                <div
                  key={day.day}
                  className="rounded-xl border border-[#edf0f5] p-4"
                >
                  <div className="mb-3 flex items-end gap-3">
                    <div className="flex-1">
                      <AdminInput
                        label="Day"
                        value={day.day}
                        onChange={(value) =>
                          updateDay(dayIndex, { day: value })
                        }
                      />
                    </div>
                    <div className="w-24">
                      <AdminInput
                        label="Short"
                        value={day.short}
                        onChange={(value) =>
                          updateDay(dayIndex, { short: value })
                        }
                      />
                    </div>
                    <button
                      onClick={() =>
                        updateDay(dayIndex, {
                          items: [
                            ...day.items,
                            {
                              time: "09:00 – 11:00",
                              code: "NEW 000",
                              title: "New class",
                              room: "Assign room",
                              tone: "blue",
                            },
                          ],
                        })
                      }
                      className="button-quiet mb-0.5 inline-flex items-center gap-1 rounded-lg px-2 py-2 text-[11px] font-bold text-royal"
                    >
                      <Plus size={14} /> Add class
                    </button>
                  </div>
                  <div className="space-y-2">
                    {day.items.map((item, itemIndex) => (
                      <div
                        key={`${day.day}-${itemIndex}`}
                        className="grid gap-2 md:grid-cols-[.8fr_.7fr_1.25fr_1fr_auto]"
                      >
                        <AdminInput
                          label="Time"
                          value={item.time}
                          onChange={(value) =>
                            updateClass(dayIndex, itemIndex, { time: value })
                          }
                        />
                        <AdminInput
                          label="Code"
                          value={item.code}
                          onChange={(value) =>
                            updateClass(dayIndex, itemIndex, { code: value })
                          }
                        />
                        <AdminInput
                          label="Course"
                          value={item.title}
                          onChange={(value) =>
                            updateClass(dayIndex, itemIndex, { title: value })
                          }
                        />
                        <AdminInput
                          label="Room"
                          value={item.room}
                          onChange={(value) =>
                            updateClass(dayIndex, itemIndex, { room: value })
                          }
                        />
                        <button
                          onClick={() =>
                            updateDay(dayIndex, {
                              items: day.items.filter(
                                (_, index) => index !== itemIndex,
                              ),
                            })
                          }
                          className="button-quiet mt-5 rounded-lg p-2 text-[#c6374a]"
                          aria-label="Delete class"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl bg-[#f7f8fc] p-4 text-xs text-slate-500">
              Use the dedicated{" "}
              <button
                onClick={() => open("exams")}
                className="font-bold text-royal hover:underline"
              >
                Exam timetable
              </button>{" "}
              section to edit examination dates, times and venues.
            </div>
          )}
        </section>
      );

    if (section === "exams")
      return (
        <section className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
          <SectionTitle
            eyebrow="Academics"
            title="Examination timetable editor"
            action={
              <button
                onClick={() =>
                  onUpdate({
                    examSchedule: [
                      ...data.examSchedule,
                      {
                        code: "NEW 000",
                        title: "New examination",
                        date: "Mon, Jun 22",
                        time: "9:00 AM – 12:00 PM",
                        venue: "Assign venue",
                        color: "blue",
                      },
                    ],
                  })
                }
                className="button-primary inline-flex items-center gap-1.5 rounded-xl bg-royal px-3 py-2 text-[11px] font-bold text-white"
              >
                <Plus size={14} /> Add examination
              </button>
            }
          />
          <div className="space-y-3">
            {data.examSchedule.map((exam, index) => (
              <div
                key={`${exam.code}-${index}`}
                className="grid gap-3 rounded-xl border border-[#edf0f5] p-3 md:grid-cols-[.65fr_1.3fr_.8fr_1.05fr_1fr_auto] md:items-end"
              >
                <AdminInput
                  label="Code"
                  value={exam.code}
                  onChange={(value) => updateExam(index, { code: value })}
                />
                <AdminInput
                  label="Course"
                  value={exam.title}
                  onChange={(value) => updateExam(index, { title: value })}
                />
                <AdminInput
                  label="Date"
                  value={exam.date}
                  onChange={(value) => updateExam(index, { date: value })}
                />
                <AdminInput
                  label="Time"
                  value={exam.time}
                  onChange={(value) => updateExam(index, { time: value })}
                />
                <AdminInput
                  label="Venue"
                  value={exam.venue}
                  onChange={(value) => updateExam(index, { venue: value })}
                />
                <button
                  onClick={() =>
                    onUpdate({
                      examSchedule: data.examSchedule.filter(
                        (_, itemIndex) => itemIndex !== index,
                      ),
                    })
                  }
                  className="button-quiet rounded-lg p-2 text-[#c6374a]"
                  aria-label={`Delete ${exam.code}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>
      );

    if (section === "fees")
      return (
        <section className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
          <SectionTitle
            eyebrow="Finance"
            title="School fees & balances"
            action={
              <button
                onClick={() =>
                  onUpdate({
                    fees: [
                      ...data.fees,
                      { id: Date.now(), label: "New fee", amount: 0, paid: 0 },
                    ],
                  })
                }
                className="button-primary inline-flex items-center gap-1.5 rounded-xl bg-royal px-3 py-2 text-[11px] font-bold text-white"
              >
                <Plus size={14} /> Add fee
              </button>
            }
          />
          <div className="mb-5 grid gap-4 sm:grid-cols-3">
            <DashboardCard
              icon={CircleDollarSign}
              label="Total assessed"
              value={`₦${totalFees.toLocaleString()}`}
              detail="All fee items"
              tone="blue"
            />
            <DashboardCard
              icon={CheckCircle2}
              label="Collected"
              value={`₦${paidFees.toLocaleString()}`}
              detail="Paid to date"
              tone="green"
            />
            <DashboardCard
              icon={CircleAlert}
              label="Outstanding"
              value={`₦${(totalFees - paidFees).toLocaleString()}`}
              detail="Student balance"
              tone="orange"
            />
          </div>
          <div className="space-y-3">
            {data.fees.map((fee, index) => (
              <div
                key={fee.id}
                className="grid gap-3 rounded-xl border border-[#edf0f5] p-3 md:grid-cols-[1.4fr_1fr_1fr_auto] md:items-end"
              >
                <AdminInput
                  label="Fee name"
                  value={fee.label}
                  onChange={(value) => updateFee(index, { label: value })}
                />
                <AdminInput
                  label="Total amount"
                  type="number"
                  value={fee.amount}
                  onChange={(value) =>
                    updateFee(index, { amount: Number(value) || 0 })
                  }
                />
                <AdminInput
                  label="Amount paid"
                  type="number"
                  value={fee.paid}
                  onChange={(value) =>
                    updateFee(index, { paid: Number(value) || 0 })
                  }
                />
                <button
                  onClick={() =>
                    onUpdate({
                      fees: data.fees.filter(
                        (_, itemIndex) => itemIndex !== index,
                      ),
                    })
                  }
                  className="button-quiet rounded-lg p-2 text-[#c6374a]"
                  aria-label={`Delete ${fee.label}`}
                >
                  <Trash2 size={16} />
                </button>
                <div className="md:col-span-4">
                  <StatusPill tone={fee.paid >= fee.amount ? "green" : "amber"}>
                    {fee.paid >= fee.amount
                      ? "Completed"
                      : `Outstanding · ₦${(fee.amount - fee.paid).toLocaleString()}`}
                  </StatusPill>
                </div>
              </div>
            ))}
          </div>
        </section>
      );

    if (section === "payments")
      return (
        <section className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
          <SectionTitle
            eyebrow="Finance"
            title="Payment history"
            action={
              <button
                onClick={() =>
                  onUpdate({
                    payments: [
                      ...data.payments,
                      {
                        date: "New date",
                        ref: `NB-${Date.now()}`,
                        type: "Tuition fee",
                        amount: 0,
                        status: "Pending",
                      },
                    ],
                  })
                }
                className="button-primary inline-flex items-center gap-1.5 rounded-xl bg-royal px-3 py-2 text-[11px] font-bold text-white"
              >
                <Plus size={14} /> Add payment
              </button>
            }
          />
          <div className="space-y-3">
            {data.payments.map((payment, index) => (
              <div
                key={payment.ref}
                className="grid gap-3 rounded-xl border border-[#edf0f5] p-3 md:grid-cols-[.8fr_1fr_1fr_.8fr_.8fr_auto] md:items-end"
              >
                <AdminInput
                  label="Date"
                  value={payment.date}
                  onChange={(value) => updatePayment(index, { date: value })}
                />
                <AdminInput
                  label="Reference"
                  value={payment.ref}
                  onChange={(value) => updatePayment(index, { ref: value })}
                />
                <AdminInput
                  label="Description"
                  value={payment.type}
                  onChange={(value) => updatePayment(index, { type: value })}
                />
                <AdminInput
                  label="Amount"
                  type="number"
                  value={payment.amount}
                  onChange={(value) =>
                    updatePayment(index, { amount: Number(value) || 0 })
                  }
                />
                <label className="block text-[10px] font-bold uppercase tracking-[.1em] text-slate-400">
                  Status
                  <select
                    value={payment.status}
                    onChange={(event) =>
                      updatePayment(index, {
                        status: event.target.value as Payment["status"],
                      })
                    }
                    className="form-input mt-2 h-10 w-full rounded-xl border border-line bg-white px-3 text-xs font-medium normal-case tracking-normal text-ink"
                  >
                    <option>Verified</option>
                    <option>Pending</option>
                    <option>Failed</option>
                  </select>
                </label>
                <button
                  onClick={() =>
                    onUpdate({
                      payments: data.payments.filter(
                        (_, itemIndex) => itemIndex !== index,
                      ),
                    })
                  }
                  className="button-quiet rounded-lg p-2 text-[#c6374a]"
                  aria-label={`Delete ${payment.ref}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>
      );

    if (section === "notifications")
      return (
        <section className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
          <SectionTitle
            eyebrow="Community"
            title="Notification center"
            action={
              <button
                onClick={() =>
                  onUpdate({
                    notices: [
                      ...data.notices,
                      {
                        id: Date.now(),
                        title: "New notification",
                        body: "Add notification details",
                        time: "Just now",
                        type: "academic",
                        read: false,
                      },
                    ],
                  })
                }
                className="button-primary inline-flex items-center gap-1.5 rounded-xl bg-royal px-3 py-2 text-[11px] font-bold text-white"
              >
                <Plus size={14} /> Add notification
              </button>
            }
          />
          <div className="space-y-3">
            {data.notices.map((notice, index) => (
              <div
                key={notice.id}
                className="grid gap-3 rounded-xl border border-[#edf0f5] p-3 md:grid-cols-[1fr_1.4fr_.75fr_.75fr_auto] md:items-end"
              >
                <AdminInput
                  label="Title"
                  value={notice.title}
                  onChange={(value) => updateNotice(index, { title: value })}
                />
                <AdminInput
                  label="Message"
                  value={notice.body}
                  onChange={(value) => updateNotice(index, { body: value })}
                />
                <AdminInput
                  label="Time label"
                  value={notice.time}
                  onChange={(value) => updateNotice(index, { time: value })}
                />
                <label className="block text-[10px] font-bold uppercase tracking-[.1em] text-slate-400">
                  Type
                  <select
                    value={notice.type}
                    onChange={(event) =>
                      updateNotice(index, {
                        type: event.target.value as Notice["type"],
                      })
                    }
                    className="form-input mt-2 h-10 w-full rounded-xl border border-line bg-white px-3 text-xs font-medium normal-case tracking-normal text-ink"
                  >
                    <option value="academic">Academic</option>
                    <option value="finance">Finance</option>
                    <option value="event">Event</option>
                  </select>
                </label>
                <div className="flex items-center gap-2 md:mb-1">
                  <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                    <input
                      type="checkbox"
                      checked={!notice.read}
                      onChange={(event) =>
                        updateNotice(index, { read: !event.target.checked })
                      }
                      className="h-4 w-4 accent-royal"
                    />{" "}
                    Unread
                  </label>
                  <button
                    onClick={() =>
                      onUpdate({
                        notices: data.notices.filter(
                          (_, itemIndex) => itemIndex !== index,
                        ),
                      })
                    }
                    className="button-quiet rounded-lg p-2 text-[#c6374a]"
                    aria-label={`Delete ${notice.title}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      );

    return (
      <section className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
        <SectionTitle
          eyebrow="Community"
          title="Announcements"
          action={
            <button
              onClick={() =>
                onUpdate({
                  announcements: [
                    ...data.announcements,
                    {
                      id: Date.now(),
                      title: "New announcement",
                      excerpt: "Add announcement details",
                      date: "May 19, 2026",
                      tag: "Academic",
                    },
                  ],
                })
              }
              className="button-primary inline-flex items-center gap-1.5 rounded-xl bg-royal px-3 py-2 text-[11px] font-bold text-white"
            >
              <Plus size={14} /> Add announcement
            </button>
          }
        />
        <div className="space-y-3">
          {data.announcements.map((announcement, index) => (
            <div
              key={announcement.id}
              className="grid gap-3 rounded-xl border border-[#edf0f5] p-3 md:grid-cols-[1fr_1.4fr_.8fr_.7fr_auto] md:items-end"
            >
              <AdminInput
                label="Title"
                value={announcement.title}
                onChange={(value) =>
                  updateAnnouncement(index, { title: value })
                }
              />
              <AdminTextarea
                label="Excerpt"
                value={announcement.excerpt}
                onChange={(value) =>
                  updateAnnouncement(index, { excerpt: value })
                }
              />
              <AdminInput
                label="Date"
                value={announcement.date}
                onChange={(value) => updateAnnouncement(index, { date: value })}
              />
              <AdminInput
                label="Tag"
                value={announcement.tag}
                onChange={(value) => updateAnnouncement(index, { tag: value })}
              />
              <div className="flex items-center gap-2 md:mb-1">
                <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                  <input
                    type="checkbox"
                    checked={Boolean(announcement.featured)}
                    onChange={(event) =>
                      updateAnnouncement(index, {
                        featured: event.target.checked,
                      })
                    }
                    className="h-4 w-4 accent-royal"
                  />{" "}
                  Featured
                </label>
                <button
                  onClick={() =>
                    onUpdate({
                      announcements: data.announcements.filter(
                        (_, itemIndex) => itemIndex !== index,
                      ),
                    })
                  }
                  className="button-quiet rounded-lg p-2 text-[#c6374a]"
                  aria-label={`Delete ${announcement.title}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-mist lg:flex">
      <aside className="bg-ink px-4 py-5 text-white lg:min-h-screen lg:w-64 lg:shrink-0 lg:px-4">
        <div className="mb-6 flex items-center justify-between px-2">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-ink">
              <Library size={19} />
            </span>
            <span>
              <span className="block text-[15px] font-extrabold leading-none tracking-[-.03em]">
                northbridge
              </span>
              <span className="mt-1 block text-[9px] font-semibold uppercase tracking-[.18em] text-blue-100">
                Admin console
              </span>
            </span>
          </div>
          <StatusPill tone="green">
            <span className="h-1.5 w-1.5 rounded-full bg-[#198754]" /> Live
          </StatusPill>
        </div>
        <nav className="scrollbar-thin flex gap-1 overflow-x-auto pb-2 lg:block lg:space-y-1 lg:overflow-visible">
          {adminNav.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                onClick={() => open(item.key)}
                className={cn(
                  "flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-semibold transition lg:w-full",
                  section === item.key
                    ? "bg-white text-royal"
                    : "text-blue-100 hover:bg-white/10 hover:text-white",
                )}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="mt-6 border-t border-white/10 pt-5">
          <div className="mb-2 flex items-center justify-between px-2">
            <p className="text-[10px] font-bold uppercase tracking-[.12em] text-blue-200">
              Student accounts
            </p>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-blue-100">
              {students.length}
            </span>
          </div>
          <div className="scrollbar-thin max-h-56 space-y-1 overflow-y-auto">
            {students.length ? (
              students.map((student) => (
                <button
                  key={student.id}
                  onClick={() => onSelectStudent(student.id)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition",
                    selectedStudentId === student.id
                      ? "bg-white text-ink"
                      : "text-blue-100 hover:bg-white/10 hover:text-white",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-extrabold",
                      selectedStudentId === student.id
                        ? "bg-[#eef2ff] text-royal"
                        : "bg-white/10 text-white",
                    )}
                  >
                    {student.data.profile.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[11px] font-bold">
                      {student.data.profile.name}
                    </span>
                    <span
                      className={cn(
                        "block truncate text-[9px]",
                        selectedStudentId === student.id
                          ? "text-slate-400"
                          : "text-blue-200",
                      )}
                    >
                      {student.email}
                    </span>
                  </span>
                </button>
              ))
            ) : (
              <p className="px-2 text-[10px] leading-5 text-blue-200">
                No student has signed up yet.
              </p>
            )}
          </div>
        </div>
        <div className="mt-6 hidden rounded-2xl bg-white/10 p-3.5 lg:block">
          <p className="text-[11px] font-bold">Publishing center</p>
          <p className="mt-1 text-[10px] leading-4 text-blue-100">
            Edits are saved locally and visible in the student portal.
          </p>
        </div>
        <button
          onClick={onLogout}
          className="mt-6 hidden w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-blue-100 hover:bg-white/10 hover:text-white lg:flex"
        >
          <LogOut size={16} /> Exit admin console
        </button>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="flex min-h-[72px] items-center justify-between gap-4 border-b border-line bg-white px-4 sm:px-7 lg:px-9">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.16em] text-royal">
              Northbridge administration
            </p>
            <h1 className="mt-1 text-lg font-extrabold tracking-[-.03em] text-ink">
              {title}
            </h1>
            {selectedStudent && (
              <p className="mt-1 flex items-center gap-1.5 text-[10px] font-semibold text-slate-400">
                <UserRound size={12} className="text-royal" />
                Editing {selectedStudent.data.profile.name}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <StatusPill tone="blue">
              <ShieldCheck size={12} /> Auto-saved
            </StatusPill>
            <button
              onClick={onLogout}
              className="button-quiet inline-flex items-center gap-2 rounded-xl border border-line px-3 py-2 text-[11px] font-bold text-slate-600"
            >
              <LogOut size={14} /> Log out
            </button>
          </div>
        </header>
        <main className="px-4 py-6 sm:px-7 lg:px-9 lg:py-8">
          <div className="mx-auto max-w-[1450px]">{renderEditor()}</div>
        </main>
      </div>
    </div>
  );
}

function LoginPage({
  onLogin,
  onSignup,
}: {
  onLogin: (email: string, password: string) => boolean;
  onSignup: (account: {
    name: string;
    email: string;
    password: string;
    department: string;
    level: string;
  }) => boolean;
}) {
  const [authView, setAuthView] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signupDepartment, setSignupDepartment] = useState("Computer Science");
  const [signupLevel, setSignupLevel] = useState("400 Level");
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (authView === "signup") {
      if (
        !signupName.trim() ||
        !signupEmail.trim() ||
        !signupPassword ||
        !confirmPassword
      ) {
        setError("Complete all fields to create your student account.");
        return;
      }
      if (signupPassword.length < 6) {
        setError("Use a password with at least 6 characters.");
        return;
      }
      if (signupPassword !== confirmPassword) {
        setError("The passwords do not match.");
        return;
      }
      setIsSubmitting(true);
      window.setTimeout(() => {
        const success = onSignup({
          name: signupName.trim(),
          email: signupEmail.trim(),
          password: signupPassword,
          department: signupDepartment,
          level: signupLevel,
        });
        if (!success) {
          setError("That email is already in use. Try another student email.");
          setIsSubmitting(false);
        }
      }, 450);
      return;
    }

    if (!email.trim() || !password) {
      setError("Enter your email and password to continue.");
      return;
    }
    setIsSubmitting(true);
    window.setTimeout(() => {
      const success = onLogin(email.trim(), password);
      if (!success) {
        setError("That email or password is incorrect. Create an account if you are a new student.");
        setIsSubmitting(false);
        return;
      }
      if (!rememberMe) window.localStorage.removeItem(AUTH_KEY);
    }, 450);
  };

  return (
    <main className="min-h-screen bg-mist lg:grid lg:grid-cols-[1.05fr_.95fr]">
      <section className="gradient-hero grid-fade relative hidden overflow-hidden p-8 text-white lg:flex lg:flex-col lg:justify-between xl:p-12">
        <div className="relative z-10 flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-ink shadow-sm">
            <Library size={21} strokeWidth={2.4} />
          </span>
          <span>
            <span className="block text-base font-extrabold leading-none tracking-[-.03em]">
              northbridge
            </span>
            <span className="mt-1 block text-[9px] font-semibold uppercase tracking-[.18em] text-blue-100">
              Student portal
            </span>
          </span>
        </div>
        <div className="relative z-10 max-w-lg pb-8">
          <p className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.15em] text-blue-100">
            <Sparkles size={14} /> Your academic journey, simplified
          </p>
          <h1 className="text-4xl font-extrabold leading-[1.05] tracking-[-.055em] xl:text-6xl">
            Everything you need to move forward.
          </h1>
          <p className="mt-5 max-w-md text-sm leading-6 text-blue-100">
            Manage your courses, track your progress, and stay connected to the
            Northbridge community from one calm, focused space.
          </p>
          <div className="mt-10 grid max-w-md grid-cols-3 gap-3">
            {[
              ["4.52", "Current GPA"],
              ["96", "Credits earned"],
              ["82%", "Degree progress"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-white/10 p-3.5 backdrop-blur-sm"
              >
                <p className="text-xl font-extrabold tracking-[-.04em]">
                  {value}
                </p>
                <p className="mt-1 text-[10px] text-blue-100">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="relative z-10 text-[10px] text-blue-100">
          © 2026 Northbridge University · Secure student access
        </p>
        <div className="absolute -right-24 -top-20 h-80 w-80 rounded-full border border-white/10 bg-white/5" />
        <div className="absolute -bottom-36 right-1/4 h-96 w-96 rounded-full border border-white/10" />
      </section>

      <section className="flex min-h-screen flex-col bg-white px-5 py-7 sm:px-10 lg:px-14 xl:px-24">
        <div className="flex items-center gap-2.5 lg:hidden">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-white shadow-sm">
            <Library size={19} strokeWidth={2.4} />
          </span>
          <span>
            <span className="block text-[15px] font-extrabold leading-none tracking-[-.03em] text-ink">
              northbridge
            </span>
            <span className="mt-1 block text-[9px] font-semibold uppercase tracking-[.18em] text-slate-400">
              Student portal
            </span>
          </span>
        </div>
        <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center py-12">
          <div className="mb-8">
            <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef2ff] text-royal">
              <LockKeyhole size={20} />
            </span>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[.16em] text-royal">
              {authView === "signup"
                ? "New student account"
                : "Welcome back"}
            </p>
            <h2 className="text-3xl font-extrabold tracking-[-.05em] text-ink">
              {authView === "signup"
                ? "Create your student account"
                : "Sign in to your portal"}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              {authView === "signup"
                ? "Set up your profile to access courses, results, fees and announcements."
                : "Access your courses, results, timetable and more."}
            </p>
          </div>

          <form onSubmit={submit} className="space-y-5" noValidate>
            {authView === "login" ? (
              <>
            <label className="block">
              <span className="mb-2 block text-[11px] font-bold text-ink">
                Email address
              </span>
              <span className="relative block">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="student-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="form-input h-12 w-full rounded-xl border border-line bg-white pl-10 pr-3 text-sm text-ink placeholder:text-slate-400"
                  placeholder="you@northbridge.edu"
                  autoComplete="email"
                  aria-invalid={Boolean(error)}
                />
              </span>
            </label>
            <label className="block">
              <span className="mb-2 block text-[11px] font-bold text-ink">
                Password
              </span>
              <span className="relative block">
                <LockKeyhole
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="student-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="form-input h-12 w-full rounded-xl border border-line bg-white pl-10 pr-11 text-sm text-ink placeholder:text-slate-400"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  aria-invalid={Boolean(error)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="button-quiet absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </span>
            </label>
              </>
            ) : (
              <>
                <label className="block">
                  <span className="mb-2 block text-[11px] font-bold text-ink">
                    Full name
                  </span>
                  <input
                    type="text"
                    value={signupName}
                    onChange={(event) => setSignupName(event.target.value)}
                    className="form-input h-12 w-full rounded-xl border border-line bg-white px-3 text-sm text-ink placeholder:text-slate-400"
                    placeholder="Your full name"
                    autoComplete="name"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[11px] font-bold text-ink">
                    Student email
                  </span>
                  <span className="relative block">
                    <Mail
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="email"
                      value={signupEmail}
                      onChange={(event) => setSignupEmail(event.target.value)}
                      className="form-input h-12 w-full rounded-xl border border-line bg-white pl-10 pr-3 text-sm text-ink placeholder:text-slate-400"
                      placeholder="you@northbridge.edu"
                      autoComplete="email"
                    />
                  </span>
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-[11px] font-bold text-ink">
                      Department
                    </span>
                    <select
                      value={signupDepartment}
                      onChange={(event) => setSignupDepartment(event.target.value)}
                      className="form-input h-12 w-full rounded-xl border border-line bg-white px-3 text-sm text-ink"
                    >
                      <option>Computer Science</option>
                      <option>Information Systems</option>
                      <option>Accounting</option>
                      <option>Business Administration</option>
                      <option>Mass Communication</option>
                      <option>Electrical Engineering</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-[11px] font-bold text-ink">
                      Level
                    </span>
                    <select
                      value={signupLevel}
                      onChange={(event) => setSignupLevel(event.target.value)}
                      className="form-input h-12 w-full rounded-xl border border-line bg-white px-3 text-sm text-ink"
                    >
                      <option>100 Level</option>
                      <option>200 Level</option>
                      <option>300 Level</option>
                      <option>400 Level</option>
                      <option>500 Level</option>
                    </select>
                  </label>
                </div>
                <label className="block">
                  <span className="mb-2 block text-[11px] font-bold text-ink">
                    Password
                  </span>
                  <span className="relative block">
                    <input
                      type={showSignupPassword ? "text" : "password"}
                      value={signupPassword}
                      onChange={(event) => setSignupPassword(event.target.value)}
                      className="form-input h-12 w-full rounded-xl border border-line bg-white px-3 pr-11 text-sm text-ink placeholder:text-slate-400"
                      placeholder="At least 6 characters"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      className="button-quiet absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400"
                      aria-label={showSignupPassword ? "Hide password" : "Show password"}
                    >
                      {showSignupPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </span>
                </label>
                <label className="block">
                  <span className="mb-2 block text-[11px] font-bold text-ink">
                    Confirm password
                  </span>
                  <span className="relative block">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      className="form-input h-12 w-full rounded-xl border border-line bg-white px-3 pr-11 text-sm text-ink placeholder:text-slate-400"
                      placeholder="Repeat your password"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="button-quiet absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </span>
                </label>
              </>
            )}

            {error && (
              <div
                className="flex items-start gap-2 rounded-xl border border-[#ffd9de] bg-[#fff5f6] px-3.5 py-3 text-xs font-medium leading-5 text-[#b92f43]"
                role="alert"
              >
                <CircleAlert size={16} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {authView === "login" ? (
              <div className="flex items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                    className="h-4 w-4 rounded border-line accent-royal"
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  className="text-[11px] font-bold text-royal hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            ) : (
              <p className="text-[11px] leading-5 text-slate-500">
                Your account details are saved in this browser for this portal
                prototype.
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="button-primary flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-royal px-4 text-sm font-bold text-white disabled:cursor-wait disabled:opacity-70"
            >
              {isSubmitting
                ? authView === "signup"
                  ? "Creating account..."
                  : "Signing in..."
                : authView === "signup"
                  ? "Create student account"
                  : "Sign in to portal"}
              {!isSubmitting && <ArrowRight size={16} />}
            </button>
          </form>

          {authView === "login" ? (
            <div className="mt-7 rounded-2xl border border-[#e5eaff] bg-[#f7f9ff] p-4">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-royal" />
                <p className="text-[11px] font-bold text-ink">
                  New to the portal?
                </p>
              </div>
              <p className="mt-2 text-[11px] leading-5 text-slate-500">
                Create your own student account and choose a password to use
                whenever you sign in.
              </p>
              <button
                type="button"
                onClick={() => {
                  setAuthView("signup");
                  setError("");
                }}
                className="mt-4 text-[11px] font-bold text-royal hover:underline"
              >
                New student? Create an account
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setAuthView("login");
                setError("");
              }}
              className="mt-7 block w-full text-center text-[11px] font-bold text-royal hover:underline"
            >
              Already have an account? Sign in
            </button>
          )}
        </div>
        <p className="text-center text-[10px] text-slate-400">
          Need help signing in? Contact the Student Success team.
        </p>
      </section>
    </main>
  );
}

function normalizePortalData(parsed: Partial<PortalData> = {}): PortalData {
  const savedStudentPassword =
    parsed.studentPassword === "northbridge" &&
    (parsed.profile?.email || initialProfile.email).toLowerCase() ===
      initialProfile.email.toLowerCase()
      ? ""
      : parsed.studentPassword || initialPortalData.studentPassword;

  return {
    ...initialPortalData,
    ...parsed,
    profile: { ...initialProfile, ...(parsed.profile || {}) },
    courses: parsed.courses || initialPortalData.courses,
    registeredCodes:
      parsed.registeredCodes || initialPortalData.registeredCodes,
    results: parsed.results || initialPortalData.results,
    notices: parsed.notices || initialPortalData.notices,
    announcements: parsed.announcements || initialPortalData.announcements,
    examSchedule: parsed.examSchedule || initialPortalData.examSchedule,
    timetable: parsed.timetable || initialPortalData.timetable,
    fees: parsed.fees || initialPortalData.fees,
    payments: parsed.payments || initialPortalData.payments,
    studentPassword: savedStudentPassword,
  };
}

export default function Home() {
  const [authReady, setAuthReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activePage, setActivePage] = useState<PageKey>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [data, setData] = useState<PortalData>(initialPortalData);
  const [students, setStudents] = useState<StudentAccount[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null,
  );
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    let loadedData = initialPortalData;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Partial<PortalData>;
        loadedData = normalizePortalData(parsed);
      } catch {
        /* Keep the demo defaults if local storage is malformed. */
      }
    }
    setData(loadedData);

    let loadedStudents: StudentAccount[] = [];
    const savedStudents = window.localStorage.getItem(STUDENTS_KEY);
    if (savedStudents) {
      try {
        const parsedStudents = JSON.parse(savedStudents) as StudentAccount[];
        if (Array.isArray(parsedStudents)) {
          loadedStudents = parsedStudents.filter(
            (student) =>
              student &&
              typeof student.id === "string" &&
              typeof student.email === "string" &&
              typeof student.password === "string" &&
              student.data,
          );
        }
      } catch {
        /* Start with an empty student list if the saved list is malformed. */
      }
    }

    if (!loadedStudents.length && loadedData.studentPassword) {
      const migratedStudent: StudentAccount = {
        id: `student-${Date.now()}`,
        email: loadedData.profile.email,
        password: loadedData.studentPassword,
        data: loadedData,
        createdAt: new Date().toISOString(),
      };
      loadedStudents = [migratedStudent];
      window.localStorage.setItem(STUDENTS_KEY, JSON.stringify(loadedStudents));
    }
    setStudents(loadedStudents);

    const authValue = window.localStorage.getItem(AUTH_KEY);
    const isAdminAuth = authValue === "admin";
    const isStudentAuth =
      authValue === "true" ||
      authValue === "student" ||
      Boolean(authValue?.startsWith("student:"));
    const requestedStudentId = authValue?.startsWith("student:")
      ? authValue.slice("student:".length)
      : "";
    const signedInStudent =
      loadedStudents.find((student) => student.id === requestedStudentId) ||
      loadedStudents[0];
    const initialSelectedStudent =
      isStudentAuth && signedInStudent
        ? signedInStudent
        : isAdminAuth
          ? loadedStudents[0]
          : undefined;
    if (initialSelectedStudent) {
      setSelectedStudentId(initialSelectedStudent.id);
      setData(initialSelectedStudent.data);
    }
    setIsAdmin(isAdminAuth);
    setIsAuthenticated(
      isAdminAuth || Boolean(isStudentAuth && signedInStudent),
    );
    setAuthReady(true);
  }, []);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 3200);
  };
  const navigate = (page: PageKey) => {
    setActivePage(page);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const updateData = (patch: Partial<PortalData>) => {
    setData((current) => {
      const next = { ...current, ...patch };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      if (selectedStudentId) {
        setStudents((currentStudents) => {
          const nextStudents = currentStudents.map((student) =>
            student.id === selectedStudentId
              ? {
                  ...student,
                  email: next.profile.email,
                  password: next.studentPassword,
                  data: next,
                }
              : student,
          );
          window.localStorage.setItem(
            STUDENTS_KEY,
            JSON.stringify(nextStudents),
          );
          return nextStudents;
        });
      }
      return next;
    });
  };
  const selectStudent = (id: string) => {
    const student = students.find((item) => item.id === id);
    if (!student) return;
    setSelectedStudentId(student.id);
    setData(student.data);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(student.data));
  };
  const setRegisteredCodes = (codes: string[]) => {
    updateData({ registeredCodes: codes });
  };
  const setNoticesPersisted = (next: Notice[]) => {
    updateData({ notices: next });
  };
  const logout = () => {
    window.localStorage.removeItem(AUTH_KEY);
    setSidebarOpen(false);
    setIsAdmin(false);
    setIsAuthenticated(false);
    setSelectedStudentId(null);
  };
  const login = (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const adminCredentials =
      normalizedEmail === "admin@northbridge.edu" && password === "admin123";
    if (adminCredentials) {
      const firstStudent = students[0];
      window.localStorage.setItem(AUTH_KEY, "admin");
      setIsAdmin(true);
      setIsAuthenticated(true);
      if (firstStudent) {
        setSelectedStudentId(firstStudent.id);
        setData(firstStudent.data);
      }
      setActivePage("dashboard");
      return true;
    }

    const student = students.find(
      (item) =>
        item.email.toLowerCase() === normalizedEmail &&
        item.password === password,
    );
    if (!student) return false;
    window.localStorage.setItem(AUTH_KEY, `student:${student.id}`);
    setSelectedStudentId(student.id);
    setData(student.data);
    setIsAdmin(false);
    setIsAuthenticated(true);
    setActivePage("dashboard");
    return true;
  };
  const signup = (account: {
    name: string;
    email: string;
    password: string;
    department: string;
    level: string;
  }) => {
    const email = account.email.trim().toLowerCase();
    if (
      !email ||
      email === "admin@northbridge.edu" ||
      students.some((student) => student.email.toLowerCase() === email)
    ) {
      return false;
    }

    const faculty =
      account.department === "Computer Science" ||
      account.department === "Information Systems"
        ? "Computing & Informatics"
        : initialProfile.faculty;
    const nextProfile: Profile = {
      ...initialProfile,
      name: account.name.trim(),
      email,
      department: account.department,
      faculty,
      level: account.level,
      phone: "",
      bio: "",
      matric: `NBU/UG/${String(new Date().getFullYear()).slice(-2)}/${String(
        Date.now(),
      ).slice(-4)}`,
    };
    const studentId = `student-${Date.now()}`;
    const nextData = createEmptyStudentData(nextProfile, account.password);
    const nextStudent: StudentAccount = {
      id: studentId,
      email,
      password: account.password,
      data: nextData,
      createdAt: new Date().toISOString(),
    };
    const nextStudents = [...students, nextStudent];
    setStudents(nextStudents);
    window.localStorage.setItem(STUDENTS_KEY, JSON.stringify(nextStudents));
    setData(nextData);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextData));
    setSelectedStudentId(studentId);
    window.localStorage.setItem(AUTH_KEY, `student:${studentId}`);
    setIsAdmin(false);
    setIsAuthenticated(true);
    setActivePage("dashboard");
    return true;
  };

  if (!authReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-mist">
        <div className="flex items-center gap-2.5 text-ink">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-white">
            <Library size={19} />
          </span>
          <span className="text-sm font-extrabold tracking-[-.03em]">
            northbridge
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={login} onSignup={signup} />;
  }

  if (isAdmin) {
    return (
      <AdminPanel
        data={data}
        students={students}
        selectedStudentId={selectedStudentId}
        onSelectStudent={selectStudent}
        onUpdate={updateData}
        onLogout={logout}
        showToast={showToast}
      />
    );
  }

  let content: React.ReactNode;
  switch (activePage) {
    case "profile":
      content = (
        <ProfilePage profile={data.profile} data={data} onNavigate={navigate} />
      );
      break;
    case "courses":
      content = (
        <CourseRegistrationPage
          registeredCodes={data.registeredCodes}
          setRegisteredCodes={setRegisteredCodes}
          courses={data.courses}
          search={search}
          showToast={showToast}
        />
      );
      break;
    case "results":
      content = <ResultsPage data={data} />;
      break;
    case "timetable":
      content = <TimetablePage data={data} />;
      break;
    case "exams":
      content = <ExamsPage data={data} />;
      break;
    case "fees":
      content = <FeesPage data={data} onNavigate={navigate} />;
      break;
    case "payments":
      content = <PaymentsPage data={data} />;
      break;
    case "notifications":
      content = (
        <NotificationsPage
          notices={data.notices}
          setNotices={setNoticesPersisted}
        />
      );
      break;
    case "announcements":
      content = (
        <AnnouncementsPage search={search} announcements={data.announcements} />
      );
      break;
    case "settings":
      content = (
        <SettingsPage
          profile={data.profile}
          setProfile={(next) => {
            updateData({ profile: next });
          }}
          showToast={showToast}
        />
      );
      break;
    default:
      content = <DashboardPage data={data} onNavigate={navigate} />;
  }

  return (
    <div className="app-shell flex bg-mist">
      <Sidebar
        activePage={activePage}
        open={sidebarOpen}
        onNavigate={navigate}
        onClose={() => setSidebarOpen(false)}
        unreadCount={data.notices.filter((notice) => !notice.read).length}
        onLogout={logout}
      />
      <div className="content-shell flex min-h-screen flex-1 flex-col">
        <Header
          page={activePage}
          profile={data.profile}
          search={search}
          setSearch={setSearch}
          onMenu={() => setSidebarOpen(true)}
          onNavigate={navigate}
          unreadCount={data.notices.filter((notice) => !notice.read).length}
        />
        <main className="flex-1 px-4 py-6 sm:px-7 lg:px-9 lg:py-8">
          <div className="mx-auto max-w-[1400px]">{content}</div>
        </main>
        <footer className="px-4 pb-6 text-center text-[10px] text-slate-400 sm:px-7 lg:px-9">
          <span>Northbridge University · Student portal demo</span>
          <span className="mx-2">·</span>
          <span>Built for a better student experience</span>
        </footer>
      </div>
      {toast && (
        <div className="toast-enter fixed bottom-5 left-1/2 z-[80] flex -translate-x-1/2 items-center gap-2 rounded-xl bg-ink px-4 py-3 text-xs font-semibold text-white shadow-2xl">
          <CheckCircle2 size={16} className="text-[#82e3a9]" />
          {toast}
        </div>
      )}
    </div>
  );
}
