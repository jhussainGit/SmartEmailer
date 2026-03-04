# Smart Emailer Pro - Free AI Email Writing Platform

## Overview
Smart Emailer Pro is a free, web-based AI-powered email generation platform designed to help users create professional, academic, and business emails across 40+ writing styles. It leverages OpenAI's GPT-5 model to generate contextually appropriate emails based on user inputs including style preferences, recipient information, LinkedIn profiles, job descriptions, and custom context. The platform supports multi-language email generation, offers robust draft management for authenticated users, and includes a Gmail-integrated contact form. Its primary purpose is to provide a comprehensive, free tool for efficient and high-quality email composition, aiming for broad market adoption through its free-to-use model and SEO-optimized content.

**Ownership**: Smart Emailer Pro is a digital asset owned by Indus Bridge Ventures Inc. (801 Route 1 #1017, Iselin, NJ 08831, United States).

**Support**: info@indus-bridge.com

**Current Status**: Beta Release - Users are encouraged to provide feedback via the contact form.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework & Build System**: React 18 with TypeScript, Vite for fast development and optimized builds, Wouter for routing.
- **Design System**: Tailwind CSS for styling, Shadcn/ui (Radix UI primitives) for accessible components, custom theme with light/dark mode. Design principles emphasize clarity and progressive disclosure.
- **State Management**: TanStack Query for server state management, local component state with `useState`. No global state management library is used.
- **Language Selection**: Dual composer-level selectors for Input Language (user context) and Output Language (generated email), auto-syncing, defaulting to English. Supports 20+ output languages.

### Backend Architecture
- **Server Framework**: Express.js with TypeScript, following a RESTful API design.
- **Authentication & Session Management**: Replit Auth (OpenID Connect) via Passport.js, PostgreSQL-backed session store with secure cookies.
- **API Structure**: Dedicated endpoints for authentication, draft management, email history, AI email generation, and contact form submissions. Protected routes require authentication.
- **AI Integration**: Uses OpenAI's GPT-5 model via Replit AI Integrations for email generation, supporting 31 style templates. Prompts are context-aware, incorporating LinkedIn profiles, job descriptions, and specialized recruiter outreach scenarios.
- **Page Routes**: Includes landing, composer, drafts, FAQ, contact, privacy policy, and terms of service pages.

### Data Storage
- **Database**: PostgreSQL via Neon serverless driver, utilizing Drizzle ORM for type-safe queries and schema management.
- **Schema Design**: Tables for `users` (Replit Auth profiles), `email_drafts` (user-saved drafts), `email_history` (auto-saved generation history), `composer_usage` (usage analytics tracking), and `sessions`.
- **Migration Strategy**: Drizzle Kit for schema migrations.

## External Dependencies

- **Replit Auth**: For user authentication and identity management.
- **Replit AI Integrations**: Provides managed access to OpenAI API, specifically GPT-5.
- **Neon Database**: Serverless PostgreSQL hosting for all application data.
- **Google Gmail API**: Integrated for sending emails via Replit Connectors (for the contact form).
- **Major NPM Libraries**: React, Radix UI, Tailwind CSS, Express, Passport, Drizzle ORM, OpenAI SDK, Zod.
- **API Integrations**: Gmail API, LinkedIn profile data extraction (URL-based), job description parsing (URL-based).
- **Design Assets**: Google Fonts (Inter, DM Sans, Geist Mono, etc.), Lucide icons.

## Recent Updates

### Usage Analytics Tracking (November 11, 2025)
- **Added**: New `composer_usage` database table to track all email generation usage
- **Tracked Data**:
  - User ID (if authenticated) or session ID (for anonymous users)
  - Email style used
  - Input and output languages
  - Whether attachment was included
  - Authentication status
  - Generation success/failure
  - User agent for device analytics
  - Timestamp
- **Purpose**: Enables tracking of application usage patterns, popular styles, and user engagement metrics

### Internal Business Communication Styles (November 11, 2025)
- **Added**: 9 new email styles specifically for internal business communication
- **New Styles**:
  - **Internal Announcement** - Company-wide updates and news
  - **Promotion Announcement** - Announce employee promotions or new hires
  - **Policy Update** - Communicate new or updated policies (supports attachment uploads)
  - **Team Update** - Department or team-specific communications
  - **Internal Memo** - Official company memorandums
  - **Employee Recognition** - Celebrate achievements and milestones
  - **Meeting Minutes** - Summarize meetings and action items
  - **Project Update** - Progress updates on ongoing projects
  - **Urgent Internal Alert** - Time-sensitive company communications
- **Purpose**: Enables businesses to efficiently generate professional internal emails for announcements, policy changes, employee recognition, team updates, and urgent communications
- **Total Writing Styles**: Now 40+ writing styles covering external and internal business needs

### New Writing Style - Recruiter Outreach to Candidate (October 30, 2025)
- **Added**: New dedicated "Recruiter Outreach to Candidate" writing style with comprehensive recruitment features
- **Positioned**: 3rd option from the top for easy discovery
- **Message Types**: Initial outreach and 2nd follow-up message options
- **Outreach Styles**: 8 flexible approach options:
  - Professional & Direct
  - Warm & Friendly
  - Executive Brief
  - Consultative Approach
  - Opportunity-Focused
  - Industry Insider
  - Relationship Building
  - Urgent & Confidential
- **Recruiter-Specific Inputs**:
  - Job description URL
  - Candidate LinkedIn profile integration
  - Agency website reference
  - Client company homepage
  - Resume/JD file upload support (Word/PDF, up to 5MB)
- **AI Prompt Engineering**: Specialized prompts for each outreach type and style combination, optimized for recruiter-candidate communication
- **Progressive Disclosure**: Recruiter-specific fields only appear when this style is selected, keeping the UI clean for other email types

### Security Enhancement - Bot Protection (October 28, 2025)
- Added WordPress bot blocking middleware to prevent malicious scanner probes
- Blocks common WordPress attack paths (`/wp-admin`, `/wp-login`, `/xmlrpc.php`, etc.)
- Returns 403 Forbidden to blocked requests
- Logs all blocked attempts to console for monitoring
- Protects against automated bot scans targeting non-WordPress sites

### Advanced Prompt Engineering Overhaul (March 4, 2026)
- **Overhauled**: Complete rewrite of `server/emailGenerator.ts` with modular prompt engineering architecture
- **Added**: Communication framework selection — AIDA (sales), PAS (marketing), STAR (cover letters), SPIN (proposals), NVC (complaints), and 8 more frameworks auto-selected based on email style
- **Added**: Audience intelligence analysis — automatically extracts signals from LinkedIn URLs, job descriptions, agency websites, and company homepages to personalize emails
- **Added**: Rhetorical strategy layer — applies persuasion psychology for sales/marketing styles, clarity-first approach for internal communication, authenticity for relational emails, precision for formal styles
- **Added**: Cultural intelligence for 10+ languages (Japanese, Chinese, Arabic, Hindi, Spanish, French, German, Urdu, Farsi, and more) — language-specific email conventions, honorifics, greeting/closing formulas
- **Added**: Deep style expertise templates for 25+ individual email styles with specific guidance on structure, tone, vocabulary, and common pitfalls
- **Added**: Quality assurance directives — 7-point self-evaluation (opening test, specificity test, tone consistency, readability, CTA clarity, authenticity check, trim test)
- **Added**: Enhanced attachment intelligence — context-aware guidance for each attachment type (resumes, email threads, invoices, policies, proposals)
- **Added**: Length-aware strategy — different rhetorical approaches for short (ruthless brevity) vs long (structured architecture) emails
- **Architecture**: Modular function composition — each prompt component (framework, audience, rhetoric, culture, expertise, quality) is an independent function that composes into the final prompt

### Korean Business Communication Features (March 3, 2026)
- **Added**: 5 new Korean-specific email styles:
  - **Korean Business Formal (상사에게)** - Formal communication to superiors with proper hierarchical etiquette
  - **Korean Business Peer (동료에게)** - Peer-to-peer professional Korean communication
  - **Korean Self-Introduction Letter (자기소개서)** - Korean job application format with resume upload support
  - **Korean Academic (교수님께)** - Academic email to professors with proper honorifics
  - **Korean Seasonal Greeting (인사메일)** - Business seasonal greetings (설날, 추석, etc.)
- **Added**: Korean honorific level selector (격식체, 해요체, 반말) - appears only when using Korean styles with Korean output language
- **Added**: Dual-language output option - generates emails in two languages side by side (available for all language combinations, not just Korean)
- **Added**: Culturally-aware prompt engineering for Korean email norms, self-introduction structure, and seasonal greeting conventions
- **Added**: "Latest Updates" section on landing page highlighting Korean features
- **Architecture Note**: Korean features are additive and don't change the core email generation flow. The pattern is extensible for future localization (Japanese, Arabic, etc.)
- **Total Writing Styles**: Now 45+ writing styles

### SEO Optimization Overhaul (February 28, 2026)
- **Fixed**: All canonical URLs and OG URLs updated from `smart-emailer-pro.replit.app` to `smartemailer.pro` (custom domain)
- **Added**: `robots.txt` with proper Allow/Disallow directives and sitemap reference
- **Added**: Dynamic `sitemap.xml` endpoint with all 17 pages (main pages + 10 blog posts) with priorities and change frequencies
- **Added**: Twitter Card meta tags (`twitter:card`, `twitter:title`, `twitter:description`) on all pages
- **Added**: `og:site_name` and `meta robots` tags in base HTML template
- **Updated**: All references from "30+ styles" to "40+ styles" to match actual feature count
- **Updated**: Structured data (JSON-LD) enriched with `operatingSystem`, `browserRequirements`, recruiter outreach, and internal communication features
- **Optimized**: Google Fonts bundle reduced from 25+ fonts to 3 actually used fonts (Inter, DM Sans, Poppins), significantly improving page load speed
- **Fixed**: Trailing slashes removed from canonical URLs for consistency
- **Fixed**: Blog post structured data references corrected to use actual favicon asset path
- **Added**: Google Analytics tag (G-9F4C31H390) at top of `<head>` for visitor tracking

### Ownership & Contact Information Update (October 25, 2025)
- Added ownership statement across the site: Smart Emailer Pro is a digital asset owned by Indus Bridge Ventures Inc.
- Updated support email from support@proemail.ai to info@indus-bridge.com
- Updated footer with ownership statement and copyright to Indus Bridge Ventures Inc.
- Contact form now sends inquiries to info@indus-bridge.com
- Structured data on landing page includes Indus Bridge Ventures Inc. as creator

### UI Improvements & Tips Enhancement (October 25, 2025)
- **Fixed**: Email previewer now properly adjusts contrast for both light and dark modes
- Removed outdated dark mode tip (contrast issue resolved)
- Added helpful tips on Landing page and Composer encouraging users to:
  - Provide more context (LinkedIn profiles, job descriptions, key points) for better results
  - Use file attachments for context-aware generation (resumes, documents, email threads)
  - Utilize multi-language support for international correspondence

### Beta Release Messaging (October 25, 2025)
- Added prominent beta release notices on Landing and Composer pages
- Beta banners include direct feedback CTAs linking to the contact form
- Encourages users to report issues and provide feedback during beta phase

### File Attachment Fix (October 25, 2025)
- **Fixed**: Increased Express body size limit from 100kb to 10mb to support file attachments
- File attachments now successfully transmit to the AI engine as context for email generation
- Enhanced backend logging for email generation requests with attachment details
- Improved frontend error handling with detailed toast notifications
- Added client-side and server-side logging for debugging attachment issues
- Better error messages surfaced to users when generation fails