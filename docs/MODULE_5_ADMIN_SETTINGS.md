# Module 5: Admin Settings & Dynamic Permission Management

## 1. Overview & Objective
Module 5 is the central administrative hub of the application. It is accessible exclusively by the **Admin** and provides runtime governance over all permissions for Managers and Employees via an interactive **Permission Matrix**. Changes take effect immediately without requiring code changes or server redeployments.

---

## 2. Core Features & Capabilities

### 2.1 Dedicated Admin Settings Page (`/admin/settings`)
- Accessible strictly by users with the `Admin` role.
- Unauthorized access attempts are automatically redirected to `403 – Access Denied`.

### 2.2 The Mandatory Permission Matrix
Interactive toggle switches allowing the Admin to grant or revoke any capability for Managers and Employees:

| Module / Permission | Permission Key | Admin | Manager (Default) | Employee (Default) |
| :--- | :--- | :---: | :---: | :---: |
| **Dashboard** | `dashboard.view` | ☑ | ☑ | ☑ |
| **Analytics Dashboard** | `analytics.view` | ☑ | ☑ | ☑ |
| **View Records** | `records.view` | ☑ | ☑ | ☑ |
| **Create Records** | `records.create` | ☑ | ☑ | ☐ |
| **Edit Records** | `records.edit` | ☑ | ☑ | ☐ |
| **Delete Records** | `records.delete` | ☑ | ☐ | ☐ |
| **Reports** | `reports.view` | ☑ | ☑ | ☐ |
| **Settings** | `settings.manage` | ☑ | ☐ | ☐ |
| **Profile** | `profile.view` | ☑ | ☑ | ☑ |

### 2.3 Real-Time Application & Persistence
- **Save Permission Settings**: Broadcasts matrix updates to all active sessions via React Context API and persists to `localStorage`.
- **Reset to Default**: Instantly restores standard recommended enterprise permissions.
- **Unsaved Changes Indicator**: Alerts the Admin with an amber banner when changes are pending.

### 2.4 User Role Management (User CRUD)
- List registered users with role badges, department assignments, and passkey status.
- Reassign roles dynamically (e.g. promote an Employee to Manager).
- Add new user accounts with pre-assigned initial role tiers.
- Remove obsolete user accounts with confirmation guard.

---

## 3. Component Architecture

```
src/
├── pages/admin/
│   └── AdminSettings.jsx       # Permission Matrix & User Management tabs
├── components/common/
│   ├── Toggle.jsx              # Accessible toggle switch component
│   └── ConfirmModal.jsx        # Reset confirmation modal
└── context/
    ├── PermissionContext.jsx   # Runtime permission matrix engine
    └── AuthContext.jsx         # User role updates & accounts registry
```

---

## 4. Evaluation Checklist
- [x] Dedicated Admin Settings accessible only by Admin.
- [x] Permission Matrix with interactive toggle switches.
- [x] Immediate runtime application upon clicking Save.
- [x] Reset to Default button.
- [x] User Role Management tab with Add User, Role Reassignment, and Remove User.
