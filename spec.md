# SHUBH SCHOOL ERP

## Current State

Full-featured School Management ERP for Indian schools. Modules built: Dashboard, Students, Fees (Collect/Register/Dues/Master/Groups/Accounts), Attendance (RFID/QR/ESSL), Examinations (Timetable Maker with auto-generate, drag-drop), Teacher Timetable (Wizard, per-section, combined view), Certificates (Student ID/Staff ID/TC/Admit Card), HR/Payroll, Transport (Routes/Vehicles/Pickup Points), Communication/WhatsApp, Academics, Alumni, Inventory, Expenses, Homework, Reports, Promote Students, Settings (School Profile). Session management with infinite sessions and switching. Role-based access control. 20 demo students seeded.

## Requested Changes (Diff)

### Add

1. **Transport Details in Student Profile** -- Auto-populate 3 fields from Transport module: Bus No., Route, Pickup Point (read from student's transport assignment)

2. **Auto-Created Credentials**
   - Student login: username = Adm. No., password = DOB (ddmmyyyy format)
   - Teacher login: username = Mobile No., password = DOB (ddmmyyyy format)
   - Parent login: username = Mobile No., password = Mobile No. (parent with multiple children sees all their wards)
   - Login Credentials tab in Student/Teacher profile (Super Admin can view & reset)
   - User Management screen under Settings: lists all users (students, teachers, parents) with reset password capability

3. **Password Change**
   - Any user can change their own password after login (Change Password option in header/profile)
   - Super Admin can reset any user's password from User Management

4. **Online Fees Module**
   - Settings > Online Payment: Super Admin toggles GPay / Razorpay / PayU on/off
   - Simulated demo flow (no real money) -- shows payment UI, on confirm marks as paid
   - Auto-updates Fee Register, generates receipt, marks month as paid
   - Students/Parents can pay from their login dashboard

5. **Google RCS Notification Panel**
   - New tab/section in Communication: "RCS Messages"
   - Simulated sending (like WhatsApp module)
   - Send to: Parents, Students, Teachers (group or individual)
   - Message templates (Fee due, Absent, General, etc.)

6. **Auto-Send Notification Scheduler**
   - Settings > Notification Scheduler
   - Checkbox wizard: select which events to auto-trigger
   - Events: Fee due reminder (X days before), Absent alert (same day), Exam timetable published, Result published, Birthday wish, General notice, Homework deadline reminder
   - Per event: configure timing (days before/after), recipient group (Parents/Students/Teachers), channel (WhatsApp/RCS/Both)
   - Toggle each rule on/off

7. **QR Attendance (Mobile Scanner)**
   - New "QR Scanner" page accessible on mobile
   - Opens camera, scans student admit card QR code
   - Marks student present with timestamp (date/time, scanned by, device)
   - Available to roles: Super Admin, Admin, Teacher, Driver
   - Driver is a new login role (added to role list alongside Teacher/Admin etc.)
   - Driver role: can only access QR Scanner and view their assigned route's students

### Modify

- **Student Profile** (double-click detail modal): Add Transport tab showing Bus No., Route, Pickup Point auto-filled from transport assignment
- **Login page**: Add parent login flow; auto-generate credentials shown during first login
- **HR Module**: Add Driver as a staff designation/role option
- **Sidebar**: Add QR Scanner link (visible to Admin, Teacher, Driver roles)
- **Settings**: Add "User Management", "Online Payment", "Notification Scheduler" tabs
- **Non-working submodules**: Identify and remove any broken/stub submodule tabs that do not function

### Remove

- Any submodule tab/section that is completely non-functional (stub only, no working UI) -- replace with a clean "Coming Soon" or remove entirely

## Implementation Plan

1. Add Transport tab to student detail modal -- read from localStorage transport assignments, match by student Adm. No.
2. Build credential generation logic: on app init, auto-generate credentials for all students/teachers/parents if not already set; store in localStorage under `shubh_credentials`
3. Add Login Credentials tab to student and teacher profile modals (Super Admin only)
4. Build User Management page under Settings with search, list all users, reset password modal
5. Add Change Password option in header dropdown for logged-in user
6. Build Online Payment settings toggle (GPay/Razorpay/PayU) in Settings
7. Build simulated online payment flow: student/parent selects months, clicks Pay Online, shows UPI/card UI, on confirm auto-creates receipt and updates Fee Register
8. Build RCS Messages tab in Communication module (simulated, templates, send to groups)
9. Build Notification Scheduler in Settings: checkbox wizard with all 7 event types, timing config, channel config, on/off toggle per rule
10. Build QR Scanner page: camera-based QR scan using browser camera API, decode student data from QR, mark attendance, show confirmation
11. Add Driver role to role list; Driver login only sees QR Scanner and their route
12. Audit all existing submodules and remove/replace non-functional stubs
13. Wire transport assignment data to student profile transport tab
14. Ensure parent login shows all children's fee/attendance summary
