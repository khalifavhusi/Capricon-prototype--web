CAPRICORN REGISTRATION PORTAL UI

This is a front-end demonstration that stores registration data in browser localStorage.

REGISTRATION FLOW
1. Open HTML/index.html.
2. The menu starts with "No Profile Available" and LOGIN because nobody is logged in.
3. Register an account first.
4. Step 2 Personal Details saves without repeating and now includes contact, photo, language, disability, next-of-kin and payment information.
5. Step 3 Course & Application saves course, NCV/NATED route, level/report, Full Time/Part Time and subjects.
6. A unique application number is generated.
7. The photo and all registration data are carried into Dashboard, Profile, Current Application and Results.
8. After submission, the user logs in using the account created in Step 1.
9. Once logged in, all portal pages use the same saved student record.
10. Logout returns to index.html and hides the profile until the next login.

EDITING
- After the application is submitted, an editing window of exactly 48 hours starts from registeredAt.
- The countdown is shown on the Dashboard, Profile and Current Application pages.
- During the 48 hours, the student can edit personal/contact information, profile photo, language preferences, disability details, next of kin, payment details, course, qualification route, level/report, study mode and subjects.
- Saving edits does NOT restart the countdown.
- When the countdown reaches zero, editing is locked in the UI.
- If the course/subjects change, the Results page follows the new registered subject list and retains marks only for subjects that still exist.

LANGUAGES
The profile supports the 9 requested South African languages:
- isiZulu
- isiXhosa
- Afrikaans
- Sepedi
- Setswana
- Sesotho
- Tshivenda
- siSwati
- Xitsonga

COURSES
- Information Technology — Mathematics
- Computer Science — Mathematics
- Mechanical Engineering — Mathematics
- Office Administration — Mathematical Literacy
- Business Management — Mathematical Literacy

QUALIFICATION ROUTES
- NCV (Levels): Level 2, Level 3, Level 4
- NATED (Report 191): N4, N5, N6
- Study mode: Full Time or Part Time

PROFILE SUPPORTING INFORMATION
- Mother/home language
- Reading language
- Lecture language
- Exam language
- Optional disability type and support notes
- Next of kin: name, surname, contact, email, address, province, gender
- Person responsible for payment: name, surname, contact, email, bank name, account number

IMPORTANT
This is a browser-only UI demo. Passwords are stored in localStorage for demonstration purposes and should NOT be used for a production system. A real deployment needs a secure server/database, password hashing, sessions and server-side validation.


LATEST FIXES
------------
- New registration starts with a completely blank ID/passport field and blank student data.
- Existing registration can be resumed only through the Back button using resume=1.
- Language choices now include English plus the full current South African official-language set.
- Person Responsible for Payment uses a South African bank dropdown.
