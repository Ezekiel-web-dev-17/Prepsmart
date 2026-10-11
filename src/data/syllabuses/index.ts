import mathematics from "./mathematics.json";
import physics from "./physics.json";
import chemistry from "./chemistry.json";
import biology from "./biology.json";
import useOfEnglish from "./use-of-english.json";
import allSyllabuses from "./all-syllabuses.json";

export interface SyllabusTopic {
  topicNumber: number;
  title: string;
  contents: string[];
  objectives: string[];
}

export interface SyllabusSection {
  section: string;
  topics: SyllabusTopic[];
}

export interface Syllabus {
  id: string;
  subject: string;
  examination: string;
  generalObjectives: string[];
  topics?: SyllabusTopic[];
  sections?: SyllabusSection[];
  structureOfExamination?: {
    totalQuestions: number;
    breakdown: Array<{
      section: string;
      total: number;
      parts: Array<{
        description: string;
        questions: number;
      }>;
    }>;
  };
  recommendedTexts: string[];
}

export {
  mathematics as mathematicsSyllabus,
  physics as physicsSyllabus,
  chemistry as chemistrySyllabus,
  biology as biologySyllabus,
  useOfEnglish as useOfEnglishSyllabus,
  allSyllabuses,
};

export const syllabusesMap: Record<string, Syllabus> = {
  mathematics: mathematics as unknown as Syllabus,
  physics: physics as unknown as Syllabus,
  chemistry: chemistry as unknown as Syllabus,
  biology: biology as unknown as Syllabus,
  "use-of-english": useOfEnglish as unknown as Syllabus,
};

export default allSyllabuses;
