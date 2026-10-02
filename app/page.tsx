"use client";

import { useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  Download,
  ExternalLink,
  Eye,
  FileQuestion,
  FileText,
  HeartPulse,
  Home,
  Inbox,
  LogOut,
  Maximize2,
  Megaphone,
  Menu,
  MessageSquareText,
  Pause,
  Pencil,
  Play,
  Plus,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  TicketCheck,
  Trash2,
  Upload,
  UserCog,
  UserRound,
  Volume2,
  WalletCards,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Role = "employee" | "hr";
type View =
  | "home"
  | "help"
  | "request-detail"
  | "concerns"
  | "learning"
  | "announcements"
  | "admin"
  | "admin-requests";
type Concern = {
  id: string;
  title: string;
  updated: string;
  status: string;
  tone: string;
  category: string;
  employee: string;
  details: string;
  submitted: string;
  hrFeedback?: string;
  attachment?: string;
  employeeReply?: string;
  replyAttachment?: string;
  employeeReplyAt?: string;
};
type SupportingForm = {
  name: string;
  note: string;
  templateUrl: string;
  tab?: string;
  samples: { src: string; label: string }[];
};
type RequestGuide = {
  id: string;
  icon: typeof WalletCards;
  title: string;
  short: string;
  time: string;
  category: string;
  requirements: string[];
  faqs: { q: string; a: string }[];
  formLink?: string;
  contact?: string;
  published?: boolean;
  supportingForms?: SupportingForm[];
};
type Announcement = {
  id: number;
  date: string;
  tag: string;
  title: string;
  copy: string;
  pinned: boolean;
  published?: boolean;
};
type LearningSession = {
  id: string;
  status: "Upcoming" | "Recorded" | "Materials";
  date: string;
  type: string;
  title: string;
  speaker: string;
  length: string;
  resources: string[];
  registrationLink?: string;
  teamsLink?: string;
  materialsLink?: string;
  published?: boolean;
};

const initialRequestGuides: RequestGuide[] = [
  {
    id: "coe",
    icon: FileText,
    title: "Certificate of Employment (COE)",
    short: "Request proof of employment for bank, visa, or personal use.",
    time: "3 business days",
    category: "Documents",
    requirements: [
      "Purpose of the request",
      "Addressee or institution name, if applicable",
      "Indicate if compensation details are required",
    ],
    faqs: [
      {
        q: "Can I request a COE with salary?",
        a: "Yes. Select the compensation option in the Smartsheet form and state the purpose.",
      },
      {
        q: "How will I receive it?",
        a: "HR will send the signed digital copy to your company email.",
      },
    ],
  },
  {
    id: "salary",
    icon: WalletCards,
    title: "Basic Salary",
    short: "Ask about salary computation, adjustments, or discrepancies.",
    time: "3–5 business days",
    category: "Payroll",
    requirements: [
      "Applicable payroll period",
      "Expected and received amount",
      "Payslip or supporting screenshot",
    ],
    faqs: [
      {
        q: "When should I submit?",
        a: "Submit after reviewing your payslip and confirming the discrepancy.",
      },
    ],
  },
  {
    id: "overtime",
    icon: Clock3,
    title: "Regular Overtime",
    short: "Clarify missing or incorrect overtime pay.",
    time: "3–5 business days",
    category: "Payroll",
    requirements: [
      "Approved overtime date and hours",
      "Manager approval or schedule",
      "Affected payroll period",
    ],
    faqs: [
      {
        q: "Is approval required?",
        a: "Yes. Attach the approved overtime record before submitting.",
      },
    ],
  },
  {
    id: "holiday",
    icon: CalendarDays,
    title: "Holiday Pay",
    short: "Review holiday eligibility and pay computation.",
    time: "3–5 business days",
    category: "Payroll",
    requirements: [
      "Holiday date",
      "Work schedule or attendance record",
      "Affected payslip",
    ],
    faqs: [
      {
        q: "What if I was on leave before the holiday?",
        a: "Include the leave type and approval so HR can check eligibility.",
      },
    ],
  },
  {
    id: "night",
    icon: Clock3,
    title: "Night Differential",
    short: "Report missing or incorrect night differential pay.",
    time: "3–5 business days",
    category: "Payroll",
    requirements: [
      "Dates and hours worked",
      "Approved shift schedule",
      "Affected payroll period",
    ],
    faqs: [
      {
        q: "What schedule should I attach?",
        a: "Attach the approved schedule covering the affected dates.",
      },
    ],
  },
  {
    id: "deductions",
    icon: WalletCards,
    title: "Deductions",
    short: "Understand an unfamiliar or incorrect payroll deduction.",
    time: "3–5 business days",
    category: "Payroll",
    requirements: [
      "Deduction name and amount",
      "Affected payslip",
      "Completed supporting Excel form for timekeeping-related concerns",
      "Previous related request, if any",
    ],
    faqs: [
      {
        q: "Do I need to attach an Excel form?",
        a: "Yes, for Fiori, Time In/Out, and unpaid Night Differential or Overtime concerns. Download the correct template below, complete the required fields, then attach the Excel file to your Smartsheet submission.",
      },
      {
        q: "Can HR reverse a deduction?",
        a: "HR will validate it first and advise the correction timeline when applicable.",
      },
    ],
    supportingForms: [
      {
        name: "Fiori Correction",
        note: "Use this when worked hours need to be transferred or corrected between job records.",
        templateUrl: "/templates/Fiori-Hours-Correction-Template.xlsx",
        samples: [
          {
            src: "/samples/fiori-file-example.png",
            label: "Expected file naming",
          },
          {
            src: "/samples/fiori-filled-example.png",
            label: "Completed form example",
          },
          {
            src: "/samples/fiori-full-example.png",
            label: "Full worksheet view",
          },
        ],
      },
      {
        name: "Payroll Deduction — Time In / Out",
        note: "Use the TIME IN OUT tab for missing or incorrect clock-in and clock-out entries.",
        templateUrl: "/templates/Payroll-Deduction-Timekeeping-Template.xlsx",
        tab: "TIME IN OUT",
        samples: [
          {
            src: "/samples/payroll-time-in-out-example.png",
            label: "Time In / Out sample",
          },
        ],
      },
      {
        name: "Payroll Deduction — Unpaid ND / OT",
        note: "Use the Unpaid ND_OT tab for unpaid night differential or overtime entries.",
        templateUrl: "/templates/Payroll-Deduction-Timekeeping-Template.xlsx",
        tab: "Unpaid ND_OT",
        samples: [
          {
            src: "/samples/payroll-unpaid-nd-ot-example.png",
            label: "Unpaid ND / OT sample",
          },
          {
            src: "/samples/payroll-template-file.png",
            label: "Expected workbook file",
          },
        ],
      },
    ],
  },
  {
    id: "tax",
    icon: FileQuestion,
    title: "Tax Queries",
    short: "Get help with withholding tax and annual tax documents.",
    time: "5 business days",
    category: "Tax & contributions",
    requirements: [
      "Tax year or payroll period",
      "Specific tax concern",
      "Relevant BIR document, if available",
    ],
    faqs: [
      {
        q: "Can I request my BIR 2316 here?",
        a: "Yes. State the applicable tax year in your request.",
      },
    ],
  },
  {
    id: "contributions",
    icon: ShieldCheck,
    title: "SSS, HDMF & PhilHealth",
    short: "Check regular government contribution records.",
    time: "5–7 business days",
    category: "Tax & contributions",
    requirements: [
      "Agency name",
      "Months with missing contribution",
      "Screenshot from the agency portal",
    ],
    faqs: [
      {
        q: "When will contributions appear?",
        a: "Posting dates vary by agency. HR will confirm remittance and next steps.",
      },
    ],
  },
  {
    id: "sss-loan",
    icon: WalletCards,
    title: "SSS Loans",
    short: "Ask about loan certification and payroll deductions.",
    time: "5 business days",
    category: "Loans",
    requirements: [
      "SSS loan type",
      "Loan reference number",
      "Screenshot of current loan status",
    ],
    faqs: [
      {
        q: "Does HR approve the loan?",
        a: "SSS approves the loan; HR completes the employer certification when required.",
      },
    ],
  },
  {
    id: "pagibig-loan",
    icon: Home,
    title: "Pag-IBIG Loans",
    short: "Get guidance on Pag-IBIG loan certification and deductions.",
    time: "5 business days",
    category: "Loans",
    requirements: [
      "Pag-IBIG loan type",
      "Application or reference number",
      "Screenshot of current status",
    ],
    faqs: [
      {
        q: "Where do I start?",
        a: "Begin in Virtual Pag-IBIG, then use the linked form if employer action is required.",
      },
    ],
  },
  {
    id: "new-hire",
    icon: UserRound,
    title: "New Hire: Waiver / BIR 2316",
    short: "Submit previous-employer BIR 2316 or a waiver.",
    time: "Before HR deadline",
    category: "New hire",
    requirements: [
      "Signed BIR 2316 from previous employer, or",
      "Completed waiver form",
      "Employee ID and start date",
    ],
    faqs: [
      {
        q: "What if my previous employer has not released it?",
        a: "Submit the waiver first and update HR once the document is available.",
      },
    ],
  },
];

const initialSessions: LearningSession[] = [
  {
    id: "nutrition",
    status: "Upcoming",
    date: "SEP 24",
    type: "Wellness talk",
    title: "Nutrition and Lifestyle Interventions in Dyslipidemia Management",
    speaker: "Dr. Angela Cruz",
    length: "3:00 PM – 4:00 PM",
    resources: [],
    registrationLink: "https://forms.office.com/",
    published: true,
  },
  {
    id: "diabetes",
    status: "Upcoming",
    date: "OCT 08",
    type: "Wellness talk",
    title:
      "Empowering Patients through Education & Self-Management in Diabetes Care",
    speaker: "Dr. Miguel Santos",
    length: "2:30 PM – 3:30 PM",
    resources: [],
    registrationLink: "https://forms.office.com/",
    published: true,
  },
  {
    id: "sarcoma",
    status: "Recorded",
    date: "AUG 14",
    type: "Health awareness",
    title: "Sarcoma Awareness and Prevention",
    speaker: "Employee Wellness Team",
    length: "48 min recording",
    resources: ["Teams recording", "Session slides"],
    teamsLink: "https://teams.microsoft.com/",
    materialsLink: "https://company.sharepoint.com/",
    published: true,
  },
  {
    id: "sunlife",
    status: "Recorded",
    date: "JUL 29",
    type: "Benefits & finance",
    title: "SUN LIFE Employee Benefits Orientation + Wealth Basket Session",
    speaker: "Sun Life Benefits Team",
    length: "1 hr 12 min recording",
    resources: ["Teams recording", "Benefits guide"],
    teamsLink: "https://teams.microsoft.com/",
    materialsLink: "https://company.sharepoint.com/",
    published: true,
  },
  {
    id: "resilience",
    status: "Recorded",
    date: "JUN 18",
    type: "Learning session",
    title: "Building Resilience and Managing Workplace Stress",
    speaker: "People & Culture",
    length: "55 min recording",
    resources: ["Teams recording", "Presentation", "Wellness worksheet"],
    teamsLink: "https://teams.microsoft.com/",
    materialsLink: "https://company.sharepoint.com/",
    published: true,
  },
];
const initialAnnouncements: Announcement[] = [
  {
    id: 1,
    date: "SEP 21",
    tag: "Company update",
    title: "Internal Bidding for Sale of Office Supplies and Equipment",
    copy: "Review the available items, bidding guidelines, and submission deadline.",
    pinned: true,
    published: true,
  },
  {
    id: 2,
    date: "SEP 18",
    tag: "Required learning",
    title:
      "Global Workday 101: Basics & General Employee Self-Service (ESS) eLearning",
    copy: "Complete the self-paced module to learn the essential employee actions in Workday.",
    pinned: true,
    published: true,
  },
  {
    id: 3,
    date: "SEP 12",
    tag: "Policy update",
    title: "Updated Hybrid Work and Office Attendance Guidelines",
    copy: "Please review the clarified office attendance, scheduling, and exception process.",
    pinned: false,
    published: true,
  },
  {
    id: 4,
    date: "SEP 05",
    tag: "Employee engagement",
    title: "Volunteer Day Registration Is Now Open",
    copy: "Join colleagues for our upcoming community outreach activity.",
    pinned: false,
    published: true,
  },
];
const concernSeed: Concern[] = [
  {
    id: "HR-2048",
    title: "Attendance correction — Sept. 14",
    updated: "Updated 2 hours ago",
    status: "Additional info needed",
    tone: "amber",
    category: "Attendance",
    employee: "Filmore R.",
    details:
      "My approved shift on September 14 is showing as absent in the attendance record. I attached the schedule approved by my manager.",
    submitted: "September 21 · 9:12 AM",
    hrFeedback:
      "Please upload a copy of your approved schedule showing your manager’s name and approval date so we can complete the attendance validation.",
    attachment: "Approved-schedule-Sept-14.pdf",
  },
  {
    id: "HR-1982",
    title: "August payroll inquiry",
    updated: "Resolved Sept. 5",
    status: "Resolved",
    tone: "green",
    category: "Payroll",
    employee: "Filmore R.",
    details:
      "I would like to confirm the payroll adjustment reflected in my August payslip.",
    submitted: "September 3 · 2:40 PM",
    hrFeedback:
      "The adjustment was validated and included in the September 5 payroll credit. No further action is required.",
    attachment: "August-payslip.pdf",
  },
];

export default function HomePage() {
  const [role, setRole] = useState<Role | null>(null),
    [view, setView] = useState<View>("home"),
    [selectedRequest, setSelectedRequest] = useState<RequestGuide | null>(null);
  const [mobileNav, setMobileNav] = useState(false),
    [search, setSearch] = useState(""),
    [requestOpen, setRequestOpen] = useState(false),
    [submitted, setSubmitted] = useState(false);
  const [registered, setRegistered] = useState<string[]>([]),
    [concerns, setConcerns] = useState<Concern[]>(concernSeed),
    [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [processGuides, setProcessGuides] =
    useState<RequestGuide[]>(initialRequestGuides);
  const [learningSessions, setLearningSessions] =
    useState<LearningSession[]>(initialSessions);
  const publishedAnnouncements = announcements.filter(
    (x) => x.published !== false,
  );
  const filteredRequests = useMemo(() => {
    const q = search.toLowerCase().trim();
    const published = processGuides.filter((x) => x.published !== false);
    return q
      ? published.filter((x) =>
          `${x.title} ${x.short} ${x.category}`.toLowerCase().includes(q),
        )
      : published;
  }, [search, processGuides]);
  const navigate = (next: View) => {
    setView(next);
    setMobileNav(false);
  };
  const signIn = (r: Role) => {
    setRole(r);
    setView(r === "hr" ? "admin" : "home");
  };
  const submitConcern = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const category = String(data.get("category") || "General HR");
    const title = String(data.get("subject") || "New employee support request");
    const details = String(data.get("details") || "");
    setConcerns((c) => [
      {
        id: `HR-${2107 + c.length - 2}`,
        title,
        updated: "Submitted just now",
        status: "Submitted",
        tone: "blue",
        category,
        employee: "Filmore R.",
        details,
        submitted: "September 23 · Just now",
        attachment: "Employee-supporting-document.pdf",
      },
      ...c,
    ]);
    setSubmitted(true);
  };
  if (!role) return <LoginScreen onSignIn={signIn} />;
  return (
    <div className="app-shell">
      <aside className={`side-panel ${mobileNav ? "side-panel--open" : ""}`}>
        <div className="brand-lockup">
          <div className="brand-mark">
            <HeartPulse size={21} />
          </div>
          <div>
            <strong>PeopleHub</strong>
            <span>Employee self-service</span>
          </div>
          <button className="mobile-close" onClick={() => setMobileNav(false)}>
            <X size={20} />
          </button>
        </div>
        <nav className="main-nav">
          <NavItem
            icon={Home}
            label="Home"
            active={view === "home"}
            onClick={() => navigate("home")}
          />
          <NavItem
            icon={Megaphone}
            label="HR Announcements"
            active={view === "announcements"}
            onClick={() => navigate("announcements")}
          />
          <NavItem
            icon={BookOpen}
            label="HR Help Center"
            active={view === "help" || view === "request-detail"}
            onClick={() => navigate("help")}
          />
          <NavItem
            icon={TicketCheck}
            label="My HR Concerns"
            badge="2"
            active={view === "concerns"}
            onClick={() => navigate("concerns")}
          />
          <NavItem
            icon={Sparkles}
            label="Learning & Wellness"
            active={view === "learning"}
            onClick={() => navigate("learning")}
          />
          {role === "hr" && (
            <>
              <div className="nav-divider">HR TOOLS</div>
              <NavItem
                icon={Inbox}
                label="HR Requests"
                badge={String(
                  concerns.filter((c) => c.status !== "Resolved").length,
                )}
                active={view === "admin-requests"}
                onClick={() => navigate("admin-requests")}
              />
              <NavItem
                icon={UserCog}
                label="HR Admin"
                active={view === "admin"}
                onClick={() => navigate("admin")}
              />
            </>
          )}
        </nav>
        <div className="side-callout">
          <CircleHelp size={19} />
          <strong>Need a little help?</strong>
          <p>Find the right HR process or submit a private request.</p>
          <button onClick={() => navigate("help")}>
            Visit Help Center <ArrowRight size={15} />
          </button>
        </div>
        <div className="profile-card">
          <div className="avatar avatar--small">
            {role === "hr" ? "HR" : "FR"}
          </div>
          <div>
            <strong>{role === "hr" ? "HR Administrator" : "Filmore R."}</strong>
            <span>{role === "hr" ? "Content manager" : "Developer"}</span>
          </div>
          <button onClick={() => setRole(null)}>
            <LogOut size={17} />
          </button>
        </div>
      </aside>
      {mobileNav && (
        <button className="nav-scrim" onClick={() => setMobileNav(false)} />
      )}
      <main className="main-panel">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMobileNav(true)}>
            <Menu size={21} />
          </button>
          <div className="top-search">
            <Search size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search HR processes, announcements, and learning"
            />
          </div>
          <div className="top-actions">
            <button className="notification">
              <Bell size={20} />
              <span />
            </button>
            <div className="avatar">{role === "hr" ? "HR" : "FR"}</div>
          </div>
        </header>
        <div className="page-wrap">
          {view === "home" && (
            <Dashboard
              announcements={publishedAnnouncements}
              concerns={concerns}
              onNavigate={navigate}
              onOpenRequest={() => {
                setSubmitted(false);
                setRequestOpen(true);
              }}
            />
          )}
          {view === "announcements" && (
            <Announcements items={publishedAnnouncements} />
          )}
          {view === "help" && (
            <HelpCenter
              guides={filteredRequests}
              onOpenGuide={(g) => {
                setSelectedRequest(g);
                navigate("request-detail");
              }}
              onOpenRequest={() => setRequestOpen(true)}
            />
          )}
          {view === "request-detail" && selectedRequest && (
            <RequestDetail
              item={selectedRequest}
              onBack={() => navigate("help")}
            />
          )}
          {view === "concerns" && (
            <Concerns
              concerns={concerns}
              onOpenRequest={() => setRequestOpen(true)}
              onReply={(id, employeeReply, replyAttachment) =>
                setConcerns((all) =>
                  all.map((c) =>
                    c.id === id
                      ? {
                          ...c,
                          employeeReply,
                          replyAttachment: replyAttachment || undefined,
                          employeeReplyAt: "Updated just now",
                          status: "In review",
                          tone: "blue",
                          updated: "Updated just now",
                        }
                      : c,
                  ),
                )
              }
            />
          )}
          {view === "learning" && (
            <Learning
              sessions={learningSessions.filter((x) => x.published !== false)}
              registered={registered}
              onRegister={(t) =>
                setRegistered((x) => (x.includes(t) ? x : [...x, t]))
              }
            />
          )}
          {view === "admin-requests" && role === "hr" && (
            <AdminRequests
              concerns={concerns}
              onUpdate={(id, status, tone, hrFeedback) =>
                setConcerns((all) =>
                  all.map((c) =>
                    c.id === id
                      ? {
                          ...c,
                          status,
                          tone,
                          hrFeedback,
                          updated: "Updated just now",
                        }
                      : c,
                  ),
                )
              }
            />
          )}
          {view === "admin" && role === "hr" && (
            <Admin
              announcements={announcements}
              sessions={learningSessions}
              guides={processGuides}
              onUpsertAnnouncement={(updated) =>
                setAnnouncements((all) =>
                  all.some((x) => x.id === updated.id)
                    ? all.map((x) => (x.id === updated.id ? updated : x))
                    : [updated, ...all],
                )
              }
              onDeleteAnnouncement={(id) =>
                setAnnouncements((all) => all.filter((x) => x.id !== id))
              }
              onUpsertSession={(updated) =>
                setLearningSessions((all) =>
                  all.some((x) => x.id === updated.id)
                    ? all.map((x) => (x.id === updated.id ? updated : x))
                    : [updated, ...all],
                )
              }
              onDeleteSession={(id) =>
                setLearningSessions((all) => all.filter((x) => x.id !== id))
              }
              onUpsertGuide={(updated) => {
                setProcessGuides((all) =>
                  all.some((g) => g.id === updated.id)
                    ? all.map((g) => (g.id === updated.id ? updated : g))
                    : [...all, updated],
                );
                setSelectedRequest((current) =>
                  current?.id === updated.id ? updated : current,
                );
              }}
              onDeleteGuide={(id) => {
                setProcessGuides((all) => all.filter((g) => g.id !== id));
                setSelectedRequest((current) =>
                  current?.id === id ? null : current,
                );
              }}
            />
          )}
        </div>
      </main>
      <Dialog open={requestOpen} onOpenChange={setRequestOpen}>
        <DialogContent className="request-dialog sm:max-w-[560px]">
          {!submitted ? (
            <form onSubmit={submitConcern}>
              <DialogHeader>
                <div className="dialog-kicker">PRIVATE HR REQUEST</div>
                <DialogTitle>How can we help?</DialogTitle>
                <DialogDescription>
                  Only you and authorized HR team members can view this request.
                </DialogDescription>
              </DialogHeader>
              <div className="form-grid">
                <div>
                  <Label htmlFor="category">Concern type</Label>
                <select id="category" name="category" required defaultValue="">
                    <option value="" disabled>
                      Select a concern
                    </option>
                    <option>Payroll concern</option>
                    <option>Attendance correction</option>
                    <option>Leave & time off</option>
                    <option>Benefits</option>
                    <option>Other HR request</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                  id="subject"
                  name="subject"
                    required
                    placeholder="Short description"
                  />
                </div>
                <div>
                  <Label htmlFor="details">What happened?</Label>
                  <Textarea
                  id="details"
                  name="details"
                    required
                    placeholder="Include the relevant date, pay period, or attendance record."
                    rows={5}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setRequestOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="primary-button">
                  Submit request <ArrowRight size={16} />
                </Button>
              </DialogFooter>
            </form>
          ) : (
            <div className="success-state">
              <div className="success-icon">
                <Check size={28} />
              </div>
              <DialogTitle>Request submitted</DialogTitle>
              <DialogDescription>
                Your reference number is <strong>HR-2107</strong>.
              </DialogDescription>
              <Button
                className="primary-button"
                onClick={() => {
                  setRequestOpen(false);
                  navigate("concerns");
                }}
              >
                View my concerns
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function LoginScreen({ onSignIn }: { onSignIn: (r: Role) => void }) {
  return (
    <main className="login-page">
      <section className="login-brand-panel">
        <div className="login-brand">
          <div className="brand-mark brand-mark--light">
            <HeartPulse size={22} />
          </div>
          <strong>PeopleHub</strong>
        </div>
        <div className="login-message">
          <span className="eyebrow">ONE PLACE FOR EVERY EMPLOYEE</span>
          <h1>
            Find answers.
            <br />
            Take action.
          </h1>
          <p>
            Access HR announcements, guided processes, learning resources, and
            private support in one trusted place.
          </p>
          <div className="login-pills">
            <span>
              <ShieldCheck size={17} /> Company access
            </span>
            <span>
              <Sparkles size={17} /> Employee self-service
            </span>
          </div>
        </div>
        <p className="prototype-note">
          PeopleHub prototype · Internal use only
        </p>
      </section>
      <section className="login-form-panel">
        <div className="login-card">
          <div className="mobile-login-brand">
            <div className="brand-mark">
              <HeartPulse size={20} />
            </div>
            <strong>PeopleHub</strong>
          </div>
          <span className="eyebrow eyebrow--dark">WELCOME</span>
          <h2>Sign in to PeopleHub</h2>
          <p>Use your company account to continue.</p>
          <Button className="sso-button" onClick={() => onSignIn("employee")}>
            <span className="sso-symbol">
              <i />
              <i />
              <i />
              <i />
            </span>
            Sign in with Company SSO
            <ArrowRight size={18} />
          </Button>
          <button className="admin-preview" onClick={() => onSignIn("hr")}>
            <UserCog size={17} /> Preview HR Admin access
          </button>
          <div className="login-security">
            <ShieldCheck size={18} />
            <span>
              <strong>Role-based company access</strong>
              <small>
                HR tools are visible only to authorized HR personnel.
              </small>
            </span>
          </div>
          <p className="demo-label">
            Prototype access · No company credentials required
          </p>
        </div>
      </section>
    </main>
  );
}

function Dashboard({
  announcements,
  concerns,
  onNavigate,
  onOpenRequest,
}: {
  announcements: typeof initialAnnouncements;
  concerns: Concern[];
  onNavigate: (v: View) => void;
  onOpenRequest: () => void;
}) {
  return (
    <>
      <PageHeader
        kicker="MONDAY, SEPTEMBER 21"
        title="Good evening, Filmore."
        copy="Here’s what’s new and what needs your attention."
        action="New HR request"
        onAction={onOpenRequest}
      />
      <section className="attention-banner">
        <AlertCircle size={21} />
        <div>
          <strong>One request needs your response</strong>
          <p>HR needs your approved schedule for attendance request HR-2048.</p>
        </div>
        <button onClick={() => onNavigate("concerns")}>
          View request <ChevronRight size={17} />
        </button>
      </section>
      <div className="dashboard-grid">
        <div>
          <SectionHeading
            title="Latest HR announcements"
            action="View all"
            onAction={() => onNavigate("announcements")}
          />
          <div className="announcement-stack">
            {announcements.slice(0, 2).map((a) => (
              <AnnouncementCard key={a.id} item={a} />
            ))}
          </div>
          <SectionHeading title="Explore employee services" />
          <div className="portal-shortcuts">
            <button onClick={() => onNavigate("help")}>
              <BookOpen />
              <strong>Find the right HR process</strong>
              <span>Guided steps, requirements, FAQs, and forms</span>
              <ChevronRight />
            </button>
            <button onClick={() => onNavigate("learning")}>
              <Sparkles />
              <strong>Learning & Wellness library</strong>
              <span>Upcoming sessions, recordings, and materials</span>
              <ChevronRight />
            </button>
          </div>
        </div>
        <aside className="right-column">
          <section className="panel-card">
            <SectionHeading
              title="My HR concerns"
              action="View all"
              onAction={() => onNavigate("concerns")}
              compact
            />
            {concerns.slice(0, 2).map((c) => (
              <ConcernMini key={c.id} item={c} />
            ))}
          </section>
          <section className="panel-card quick-card">
            <SectionHeading title="Quick links" compact />
            <button>
              <FileText />
              Company policies
              <ChevronRight />
            </button>
            <button>
              <CalendarDays />
              Holiday calendar
              <ChevronRight />
            </button>
            <button>
              <UserRound />
              Update my information
              <ChevronRight />
            </button>
          </section>
        </aside>
      </div>
    </>
  );
}
function Announcements({ items }: { items: typeof initialAnnouncements }) {
  const [filter, setFilter] = useState("All");
  const shown =
    filter === "All" ? items : items.filter((x) => x.tag === filter);
  return (
    <>
      <PageHeader
        kicker="STAY INFORMED"
        title="HR Announcements"
        copy="Company-wide HR updates, policy changes, required learning, and employee activities."
      />
      <div className="filter-row">
        {[
          "All",
          "Company update",
          "Required learning",
          "Policy update",
          "Employee engagement",
        ].map((x) => (
          <button
            className={filter === x ? "active" : ""}
            onClick={() => setFilter(x)}
            key={x}
          >
            {x}
          </button>
        ))}
      </div>
      <div className="announcement-grid">
        {shown.map((a) => (
          <AnnouncementCard key={a.id} item={a} large />
        ))}
      </div>
    </>
  );
}
function HelpCenter({
  guides,
  onOpenGuide,
  onOpenRequest,
}: {
  guides: RequestGuide[];
  onOpenGuide: (x: RequestGuide) => void;
  onOpenRequest: () => void;
}) {
  return (
    <>
      <PageHeader
        kicker="HR HELP CENTER"
        title="Find the right process"
        copy="Review requirements and timelines before opening the appropriate Smartsheet form."
      />
      <div className="category-summary">
        <span>{guides.length} guided processes</span>
        <span>Documents</span>
        <span>Payroll</span>
        <span>Tax & contributions</span>
        <span>Loans</span>
      </div>
      <div className="request-grid">
        {guides.map((g) => (
          <button
            className="request-card"
            onClick={() => onOpenGuide(g)}
            key={g.id}
          >
            <div className="request-icon">
              <g.icon size={21} />
            </div>
            <div>
              <span>{g.category}</span>
              <strong>{g.title}</strong>
              <p>{g.short}</p>
              <small>
                <Clock3 size={13} />
                {g.time}
              </small>
            </div>
            <ChevronRight />
          </button>
        ))}
      </div>
      <section className="info-strip">
        <MessageSquareText size={22} />
        <div>
          <strong>Still not sure where to start?</strong>
          <p>
            Submit a general HR request and the team will route it to the right
            person.
          </p>
        </div>
        <Button variant="outline" onClick={onOpenRequest}>
          Ask HR
        </Button>
      </section>
    </>
  );
}
function RequestDetail({
  item,
  onBack,
}: {
  item: RequestGuide;
  onBack: () => void;
}) {
  const [preview, setPreview] = useState<{ src: string; label: string } | null>(
    null,
  );
  return (
    <>
      <button className="back-button" onClick={onBack}>
        <ArrowLeft size={17} /> Back to all processes
      </button>
      <div className="detail-header">
        <div className="request-icon request-icon--large">
          <item.icon size={26} />
        </div>
        <div>
          <span>{item.category}</span>
          <h1>{item.title}</h1>
          <p>{item.short}</p>
        </div>
        <div className="timeline-box">
          <Clock3 />
          <span>Estimated processing</span>
          <strong>{item.time}</strong>
        </div>
      </div>
      <div className="detail-grid">
        <div>
          <section className="detail-card">
            <h2>Before you submit</h2>
            <p>Prepare the following information to avoid delays:</p>
            <ol>
              {item.requirements.map((x, i) => (
                <li key={x}>
                  <span>{i + 1}</span>
                  {x}
                </li>
              ))}
            </ol>
          </section>
          {!!item.supportingForms?.length && (
            <section className="detail-card form-guide-card">
              <div className="form-guide-heading">
                <div>
                  <span className="guide-badge">
                    <FileText size={14} /> REQUIRED ATTACHMENTS
                  </span>
                  <h2>Download and complete the Excel form</h2>
                  <p>
                    Choose the form that matches your concern. Keep the workbook
                    format unchanged, then upload the completed file to
                    Smartsheet.
                  </p>
                </div>
              </div>
              <div className="supporting-form-list">
                {item.supportingForms.map((form) => (
                  <article className="supporting-form" key={form.name}>
                    <div className="supporting-form-copy">
                      <div className="excel-icon">X</div>
                      <div>
                        <h3>{form.name}</h3>
                        <p>{form.note}</p>
                        {form.tab && (
                          <span>
                            Workbook tab: <b>{form.tab}</b>
                          </span>
                        )}
                      </div>
                      <a href={form.templateUrl} download>
                        <Download size={16} /> Download template
                      </a>
                    </div>
                    <div className="sample-label">Sample screenshots</div>
                    <div className="sample-grid">
                      {form.samples.map((sample) => (
                        <button
                          key={sample.src}
                          onClick={() => setPreview(sample)}
                        >
                          <img src={sample.src} alt={sample.label} />
                          <span>
                            <Maximize2 size={14} />
                            {sample.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
          <section className="detail-card">
            <h2>Frequently asked questions</h2>
            {item.faqs.map((x) => (
              <details key={x.q}>
                <summary>
                  {x.q}
                  <Plus size={16} />
                </summary>
                <p>{x.a}</p>
              </details>
            ))}
          </section>
        </div>
        <aside className="submit-panel">
          <span>READY TO CONTINUE?</span>
          <h3>Open the official request form</h3>
          <p>
            {item.supportingForms?.length
              ? "Complete and save the required Excel form before continuing to Smartsheet."
              : "You’ll be redirected to the company Smartsheet form."}
          </p>
          {item.supportingForms?.length && (
            <div className="submission-check">
              <Check size={16} />
              <span>Excel template completed</span>
            </div>
          )}
          <a
            href={item.formLink || "https://app.smartsheet.com/"}
            target="_blank"
            rel="noreferrer"
          >
            Open Smartsheet form <ExternalLink size={16} />
          </a>
          <hr />
          <small>Need to escalate?</small>
          <strong>{item.contact || "people.support@company.com"}</strong>
          <em>Include the reference number after submission.</em>
        </aside>
      </div>
      <Dialog
        open={!!preview}
        onOpenChange={(open) => !open && setPreview(null)}
      >
        <DialogContent className="sample-dialog sm:max-w-[1080px]">
          <DialogHeader>
            <div className="dialog-kicker">COMPLETED FORM SAMPLE</div>
            <DialogTitle>{preview?.label}</DialogTitle>
            <DialogDescription>
              Use this as a visual guide. Replace all sample information with
              your own request details.
            </DialogDescription>
          </DialogHeader>
          {preview && (
            <div className="sample-preview">
              <img src={preview.src} alt={preview.label} />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreview(null)}>
              Close preview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
function Learning({
  sessions,
  registered,
  onRegister,
}: {
  sessions: LearningSession[];
  registered: string[];
  onRegister: (x: string) => void;
}) {
  const [tab, setTab] = useState<"Upcoming" | "Library">("Upcoming"),
    [selectedVideo, setSelectedVideo] = useState<LearningSession | null>(null),
    [playing, setPlaying] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);
  const shown =
    tab === "Upcoming"
      ? sessions.filter((x) => x.status === "Upcoming")
      : sessions.filter((x) => x.status !== "Upcoming");
  const openVideo = (session: LearningSession) => {
    setSelectedVideo(session);
    setPlaying(false);
  };
  const toggleFullscreen = async () => {
    if (!playerRef.current) return;
    if (document.fullscreenElement) await document.exitFullscreen();
    else await playerRef.current.requestFullscreen();
  };
  return (
    <>
      <PageHeader
        kicker="LEARN, GROW & THRIVE"
        title="Learning & Wellness"
        copy="A central library for upcoming sessions, Teams recordings, and useful materials."
      />
      <div className="learning-summary">
        <div>
          <Sparkles />
          <strong>Never miss a useful session.</strong>
          <p>
            Register for upcoming talks or revisit previous HR learning anytime.
          </p>
        </div>
        <span>
          <b>{sessions.filter((x) => x.status !== "Upcoming").length}</b> past
          sessions available
        </span>
      </div>
      <div className="tab-row">
        <button
          className={tab === "Upcoming" ? "active" : ""}
          onClick={() => setTab("Upcoming")}
        >
          Upcoming sessions
        </button>
        <button
          className={tab === "Library" ? "active" : ""}
          onClick={() => setTab("Library")}
        >
          Past sessions & resources
        </button>
      </div>
      <div className="session-grid">
        {shown.map((s) => (
          <article className="session-card" key={s.title}>
            <div className="session-top">
              <span
                className={`session-status ${s.status === "Recorded" ? "recorded" : ""}`}
              >
                {s.status === "Recorded" && <Play size={12} />} {s.status}
              </span>
              <time>{s.date}</time>
            </div>
            <small>{s.type}</small>
            <h3>{s.title}</h3>
            <p>
              {s.speaker} · {s.length}
            </p>
            {s.status === "Upcoming" ? (
              <Button
                className={
                  registered.includes(s.title)
                    ? "registered-button"
                    : "primary-button"
                }
                variant={registered.includes(s.title) ? "outline" : "default"}
                onClick={() => onRegister(s.title)}
              >
                {registered.includes(s.title) ? (
                  <>
                    <Check size={15} /> Registered
                  </>
                ) : (
                  "Register"
                )}
              </Button>
            ) : (
              <div className="resource-list">
                {s.resources.map((r) => (
                  <button
                    key={r}
                    onClick={() => r.includes("recording") && openVideo(s)}
                  >
                    {r.includes("recording") ? (
                      <Play size={15} />
                    ) : (
                      <Download size={15} />
                    )}{" "}
                    {r}
                    <ExternalLink size={13} />
                  </button>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
      <Dialog
        open={!!selectedVideo}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedVideo(null);
            setPlaying(false);
          }
        }}
      >
        <DialogContent className="video-dialog sm:max-w-[920px]">
          <DialogHeader>
            <div className="dialog-kicker">MICROSOFT TEAMS RECORDING</div>
            <DialogTitle>{selectedVideo?.title}</DialogTitle>
            <DialogDescription>
              {selectedVideo?.speaker} · {selectedVideo?.length}
            </DialogDescription>
          </DialogHeader>
          <div className="placeholder-player" ref={playerRef}>
            <div className="video-stage">
              <div className="video-brand">
                <span className="teams-mark">T</span>
                <span>PeopleHub Learning</span>
              </div>
              <div className="video-center">
                <button
                  onClick={() => setPlaying((x) => !x)}
                  aria-label={playing ? "Pause recording" : "Play recording"}
                >
                  {playing ? (
                    <Pause size={30} />
                  ) : (
                    <Play size={30} fill="currentColor" />
                  )}
                </button>
                <strong>
                  {playing
                    ? "Playing sample recording"
                    : "Recorded session preview"}
                </strong>
                <span>{selectedVideo?.title}</span>
              </div>
              <div className="video-placeholder-note">
                Placeholder video for presentation
              </div>
            </div>
            <div className="video-controls">
              <button
                onClick={() => setPlaying((x) => !x)}
                aria-label={playing ? "Pause" : "Play"}
              >
                {playing ? <Pause /> : <Play fill="currentColor" />}
              </button>
              <span className="video-time">
                {playing ? "12:18" : "00:00"} /{" "}
                {selectedVideo?.length.match(/\d+\s*(?:hr|min)/)?.[0] ||
                  "55 min"}
              </span>
              <div className="video-progress">
                <i className={playing ? "video-progress--playing" : ""} />
              </div>
              <Volume2 />
              <button
                onClick={toggleFullscreen}
                aria-label="View full screen"
                title="Full screen"
              >
                <Maximize2 />
              </button>
            </div>
          </div>
          <div className="video-footer">
            <span>
              <ShieldCheck size={16} /> Internal recording · Company access only
            </span>
            <Button variant="outline" onClick={toggleFullscreen}>
              <Maximize2 size={16} /> Full-screen view
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
function Concerns({
  concerns,
  onOpenRequest,
  onReply,
}: {
  concerns: Concern[];
  onOpenRequest: () => void;
  onReply: (id: string, reply: string, attachment: string) => void;
}) {
  const [selected, setSelected] = useState<Concern | null>(null);
  const [reply, setReply] = useState("");
  const [replyAttachment, setReplyAttachment] = useState("");
  const [replySent, setReplySent] = useState(false);
  const openConcern = (concern: Concern) => {
    setSelected(concern);
    setReply("");
    setReplyAttachment("");
    setReplySent(false);
  };
  const sendReply = () => {
    if (!selected || (!reply.trim() && !replyAttachment)) return;
    onReply(selected.id, reply.trim(), replyAttachment);
    setSelected({
      ...selected,
      employeeReply: reply.trim(),
      replyAttachment: replyAttachment || undefined,
      employeeReplyAt: "Updated just now",
      status: "In review",
      tone: "blue",
      updated: "Updated just now",
    });
    setReplySent(true);
  };
  return (
    <>
      <PageHeader
        kicker="PRIVATE & SECURE"
        title="My HR Concerns"
        copy="Track every request without searching through email threads."
        action="New HR request"
        onAction={onOpenRequest}
      />
      <div className="concern-table">
        <div className="table-head">
          <span>Request</span>
          <span>Last update</span>
          <span>Status</span>
          <span />
        </div>
        {concerns.map((c) => (
          <button className="table-row" key={c.id} onClick={() => openConcern(c)}>
            <div>
              <small>{c.id}</small>
              <strong>{c.title}</strong>
            </div>
            <span>{c.updated}</span>
            <span className={`status status--${c.tone}`}>{c.status}</span>
            <ChevronRight />
          </button>
        ))}
      </div>
      <div className="privacy-note">
        <ShieldCheck />
        <span>
          <strong>Your concerns are private.</strong> Details are visible only
          to you and authorized HR team members.
        </span>
      </div>
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="concern-detail-dialog sm:max-w-[760px]">
          <DialogHeader>
            <div className="dialog-kicker">PRIVATE REQUEST · {selected?.id}</div>
            <DialogTitle>{selected?.title}</DialogTitle>
            <DialogDescription>
              {selected?.category} · Submitted {selected?.submitted}
            </DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="employee-concern-detail">
              <div className="concern-detail-summary">
                <span className={`status status--${selected.tone}`}>{selected.status}</span>
                <small>Last update: {selected.updated}</small>
              </div>
              <section>
                <h3>Your concern</h3>
                <p>{selected.details}</p>
                {selected.attachment && (
                  <div className="attachment-chip">
                    <FileText size={16} />
                    <span>{selected.attachment}<small>Employee attachment</small></span>
                    <Download size={15} />
                  </div>
                )}
              </section>
              <section className={`hr-response-card ${selected.hrFeedback ? "has-response" : ""}`}>
                <div className="hr-response-icon">HR</div>
                <div>
                  <span>HR RESPONSE</span>
                  <h3>{selected.hrFeedback ? "Message from HR Support" : "Awaiting HR review"}</h3>
                  <p>{selected.hrFeedback || "Your request has been received. HR will post an update here after reviewing the information you submitted."}</p>
                  {selected.hrFeedback && <small>{selected.updated}</small>}
                </div>
              </section>
              {selected.employeeReply && (
                <section className="employee-response-card">
                  <span>YOUR RESPONSE</span>
                  <h3>Additional information sent to HR</h3>
                  {selected.employeeReply && <p>{selected.employeeReply}</p>}
                  {selected.replyAttachment && (
                    <div className="reply-attachment-chip">
                      <FileText size={15} />
                      <span>{selected.replyAttachment}</span>
                      <Download size={14} />
                    </div>
                  )}
                  <small>{selected.employeeReplyAt}</small>
                </section>
              )}
              {selected.status === "Additional info needed" && !replySent && (
                <section className="employee-reply-composer">
                  <div>
                    <h3>Reply to HR</h3>
                    <p>Provide the requested details below. You may also attach a supporting document.</p>
                  </div>
                  <Label htmlFor="employee-reply">Your response</Label>
                  <Textarea
                    id="employee-reply"
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    rows={4}
                    placeholder="Example: The job code I am using is PRJ-8421-DEV. The error appears when I submit my timesheet."
                  />
                  <div className="reply-actions">
                    <label className="file-upload-control" htmlFor="employee-reply-file">
                      <Upload size={15} /> {replyAttachment ? "Change attachment" : "Attach document"}
                    </label>
                    <input
                      id="employee-reply-file"
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                      onChange={(e) => setReplyAttachment(e.target.files?.[0]?.name || "")}
                    />
                    <Button
                      className="primary-button"
                      onClick={sendReply}
                      disabled={!reply.trim() && !replyAttachment}
                    >
                      <Send size={15} /> Send response
                    </Button>
                  </div>
                  {replyAttachment && (
                    <div className="selected-file">
                      <FileText size={15} />
                      <span>{replyAttachment}</span>
                      <button type="button" onClick={() => setReplyAttachment("")} aria-label="Remove attachment"><X size={14} /></button>
                    </div>
                  )}
                  <small className="reply-privacy"><ShieldCheck size={13} /> Only you and authorized HR team members can view this response.</small>
                </section>
              )}
              {replySent && (
                <div className="reply-success"><Check size={17} /><span><strong>Response sent to HR</strong>Your request is now back in review.</span></div>
              )}
              <section className="employee-activity"><h3>Request activity</h3><div className="activity-item"><span/><div><strong>Request submitted</strong><p>You submitted this concern through PeopleHub.</p><small>{selected.submitted}</small></div></div>{selected.hrFeedback && <div className="activity-item"><span/><div><strong>HR response posted</strong><p>HR requested or shared additional information.</p><small>{selected.updated}</small></div></div>}{selected.employeeReply && <div className="activity-item"><span/><div><strong>You replied to HR</strong><p>Additional information{selected.replyAttachment ? " and a supporting document were" : " was"} sent.</p><small>{selected.employeeReplyAt}</small></div></div>}</section>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setSelected(null)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
function AdminRequests({
  concerns,
  onUpdate,
}: {
  concerns: Concern[];
  onUpdate: (id: string, status: string, tone: string, hrFeedback: string) => void;
}) {
  const [filter, setFilter] = useState("All"),
    [selected, setSelected] = useState<Concern | null>(null),
    [status, setStatus] = useState(""),
    [note, setNote] = useState(""),
    [saved, setSaved] = useState(false);
  const shown =
    filter === "All"
      ? concerns
      : filter === "Open"
        ? concerns.filter((c) => c.status !== "Resolved")
        : concerns.filter((c) => c.status === "Resolved");
  const openRequest = (item: Concern) => {
    setSelected(item);
    setStatus(item.status);
    setNote(item.hrFeedback || "");
    setSaved(false);
  };
  const save = () => {
    if (!selected) return;
    const tone =
      status === "Resolved"
        ? "green"
        : status === "Additional info needed"
          ? "amber"
          : "blue";
    onUpdate(selected.id, status, tone, note);
    setSelected({ ...selected, status, tone, hrFeedback: note, updated: "Updated just now" });
    setSaved(true);
  };
  return (
    <>
      <PageHeader
        kicker="AUTHORIZED HR ACCESS"
        title="Employee HR Requests"
        copy="Review employee concerns, request supporting information, and keep each employee updated."
      />
      <div className="request-overview">
        <div>
          <Inbox />
          <span>
            <b>{concerns.length}</b>Total requests
          </span>
        </div>
        <div>
          <Clock3 />
          <span>
            <b>{concerns.filter((c) => c.status !== "Resolved").length}</b>Open
            requests
          </span>
        </div>
        <div>
          <AlertCircle />
          <span>
            <b>
              {
                concerns.filter((c) => c.status === "Additional info needed")
                  .length
              }
            </b>
            Waiting for employee
          </span>
        </div>
        <div>
          <Check />
          <span>
            <b>{concerns.filter((c) => c.status === "Resolved").length}</b>
            Resolved
          </span>
        </div>
      </div>
      <div className="admin-request-toolbar">
        <div className="filter-row">
          {["All", "Open", "Resolved"].map((x) => (
            <button
              key={x}
              className={filter === x ? "active" : ""}
              onClick={() => setFilter(x)}
            >
              {x}
            </button>
          ))}
        </div>
        <span>
          {shown.length} request{shown.length === 1 ? "" : "s"}
        </span>
      </div>
      <div className="admin-request-table">
        <div className="admin-request-head">
          <span>Request & employee</span>
          <span>Category</span>
          <span>Last update</span>
          <span>Status</span>
          <span />
        </div>
        {shown.map((c) => (
          <button
            className="admin-request-row"
            key={c.id}
            onClick={() => openRequest(c)}
          >
            <div>
              <small>{c.id}</small>
              <strong>{c.title}</strong>
              <em>{c.employee} · Employee</em>
            </div>
            <span>{c.category}</span>
            <span>{c.updated}</span>
            <span className={`status status--${c.tone}`}>{c.status}</span>
            <ChevronRight />
          </button>
        ))}
      </div>
      <div className="admin-privacy-note">
        <ShieldCheck />
        <span>
          <strong>Restricted employee data</strong> Only authorized HR/Payroll
          administrators can open and update these requests.
        </span>
      </div>
      <Dialog
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
      >
        <DialogContent className="request-review-dialog sm:max-w-[720px]">
          <DialogHeader>
            <div className="dialog-kicker">
              EMPLOYEE REQUEST · {selected?.id}
            </div>
            <DialogTitle>{selected?.title}</DialogTitle>
            <DialogDescription>
              Submitted by {selected?.employee} · Last
              activity: {selected?.updated}
            </DialogDescription>
          </DialogHeader>
          <div className="request-review-grid">
            <section>
              <h3>Employee concern</h3>
              <p>{selected?.details}</p>
              <div className="attachment-chip">
                <FileText size={16} />
                <span>
                  {selected?.attachment || "Supporting-document.pdf"}
                  <small>Employee attachment · 248 KB</small>
                </span>
                <Download size={15} />
              </div>
              {selected?.employeeReply && (
                <div className="admin-employee-response">
                  <span>EMPLOYEE RESPONSE</span>
                  <strong>Additional information received</strong>
                  <p>{selected.employeeReply}</p>
                  {selected.replyAttachment && (
                    <div className="reply-attachment-chip">
                      <FileText size={15} />
                      <span>{selected.replyAttachment}</span>
                      <Download size={14} />
                    </div>
                  )}
                  <small>{selected.employeeReplyAt}</small>
                </div>
              )}
              <h3>Request activity</h3>
              <div className="activity-item">
                <span />
                <div>
                  <strong>Request submitted</strong>
                  <p>Employee submitted the concern through PeopleHub.</p>
                  <small>{selected?.submitted}</small>
                </div>
              </div>
              <div className="activity-item">
                <span />
                <div>
                  <strong>Assigned to HR Support</strong>
                  <p>The request is ready for review.</p>
                  <small>September 21 · 9:18 AM</small>
                </div>
              </div>
              {selected?.hrFeedback && <div className="activity-item"><span/><div><strong>Previous HR response</strong><p>{selected.hrFeedback}</p><small>{selected.updated}</small></div></div>}
              {selected?.employeeReply && <div className="activity-item"><span/><div><strong>Employee sent additional information</strong><p>{selected.replyAttachment ? "A reply and supporting document are ready for review." : "The employee replied to HR."}</p><small>{selected.employeeReplyAt}</small></div></div>}
            </section>
            <aside>
              <Label htmlFor="request-owner">Assigned team</Label>
              <select id="request-owner" defaultValue="HR Support">
                <option>HR Support</option>
                <option>Payroll</option>
                <option>Benefits</option>
              </select>
              <Label htmlFor="request-status">Update status</Label>
              <select
                id="request-status"
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setSaved(false);
                }}
              >
                <option>Submitted</option>
                <option>In review</option>
                <option>Additional info needed</option>
                <option>Resolved</option>
              </select>
              <Label htmlFor="request-note">Message to employee</Label>
              <Textarea
                id="request-note"
                value={note}
                onChange={(e) => {
                  setNote(e.target.value);
                  setSaved(false);
                }}
                rows={5}
                placeholder="Add a clear update or request supporting information..."
              />
              <small className="visibility-note">
                <ShieldCheck size={14} /> This message will be visible to the
                employee.
              </small>
            </aside>
          </div>
          <DialogFooter>
            <span className={`save-confirmation ${saved ? "show" : ""}`}>
              <Check size={15} /> Employee view updated
            </span>
            <Button
              type="button"
              variant="outline"
              onClick={() => setSelected(null)}
            >
              Close
            </Button>
            <Button className="primary-button" onClick={save}>
              <Send size={15} /> Save update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function AdminLegacy({
  announcements,
  guides,
  onAddAnnouncement,
  onSaveGuide,
}: {
  announcements: typeof initialAnnouncements;
  guides: RequestGuide[];
  onAddAnnouncement: () => void;
  onSaveGuide: (g: RequestGuide) => void;
}) {
  const [guideOpen, setGuideOpen] = useState(false),
    [saved, setSaved] = useState(false),
    [draft, setDraft] = useState<RequestGuide>(guides[0]);
  const chooseGuide = (id?: string) => {
    const found = guides.find((g) => g.id === (id || draft.id)) || guides[0];
    setDraft({
      ...found,
      requirements: [...found.requirements],
      faqs: found.faqs.map((x) => ({ ...x })),
    });
    setSaved(false);
    setGuideOpen(true);
  };
  const update = (field: keyof RequestGuide, value: unknown) =>
    setDraft((current) => ({ ...current, [field]: value }));
  const save = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveGuide(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };
  return (
    <>
      <PageHeader
        kicker="AUTHORIZED HR ACCESS"
        title="HR Admin"
        copy="Manage the employee-facing content available across PeopleHub."
        action="New announcement"
        onAction={onAddAnnouncement}
      />
      <div className="admin-stats">
        <div>
          <Megaphone />
          <span>
            <b>{announcements.length}</b> Published announcements
          </span>
        </div>
        <div>
          <Play />
          <span>
            <b>2</b> Session recordings
          </span>
        </div>
        <button onClick={() => chooseGuide()}>
          <BookOpen />
          <span>
            <b>{guides.length}</b> Process guides
            <small>Manage Help Center</small>
          </span>
        </button>
        <div>
          <FileText />
          <span>
            <b>14</b> Knowledge articles
          </span>
        </div>
      </div>
      <div className="admin-layout">
        <section className="admin-content">
          <div className="admin-heading">
            <div>
              <h2>Content management</h2>
              <p>Recently published employee content</p>
            </div>
            <button>View all content</button>
          </div>
          {announcements.slice(0, 4).map((a) => (
            <div className="admin-row" key={a.id}>
              <div className="admin-type">
                <Megaphone />
              </div>
              <div>
                <span>{a.tag}</span>
                <strong>{a.title}</strong>
                <small>Published · {a.date}</small>
              </div>
              <button>
                <Pencil size={16} /> Edit
              </button>
            </div>
          ))}
        </section>
        <aside className="admin-actions">
          <h2>Quick publish</h2>
          <button onClick={onAddAnnouncement}>
            <Megaphone />
            <span>
              <strong>Announcement</strong>
              <small>Publish an HR update</small>
            </span>
            <Plus />
          </button>
          <button>
            <Upload />
            <span>
              <strong>Session recording</strong>
              <small>Add Teams link and materials</small>
            </span>
            <Plus />
          </button>
          <button onClick={() => chooseGuide()}>
            <BookOpen />
            <span>
              <strong>HR Process Guide</strong>
              <small>Update Help Center processes</small>
            </span>
            <Plus />
          </button>
          <div className="admin-note">
            <ShieldCheck />
            <p>
              <strong>Protected workspace</strong>Only authorized HR roles can
              access this page.
            </p>
          </div>
        </aside>
      </div>
      <Dialog open={guideOpen} onOpenChange={setGuideOpen}>
        <DialogContent className="process-editor sm:max-w-[760px]">
          <form onSubmit={save}>
            <DialogHeader>
              <div className="dialog-kicker">HR HELP CENTER</div>
              <DialogTitle>Manage process guide</DialogTitle>
              <DialogDescription>
                Published changes immediately appear in the employee-facing Help
                Center for this demo.
              </DialogDescription>
            </DialogHeader>
            <div className="editor-grid">
              <div className="editor-full">
                <Label htmlFor="guide-select">Select process</Label>
                <select
                  id="guide-select"
                  value={draft.id}
                  onChange={(e) => chooseGuide(e.target.value)}
                >
                  {guides.map((g) => (
                    <option value={g.id} key={g.id}>
                      {g.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="guide-title">Process title</Label>
                <Input
                  id="guide-title"
                  value={draft.title}
                  onChange={(e) => update("title", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="guide-category">Category</Label>
                <Input
                  id="guide-category"
                  value={draft.category}
                  onChange={(e) => update("category", e.target.value)}
                  required
                />
              </div>
              <div className="editor-full">
                <Label htmlFor="guide-description">
                  Employee-facing description
                </Label>
                <Textarea
                  id="guide-description"
                  value={draft.short}
                  onChange={(e) => update("short", e.target.value)}
                  rows={2}
                  required
                />
              </div>
              <div>
                <Label htmlFor="guide-time">Processing timeline</Label>
                <Input
                  id="guide-time"
                  value={draft.time}
                  onChange={(e) => update("time", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="guide-status">Publishing status</Label>
                <select
                  id="guide-status"
                  value={draft.published === false ? "draft" : "published"}
                  onChange={(e) =>
                    update("published", e.target.value === "published")
                  }
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft / hidden</option>
                </select>
              </div>
              <div className="editor-full">
                <Label htmlFor="guide-requirements">
                  Requirements <small>One item per line</small>
                </Label>
                <Textarea
                  id="guide-requirements"
                  value={draft.requirements.join("\n")}
                  onChange={(e) =>
                    update(
                      "requirements",
                      e.target.value.split("\n").filter(Boolean),
                    )
                  }
                  rows={4}
                  required
                />
              </div>
              <div>
                <Label htmlFor="guide-form">Smartsheet form link</Label>
                <Input
                  id="guide-form"
                  type="url"
                  value={draft.formLink || "https://app.smartsheet.com/"}
                  onChange={(e) => update("formLink", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="guide-contact">Escalation contact</Label>
                <Input
                  id="guide-contact"
                  value={draft.contact || "people.support@company.com"}
                  onChange={(e) => update("contact", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="guide-faq-question">FAQ question</Label>
                <Input
                  id="guide-faq-question"
                  value={draft.faqs[0]?.q || ""}
                  onChange={(e) =>
                    update("faqs", [
                      { q: e.target.value, a: draft.faqs[0]?.a || "" },
                      ...draft.faqs.slice(1),
                    ])
                  }
                />
              </div>
              <div>
                <Label htmlFor="guide-faq-answer">FAQ answer</Label>
                <Textarea
                  id="guide-faq-answer"
                  value={draft.faqs[0]?.a || ""}
                  onChange={(e) =>
                    update("faqs", [
                      { q: draft.faqs[0]?.q || "", a: e.target.value },
                      ...draft.faqs.slice(1),
                    ])
                  }
                  rows={2}
                />
              </div>
            </div>
            <DialogFooter>
              <span className={`save-confirmation ${saved ? "show" : ""}`}>
                <Check size={15} /> Changes reflected in HR Help Center
              </span>
              <Button
                type="button"
                variant="outline"
                onClick={() => setGuideOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="primary-button">
                Save & publish
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

function AnnouncementManager({
  open,
  onOpenChange,
  items,
  onUpsert,
  onDelete,
}: {
  open: boolean;
  onOpenChange: (x: boolean) => void;
  items: Announcement[];
  onUpsert: (x: Announcement) => void;
  onDelete: (id: number) => void;
}) {
  const blank = (): Announcement => ({
    id: Math.max(0, ...items.map((x) => x.id)) + 1,
    date: "SEP 23",
    tag: "Company update",
    title: "",
    copy: "",
    pinned: false,
    published: true,
  });
  const [editor, setEditor] = useState<Announcement | null>(null),
    [preview, setPreview] = useState<Announcement | null>(null),
    [deleting, setDeleting] = useState<Announcement | null>(null),
    [notice, setNotice] = useState("");
  const flash = (x: string) => {
    setNotice(x);
    window.setTimeout(() => setNotice(""), 2200);
  };
  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editor) return;
    onUpsert(editor);
    setEditor(null);
    flash("Announcement saved and employee view updated");
  };
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="guide-manager sm:max-w-[980px]">
          <DialogHeader>
            <div className="dialog-kicker">
              HR ANNOUNCEMENTS · CONTENT MANAGEMENT
            </div>
            <DialogTitle>Announcements</DialogTitle>
            <DialogDescription>
              View, add, update, publish, or remove announcements shown to
              employees.
            </DialogDescription>
          </DialogHeader>
          <div className="guide-manager-toolbar">
            <div>
              <strong>{items.length} announcements</strong>
              <span>
                {items.filter((x) => x.published !== false).length} published ·{" "}
                {items.filter((x) => x.published === false).length} draft
              </span>
            </div>
            <Button
              className="primary-button"
              onClick={() => setEditor(blank())}
            >
              <Plus size={16} /> Add announcement
            </Button>
          </div>
          <div className={`manager-notice ${notice ? "show" : ""}`}>
            <Check size={16} />
            {notice || "Changes saved"}
          </div>
          <div className="guide-admin-list">
            {items.map((item) => (
              <article className="guide-admin-row" key={item.id}>
                <div className="guide-admin-icon">
                  <Megaphone size={19} />
                </div>
                <div className="guide-admin-copy">
                  <span>
                    {item.tag} · {item.date}
                  </span>
                  <strong>{item.title}</strong>
                  <small>{item.copy}</small>
                </div>
                <div
                  className={`publish-chip ${item.published === false ? "draft" : "published"}`}
                >
                  {item.published === false ? "Draft" : "Published"}
                </div>
                <div className="guide-row-actions">
                  <button onClick={() => setPreview(item)}>
                    <Eye size={16} />
                    <span>View</span>
                  </button>
                  <button onClick={() => setEditor({ ...item })}>
                    <Pencil size={16} />
                    <span>Edit</span>
                  </button>
                  <button className="delete" onClick={() => setDeleting(item)}>
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={!!editor} onOpenChange={(x) => !x && setEditor(null)}>
        <DialogContent className="process-editor sm:max-w-[720px]">
          {editor && (
            <form onSubmit={save}>
              <DialogHeader>
                <div className="dialog-kicker">HR ANNOUNCEMENT</div>
                <DialogTitle>
                  {items.some((x) => x.id === editor.id)
                    ? "Update announcement"
                    : "Add announcement"}
                </DialogTitle>
                <DialogDescription>
                  Published announcements immediately appear on Home and HR
                  Announcements.
                </DialogDescription>
              </DialogHeader>
              <div className="editor-grid">
                <div className="editor-full">
                  <Label htmlFor="announcement-title">Title</Label>
                  <Input
                    id="announcement-title"
                    value={editor.title}
                    onChange={(e) =>
                      setEditor({ ...editor, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="announcement-category">Category</Label>
                  <select
                    id="announcement-category"
                    value={editor.tag}
                    onChange={(e) =>
                      setEditor({ ...editor, tag: e.target.value })
                    }
                  >
                    <option>Company update</option>
                    <option>Required learning</option>
                    <option>Policy update</option>
                    <option>Employee engagement</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="announcement-date">Display date</Label>
                  <Input
                    id="announcement-date"
                    value={editor.date}
                    onChange={(e) =>
                      setEditor({
                        ...editor,
                        date: e.target.value.toUpperCase(),
                      })
                    }
                    required
                  />
                </div>
                <div className="editor-full">
                  <Label htmlFor="announcement-copy">Summary</Label>
                  <Textarea
                    id="announcement-copy"
                    value={editor.copy}
                    onChange={(e) =>
                      setEditor({ ...editor, copy: e.target.value })
                    }
                    rows={4}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="announcement-pin">Pin announcement</Label>
                  <select
                    id="announcement-pin"
                    value={editor.pinned ? "yes" : "no"}
                    onChange={(e) =>
                      setEditor({ ...editor, pinned: e.target.value === "yes" })
                    }
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="announcement-status">Publishing status</Label>
                  <select
                    id="announcement-status"
                    value={editor.published === false ? "draft" : "published"}
                    onChange={(e) =>
                      setEditor({
                        ...editor,
                        published: e.target.value === "published",
                      })
                    }
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft / hidden</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditor(null)}
                >
                  Cancel
                </Button>
                <Button className="primary-button" type="submit">
                  <Check size={16} /> Save announcement
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={!!preview} onOpenChange={(x) => !x && setPreview(null)}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <div className="dialog-kicker">EMPLOYEE VIEW PREVIEW</div>
            <DialogTitle>{preview?.title}</DialogTitle>
            <DialogDescription>
              {preview?.tag} · {preview?.date} ·{" "}
              {preview?.published === false ? "Draft" : "Published"}
            </DialogDescription>
          </DialogHeader>
          {preview && <AnnouncementCard item={preview} large />}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreview(null)}>
              Close preview
            </Button>
            <Button
              className="primary-button"
              onClick={() => {
                setEditor(preview);
                setPreview(null);
              }}
            >
              <Pencil size={15} /> Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog
        open={!!deleting}
        onOpenChange={(x) => !x && setDeleting(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete “{deleting?.title}”?</AlertDialogTitle>
            <AlertDialogDescription>
              It will be removed from the employee portal for this demo session.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep announcement</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (deleting) {
                  onDelete(deleting.id);
                  setDeleting(null);
                  flash("Announcement deleted");
                }
              }}
            >
              <Trash2 size={15} /> Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function SessionManager({
  open,
  onOpenChange,
  items,
  onUpsert,
  onDelete,
}: {
  open: boolean;
  onOpenChange: (x: boolean) => void;
  items: LearningSession[];
  onUpsert: (x: LearningSession) => void;
  onDelete: (id: string) => void;
}) {
  const blank = (): LearningSession => ({
    id: `session-${items.length + 1}`,
    status: "Upcoming",
    date: "SEP 30",
    type: "Wellness talk",
    title: "",
    speaker: "HR Learning Team",
    length: "3:00 PM – 4:00 PM",
    resources: [],
    registrationLink: "https://forms.office.com/",
    published: true,
  });
  const [editor, setEditor] = useState<LearningSession | null>(null),
    [preview, setPreview] = useState<LearningSession | null>(null),
    [deleting, setDeleting] = useState<LearningSession | null>(null),
    [notice, setNotice] = useState("");
  const flash = (x: string) => {
    setNotice(x);
    window.setTimeout(() => setNotice(""), 2200);
  };
  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editor) return;
    onUpsert(editor);
    setEditor(null);
    flash("Session saved and Learning & Wellness updated");
  };
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="guide-manager sm:max-w-[980px]">
          <DialogHeader>
            <div className="dialog-kicker">
              LEARNING & WELLNESS · CONTENT MANAGEMENT
            </div>
            <DialogTitle>Learning & Wellness sessions</DialogTitle>
            <DialogDescription>
              Manage upcoming events, registration links, Teams recordings, and
              session materials.
            </DialogDescription>
          </DialogHeader>
          <div className="guide-manager-toolbar">
            <div>
              <strong>{items.length} sessions</strong>
              <span>
                {items.filter((x) => x.status === "Upcoming").length} upcoming ·{" "}
                {items.filter((x) => x.status !== "Upcoming").length} recorded
              </span>
            </div>
            <Button
              className="primary-button"
              onClick={() => setEditor(blank())}
            >
              <Plus size={16} /> Add session
            </Button>
          </div>
          <div className={`manager-notice ${notice ? "show" : ""}`}>
            <Check size={16} />
            {notice || "Changes saved"}
          </div>
          <div className="guide-admin-list">
            {items.map((item) => (
              <article className="guide-admin-row" key={item.id}>
                <div className="guide-admin-icon">
                  {item.status === "Upcoming" ? (
                    <CalendarDays size={19} />
                  ) : (
                    <Play size={19} />
                  )}
                </div>
                <div className="guide-admin-copy">
                  <span>
                    {item.status} · {item.type} · {item.date}
                  </span>
                  <strong>{item.title}</strong>
                  <small>
                    {item.speaker} · {item.length}
                  </small>
                </div>
                <div
                  className={`publish-chip ${item.published === false ? "draft" : "published"}`}
                >
                  {item.published === false ? "Draft" : "Published"}
                </div>
                <div className="guide-row-actions">
                  <button onClick={() => setPreview(item)}>
                    <Eye size={16} />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() =>
                      setEditor({ ...item, resources: [...item.resources] })
                    }
                  >
                    <Pencil size={16} />
                    <span>Edit</span>
                  </button>
                  <button className="delete" onClick={() => setDeleting(item)}>
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={!!editor} onOpenChange={(x) => !x && setEditor(null)}>
        <DialogContent className="process-editor sm:max-w-[760px]">
          {editor && (
            <form onSubmit={save}>
              <DialogHeader>
                <div className="dialog-kicker">LEARNING & WELLNESS</div>
                <DialogTitle>
                  {items.some((x) => x.id === editor.id)
                    ? "Update session"
                    : "Add session"}
                </DialogTitle>
                <DialogDescription>
                  Choose Upcoming or Recorded to control which employee tab
                  displays the session.
                </DialogDescription>
              </DialogHeader>
              <div className="editor-grid">
                <div>
                  <Label htmlFor="session-kind">Session status</Label>
                  <select
                    id="session-kind"
                    value={editor.status}
                    onChange={(e) => {
                      const status = e.target
                        .value as LearningSession["status"];
                      setEditor({
                        ...editor,
                        status,
                        length:
                          status === "Upcoming"
                            ? "3:00 PM – 4:00 PM"
                            : "45 min recording",
                        resources:
                          status === "Upcoming"
                            ? []
                            : editor.resources.length
                              ? editor.resources
                              : ["Teams recording", "Session slides"],
                      });
                    }}
                  >
                    <option value="Upcoming">Upcoming session</option>
                    <option value="Recorded">Recorded session</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="session-publish">Publishing status</Label>
                  <select
                    id="session-publish"
                    value={editor.published === false ? "draft" : "published"}
                    onChange={(e) =>
                      setEditor({
                        ...editor,
                        published: e.target.value === "published",
                      })
                    }
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft / hidden</option>
                  </select>
                </div>
                <div className="editor-full">
                  <Label htmlFor="session-title">Session title</Label>
                  <Input
                    id="session-title"
                    value={editor.title}
                    onChange={(e) =>
                      setEditor({ ...editor, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="session-type">Category</Label>
                  <Input
                    id="session-type"
                    value={editor.type}
                    onChange={(e) =>
                      setEditor({ ...editor, type: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="session-date">Display date</Label>
                  <Input
                    id="session-date"
                    value={editor.date}
                    onChange={(e) =>
                      setEditor({
                        ...editor,
                        date: e.target.value.toUpperCase(),
                      })
                    }
                    placeholder="e.g. OCT 15"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="session-speaker">Speaker / host</Label>
                  <Input
                    id="session-speaker"
                    value={editor.speaker}
                    onChange={(e) =>
                      setEditor({ ...editor, speaker: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="session-duration">
                    {editor.status === "Upcoming"
                      ? "Schedule / time"
                      : "Recording duration"}
                  </Label>
                  <Input
                    id="session-duration"
                    value={editor.length}
                    onChange={(e) =>
                      setEditor({ ...editor, length: e.target.value })
                    }
                    required
                  />
                </div>
                {editor.status === "Upcoming" ? (
                  <div className="editor-full">
                    <Label htmlFor="session-register">Registration link</Label>
                    <Input
                      id="session-register"
                      type="url"
                      value={editor.registrationLink || ""}
                      onChange={(e) =>
                        setEditor({
                          ...editor,
                          registrationLink: e.target.value,
                        })
                      }
                      placeholder="Microsoft Forms or Teams registration URL"
                      required
                    />
                  </div>
                ) : (
                  <>
                    <div>
                      <Label htmlFor="session-teams">
                        Teams recording link
                      </Label>
                      <Input
                        id="session-teams"
                        type="url"
                        value={editor.teamsLink || ""}
                        onChange={(e) =>
                          setEditor({ ...editor, teamsLink: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="session-materials">Materials link</Label>
                      <Input
                        id="session-materials"
                        type="url"
                        value={editor.materialsLink || ""}
                        onChange={(e) =>
                          setEditor({
                            ...editor,
                            materialsLink: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="editor-full">
                      <Label htmlFor="session-resources">
                        Resource buttons <small>One item per line</small>
                      </Label>
                      <Textarea
                        id="session-resources"
                        value={editor.resources.join("\n")}
                        onChange={(e) =>
                          setEditor({
                            ...editor,
                            resources: e.target.value
                              .split("\n")
                              .map((x) => x.trim())
                              .filter(Boolean),
                          })
                        }
                        rows={3}
                      />
                    </div>
                  </>
                )}
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditor(null)}
                >
                  Cancel
                </Button>
                <Button className="primary-button" type="submit">
                  <Check size={16} /> Save session
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={!!preview} onOpenChange={(x) => !x && setPreview(null)}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <div className="dialog-kicker">EMPLOYEE VIEW PREVIEW</div>
            <DialogTitle>{preview?.title}</DialogTitle>
            <DialogDescription>
              {preview?.speaker} · {preview?.length}
            </DialogDescription>
          </DialogHeader>
          {preview && (
            <article className="session-card session-admin-preview">
              <div className="session-top">
                <span
                  className={`session-status ${preview.status === "Recorded" ? "recorded" : ""}`}
                >
                  {preview.status === "Recorded" && <Play size={12} />}{" "}
                  {preview.status}
                </span>
                <time>{preview.date}</time>
              </div>
              <small>{preview.type}</small>
              <h3>{preview.title}</h3>
              <p>
                {preview.speaker} · {preview.length}
              </p>
              {preview.status === "Upcoming" ? (
                <Button className="primary-button">Register</Button>
              ) : (
                <div className="resource-list">
                  {preview.resources.map((x) => (
                    <button key={x}>
                      {x.includes("recording") ? (
                        <Play size={15} />
                      ) : (
                        <Download size={15} />
                      )}{" "}
                      {x}
                      <ExternalLink size={13} />
                    </button>
                  ))}
                </div>
              )}
            </article>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreview(null)}>
              Close preview
            </Button>
            <Button
              className="primary-button"
              onClick={() => {
                if (preview)
                  setEditor({ ...preview, resources: [...preview.resources] });
                setPreview(null);
              }}
            >
              <Pencil size={15} /> Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog
        open={!!deleting}
        onOpenChange={(x) => !x && setDeleting(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete “{deleting?.title}”?</AlertDialogTitle>
            <AlertDialogDescription>
              The session will be removed from Learning & Wellness for this demo
              session.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep session</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (deleting) {
                  onDelete(deleting.id);
                  setDeleting(null);
                  flash("Session deleted");
                }
              }}
            >
              <Trash2 size={15} /> Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function Admin({
  announcements,
  sessions,
  guides,
  onUpsertAnnouncement,
  onDeleteAnnouncement,
  onUpsertSession,
  onDeleteSession,
  onUpsertGuide,
  onDeleteGuide,
}: {
  announcements: Announcement[];
  sessions: LearningSession[];
  guides: RequestGuide[];
  onUpsertAnnouncement: (x: Announcement) => void;
  onDeleteAnnouncement: (id: number) => void;
  onUpsertSession: (x: LearningSession) => void;
  onDeleteSession: (id: string) => void;
  onUpsertGuide: (g: RequestGuide) => void;
  onDeleteGuide: (id: string) => void;
}) {
  const [announcementManager, setAnnouncementManager] = useState(false),
    [sessionManager, setSessionManager] = useState(false);
  const [managerOpen, setManagerOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [previewGuide, setPreviewGuide] = useState<RequestGuide | null>(null);
  const [deleteGuide, setDeleteGuide] = useState<RequestGuide | null>(null);
  const [draft, setDraft] = useState<RequestGuide>(guides[0]);
  const [isNew, setIsNew] = useState(false);
  const [notice, setNotice] = useState("");
  const cloneGuide = (guide: RequestGuide): RequestGuide => ({
    ...guide,
    requirements: [...guide.requirements],
    faqs: guide.faqs.map((x) => ({ ...x })),
    supportingForms: guide.supportingForms?.map((form) => ({
      ...form,
      samples: form.samples.map((sample) => ({ ...sample })),
    })),
  });
  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2600);
  };
  const openManager = () => {
    setEditorOpen(false);
    setPreviewGuide(null);
    setManagerOpen(true);
  };
  const openEdit = (guide: RequestGuide) => {
    setDraft(cloneGuide(guide));
    setIsNew(false);
    setManagerOpen(false);
    setEditorOpen(true);
  };
  const openAdd = () => {
    setDraft({
      id: `process-${Date.now()}`,
      icon: BookOpen,
      title: "",
      short: "",
      time: "3–5 business days",
      category: "General HR",
      requirements: ["Employee ID", "Request details"],
      faqs: [
        {
          q: "What should I prepare?",
          a: "Prepare the listed requirements before opening the Smartsheet form.",
        },
      ],
      formLink: "https://app.smartsheet.com/",
      contact: "people.support@company.com",
      published: true,
    });
    setIsNew(true);
    setManagerOpen(false);
    setEditorOpen(true);
  };
  const openPreview = (guide: RequestGuide) => {
    setPreviewGuide(cloneGuide(guide));
    setManagerOpen(false);
  };
  const update = (field: keyof RequestGuide, value: unknown) =>
    setDraft((current) => ({ ...current, [field]: value }));
  const save = (e: React.FormEvent) => {
    e.preventDefault();
    onUpsertGuide(draft);
    setEditorOpen(false);
    setManagerOpen(true);
    showNotice(
      isNew
        ? "New process added to the HR Help Center"
        : "Process changes published to the HR Help Center",
    );
  };
  const remove = () => {
    if (!deleteGuide) return;
    onDeleteGuide(deleteGuide.id);
    setDeleteGuide(null);
    showNotice("Process removed from the HR Help Center");
  };
  const openAnnouncements = () => setAnnouncementManager(true);
  return (
    <>
      <PageHeader
        kicker="AUTHORIZED HR ACCESS"
        title="HR Admin"
        copy="Manage the employee-facing content available across PeopleHub."
        action="Manage announcements"
        onAction={openAnnouncements}
      />
      <div className="admin-stats">
        <button onClick={() => openAnnouncements()}>
          <Megaphone />
          <span>
            <b>{announcements.filter((x) => x.published !== false).length}</b>{" "}
            Published announcements<small>View, add, edit, or delete</small>
          </span>
        </button>
        <button onClick={() => setSessionManager(true)}>
          <Sparkles />
          <span>
            <b>{sessions.filter((x) => x.published !== false).length}</b>{" "}
            Learning sessions
            <small>
              {sessions.filter((x) => x.status === "Upcoming").length} upcoming
              · {sessions.filter((x) => x.status !== "Upcoming").length}{" "}
              recorded
            </small>
          </span>
        </button>
        <button onClick={openManager}>
          <BookOpen />
          <span>
            <b>{guides.length}</b> Process guides
            <small>View, add, edit, or delete</small>
          </span>
        </button>
        <div>
          <FileText />
          <span>
            <b>14</b> Knowledge articles
          </span>
        </div>
      </div>
      <div className="admin-layout">
        <section className="admin-content">
          <div className="admin-heading">
            <div>
              <h2>Content management</h2>
              <p>Recently published employee content</p>
            </div>
            <button onClick={() => openAnnouncements()}>
              View all content
            </button>
          </div>
          {announcements.slice(0, 4).map((a) => (
            <div className="admin-row" key={a.id}>
              <div className="admin-type">
                <Megaphone />
              </div>
              <div>
                <span>{a.tag}</span>
                <strong>{a.title}</strong>
                <small>
                  {a.published === false ? "Draft" : "Published"} · {a.date}
                </small>
              </div>
              <button onClick={() => openAnnouncements()}>
                <Pencil size={16} /> Manage
              </button>
            </div>
          ))}
        </section>
        <aside className="admin-actions">
          <h2>Quick publish</h2>
          <button onClick={() => openAnnouncements()}>
            <Megaphone />
            <span>
              <strong>Announcement</strong>
              <small>Manage HR updates</small>
            </span>
            <ChevronRight />
          </button>
          <button onClick={() => setSessionManager(true)}>
            <Sparkles />
            <span>
              <strong>Learning & Wellness session</strong>
              <small>Add upcoming events or recordings</small>
            </span>
            <ChevronRight />
          </button>
          <button onClick={openManager}>
            <BookOpen />
            <span>
              <strong>HR Process Guides</strong>
              <small>Manage Help Center processes</small>
            </span>
            <ChevronRight />
          </button>
          <div className="admin-note">
            <ShieldCheck />
            <p>
              <strong>Protected workspace</strong>Only authorized HR roles can
              access this page.
            </p>
          </div>
        </aside>
      </div>

      <AnnouncementManager
        open={announcementManager}
        onOpenChange={setAnnouncementManager}
        items={announcements}
        onUpsert={onUpsertAnnouncement}
        onDelete={onDeleteAnnouncement}
      />
      <SessionManager
        open={sessionManager}
        onOpenChange={setSessionManager}
        items={sessions}
        onUpsert={onUpsertSession}
        onDelete={onDeleteSession}
      />

      <Dialog open={managerOpen} onOpenChange={setManagerOpen}>
        <DialogContent className="guide-manager sm:max-w-[980px]">
          <DialogHeader>
            <div className="dialog-kicker">
              HR HELP CENTER · CONTENT MANAGEMENT
            </div>
            <DialogTitle>Guided processes</DialogTitle>
            <DialogDescription>
              Manage the processes employees see in the HR Help Center. Changes
              are reflected immediately in this demo.
            </DialogDescription>
          </DialogHeader>
          <div className="guide-manager-toolbar">
            <div>
              <strong>{guides.length} processes</strong>
              <span>
                {guides.filter((g) => g.published !== false).length} published ·{" "}
                {guides.filter((g) => g.published === false).length} draft
              </span>
            </div>
            <Button className="primary-button" onClick={openAdd}>
              <Plus size={16} /> Add process
            </Button>
          </div>
          <div className={`manager-notice ${notice ? "show" : ""}`}>
            <Check size={16} />
            {notice || "Changes saved"}
          </div>
          <div className="guide-admin-list">
            {guides.length === 0 ? (
              <div className="guide-empty">
                <BookOpen />
                <strong>No guided processes yet</strong>
                <p>
                  Add the first process to make it available in the HR Help
                  Center.
                </p>
                <Button onClick={openAdd}>Add process</Button>
              </div>
            ) : (
              guides.map((guide) => (
                <article className="guide-admin-row" key={guide.id}>
                  <div className="guide-admin-icon">
                    <guide.icon size={19} />
                  </div>
                  <div className="guide-admin-copy">
                    <span>{guide.category}</span>
                    <strong>{guide.title}</strong>
                    <small>{guide.short}</small>
                  </div>
                  <div
                    className={`publish-chip ${guide.published === false ? "draft" : "published"}`}
                  >
                    {guide.published === false ? "Draft" : "Published"}
                  </div>
                  <div className="guide-row-actions">
                    <button
                      onClick={() => openPreview(guide)}
                      title="Preview employee view"
                    >
                      <Eye size={16} />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => openEdit(guide)}
                      title="Edit process"
                    >
                      <Pencil size={16} />
                      <span>Edit</span>
                    </button>
                    <button
                      className="delete"
                      onClick={() => setDeleteGuide(guide)}
                      title="Delete process"
                    >
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setManagerOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={editorOpen}
        onOpenChange={(open) => {
          setEditorOpen(open);
          if (!open) setManagerOpen(true);
        }}
      >
        <DialogContent className="process-editor sm:max-w-[760px]">
          <form onSubmit={save}>
            <DialogHeader>
              <div className="dialog-kicker">
                HR HELP CENTER · {isNew ? "NEW PROCESS" : "EDIT PROCESS"}
              </div>
              <DialogTitle>
                {isNew ? "Add guided process" : "Update guided process"}
              </DialogTitle>
              <DialogDescription>
                Save the guide to update the employee-facing Help Center
                immediately.
              </DialogDescription>
            </DialogHeader>
            <div className="editor-grid">
              <div>
                <Label htmlFor="guide-title">Process title</Label>
                <Input
                  id="guide-title"
                  value={draft.title}
                  onChange={(e) => update("title", e.target.value)}
                  placeholder="e.g. Benefits enrollment"
                  required
                />
              </div>
              <div>
                <Label htmlFor="guide-category">Category</Label>
                <select
                  id="guide-category"
                  value={draft.category}
                  onChange={(e) => update("category", e.target.value)}
                >
                  <option>Documents</option>
                  <option>Payroll</option>
                  <option>Tax & contributions</option>
                  <option>Loans</option>
                  <option>Benefits</option>
                  <option>General HR</option>
                </select>
              </div>
              <div className="editor-full">
                <Label htmlFor="guide-description">
                  Employee-facing description
                </Label>
                <Textarea
                  id="guide-description"
                  value={draft.short}
                  onChange={(e) => update("short", e.target.value)}
                  rows={2}
                  placeholder="Explain when an employee should use this process."
                  required
                />
              </div>
              <div>
                <Label htmlFor="guide-time">Processing timeline</Label>
                <Input
                  id="guide-time"
                  value={draft.time}
                  onChange={(e) => update("time", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="guide-status">Publishing status</Label>
                <select
                  id="guide-status"
                  value={draft.published === false ? "draft" : "published"}
                  onChange={(e) =>
                    update("published", e.target.value === "published")
                  }
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft / hidden</option>
                </select>
              </div>
              <div className="editor-full">
                <Label htmlFor="guide-requirements">
                  Requirements <small>One item per line</small>
                </Label>
                <Textarea
                  id="guide-requirements"
                  value={draft.requirements.join("\n")}
                  onChange={(e) =>
                    update(
                      "requirements",
                      e.target.value
                        .split("\n")
                        .map((x) => x.trim())
                        .filter(Boolean),
                    )
                  }
                  rows={4}
                  required
                />
              </div>
              <div>
                <Label htmlFor="guide-form">Smartsheet form link</Label>
                <Input
                  id="guide-form"
                  type="url"
                  value={draft.formLink || "https://app.smartsheet.com/"}
                  onChange={(e) => update("formLink", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="guide-contact">Escalation contact</Label>
                <Input
                  id="guide-contact"
                  value={draft.contact || "people.support@company.com"}
                  onChange={(e) => update("contact", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="guide-faq-question">FAQ question</Label>
                <Input
                  id="guide-faq-question"
                  value={draft.faqs[0]?.q || ""}
                  onChange={(e) =>
                    update("faqs", [
                      { q: e.target.value, a: draft.faqs[0]?.a || "" },
                      ...draft.faqs.slice(1),
                    ])
                  }
                />
              </div>
              <div>
                <Label htmlFor="guide-faq-answer">FAQ answer</Label>
                <Textarea
                  id="guide-faq-answer"
                  value={draft.faqs[0]?.a || ""}
                  onChange={(e) =>
                    update("faqs", [
                      { q: draft.faqs[0]?.q || "", a: e.target.value },
                      ...draft.faqs.slice(1),
                    ])
                  }
                  rows={2}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditorOpen(false);
                  setManagerOpen(true);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" className="primary-button">
                <Check size={16} />
                {isNew ? "Add & publish" : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!previewGuide}
        onOpenChange={(open) => {
          if (!open) {
            setPreviewGuide(null);
            setManagerOpen(true);
          }
        }}
      >
        <DialogContent className="guide-preview-dialog sm:max-w-[760px]">
          <DialogHeader>
            <div className="dialog-kicker">EMPLOYEE VIEW PREVIEW</div>
            <DialogTitle>{previewGuide?.title}</DialogTitle>
            <DialogDescription>
              This is how the process guidance will appear to employees.
            </DialogDescription>
          </DialogHeader>
          {previewGuide && (
            <div className="guide-preview-surface">
              <div className="guide-preview-head">
                <div className="request-icon request-icon--large">
                  <previewGuide.icon size={24} />
                </div>
                <div>
                  <span>{previewGuide.category}</span>
                  <h3>{previewGuide.title}</h3>
                  <p>{previewGuide.short}</p>
                </div>
                <em>
                  {previewGuide.published === false
                    ? "Draft preview"
                    : "Published"}
                </em>
              </div>
              <div className="guide-preview-grid">
                <section>
                  <h4>Before you submit</h4>
                  <ol>
                    {previewGuide.requirements.map((requirement, index) => (
                      <li key={`${requirement}-${index}`}>
                        <span>{index + 1}</span>
                        {requirement}
                      </li>
                    ))}
                  </ol>
                </section>
                <aside>
                  <Clock3 />
                  <small>Estimated processing</small>
                  <strong>{previewGuide.time}</strong>
                </aside>
              </div>
              <div className="guide-preview-faq">
                <strong>FAQ</strong>
                <p>{previewGuide.faqs[0]?.q || "No FAQ added yet"}</p>
                <small>{previewGuide.faqs[0]?.a}</small>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setPreviewGuide(null);
                setManagerOpen(true);
              }}
            >
              Back to process list
            </Button>
            {previewGuide && (
              <Button
                className="primary-button"
                onClick={() => {
                  const guide = previewGuide;
                  setPreviewGuide(null);
                  openEdit(guide);
                }}
              >
                <Pencil size={15} /> Edit process
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteGuide}
        onOpenChange={(open) => !open && setDeleteGuide(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete “{deleteGuide?.title}”?</AlertDialogTitle>
            <AlertDialogDescription>
              This process will be removed from the employee HR Help Center.
              This action only affects the current prototype session.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep process</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={remove}>
              <Trash2 size={15} /> Delete process
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function AnnouncementCard({
  item,
  large,
}: {
  item: (typeof initialAnnouncements)[number];
  large?: boolean;
}) {
  return (
    <article
      className={`announcement-card ${large ? "announcement-card--large" : ""}`}
    >
      <div className="announcement-date">
        <strong>{item.date.split(" ")[1]}</strong>
        <span>{item.date.split(" ")[0]}</span>
      </div>
      <div>
        <span>
          {item.tag}
          {item.pinned && <em>PINNED</em>}
        </span>
        <h3>{item.title}</h3>
        <p>{item.copy}</p>
        <button>
          Read announcement <ArrowRight size={15} />
        </button>
      </div>
    </article>
  );
}
function ConcernMini({ item }: { item: Concern }) {
  return (
    <button className="concern-mini">
      <div>
        <span className={`status-dot status-dot--${item.tone}`} />
        <small>{item.id}</small>
      </div>
      <strong>{item.title}</strong>
      <p>{item.updated}</p>
      <span className={`status status--${item.tone}`}>{item.status}</span>
    </button>
  );
}
function NavItem({
  icon: Icon,
  label,
  active,
  badge,
  onClick,
}: {
  icon: typeof Home;
  label: string;
  active: boolean;
  badge?: string;
  onClick: () => void;
}) {
  return (
    <button className={active ? "active" : ""} onClick={onClick}>
      <Icon size={19} />
      <span>{label}</span>
      {badge && <em>{badge}</em>}
    </button>
  );
}
function PageHeader({
  kicker,
  title,
  copy,
  action,
  onAction,
}: {
  kicker: string;
  title: string;
  copy: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="page-header">
      <div>
        <span className="eyebrow eyebrow--coral">{kicker}</span>
        <h1>{title}</h1>
        <p>{copy}</p>
      </div>
      {action && (
        <Button className="primary-button" onClick={onAction}>
          <Plus size={17} />
          {action}
        </Button>
      )}
    </div>
  );
}
function SectionHeading({
  title,
  action,
  onAction,
  compact,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
  compact?: boolean;
}) {
  return (
    <div
      className={`section-heading ${compact ? "section-heading--compact" : ""}`}
    >
      <h2>{title}</h2>
      {action && (
        <button onClick={onAction}>
          {action}
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
}
