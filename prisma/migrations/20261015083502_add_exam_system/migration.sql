-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "image" TEXT,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "OnboardingProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "targetScore" INTEGER NOT NULL,
    "targetExamDate" DATETIME,
    "departmentStream" TEXT NOT NULL,
    "selectedSubjects" TEXT NOT NULL,
    "proficiencyLevel" TEXT NOT NULL,
    "dailyStudyMinutes" INTEGER NOT NULL DEFAULT 45,
    "preferredStudyTime" TEXT NOT NULL DEFAULT 'evening',
    "completed" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "OnboardingProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PushSubscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "p256dh" TEXT NOT NULL,
    "auth" TEXT NOT NULL,
    "userAgent" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastNotifiedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PushSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "XpHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "pointsAwarded" INTEGER NOT NULL,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "XpHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subject" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "options" TEXT NOT NULL,
    "correctOption" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "concept" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL DEFAULT 'medium',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ExamSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'in_progress',
    "subjectMode" TEXT NOT NULL,
    "selectedSubjects" TEXT NOT NULL,
    "durationSeconds" INTEGER NOT NULL,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME NOT NULL,
    "submittedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ExamSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ExamSessionQuestion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    CONSTRAINT "ExamSessionQuestion_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ExamSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ExamSessionQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ExamAttempt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "totalQuestions" INTEGER NOT NULL,
    "accuracyPct" REAL NOT NULL,
    "timeSpentSeconds" INTEGER NOT NULL,
    "subjectMode" TEXT NOT NULL,
    "selectedSubjects" TEXT NOT NULL,
    "answers" TEXT NOT NULL,
    "correctAnswers" TEXT NOT NULL,
    "subjectBreakdown" TEXT NOT NULL,
    "guessedQuestions" TEXT,
    "failedConceptTags" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ExamAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ExamAttempt_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ExamSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FailedQuestion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "concept" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "failedCount" INTEGER NOT NULL DEFAULT 1,
    "lastFailedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FailedQuestion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "FailedQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "University" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "acronym" TEXT,
    "type" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "zone" TEXT,
    "generalCutOff" INTEGER NOT NULL,
    "postUtmeRequired" BOOLEAN NOT NULL DEFAULT true,
    "screeningType" TEXT NOT NULL,
    "annualTuitionEst" TEXT,
    "estYear" INTEGER,
    "website" TEXT,
    "campusHighlights" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CourseRequirement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "universityId" TEXT NOT NULL,
    "courseName" TEXT NOT NULL,
    "faculty" TEXT,
    "cutOffMark" INTEGER NOT NULL,
    "durationYears" INTEGER NOT NULL DEFAULT 4,
    "oLevelRequirements" TEXT,
    "directEntryAccepted" BOOLEAN NOT NULL DEFAULT true,
    "directEntryRequirements" TEXT,
    CONSTRAINT "CourseRequirement_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AdmissionDocument" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "universityId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    CONSTRAINT "AdmissionDocument_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_xp_idx" ON "User"("xp");

-- CreateIndex
CREATE UNIQUE INDEX "OnboardingProfile_userId_key" ON "OnboardingProfile"("userId");

-- CreateIndex
CREATE INDEX "OnboardingProfile_departmentStream_idx" ON "OnboardingProfile"("departmentStream");

-- CreateIndex
CREATE UNIQUE INDEX "PushSubscription_endpoint_key" ON "PushSubscription"("endpoint");

-- CreateIndex
CREATE INDEX "PushSubscription_userId_idx" ON "PushSubscription"("userId");

-- CreateIndex
CREATE INDEX "PushSubscription_isActive_idx" ON "PushSubscription"("isActive");

-- CreateIndex
CREATE INDEX "XpHistory_userId_idx" ON "XpHistory"("userId");

-- CreateIndex
CREATE INDEX "XpHistory_eventType_idx" ON "XpHistory"("eventType");

-- CreateIndex
CREATE INDEX "XpHistory_createdAt_idx" ON "XpHistory"("createdAt");

-- CreateIndex
CREATE INDEX "Question_subject_idx" ON "Question"("subject");

-- CreateIndex
CREATE INDEX "Question_year_idx" ON "Question"("year");

-- CreateIndex
CREATE INDEX "Question_subject_year_idx" ON "Question"("subject", "year");

-- CreateIndex
CREATE INDEX "Question_topic_idx" ON "Question"("topic");

-- CreateIndex
CREATE INDEX "Question_concept_idx" ON "Question"("concept");

-- CreateIndex
CREATE INDEX "Question_isActive_idx" ON "Question"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "ExamSession_sessionToken_key" ON "ExamSession"("sessionToken");

-- CreateIndex
CREATE INDEX "ExamSession_userId_idx" ON "ExamSession"("userId");

-- CreateIndex
CREATE INDEX "ExamSession_sessionToken_idx" ON "ExamSession"("sessionToken");

-- CreateIndex
CREATE INDEX "ExamSession_status_idx" ON "ExamSession"("status");

-- CreateIndex
CREATE INDEX "ExamSession_expiresAt_idx" ON "ExamSession"("expiresAt");

-- CreateIndex
CREATE INDEX "ExamSessionQuestion_sessionId_idx" ON "ExamSessionQuestion"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "ExamSessionQuestion_sessionId_questionId_key" ON "ExamSessionQuestion"("sessionId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "ExamSessionQuestion_sessionId_orderIndex_key" ON "ExamSessionQuestion"("sessionId", "orderIndex");

-- CreateIndex
CREATE UNIQUE INDEX "ExamAttempt_sessionId_key" ON "ExamAttempt"("sessionId");

-- CreateIndex
CREATE INDEX "ExamAttempt_userId_idx" ON "ExamAttempt"("userId");

-- CreateIndex
CREATE INDEX "ExamAttempt_createdAt_idx" ON "ExamAttempt"("createdAt");

-- CreateIndex
CREATE INDEX "FailedQuestion_userId_idx" ON "FailedQuestion"("userId");

-- CreateIndex
CREATE INDEX "FailedQuestion_concept_idx" ON "FailedQuestion"("concept");

-- CreateIndex
CREATE INDEX "FailedQuestion_userId_concept_idx" ON "FailedQuestion"("userId", "concept");

-- CreateIndex
CREATE INDEX "FailedQuestion_lastFailedAt_idx" ON "FailedQuestion"("lastFailedAt");

-- CreateIndex
CREATE UNIQUE INDEX "FailedQuestion_userId_questionId_key" ON "FailedQuestion"("userId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "University_slug_key" ON "University"("slug");

-- CreateIndex
CREATE INDEX "University_type_idx" ON "University"("type");

-- CreateIndex
CREATE INDEX "University_state_idx" ON "University"("state");

-- CreateIndex
CREATE INDEX "University_generalCutOff_idx" ON "University"("generalCutOff");

-- CreateIndex
CREATE INDEX "CourseRequirement_universityId_idx" ON "CourseRequirement"("universityId");

-- CreateIndex
CREATE INDEX "CourseRequirement_courseName_idx" ON "CourseRequirement"("courseName");

-- CreateIndex
CREATE INDEX "CourseRequirement_cutOffMark_idx" ON "CourseRequirement"("cutOffMark");

-- CreateIndex
CREATE INDEX "AdmissionDocument_universityId_idx" ON "AdmissionDocument"("universityId");

-- CreateIndex
CREATE INDEX "AdmissionDocument_category_idx" ON "AdmissionDocument"("category");
