# SHUBH SCHOOL ERP

## Current State
- Academics > Subjects: table has columns #, Subject Name, Class, Code, Teacher, Actions. Add Subject modal has fields: Name, Class (dropdown), Code, Assigned Teacher.
- Academics has a 'Class Teachers' tab (5th tab).
- HR > Staff Directory has Add Staff button but no Import or Export option.

## Requested Changes (Diff)

### Add
- Academics > Subjects: Subject+Class wizard in Add/Edit modal — subject name is entered once, then user adds multiple class rows (each row = a class from the class list). One subject can cover many classes (e.g. Hindi → Class 1, 2, 3, 4, 5).
- HR > Staff Directory: Import button (accepts CSV/Excel, maps columns to staff fields) and Export button (downloads current staff list as CSV).

### Modify
- Academics > Subjects table: remove Class, Code, Teacher columns. Show only #, Subject Name, Classes Assigned (as badges), Actions.
- Academics > Subjects data model: replace single `class`, `code`, `teacher` fields with `classes: string[]` array.
- Add Subject modal: remove Class dropdown, Code input, Teacher input. Add a multi-class selector (checklist or add-row wizard showing class names from `erp_classes`).

### Remove
- Academics > 'Class Teachers' tab (entire tab and its modal removed).
- Class modal in Academics: remove 'Class Teacher' field from the Add/Edit Class modal form.

## Implementation Plan
1. Update `SubjectRecord` type: replace `class`, `code`, `teacher` with `classes: string[]`.
2. Update subject table: columns become #, Subject Name, Classes (badges), Actions.
3. Update Add/Edit Subject modal: subject name + multi-class checkboxes (checkboxes from `erp_classes` list). Remove code/teacher fields.
4. Remove 'classteachers' tab from tabs array and all related state/handlers/modals.
5. Remove 'Class Teacher' field from Add/Edit Class modal.
6. In HR > Staff Directory: add Export CSV button and Import (file input) button with CSV parsing logic.
