# School ERP India

## Current State

- Academics page has 4 tabs: Classes & Sections, Subjects, Timetable, Syllabus. No dedicated class teacher per section assignment exists. Classes have a single teacher field (not section-specific).
- Students are stored in `erp_students` (localStorage) with fields: id, admNo, name, className, section, status, oldBalance, etc. No session field on students. No promotion/session migration logic exists.
- Fees stored in `erp_fee_payments` with no session field. Old balance is a plain number on the student record with no month-wise breakdown.
- HR staff stored in `erp_staff`. No class teacher assignment link from staff to section.
- App.tsx uses hash-based routing. No `/promote` or `/class-teachers` route exists yet.

## Requested Changes (Diff)

### Add

1. **Class Teacher Assignment tab** in Academics (new 5th tab: "Class Teachers")
   - Grid showing all class-sections (e.g. Class 1-A, Class 1-B, Class 2-A...)
   - Dropdown to assign one teacher per section (pulls from `erp_staff`)
   - Conflict prevention: if Class 3-A already has a class teacher, selecting another teacher for 3-A shows an error and blocks the assignment
   - Each teacher can teach multiple subjects across different classes (already handled via erp_subjects)
   - Data stored in `erp_class_teachers`: `Array<{ classSection: string, teacherName: string, teacherId: string }>`

2. **Promote Students module** — new page at `/promote` added to sidebar under Students
   - **Step 1 — Session Setup**: User sees current session (e.g. 2025-26), enters new session (e.g. 2026-27)
   - **Step 2 — Class Selection**: Table showing all active classes with count of students per class-section. Checkboxes to select which classes to promote (bulk: select all or per class)
   - **Step 3 — Review**: Preview list of students being promoted (current class → next class). Class 10 students marked as "Passing Out" (will be auto-discontinued with status "Passed Out")
   - **Step 4 — Execute Promotion**:
     - Archive current session data: save `erp_sessions_archive` with key `2025-26` containing snapshot of all students + all fee payments
     - Add `session` field to each student and to each fee payment record going forward
     - For promoted students: increment class (Class 1→2, ..., Class 9→10, Class 10→Discontinued/Passed Out)
     - Class 10 students: set status = "Discontinued", leavingReason = "Passed Out", leavingDate = today
     - For each promoted student: calculate month-wise unpaid dues from `erp_fee_payments` for the old session and store as `prevSessionDues: Array<{ month: string, year: string, amount: number }>` on the student record
     - Set student.oldBalance = sum of all unpaid fees from previous session
     - Update student.session = new session label
   - **Dues Carry Forward (month-wise)**: In Fees > Dues Fees tab, if student has `prevSessionDues`, show a separate section "Previous Session Dues (2025-26)" with month-wise breakdown table showing which months are still unpaid
   - New session label also stored in Settings under `erp_settings.currentSession`

3. **Session field** added to Student data model and PaymentRecord going forward
   - Existing students get session = "2025-26" on first run (migration)
   - Existing payment records get session = "2025-26" on first run

### Modify

- `Academics.tsx`: Add a 5th tab "Class Teachers" with the assignment UI
- `Students.tsx`: Add `session` and `prevSessionDues` fields to the Student interface; update demoData migration to stamp session
- `Fees.tsx`: 
  - Add `session` field to PaymentRecord
  - In Dues Fees tab: show previous session month-wise dues section when `student.prevSessionDues` exists
  - Ledger balance to include prevSessionDues total
- `App.tsx`: Add route `/promote` and sidebar entry "Promote Students" under Students section
- `Sidebar.tsx`: Add "Promote Students" navigation item
- `demoData.ts`: Add session field to demo students

### Remove

- Nothing removed

## Implementation Plan

1. Add `session` and `prevSessionDues` fields to Student interface in `Students.tsx`; add migration code to stamp existing records with "2025-26"
2. Add `session` field to PaymentRecord in `Fees.tsx`; migrate existing records
3. Create new `ClassTeachersTab` component inside `Academics.tsx` — grid of all sections with teacher dropdown, conflict check on save (block if section already assigned to different teacher)
4. Create new page `src/frontend/src/pages/PromoteStudents.tsx` with 4-step wizard:
   - Step 1: current session display + new session input
   - Step 2: class-section checklist with student counts
   - Step 3: review table (student name, current class+section, next class+section, dues amount)
   - Step 4: confirm & execute — archive, promote, carry forward dues
5. In `Fees.tsx` Dues Fees tab: add "Previous Session Dues" section below existing dues grid when `student.prevSessionDues` is populated
6. Add `/promote` route to `App.tsx`
7. Add "Promote Students" entry to `Sidebar.tsx`
8. Validate and build
