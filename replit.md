# Smart Emailer Pro - Free AI Email Writing Platform

## Overview
Smart Emailer Pro is a free, web-based AI-powered email generation platform leveraging OpenAI's GPT-5 to create professional, academic, and business emails across 50+ writing styles. It supports multi-language generation, robust draft management for authenticated users, and a Gmail-integrated contact form. The platform aims to be a comprehensive, efficient, and high-quality tool for email composition, focusing on broad market adoption through its free-to-use model and SEO optimization. It is owned by Indus Bridge Ventures Inc.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework & Build System**: React 18 with TypeScript, Vite, Wouter for routing.
- **Design System**: Tailwind CSS, Shadcn/ui (Radix UI primitives), custom theme with light/dark mode, emphasizing clarity and progressive disclosure.
- **State Management**: TanStack Query for server state, local component state with `useState`.
- **Language Selection**: Dual composer-level selectors for Input and Output languages, auto-syncing, supporting 20+ output languages.

### Backend
- **Server Framework**: Express.js with TypeScript, RESTful API.
- **Authentication & Session Management**: Replit Auth (OpenID Connect) via Passport.js, PostgreSQL-backed session store.
- **API Structure**: Dedicated endpoints for authentication, draft management, email history, AI generation, and contact form.
- **AI Integration**: OpenAI's GPT-5 via Replit AI Integrations for email generation, supporting 50+ style templates. Prompts are context-aware, incorporating LinkedIn profiles, job descriptions, and specialized scenarios. Advanced prompt engineering includes communication frameworks (AIDA, PAS, STAR), audience intelligence, rhetorical strategy, cultural intelligence for 10+ languages, and quality assurance directives.
- **Page Routes**: Landing, composer, drafts, FAQ, contact, privacy policy, and terms of service.

### Data Storage
- **Database**: PostgreSQL via Neon serverless driver, Drizzle ORM.
- **Schema Design**: Tables for `users`, `email_drafts`, `email_history`, `composer_usage` (for analytics), and `sessions`.
- **Migration Strategy**: Drizzle Kit.

### UI/UX and Features
- **Email Styles**: 50+ writing styles including internal business communication, recruiter outreach, and culture-specific styles for Korean and Japanese business communications.
- **Specialized Inputs**: Support for job description URLs, LinkedIn profiles, and file attachments (resumes, documents) as context for AI generation.
- **Internationalization**: Korean and Japanese specific email styles with honorific selectors and cultural norms. Dual-language output option.
- **SEO Optimization**: Custom domain (`smartemailer.pro`), `robots.txt`, dynamic `sitemap.xml`, Twitter Card and Open Graph meta tags, structured data (JSON-LD), and Google Analytics integration.
- **Security**: Bot protection middleware to block common WordPress attack paths.
- **User Guidance**: Enhanced tips on the landing page and composer for optimal context provision.

## External Dependencies

- **Replit Auth**: User authentication and identity management.
- **Replit AI Integrations**: Managed access to OpenAI API (GPT-5).
- **Neon Database**: Serverless PostgreSQL hosting.
- **Google Gmail API**: For contact form email sending via Replit Connectors.
- **Major NPM Libraries**: React, Radix UI, Tailwind CSS, Express, Passport, Drizzle ORM, OpenAI SDK, Zod.
- **API Integrations**: Gmail API, LinkedIn profile data extraction, job description parsing.
- **Design Assets**: Google Fonts (Inter, DM Sans, Poppins), Lucide icons.