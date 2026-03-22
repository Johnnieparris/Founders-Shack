export type FeedCategory = "events" | "applications" | "admin";
export type OpportunityCategory =
  | "Event"
  | "Application"
  | "Research"
  | "Networking"
  | "Admin";
export type Priority = "today" | "this_week" | "closing_soon" | null;
export type CtaAction = "apply" | "register" | "learn_more";

export interface FeedItemCta {
  label: string;
  action: CtaAction;
  url?: string;
}

export interface FeedItem {
  id: string;
  type: "event" | "opportunity";
  feedCategory: FeedCategory;
  title: string;
  description: string;
  category: OpportunityCategory;
  date: string;
  dateSortKey: string;
  dateLabel: string;
  dayLabel: string;
  time?: string;
  priority: Priority;
  cta: FeedItemCta;
  organiser?: string;
  location?: string;
  fullDescription?: string;
  imageUrl?: string;
  attendeeCount?: number;
  source?: string;
}

const now = new Date();
const inOneDay = new Date(now);
inOneDay.setDate(inOneDay.getDate() + 1);
const inThreeDays = new Date(now);
inThreeDays.setDate(inThreeDays.getDate() + 3);
const inFiveDays = new Date(now);
inFiveDays.setDate(inFiveDays.getDate() + 5);
const inTenDays = new Date(now);
inTenDays.setDate(inTenDays.getDate() + 10);
const inTwoWeeks = new Date(now);
inTwoWeeks.setDate(inTwoWeeks.getDate() + 14);

const formatDate = (d: Date) =>
  d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
const formatTime = (d: Date) =>
  d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: true });
const formatDateSortKey = (d: Date) => d.toISOString().slice(0, 10);
const formatDateLabel = (d: Date) => {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  if (dDate.getTime() === today.getTime()) return "Today";
  if (dDate.getTime() === tomorrow.getTime()) return "Tomorrow";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
};
const formatDayLabel = (d: Date) =>
  d.toLocaleDateString("en-GB", { weekday: "long" });

export const MOCK_FEED_ITEMS: FeedItem[] = [
  {
    id: "evt-1",
    type: "event",
    feedCategory: "events",
    title: "Consulting Case Competition",
    description: "Test your problem-solving skills in a team-based case study.",
    category: "Event",
    date: formatDate(inOneDay),
    dateSortKey: formatDateSortKey(inOneDay),
    dateLabel: formatDateLabel(inOneDay),
    dayLabel: formatDayLabel(inOneDay),
    time: formatTime(inOneDay),
    priority: "today",
    cta: { label: "Register", action: "register", url: "#" },
    organiser: "Consulting Society",
    location: "Main Hall, Building A",
    fullDescription:
      "Join us for a day of intense case-solving. Teams of 3–4 will work through real consulting scenarios. Top performers get direct access to partner firms.",
    imageUrl: "https://picsum.photos/seed/consult1/200/200",
    attendeeCount: 24,
  },
  {
    id: "evt-2",
    type: "event",
    feedCategory: "events",
    title: "Tech Career Fair 2025",
    description: "Meet recruiters from 50+ leading tech companies.",
    category: "Networking",
    date: formatDate(inFiveDays),
    dateSortKey: formatDateSortKey(inFiveDays),
    dateLabel: formatDateLabel(inFiveDays),
    dayLabel: formatDayLabel(inFiveDays),
    time: "10:00 – 16:00",
    priority: "this_week",
    cta: { label: "Learn More", action: "learn_more", url: "#" },
    organiser: "Careers Service",
    location: "University Hub",
    fullDescription:
      "The largest tech recruitment fair of the year. Bring your CV and chat with reps from Google, Meta, Stripe, and many more.",
    imageUrl: "https://picsum.photos/seed/techfair/200/200",
    attendeeCount: 156,
  },
  {
    id: "evt-3",
    type: "event",
    feedCategory: "events",
    title: "Startup Pitch Night",
    description: "Watch founders pitch to angel investors.",
    category: "Event",
    date: formatDate(inTenDays),
    dateSortKey: formatDateSortKey(inTenDays),
    dateLabel: formatDateLabel(inTenDays),
    dayLabel: formatDayLabel(inTenDays),
    time: "6:00 pm",
    priority: null,
    cta: { label: "Register", action: "register", url: "#" },
    organiser: "Entrepreneurship Society",
    location: "Innovation Lab",
    fullDescription:
      "An evening of live pitches from student and alumni founders. Network with investors and fellow entrepreneurs.",
    imageUrl: "https://picsum.photos/seed/startup/200/200",
    attendeeCount: 42,
  },
  {
    id: "opp-1",
    type: "opportunity",
    feedCategory: "applications",
    title: "Summer Analyst Programme",
    description: "10-week internship at a top investment bank.",
    category: "Application",
    date: formatDate(inThreeDays),
    dateSortKey: formatDateSortKey(inThreeDays),
    dateLabel: formatDateLabel(inThreeDays),
    dayLabel: formatDayLabel(inThreeDays),
    priority: "closing_soon",
    cta: { label: "Apply", action: "apply", url: "#" },
    organiser: "Goldman Sachs",
    fullDescription:
      "Our Summer Analyst Programme offers penultimate-year students the chance to gain real-world experience in Investment Banking. Applications close soon.",
    imageUrl: "https://picsum.photos/seed/gs/200/200",
  },
  {
    id: "opp-2",
    type: "opportunity",
    feedCategory: "applications",
    title: "ML Research Assistant Role",
    description: "Work with faculty on cutting-edge NLP research.",
    category: "Research",
    date: formatDate(inOneDay),
    dateSortKey: formatDateSortKey(inOneDay),
    dateLabel: formatDateLabel(inOneDay),
    dayLabel: formatDayLabel(inOneDay),
    time: "5:00 pm",
    priority: "today",
    cta: { label: "Apply", action: "apply", url: "#" },
    organiser: "Computer Science Dept",
    fullDescription:
      "Assist with data collection, model training, and paper drafting. Ideal for final-year or postgraduate students with ML experience.",
    imageUrl: "https://picsum.photos/seed/ml/200/200",
  },
  {
    id: "opp-3",
    type: "opportunity",
    feedCategory: "applications",
    title: "Consulting Society Committee",
    description: "Join the exec team for 2025–26.",
    category: "Application",
    date: formatDate(inTwoWeeks),
    dateSortKey: formatDateSortKey(inTwoWeeks),
    dateLabel: formatDateLabel(inTwoWeeks),
    dayLabel: formatDayLabel(inTwoWeeks),
    priority: "closing_soon",
    cta: { label: "Apply", action: "apply", url: "#" },
    organiser: "Consulting Society",
    fullDescription:
      "We're recruiting for President, VP Events, VP Finance, and more. Lead one of the largest societies on campus.",
    imageUrl: "https://picsum.photos/seed/consult2/200/200",
  },
  {
    id: "opp-4",
    type: "opportunity",
    feedCategory: "applications",
    title: "Product Management Internship",
    description: "12-week PM internship at a Series B startup.",
    category: "Application",
    date: formatDate(inFiveDays),
    dateSortKey: formatDateSortKey(inFiveDays),
    dateLabel: formatDateLabel(inFiveDays),
    dayLabel: formatDayLabel(inFiveDays),
    priority: "this_week",
    cta: { label: "Apply", action: "apply", url: "#" },
    organiser: "TechCorp",
    fullDescription:
      "Ship features end-to-end, work with engineering and design, and learn what it takes to build products users love.",
    imageUrl: "https://picsum.photos/seed/pm/200/200",
  },
  {
    id: "admin-1",
    type: "opportunity",
    feedCategory: "admin",
    title: "Subcommittee Budget Submission",
    description: "Submit your society's budget proposal for next term.",
    category: "Admin",
    date: formatDate(inOneDay),
    dateSortKey: formatDateSortKey(inOneDay),
    dateLabel: formatDateLabel(inOneDay),
    dayLabel: formatDayLabel(inOneDay),
    time: "11:59 pm",
    priority: "today",
    cta: { label: "Submit", action: "learn_more", url: "#" },
    organiser: "Student Union",
    fullDescription:
      "All subcommittees must submit their budget proposals by end of day. Use the template on the Union portal.",
  },
  {
    id: "admin-2",
    type: "opportunity",
    feedCategory: "admin",
    title: "Event Risk Assessment Deadline",
    description: "Risk assessments due for all events in March.",
    category: "Admin",
    date: formatDate(inThreeDays),
    dateSortKey: formatDateSortKey(inThreeDays),
    dateLabel: formatDateLabel(inThreeDays),
    dayLabel: formatDayLabel(inThreeDays),
    priority: "closing_soon",
    cta: { label: "Complete", action: "learn_more", url: "#" },
    organiser: "Student Union",
    fullDescription:
      "Complete and upload risk assessments for any society events scheduled in March. Late submissions may result in event cancellation.",
  },
  {
    id: "admin-3",
    type: "opportunity",
    feedCategory: "admin",
    title: "AGM Minutes Submission",
    description: "Submit minutes from your society's AGM.",
    category: "Admin",
    date: formatDate(inTenDays),
    dateSortKey: formatDateSortKey(inTenDays),
    dateLabel: formatDateLabel(inTenDays),
    dayLabel: formatDayLabel(inTenDays),
    priority: null,
    cta: { label: "Submit", action: "learn_more", url: "#" },
    organiser: "Student Union",
    fullDescription:
      "Societies that have held AGMs must submit signed minutes within two weeks of the meeting.",
  },
];
