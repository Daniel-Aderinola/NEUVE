# NEUVE — Contemporary Fashion E-Commerce

A full-stack e-commerce website with a dark, editorial fashion aesthetic. Built with Next.js, Express.js, MongoDB, and Stripe.

![NEUVE](https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&q=80)

## Tech Stack

### Frontend
- **Next.js 14** (App Router, SSR, SEO)
- **TypeScript**
- **Tailwind CSS** (custom luxury theme)
- **Framer Motion** (animations)
- **Lucide React** (icons)

### Backend
- **Node.js** + **Express.js**
- **TypeScript**
- **MongoDB** + **Mongoose**
- **JWT** authentication
- **Stripe** payment integration

## Features

- ✅ Modern, minimal fashion aesthetic (dark theme)
- ✅ Full product catalog with filtering/sorting
- ✅ Shopping cart & secure checkout
- ✅ Stripe payment integration
- ✅ User authentication (JWT + cookies)
- ✅ User dashboard (orders, profile)
- ✅ Admin dashboard (products, orders, users)
- ✅ Fully responsive (mobile-first)
- ✅ Smooth animations (Framer Motion)
- ✅ SEO optimized (Next.js SSR)
- ✅ Role-based access control

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Stripe account (for payments)

### 1. Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment

**Backend** (`backend/.env`):
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/neuve_ecommerce
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRE=7d
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
CLIENT_URL=http://localhost:3000
```

**Frontend** (`frontend/.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_KEY=pk_test_...
```

### 3. Seed Database

```bash
cd backend
npm run seed
```

This creates demo data including:
- **Admin**: admin@neuve.com / admin123
- **User**: user@neuve.com / user123
- 6 categories + 12 products

### 4. Run Development Servers

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## Pages

| Page | Path | Description |
|------|------|-------------|
| Home | `/` | Hero, collections, featured products, editorial |
| Shop | `/shop` | Product grid with filters & sorting |
| Product | `/product/[slug]` | Product details, image gallery, add to cart |
| Cart | `/cart` | Shopping bag management |
| Checkout | `/checkout` | Shipping form + Stripe payment |
| Login | `/login` | Sign in |
| Register | `/register` | Create account |
| Dashboard | `/dashboard` | User orders & profile |
| Admin | `/admin` | Product/order/user management |
| About | `/about` | Brand story & values |

## API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/profile`
- `PUT /api/auth/profile`

### Products
- `GET /api/products`
- `GET /api/products/featured`
- `GET /api/products/slug/:slug`
- `GET /api/products/:id`
- `GET /api/products/:id/related`

### Cart
- `GET /api/cart`
- `POST /api/cart/add`
- `PUT /api/cart/item/:itemId`
- `DELETE /api/cart/item/:itemId`

### Orders
- `POST /api/orders`
- `POST /api/orders/checkout-session`
- `GET /api/orders/my-orders`
- `GET /api/orders/:id`

### Admin
- `GET /api/auth/users` (admin)
- `POST /api/products` (admin)
- `PUT /api/products/:id` (admin)
- `DELETE /api/products/:id` (admin)
- `GET /api/orders` (admin)
- `PUT /api/orders/:id/status` (admin)
- `GET /api/orders/stats` (admin)

## License

MIT
