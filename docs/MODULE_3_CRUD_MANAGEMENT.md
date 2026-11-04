# Module 3: Third-Party REST API CRUD Management

## 1. Overview & Objective
Module 3 implements a complete CRUD (Create, Read, Update, Delete) management system integrated with the public **DummyJSON Products REST API** (`https://dummyjson.com/products`). The module includes real-time search, multi-category filtering, inventory status filtering, column sorting, paginated browsing, and permission-gated action buttons.

---

## 2. API Integration & Operations

### 2.1 HTTP Methods & Endpoints
| Operation | HTTP Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **List Records** | `GET` | `/products?limit=100` | Retrieves catalog collection with pagination and sorting |
| **Search Records** | `GET` | `/products/search?q={query}` | Filters records matching title, brand, or SKU |
| **Filter Category**| `GET` | `/products/category/{cat}` | Filters catalog items by department |
| **Get Details** | `GET` | `/products/{id}` | Fetches full specification, reviews, dimensions, and barcode |
| **Create Record** | `POST` | `/products/add` | Submits new product payload with optimistic cache sync |
| **Update Record** | `PUT` | `/products/{id}` | Modifies specifications, pricing, and stock buffers |
| **Delete Record** | `DELETE`| `/products/{id}` | Permanently removes record with confirmation modal |

### 2.2 Features & User Experience
- **Search**: Instant client-side & server query with debounce.
- **Filters**: Category dropdown (24 departments) and Stock status dropdown (All, In Stock > 10, Low Stock ≤ 10, Out of Stock).
- **Sorting**: Multi-column sorting by Title, Price, Stock, Rating, and Category.
- **Pagination**: Configurable page size (10, 20, 50 records) with responsive page selector.
- **Permission Guards**:
  - `Create Record` button is gated by `records.create`.
  - `Edit` action icon is gated by `records.edit`.
  - `Delete` action icon is gated by `records.delete`.

---

## 3. Component Architecture

```
src/
├── api/
│   ├── axiosClient.js          # Axios instance with interceptors & error handlers
│   └── productsApi.js          # DummyJSON service endpoints
├── context/
│   └── ProductContext.jsx      # Product state, optimistic cache, and sync engine
├── pages/products/
│   ├── ProductList.jsx         # Main CRUD table view with search & filters
│   ├── ProductFormModal.jsx    # Create / Edit product modal with validation
│   └── ProductDetailModal.jsx  # 3-tab comprehensive product specification
└── components/common/
    ├── ConfirmModal.jsx        # Safe confirmation modal for destructive deletes
    └── Pagination.jsx          # Reusable page navigation component
```

---

## 4. Evaluation Checklist
- [x] Full CRUD operations connect to DummyJSON REST API.
- [x] Real-time search by title, brand, category, or SKU.
- [x] Category & status filter dropdowns.
- [x] View Details modal with reviews, dimensions, and logistics.
- [x] Add Product and Edit Product form modals with validation.
- [x] Delete Product confirmation modal with optimistic cache removal.
- [x] Action buttons dynamically appear/disappear based on Admin Settings matrix.
