# Module 4: Dynamic Role-Based Access Control (Core Engine)

## 1. Overview & Objective
Module 4 defines the core architectural foundation of the application: **Dynamic Role-Based Access Control (RBAC)**. Permissions across the entire application are **never hardcoded**. Instead, all capabilities are evaluated at runtime through `PermissionContext.jsx` based on the live dynamic matrix configured by the Admin.

---

## 2. The Three Role Tiers

### 2.1 Admin (Super Administrator)
- Has **complete control** over the application.
- Permanently granted all permissions: Manage all records, perform complete CRUD, access Dashboard, access Analytics, manage User Roles, configure Dynamic Permissions, access Reports, and manage System Settings.
- Admin permissions cannot be revoked, ensuring the system remains governed.

### 2.2 Manager (Department Lead)
- Operational authority assigned dynamically by the Admin.
- **Default Permissions**: Dashboard (`✓`), Analytics (`✓`), View Records (`✓`), Create Records (`✓`), Edit Records (`✓`), Delete Records (`✗`), Reports (`✓`), Settings (`✗`), Profile (`✓`).
- The Admin can grant or revoke any capability at runtime without restarting the application.

### 2.3 Employee (Staff Specialist)
- Task-bound operational authority assigned dynamically by the Admin.
- **Default Permissions**: Dashboard (`✓`), Analytics (`✓`), View Records (`✓`), Create Records (`✗`), Edit Records (`✗`), Delete Records (`✗`), Reports (`✗`), Settings (`✗`), Profile (`✓`).
- All permissions are fully controlled through the Admin Settings matrix.

---

## 3. Dynamic Permission Engine

### 3.1 Permission Enum (`PERMISSIONS`)
```javascript
export const PERMISSIONS = {
  DASHBOARD: 'dashboard.view',
  ANALYTICS: 'analytics.view',
  VIEW_RECORDS: 'records.view',
  CREATE_RECORDS: 'records.create',
  EDIT_RECORDS: 'records.edit',
  DELETE_RECORDS: 'records.delete',
  REPORTS: 'reports.view',
  SETTINGS: 'settings.manage',
  PROFILE: 'profile.view',
};
```

### 3.2 Runtime Evaluation via React Context API
```javascript
const { hasPermission } = usePermission();

// Evaluates live permissions at runtime
const canCreate = hasPermission(PERMISSIONS.CREATE_RECORDS, currentUser.role);
```

### 3.3 Fine-Grained Feature Authorization (`<CanAccess />`)
```jsx
<CanAccess permission={PERMISSIONS.CREATE_RECORDS} fallback={null}>
  <Button onClick={handleOpenCreate}>Add Product</Button>
</CanAccess>
```

---

## 4. Evaluation Checklist
- [x] Zero hardcoded permission checks in UI components.
- [x] Dynamic evaluation on every route navigation and UI action.
- [x] Instant reflection across Manager and Employee sessions when permissions change.
