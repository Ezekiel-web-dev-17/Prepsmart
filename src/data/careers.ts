export interface Career {
  id: string;
  title: string;
  degree: string;
  faculty: string;
  badgeColor: string;
  summary: string;
  jambSubjects: string[];
  waecRequirements: string;
  excelSubjects: {
    subject: string;
    importance: string;
    targetGrade: string;
  }[];
  competitiveJambScore: string;
  jobOutlook: "Very High" | "High" | "Growing";
  keySkills: string[];
  careerRoles: string[];
  topInstitutions: {
    federal: string[];
    state: string[];
    private: string[];
  };
  insiderTip: string;
}

export const CAREER_FACULTIES = [
  "All Disciplines",
  "Medical & Health Sciences",
  "Engineering & Technology",
  "Computing, AI & Software",
  "Law & Legal Studies",
  "Management & Business",
  "Social Sciences",
  "Environmental & Design",
  "Agricultural Sciences",
] as const;

export const CAREERS_DATA: Career[] = [
  {
    id: "medicine-surgery",
    title: "Medicine & Surgery",
    degree: "MBBS",
    faculty: "Medical & Health Sciences",
    badgeColor: "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border-red-200 dark:border-red-900/60",
    summary: "Diagnose, treat, and prevent illnesses in patients, perform surgical procedures, and advance public healthcare.",
    jambSubjects: ["English Language", "Biology", "Chemistry", "Physics"],
    waecRequirements: "Five (5) SSCE credit passes in English Language, Mathematics, Physics, Chemistry, and Biology at not more than ONE sitting in most top federal universities.",
    excelSubjects: [
      {
        subject: "Biology",
        importance: "Foundational for human anatomy, physiology, genetics, and cellular pathology. JAMB tests deep understanding of reproductive and circulatory systems.",
        targetGrade: "A1 (WAEC) / 75+ (JAMB)",
      },
      {
        subject: "Chemistry",
        importance: "Critical for biochemistry, pharmacokinetics, and molecular mechanisms. Organic and physical chemistry carry high weight in UTME.",
        targetGrade: "A1 (WAEC) / 75+ (JAMB)",
      },
      {
        subject: "Physics",
        importance: "Crucial for medical instrumentation, biophysics, optics, and radiation diagnostics (X-rays, MRI).",
        targetGrade: "B2+ (WAEC) / 70+ (JAMB)",
      },
      {
        subject: "English Language",
        importance: "JAMB comprehension passages often feature scientific discourse. A high English score gives the mathematical edge needed for 280+ total aggregate.",
        targetGrade: "A1 (WAEC) / 75+ (JAMB)",
      },
    ],
    competitiveJambScore: "285+",
    jobOutlook: "Very High",
    keySkills: ["Clinical Diagnosis", "Surgical Precision", "Patient Empathy", "Biochemical Analysis", "Emergency Care"],
    careerRoles: ["Medical Doctor", "General Surgeon", "Cardiologist", "Medical Researcher", "Public Health Consultant"],
    topInstitutions: {
      federal: ["University of Ibadan (UI)", "University of Lagos (UNILAG)", "Obafemi Awolowo University (OAU)", "Ahmadu Bello University (ABU)", "UNN"],
      state: ["Lagos State University (LASU)", "Olabisi Onabanjo University (OOU)", "Delta State University (DELSU)"],
      private: ["Afe Babalola University (ABUAD)", "Babcock University", "Bowen University"],
    },
    insiderTip: "Competition is fierce. Avoid combining two sittings of WAEC/NECO for Medicine at federal tier-1 universities (UI, UNILAG, UNN) as they heavily penalize or reject two sittings during Post-UTME screening.",
  },
  {
    id: "software-engineering",
    title: "Software Engineering & Computer Science",
    degree: "B.Sc / B.Eng",
    faculty: "Computing, AI & Software",
    badgeColor: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-900/60",
    summary: "Architect, build, and deploy modern software systems, scalable cloud platforms, mobile applications, and intelligent systems.",
    jambSubjects: ["English Language", "Mathematics", "Physics", "Chemistry or Biology"],
    waecRequirements: "Five (5) SSCE credit passes in English Language, Mathematics, Physics, Chemistry, and any other science subject.",
    excelSubjects: [
      {
        subject: "Mathematics",
        importance: "Forms the mathematical backbone of algorithms, discrete structures, cryptography, time complexity, and machine learning models.",
        targetGrade: "A1 (WAEC) / 80+ (JAMB)",
      },
      {
        subject: "Physics",
        importance: "Required for computer architecture, semiconductor logic gates, hardware interfacing, and systems engineering.",
        targetGrade: "B2+ (WAEC) / 70+ (JAMB)",
      },
      {
        subject: "Further Mathematics",
        importance: "High school Further Maths gives an immense advantage in matrix algebra, calculus, and discrete logic in university 100/200 levels.",
        targetGrade: "A1 / B2 (WAEC)",
      },
    ],
    competitiveJambScore: "260+",
    jobOutlook: "Very High",
    keySkills: ["Algorithmic Problem Solving", "Full-Stack Development", "Cloud Architecture", "Database Design", "Git & CI/CD"],
    careerRoles: ["Software Engineer", "Backend Architect", "Frontend Engineer", "DevOps Engineer", "Tech Founder"],
    topInstitutions: {
      federal: ["Federal University of Technology, Akure (FUTA)", "UNILAG", "OAU", "University of Ilorin (UNILORIN)", "UNIBEN"],
      state: ["LASU", "LAUTECH", "KWASU"],
      private: ["Covenant University", "Pan-Atlantic University (PAU)", "Nile University"],
    },
    insiderTip: "FUTA, UNILAG, and Covenant University have dedicated software engineering and computer science departments with ultra-modern innovation hubs and incubator networks.",
  },
  {
    id: "law",
    title: "Law & Legal Studies",
    degree: "LL.B (Bachelor of Laws)",
    faculty: "Law & Legal Studies",
    badgeColor: "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-900/60",
    summary: "Master legal jurisprudence, constitutional doctrines, corporate transactions, litigation, and human rights advocacy.",
    jambSubjects: ["English Language", "Literature in English", "Government or History", "CRS/IRS or Economics"],
    waecRequirements: "Five (5) SSCE credit passes including English Language, Literature in English, Mathematics, and any two Arts/Social Science subjects.",
    excelSubjects: [
      {
        subject: "Literature in English",
        importance: "Mandatory prerequisite. Teaches analytical comprehension, rhetoric, critical textual interpretation, and narrative deconstruction essential for legal briefs.",
        targetGrade: "A1 (WAEC) / 75+ (JAMB)",
      },
      {
        subject: "English Language",
        importance: "Precision in grammar and vocabulary is mandatory. Legal draftsmanship demands flawless synthesis and eloquence.",
        targetGrade: "A1 (WAEC) / 80+ (JAMB)",
      },
      {
        subject: "Government",
        importance: "Directly covers constitutional history, rule of law, arms of government, and fundamental rights tested heavily in UTME.",
        targetGrade: "A1 (WAEC) / 75+ (JAMB)",
      },
    ],
    competitiveJambScore: "275+",
    jobOutlook: "High",
    keySkills: ["Legal Analysis", "Oral Advocacy & Mooting", "Contract Drafting", "Critical Reasoning", "Statutory Interpretation"],
    careerRoles: ["Corporate Attorney", "Litigation Lawyer", "Arbitrator", "Legal Tech Specialist", "Judicial Officer"],
    topInstitutions: {
      federal: ["University of Lagos (UNILAG)", "University of Ibadan (UI)", "Obafemi Awolowo University (OAU)", "UNN", "UNIBEN"],
      state: ["Lagos State University (LASU)", "Olabisi Onabanjo University (OOU)", "Ekiti State University (EKSU)"],
      private: ["Afe Babalola University (ABUAD)", "Babcock University", "Baze University"],
    },
    insiderTip: "Ensure Literature in English is registered in WAEC/NECO. Many candidates with 280+ in JAMB are disqualified because they wrote CRK/Government instead of Literature in English in SSCE.",
  },
  {
    id: "pharmacy",
    title: "Pharmacy",
    degree: "Pharm.D / B.Pharm",
    faculty: "Medical & Health Sciences",
    badgeColor: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/60",
    summary: "Formulate drugs, monitor clinical pharmacotherapy, ensure patient medication safety, and pioneer pharmaceutical biotechnology.",
    jambSubjects: ["English Language", "Biology", "Chemistry", "Physics"],
    waecRequirements: "Five (5) SSCE credit passes in English Language, Mathematics, Physics, Chemistry, and Biology in not more than one sitting.",
    excelSubjects: [
      {
        subject: "Chemistry",
        importance: "Heart of pharmacy. Organic synthesis, stoichiometry, analytical chemistry, and chemical bonding are core to drug formulation.",
        targetGrade: "A1 (WAEC) / 75+ (JAMB)",
      },
      {
        subject: "Biology",
        importance: "Understanding micro-organisms, drug absorption across cell membranes, and metabolic pathways.",
        targetGrade: "A1 / B2 (WAEC) / 72+ (JAMB)",
      },
      {
        subject: "Physics",
        importance: "Critical for physical pharmacy (viscosity, colloidal dispersion, thermodynamic stability of drug formulations).",
        targetGrade: "B2+ (WAEC) / 68+ (JAMB)",
      },
    ],
    competitiveJambScore: "265+",
    jobOutlook: "Very High",
    keySkills: ["Clinical Pharmacology", "Drug Formulation", "Pharmacovigilance", "Toxicology", "Patient Counseling"],
    careerRoles: ["Clinical Pharmacist", "Industrial Drug Formulator", "Regulatory Affairs Specialist", "Community Pharmacist"],
    topInstitutions: {
      federal: ["OAU", "UI", "UNILAG", "UNN", "UNIBEN", "ABU"],
      state: ["OOU", "DELSU"],
      private: ["Madonna University", "ABUAD", "Igbinedion University"],
    },
    insiderTip: "Most Nigerian universities are transitioning to the 6-year Doctor of Pharmacy (Pharm.D) professional degree which qualifies graduates for international clinical practice.",
  },
  {
    id: "nursing-science",
    title: "Nursing Science",
    degree: "B.N.Sc",
    faculty: "Medical & Health Sciences",
    badgeColor: "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 border-cyan-200 dark:border-cyan-900/60",
    summary: "Deliver advanced patient-centered care, critical nursing interventions, health promotion, and clinical case management.",
    jambSubjects: ["English Language", "Biology", "Chemistry", "Physics"],
    waecRequirements: "Five (5) SSCE credit passes in English, Mathematics, Biology, Chemistry, and Physics at not more than two sittings (one sitting strictly preferred by UNILAG and UI).",
    excelSubjects: [
      {
        subject: "Biology",
        importance: "Foundation of human physiology, microbiology, pathogen identification, and nursing interventions.",
        targetGrade: "A1 (WAEC) / 75+ (JAMB)",
      },
      {
        subject: "Chemistry",
        importance: "Essential for fluid-electrolyte balances, IV administration, and pharmacology calculation basics.",
        targetGrade: "B2+ (WAEC) / 70+ (JAMB)",
      },
      {
        subject: "English Language",
        importance: "Vital for patient records, clinical shift handovers, and international nursing council exams (NCLEX/IELTS).",
        targetGrade: "A1 / B2 (WAEC) / 75+ (JAMB)",
      },
    ],
    competitiveJambScore: "260+",
    jobOutlook: "Very High",
    keySkills: ["Patient Monitoring", "Triage & Emergency Care", "Wound Management", "Empathetic Communication", "Pharmacotherapy"],
    careerRoles: ["Registered Nurse (RN)", "Pediatric Nurse", "ICU Specialist Nurse", "Nurse Anesthetist", "Healthcare Administrator"],
    topInstitutions: {
      federal: ["University of Ibadan (UI)", "UNILAG", "OAU", "UNIBEN", "UNILORIN"],
      state: ["LASU", "LAUTECH", "EBSU"],
      private: ["Afe Babalola University (ABUAD)", "Babcock University", "Bowen University"],
    },
    insiderTip: "Nursing Science currently experiences record-high JAMB applicant numbers due to global healthcare demand. Aiming for 260+ and distinction in Biology gives you top placement.",
  },
  {
    id: "mechanical-engineering",
    title: "Mechanical Engineering",
    degree: "B.Eng",
    faculty: "Engineering & Technology",
    badgeColor: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900/60",
    summary: "Design thermal and mechanical devices, robotics, automotive power trains, manufacturing automation, and industrial turbines.",
    jambSubjects: ["English Language", "Mathematics", "Physics", "Chemistry"],
    waecRequirements: "Five (5) SSCE credit passes in Mathematics, English Language, Physics, Chemistry, and any other Science subject.",
    excelSubjects: [
      {
        subject: "Physics",
        importance: "Classical mechanics, thermodynamics, fluid dynamics, work, energy, power, and projectile motion are everyday mechanical fundamentals.",
        targetGrade: "A1 (WAEC) / 75+ (JAMB)",
      },
      {
        subject: "Mathematics",
        importance: "Calculus, vectors, differential equations, and coordinate geometry are heavily applied in engineering stress analysis.",
        targetGrade: "A1 (WAEC) / 75+ (JAMB)",
      },
      {
        subject: "Technical Drawing / Further Maths",
        importance: "Offers massive edge in engineering graphics (orthographic projections, CAD) and advanced matrix mechanics.",
        targetGrade: "B2+ (WAEC)",
      },
    ],
    competitiveJambScore: "250+",
    jobOutlook: "High",
    keySkills: ["Thermodynamics", "CAD Modeling (SolidWorks/AutoCAD)", "Material Science", "Mechatronics", "Fluid Mechanics"],
    careerRoles: ["Mechanical Systems Engineer", "Aerospace Design Engineer", "HVAC Specialist", "Plant Reliability Engineer"],
    topInstitutions: {
      federal: ["FUTA", "UNILAG", "OAU", "ABU", "UNN", "FUTMINNA"],
      state: ["LAUTECH", "LASU", "RSU"],
      private: ["Covenant University", "Landmark University", "ABUAD"],
    },
    insiderTip: "Technical drawing is not compulsory in JAMB, but having it in secondary school will save you immense stress in university 100-level Engineering Drawing courses.",
  },
  {
    id: "electrical-electronics",
    title: "Electrical & Electronics Engineering",
    degree: "B.Eng",
    faculty: "Engineering & Technology",
    badgeColor: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900/60",
    summary: "Engineer power generation grids, renewable micro-grids, embedded systems, robotics circuits, and telecommunication hardware.",
    jambSubjects: ["English Language", "Mathematics", "Physics", "Chemistry"],
    waecRequirements: "Five (5) SSCE credit passes in English Language, Mathematics, Physics, Chemistry, and any other science subject.",
    excelSubjects: [
      {
        subject: "Physics",
        importance: "Electromagnetism, alternating currents (AC circuits), semiconductor physics, and electrical potential fields.",
        targetGrade: "A1 (WAEC) / 75+ (JAMB)",
      },
      {
        subject: "Mathematics",
        importance: "Complex numbers, Fourier analysis, differential equations, and matrix algebra for electrical circuit simulations.",
        targetGrade: "A1 (WAEC) / 75+ (JAMB)",
      },
    ],
    competitiveJambScore: "255+",
    jobOutlook: "Very High",
    keySkills: ["Circuit Simulation (SPICE)", "Microcontroller Programming", "Power Distribution", "Signal Processing", "Embedded C"],
    careerRoles: ["Electrical Power Engineer", "Embedded Systems Designer", "IoT Hardware Architect", "Renewable Energy Engineer"],
    topInstitutions: {
      federal: ["UNILAG", "FUTA", "OAU", "UNN", "UNIBEN", "FUTO"],
      state: ["LASU", "LAUTECH", "KWASU"],
      private: ["Covenant University", "ABUAD", "Nile University"],
    },
    insiderTip: "Electrical Engineering easily pivots into robotics and IoT hardware development. Strong math fundamentals make hardware-software bridging seamless.",
  },
  {
    id: "accounting-finance",
    title: "Accounting & Financial Management",
    degree: "B.Sc",
    faculty: "Management & Business",
    badgeColor: "bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border-teal-200 dark:border-teal-900/60",
    summary: "Master corporate financial accounting, forensic auditing, taxation laws, asset valuations, and strategic CFO financial planning.",
    jambSubjects: ["English Language", "Mathematics", "Economics", "Any of Commerce, Government, Accounting"],
    waecRequirements: "Five (5) SSCE credit passes in English Language, Mathematics, Economics, and any other two Commercial/Social Science subjects.",
    excelSubjects: [
      {
        subject: "Mathematics",
        importance: "Required for financial analytics, quantitative economics, interest compounding, probability, and risk modeling.",
        targetGrade: "A1 / B2 (WAEC) / 75+ (JAMB)",
      },
      {
        subject: "Economics",
        importance: "Covers macro/micro-economic principles, market equilibrium, monetary policy, and fiscal theories tested in UTME.",
        targetGrade: "A1 (WAEC) / 75+ (JAMB)",
      },
      {
        subject: "Financial Accounting",
        importance: "Balance sheet reconciliation, ledger entries, depreciation, and trial balances give an immediate headstart in ICAN/ACCA certifications.",
        targetGrade: "A1 (WAEC)",
      },
    ],
    competitiveJambScore: "240+",
    jobOutlook: "High",
    keySkills: ["Financial Statement Analysis", "Auditing & Compliance", "Tax Strategy", "ERP Systems (SAP/NetSuite)", "Excel Modeling"],
    careerRoles: ["Chartered Accountant (ICAN/ACCA)", "Auditor (Big 4)", "Investment Banker", "Tax Consultant", "Financial Controller"],
    topInstitutions: {
      federal: ["UNILAG", "UI", "OAU", "UNILORIN", "ABU"],
      state: ["LASU", "OOU", "EKSU"],
      private: ["Covenant University", "Babcock University", "Pan-Atlantic University (PAU)"],
    },
    insiderTip: "Institutions like UNILAG, Covenant, and Babcock have direct ICAN accreditation exemptions, saving graduates up to 2 years of professional certification exams.",
  },
  {
    id: "artificial-intelligence-data",
    title: "Artificial Intelligence & Data Science",
    degree: "B.Sc",
    faculty: "Computing, AI & Software",
    badgeColor: "bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300 border-violet-200 dark:border-violet-900/60",
    summary: "Build machine learning systems, deep neural networks, large language models, computer vision engines, and big data pipelines.",
    jambSubjects: ["English Language", "Mathematics", "Physics", "Chemistry or Biology"],
    waecRequirements: "Five (5) SSCE credit passes in English Language, Mathematics, Physics, Chemistry, and any other science subject.",
    excelSubjects: [
      {
        subject: "Mathematics & Further Maths",
        importance: "Machine learning is applied linear algebra, multivariate calculus, probability distributions, and vector spaces.",
        targetGrade: "A1 (WAEC) / 80+ (JAMB)",
      },
      {
        subject: "Physics",
        importance: "Mathematical modeling of complex systems, signals, and statistical mechanics concepts that inspired neural networks.",
        targetGrade: "A1 / B2 (WAEC) / 70+ (JAMB)",
      },
    ],
    competitiveJambScore: "265+",
    jobOutlook: "Very High",
    keySkills: ["Python (PyTorch/TensorFlow)", "Linear Algebra & Statistics", "Data Modeling", "Deep Learning Architectures", "Prompt Engineering"],
    careerRoles: ["Machine Learning Engineer", "Data Scientist", "AI Research Scientist", "Data Engineer", "Computer Vision Specialist"],
    topInstitutions: {
      federal: ["FUTA", "UNILAG", "OAU", "FUTMINNA"],
      state: ["KWASU", "LASU"],
      private: ["Pan-Atlantic University (PAU)", "Covenant University", "Nile University"],
    },
    insiderTip: "Recently approved as standalone degree by NUC (National Universities Commission). FUTA and UNILAG are leading pioneers in this discipline in Nigeria.",
  },
  {
    id: "economics",
    title: "Economics",
    degree: "B.Sc",
    faculty: "Social Sciences",
    badgeColor: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/60",
    summary: "Study resource allocation, macroeconomic indicators, econometrics, capital markets, public policy, and monetary economics.",
    jambSubjects: ["English Language", "Economics", "Mathematics", "Government, Commerce or Geography"],
    waecRequirements: "Five (5) SSCE credit passes including English Language, Mathematics, Economics, and two other Arts/Social Science subjects.",
    excelSubjects: [
      {
        subject: "Mathematics",
        importance: "University economics is highly mathematical (econometrics, calculus optimization, game theory, linear programming).",
        targetGrade: "A1 / B2 (WAEC) / 75+ (JAMB)",
      },
      {
        subject: "Economics",
        importance: "Core UTME subject. Strong grasp of elasticities, national income accounting, and inflation dynamics is needed.",
        targetGrade: "A1 (WAEC) / 75+ (JAMB)",
      },
    ],
    competitiveJambScore: "245+",
    jobOutlook: "High",
    keySkills: ["Econometric Modeling (STATA/R)", "Policy Research", "Statistical Analysis", "Market Forecasting", "Macroeconomic Analysis"],
    careerRoles: ["Economic Analyst", "Central Bank Policy Officer", "Management Consultant (McKinsey/BCG)", "Risk Analyst"],
    topInstitutions: {
      federal: ["University of Ibadan (UI)", "UNILAG", "OAU", "UNN", "ABU"],
      state: ["LASU", "EKSU"],
      private: ["Pan-Atlantic University (PAU)", "Covenant University", "Baze University"],
    },
    insiderTip: "UI and UNILAG have prestigious economics faculties whose alumni head major international financial institutions and the Central Bank of Nigeria (CBN).",
  },
  {
    id: "mass-communication",
    title: "Mass Communication & Media Studies",
    degree: "B.Sc / B.A",
    faculty: "Social Sciences",
    badgeColor: "bg-pink-50 text-pink-700 dark:bg-pink-950/60 dark:text-pink-300 border-pink-200 dark:border-pink-900/60",
    summary: "Broadcasting, multimedia journalism, digital content production, corporate communications, PR, and advertising campaigns.",
    jambSubjects: ["English Language", "Literature in English", "Government or CRS/IRS", "Any other Arts/Social Science subject"],
    waecRequirements: "Five (5) SSCE credit passes in English Language, Mathematics, Literature in English, and two Arts/Social Science subjects.",
    excelSubjects: [
      {
        subject: "English Language",
        importance: "The primary tool of trade. Scriptwriting, editing, and voiceover broadcasting require pristine diction and vocabulary.",
        targetGrade: "A1 (WAEC) / 75+ (JAMB)",
      },
      {
        subject: "Literature in English",
        importance: "Vital for storytelling, narrative pacing, creative writing, and thematic characterization.",
        targetGrade: "A1 (WAEC) / 70+ (JAMB)",
      },
      {
        subject: "Government",
        importance: "Crucial for political journalism, media laws, censorship regulations, and public policy reporting.",
        targetGrade: "B2+ (WAEC) / 70+ (JAMB)",
      },
    ],
    competitiveJambScore: "235+",
    jobOutlook: "High",
    keySkills: ["Broadcast Production", "Copywriting & Storytelling", "Investigative Journalism", "Social Media Strategy", "Public Relations"],
    careerRoles: ["Broadcast Journalist", "PR Director", "Digital Media Strategist", "Investigative Reporter", "Corporate Communications Lead"],
    topInstitutions: {
      federal: ["UNILAG", "University of Nigeria (UNN)", "University of Benin (UNIBEN)", "University of Ilorin (UNILORIN)"],
      state: ["Lagos State University (LASU)", "OOU"],
      private: ["Pan-Atlantic University (SMC)", "Babcock University", "Covenant University"],
    },
    insiderTip: "UNILAG and Pan-Atlantic University (School of Media and Communication) offer industry-standard radio/TV studios with direct broadcast licences.",
  },
  {
    id: "architecture",
    title: "Architecture",
    degree: "B.Sc / B.Arch",
    faculty: "Environmental & Design",
    badgeColor: "bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 border-orange-200 dark:border-orange-900/60",
    summary: "Design sustainable structural spaces, urban landscapes, building blueprints, interior architecture, and 3D architectural renders.",
    jambSubjects: ["English Language", "Physics", "Mathematics", "Chemistry, Geography or Fine Art"],
    waecRequirements: "Five (5) SSCE credit passes in English Language, Mathematics, Physics, and any two of Chemistry, Geography, Fine Art, Technical Drawing.",
    excelSubjects: [
      {
        subject: "Physics",
        importance: "Structural mechanics, acoustics, lighting optics, and materials load distribution.",
        targetGrade: "A1 / B2 (WAEC) / 70+ (JAMB)",
      },
      {
        subject: "Mathematics",
        importance: "Geometry, trigonometry, dimension scaling, and spatial coordinates calculations.",
        targetGrade: "A1 / B2 (WAEC) / 70+ (JAMB)",
      },
      {
        subject: "Fine Art / Technical Drawing",
        importance: "Essential for spatial visualization, freehand sketching, elevation drawings, and perspective rendering.",
        targetGrade: "A1 / B2 (WAEC)",
      },
    ],
    competitiveJambScore: "245+",
    jobOutlook: "High",
    keySkills: ["BIM (Revit / ArchiCAD)", "Spatial Design", "3D Visualization (Lumion/Blender)", "Structural Blueprints", "Urban Planning"],
    careerRoles: ["Architect", "BIM Coordinator", "Urban Designer", "Interior Architect", "Landscape Architect"],
    topInstitutions: {
      federal: ["FUTA", "UNILAG", "ABU (Zaria)", "OAU", "UNN"],
      state: ["LAUTECH", "LASU"],
      private: ["Covenant University", "ABUAD"],
    },
    insiderTip: "ABU Zaria and FUTA have world-renowned architecture schools with rigorous studio critique culture accredited by NIA (Nigerian Institute of Architects).",
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity & Information Assurance",
    degree: "B.Sc",
    faculty: "Computing, AI & Software",
    badgeColor: "bg-slate-50 text-slate-700 dark:bg-slate-900/60 dark:text-slate-300 border-slate-200 dark:border-slate-800",
    summary: "Defend critical infrastructure, protect against cyber threats, conduct penetration tests, and analyze digital forensic traces.",
    jambSubjects: ["English Language", "Mathematics", "Physics", "Chemistry or Biology"],
    waecRequirements: "Five (5) SSCE credit passes in English Language, Mathematics, Physics, Chemistry, and any other science subject.",
    excelSubjects: [
      {
        subject: "Mathematics",
        importance: "Foundation of asymmetric cryptography, hashing algorithms, modular arithmetic, and discrete probability.",
        targetGrade: "A1 / B2 (WAEC) / 75+ (JAMB)",
      },
      {
        subject: "Physics",
        importance: "Signal transmission, network hardware, fiber optics, and electromagnetic interference.",
        targetGrade: "B2+ (WAEC) / 70+ (JAMB)",
      },
    ],
    competitiveJambScore: "250+",
    jobOutlook: "Very High",
    keySkills: ["Ethical Hacking (Pentesting)", "Network Security", "Incident Response", "Cryptography", "SOC Analysis"],
    careerRoles: ["Cybersecurity Analyst", "Penetration Tester", "Security Operations Center (SOC) Lead", "Cloud Security Engineer"],
    topInstitutions: {
      federal: ["FUTA", "FUTMINNA", "UNILAG", "University of Ilorin"],
      state: ["KWASU", "LASU"],
      private: ["Nile University", "Covenant University", "Babcock University"],
    },
    insiderTip: "Pairing a university degree in Cybersecurity with industry badges (CompTIA Security+, CEH) guarantees rapid placement in banking and fintech security teams.",
  },
  {
    id: "agricultural-science",
    title: "Agricultural Economics & Agribusiness",
    degree: "B.Agric",
    faculty: "Agricultural Sciences",
    badgeColor: "bg-lime-50 text-lime-700 dark:bg-lime-950/60 dark:text-lime-300 border-lime-200 dark:border-lime-900/60",
    summary: "Modernize agricultural value chains, food security systems, precision farming technologies, and international commodity export trade.",
    jambSubjects: ["English Language", "Chemistry", "Biology or Agricultural Science", "Mathematics or Physics"],
    waecRequirements: "Five (5) SSCE credit passes in English Language, Mathematics, Chemistry, Biology/Agricultural Science, and Physics.",
    excelSubjects: [
      {
        subject: "Agricultural Science / Biology",
        importance: "Crop physiology, soil microbiology, livestock breeding genetics, and pest management cycles.",
        targetGrade: "A1 (WAEC) / 70+ (JAMB)",
      },
      {
        subject: "Chemistry",
        importance: "Soil fertility testing, fertilizer chemistry, agrochemical formulation, and food preservation biochemistry.",
        targetGrade: "B2+ (WAEC) / 65+ (JAMB)",
      },
      {
        subject: "Economics / Mathematics",
        importance: "Crucial for agricultural farm management budgets, supply chain logistics, and export exchange rates.",
        targetGrade: "B2+ (WAEC)",
      },
    ],
    competitiveJambScore: "210+",
    jobOutlook: "Growing",
    keySkills: ["Agribusiness Strategy", "Supply Chain Optimization", "Soil Analysis", "AgTech Precision Tools", "Commodity Export Logistics"],
    careerRoles: ["Agribusiness Consultant", "Farm Enterprise Manager", "Commodities Trader", "Agricultural Policy Analyst"],
    topInstitutions: {
      federal: ["Federal University of Agriculture, Abeokuta (FUNAAB)", "UI", "OAU", "University of Ilorin"],
      state: ["LAUTECH", "EKSU"],
      private: ["Landmark University", "ABUAD"],
    },
    insiderTip: "FUNAAB and Landmark University have massive farm estates, mechanized harvesting tractors, and processing factories for deep practical training.",
  },
];
