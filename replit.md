# ProEmail AI - Professional Email Writing Platform

## Overview

ProEmail AI is a fully functional web-based AI-powered email generation platform that helps users create professional, academic, and business emails across 30+ writing styles. The application uses OpenAI's GPT-5 model to generate contextually appropriate emails based on user inputs including style preferences, recipient information, LinkedIn profiles, job descriptions, and custom context. Authenticated users can save drafts for later use. The platform includes a Gmail-integrated contact form for user inquiries.

## Current Status (October 23, 2025)

All core features are implemented and tested:
- ✅ Email generation with 30+ styles using GPT-5
- ✅ Replit Auth authentication with admin support
- ✅ User-specific draft saving and management
- ✅ Gmail-integrated contact form
- ✅ Comprehensive FAQ page
- ✅ Responsive design with modern UI
- ✅ Security: Draft deletion with ownership verification
- ✅ End-to-end tested and working

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and dev server for fast HMR and optimized production builds
- Wouter for lightweight client-side routing (alternative to React Router)
- TanStack Query (React Query) for server state management and data fetching

**Design System**
- Tailwind CSS for utility-first styling with custom design tokens
- Shadcn/ui component library (Radix UI primitives) for accessible, customizable UI components
- Custom theme system with light/dark mode support via CSS variables
- Design approach follows Linear/Notion hybrid principles: clarity, progressive disclosure, professional credibility

**Component Structure**
- Page components in `client/src/pages/` for route-level views
- Reusable UI components in `client/src/components/`
- Atomic design with shadcn/ui primitives in `client/src/components/ui/`
- Path aliases (@, @shared, @assets) for clean imports

**State Management Pattern**
- React Query for async server state with aggressive caching (staleTime: Infinity)
- Local component state with useState for UI-only state
- Custom hooks (useAuth, use-toast) for cross-cutting concerns
- No global state management library (Redux/Zustand) - deliberately kept simple

### Backend Architecture

**Server Framework**
- Express.js with TypeScript for the API server
- RESTful API design with conventional HTTP methods
- Middleware pipeline: JSON parsing, request logging, raw body preservation for webhooks

**Authentication & Session Management**
- Replit Auth (OpenID Connect) for user authentication
- Passport.js with OpenID Client strategy for OAuth flow
- PostgreSQL-backed session store using connect-pg-simple
- Session cookies with 1-week TTL, HTTP-only and secure flags
- User data stored in `users` table with Replit user ID as primary key

**API Structure**
- `/api/auth/*` - Authentication endpoints (user info, login callback)
- `/api/drafts` - CRUD operations for saved email drafts
- `/api/generate-email` - AI email generation endpoint
- `/api/contact` - Contact form submission
- Protected routes use `isAuthenticated` middleware

**AI Integration**
- OpenAI API integration via Replit AI Integrations service (automatic secret management)
- Uses GPT-5 model with reasoning capabilities (released August 7, 2025)
- max_completion_tokens set to 5000 to accommodate GPT-5's reasoning + output tokens
- Email generation based on 30+ predefined style templates across 4 categories
- Context-aware prompts with LinkedIn profile integration, job descriptions, sample emails
- Generation time: 20-40 seconds due to reasoning process

### Data Storage

**Database**
- PostgreSQL via Neon serverless driver (@neondatabase/serverless)
- Drizzle ORM for type-safe database queries and schema management
- WebSocket-based connection pooling for serverless compatibility

**Schema Design**
- `users` table: Replit Auth user profiles (email, name, profile image, admin flag)
- `email_drafts` table: User-saved email drafts with metadata (style, type, form data as JSONB)
- `sessions` table: Express session storage for authentication

**Migration Strategy**
- Drizzle Kit for schema migrations in `migrations/` directory
- Schema defined in `shared/schema.ts` for type sharing between client/server
- Push-based deployment via `npm run db:push`

### External Dependencies

**Third-Party Services**
- **Replit Auth**: OpenID Connect authentication provider
- **Replit AI Integrations**: Managed OpenAI API access (GPT-5)
- **Neon Database**: Serverless PostgreSQL hosting
- **Google Gmail API**: Email sending integration (via Replit Connectors)

**Major NPM Dependencies**
- **UI Framework**: React, Radix UI components, Tailwind CSS
- **Backend**: Express, Passport, Drizzle ORM
- **AI**: OpenAI SDK
- **Validation**: Zod with Drizzle Zod integration
- **Utilities**: date-fns, clsx, class-variance-authority

**Development Tools**
- TypeScript for type safety across full stack
- ESBuild for server-side bundling
- Vite plugins: runtime error overlay, Replit dev banner, cartographer

**API Integrations**
- Gmail API for sending generated emails (uses Replit Connectors for OAuth)
- LinkedIn profile data extraction (URL-based context)
- Job description parsing (URL-based context)

**Design Assets**
- Google Fonts: Inter (primary), DM Sans, Geist Mono, Architects Daughter, Fira Code
- Custom favicon and brand assets
- Lucide icons library for consistent iconography