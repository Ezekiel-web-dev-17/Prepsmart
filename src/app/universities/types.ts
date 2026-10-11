export interface CourseRequirementData {
  id: string;
  universityId: string;
  courseName: string;
  faculty: string | null;
  cutOffMark: number;
  durationYears: number;
  oLevelRequirements: string | null;
  directEntryAccepted: boolean;
  directEntryRequirements: string | null;
}

export interface AdmissionDocumentData {
  id: string;
  universityId: string;
  title: string;
  category: string;
  isRequired: boolean;
  description: string | null;
}

export interface UniversityData {
  id: string;
  slug: string;
  name: string;
  acronym: string | null;
  type: string; // "federal" | "state" | "private"
  state: string;
  city: string;
  zone: string | null;
  generalCutOff: number;
  postUtmeRequired: boolean;
  screeningType: string;
  annualTuitionEst: string | null;
  estYear: number | null;
  website: string | null;
  campusHighlights: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  courses: CourseRequirementData[];
  documents: AdmissionDocumentData[];
  coursesCount?: number;
  minCourseCutOff?: number;
  maxCourseCutOff?: number;
}

export const POPULAR_COURSES = [
  "Medicine & Surgery",
  "Law",
  "Computer Science",
  "Engineering",
  "Nursing Science",
  "Pharmacy",
  "Accounting",
  "Architecture",
] as const;

export const UNIVERSITY_TYPES = [
  { id: "all", label: "All Institutions" },
  { id: "federal", label: "Federal" },
  { id: "state", label: "State" },
  { id: "private", label: "Private" },
] as const;

export const GEOPOLITICAL_ZONES = [
  "All Zones",
  "South-West",
  "South-East",
  "South-South",
  "North-Central",
  "North-West",
  "North-East",
] as const;
