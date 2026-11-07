# Rule: Unified Syllabus-Roadmap Single Source of Truth

1. **Roadmap IS the Syllabus**: In PrepSmart, the Interactive Visual Roadmap and the Official JAMB Syllabus are NOT separate features or disconnected curricula. The visual flowchart is the primary interactive visualization of the syllabus itself.
2. **1:1 Curriculum Parity**: Every topic, stage, content bullet, objective, and examiner trap displayed on the roadmap must directly derive from the official JAMB UTME syllabus models (`SubjectCurriculum` in `curriculum-data.ts` and `src/data/syllabuses/`).
3. **Dual View Presentation**: When viewing any subject syllabus in `/study`, provide both the visual Roadmap.sh flowchart view and the detailed syllabus document outline view without navigating away to separate routes.
4. **Active Learning Gate**: Every syllabus topic on the roadmap must link to the `TopicMasteryDrawer` featuring syllabus objectives, recommended Nigerian textbook readings, Feynman AI evaluation, and 5-15 CBT practice questions.

