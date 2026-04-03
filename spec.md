# School ERP India

## Current State
The Examinations page (`/home/ubuntu/workspace/.old/src/frontend/src/pages/Examinations.tsx`) has 4 tabs: Timetable Maker, Exam Schedule, Results, Print Marksheet.

The current Timetable Maker tab is manual-entry only:
- User creates exam groups (e.g. "Half Yearly 2025-26")
- Then adds individual entries one-by-one: date, time, subject, class, section, max marks, min marks, venue
- A filter grid shows entries grouped by exam group and class
- Print button generates a basic HTML timetable sheet

Subjects are stored in `localStorage` under key `erp_subjects` as an array of `{ id, name, class, code, ... }` (set in Academics module). Subjects can be filtered per class.

Classes are stored in `localStorage` under key `erp_classes`.

## Requested Changes (Diff)

### Add
- **Auto-generate timetable wizard** as the primary UX in the Timetable Maker tab. A structured entry form with:
  - Exam Name (text)
  - Exam Start Date (date picker)
  - Exam End Date (date picker)
  - Daily Time From / Time To (time pickers)
  - Classes participating (multi-select checkboxes from CLASS_LIST)
  - Subjects selection: for each selected class, suggest subjects from `erp_subjects` localStorage (filtered by class); user can check/uncheck or manually type to add custom subjects. Also allow a shared subject list if user doesn't want per-class subjects.
  - Max Marks and Min Marks (defaults 100 / 33, user can change per subject or globally)
  - "Generate Timetable" button
- **Auto-distribution engine**: on Generate, the system distributes subjects across the available dates (skipping Sundays). If subjects > available days, wrap or flag overflow. Each date gets one subject. If multiple classes selected, each class gets its own copy of the timetable on the same dates (same subject per date across classes, or per-class subjects if specified per class).
- **Generated timetable view**: after generation, show a beautiful grid/card timetable grouped by class. Each class has its own timetable panel showing: Date | Day | Subject | Time | Max Marks | Min Marks.
- **Drag-and-drop reordering**: each timetable row is draggable (using HTML5 drag-and-drop or a simple DnD approach). Users can drag rows up/down to swap subject order within a class timetable. Also provide up/down arrow buttons as alternative.
- **Per-class print**: a "Print" button per class timetable generates a printable sheet for that class only (school name from `erp_school_profile` localStorage, exam name, class, full table with date/day/subject/time/marks, principal/class teacher signature lines).
- **Save generated timetable**: persist generated timetable to `erp_exam_timetable` localStorage in the existing format so the Exam Schedule tab also reflects it.

### Modify
- The existing manual add-entry form in Timetable Maker should remain accessible but moved to a collapsible "Advanced / Manual Entry" section below the auto-generate wizard, so power users can still add individual rows.
- Print Timetable button at top level should print all classes combined.

### Remove
- Nothing removed. Existing tabs (Exam Schedule, Results, Print Marksheet) are unchanged.

## Implementation Plan
1. Add `ExamWizard` state block: `wizardExamName`, `wizardStartDate`, `wizardEndDate`, `wizardTimeFrom`, `wizardTimeTo`, `wizardClasses` (array), `wizardSubjectsByClass` (map class→subject[]), `wizardMaxMarks`, `wizardMinMarks`.
2. Build the wizard form UI as a card at the top of the timetable tab.
3. Implement `generateTimetable()` function: enumerate dates from start to end (skip Sundays), zip with subjects array per class, produce `ExamTimetableEntry[]` objects.
4. Store generated entries in `generatedTimetable` state (separate from manual `timetableEntries` or merged into it).
5. Render per-class timetable cards below the wizard. Each row is draggable. Implement drag-and-drop swap logic using `onDragStart`, `onDragOver`, `onDrop` handlers (no external library needed).
6. Add up/down arrow buttons on each row as alternative to DnD.
7. Add per-class Print button that opens a styled print window.
8. Persist final timetable to `erp_exam_timetable` localStorage.
9. Keep existing manual entry form in a collapsible section.
