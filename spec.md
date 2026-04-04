# SHUBH SCHOOL ERP

## Current State
- Header shows "School ERP" as the app name, session switcher dropdown exists but labeled generically
- Configure Fees Plan has a "Choose Category" panel (non-functional, cluttering UI)
- Student details modal (StudentDetailModal in Students.tsx) shows basic info but NO fees details, transport details, or discount sections
- Dues Fees tab shows month-wise dues for a single student only (no class-level wizard, no print/export/reminder options)
- GROUPS constant is hardcoded array in Fees.tsx with no CRUD management UI
- ACCOUNTS constant is hardcoded array in Fees.tsx with no CRUD management UI
- Months order in school year not explicitly enforced to start April and end March
- No student photo shown when a student is selected anywhere (Collect Fees, Dues Fees, etc.)
- Discount in student details not integrated with fees master (not calculated per month)

## Requested Changes (Diff)

### Add
1. **App name change**: "School ERP" → "SHUBH SCHOOL ERP" everywhere (Header text, title, sidebar brand)
2. **Session label in header top-left**: Show "Current Session: 2025-26" (or active session from settings) as a visible label integrated with the session switcher — clicking shows the dropdown
3. **Student photo verification**: When any student is selected (Collect Fees search, Dues Fees search, Student Details modal), show the student's photo (from their profile, fallback to initials avatar) prominently so staff can verify identity
4. **Student Details — Fees/Transport/Discount tabs**: In the StudentDetailModal, add tabs:
   - **Fees Details**: Show fees from fees master for the student's class, with monthly breakdown (April→March). Show each fee head, monthly amount, paid status, due amount, old due fees (carried forward from previous session with month-wise breakdown), and computed Net Payable Amount = (fees master amount × months) - discounts + old dues
   - **Transport Details**: Show transport route/vehicle/pickup point assigned to the student from Transport module data
   - **Discounts**: Show assigned discounts (from fees master discount records for this student). Discount calculated per month: if 100/month discount → 100 deducted per month, not a lump sum. Net payable amount updates accordingly.
   - **Old Fees**: Show previous session dues (month-wise, which months are unpaid) pulled from erp_session_archive data, with total old balance added to net payable
5. **Dues Fees wizard**: Replace the single-student search with a 2-step wizard:
   - **Step 1 — Months**: Checkbox grid (April, May, June, July, Aug, Sep, Oct, Nov, Dec, Jan, Feb, Mar) for user to select which months to check dues for
   - **Step 2 — Classes**: Checkbox grid (Nursery, LKG, UKG, Class 1–12) for user to select which classes to include
   - After selecting months + classes, show a dues report table: Student Name | Adm No | Class | Section | selected-month columns with due amounts | Total Due
   - **Actions toolbar**: Print button (print dues report with student names and months), Excel Export (download as CSV/xlsx), Reminder Letter (print individual page per student with their dues — bulk print for multiple students), WhatsApp Reminder (simulate sending reminder to all parents whose fees are due, show a confirmation summary)
6. **Group Name sub-module** under Fees: A "Groups" management panel where users can Add, Edit, Delete group names. These groups feed the GROUPS dropdown in Fees Master. Stored in localStorage key `erp_fee_groups`. Default groups: General, Transport, Sports, Lab.
7. **Account sub-module** under Fees: An "Accounts" management panel where users can Add, Edit, Delete account names. Show account-wise received fees summary (total fees received per account name from erp_fee_payments). Stored in localStorage key `erp_fee_accounts`. Default accounts: Admission Fees, Tuition Fees, Computer, Vikas Shulk, Examination, TDS, old year.
8. **Months order**: Ensure all month arrays/selectors throughout Fees and Dues start with April and end with March (Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec, Jan, Feb, Mar)

### Modify
1. **Configure Fees Plan**: Remove the entire "Choose Category" panel/section (the right-side grid with CATEGORIES checkboxes). Keep only Classes selection. Remove category from the saved plan data display.
2. **Header brand**: Change "School ERP" text to "SHUBH SCHOOL ERP"
3. **Session switcher**: Display "Current Session: [session]" as label text next to the Archive icon (not just the session value) so it's clear this is the current session indicator
4. **GROUPS and ACCOUNTS**: Change from hardcoded constants to dynamic — read from localStorage `erp_fee_groups` and `erp_fee_accounts` so the new sub-modules feed these dropdowns live
5. **Dues Fees tab**: Replace existing single-student flow with the new wizard (see Add #5 above)

### Remove
1. "Choose Category" panel from Configure Fees Plan tab
2. Categories column from the fee plans table display

## Implementation Plan

1. **Header.tsx**: Change "School ERP" → "SHUBH SCHOOL ERP"; update session label to show "Current Session: X"
2. **Fees.tsx**:
   a. Change GROUPS and ACCOUNTS to read from localStorage dynamically (helper functions)
   b. Remove Choose Category section from Configure Fees Plan tab
   c. Remove Category column from fee plans table
   d. Rewrite DuesFeesTab to wizard-based (months checkboxes + class checkboxes + report table + Print/Excel/Reminder Letter/WhatsApp Reminder actions)
   e. Add GroupsSubModule component — CRUD panel for group names, saves to erp_fee_groups
   f. Add AccountsSubModule component — CRUD panel for account names + account-wise fees summary, saves to erp_fee_accounts
   g. Add new tabs in Fees page navigation for "Groups" and "Accounts"
   h. Ensure all month arrays start April and end March
3. **Students.tsx**:
   a. StudentDetailModal: Add Fees Details, Transport Details, Discounts, Old Fees tabs with integrated data
   b. Show student photo (from student.photo field or initials avatar) in all student selection contexts
4. **Collect Fees (inside Fees.tsx)**: When student is selected from dynamic search dropdown, show student photo/avatar in the student info panel for identity verification
