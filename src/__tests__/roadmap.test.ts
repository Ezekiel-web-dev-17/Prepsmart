import { describe, it } from "node:test";
import assert from "node:assert";
import {
  getRoadmapForSubject,
  convertCurriculumToRoadmap,
  SCIENCE_MATHEMATICS_ROADMAP,
  SCIENCE_PHYSICS_ROADMAP,
  COMMERCIAL_ECONOMICS_ROADMAP,
  ARTS_GOVERNMENT_ROADMAP,
} from "../lib/roadmap-curriculum";
import { getSubjectCurriculum } from "../app/study/curriculum-data";
import { generateJambDorkQueries, enrichQuestionWithConceptData } from "../lib/jamb-dorker";

describe("Visual Learning Roadmap & Syllabus Architecture", () => {
  it("provides comprehensive stages and topics for Science Mathematics", () => {
    const roadmap = getRoadmapForSubject("mathematics", "science");
    assert.strictEqual(roadmap.code, "MTH");
    assert.ok(roadmap.stages.length >= 3, "Expected at least 3 stages in Mathematics");

    const allTopics = roadmap.stages.flatMap((s) => s.topics);
    assert.ok(allTopics.length >= 5, "Expected at least 5 topics");

    // Verify first topic has rich syllabus details and textbook advice
    const firstTopic = allTopics[0];
    assert.ok(firstTopic.syllabusOutlines.length > 0, "Expected syllabus outlines");
    assert.ok(firstTopic.textbookAdvice.length > 0, "Expected recommended textbooks");
    assert.ok(firstTopic.keyFormulasOrRules.length > 0, "Expected formulas or rules");
  });

  it("translates official syllabus curriculum 1:1 into visual roadmap stages and topics", () => {
    const mathCurriculum = getSubjectCurriculum("science", "mathematics");
    const roadmap = convertCurriculumToRoadmap(mathCurriculum);

    assert.strictEqual(roadmap.stages.length, mathCurriculum.sections.length);
    assert.strictEqual(roadmap.name, mathCurriculum.subjectName);

    // Verify each stage title matches the corresponding section title
    mathCurriculum.sections.forEach((sec, idx) => {
      assert.strictEqual(roadmap.stages[idx].title, sec.sectionTitle);
      assert.strictEqual(roadmap.stages[idx].topics.length, sec.topics.length);
    });
  });

  it("provides valid roadmap structures for Physics, Economics, Government, and Use of English", () => {
    const physicsRoadmap = getRoadmapForSubject("physics", "science");
    assert.strictEqual(physicsRoadmap.id, "physics");
    assert.ok(physicsRoadmap.stages.length >= 3);

    const econRoadmap = getRoadmapForSubject("economics", "commercial");
    assert.strictEqual(econRoadmap.id, "economics");

    const govRoadmap = getRoadmapForSubject("government", "arts");
    assert.strictEqual(govRoadmap.id, "government");

    const engRoadmap = getRoadmapForSubject("english", "science");
    assert.strictEqual(engRoadmap.id, "english");
    assert.ok(engRoadmap.stages.length >= 2);
  });

  it("generates authentic Nigerian Google dork search queries", () => {
    const queries = generateJambDorkQueries("Physics", "Kinematics");
    assert.ok(queries.length >= 2);
    assert.ok(queries[0].dorkQuery.includes("myschool.ng"));
    assert.ok(queries[0].dorkQuery.includes("Kinematics"));
  });

  it("enriches concepts with memory mnemonics and vector SVG diagrams", () => {
    const enrichment = enrichQuestionWithConceptData("Kinematics and Projectiles");
    assert.ok(enrichment.mnemonic?.includes("FORTY-FIVE"));
    assert.ok(enrichment.diagramSvg?.includes("<svg"));
  });
});

