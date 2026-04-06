# SHUBH SCHOOL ERP

## Current State
- HR module has a simple "Add Staff" form: Name, Designation, Department, Salary, Contact, DOB, Join Date
- No subject-teaching wizard for teachers -- no way to record which subjects a teacher teaches and for which class range
- TeacherTimetable auto-loads from `erp_staff` and `erp_teacher_assignments` but there is no UI to populate `erp_teacher_assignments` from HR
- Settings > User Management shows existing users but Super Admin cannot add new admin/staff users (Admin, Receptionist, Accountant, Librarian etc.) from a dedicated screen with name + position

## Requested Changes (Diff)

### Add
- **Teacher Subject Wizard** (in HR > Add Teacher): When the staff being added is a Teacher, show a multi-step subject assignment wizard after basic info:
  - Step 1: Basic info (name, mobile/contact, DOB, join date, salary)
  - Step 2: Subject-Class assignment wizard — add multiple rows, each row: Subject (text/dropdown from Academics subjects) + Class From (Nursery/LKG/UKG/1-12) + Class To (same range) meaning teacher teaches this subject for classes in that range
  - Teacher can have 2 or more subject-class range assignments (e.g. English Class 1-5, Art Class 6-8)
  - These assignments saved as `erp_teacher_subject_assignments` keyed by teacher ID
- **SuperAdmin User Management** (Settings > User Management): Add a form/button "Add Staff User" that lets Super Admin create staff accounts with:
  - Full Name
  - Position/Role (Admin, Receptionist, Accountant, Librarian, Teacher, Nurse, Clerk, Peon, etc. — free text + predefined list)
  - Mobile No. (becomes username)
  - Password (auto or manual)
  - These get added to `erp_user_credentials` so they can log in

### Modify
- **HR Add Staff form**: When Designation = "Teacher", show the subject wizard step; other designations skip straight to save
- **TeacherTimetable**: Read teacher-subject-class assignments from `erp_teacher_subject_assignments` and map them to sections (based on class range) to auto-populate the assignment panel
- **Settings User Management**: Add "Add User" button visible only to Super Admin to create new staff login accounts

### Remove
- Nothing removed

## Implementation Plan
1. Extend `StaffMember` type and `erp_staff` storage to include `subjectAssignments: {subject, classFrom, classTo}[]`
2. Update HR Add Staff modal:
   - Add a Designation dropdown with Teacher option
   - When Teacher selected, show Step 2 subject-wizard
   - Step 2: dynamic rows with Subject, Class From, Class To selects
   - Save subject assignments to `erp_teacher_subject_assignments`
3. Update TeacherTimetable Step 1 panel to load from `erp_teacher_subject_assignments` and auto-populate teacher assignment rows by expanding class ranges into individual class-section combinations
4. Add "Add Staff User" button in Settings > User Management (Super Admin only):
   - Form: Full Name, Position (dropdown + free text), Mobile (= username), Password
   - Saves to `erp_user_credentials` with appropriate role mapping based on position
   - Shows in the existing user list
