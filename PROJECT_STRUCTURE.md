# E-Commerce Platform Project Structure

## Overview
This is a Next.js-based e-commerce platform integrated with WooCommerce and WordPress, featuring a modern React frontend with TypeScript, Redux state management, and comprehensive payment integration.

## Root Directory Structure

```
├── @types/                     # TypeScript type definitions
│   ├── api.ts                 # API response types
│   ├── index.ts               # Main type exports
│   ├── woocommerce.ts         # WooCommerce entity types
│   └── wordpress.ts           # WordPress entity types
│
├── pages/                      # Next.js pages (file-based routing)
│   ├── api/                   # API routes
│   │   ├── customer/          # Customer management endpoints
│   │   │   ├── [id]/          # Individual customer operations
│   │   │   └── index.ts       # Customer CRUD operations
│   │   ├── orders/            # Order management endpoints
│   │   │   ├── [id]/          # Individual order operations
│   │   │   ├── index.ts       # Order CRUD operations
│   │   │   └── totals.ts      # Order totals calculation
│   │   ├── products/          # Product management endpoints
│   │   │   ├── attributes.ts  # Product attributes API
│   │   │   └── index.ts       # Product CRUD operations
│   │   ├── private-sales.ts   # Private sales API
│   │   └── revalidate.ts      # ISR revalidation endpoint
│   │
│   ├── account/               # Customer account pages
│   ├── checkout/              # Checkout flow pages
│   ├── collaboration/         # Brand collaboration pages
│   ├── collection/            # Product collection pages
│   ├── customer_service/      # Customer support pages
│   ├── legal_area/            # Legal documents (T&C, Privacy)
│   ├── private-sales/         # Private sales section
│   ├── product/               # Individual product pages
│   ├── shop/                  # Shop/catalog pages
│   │
│   ├── [page].tsx             # Dynamic WordPress pages
│   ├── _app.tsx               # Next.js app wrapper
│   ├── _document.tsx          # Custom document structure
│   ├── 404.tsx                # Custom 404 page
│   ├── about.tsx              # About page
│   ├── bag.tsx                # Shopping cart page
│   ├── index.tsx              # Homepage
│   ├── login.tsx              # User authentication
│   ├── made-to-order.tsx      # Custom order page
│   ├── register.tsx           # User registration
│   ├── reset-password.tsx     # Password reset
│   ├── stockists.tsx          # Store locator
│   └── wishlist.tsx           # User wishlist
│
├── src/                       # Main application source code
│   ├── components/            # Reusable React components
│   │   ├── icons/             # SVG icons and graphics
│   │   │   ├── payments/      # Payment method icons
│   │   │   ├── svgs/          # General SVG assets
│   │   │   └── *.js           # Icon components
│   │   │
│   │   ├── layout/            # Layout components
│   │   │   ├── footer/        # Footer components
│   │   │   ├── header/        # Header/navigation components
│   │   │   ├── AdviceDrawer.tsx
│   │   │   ├── CookieDrawer.tsx
│   │   │   ├── CookieModal.tsx
│   │   │   ├── GoogleAnalytics.tsx
│   │   │   ├── index.tsx      # Main layout wrapper
│   │   │   └── private.tsx    # Private area layout
│   │   │
│   │   ├── pages/             # Page-specific components
│   │   │   ├── account/       # Account management UI
│   │   │   ├── bag/           # Shopping cart UI
│   │   │   ├── checkout/      # Checkout process UI
│   │   │   ├── collection/    # Collection display UI
│   │   │   ├── customer-service/ # Support UI
│   │   │   ├── home/          # Homepage components
│   │   │   ├── legal-area/    # Legal pages UI
│   │   │   ├── login/         # Authentication UI
│   │   │   ├── product/       # Product display UI
│   │   │   ├── register/      # Registration UI
│   │   │   ├── reset-password/ # Password reset UI
│   │   │   ├── shop/          # Shop/catalog UI
│   │   │   └── wishlist/      # Wishlist UI
│   │   │
│   │   ├── paypal/            # Payment integration
│   │   │   ├── ApplePayButton.tsx
│   │   │   ├── GooglePayButton.tsx
│   │   │   ├── PaymentErrorDialog.tsx
│   │   │   ├── PaymentMethods.tsx
│   │   │   ├── PayPalCheckoutProvider.tsx
│   │   │   ├── PayPalProvider.tsx
│   │   │   └── usePayPalFormProvider.tsx
│   │   │
│   │   └── *.tsx              # Shared UI components
│   │       ├── Button.tsx
│   │       ├── Carousel.tsx
│   │       ├── CartItem.tsx
│   │       ├── Checkbox.tsx
│   │       ├── Container.tsx
│   │       ├── Dialog.tsx
│   │       ├── Link.tsx
│   │       ├── Loader.tsx
│   │       ├── Loading.tsx
│   │       ├── Logo.tsx
│   │       ├── ModalGallery.tsx
│   │       ├── ModalImage.tsx
│   │       ├── MultiCarousel.tsx
│   │       ├── NavButton.tsx
│   │       ├── PrivateProductGrid.tsx
│   │       ├── RichText.tsx
│   │       ├── RightDrawer.tsx
│   │       ├── RouteGuard.tsx
│   │       ├── SplitLayout.tsx
│   │       ├── VimeoPlayer.tsx
│   │       └── WpBlock.tsx
│   │
│   ├── redux/                 # State management
│   │   ├── authSlice.ts       # Authentication state
│   │   ├── cartSlice.ts       # Shopping cart state
│   │   ├── customerSlice.ts   # Customer data state
│   │   ├── headerSlice.ts     # Header/UI state
│   │   ├── store.ts           # Redux store configuration
│   │   └── wishlistSlice.ts   # Wishlist state
│   │
│   ├── styles/                # Styling configuration
│   │   ├── createEmotionCache.ts # Emotion CSS-in-JS setup
│   │   └── theme.ts           # Material-UI theme
│   │
│   └── utils/                 # Utility functions
│       ├── apple-pay-session.ts # Apple Pay integration
│       ├── auth.ts            # Authentication helpers
│       ├── endpoints.ts       # API endpoint definitions
│       ├── helpers.ts         # General utility functions
│       ├── layout.ts          # Layout utility functions
│       ├── products.ts        # Product data helpers
│       ├── shop.ts            # Shop/catalog helpers
│       ├── useLayoutHook.ts   # Layout React hooks
│       └── useScrollRestoration.ts # Scroll behavior
│
├── public/                    # Static assets
│   ├── .well-known/          # Domain verification files
│   ├── images/               # Image assets
│   ├── loaders/              # Loading animations
│   ├── favicon.ico           # Site favicon
│   └── vercel.svg            # Vercel logo
│
├── .env                      # Environment variables
├── .dockerignore             # Docker ignore rules
├── .gitignore                # Git ignore rules
├── localhost.pem             # SSL certificate for local HTTPS
├── localhost-key.pem         # SSL private key
├── next.config.js            # Next.js configuration
├── next-env.d.ts             # Next.js TypeScript declarations
├── package.json              # Dependencies and scripts
├── postcss.config.js         # PostCSS configuration
├── README.md                 # Project documentation
├── server.js                 # Custom HTTPS server
├── tailwind.config.js        # Tailwind CSS configuration
└── tsconfig.json             # TypeScript configuration
```

## Key Architecture Patterns

### 1. **Hybrid Rendering Strategy**
- Static Site Generation (SSG) for product pages and content
- Server-Side Rendering (SSR) for dynamic user content
- Incremental Static Regeneration (ISR) for content updates

### 2. **State Management**
- Redux Toolkit for global state (cart, auth, wishlist)
- React Query for server state and caching
- Local component state for UI interactions

### 3. **API Integration**
- WooCommerce REST API for e-commerce operations
- WordPress REST API for content management
- Custom Next.js API routes for business logic

### 4. **Payment Processing**
- PayPal SDK integration
- Apple Pay support
- Google Pay integration
- Secure checkout flow

### 5. **Content Management**
- WordPress as headless CMS
- Dynamic page routing
- SEO optimization with Yoast

### 6. **Styling Architecture**
- Tailwind CSS for utility-first styling
- Material-UI for complex components
- Emotion for CSS-in-JS
- Responsive design patterns

## Development Workflow

### Scripts
- `npm run dev` - Development server with debugging
- `npm run https` - HTTPS development server
- `npm run build` - Production build
- `npm run start` - Production server
- `npm run svg` - Generate SVG components

### Environment Setup
- Node.js with SSL certificates for local HTTPS
- Environment variables for API keys and endpoints
- Docker support for containerized deployment

## Security Features
- HTTPS enforcement
- Environment variable protection
- Input sanitization
- Secure payment processing
- Authentication guards

This structure supports a scalable, maintainable e-commerce platform with modern development practices and comprehensive feature coverage.