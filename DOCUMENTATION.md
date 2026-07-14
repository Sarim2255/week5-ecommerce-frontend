# Advanced E-Commerce Frontend - Project Documentation

**Project Name**: Sarim's Tech Store  
**Author**: Mohd Sarim Khan  
**Course**: Week 5 - Advanced Frontend Development  
**Submission Date**: July 14, 2026  

---

## 1. Project Overview & Objectives

**Sarim's Tech Store** is a sophisticated, single-page application (SPA) e-commerce frontend built using React 19, Redux Toolkit, React Router, and Tailwind CSS v4. The project simulates a premium dark-cyberpunk e-commerce hardware shop designed for developers.

### Objectives:
- Implement a component-based modular architecture in React.
- Configure global state management for the shopping cart, product catalog, wishlist, comparisons, and simulated user authentication.
- Create a fully responsive, visually striking obsidian-neon styling framework with modern micro-animations and glassmorphism layouts.
- Handle core e-commerce workflows (real-time quantity calculations, 18% GST tax configurations, flat-rate shipping updates, autocomplete debounced search matching, and multi-field credit card checkout validation).
- Build offline resilience via SVG fallback generators for broken image URLs.

---

## 2. Setup & Installation Instructions

To run the project locally on your machine, follow these instructions:

### Prerequisites:
- **Node.js** (LTS version v26.4.0 or higher recommended)
- **NPM** (v11.17.0 or higher)

### Installation Steps:

1. **Extract/Navigate to the Directory**:
   Open your command prompt or terminal and change directory to the project folder:
   ```bash
   cd week5-ecommerce-frontend
   ```

2. **Install Dependencies**:
   Install all routing, Redux, icon, and styling packages:
   ```bash
   npm install
   ```

3. **Run the Development Server**:
   Start the local server:
   ```bash
   npm run dev
   ```
   Once active, open your browser and navigate to the address shown (usually `http://localhost:5173`).

4. **Compile Production Bundle**:
   To generate the optimized production files, run:
   ```bash
   npm run build
   ```
   This will output HTML, CSS, and JS bundles inside the `dist/` directory.

---

## 3. Code Structure Explanation

The application follows a clean, industry-standard React directory structure:

```text
week5-ecommerce-frontend/
├── dist/                          # Production build output
├── node_modules/                  # Dependency libraries
├── public/                        # Static assets
├── src/
│   ├── components/                # Reusable React components
│   │   ├── Header/                # Navigation bar, search autocomplete, auth modal
│   │   ├── ProductCard/           # Product card with cart/wishlist/compare toggles
│   │   ├── Cart/                  # Shopping cart drawer with quantities & totals
│   │   ├── Checkout/              # Form validation checkout layout
│   │   └── common/                # Shared components (Spinner, Modal)
│   ├── pages/                     # Routed page views
│   │   ├── Home.jsx               # Landing page with banner & trends
│   │   ├── ProductList.jsx        # Product catalog page with sidebar filters & sorting
│   │   ├── ProductDetail.jsx      # Detail page with image gallery tabs & review forms
│   │   ├── CartPage.jsx           # Wrapped Cart layout
│   │   ├── CheckoutPage.jsx       # Secure checkout flow with login redirect
│   │   ├── Wishlist.jsx           # Favorited items display
│   │   └── Compare.jsx            # Product comparison metrics table
│   ├── store/                     # Redux state management configuration
│   │   ├── store.js               # Redux combined root store
│   │   ├── cartSlice.js           # Shopping cart states & storage actions
│   │   ├── productSlice.js        # Catalog lists, filter parameters, wishlist/compare states
│   │   └── userSlice.js           # Login sessions & credential states
│   ├── services/
│   │   └── api.js                 # Mock product database & API simulation layer
│   ├── utils/
│   │   └── helpers.js             # Formatting functions (INR Currency, Image fallbacks)
│   ├── App.css                    # Component layout styling definitions
│   ├── index.css                  # Global Tailwind imports & HSL color tokens
│   ├── App.jsx                    # Routing wrapper & layout footer
│   └── index.js                   # Application entrypoint
├── index.html                     # Application base HTML document
├── package.json                   # Scripts & dependency definitions
├── vite.config.js                 # Vite bundler configuration
└── README.md                      # General introduction readme
```

---

## 4. Component Hierarchy Diagram

The hierarchical tree below illustrates how data and control flows down through the nested components:

```text
index.js
 └── Provider (Redux Store)
      └── App (Layout Container)
           ├── Router (HashRouter)
           │    ├── Header (Navigation Bar)
           │    │    ├── Search (Autocomplete Suggestions)
           │    │    └── Modal (Sign In / Register overlay)
           │    │
           │    ├── Routes (Rendered based on URI path)
           │    │    ├── / -> Home
           │    │    │         ├── Featured Grid
           │    │    │         └── ProductCard (Quick Add, Wishlist/Compare toggle)
           │    │    │
           │    │    ├── /products -> ProductList
           │    │    │                 ├── Sidebar Filters (Category, Price, Rating)
           │    │    │                 └── ProductCard Grid
           │    │    │
           │    │    ├── /product/:id -> ProductDetail
           │    │    │                    ├── Gallery Tabs
           │    │    │                    ├── Spec Table
           │    │    │                    ├── Review Item list
           │    │    │                    └── Review Form
           │    │    │
           │    │    ├── /cart -> CartPage
           │    │    │             └── Cart (Qty handlers, subtotal, shipping, GST summary)
           │    │    │
           │    │    ├── /checkout -> CheckoutPage
           │    │    │                 ├── (If Unauthenticated) -> Inline Sign In Form
           │    │    │                 └── (If Authenticated) -> CheckoutForm & Order Summary
           │    │    │
           │    │    ├── /wishlist -> Wishlist (Grid of favorited items)
           │    │    │
           │    │    └── /compare -> Compare (Side-by-side comparison metrics table)
           │    │
           │    └── Footer (Personalized credits block)
           │
           └── Floating Compare Sticky Bar (Displays comparison status at footer boundary)
```

---

## 5. Technical Requirements Met

| Requirement | Implementation Detail |
| :--- | :--- |
| **Vite Boilerplate** | Configured with `react` template, running Vite 8 and Rolldown rendering. |
| **Component Architecture** | Highly modular codebase separating components (Header, ProductCard, Cart, CheckoutForm) from routed pages. |
| **State Management (Redux)** | Configured with Redux Toolkit. Cart items, wishlist items, login tokens, and products are synced in real time across the App and cached inside `localStorage` using `v2` keys to prevent stale caching. |
| **Currency & Tax Localization** | Formats all prices in Indian Rupees (INR, `₹`) using a customized `Intl.NumberFormat` helper. Flat shipping rate is set to **₹150** and the tax is computed at **18% GST** (standard for India). |
| **Autocomplete Search** | Features a debounced search input inside the Header that queries the local product database as you type, rendering image, name, and price dropdown suggestions. |
| **Product Comparison** | Supports adding up to 3 products side-by-side. Displays comparison rows for category, rating, availability, and specific specs (e.g. driver size, layout, drops). |
| **Form Validation** | Checkout form validates inputs with regular expressions. Visual validation styling (`input-invalid` and `validation-error-msg`) alerts the user to invalid fields (16-digit cards, MM/YY expiry, 3-digit CVV, etc.). |
| **Offline Resilience** | Includes a fallback image generator. If any product image fails to load, it automatically calls `onError` and renders a clean local SVG card, ensuring the app remains visually polished. |

---

## 6. Project Visual Walkthrough (Screenshots Guide)

> **Submission Tip**: For your submission, take screenshots of your browser running the app locally and paste them in the spaces below:

### A. Homepage (Hero & Featured Categories)
*Insert a screenshot of the main page showing the banner "Elevate Your Developer Setup" and category grids.*

### B. Hardware Catalog with Sidebar Filters
*Insert a screenshot of the `/products` page showing the categories list, price range slider set in Rupees, and sorted results.*

### C. Autocomplete Search Dropdown
*Insert a screenshot of typing "wireless" in the header search bar and displaying the matching autocomplete cards.*

### D. Detailed Product Page & Specifications
*Insert a screenshot of the product page showing the specs table tab and the ratings/reviews listing.*

### E. Shopping Cart calculations
*Insert a screenshot of the cart page displaying item list summaries with Rupee formatting, GST taxes, and totals.*

### F. Validated Secure Checkout Form
*Insert a screenshot of the checkout form showing shipping inputs, credit card inputs, and validation error messages.*
