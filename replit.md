# Email Helper - Free AI Email Writing Platform

## Overview

Email Helper is a fully functional web-based AI-powered email generation platform that helps users create professional, academic, and business emails across 30+ writing styles - completely FREE. The application uses OpenAI's GPT-5 model to generate contextually appropriate emails based on user inputs including style preferences, recipient information, LinkedIn profiles, job descriptions, and custom context. Authenticated users can save drafts for later use. The platform includes a Gmail-integrated contact form for user inquiries.

## Current Status (October 24, 2025)

All core features are implemented and tested:
- ✅ Email generation with 30+ styles using GPT-5
- ✅ Multi-language support: 20+ languages for generated emails
- ✅ Dual language selectors: Input Language and Output Language with auto-sync
- ✅ Both language selectors default to English
- ✅ Email examples showcase: 5 professional examples on landing page
- ✅ Replit Auth authentication with admin support
- ✅ User-specific draft saving and management with enhanced features:
  - Individual draft deletion
  - Copy draft to clipboard
  - Delete all drafts with confirmation dialog
  - Export all drafts as formatted .txt file
- ✅ Email history tracking with auto-save for authenticated users
- ✅ Word count and reading time display for generated emails
- ✅ Regenerate functionality for creating email variations
- ✅ Generation time display: "Expected time: 20-40 seconds" shown on generate button
- ✅ Gmail-integrated contact form
- ✅ Comprehensive FAQ page with language clarifications
- ✅ Privacy Policy and Terms of Service (GDPR/CCPA compliant, no email addresses)
- ✅ FREE messaging on landing page with "100% Free" badge
- ✅ Dark mode recommendation on landing page
- ✅ Responsive design with modern UI
- ✅ Security: Draft and history deletion with ownership verification
- ✅ Clean production code (removed debug logging)
- ✅ Theme-aware 404 page
- ✅ End-to-end tested and working

Recent Improvements (October 24, 2025 - Session 4):
- **Enhanced Draft Management**: Added three powerful draft management features:
  - Copy to Clipboard: One-click copy button on each draft card
  - Delete All: Bulk delete all drafts with confirmation dialog (AlertDialog)
  - Export All as TXT: Download all drafts as a formatted text file with metadata
- **Backend Enhancement**: New DELETE /api/drafts endpoint for bulk deletion
- **Storage Layer**: Added deleteAllDrafts method to storage interface
- **User Experience**: Toast notifications for all draft actions (copy, export, delete)
- **Testing**: All draft features verified with comprehensive end-to-end Playwright tests

Previous Session Improvements (October 24, 2025 - Session 3):
- **Rebranding**: Complete rebrand from "ProEmail AI" to "Email Helper" across entire platform to avoid implying paid service
- **Dual Language Selectors**: Moved language selection from site-level to composer-level with TWO selectors:
  - Input Language: Language of context/inputs provided by user
  - Output Language: Language for generated email
  - Auto-sync: When Input Language changes, Output Language automatically syncs to match
  - Both default to English
- **Language Integration**: outputLanguage parameter now properly influences GPT-5 email generation
- **FREE Messaging**: Landing page prominently displays "100% Free • AI-Powered" badge
- **Dark Mode Tip**: Landing page includes recommendation that app works better in dark mode
- **Expected Generation Time**: Generate button displays "(20-40 seconds)" during generation
- **No Public Email Addresses**: Removed ALL publicly visible email addresses to prevent scraper collection
- **Footer Fix**: Fixed DOM nesting error with wouter Link components
- **Testing**: All branding and features verified with comprehensive end-to-end Playwright tests

Previous Session Improvements (October 24, 2025 - Session 2):
- **Language Feature**: Added comprehensive language selector with 20+ major world languages (English, Spanish, French, German, Italian, Portuguese, Chinese, Japanese, Korean, Arabic, Russian, Hindi, Dutch, Polish, Turkish, Swedish, Vietnamese, Thai, Hebrew, Greek)
- **Language Integration**: Language parameter now properly affects GPT-5 email generation - emails are written in the selected language
- **Email Examples**: Added 5 professional email examples to landing page showing different styles (Professional Cover Letter, Networking, Business Proposal, Academic Inquiry, Thank You Note) with complete inputs and outputs
- **Privacy Compliance**: Removed ALL email addresses from the site (Privacy Policy, Terms of Service) and replaced with Contact Form links
- **Contact Information**: Physical address (Indus Bridge Ventures Inc., 801 Route 1 #1017, Iselin, NJ 08831, United States) displayed in footer and legal pages
- **FAQ Updates**: Added clarification that language selector affects only generated email output, not site UI; browser settings control site language
- **Draft Loading Fix**: Fixed draft query to always refetch fresh data with staleTime: 0
- **Testing**: All features verified with end-to-end Playwright tests

Earlier Session Improvements (October 24, 2025 - Session 1):
- Added email history feature: automatically saves all generated emails for authenticated users
- Enhanced email preview with word count and estimated reading time
- Added regenerate button to create variations of the same email
- Implemented Zod validation for all history API endpoints
- Fixed 404 page to use theme tokens for proper light/dark mode support
- Updated login page to accurately reflect available features
- Cleaned up server-side logging for production readiness

## Ownership & Contact

Email Helper is a digital asset owned and operated by **Indus Bridge Ventures Inc.** All legal documents, footer copyright, and platform communications reflect this ownership.

**Contact Information:**
- Physical Address: Indus Bridge Ventures Inc., 801 Route 1 #1017, Iselin, NJ 08831, United States
- Contact Method: Contact Form only (no email addresses displayed on site for privacy)
- Admin Account: jaffer.hussain@gmail.com (password: Immay123$)

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
- Page components in `client/src/pages/` for route-level views:
  - Landing, EmailComposerPage, Drafts, FAQ, Contact
  - PrivacyPolicy, TermsOfService (legal compliance pages)
- Reusable UI components in `client/src/components/`
- Atomic design with shadcn/ui primitives in `client/src/components/ui/`
- Path aliases (@, @shared, @assets) for clean imports

**State Management Pattern**
- React Query for async server state with aggressive caching (staleTime: Infinity)
- Local component state with useState for UI-only state
- Custom hooks (useAuth, use-toast) for cross-cutting concerns
- No global state management library (Redux/Zustand) - deliberately kept simple

**Language Selection**
- Dual language selectors at composer level (not site-wide):
  - Input Language: Language of user's context/inputs
  - Output Language: Desired language for generated email
  - Auto-sync behavior: Input change triggers Output to match
  - Both default to English on load
- 20+ supported languages for email generation

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
- `/api/drafts` - CRUD operations for saved email drafts (protected)
- `/api/history` - Email history tracking (protected, auto-saves on generation)
- `/api/generate-email` - AI email generation endpoint (public, uses outputLanguage parameter)
- `/api/contact` - Contact form submission (public)
- Protected routes use `isAuthenticated` middleware

**Page Routes**
- `/` - Landing page (FREE badge, dark mode tip)
- `/composer` - Email generation interface (dual language selectors)
- `/drafts` - User drafts (requires authentication)
- `/faq` - Frequently Asked Questions
- `/contact` - Contact form
- `/privacy` - Privacy Policy (GDPR/CCPA compliant)
- `/terms` - Terms of Service

**AI Integration**
- OpenAI API integration via Replit AI Integrations service (automatic secret management)
- Uses GPT-5 model with reasoning capabilities (released August 7, 2025)
- max_completion_tokens set to 5000 to accommodate GPT-5's reasoning + output tokens
- Email generation based on 30+ predefined style templates across 4 categories
- Context-aware prompts with LinkedIn profile integration, job descriptions, sample emails
- Language parameter (outputLanguage) properly influences email generation output
- Generation time: 20-40 seconds due to reasoning process (displayed to users)

### Data Storage

**Database**
- PostgreSQL via Neon serverless driver (@neondatabase/serverless)
- Drizzle ORM for type-safe database queries and schema management
- WebSocket-based connection pooling for serverless compatibility

**Schema Design**
- `users` table: Replit Auth user profiles (email, name, profile image, admin flag)
- `email_drafts` table: User-saved email drafts with metadata (style, type, form data as JSONB)
- `email_history` table: Auto-saved email generation history with word count, style, and form data (limit 50 per user)
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
