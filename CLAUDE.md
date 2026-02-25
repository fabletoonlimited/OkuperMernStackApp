# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Okuper is a Nigerian real estate platform connecting landlords and tenants directly. It's a **single Next.js 15 full-stack application** (not a monorepo) where frontend pages and backend API routes coexist under `src/app/`.

## Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm start        # Start production server
npm run lint     # ESLint
```

No test framework is configured.

## Architecture

### Backend (API Routes)

All backend logic lives in `src/app/api/` as Next.js App Router route handlers (`route.js` files):
- **Controllers**: `src/app/api/controllers/` — business logic separated from route handlers
- **Models**: `src/app/api/models/` — Mongoose schemas (User, Landlord, Tenant, Property, Message, Conversation, Otp, KYC models, etc.)
- **Middlewares**: `src/app/api/middlewares/` — auth helpers
- **Shared utilities**: `src/app/lib/` — DB connection, Cloudinary config, OTP service, referral logic, file upload helpers

Key API endpoints: `/api/landlord`, `/api/tenant`, `/api/property`, `/api/loginLandlord`, `/api/loginTenant`, `/api/otp`, `/api/auth/me`, `/api/auth/logout`, `/api/profile`, `/api/message`

### Frontend

- Pages: `src/app/[routeName]/page.js` (App Router file-system routing)
- Components: `src/components/[name]/index.js` with co-located SCSS modules
- Path alias: `@/*` maps to `./src/*` (jsconfig.json)
- Most page components are client components (`"use client"`)
- Root layout (`src/app/layout.js`) conditionally hides Nav/Footer on dashboard and specialized pages

### Database

MongoDB Atlas via Mongoose v8. Connection is a cached singleton in `src/app/lib/mongoose.js` using `global.mongoose`. All models use the `mongoose.models.X || mongoose.model("X", schema)` pattern to prevent hot-reload re-registration.

### Authentication

JWT-based with httpOnly cookies (cookie name: `token`):
- `jose` library in Next.js edge middleware (`src/app/middleware.js`) for route protection
- `jsonwebtoken` library in API route handlers (Node.js runtime)
- Protected API routes specify `export const runtime = "nodejs"`
- Passwords hashed with bcryptjs (salt rounds: 10) via Mongoose pre-save hooks
- OTP verification via SHA-256 hashed codes with 5-minute TTL

### File Uploads

Images uploaded to Cloudinary (via `streamUpload` utility or `CldUploadWidget` on frontend), URLs stored in MongoDB. `next.config.mjs` whitelists `res.cloudinary.com` for Next.js Image.

### Email

Resend API — used for OTP delivery and welcome emails.

## Key Conventions

- API routes return `NextResponse.json()` responses
- Styling: mix of Tailwind CSS v4 and SCSS modules per component
- Two user flows: Landlord and Tenant, each with separate signup/login/dashboard paths
- Messaging is tenant↔landlord only, scoped to specific properties

## Known Quirks

- `src/app/api/.env` and `src/app/api/package.json` are legacy files from an old Express server — the active env config is `.env.local` at the root
- `VITE_BACKEND_URL` env var uses Vite prefix but this is a Next.js project
- Directory `src/app/api/landordKyc.js/` has a typo and `.js` suffix in the directory name
- `NODE_ENV="production"` is set in `.env.local` even for local dev, which enables secure cookies
- Socket.IO is installed but not yet integrated
