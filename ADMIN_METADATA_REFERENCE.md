# Admin Metadata Reference

This document provides a comprehensive data and metadata reference for the **Admin Portal** in the `restaurant-app` frontend. It serves as a technical bridge for frontend maintenance and backend API contract design, documenting all current schemas, mock values, filter options, and UI expectations.

---

## 1. Dashboard

### KPI Data
The Dashboard displays 4 key metric cards defined in [`AdminDashboardPage.tsx`](file:///c:/Users/kings/OneDrive/Desktop/Big%20project%201/restaurant-app/src/features/admin/pages/AdminDashboardPage.tsx) using the [`StatCard.tsx`](file:///c:/Users/kings/OneDrive/Desktop/Big%20project%201/restaurant-app/src/features/admin/components/StatCard.tsx) component.

| Metric Key | Metric Title | Mock Value | Percentage Change (`change`) | Description / Subtext (`description`) |
| :--- | :--- | :--- | :--- | :--- |
| `total_orders` | Total Orders | `"1,248"` | `"+12.5%"` | `"vs previous period"` |
| `total_revenue` | Total Revenue | `"₹3,84,920"` | `"+8.4%"` | `"vs previous period"` |
| `total_customers` | Total Customers | `"2,430"` | `"+5.2%"` | `"vs previous period"` |
| `menu_items` | Menu Items | `"86"` | *None* | `"74 active · 12 unavailable"` |

---

### Revenue Overview
Implemented in [`RevenueOverview.tsx`](file:///c:/Users/kings/OneDrive/Desktop/Big%20project%201/restaurant-app/src/features/admin/components/RevenueOverview.tsx), displaying a responsive bar chart with day bars, order totals, and revenue metrics.

#### Filter Period Options
Defined as a dropdown `<select>` element:
- `"Last 7 Days"` *(default selected)*
- `"Last 30 Days"`
- `"Today"`

#### Weekly Chart Data (`overviewData`)

| Day Label (`day`) | Orders (`orders`) | Revenue (`revenue`) | Tooltip Format |
| :--- | :--- | :--- | :--- |
| `"Mon"` | `42` | `12450` | `₹12,450 · 42 orders` |
| `"Tue"` | `51` | `15820` | `₹15,820 · 51 orders` |
| `"Wed"` | `38` | `11200` | `₹11,200 · 38 orders` |
| `"Thu"` | `64` | `19450` | `₹19,450 · 64 orders` |
| `"Fri"` | `58` | `17680` | `₹17,680 · 58 orders` |
| `"Sat"` | `72` | `22100` | `₹22,100 · 72 orders` |
| `"Sun"` | `67` | `20450` | `₹20,450 · 67 orders` |

#### Aggregated Computations in UI
- **Max Revenue for Bar Heights**: `Math.max(...overviewData.map((item) => item.revenue))` (relative bar height calculated via `(item.revenue / maxRevenue) * 100%`)
- **Total Orders**: `overviewData.reduce((total, item) => total + item.orders, 0)` ➔ **392 orders**
- **Total Revenue**: `overviewData.reduce((total, item) => total + item.revenue, 0)` ➔ **₹1,19,150**

---

### Recent Orders
Implemented in [`RecentOrders.tsx`](file:///c:/Users/kings/OneDrive/Desktop/Big%20project%201/restaurant-app/src/features/admin/components/RecentOrders.tsx), presenting a dashboard summary table of the latest 5 orders.

#### Dashboard Order Schema (`Order`)
- `id` (`string`): Unique formatted identifier (e.g. `"#ORD-1024"`)
- `customer` (`string`): Full name of the customer
- `items` (`number`): Count of items in the order
- `amount` (`number`): Order total in currency units (INR)
- `status` (`OrderStatus`): `"Pending" | "Confirmed" | "Preparing" | "Ready" | "Completed" | "Cancelled"`
- `date` (`string`): Relative/human-readable date string (e.g. `"Today, 12:42 PM"`)

#### Current Mock Records (`recentOrders`)

| Order ID (`id`) | Customer (`customer`) | Items (`items`) | Amount (`amount`) | Status (`status`) | Date (`date`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `"#ORD-1024"` | `"Rahul Verma"` | `2` | `598` | `"Preparing"` | `"Today, 12:42 PM"` |
| `"#ORD-1023"` | `"Priya Sharma"` | `3` | `849` | `"Pending"` | `"Today, 12:28 PM"` |
| `"#ORD-1022"` | `"Aman Singh"` | `1` | `299` | `"Ready"` | `"Today, 12:15 PM"` |
| `"#ORD-1021"` | `"Neha Gupta"` | `4` | `1120` | `"Completed"` | `"Today, 11:54 AM"` |
| `"#ORD-1020"` | `"Arjun Das"` | `2` | `549` | `"Cancelled"` | `"Today, 11:37 AM"` |

---

### Popular Dishes
Implemented in [`PopularDishes.tsx`](file:///c:/Users/kings/OneDrive/Desktop/Big%20project%201/restaurant-app/src/features/admin/components/PopularDishes.tsx), displaying the top 5 revenue-generating dishes.

#### Popular Dish Schema (`PopularDish`)
- `id` (`string`): Unique dish identifier
- `name` (`string`): Dish title
- `category` (`string`): Menu category name
- `image` (`string`): Image URL source
- `ordersSold` (`number`): Total quantity sold
- `revenue` (`number`): Total revenue generated in INR

#### Current Mock Records (`popularDishes`)

| ID | Name | Category | Orders Sold | Revenue | Image URL |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `"1"` | `"Margherita Pizza"` | `"Pizza"` | `142` | `₹42,478` | `https://images.unsplash.com/photo-1574071318508-1cdbab80d002` |
| `"2"` | `"Classic Cheese Burger"` | `"Burger"` | `118` | `₹23,582` | `https://images.unsplash.com/photo-1568901346375-23c9450c58cd` |
| `"3"` | `"Creamy Alfredo Pasta"` | `"Pasta"` | `96` | `₹23,904` | `https://images.unsplash.com/photo-1473093295043-cdd812d0e601` |
| `"4"` | `"Chocolate Lava Cake"` | `"Dessert"` | `81` | `₹14,580` | `https://images.unsplash.com/photo-1606313564200-e75d5e30476c` |
| `"5"` | `"Pepperoni Pizza"` | `"Pizza"` | `74` | `₹22,126` | `https://images.unsplash.com/photo-1628840042765-356cda07504e` |

---

## 2. Menu Management

### Menu Item Schema
Defined in [`types.ts`](file:///c:/Users/kings/OneDrive/Desktop/Big%20project%201/restaurant-app/src/features/admin/types.ts) as `MenuItem`:

```typescript
export type MenuItem = {
  id: string;          // Unique string ID (e.g. "1" or Date.now().toString())
  name: string;        // Name of the dish
  category: string;    // Category (e.g. "Pizza", "Burger", "Pasta", "Dessert", "Starters")
  price: number;       // Numeric price in INR
  available: boolean;  // Availability toggle (true = In Stock, false = Out of Stock)
  isVeg: boolean;      // Dietary indicator (true = Vegetarian, false = Non-Vegetarian)
};
```
*Note on `description`: Collected inside [`AddDishModal.tsx`](file:///c:/Users/kings/OneDrive/Desktop/Big%20project%201/restaurant-app/src/features/admin/components/AddDishModal.tsx) via local component state for user input, though currently stored outside the strict `MenuItem` record.*

---

### Categories
Current categories used across [`MenuFilters.tsx`](file:///c:/Users/kings/OneDrive/Desktop/Big%20project%201/restaurant-app/src/features/admin/components/MenuFilters.tsx) and [`AddDishModal.tsx`](file:///c:/Users/kings/OneDrive/Desktop/Big%20project%201/restaurant-app/src/features/admin/components/AddDishModal.tsx):
- `"Pizza"`
- `"Burger"`
- `"Pasta"`
- `"Dessert"`
- `"Starters"`

Filter selector also prepends:
- `"All"` / `"All Categories"`

---

### Food Types
Mapped via boolean `isVeg` field in [`AddDishModal.tsx`](file:///c:/Users/kings/OneDrive/Desktop/Big%20project%201/restaurant-app/src/features/admin/components/AddDishModal.tsx) and [`MenuTable.tsx`](file:///c:/Users/kings/OneDrive/Desktop/Big%20project%201/restaurant-app/src/features/admin/components/MenuTable.tsx):

| Option Label | Internal Form Value | Data Model Field Value | UI Badge Style |
| :--- | :--- | :--- | :--- |
| **Veg** | `"veg"` | `isVeg: true` | `badge badge-xs badge-success` (Green) |
| **Non-Veg** | `"non-veg"` | `isVeg: false` | `badge badge-xs badge-error` (Red) |

---

### Current Mock Items (`initialMenuItems`)

| ID | Dish Name | Category | Price | Availability (`available`) | Food Type (`isVeg`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `"1"` | `"Margherita Pizza"` | `"Pizza"` | `299` | `true` | `true` (Veg) |
| `"2"` | `"Classic Cheese Burger"` | `"Burger"` | `249` | `true` | `false` (Non-Veg) |
| `"3"` | `"Creamy Alfredo Pasta"` | `"Pasta"` | `299` | `false` | `true` (Veg) |
| `"4"` | `"Chocolate Lava Cake"` | `"Dessert"` | `180` | `true` | `true` (Veg) |
| `"5"` | `"Paneer Tikka"` | `"Starters"` | `220` | `true` | `true` (Veg) |

---

### Interactivity & Form Operations

#### 1. Search Behavior
- **Field Searched**: `item.name` (case-insensitive substring match).
- **Implementation**: `item.name.toLowerCase().includes(search.toLowerCase())`.

#### 2. Category Filter Behavior
- **Implementation**: `category === "All" || item.category === category`.

#### 3. Availability Toggle Behavior
- Clicking the toggle switch calls `handleAvailabilityChange(id)` in [`AdminMenuPage.tsx`](file:///c:/Users/kings/OneDrive/Desktop/Big%20project%201/restaurant-app/src/features/admin/pages/AdminMenuPage.tsx).
- Inverts `available` boolean (`item.available = !item.available`) in local React state.

#### 4. Add Dish Form & Validation
- **Component**: [`AddDishModal.tsx`](file:///c:/Users/kings/OneDrive/Desktop/Big%20project%201/restaurant-app/src/features/admin/components/AddDishModal.tsx).
- **Collected Fields**:
  - `Dish Name` (`string`, required)
  - `Category` (`select`, defaults to `"Pizza"`)
  - `Food Type` (`select`: `"veg"` ➔ `true`, `"non-veg"` ➔ `false`)
  - `Price` (`number`, required, must be `> 0`)
  - `Description` (`textarea`, optional)
- **Validation Rules**:
  - If `!name.trim()` ➔ displays error: `"Dish name is required."`
  - If `!price || Number(price) <= 0` ➔ displays error: `"Please enter a valid price."`
- **ID Generation**: Generates `Date.now().toString()` when creating a new dish.

#### 5. Edit Dish
- Opens [`AddDishModal.tsx`](file:///c:/Users/kings/OneDrive/Desktop/Big%20project%201/restaurant-app/src/features/admin/components/AddDishModal.tsx) pre-populated with selected dish properties.
- Modal header displays `"Edit Dish"` and submit button renders `"Save Changes"`.
- Updates the matching record by `id` in local state.

#### 6. Delete Dish
- Opens [`DeleteDishModal.tsx`](file:///c:/Users/kings/OneDrive/Desktop/Big%20project%201/restaurant-app/src/features/admin/components/DeleteDishModal.tsx) displaying dish title and warning text: `"Are you sure you want to delete <dishName>? This action cannot be undone."`
- Confirmation removes the item from the state array by ID (`items.filter(item => item.id !== deletingDish.id)`).

---

## 3. Order Management

### Order Schema
Defined in [`types.ts`](file:///c:/Users/kings/OneDrive/Desktop/Big%20project%201/restaurant-app/src/features/admin/types.ts) as `AdminOrder`:

```typescript
export type AdminOrder = {
  id: string;            // Formatted Order ID (e.g. "#ORD-1024")
  customerName: string;  // Full name of customer
  items: number;         // Total quantity of items in the order
  amount: number;        // Total order monetary value in INR
  status: OrderStatus;   // Current workflow status
  orderDate: string;     // Formatted timestamp string (e.g. "Today, 12:42 PM")
};
```

---

### Order Statuses & UI Badge Mapping
Supported values defined by `OrderStatus` union:

| Status Value | Badge CSS Class | Visual Meaning |
| :--- | :--- | :--- |
| `"Pending"` | `badge-warning` | Order placed, awaiting kitchen confirmation |
| `"Confirmed"` | `badge-info` | Order acknowledged by kitchen |
| `"Preparing"` | `badge-primary` | Food actively cooking |
| `"Ready"` | `badge-secondary` | Prepared and packaged for pickup/delivery |
| `"Completed"` | `badge-success` | Order successfully fulfilled/delivered |
| `"Cancelled"` | `badge-error` | Order rejected or cancelled |

---

### Current Mock Orders (`adminOrders`)
Exported from [`data.ts`](file:///c:/Users/kings/OneDrive/Desktop/Big%20project%201/restaurant-app/src/features/admin/data.ts):

| Order ID (`id`) | Customer Name (`customerName`) | Items (`items`) | Amount (`amount`) | Status (`status`) | Order Date (`orderDate`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `"#ORD-1024"` | `"Rahul Verma"` | `2` | `598` | `"Preparing"` | `"Today, 12:42 PM"` |
| `"#ORD-1023"` | `"Priya Sharma"` | `3` | `849` | `"Pending"` | `"Today, 12:28 PM"` |
| `"#ORD-1022"` | `"Aman Singh"` | `1` | `299` | `"Ready"` | `"Today, 12:15 PM"` |
| `"#ORD-1021"` | `"Neha Gupta"` | `4` | `1120` | `"Completed"` | `"Today, 11:54 AM"` |
| `"#ORD-1020"` | `"Arjun Das"` | `2` | `549` | `"Cancelled"` | `"Today, 11:37 AM"` |
| `"#ORD-1019"` | `"Sneha Roy"` | `3` | `720` | `"Confirmed"` | `"Today, 11:21 AM"` |
| `"#ORD-1018"` | `"Vikram Shah"` | `2` | `480` | `"Preparing"` | `"Today, 11:05 AM"` |

---

### Interactivity & Filtering Operations

#### 1. Search Behavior
- **Fields Searched**: Searches across both `order.id` AND `order.customerName`.
- **Implementation**:
  ```typescript
  const searchTerm = search.toLowerCase();
  order.id.toLowerCase().includes(searchTerm) ||
  order.customerName.toLowerCase().includes(searchTerm)
  ```

#### 2. Status Filter
- Dropdown options: `"All"` (All Orders), `"Pending"`, `"Confirmed"`, `"Preparing"`, `"Ready"`, `"Completed"`, `"Cancelled"`.
- **Implementation**: `status === "All" || order.status === status`.

#### 3. Status Update Operation
- In [`OrderTable.tsx`](file:///c:/Users/kings/OneDrive/Desktop/Big%20project%201/restaurant-app/src/features/admin/components/order/OrderTable.tsx), each row renders an interactive `<select>` dropdown.
- Selecting a new value fires `onStatusChange(order.id, newStatus)`.
- Updates the order record in local component state (`orders.map(...)`).

---

## 4. Customer Management

### Customer Schema
Defined in [`types.ts`](file:///c:/Users/kings/OneDrive/Desktop/Big%20project%201/restaurant-app/src/features/admin/types.ts) as `AdminCustomer`:

```typescript
export type AdminCustomer = {
  id: string;          // Formatted ID (e.g. "CUST-001")
  name: string;        // Customer full name
  email: string;       // Email address
  phone: string;       // Formatted contact phone number
  totalOrders: number; // Historical completed order count
  totalSpent: number;  // Lifetime expenditure in INR
  joinedDate: string;  // Formatted registration date (e.g. "Jan 15, 2026")
};
```

---

### Current Mock Customers (`adminCustomers`)
Exported from [`data.ts`](file:///c:/Users/kings/OneDrive/Desktop/Big%20project%201/restaurant-app/src/features/admin/data.ts):

| Customer ID | Name | Email | Phone | Total Orders | Total Spent | Joined Date |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `"CUST-001"` | `"Rahul Verma"` | `"rahul.verma@example.com"` | `"+91 98765 43210"` | `14` | `₹8,420` | `"Jan 15, 2026"` |
| `"CUST-002"` | `"Priya Sharma"` | `"priya.sharma@example.com"` | `"+91 98123 45678"` | `22` | `₹14,250` | `"Feb 02, 2026"` |
| `"CUST-003"` | `"Aman Singh"` | `"aman.singh@example.com"` | `"+91 97654 32109"` | `8` | `₹4,890` | `"Mar 10, 2026"` |
| `"CUST-004"` | `"Neha Gupta"` | `"neha.gupta@example.com"` | `"+91 99887 76655"` | `31` | `₹21,800` | `"Dec 18, 2025"` |
| `"CUST-005"` | `"Arjun Das"` | `"arjun.das@example.com"` | `"+91 95432 10987"` | `5` | `₹3,120` | `"Apr 05, 2026"` |

#### Search Behavior
- Implemented in [`AdminCustomersPage.tsx`](file:///c:/Users/kings/OneDrive/Desktop/Big%20project%201/restaurant-app/src/features/admin/pages/AdminCustomersPage.tsx).
- Matches customer `name`, `email`, or `phone`.

---

## 5. Admin Navigation & Shared Layout

### Admin Routes
Configured in [`AppRoutes.tsx`](file:///c:/Users/kings/OneDrive/Desktop/Big%20project%201/restaurant-app/src/routes/AppRoutes.tsx):

| Route Path | Page Component | Purpose |
| :--- | :--- | :--- |
| `/admin` | Redirects (`<Navigate to="dashboard" replace />`) | Default fallback index route |
| `/admin/dashboard` | `AdminDashboardPage` | Overview analytics, revenue chart, KPI stats |
| `/admin/menu` | `AdminMenuPage` | Dishes inventory table with CRUD actions |
| `/admin/orders` | `AdminOrdersPage` | Live order processing and status pipeline |
| `/admin/customers` | `AdminCustomersPage` | Registered customer profiles & lifetime spend |

---

### Sidebar Items
Implemented in [`AdminSidebar.tsx`](file:///c:/Users/kings/OneDrive/Desktop/Big%20project%201/restaurant-app/src/features/admin/components/AdminSidebar.tsx):

| Navigation Label | Route Path | Lucide Icon Component | Active Styling | Inactive Styling |
| :--- | :--- | :--- | :--- | :--- |
| **Dashboard** | `/admin/dashboard` | `<LayoutDashboard size={20} />` | `bg-primary text-primary-content` | `hover:bg-base-300` |
| **Menu** | `/admin/menu` | `<UtensilsCrossed size={20} />` | `bg-primary text-primary-content` | `hover:bg-base-300` |
| **Orders** | `/admin/orders` | `<ShoppingBag size={20} />` | `bg-primary text-primary-content` | `hover:bg-base-300` |
| **Customers** | `/admin/customers` | `<Users size={20} />` | `bg-primary text-primary-content` | `hover:bg-base-300` |

---

### Layout & UI Conventions
- **Layout Wrapper** ([`AdminLayout.tsx`](file:///c:/Users/kings/OneDrive/Desktop/Big%20project%201/restaurant-app/src/layouts/AdminLayout.tsx)):
  - Flex container with `flex min-h-screen`.
  - Sidebar: fixed width `w-64 shrink-0 border-r bg-base-200 p-4 hidden md:block`.
  - Main container: `flex-1 p-6`.
- **Page Headers** ([`AdminPageHeader.tsx`](file:///c:/Users/kings/OneDrive/Desktop/Big%20project%201/restaurant-app/src/features/admin/components/AdminPageHeader.tsx)):
  - Consistent layout with `h1` (`text-2xl font-bold`), optional subtitle `p` (`text-sm opacity-60`), and optional action slot (e.g. `+ Add Dish` button).
- **Cards & Containers**:
  - Reusable container styling: `rounded-xl border bg-base-100 shadow-sm`.
- **Currency Formatting**:
  - Formatted using `₹` prefix and `toLocaleString("en-IN")`.

---

## 6. Centralized Static Metadata

Static configuration constants are organized in [`src/features/admin/metadata.ts`](file:///c:/Users/kings/OneDrive/Desktop/Big%20project%201/restaurant-app/src/features/admin/metadata.ts):

- `ADMIN_NAVIGATION_ITEMS`: Navigation definitions for admin links and icons.
- `MENU_CATEGORIES`: Array of dish categories (`["Pizza", "Burger", "Pasta", "Dessert", "Starters"]`).
- `MENU_FILTER_CATEGORIES`: Categories with `"All"` prepended for filtering.
- `FOOD_TYPES`: Dietary options with boolean mapping (`[{ label: "Veg", value: true }, { label: "Non-Veg", value: false }]`).
- `ORDER_STATUSES`: Array of all order status options.
- `ORDER_FILTER_STATUSES`: Order statuses with `"All"` prepended for filtering.
- `ORDER_STATUS_BADGE_CLASSES`: DaisyUI CSS class mapping for order statuses.
- `DASHBOARD_PERIOD_OPTIONS`: Timeframe options (`["Last 7 Days", "Last 30 Days", "Today"]`).

---

## 7. Backend Integration Notes & Contract Checklist

The table below categorizes all values used in the admin frontend into **Static UI Constants**, **Current Mock Data**, and **Provisional Contracts** requiring backend developer confirmation.

| Area | Current Implementation Status | Classification | Backend Alignment Questions / Notes |
| :--- | :--- | :--- | :--- |
| **Order Status Enum** | `"Pending"`, `"Confirmed"`, `"Preparing"`, `"Ready"`, `"Completed"`, `"Cancelled"` | 🟡 **Provisional** | Does the backend state machine use these exact status names (or SCREAMING_SNAKE_CASE like `PREPARING`, `OUT_FOR_DELIVERY`)? |
| **Menu Categories** | `"Pizza"`, `"Burger"`, `"Pasta"`, `"Dessert"`, `"Starters"` | 🟡 **Provisional** | Will categories be hardcoded enums or a dynamic database collection (`GET /api/categories`) with `id`, `name`, `slug`? |
| **Menu Item Model** | `id`, `name`, `category`, `price`, `available`, `isVeg`, `description` (modal only) | 🟡 **Provisional** | Should image uploads be included? Is `description` part of the dish schema? Are prices stored in rupees or paise (cents)? |
| **Order Model** | `id`, `customerName`, `items`, `amount`, `status`, `orderDate` | 🟡 **Provisional** | Backend orders will need itemized line items (`orderItems: [{ dishId, quantity, price }]`), delivery address, customer ID, and payment status. |
| **Dashboard Metrics** | Hardcoded mock numbers in `AdminDashboardPage` and `RevenueOverview` | 🔴 **Mock Data Only** | Backend should provide an aggregated endpoint: `GET /api/admin/dashboard-stats?period=7d`. |
| **Popular Dishes** | Static list in `PopularDishes.tsx` | 🔴 **Mock Data Only** | Backend should provide `GET /api/admin/analytics/popular-dishes`. |
| **Customer Model** | `id`, `name`, `email`, `phone`, `totalOrders`, `totalSpent`, `joinedDate` | 🟡 **Provisional** | Backend endpoint `GET /api/admin/customers` with pagination, search, and sorting. |
| **Navigation Paths** | `/admin/dashboard`, `/admin/menu`, `/admin/orders`, `/admin/customers` | 🟢 **Static UI Metadata** | Frontend client-side routes. |
| **Status Badge Styles** | DaisyUI badge class mappings | 🟢 **Static UI Metadata** | Pure frontend presentation logic. |
| **Data Persistence** | Component-level React `useState` | 🔴 **No Persistence** | Requires Redux Toolkit / React Query / Axios integration with backend REST/GraphQL API. |
