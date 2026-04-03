# School ERP India

## Current State
The Exam Timetable Maker in `src/frontend/src/pages/Examinations.tsx` has:
- Auto-generate wizard (exam name, date range, times, marks, classes, subjects per class)
- Generates per-class timetable cards with drag-and-drop row reordering and up/down arrows
- Currently drag moves entire rows (both date and subject move together)
- Generate button immediately saves to global timetable on each click
- ClassTimetableCard component handles drag-drop internally
- No Excel-style combined view across all classes
- No explicit Save button to finalize the generated arrangement

## Requested Changes (Diff)

### Add
- **Subject-only drag**: When dragging rows in ClassTimetableCard, only the subject (and its marks/time if applicable) moves to the new position. Dates and Days remain locked in their original order (row 1 = date 1, row 2 = date 2, etc.). The subject column is what gets reordered.
- **Save button** on the generated timetable section: After user is happy with arrangement (after one or more Generate clicks), pressing Save commits the arrangement to localStorage permanently for that exam. Until Save is pressed, generating again reshuffles freely.
- **Generate regenerates freely**: Each click of Generate button re-distributes subjects across dates with a smart rotation (no same subject on consecutive dates if possible). The arrangement is NOT saved until Save is clicked.
- **Excel-style combined timetable view**: A new section/tab or panel below the generated per-class cards showing all classes in one table:
  - Row 0 (header): "Date" | "Day" | Class1 | Class2 | Class3 ... (one column per participating class)
  - Each subsequent row: date | day name | subject for Class1 on that date | subject for Class2 | ...
  - If a class has no exam on a date, show "-"
  - This combined view is printable (print button) and exportable as CSV
- **Saved timetables list**: After saving, show a list of saved exam timetables with option to view/reopen for editing, or delete.

### Modify
- **ClassTimetableCard drag behavior**: Change drag-drop so only subjects swap between rows, not entire row data. Dates stay fixed per row index. Up/down arrows also only move the subject to adjacent row.
- **Generate button**: Should NOT immediately merge into global timetable. Only preview is shown until Save is clicked.
- **Save confirmation**: Show a small success toast/notification after saving.

### Remove
- Nothing to remove.

## Implementation Plan
1. Modify `ClassTimetableCard` so drag-and-drop and up/down arrows only reorder the subject field (and marks if needed), keeping dates pinned to row positions.
2. Change `handleGenerateTimetable` to only update `generatedByClass` state (preview), NOT merge into global `timetableEntries`.
3. Add a "Save Timetable" button in the generated timetables section. On click, merge generated into global timetableEntries and show success toast.
4. Add smart subject distribution in generate: shuffle subjects differently each Generate press (use random shuffle), with attempt to avoid same subject on consecutive days across classes.
5. Build `CombinedTimetableView` component:
   - Takes `generatedByClass` and `wizardClasses` as props
   - Builds a unified date list (union of all dates)
   - Renders HTML table: Date | Day | Class1 | Class2 | ...
   - Print button opens window with styled printable table
   - Export CSV button generates CSV with same structure
6. Show combined view below the per-class cards when at least one class timetable is generated.
7. Add saved state tracking: after Save, show a "Saved Timetables" section listing exam name with timestamp, with View and Delete buttons.
