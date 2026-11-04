# Module 2: Analytics Dashboard

## 1. Overview & Objective
Module 2 delivers an enterprise-grade analytics dashboard that renders real-time catalog metrics, 4 distinct Recharts data visualizations (Line Chart, Bar Chart, solid Pie Chart, Donut Chart), 5 additional dashboard sections, an interactive Calendar Date Selector, and a universal click-to-inspect product modal.

---

## 2. Core Features & Capabilities

### 2.1 The 8 Required Summary KPI Cards
All cards feature vibrant corporate gradients, subtle sparkline curves, live percentage indicators, and interactive click-to-isolate capability:

| Metric Card | Value Display | Trend Tag | Purpose |
| :--- | :--- | :--- | :--- |
| **Total Records** | `194 Items` | `▲ 12.8% vs Last Month` | Total products in catalog synchronized from DummyJSON REST API |
| **Total Active Records** | `168 In-Stock` | `▲ 18.6% Dispatch Ready` | Products maintaining safe inventory buffers (> 10 units) |
| **Total Inactive Records** | `26 Low Stock` | `▲ 10.4% Restock Priority` | Low-stock and depleted products requiring reorders (≤ 10 units) |
| **Total Managers** | `4 Managers` | `Team Leads` | Active supervisory managers with review and editing privileges |
| **Total Employees** | `12 Specialists` | `Operations` | Frontline operations staff coordinating catalog curation |
| **Total Roles** | `3 RBAC Roles` | `Admin • Mgr • Emp` | Three-tiered Dynamic Role-Based Access Control matrix |
| **Recent Activities** | `48 Operations` | `Live Trail` | Live audited operations recorded across user sessions |
| **New Records This Month** | `38 Additions` | `▲ 18.2% Catalog Growth` | Newly introduced merchandise added to catalog this month |

### 2.2 The 4 Mandatory Recharts Data Visualizations
All charts dynamically respond to Light and Dark theme changes with automated SVG axis and grid transitions:

1. **Line Chart – Monthly Growth**:
   - Dual-trajectory visualization comparing total catalog records against in-stock dispatch units across 6 months.
2. **Bar Chart – Record Distribution by Category**:
   - Visualizes product volume distribution across top departments (Beauty, Furniture, Fragrances, Groceries, Laptops, Phones).
3. **Pie Chart – Status Distribution (Solid Pie)**:
   - Solid pie chart detailing inventory status (In-Stock Ready 86%, Low Inventory 11%, Out of Stock 3%).
4. **Donut Chart – Activity Trend & Category Valuation Share**:
   - Donut chart with center icon displaying category share and operational valuation ($148,250 total).

### 2.3 The 5 Additional Dashboard Sections
1. **Recent Activities (Audit Trail)**: Live feed of product updates, creations, and permission modifications stamped with user identity, role, and relative timestamp.
2. **Recent Login History**: Session security table detailing authenticated users, roles, auth methods (Password / Passkey), IP addresses, timestamps, and access status.
3. **Growth Analytics & Velocity**: Monthly growth (+18.4%), fulfillment SLA (98.2%), and catalog capacity target tracking.
4. **System Statistics & Infrastructure Health**: DummyJSON REST API connection status (200 OK), cache hit rate (94.6%), response latency (48 ms), and RBAC rule enforcement.
5. **Top Categories**: Department distribution progress bars with product counts based on the DummyJSON REST API.

### 2.4 Interactive Calendar Date Selector
- Embedded in the top header (`11 Jul 2026 ▾`).
- Features quick presets ("Today", "Yesterday", "Last 7D", "This Month").
- Interactive month/year calendar navigation with day selection, today highlight, and reset button.

### 2.5 Universal Click-to-Inspect Modal
- Inspect any catalog item via [`ProductDetailModal.jsx`](file:///f:/dynamic-rbac-system/src/pages/products/ProductDetailModal.jsx) with 3 comprehensive tabs:
  1. **Product Overview**: Curator attribution, stock status, SKU, pricing, discount, and ratings.
  2. **Specifications & Logistics**: Shipping information, warranty details, return policy, dimensions, and barcode.
  3. **Customer Reviews**: Star breakdown and verified customer reviews.

---

## 3. Component Architecture

```
src/
├── pages/dashboard/
│   ├── Dashboard.jsx            # Enterprise dashboard with 8 KPI cards, 4 charts & 5 sections
│   └── Analytics.jsx            # Standalone analytics dashboard with 4 Recharts
├── components/common/
│   ├── CalendarDropdown.jsx     # Interactive header date picker with month navigation & presets
│   ├── UserAvatar.jsx           # Navy circle with white user silhouette & photo upload
│   └── ThemeToggle.jsx          # Dual-track sliding pill switch (Sun / Moon)
└── pages/products/
    └── ProductDetailModal.jsx   # 3-tab full product inspection modal
```

---

## 4. Evaluation Checklist
- [x] 8 KPI Summary Cards rendered at top with vibrant gradients and sparklines.
- [x] All 4 charts present: Line Chart, Bar Chart, Solid Pie Chart, Donut Chart.
- [x] All 5 additional sections visible: Recent Activities, Recent Login History, Growth Analytics, System Statistics, Top Categories.
- [x] Interactive Calendar Dropdown in Header with month navigation and presets.
- [x] Smooth theme toggle between Light and Dark modes.
