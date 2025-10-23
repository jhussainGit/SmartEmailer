# Design Guidelines: Professional Email Writer Platform

## Design Approach

**Selected Approach:** Design System - Professional Productivity (Linear + Notion Hybrid)

**Justification:** This is a utility-focused productivity tool requiring clarity, efficiency, and professional credibility. Drawing from Linear's clean typography and precision, combined with Notion's content organization patterns, creates an environment that feels both powerful and approachable for academic and professional users.

**Key Design Principles:**
1. Clarity over decoration - every element serves a purpose
2. Progressive disclosure - reveal complexity only when needed
3. Professional credibility - inspire confidence in generated content
4. Efficient workflows - minimize clicks to value

---

## Typography System

**Primary Font:** Inter (via Google Fonts)
- Headings: 600-700 weight
- Body: 400-500 weight
- UI Elements: 500 weight

**Type Scale:**
- Hero/Page Titles: text-4xl to text-5xl (font-semibold)
- Section Headings: text-2xl to text-3xl (font-semibold)
- Card Titles: text-lg to text-xl (font-medium)
- Body Text: text-base (leading-relaxed)
- UI Labels: text-sm (font-medium)
- Helper Text: text-xs to text-sm (text-muted)

---

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16, 20
- Micro spacing (between related elements): p-2, gap-2
- Component padding: p-4, p-6
- Section spacing: py-8, py-12, py-16
- Container gaps: gap-4, gap-6, gap-8
- Page margins: px-4 (mobile), px-6 (tablet), px-8 (desktop)

**Grid System:**
- Main content area: max-w-7xl mx-auto
- Dashboard/Tool area: Full width with sidebar (when applicable)
- Form containers: max-w-2xl to max-w-4xl
- Reading content (FAQs): max-w-3xl

**Layout Patterns:**
- Dashboard: Two-column layout (sidebar navigation + main workspace)
- Email composer: Three-panel (style selector + input form + live preview)
- Landing: Single column with strategic feature grids

---

## Component Library

### Navigation & Structure

**Top Navigation Bar:**
- Height: h-16
- Container: Sticky top with subtle border-bottom
- Left: Logo/Brand (text-xl font-semibold)
- Center: Main navigation links (hidden on mobile, show in sidebar)
- Right: Language selector dropdown, User menu with avatar/logout

**Dashboard Sidebar (Logged In):**
- Width: w-64 on desktop, slide-in drawer on mobile
- Items: Dashboard, New Email, My Drafts, Templates, FAQs, Contact, Settings
- Active state: Subtle background with left border accent

### Email Composer Interface

**Style Selector Panel:**
- Grid of style cards: grid-cols-2 md:grid-cols-3 lg:grid-cols-4
- Each card: Rounded border, hover lift effect, icon + name + brief description
- Categories: Professional, Academic, Casual, Formal, Creative, Technical, Sales, Cover Letters, etc. (20-30 total)
- Filter/search bar at top

**Input Form Panel:**
- Vertical form layout with clear sections
- Field groups with labels (text-sm font-medium mb-2)
- Input fields: Rounded-lg border with focus ring, p-3
- Key fields:
  - Email Type dropdown (select with custom styling)
  - Recipient (with optional LinkedIn URL input)
  - Sender info (with optional LinkedIn URL input)
  - Subject/Topic (text input)
  - Length selector (Short/Medium/Long - segmented control)
  - Tone adjustments (checkboxes or tags: Urgent, Friendly, Direct, etc.)
  - Sample email input (textarea for reference)
  - Job description URL (for cover letters)
  - Additional context (expandable textarea)
- Generate button: Large, prominent, rounded-lg, font-medium

**Email Preview Panel:**
- Card with subtle shadow
- Email format preview with proper spacing
- Copy to clipboard button (top-right)
- Download options (PDF, TXT)
- Edit/Refine options
- Formatting preserved (spacing, paragraphs, signature block)

### Cards & Containers

**Feature Cards (Landing):**
- Rounded-xl with border
- Padding: p-6 to p-8
- Icon at top (text-3xl or w-12 h-12)
- Title: text-xl font-semibold mb-2
- Description: text-base leading-relaxed
- Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6

**Template Cards:**
- Compact design: p-4
- Preview snippet (2-3 lines, text-sm)
- Use this template button
- Star/favorite icon

### Forms

**Input Fields:**
- All inputs: rounded-lg border p-3 with smooth focus transition
- Dropdowns: Custom styled select with chevron icon
- Textareas: min-h-32 with resize capability
- Validation: Inline error messages (text-sm text-red-600)

**Buttons:**
- Primary: Large rounded-lg px-6 py-3 font-medium (for main actions)
- Secondary: Outlined variant with border
- Tertiary: Text-only with subtle hover
- Icon buttons: Square p-2 for utility actions

### FAQ Section

**Accordion Pattern:**
- Each question: Rounded border, p-4, cursor-pointer
- Question text: font-medium text-lg with chevron icon
- Answer: Expanded section with p-4, text-base leading-relaxed
- Categories: Getting Started, Features, Billing, Technical, etc.
- Search bar above FAQs

### Contact Page

**Two-Column Layout:**
- Left: Contact form (name, email, subject, message textarea, submit button)
- Right: Contact information card (email, response time expectation, support hours)
- Form: max-w-2xl, rounded-xl with p-8
- Success message: Toast notification after submission

### Landing Page Sections

**Hero Section (Above Fold):**
- Centered content: max-w-4xl mx-auto text-center
- Headline: text-5xl font-bold mb-6
- Subheadline: text-xl mb-8
- CTA buttons: Primary "Get Started Free" + Secondary "See Examples"
- Social proof: "Trusted by 10,000+ professionals" with user avatars
- NO large background image - clean gradient or subtle pattern only

**Features Grid:**
- 3 columns on desktop: AI-Powered Writing, 30+ Email Styles, LinkedIn Integration
- Each with icon, heading, description, and micro-feature list

**How It Works:**
- Numbered steps in horizontal layout
- Step cards with number badge, title, description
- Connecting lines between steps on desktop

**Templates Showcase:**
- Horizontal scrollable carousel of email templates
- Category tabs above (Professional, Academic, Creative, etc.)

**Pricing/CTA Section:**
- Centered card emphasizing free access
- Feature checklist
- Large signup button

**Footer:**
- Four columns: Product (links), Company (About, Contact), Resources (FAQs, Blog), Legal (Terms, Privacy)
- Language selector
- Copyright notice

---

## Language Selector

**Dropdown Component:**
- Flag icon + language code (e.g., 🇺🇸 EN)
- Positioned in top navigation
- Dropdown with language list: flag + full name
- Persist selection across sessions

---

## Images

**Minimal Image Strategy:**
- NO large hero background image
- Icon illustrations for features (simple line art or pictograms)
- User avatars for testimonials/social proof (circular, small)
- Template preview thumbnails (small, border-rounded)
- Dashboard: Clean interface screenshots if needed for marketing

**Focus:** Typography, spacing, and functional design over decorative imagery

---

## Special Considerations

**Admin Interface:**
- Dedicated admin section accessible only to jaffer.hussain@gmail.com
- User management table with email, join date, usage stats
- Simple, table-based layout with filters

**Responsive Behavior:**
- Mobile: Stack all panels vertically, collapsible sections
- Tablet: Two-column where appropriate
- Desktop: Full three-panel email composer experience

**Professional Polish:**
- Subtle shadows for depth (shadow-sm to shadow-md)
- Smooth transitions (transition-all duration-200)
- Consistent border-radius (rounded-lg standard)
- Ample whitespace - never cramped
- High contrast for readability