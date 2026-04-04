# School ERP India

## Current State
- Full School ERP with Fees, PromoteStudents, Academics, Timetable modules
- PromoteStudents: archives session to `erp_session_archive_<session>` key, updates `erp_settings.session`, carries dues month-wise
- Fees/CollectFees: save dialog shows Print or WhatsApp as separate buttons; Fee Register tab lists all receipts
- Teacher Timetable (TeacherTimetable.tsx): wizard-based, periods have fixed durations from a start time + duration setting
- Fee receipts: 4 templates including Bharati Format (105x145mm)
- Role-based permissions system exists in `data/permissions.ts`

## Requested Changes (Diff)

### Add
1. **Session Switcher** -- A session selector in the app (header or fees/student section) allowing user to switch between archived sessions (e.g., 2025-26, 2026-27) and view data read-only. Sessions are stored under `erp_session_archive_<session>` keys. Current session data is always in `erp_students`, `erp_fee_payments`, etc. When viewing an archived session, load data from the archive key instead. The switcher should be visible in relevant modules (Students, Fees, Attendance). Session list is built from all `erp_session_archive_*` keys plus the current active session from settings. Sessions should persist infinitely.

2. **Per-Period Duration in Teacher Timetable** -- In the period config step of the Teacher Timetable wizard, allow each period to have its own individual duration (not a single global duration). Add an "Interval/Break" time between periods that the user can configure. The period timing preview should update live per-period based on individual durations and interval gaps.

3. **Fee Receipt Save Dialog -- Both Buttons Simultaneously** -- When user presses Save in Collect Fees, the dialog should show BOTH "Print Receipt" AND "Send WhatsApp" as action buttons, not as an either/or choice. User can click both if they want. Currently only one can be chosen. Change to show both options clickable independently.

4. **Fees Payment History on Receipt** -- Below the fee table in the Fees Receipt (Collect Fees page, not just the print modal), add a "Payment History" section showing all previous payments for the currently loaded student. Each row shows: Date, Receipt No., Months, Amount Paid, Payment Mode, and Received By (the logged-in user's name + role, e.g., "Rajesh Kumar (Admin)"). This history is pulled from `erp_fee_payments` filtered by the student's admNo.

5. **Fee Register -- Student Detail Drill-Down** -- In the Fee Register tab, clicking/pointing on any row (or a detail icon) should open a drawer/modal showing full payment details for that student: all payment history, each receipt's breakdown, and edit/delete actions. Edit and delete are controlled by role permissions: only Super Admin can delete; Admin and Super Admin can edit. Permissions are checked from the current user's role stored in `erp_current_user` or `erp_auth`.

6. **Edit/Delete in Fee Register (Role-Controlled)** -- Super Admin: can edit and delete any receipt. Admin: can edit but not delete. Others (Accountant, Teacher, etc.): view only. When editing a receipt, allow changing: payment mode, remarks, amount received, date. When deleting, show a confirmation dialog.

### Modify
- **PromoteStudents**: Session data already archiving correctly. Ensure the session list in the new switcher reads all archive keys.
- **Teacher Timetable period config**: Replace single-duration field with per-period individual duration fields + interval/break time field.
- **Save dialog in CollectFees**: Both Print and WhatsApp buttons are independent -- clicking Print opens print modal, clicking WhatsApp opens WhatsApp send flow. Dialog stays open until user explicitly closes it (add a "Done" / Close button).

### Remove
- Nothing removed.

## Implementation Plan

1. **Session Switcher component** (`src/frontend/src/components/layout/SessionSwitcher.tsx`):
   - Reads all localStorage keys starting with `erp_session_archive_` to build session list
   - Adds current active session from `erp_settings.session`
   - Stores selected viewing session in a React context or local state (passed down)
   - When a non-current session is selected, shows a banner "Viewing archived session: 2025-26 (Read Only)"
   - Integrate into Header.tsx as a dropdown next to the school name
   - Relevant pages (Students, Fees) check the selected session and load from archive if not current

2. **Per-Period Duration in TeacherTimetable.tsx**:
   - In Step 2 (Period Config), replace `periodDuration` single field with an array `periodDurations[]` -- one duration input per period (e.g., P1: 45 min, P2: 30 min, etc.)
   - Add `intervalMinutes` field for break/interval time between periods
   - Period timing preview recalculates: P1 starts at `startTime`, ends at `startTime + periodDurations[0]`, P2 starts at `P1_end + intervalMinutes`, etc.
   - Save these per-period durations so the generated timetable display shows accurate timing

3. **Collect Fees Save Dialog** (`Fees.tsx`, `CollectFeesTab`):
   - Change `showSaveDialog` modal to show both Print Receipt and Send WhatsApp as separate independent buttons
   - Both can be clicked; state tracks which have been activated
   - Add a "Close" or "Done" button to dismiss
   - Receipt is already saved when dialog opens; Print/WhatsApp are post-save actions

4. **Payment History section in CollectFees** (`Fees.tsx`):
   - Below the fee grid / other charges section (when a student is loaded), render a `PaymentHistory` component
   - Reads `erp_fee_payments` filtered by student admNo
   - Shows table: Date | Receipt No. | Months | Amount | Mode | Received By
   - `receivedBy` field: when saving a payment, store the logged-in user's name+role (read from `erp_current_user` or `erp_auth` localStorage)
   - Update `PaymentRecord` interface to include `receivedBy: string`
   - When saving a new payment, populate `receivedBy` from current user

5. **Fee Register drill-down + edit/delete** (`Fees.tsx`, Fee Register tab):
   - Each row gets a clickable details icon or entire row clickable
   - Opens a modal/drawer: `FeeRegisterDetailModal` showing full student payment history
   - Role check: read from `erp_current_user` to get role
   - Super Admin: show Edit + Delete buttons
   - Admin: show Edit button only
   - Others: view only
   - Edit modal: form to change paymentMode, remarks, receiptAmt, date -- saves back to `erp_fee_payments`
   - Delete: confirmation dialog, removes from `erp_fee_payments`
   - After edit/delete, refresh the register list
