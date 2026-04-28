# CS4B Web - Architecture Documentation

## Project Overview

**CS4B** is a corporate website for a Peruvian IT consulting company built with Next.js 15, TypeScript, Tailwind CSS, Framer Motion, PostgreSQL, and Prisma.

- **Live**: https://cs4b.com.pe
- **Tech Stack**: Next.js 15, TypeScript, Tailwind CSS, Framer Motion, PostgreSQL, Prisma
- **Repository**: Private

---

## Tech Stack

| Layer | Technology |
|------|-------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + Framer Motion |
| Database | PostgreSQL |
| ORM | Prisma 5.22 |
| Validation | Zod |
| Testing | Vitest + React Testing Library |

---

## Project Structure

```
CS4B-WEB/
├── src/
│   ├── app/                 # Next.js App Router (pages & routes)
│   │   ├── api/           # API routes
│   │   ├── admin/        # Admin dashboard pages
│   │   ├── blog/        # Blog pages
│   │   ├── servicios/   # Services pages
│   │   └── *.tsx       # Pages: home, contacto, login, nosotros
│   │
│   ├── components/       # Reusable components
│   │   ├── ui/         # Base UI library (Button, Input, Card, etc.)
│   │   ├── admin/      # Admin-specific components (AdminNavbar)
│   │   └── public/    # Public-facing components (Hero, Footer, etc.)
│   │
│   ├── composables/    # React Context + Hooks (useAuth, useCart)
│   ├── services/      # API client (serviciosApi, postsApi, contactosApi)
│   ├── constants/    # Global constants (APP, STORAGE_KEYS, API_ENDPOINTS)
│   └── lib/         # Utilities (prisma, auth, validations, utils)
│
├── tests/             # Test files (outside src/)
├── prisma/
│   └── schema.prisma # Database models
├── vitest.config.ts   # Test configuration
└── tailwind.config.ts # Design tokens
```

### Structure Principles

| Folder | Purpose | Rule |
|--------|---------|------|
| `app/` | **Routes** - defines URLs | Each subfolder = URL path |
| `components/ui/` | **Reusable** - used anywhere | Generic, no business logic |
| `components/admin/` | **Admin** - dashboard only | AdminNamespace |
| `components/public/` | **Public** - pages only | PageNamespace |
| `composables/` | **State** - React patterns | Context + Hook |
| `services/` | **API** - server calls | apiFetch + typed clients |
| `constants/` | **Config** - magic values | Single source of truth |
| `lib/` | **Utils** - pure functions | No side effects |

---

## Database Schema

### Models

| Model | Description |
|-------|-------------|
| **Usuario** | Admin users for CMS |
| **Categoria** | Blog categories |
| **Post** | Blog posts |
| **Categoria_servicio** | Service categories |
| **Servicio** | Consulting services |
| **Contacto** | Contact form submissions |
| **Configuracion** | Site settings (key-value) |

### Relationships

```
Categoria_servicio (1) ─── (N) Servicio
Categoria (1) ─── (N) Post
Usuario (1) ─── (N) Post (autor)
```

---

## API Routes

### Public Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/servicios` | GET | List services |
| `/api/servicios/[slug]` | GET | Get service by slug |
| `/api/categorias-servicios` | GET | List service categories |
| `/api/posts` | GET | List blog posts |
| `/api/posts/[slug]` | GET | Get post by slug |
| `/api/contactos` | POST | Submit contact form |

### Protected Routes (Admin)

| Endpoint | Method | Authentication |
|----------|--------|----------------|
| `/api/auth` | POST | Login |
| `/api/auth/me` | GET | Get current user |
| `/api/servicios` | POST | Create service |
| `/api/servicios/[id]` | PUT/DELETE | Update/Delete service |
| `/api/categorias-servicios` | POST | Create category |
| `/api/posts` | POST | Create post |
| `/api/posts/[slug]` | PUT/DELETE | Update/Delete post |
| `/api/contactos/[id]` | PUT | Mark as read/responded |

---

## Features

### Shopping Cart for Consultations
- Add services to cart from services page
- Cart persists in localStorage
- Cart items reflected in contact form
- Cart badge in navbar with animation

### Admin Dashboard
- Manage services, service categories, posts, blog categories
- View and manage contact form submissions
- JWT-based authentication

### Blog
- Blog posts with categories
- SEO metadata (title, description)
- View count tracking

### Services
- Service catalog by category
- Service detail pages

---

## UI Component Library

Located in `src/components/ui/`:

| Component | Props | Variants |
|-----------|-------|----------|
| **Button** | variant, size, loading | primary, secondary, outline, ghost, danger |
| **Input** | label, error, hint | - |
| **TextArea** | label, error, hint | - |
| **Select** | label, error, hint, options | - |
| **Card** | variant, padding, hover | default, bordered, elevated, ghost |
| **Badge** | variant, size | default, primary, secondary, success, warning, danger, outline |

---

## Design Tokens

Defined in `tailwind.config.ts`:

### Colors
- Primary: `#0B1F33` (dark blue)
- Secondary: `#3FA9F5` (cyan)
- Accent: `#B6E356` (lime green)

### Animations
- fadeIn, fadeInUp, float

---

## Testing

### Test Files
Located in `tests/` (root folder):

| File | Description |
|------|-------------|
| `utils.test.ts` | Utility functions |
| `validations.test.ts` | Zod schemas |
| `auth.test.ts` | Authentication utilities |
| `rate-limit.test.ts` | Rate limiting |
| `Button.test.tsx` | Button component |
| `Input.test.tsx` | Input component |

### Commands
```bash
npm run test        # Watch mode
npm run test:run  # Single run
npm run test:coverage # With coverage
```

### Coverage: 95%

---

## Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# JWT
JWT_SECRET=your-secret-key

# Next.js
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Copy `.env.example` to `.env` and fill in values.

---

## Development Commands

```bash
npm run dev        # Start dev server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Lint code
npm run test:run  # Run tests
```

---

## Known Issues / Technical Debt

1. **Toast Component**: Removed due to React context naming conflicts in Next.js
2. **Categoria model**: Missing `visible` field (unlike Categoria_servicio)
3. **Tests**: UI component tests could be expanded with more interaction tests

---

## History

### Recent Changes

| Date | Change |
|------|--------|
| 2026-04 | Refactored project structure (composables, services, constants) |
| 2026-04 | Organized components by domain (admin, public, ui) |
| 2026-04 | Moved tests outside src/ |
| 2026-04 | Added Zod validation to all API routes |
| 2026-04 | Created UI component library |
| 2026-04 | Set up Vitest testing |
| 2026-04 | Shopping cart feature for consultations |
| Earlier | Migrated from postgres.js to Prisma ORM |