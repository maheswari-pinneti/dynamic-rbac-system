# Module 1: Authentication & Identity Management

## 1. Overview & Objective
Module 1 delivers an enterprise-grade authentication system supporting both standard password-based credentials and modern WebAuthn / FIDO2 passkeys (Windows Hello, Fingerprint, Touch ID). User accounts, session tokens, and security audit logs are managed and persisted in browser storage using React Context API without Redux.

---

## 2. Core Features & Capabilities

### 2.1 Login System (`/login`)
- **Email & Password Authentication**: Validated with RFC-compliant email regex and minimum 6-character password rules.
- **Show/Hide Password**: Interactive `<Eye />` and `<EyeOff />` toggles for credential inspection.
- **Biometric Passkey Authentication**: Hardware-level authentication via W3C WebAuthn API (`navigator.credentials.get`), supporting Windows Hello Facial & PIN, hardware fingerprint sensors, and security keys.
- **1-Click Pre-Configured Demo Credentials**:
  - **Sarah Connor** (`admin@enterprise.com` / `Password123!`) – Administrator (Super Admin)
  - **Marcus Vance** (`manager@enterprise.com` / `Password123!`) – Manager (Department Lead)
  - **Elena Rostova** (`employee@enterprise.com` / `Password123!`) – Employee (Operations Specialist)
- **Form Validation & Real-Time Error Feedback**: Immediate field validation preventing invalid submissions.

### 2.2 Signup System (`/signup`)
- **Required Fields**:
  - Full Name (minimum 2 characters)
  - Work Email Address (validated format)
  - Password (minimum 6 characters) with Show/Hide toggle
  - Confirm Password (strict equality check)
  - Role Selection Tier: Administrator, Manager, or Employee
- **Passkey Enrollment**: Direct WebAuthn registration during onboarding (`navigator.credentials.create`).

### 2.3 Direct Logout Redirection (`/logout`)
- Automatically clears session storage, authorization tokens, and active credentials.
- Directly and immediately redirects the user to `/login` (`navigate('/login', { replace: true })`).
- Displays a clean toast notification: *"You have been signed out."* without showing any intermediate signed-out screen.

---

## 3. Component Architecture

```
src/
├── pages/auth/
│   ├── Login.jsx           # Enterprise login portal (Password & Passkey tabs)
│   ├── Signup.jsx          # User registration with role selection cards
│   └── Logout.jsx          # Session termination & immediate redirect to /login
├── components/common/
│   ├── BiometricModal.jsx  # Windows Hello & biometric hardware radar modal
│   └── Input.jsx           # Reusable input with Show/Hide password toggle
└── context/
    └── AuthContext.jsx     # React Context API authentication provider
```

---

## 4. State & Session Persistence

Authentication state is managed by `AuthContext.jsx` using `localStorage`:

```javascript
// Stored User Session Schema
{
  id: "usr_admin_01",
  name: "Sarah Connor",
  email: "admin@enterprise.com",
  role: "Admin",
  title: "Lead Executive Administrator",
  department: "Security & Administration",
  hasPasskey: true,
  passkeys: [
    {
      id: "pk_sarah_hello",
      name: "Sarah's Windows Hello (Facial & PIN)",
      type: "platform",
      createdAt: "2026-01-15T08:00:00.000Z"
    }
  ],
  loginTimestamp: "2026-10-30T12:00:00.000Z"
}
```

---

## 5. Step-by-Step Evaluation Guide
1. Navigate to `/login`. Verify the clean, professional corporate design with midnight glassmorphism.
2. Click the **Admin (Sarah)** pre-fill chip. Email and password populate automatically.
3. Click the password eye icon to toggle visibility between hidden and visible text.
4. Click **Sign In With Password**. Verify immediate redirect to `/dashboard`.
5. Open the profile menu in the header and click **Sign Out**.
6. Verify direct redirection to `/login` with an informational toast notification.
7. Click **Sign Up** to test `/signup`. Fill in name, email, password, confirm password, select a role tier, and register.
