# SHUBH SCHOOL ERP

## Current State
- Full ERP with Student Info, Fees, Attendance, Examinations, HR, Transport, Inventory, Certificate, Dashboard, etc.
- Dashboard shows static stat cards; no live data from localStorage.
- Date inputs (type=date) in forms: day→month shift works but month→year shift broken (browser native behavior workaround needed).
- New student/staff added: `generateCredentialsFromData()` NOT called after save, so credentials don't appear immediately.
- Certificate/ID Card: templates exist (4 student, 4 staff) at 105×145mm but no background image upload, no checkbox wizard for fields, no font size/color controls, no default template selector.
- Inventory: tracks stock items, issue/return. No sell price, no purchase/sale transaction tracking, no uniform categories (dress, tie, belt).
- Dashboard stat cards are fully hardcoded with no real data.

## Requested Changes (Diff)

### Add
- Date input fix: custom `DateInput` component that auto-advances day→month→year on typing 2 digits in each segment.
- Auto-credential generation: call `generateCredentialsFromData()` immediately after adding new student or staff.
- ID Card customizer panel:
  - Background image upload (stored as base64 in localStorage per template).
  - Checkbox wizard: list of all available fields (Name, Father Name, Mother Name, Class, Section, Roll No, DOB, Blood Group, Adm No, Contact, Address, Photo, QR Code, School Name, Valid Till) — user checks what to show.
  - Font size slider (8–18px) and font color picker for card text.
  - "Set as Default Template" button per template; default template used when printing ID cards.
- Inventory: add `sellPrice` and `purchasePrice` fields to items; new "Sales" tab for recording sell transactions (student/staff buys an item — dress, tie, belt, etc.); new "Purchase" tab for recording purchase transactions (stock-in); pre-add uniform categories: Dress, Tie, Belt, Socks, Shoes, Bag.
- Dashboard "Student Present Today" card: clickable → opens modal with class/section-wise and route-wise present/absent breakdown (reads from `erp_attendance` localStorage).
- Dashboard "Fees Awaiting" card: shows real data — total fees paid today (from `erp_receipts`) / total session dues outstanding (from `erp_students` fee data); note "Due Date: 15th of every month" in card.

### Modify
- `StudentAdmissionForm.tsx`: replace `<input type="date">` with custom `DateInput` component for DOB and Admission Date fields.
- `HR.tsx`: replace `<input type="date">` for Join Date with custom `DateInput`; call `generateCredentialsFromData()` after adding staff.
- `Students.tsx`: call `generateCredentialsFromData()` after `handleAdmissionSave` adds new student.
- `Certificate.tsx` (Student ID Card tab): add customizer sidebar with background upload, field checkbox wizard, font controls, default template selector.
- `Inventory.tsx`: add `sellPrice`/`purchasePrice` to item form; add Sales tab and Purchase tab; pre-populate uniform categories.
- `Dashboard.tsx`: wire "Student Present Today" card to real attendance data with drill-down modal; wire "Fees Awaiting" card to real fees data.

### Remove
- Hardcoded static values for Student Present Today and Fees Awaiting on Dashboard.

## Implementation Plan
1. Create shared `DateInput` component in `src/frontend/src/components/ui/DateInput.tsx` — custom day/month/year segmented input that auto-tabs between segments.
2. Update `Students.tsx`: import DateInput, use in admission form DOB field, call `generateCredentialsFromData()` after new student saved.
3. Update `HR.tsx`: add dob field to staff form, use DateInput for join date and dob, call `generateCredentialsFromData()` after staff saved.
4. Update `Certificate.tsx`: add customizer state (bgImage, visibleFields, fontSize, fontColor, defaultTemplate) per template; render upload button, checkbox wizard, slider, color picker; apply customizations to ID card preview.
5. Update `Inventory.tsx`: extend `InventoryItem` with `sellPrice`/`purchasePrice`; add to item form; add Sales tab with sell transaction form/table; add Purchase tab with purchase transaction form/table; add uniform categories to defaults.
6. Update `Dashboard.tsx`: read `erp_attendance` and `erp_receipts` from localStorage; compute real stats; make Student Present Today card clickable with drill-down modal showing class/section and route-wise data; update Fees Awaiting card with real totals and 15th due date note.
