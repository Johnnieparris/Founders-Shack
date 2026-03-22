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
