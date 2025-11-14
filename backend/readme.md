https://github.com/material-extensions/vscode-material-icon-theme/blob/main/images/folderIcons.png
https://github.com/material-extensions/vscode-material-icon-theme/blob/main/images/fileIcons.png
🎯 Big Picture: What You’re Building

You’re building a full web application, not just a dashboard.
It has two main roles (Admin + Intern) — and both interact with the same system but see different UIs based on their role.

🧭 High-Level Flow (Step-by-Step)

Here’s how the user experience will look 👇

🏠 1. Landing / Home Page (Optional but Recommended)

Simple welcome page for the LTG Intern Management System.

Shows basic info like “Manage your internship tasks easily.”

Buttons:

🔐 Login

📝 Register (Intern only)

Example:
/ → home page
/login → login form
/register → intern registration page

🔐 2. Authentication Flow

After login → we check the user’s role:

Role Redirected To Dashboard
Admin /admin/dashboard Admin Panel
Intern /intern/dashboard Intern Dashboard
src/
├── components/
│ ├── Sidebar.jsx
│ ├── Navbar.jsx
│ ├── ChartCard.jsx
│ └── ModalForm.jsx
├── pages/
│ ├── Login.jsx
│ ├── Register.jsx
│ ├── admin/
│ │ ├── Dashboard.jsx
│ │ ├── Interns.jsx
│ │ ├── Tasks.jsx
│ │ ├── Submissions.jsx
│ │ └── Certificates.jsx
│ └── intern/
│ ├── Dashboard.jsx
│ ├── Tasks.jsx
│ ├── Submissions.jsx
│ └── Certificate.jsx
├── App.jsx
├── main.jsx
├── api/
│ ├── auth.js
│ ├── tasks.js
│ ├── submissions.js
│ └── certificates.js
├── utils/
│ ├── auth.js
│ └── helpers.js

🧠 Summary
Step Description Who sees it
1️⃣ Home Page Intro + Login/Register Everyone
2️⃣ Auth Login/Register + JWT check Everyone
3️⃣ Admin Dashboard Manage interns, tasks, submissions Admin
4️⃣ Intern Dashboard View/Submit tasks, view certificates Intern
5️⃣ API Connects backend with frontend Developer side

⚙️ Workflow: Intern Registration & Authentication
🧑‍💼 1. Admin creates the intern

Admin opens the dashboard → “Add Intern” form.

Admin fills details like:
name, email, role (intern), department, assigned tasks, etc.
Once admin clicks Create, the backend:

Generates a random temporary password.

Saves the intern’s data in the database with a hashed password.

Sends an email to the intern with:

Their login email.

Temporary password.

Login link.
📩 2. Intern receives email

The intern gets an email like:
Welcome to LTG Internship!
Your account has been created.
Email: john@ltg.com
Password: 4#Hgj89s
Login: https://ltg-dashboard.com/login
They use these credentials to log in.

🔐 3. Intern logs in

Intern visits the login page → enters email & password.

Backend verifies credentials → issues JWT token.

Intern is redirected to their dashboard (intern panel).

🧠 4. Intern updates password

On first login, the intern is prompted to change their password.

New password replaces the old one in DB (after hashing).

⚡ 5. Optional: Forgot password

A “Forgot Password” link can let interns reset their password via email verification if they forget it later.
