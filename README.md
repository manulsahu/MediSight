**📄 Automatic Health Monitoring System – Documentation**
**📌 Project Overview**
The Automatic Health Monitoring System is a comprehensive web-based application designed to streamline healthcare interactions between patients and doctors. It offers features like patient registration, doctor registration, AI-powered health report analysis, appointment requests, and management dashboards for both patients and doctors.

**🛠️ Technologies Used**
Vite – Fast development environment.

TypeScript – Type-safe JavaScript for better maintainability.

React – Frontend framework for building UI components.

Tailwind CSS – Utility-first CSS framework for styling.

Firebase – Backend for authentication and database services.

Cloudinary API – Handles storage and retrieval of image/PDF files (e.g., medical reports).

**🔐 Authentication & Authorization**
Login Page

Users can sign in via Firebase Authentication.

Route protection ensures correct access to dashboards based on user role (Patient/Doctor).

**👤 User Roles**
**1. Patient**
📋 Registration
Users fill out personal and health-related details.

Data is stored securely in Firebase Firestore.

📊 Dashboard
View personal details, past medical reports, and appointment status.

Upload PDF medical reports to be stored via Cloudinary.

Trigger AI-based analysis of previously uploaded reports.

🤖 AI Analysis
Uses integrated AI models to analyze uploaded medical reports.

Displays interpreted medical data with visual insights.

📅 Request Appointment
Selects a doctor and requests an appointment with optional notes.

Request status is updated in real-time.

**2. Doctor**
📝 Registration
Doctors provide specialization and experience information during signup.

Credentials are verified and stored in the database.

📊 Dashboard
View list of incoming appointment requests.

Access patient medical history and AI-analyzed reports.

✅ Appointment Management
Accept or reject patient appointment requests.

Update appointment status directly from the dashboard.

📁 Cloud Integration
Firebase Firestore: Stores user data, appointments, and messages.

Firebase Auth: Manages login/signup.

Cloudinary API: Handles medical report upload, storage, and retrieval.

**📷 UI Overview (Screenshots Reference)**
Feature	Screenshot
Login Page	![Login](https://github.com/user-attachments/assets/10d4e4fb-d7c1-462d-b21d-62944e13b142)
Patient Register	![Patient-Register](https://github.com/user-attachments/assets/c4b164cc-f508-4cea-a522-6228427bf203)
Doctor Register	![Doctor-Register](https://github.com/user-attachments/assets/41390c59-a446-438d-8684-abd81572fa07)
Patient Dashboard	![Patient-Dash](https://github.com/user-attachments/assets/6c74ee6a-db25-473d-becc-41bfb8468276)
AI Analysis	![Patient-AI-Analysis](https://github.com/user-attachments/assets/b041a577-8fa3-4419-a738-d951cc25d910)
Request Appointment	![Patient-Req-Appointment](https://github.com/user-attachments/assets/64b1ec5c-83e5-4dc7-be81-02ccfa03087d)
Doctor Dashboard	![Doctor-Dash](https://github.com/user-attachments/assets/302c730f-14f7-48db-aa68-40f3273c897b)
Appointment Actions	![Doctor-Appointment](https://github.com/user-attachments/assets/a1eb5c5c-cb74-4ad9-afa8-f3cc6edaa1f6)

**🚀 Future Enhancements**
Chatbot assistant for real-time queries.

Real-time video consultation.

Integration with wearable health devices (e.g., Fitbit).

Notification system for medicine reminders and appointments.

**REQUIREMENTS TO RUN PROJECT:**

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```
THANK YOU 
TEAM - CODE UNITY (CT-54)


