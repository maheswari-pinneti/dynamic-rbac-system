# Dynamic Role-Based Access Management System

An enterprise-grade, responsive **Role-Based Access Management (RBAC)** web application built with **React.js (Vite)**, **Tailwind CSS**, **React Router**, **React Context API**, and a **Third-Party REST API (DummyJSON)**.

The core objective of this application is not merely User or Product CRUD, but a **runtime-configurable Dynamic Role-Based Access Control system**, where the **Admin** manages page-level and feature-level permissions for **Managers** and **Employees** dynamically through the Admin Settings matrix—without modifying a single line of source code.

---

## 🚀 Live Demo & Quick Start

### 1. Prerequisites
- **Node.js**: `v18+` or `v20+`
- **Package Manager**: `npm` or `pnpm`

### 2. Installation
```bash
# Navigate to project directory
cd dynamic-rbac-system

# Install dependencies
npm install
```

### 3. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Production Build
```bash
npm run build
npm run preview
```

---

## 👥 Default Demo Personas (Pre-Seeded)

The login page features **One-Click Demo Personas** to enable rapid evaluation and testing:

| Persona | Email | Password | Role & Scope | Default Privilege |
|---|---|---|---|---|
| **Admin (Sarah)** | `admin@enterprise.com` | `Password123!` | Administrator | **Full Master Access**: Complete CRUD, Analytics, Reports, and Admin Settings Matrix. |
| **Manager (Marcus)** | `manager@enterprise.com` | `Password123!` | Manager | **Configurable Access**: Dashboard, Analytics, View Records, Create Records, Edit Records, Reports. (Delete restricted by default). |
| **Employee (Elena)** | `employee@enterprise.com` | `Password123!` | Employee | **Restricted Access**: Dashboard, Analytics, View Records, Profile. (Create, Edit, Delete, Reports restricted by default). |

---

## 🏗️ The 6 Required Modules Overview

### Module 1 – Authentication
- **Multi-Modal Sign-In**:
  - **Passkey / Biometric**: Native W3C Web Authentication API (`navigator.credentials.create` and `navigator.credentials.get`), supporting Windows Hello Facial Recognition & PIN, Fingerprint scanners, and FIDO2 keys.
  - **Password Sign-In**: Email and Password with interactive **Show/Hide Password** toggle and RFC validation.
- **Signup Page**: Register new user accounts with Name, Email, Password, Confirm Password, and Role Selection (`Admin`, `Manager`, `Employee`).
- **Direct Logout Redirection**: Clicking Sign Out immediately clears the session and redirects directly to `/login` with an informational toast notification.

### Module 2 – Analytics Dashboard
- **8 Dashboard Summary Cards**:
  1. `Total Records` (194 Items)
  2. `Total Active Records` (168 In-Stock)
  3. `Total Inactive Records` (26 Low Stock)
  4. `Total Managers` (4 Managers)
  5. `Total Employees` (12 Specialists)
  6. `Total Roles` (3 RBAC Roles)
  7. `Recent Activities` (48 Operations)
  8. `New Records This Month` (38 Additions)
- **4 Core Recharts Visualizations**:
  1. **Line Chart**: Monthly Growth & Sales Velocity with dual trajectories (Total Records & In-Stock Units).
  2. **Bar Chart**: Record Distribution across product categories (Beauty, Furniture, Fragrances, Groceries, Laptops, Phones).
  3. **Pie Chart**: Status Distribution (Solid Pie Chart: In-Stock Ready, Low Stock Alert, Critical Outages).
  4. **Donut Chart**: Category Valuation Share & Activity Trend with center icon and detailed side legend.
- **5 Additional Dashboard Sections**:
  1. **Recent Activities**: Real-time audit trail of product edits, creations, and permission modifications.
  2. **Recent Login History**: Session security logs with user, role, auth method, IP address, timestamp, and status.
  3. **Growth Analytics & Velocity**: Monthly growth (+18.4%), fulfillment SLA (98.2%), and catalog expansion targets.
  4. **System Statistics & Infrastructure Health**: DummyJSON REST API health (200 OK), cache hit rate (94.6%), response latency (48 ms), and RBAC rules enforcement.
  5. **Top Categories**: Product distribution progress bars with item counts.
- **Interactive Calendar Date Selector**:
  - Embedded in header (`11 Jul 2026 ▾`) with month navigation, day selection, and quick presets (Today, Yesterday, Last 7D, This Month).

### Module 3 – Third-Party REST API CRUD Management
- Integrates with public **DummyJSON Products REST API** (`https://dummyjson.com/products`).
- **Features**: List Records, View Details (3-tab modal with specifications, logistics, reviews), Create Record, Edit Record, Delete Record.
- **Search & Filters**: Real-time search by title, brand, category, or SKU; 24-category filter; stock status filter; column sorting; paginated browsing.

### Module 4 – Dynamic Role-Based Access Control (Core Engine)
- Three tiers: **Admin**, **Manager**, **Employee**.
- Permissions are evaluated dynamically at runtime via `PermissionContext.jsx` using React Context API.
- Zero hardcoding of permissions.

### Module 5 – Admin Settings & Dynamic Permission Management
- Dedicated Admin Settings page (`/admin/settings`) accessible exclusively by Admin.
- **Permission Matrix**: Interactive toggle switches for all modules and CRUD actions.
- Real-time save: Updated permissions apply immediately across all Manager and Employee sessions.
- Reset to Default: Restores standard baseline enterprise permissions.
- User Role Management: Reassign roles, register new user accounts, and remove accounts.

### Module 6 – Dynamic Sidebar & Protected Routes
- Dynamic Sidebar: Menu items appear and disappear in real time based on active permissions.
- Feature-Level Authorization: Action buttons (`Add Product`, `Edit`, `Delete`) appear and disappear via `<CanAccess />`.
- Page-Level Route Protection: Unauthorized URL manipulation triggers the dedicated **HTTP 403 – Access Denied** page.

---

## 🛠️ Technical Stack
- **Framework**: React.js 18 with Vite
- **Styling**: Tailwind CSS with custom corporate design system
- **Routing**: React Router v6
- **State Management**: Pure React Context API (AuthContext, PermissionContext, ProductContext, ThemeContext, ToastContext) — **Zero Redux**
- **HTTP Client**: Axios with interceptors and error handling
- **Charts**: Recharts (LineChart, BarChart, PieChart, DonutChart)
- **Icons**: Lucide React
- **Biometrics**: Native W3C Web Authentication API (WebAuthn / FIDO2)

---

## 📁 Project Folder Structure
```
dynamic-rbac-system/
├── docs/                     # Comprehensive module specifications & guides
├── public/                   # Public assets & icons
├── src/
│   ├── api/                  # Axios client & DummyJSON API service
│   ├── components/
│   │   ├── common/           # Reusable UI (Button, Modal, Input, UserAvatar, CalendarDropdown, ThemeToggle...)
│   │   ├── layout/           # AppLayout, Header, Sidebar
│   │   └── rbac/             # ProtectedRoute, CanAccess guards
│   ├── context/              # AuthContext, PermissionContext, ProductContext, ThemeContext, ToastContext
│   ├── pages/
│   │   ├── admin/            # AdminSettings (Permission Matrix & User Management)
│   │   ├── auth/             # Login, Signup, Logout
│   │   ├── dashboard/        # Dashboard (8 KPIs, 4 Charts, 5 Sections), Analytics
│   │   ├── error/            # AccessDenied (403), NotFound (404)
│   │   ├── products/         # ProductList, ProductDetailModal, ProductFormModal
│   │   ├── profile/          # User Profile & Passkey Management
│   │   └── reports/          # Valuation & Export Reports
│   ├── utils/                # Constants, formatters, storage helpers, passkey utilities
│   ├── App.jsx               # Routes definition with ProtectedRoute wrappers
│   ├── index.css             # Tailwind base & global animations
│   └── main.jsx              # React DOM root render
├── index.html                # App shell with dark/light FOUC prevention
├── package.json              # Dependencies & build scripts
├── tailwind.config.js        # Tailwind design tokens
└── vite.config.js            # Vite build configuration
```
