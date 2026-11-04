# Module 6: Dynamic Sidebar & Protected Routes

## 1. Overview & Objective
Module 6 connects the Dynamic RBAC Engine to the navigation UI and routing layer. The sidebar navigation is generated dynamically based on the active user's permissions, action buttons are conditionally rendered, and route changes are protected against unauthorized URL manipulation.

---

## 2. Core Features & Capabilities

### 2.1 Dynamic Sidebar Generation
- Menu items are filtered at runtime based on `hasPermission`:
  - If the Admin revokes **Reports**, the *"Reports & Export"* link automatically disappears from the Sidebar.
  - If the Admin revokes **Analytics**, the *"Analytics Dashboard"* link automatically disappears.
  - If the Admin revokes **Dashboard**, only permitted modules remain visible.
- Clean layout matching corporate standards, terminating directly with the **Sign Out** button.

### 2.2 Feature-Level Authorization (`<CanAccess />`)
- Action buttons throughout the UI appear and disappear dynamically:
  - If the Admin revokes `records.create`, the **"Add Product"** button disappears.
  - If the Admin grants `records.delete` to Managers, the **"Delete"** trash icon immediately appears in the product table.
  - If the Admin revokes `records.edit`, the **"Edit"** pencil icon disappears.

### 2.3 Page-Level Protected Routes (`<ProtectedRoute />`)
- Wraps all enterprise routes in `App.jsx`.
- If a user attempts to bypass the UI by manually typing an unauthorized URL in the browser address bar (e.g., an Employee typing `/admin/settings` or `/reports`):
  - Access is intercepted immediately.
  - The application renders the dedicated **HTTP 403 – Access Denied** page.
  - Displays current role, attempted section, required authorization policy, and a **"Return to Dashboard"** button.

---

## 3. Component Architecture

```
src/
├── components/rbac/
│   ├── ProtectedRoute.jsx      # Route guard checking authentication & permissions
│   └── CanAccess.jsx           # Feature-level conditional rendering wrapper
├── components/layout/
│   ├── Sidebar.jsx             # Dynamic navigation filtered by active permissions
│   ├── Header.jsx              # Search, calendar dropdown, theme switch & user avatar
│   └── AppLayout.jsx           # Master shell layout with responsive sidebar
└── pages/error/
    ├── AccessDenied.jsx        # Corporate 403 Access Denied page
    └── NotFound.jsx            # Corporate 404 Page Not Found page
```

---

## 4. Evaluation Checklist
- [x] Sidebar menu items dynamically appear and disappear based on permissions.
- [x] Feature buttons (`Add Product`, `Edit`, `Delete`) appear and disappear dynamically.
- [x] Unauthorized URL navigation triggers 403 – Access Denied page.
- [x] Clean corporate design for 403 and 404 error pages.
