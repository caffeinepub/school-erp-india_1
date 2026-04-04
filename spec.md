# School ERP India

## Current State

A full-featured School ERP web application exists with modules: Students, Fees, Attendance, Examinations (with exam timetable maker), Academics, HR, Transport, Certificate, WhatsApp, Inventory, Expenses, Homework, Reports, Settings, Alumni.

The Examination Timetable Maker already exists in `src/frontend/src/pages/Examinations.tsx` — it allows setting up exam dates, subjects, classes and auto-generates a per-class timetable with drag-and-drop subject reordering.

The Academics module (`src/frontend/src/pages/Academics.tsx`) has a basic Timetable tab (period grid per class).

Teacher/staff data is stored in `localStorage` under `erp_staff`. Subject data under `erp_subjects`. Class data under `erp_classes`.

## Requested Changes (Diff)

### Add
- **New page**: `TeacherTimetable.tsx` — a dedicated Teacher Class Timetable module accessible from the sidebar under Academics or as its own entry
- **Wizard Step 1**: Teacher setup — add teachers (name), assign which classes and subjects each teacher teaches
- **Wizard Step 2**: Period/Schedule setup — define number of periods per day, days of the week, period timings
- **Timetable Grid**: Visual grid (rows = periods, columns = days Mon-Sat) for each class, each cell shows Teacher + Subject, individually drag-and-droppable
- **Teacher Panel**: Left-side draggable panel listing all teachers with their assigned subjects — drag a teacher+subject card onto a period cell
- **Subject Panel**: Also individually drag-and-droppable subject chips
- **Auto-Generate button**: Randomly distributes teacher-subject assignments across the period grid without conflicts (same teacher not in two classes at same period)
- **Re-Generate button**: Re-shuffles on each press (before Save)
- **Save button**: Locks the timetable to localStorage; saved timetables are listed and can be printed
- **Print view**: Printable timetable per class showing teacher names, subjects, period timings
- **Route**: `/teacher-timetable` added to `App.tsx`
- **Sidebar**: Entry added under Academics section or as standalone navigation item

### Modify
- `App.tsx`: Add route `/teacher-timetable` → `<TeacherTimetable />`
- `Sidebar.tsx`: Add "Teacher Timetable" nav item with appropriate icon

### Remove
- Nothing removed

## Implementation Plan

1. Create `src/frontend/src/pages/TeacherTimetable.tsx`:
   - Wizard with 2 steps: (1) Teacher + class/subject assignment, (2) Period/timing setup
   - Step 1: Add teachers (pull from `erp_staff` if available), assign class + subject pairs per teacher with add/remove UI
   - Step 2: Choose days (Mon-Sat), number of periods (configurable), start time and period duration
   - Timetable grid: rows = periods (Period 1..N), columns = Mon/Tue/Wed/Thu/Fri/Sat, cells show assigned Teacher + Subject
   - Drag source: Teacher+Subject chips from left panel; drag target: period grid cells
   - Auto-Generate: distributes assignments across grid, avoids placing same teacher in two cells in the same period slot across classes if multi-class view is used
   - Re-Generate reshuffles every press
   - Save stores to `localStorage` under `erp_teacher_timetable`
   - Saved timetables listed below with a Print button
   - Print: opens printable window with styled table

2. Update `App.tsx` to import and route `TeacherTimetable`

3. Update `Sidebar.tsx` to add Teacher Timetable nav item
