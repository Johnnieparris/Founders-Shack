export const COUNTRIES = [
  "Australia",
  "New Zealand",
  "United States",
  "United Kingdom",
  "Canada",
  "Singapore",
  "India",
  "Other",
] as const;

export const UNIVERSITIES = [
  "University of Melbourne",
  "Monash University",
  "University of Sydney",
  "UNSW Sydney",
  "Australian National University",
  "University of Queensland",
  "University of Western Australia",
  "University of Auckland",
  "Victoria University of Wellington",
  "Other",
] as const;

export const MAJORS = [
  "Computer Science",
  "Software Engineering",
  "Information Technology",
  "Data Science",
  "Engineering",
  "Business / Commerce",
  "Science",
  "Arts / Humanities",
  "Law",
  "Medicine / Health",
  "Other",
] as const;

export const CAREER_INTERESTS = [
  "Consulting",
  "Investment Banking",
  "Tech",
  "Quantitative Finance",
  "Startups",
  "Product Management",
  "Data Science",
  "Marketing",
  "Finance",
  "Healthcare",
  "Biotechnology",
  "Research",
  "Engineering",
  "Design",
  "Non-profit",
  "Government",
  "Real Estate",
  "Accounting",
  "Sales",
  "Operations",
  "Human Resources",
  "Cybersecurity",
  "Artificial Intelligence",
  "Sustainability",
  "Venture Capital",
  "Management",
  "Entrepreneurship",
  "Education",
  "Media",
  "Sports",
] as const;

/* ──────────────────────────────────────────────────────────
   UNSW official degrees → majors mapping
   ────────────────────────────────────────────────────────── */

export const UNSW_DEGREE_MAJORS: Record<string, string[]> = {
  "Bachelor of Commerce": [
    "Accounting",
    "AI in Business and Society",
    "Behavioural Economics",
    "Business Analytics",
    "Business Economics",
    "Business Sustainability and Social Impact",
    "Cybersecurity Management",
    "Finance",
    "FinTech",
    "Human Resource Management",
    "Information Systems",
    "Innovation, Strategy and Entrepreneurship",
    "International Business",
    "Marketing",
    "Marketing Analytics",
    "Taxation",
  ],
  "Bachelor of Economics": [
    "Data Analytics and Econometrics",
    "Economic Policy and Society",
    "Macroeconomics and Financial Markets",
  ],
  "Bachelor of Actuarial Studies": [
    "Actuarial Risk Management & Analytics",
    "Computational Data Science",
    "Quantitative Data Science",
  ],
  "Bachelor of Information Systems": [
    "Data Analytics",
    "Cybersecurity Management",
    "Organisations",
  ],
  "Bachelor of Engineering (Honours)": [
    "Aerospace Engineering",
    "Bioinformatics Engineering",
    "Biomedical Engineering",
    "Chemical Engineering",
    "Chemical Product Engineering",
    "Civil Engineering",
    "Computer Engineering",
    "Electrical Engineering",
    "Environmental Engineering",
    "Mechanical and Manufacturing Engineering",
    "Mechanical Engineering",
    "Mining Engineering",
    "Nuclear Engineering",
    "Photovoltaics and Solar Energy",
    "Quantum Engineering",
    "Renewable Energy Engineering",
    "Robotics and Mechatronics Engineering",
    "Software Engineering",
    "Surveying",
    "Telecommunications",
  ],
  "Bachelor of Science (Computer Science)": [
    "Computer Science (General)",
    "Artificial Intelligence",
    "Computer Networks",
    "Database Systems",
    "Embedded Systems",
    "Programming Languages",
    "Security Engineering",
  ],
  "Bachelor of Data Science and Decisions": [
    "Business Data Science",
    "Computational Data Science",
    "Quantitative Data Science",
  ],
  "Bachelor of Science": [
    "Anatomy",
    "Bioinformatics",
    "Biology & Biodiversity",
    "Biophysics",
    "Biotechnology",
    "Chemistry",
    "Climate Systems Science",
    "Earth Science",
    "Ecology and Conservation",
    "Food Science",
    "Genetics",
    "Geography",
    "Immunology",
    "Marine and Coastal Science",
    "Materials Science",
    "Mathematics",
    "Mathematics for Education",
    "Microbiology",
    "Molecular and Cell Biology",
    "Neuroscience",
    "Pathology",
    "Pharmacology",
    "Physical Oceanography",
    "Physics",
    "Physiology",
    "Psychology",
    "Statistics",
    "Vision Science",
  ],
  "Bachelor of Advanced Science (Honours)": [
    "Advanced Physical Oceanography",
    "Advanced Physics",
    "Anatomy",
    "Bioinformatics",
    "Biology & Biodiversity",
    "Biophysics",
    "Biotechnology",
    "Chemistry",
    "Climate Systems Science",
    "Earth Science",
    "Ecology and Conservation",
    "Genetics",
    "Geography",
    "Immunology",
    "Marine and Coastal Science",
    "Materials Science",
    "Mathematics",
    "Microbiology",
    "Molecular and Cell Biology",
    "Neuroscience",
    "Pathology",
    "Pharmacology",
    "Physiology",
    "Psychology",
    "Statistics",
  ],
  "Bachelor of Science (Advanced Mathematics) (Honours)": [
    "Applied Mathematics",
    "Pure Mathematics",
    "Advanced Statistics",
  ],
  "Bachelor of Environmental Management": [
    "Biology",
    "Earth Science",
    "Ecology",
    "Environmental Chemistry",
    "Geography",
    "Marine and Coastal Science",
  ],
  "Bachelor of Medical Science": [
    "Human Anatomy",
    "Human Pathology",
    "Medical Immunology",
    "Medical Microbiology",
    "Medical Pharmacology",
    "Medical Physiology",
    "Molecular Biology",
    "Molecular Genetics",
    "Neurobiology",
  ],
  "Bachelor of Psychological Science": [
    "Criminology",
    "Human Resource Management",
    "Linguistics",
    "Marketing",
    "Neuroscience",
    "Philosophy",
    "Vision Science",
  ],
  "Bachelor of Arts": [
    "Asian Studies",
    "Chinese Studies",
    "Creative Writing",
    "Criminology",
    "English",
    "Environmental Humanities",
    "European Studies",
    "Film Studies",
    "French Studies",
    "Geographical Studies",
    "German Studies",
    "Global Development",
    "History",
    "Indigenous Studies",
    "Japanese Studies",
    "Korean Studies",
    "Linguistics",
    "Media, Culture and Technology",
    "Music Studies",
    "Philosophy",
    "Politics and International Relations",
    "Sociology",
    "Spanish Studies",
    "Studies in Psychology",
    "Theatre and Performance Studies",
  ],
  "Bachelor of Social Sciences": [
    "AI in Business and Society",
    "Economics",
    "Environmental Humanities",
    "Geographical Studies",
    "Global Development",
    "Human Resource Management",
    "Indigenous Studies",
    "Innovation, Strategy and Entrepreneurship",
    "International Business",
    "International Studies",
    "Marketing",
    "Media, Culture and Technology",
    "Politics and International Relations",
    "Sociology",
  ],
  "Bachelor of Media": [
    "Cinema Studies",
    "Communication & Journalism",
    "Media Studies",
    "Public Relations & Advertising",
    "Screen Production",
  ],
  "Bachelor of Design": [
    "Integrated Design",
    "Industrial Design",
    "Computational Design",
  ],
  "Bachelor of Fine Arts": [
    "Animation & Moving Image",
    "Art Theory",
    "Music",
    "Visual Arts",
  ],
  // Degrees with no majors
  "Bachelor of Cyber Security": [],
  "Bachelor of Psychology (Honours)": [],
  "Bachelor of Biotechnology (Honours)": [],
  "Bachelor of Medicinal Chemistry (Honours)": [],
  "Bachelor of Architectural Studies": [],
  "Bachelor of City Planning (Honours)": [],
  "Bachelor of Construction Management and Property (Honours)": [],
  "Bachelor of Interior Architecture (Honours)": [],
  "Bachelor of Criminology and Criminal Justice": [],
  "Bachelor of Social Work (Honours)": [],
  "Bachelor of Aviation (Flying)": [],
  "Bachelor of Aviation (Management)": [],
  "Bachelor of Vision Science": [],
  "Bachelor of Education (Primary) (Honours)": [],
  "Bachelor of Education (Secondary) (Honours)": [],
};

export const UNSW_DEGREES = Object.keys(UNSW_DEGREE_MAJORS);

/* ──────────────────────────────────────────────────────────
   Career interests by major — shown in onboarding.
   Fill in the arrays for each major. Empty = falls back to CAREER_INTERESTS.
   Examples: Software Engineering → AI, Quant, Computer Vision, Startups
             Finance → Investment Banking, Quant, Consulting, Fintech, Blockchain
   ────────────────────────────────────────────────────────── */
const ALL_MAJORS = [
  ...new Set(
    ([] as string[]).concat(...Object.values(UNSW_DEGREE_MAJORS))
  ),
];

const INTERESTS_BY_MAJOR_OVERRIDES: Record<string, string[]> = {
  "Software Engineering": ["AI", "Quant", "Computer Vision", "Startups", 'Cybersecurity', 'Robotics', 'Game Development', 'WebDev', "IoT", "AR/VR"],
  "Finance": ["Stock Market", "Day Trading", "Investment Banking", "Quant", "Consulting", "Fintech", "Blockchain"],
  // add more majors here
};

export const INTERESTS_BY_MAJOR: Record<string, string[]> = Object.fromEntries(
  ALL_MAJORS.map((m) => [m, INTERESTS_BY_MAJOR_OVERRIDES[m] ?? []])
);

/** Returns allowed interest tags for a degree/major label. Uses major-specific if set, else CAREER_INTERESTS. */
export function getAllowedTagsForLabel(label: string | null | undefined): string[] {
  if (!label?.trim()) return [...CAREER_INTERESTS];
  const majorInterests = INTERESTS_BY_MAJOR[label];
  if (majorInterests?.length) return majorInterests;
  return [...CAREER_INTERESTS];
}

/** Union of allowed tags across multiple degree/major labels. */
export function getAllowedTagsForLabels(labels: string[]): string[] {
  if (!labels?.length) return [...CAREER_INTERESTS];
  const seen = new Set<string>();
  for (const label of labels) {
    for (const t of getAllowedTagsForLabel(label)) seen.add(t);
  }
  return [...seen];
}

/** Returns interest options for the given major. Falls back to CAREER_INTERESTS when no major or empty. */
export function getInterestsForDegreeMajor(_degree: string, major?: string): string[] {
  const majorInterests = major ? INTERESTS_BY_MAJOR[major] : undefined;
  if (majorInterests?.length) return majorInterests;
  return [...CAREER_INTERESTS];
}

/** All valid interest strings (for validation). */
export function getAllValidInterests(): string[] {
  const set = new Set<string>(CAREER_INTERESTS);
  Object.values(INTERESTS_BY_MAJOR).flat().forEach((i) => set.add(i));
  return Array.from(set);
}

export const YEAR_LEVELS = [
  { value: "1", label: "Year 1" },
  { value: "2", label: "Year 2" },
  { value: "3", label: "Year 3" },
  { value: "4", label: "Year 4" },
  { value: "honours", label: "Honours" },
  { value: "postgrad", label: "Postgraduate" },
] as const;

export const YEAR_LEVEL_VALUES = YEAR_LEVELS.map((y) => y.value) as [
  string,
  ...string[],
];
