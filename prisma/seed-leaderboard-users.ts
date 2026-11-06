import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface SeedLeaderboardUser {
  id: string;
  name: string;
  email: string;
  xp: number;
  stream: "science" | "commercial" | "arts";
  subjects: string[];
  targetScore: number;
  streakDays: number;
  targetUniversity: string;
}

const LEADERBOARD_CANDIDATES: SeedLeaderboardUser[] = [
  {
    id: "bot_user_01",
    name: "Chinedu Okafor",
    email: "chinedu.okafor@bot.prepsmart.ng",
    xp: 3240,
    stream: "science",
    subjects: ["Use of English", "Mathematics", "Physics", "Chemistry"],
    targetScore: 345,
    streakDays: 48,
    targetUniversity: "University of Ibadan (UI)",
  },
  {
    id: "bot_user_02",
    name: "Amina Abdullahi",
    email: "amina.abdullahi@bot.prepsmart.ng",
    xp: 2980,
    stream: "science",
    subjects: ["Use of English", "Biology", "Physics", "Chemistry"],
    targetScore: 338,
    streakDays: 42,
    targetUniversity: "Ahmadu Bello University (ABU)",
  },
  {
    id: "bot_user_03",
    name: "Babajide Williams",
    email: "babajide.williams@bot.prepsmart.ng",
    xp: 2750,
    stream: "commercial",
    subjects: ["Use of English", "Mathematics", "Economics", "Accounting"],
    targetScore: 320,
    streakDays: 36,
    targetUniversity: "University of Lagos (UNILAG)",
  },
  {
    id: "bot_user_04",
    name: "Fatima Sanusi",
    email: "fatima.sanusi@bot.prepsmart.ng",
    xp: 2420,
    stream: "science",
    subjects: ["Use of English", "Mathematics", "Physics", "Chemistry"],
    targetScore: 315,
    streakDays: 29,
    targetUniversity: "Bayero University Kano (BUK)",
  },
  {
    id: "bot_user_05",
    name: "Emeka Kalu",
    email: "emeka.kalu@bot.prepsmart.ng",
    xp: 2180,
    stream: "science",
    subjects: ["Use of English", "Biology", "Physics", "Chemistry"],
    targetScore: 330,
    streakDays: 31,
    targetUniversity: "University of Nigeria, Nsukka (UNN)",
  },
  {
    id: "bot_user_06",
    name: "Blessing Okon",
    email: "blessing.okon@bot.prepsmart.ng",
    xp: 1940,
    stream: "arts",
    subjects: ["Use of English", "Literature in English", "Government", "Christian Religious Studies"],
    targetScore: 310,
    streakDays: 25,
    targetUniversity: "University of Calabar (UNICAL)",
  },
  {
    id: "bot_user_07",
    name: "Tobi Adebayo",
    email: "tobi.adebayo@bot.prepsmart.ng",
    xp: 1720,
    stream: "science",
    subjects: ["Use of English", "Mathematics", "Physics", "Chemistry"],
    targetScore: 305,
    streakDays: 22,
    targetUniversity: "Obafemi Awolowo University (OAU)",
  },
  {
    id: "bot_user_08",
    name: "Ifeoma Eze",
    email: "ifeoma.eze@bot.prepsmart.ng",
    xp: 1530,
    stream: "commercial",
    subjects: ["Use of English", "Mathematics", "Economics", "Commerce"],
    targetScore: 298,
    streakDays: 19,
    targetUniversity: "Nnamdi Azikiwe University (UNIZIK)",
  },
  {
    id: "bot_user_09",
    name: "Zainab Mohammed",
    email: "zainab.mohammed@bot.prepsmart.ng",
    xp: 1390,
    stream: "science",
    subjects: ["Use of English", "Biology", "Chemistry", "Physics"],
    targetScore: 312,
    streakDays: 18,
    targetUniversity: "Usmanu Danfodiyo University (UDUS)",
  },
  {
    id: "bot_user_10",
    name: "Olumide Bakare",
    email: "olumide.bakare@bot.prepsmart.ng",
    xp: 1250,
    stream: "science",
    subjects: ["Use of English", "Mathematics", "Physics", "Chemistry"],
    targetScore: 295,
    streakDays: 16,
    targetUniversity: "Federal University of Technology, Akure (FUTA)",
  },
  {
    id: "bot_user_11",
    name: "Kelechi Nnamdi",
    email: "kelechi.nnamdi@bot.prepsmart.ng",
    xp: 1110,
    stream: "science",
    subjects: ["Use of English", "Mathematics", "Physics", "Chemistry"],
    targetScore: 290,
    streakDays: 15,
    targetUniversity: "Federal University of Technology, Owerri (FUTO)",
  },
  {
    id: "bot_user_12",
    name: "Damilola Adeleke",
    email: "damilola.adeleke@bot.prepsmart.ng",
    xp: 990,
    stream: "arts",
    subjects: ["Use of English", "Literature in English", "Government", "History"],
    targetScore: 288,
    streakDays: 14,
    targetUniversity: "University of Ilorin (UNILORIN)",
  },
  {
    id: "bot_user_13",
    name: "Ngozi Obi",
    email: "ngozi.obi@bot.prepsmart.ng",
    xp: 870,
    stream: "science",
    subjects: ["Use of English", "Biology", "Physics", "Chemistry"],
    targetScore: 300,
    streakDays: 12,
    targetUniversity: "University of Benin (UNIBEN)",
  },
  {
    id: "bot_user_14",
    name: "Faruk Aliyu",
    email: "faruk.aliyu@bot.prepsmart.ng",
    xp: 760,
    stream: "commercial",
    subjects: ["Use of English", "Mathematics", "Economics", "Commerce"],
    targetScore: 285,
    streakDays: 11,
    targetUniversity: "Federal University, Dutse (FUD)",
  },
  {
    id: "bot_user_15",
    name: "Chinonso Anozie",
    email: "chinonso.anozie@bot.prepsmart.ng",
    xp: 660,
    stream: "science",
    subjects: ["Use of English", "Mathematics", "Physics", "Chemistry"],
    targetScore: 295,
    streakDays: 10,
    targetUniversity: "Enugu State University of Science and Technology (ESUT)",
  },
  {
    id: "bot_user_16",
    name: "Temitope Balogun",
    email: "temitope.balogun@bot.prepsmart.ng",
    xp: 580,
    stream: "arts",
    subjects: ["Use of English", "Literature in English", "Government", "Christian Religious Studies"],
    targetScore: 280,
    streakDays: 9,
    targetUniversity: "Lagos State University (LASU)",
  },
  {
    id: "bot_user_17",
    name: "Umar Garba",
    email: "umar.garba@bot.prepsmart.ng",
    xp: 510,
    stream: "science",
    subjects: ["Use of English", "Mathematics", "Physics", "Chemistry"],
    targetScore: 290,
    streakDays: 8,
    targetUniversity: "Abubakar Tafawa Balewa University (ATBU)",
  },
  {
    id: "bot_user_18",
    name: "Precious Chukwu",
    email: "precious.chukwu@bot.prepsmart.ng",
    xp: 440,
    stream: "commercial",
    subjects: ["Use of English", "Mathematics", "Economics", "Accounting"],
    targetScore: 275,
    streakDays: 7,
    targetUniversity: "Covenant University, Ota",
  },
  {
    id: "bot_user_19",
    name: "Sadiq Abubakar",
    email: "sadiq.abubakar@bot.prepsmart.ng",
    xp: 380,
    stream: "science",
    subjects: ["Use of English", "Mathematics", "Physics", "Chemistry"],
    targetScore: 285,
    streakDays: 6,
    targetUniversity: "Federal University of Petroleum Resources, Effurun (FUPRE)",
  },
  {
    id: "bot_user_20",
    name: "Abimbola Davies",
    email: "abimbola.davies@bot.prepsmart.ng",
    xp: 320,
    stream: "science",
    subjects: ["Use of English", "Biology", "Physics", "Chemistry"],
    targetScore: 280,
    streakDays: 5,
    targetUniversity: "Olabisi Onabanjo University (OOU)",
  },
  {
    id: "bot_user_21",
    name: "Somtochukwu Nwosu",
    email: "somtochukwu.nwosu@bot.prepsmart.ng",
    xp: 260,
    stream: "science",
    subjects: ["Use of English", "Mathematics", "Physics", "Chemistry"],
    targetScore: 270,
    streakDays: 4,
    targetUniversity: "Michael Okpara University of Agriculture (MOUAU)",
  },
  {
    id: "bot_user_22",
    name: "Hauwa Ibrahim",
    email: "hauwa.ibrahim@bot.prepsmart.ng",
    xp: 220,
    stream: "arts",
    subjects: ["Use of English", "Literature in English", "Government", "Islamic Studies"],
    targetScore: 275,
    streakDays: 4,
    targetUniversity: "Federal University, Kashere",
  },
  {
    id: "bot_user_23",
    name: "Femi Oladipo",
    email: "femi.oladipo@bot.prepsmart.ng",
    xp: 190,
    stream: "commercial",
    subjects: ["Use of English", "Mathematics", "Economics", "Commerce"],
    targetScore: 265,
    streakDays: 3,
    targetUniversity: "Adekunle Ajasin University (AAUA)",
  },
  {
    id: "bot_user_24",
    name: "Miracle Bassey",
    email: "miracle.bassey@bot.prepsmart.ng",
    xp: 160,
    stream: "science",
    subjects: ["Use of English", "Biology", "Chemistry", "Physics"],
    targetScore: 270,
    streakDays: 3,
    targetUniversity: "University of Uyo (UNIUYO)",
  },
  {
    id: "bot_user_25",
    name: "Yahaya Danjuma",
    email: "yahaya.danjuma@bot.prepsmart.ng",
    xp: 130,
    stream: "science",
    subjects: ["Use of English", "Mathematics", "Physics", "Chemistry"],
    targetScore: 260,
    streakDays: 2,
    targetUniversity: "Federal University of Technology, Minna (FUTMINNA)",
  },
  {
    id: "bot_user_26",
    name: "Eniola Akintola",
    email: "eniola.akintola@bot.prepsmart.ng",
    xp: 105,
    stream: "arts",
    subjects: ["Use of English", "Literature in English", "Government", "History"],
    targetScore: 255,
    streakDays: 2,
    targetUniversity: "Ekiti State University (EKSU)",
  },
  {
    id: "bot_user_27",
    name: "Godwin Effiong",
    email: "godwin.effiong@bot.prepsmart.ng",
    xp: 80,
    stream: "science",
    subjects: ["Use of English", "Mathematics", "Physics", "Chemistry"],
    targetScore: 250,
    streakDays: 1,
    targetUniversity: "Cross River University of Technology (CRUTECH)",
  },
  {
    id: "bot_user_28",
    name: "Halima Yakubu",
    email: "halima.yakubu@bot.prepsmart.ng",
    xp: 55,
    stream: "commercial",
    subjects: ["Use of English", "Mathematics", "Economics", "Commerce"],
    targetScore: 245,
    streakDays: 1,
    targetUniversity: "Kaduna State University (KASU)",
  },
];

async function seedLeaderboard() {
  console.log(`Starting leaderboard seed for ${LEADERBOARD_CANDIDATES.length} simulated candidates...`);

  let seededCount = 0;

  for (const candidate of LEADERBOARD_CANDIDATES) {
    // Upsert User with role "leaderboard_bot"
    const user = await prisma.user.upsert({
      where: { id: candidate.id },
      update: {
        name: candidate.name,
        email: candidate.email,
        role: "leaderboard_bot",
        xp: candidate.xp,
      },
      create: {
        id: candidate.id,
        name: candidate.name,
        email: candidate.email,
        role: "leaderboard_bot",
        xp: candidate.xp,
      },
    });

    // Upsert OnboardingProfile
    await prisma.onboardingProfile.upsert({
      where: { userId: user.id },
      update: {
        targetScore: candidate.targetScore,
        departmentStream: candidate.stream,
        selectedSubjects: JSON.stringify(candidate.subjects),
        proficiencyLevel: candidate.xp > 1500 ? "advanced" : "intermediate",
        dailyStudyMinutes: 45,
        preferredStudyTime: "evening",
        completed: true,
      },
      create: {
        userId: user.id,
        targetScore: candidate.targetScore,
        departmentStream: candidate.stream,
        selectedSubjects: JSON.stringify(candidate.subjects),
        proficiencyLevel: candidate.xp > 1500 ? "advanced" : "intermediate",
        dailyStudyMinutes: 45,
        preferredStudyTime: "evening",
        completed: true,
      },
    });

    // Seed mock xpHistory entries over candidate's streak days
    const existingHistory = await prisma.xpHistory.count({
      where: { userId: user.id },
    });

    if (existingHistory < 3) {
      const now = new Date();
      for (let day = 0; day < Math.min(candidate.streakDays, 7); day++) {
        const entryDate = new Date(now);
        entryDate.setDate(entryDate.getDate() - day);
        entryDate.setHours(18, 30, 0, 0);

        await prisma.xpHistory.create({
          data: {
            userId: user.id,
            eventType: day === 0 ? "DAILY_STREAK" : "QUESTION_ANSWERED",
            pointsAwarded: day === 0 ? 25 : 50,
            metadata: JSON.stringify({
              targetUniversity: candidate.targetUniversity,
              streakDay: day + 1,
            }),
            createdAt: entryDate,
          },
        });
      }
    }

    seededCount++;
  }

  console.log(`Successfully seeded ${seededCount} candidates into PostgreSQL!`);
}

seedLeaderboard()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

