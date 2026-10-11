import { PrismaClient } from "@prisma/client";
import { UNIVERSITIES_DATA } from "../src/data/universities";

const prisma = new PrismaClient();

interface CourseMeta {
  name: string;
  faculty: string;
  durationYears: number;
  oLevelRequirements: string;
  directEntryRequirements: string;
}

const COURSE_CATALOG: Record<string, CourseMeta> = {
  medicine: {
    name: "Medicine & Surgery (MBBS)",
    faculty: "College of Medicine / Health Sciences",
    durationYears: 6,
    oLevelRequirements:
      "5 SSCE credit passes in English Language, Mathematics, Physics, Chemistry, and Biology in one sitting.",
    directEntryRequirements:
      "JUPEB / A-Level with minimum 12-14 points in Chemistry, Physics, and Biology, or B.Sc. First Class / 2nd Class Upper in relevant biological sciences.",
  },
  law: {
    name: "Law (LL.B)",
    faculty: "Faculty of Law",
    durationYears: 5,
    oLevelRequirements:
      "5 SSCE credit passes in English Language, Literature in English, Mathematics, and two other Arts or Social Science subjects.",
    directEntryRequirements:
      "Two A-Level passes in Arts / Social Sciences, JUPEB (min 10 points), or Degree in relevant field.",
  },
  engineering: {
    name: "Engineering (Mechanical / Electrical / Civil)",
    faculty: "Faculty of Engineering & Technology",
    durationYears: 5,
    oLevelRequirements:
      "5 SSCE credit passes in English Language, Mathematics, Physics, Chemistry, and Further Mathematics or Technical Drawing.",
    directEntryRequirements:
      "ND Upper Credit in relevant Engineering discipline, or JUPEB / IJMB with high credit passes in Mathematics and Physics.",
  },
  computerScience: {
    name: "Computer Science (B.Sc)",
    faculty: "Faculty of Science & Computing",
    durationYears: 4,
    oLevelRequirements:
      "5 SSCE credit passes in English Language, Mathematics, Physics, Chemistry, and Biology or Economics.",
    directEntryRequirements:
      "ND / HND Upper Credit in Computer Science or Electrical Engineering, or JUPEB (min 9-10 points) in Mathematics and Physics.",
  },
  nursing: {
    name: "Nursing Science (B.N.Sc)",
    faculty: "Faculty of Clinical & Allied Health Sciences",
    durationYears: 5,
    oLevelRequirements:
      "5 SSCE credit passes in English Language, Mathematics, Physics, Chemistry, and Biology in not more than two sittings.",
    directEntryRequirements:
      "Registered Nurse (RN) / Registered Midwife (RM) certificate or A-Level passes in Biology, Chemistry, and Physics.",
  },
  accounting: {
    name: "Accounting & Finance (B.Sc)",
    faculty: "Faculty of Administration & Management Sciences",
    durationYears: 4,
    oLevelRequirements:
      "5 SSCE credit passes in English Language, Mathematics, Economics, and two other Commercial or Social Science subjects.",
    directEntryRequirements:
      "ND Upper Credit in Accounting / Banking & Finance, ATS Stage 3, ICAN Foundation, or JUPEB with Economics and Accounting passes.",
  },
  pharmacy: {
    name: "Pharmacy (Pharm.D)",
    faculty: "Faculty of Pharmaceutical Sciences",
    durationYears: 6,
    oLevelRequirements:
      "5 SSCE credit passes in English Language, Mathematics, Physics, Chemistry, and Biology in one sitting.",
    directEntryRequirements:
      "JUPEB passes (min 11-12 points) in Chemistry, Physics, and Biology, or B.Sc. in Biochemistry / Pharmacology / Microbiology.",
  },
  architecture: {
    name: "Architecture (B.Sc)",
    faculty: "Faculty of Environmental Sciences",
    durationYears: 5,
    oLevelRequirements:
      "5 SSCE credit passes in English Language, Mathematics, Physics, and any two from Chemistry, Technical Drawing, Geography, Fine Arts.",
    directEntryRequirements:
      "ND Upper Credit in Architectural Technology, or A-Level / JUPEB passes in Mathematics and Physics.",
  },
};

const BASE_DOCUMENTS = [
  {
    title: "Original JAMB Result Slip",
    category: "JAMB",
    isRequired: true,
    description:
      "Official color printout with candidate photograph directly from JAMB e-Facility portal.",
  },
  {
    title: "JAMB Admission Letter (Post-Selection)",
    category: "JAMB",
    isRequired: true,
    description:
      "Institutional and candidate copies downloaded from JAMB CAPS after accepting offer.",
  },
  {
    title: "O'Level Result Slip / Certificate (WAEC/NECO/NABTEB)",
    category: "O'Level",
    isRequired: true,
    description:
      "Original certificate or online statement of results showing mandatory credits in relevant subject combination.",
  },
  {
    title: "O'Level Result Verification Scratch Card / PIN Token",
    category: "O'Level",
    isRequired: true,
    description:
      "Unused examination scratch card PIN or e-verification token corresponding to the candidate's exam diet.",
  },
  {
    title: "Local Government (LGA) Identification Letter",
    category: "Identity",
    isRequired: true,
    description:
      "Authentic certificate of indigene status endorsed by the candidate's Local Government Area council.",
  },
  {
    title: "National Identity Card (NIN Slip) & Birth Certificate",
    category: "Identity",
    isRequired: true,
    description:
      "NIMC digital verification slip and National Population Commission (NPC) birth certificate or statutory age declaration.",
  },
  {
    title: "Post-UTME Screening Registration & Payment Slip",
    category: "JAMB",
    isRequired: true,
    description:
      "Official application acknowledgement and fee payment transaction printout from the university portal.",
  },
  {
    title: "Attestation & Recommendation Letters",
    category: "Identity",
    isRequired: true,
    description:
      "Two signed letters of recommendation from a reputable clergy, civil servant (Grade Level 12+), or secondary school principal.",
  },
  {
    title: "Recent Passport Photographs (8-12 Copies)",
    category: "Identity",
    isRequired: true,
    description:
      "Identical colored passport photographs on red or white background with candidate name and registration number written on the reverse.",
  },
  {
    title: "Direct Entry Transcript & A-Level / ND Certificate (DE Candidates)",
    category: "Direct Entry",
    isRequired: false,
    description:
      "Official academic transcript forwarded directly from prior polytechnic or A-Level / JUPEB institute, along with notification of results.",
  },
];

async function main() {
  console.log("Seeding Nigerian Universities, Course Requirements, and Admission Documents...");

  // Clear existing university data in order
  await prisma.admissionDocument.deleteMany({});
  await prisma.courseRequirement.deleteMany({});
  await prisma.university.deleteMany({});

  for (const uni of UNIVERSITIES_DATA) {
    const postUtmeRequired =
      uni.screeningType.toLowerCase().includes("post-utme") ||
      uni.screeningType.toLowerCase().includes("exam");

    const createdUniversity = await prisma.university.create({
      data: {
        slug: uni.id,
        name: uni.name,
        acronym: uni.acronym || null,
        type: uni.type,
        state: uni.state,
        city: uni.city,
        zone: uni.zone || null,
        generalCutOff: uni.generalCutOff,
        postUtmeRequired: postUtmeRequired,
        screeningType: uni.screeningType,
        annualTuitionEst: uni.annualTuitionEst || null,
        estYear: uni.estYear || null,
        website: uni.website || null,
        campusHighlights: uni.campusHighlights || null,
      },
    });

    // Create courses
    const coursesToInsert = [];
    for (const [key, cutOff] of Object.entries(uni.departmentalCutOffs || {})) {
      const meta = COURSE_CATALOG[key] || {
        name: key.charAt(0).toUpperCase() + key.slice(1),
        faculty: "General Faculty",
        durationYears: 4,
        oLevelRequirements:
          "5 SSCE credit passes in English Language, Mathematics, and 3 relevant discipline subjects.",
        directEntryRequirements:
          "JUPEB / ND Upper Credit in related discipline.",
      };

      coursesToInsert.push({
        universityId: createdUniversity.id,
        courseName: meta.name,
        faculty: meta.faculty,
        cutOffMark: cutOff,
        durationYears: meta.durationYears,
        oLevelRequirements: meta.oLevelRequirements,
        directEntryAccepted: true,
        directEntryRequirements: meta.directEntryRequirements,
      });
    }

    if (coursesToInsert.length > 0) {
      await prisma.courseRequirement.createMany({
        data: coursesToInsert,
      });
    }

    // Create canonical documents
    const documentsToInsert = BASE_DOCUMENTS.map((doc) => ({
      universityId: createdUniversity.id,
      title: doc.title,
      category: doc.category,
      isRequired: doc.isRequired,
      description: doc.description,
    }));

    await prisma.admissionDocument.createMany({
      data: documentsToInsert,
    });
  }

  const uniCount = await prisma.university.count();
  const courseCount = await prisma.courseRequirement.count();
  const docCount = await prisma.admissionDocument.count();

  console.log(`Seeding complete:`);
  console.log(`- ${uniCount} Universities`);
  console.log(`- ${courseCount} Course Requirements`);
  console.log(`- ${docCount} Admission Documents`);
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
