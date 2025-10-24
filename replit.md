# Smart Emailer Pro - Free AI Email Writing Platform

## Overview
Smart Emailer Pro is a free, web-based AI-powered email generation platform designed to help users create professional, academic, and business emails across 30+ writing styles. It leverages OpenAI's GPT-5 model to generate contextually appropriate emails based on user inputs including style preferences, recipient information, LinkedIn profiles, job descriptions, and custom context. The platform supports multi-language email generation, offers robust draft management for authenticated users, and includes a Gmail-integrated contact form. Its primary purpose is to provide a comprehensive, free tool for efficient and high-quality email composition, aiming for broad market adoption through its free-to-use model and SEO-optimized content.

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
- **AI Integration**: Uses OpenAI's GPT-5 model via Replit AI Integrations for email generation, supporting 30+ style templates. Prompts are context-aware, incorporating LinkedIn profiles and job descriptions.
- **Page Routes**: Includes landing, composer, drafts, FAQ, contact, privacy policy, and terms of service pages.

### Data Storage
- **Database**: PostgreSQL via Neon serverless driver, utilizing Drizzle ORM for type-safe queries and schema management.
- **Schema Design**: Tables for `users` (Replit Auth profiles), `email_drafts` (user-saved drafts), `email_history` (auto-saved generation history), and `sessions`.
- **Migration Strategy**: Drizzle Kit for schema migrations.

## External Dependencies

- **Replit Auth**: For user authentication and identity management.
- **Replit AI Integrations**: Provides managed access to OpenAI API, specifically GPT-5.
- **Neon Database**: Serverless PostgreSQL hosting for all application data.
- **Google Gmail API**: Integrated for sending emails via Replit Connectors (for the contact form).
- **Major NPM Libraries**: React, Radix UI, Tailwind CSS, Express, Passport, Drizzle ORM, OpenAI SDK, Zod.
- **API Integrations**: Gmail API, LinkedIn profile data extraction (URL-based), job description parsing (URL-based).
- **Design Assets**: Google Fonts (Inter, DM Sans, Geist Mono, etc.), Lucide icons.