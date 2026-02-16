# Smart Emailer Pro

**Free AI-Powered Email Writing Platform**

Smart Emailer Pro is a free, web-based platform that uses AI to help you write professional, academic, and business emails in seconds. Choose from 40+ writing styles, provide context about your situation, and get a polished, ready-to-send email generated instantly.

A digital asset owned by **Indus Bridge Ventures Inc.** (801 Route 1 #1017, Iselin, NJ 08831, United States).

---

## Features

### 40+ Writing Styles

**Professional & Business**
- Professional Formal, Professional Casual, Executive, Sales Pitch, Networking, Follow-Up, Thank You, Introduction, Cover Letter, Resignation, Recommendation, Complaint, Apology, Business Proposal, Customer Service, Invoice Request, Order Confirmation

**Recruiter Outreach**
- Dedicated recruiter-to-candidate communication with 8 outreach approaches (Professional & Direct, Warm & Friendly, Executive Brief, Consultative, Opportunity-Focused, Industry Insider, Relationship Building, Urgent & Confidential)
- Supports initial outreach and follow-up messages
- Integrates job description URLs, candidate LinkedIn profiles, agency websites, and resume uploads

**Internal Business Communication**
- Internal Announcement, Promotion Announcement, Policy Update, Team Update, Internal Memo, Employee Recognition, Meeting Minutes, Project Update, Urgent Internal Alert

**Academic**
- Academic Formal, Research Inquiry, Conference, To Supervisor, Peer Review

**Casual & Creative**
- Friendly, Informal, Enthusiastic, Creative, Storytelling, Marketing, Announcement, Invitation, Newsletter

### Multi-Language Support
- Dual language selectors: choose the language of your input context and the language for the generated email independently
- Supports 22+ languages including English, Spanish, French, German, Chinese, Japanese, Hindi, Urdu, Farsi, Arabic, and more

### Context-Aware Generation
- **LinkedIn Profile Integration** -- paste a LinkedIn URL to personalize emails based on the recipient's background
- **Job Description URLs** -- reference specific job postings for cover letters and recruiter outreach
- **File Attachments** -- upload resumes, documents, or email threads (PDF, Word, TXT, up to 5MB) for context-aware generation

### Draft Management
- Save generated emails as drafts for later editing
- Full draft history with search and management tools
- Auto-saved generation history for authenticated users

### Authentication
- Sign in with Google, GitHub, Apple, or Email via OpenID Connect
- Works without an account for anonymous email generation
- Authenticated users get draft saving, history tracking, and personalized experience

### Additional Pages
- SEO-optimized landing page with structured data
- Comprehensive FAQ section
- Contact form (Gmail API integrated)
- Privacy Policy and Terms of Service
- Blog section

---

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast builds and hot module replacement
- **Tailwind CSS** with custom light/dark theme
- **Shadcn/ui** (Radix UI primitives) for accessible components
- **TanStack Query** for server state management
- **Wouter** for client-side routing
- **Lucide React** for icons

### Backend
- **Express.js** with TypeScript
- **Passport.js** with OpenID Connect for authentication
- **OpenAI GPT-5** via AI integrations for email generation
- **Gmail API** for contact form delivery
- **Zod** for request validation

### Database
- **PostgreSQL** (Neon serverless)
- **Drizzle ORM** for type-safe queries and schema management
- Tables: `users`, `email_drafts`, `email_history`, `composer_usage`, `sessions`

---

## Project Structure

```
smart-emailer-pro/
├── client/
│   └── src/
│       ├── components/       # Reusable UI components
│       │   ├── ui/           # Shadcn/ui base components
│       │   ├── EmailComposer.tsx
│       │   ├── EmailPreview.tsx
│       │   └── ...
│       ├── pages/            # Route pages
│       │   ├── Landing.tsx
│       │   ├── EmailComposerPage.tsx
│       │   ├── Drafts.tsx
│       │   ├── Login.tsx
│       │   ├── FAQ.tsx
│       │   ├── Contact.tsx
│       │   ├── Blog.tsx
│       │   ├── PrivacyPolicy.tsx
│       │   └── TermsOfService.tsx
│       ├── lib/
│       │   ├── emailStyles.ts  # All 40+ email style definitions
│       │   └── queryClient.ts
│       └── App.tsx
├── server/
│   ├── index.ts              # Express server entry point
│   ├── routes.ts             # API route definitions
│   ├── storage.ts            # Database storage interface
│   ├── db.ts                 # Database connection
│   ├── emailGenerator.ts     # AI email generation logic
│   ├── replitAuth.ts         # Authentication setup
│   ├── gmail.ts              # Gmail API integration
│   └── openai.ts             # OpenAI client setup
├── shared/
│   └── schema.ts             # Drizzle ORM schema & types
├── package.json
├── tailwind.config.ts
├── vite.config.ts
└── drizzle.config.ts
```

---

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL database
- OpenAI API key

### Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `SESSION_SECRET` | Secret for session encryption |
| `OPENAI_API_KEY` | OpenAI API key for email generation |

### Installation

```bash
# Install dependencies
npm install

# Push database schema
npm run db:push

# Start development server
npm run dev
```

The application will be available at `http://localhost:5000`.

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/generate-email` | No | Generate an email using AI |
| `GET` | `/api/auth/user` | Yes | Get authenticated user profile |
| `GET` | `/api/drafts` | Yes | List user's saved drafts |
| `POST` | `/api/drafts` | Yes | Save a new draft |
| `DELETE` | `/api/drafts/:id` | Yes | Delete a specific draft |
| `DELETE` | `/api/drafts` | Yes | Delete all user drafts |
| `GET` | `/api/history` | Yes | Get email generation history |
| `POST` | `/api/history` | Yes | Save to generation history |
| `DELETE` | `/api/history/:id` | Yes | Delete a history entry |
| `POST` | `/api/contact` | No | Submit contact form |

---

## Security

- WordPress bot protection middleware blocks common attack paths
- PostgreSQL-backed session store with secure cookies
- Input validation with Zod on all API endpoints
- Authentication via OpenID Connect (no passwords stored)
- File uploads limited to 5MB with type restrictions

---

## Usage Analytics

The `composer_usage` table tracks anonymized usage data for every email generation:
- Writing style used
- Input and output languages
- Attachment usage
- Authentication status
- Success/failure rates
- Device information (user agent)

---

## Support

For questions, feedback, or issues, contact us at **info@indus-bridge.com** or use the in-app contact form.

---

## License

Copyright Indus Bridge Ventures Inc. All rights reserved.
