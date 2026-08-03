# React Important Questions — Copilot Instructions

## Project Overview

`React Important Questions` is a dynamic interview-preparation question-and-answer website for frontend, mobile, and full-stack developers.

The application provides structured interview questions for:

- HTML
- CSS
- JavaScript
- TypeScript
- React
- React Native
- Next.js
- Node.js
- Express.js

The application has two main sections:

1. Public interview-preparation website
2. Protected administrator panel

Public users can browse, search, filter, bookmark, and read published interview questions.

Authorized administrators can dynamically create, edit, delete, preview, publish, and unpublish questions.

All questions and answers are stored in Cloud Firestore. Adding or editing a question must not require modifying source code or redeploying the frontend.

---

# Technology Stack

Use the following technologies:

- React
- Vite
- TypeScript
- Tailwind CSS
- React Router
- Firebase Authentication
- Cloud Firestore
- Firebase Web SDK
- Vercel for frontend deployment

Do not replace the selected technology stack unless the user explicitly requests a change.

A separate Node.js backend is not required for the MVP.

Node.js, Express, Firebase Functions, or another backend may be introduced later only when trusted server-side functionality is required, such as:

- AI API integrations
- Private external API keys
- Email notifications
- Scheduled jobs
- Bulk data imports
- Payment processing
- Firebase Admin SDK operations
- Server-side analytics
- Content moderation

---

# Permanent Phase Control Rules

The complete development roadmap is defined in this file.

Do not rewrite this instruction file when changing phases.

The active phase will always be specified in the user's chat prompt.

Examples:

```text
Start Phase 3A only.
```

```text
Continue Phase 3B.
```

```text
Review Phase 3 before starting Phase 4.
```

Rules:

- Implement only the phase or sub-phase explicitly requested by the user.
- Do not automatically start the next phase.
- Do not infer that approval has been given.
- Do not repeat completed work.
- Do not recreate existing providers, hooks, routes, services, types, or components.
- Inspect the existing repository before every implementation.
- Preserve all completed work.
- Stop at the requested phase boundary.
- After completing a phase, report results and wait for the next user instruction.

---

# Current Project Progress

The following phases have already been completed.

## Phase 1 — Completed

The project foundation includes:

- React
- Vite
- TypeScript
- Tailwind CSS
- React Router
- Feature-based source structure
- Public layout
- Admin layout
- Route placeholders
- Shared UI components
- Theme provider
- Dark and light theme foundation
- Shared question types
- Firebase configuration
- Environment-variable validation
- `.env.example`
- Vercel SPA configuration
- Production build setup

Do not recreate Phase 1 functionality.

## Phase 2 — Completed

Authentication and admin authorization include:

- Firebase email/password authentication
- Authentication service
- Authentication provider
- Authentication context
- `useAuth` hook
- Admin authorization service
- Login form
- Admin login page
- Logout functionality
- Authentication loading state
- Protected admin routes
- `admins/{uid}` Firestore authorization
- Firestore security-rule foundation
- Friendly authentication error mapping
- Session restoration after refresh

Do not recreate Phase 2 functionality.

## Current Development Area

The application is currently being developed within:

```text
Phase 4 — Public Question Website
```

The exact Phase 4 sub-phase must be specified in the user's prompt.

### Phase 4A — Public Home Page

Status: Completed.

Implemented:

- Hero section with headline, description, and CTA buttons (Browse Questions, Start with JavaScript)
- Website introduction
- Technology cards (Browse by Topic - dynamic from loaded questions)
- Total question statistics (Questions, Topics, Difficulties count cards)
- Recently added questions section (fetches 5 most recent published questions)
- Featured questions section (fetches 3 featured published questions)
- Call-to-action areas (Features section + final CTA card)
- Responsive layout (mobile, tablet, desktop)
- Loading states with skeleton animations
- Error states with user-friendly messages
- Empty states for when no questions exist

Notes:

- Firestore composite indexes created for queries on (isPublished, status, publishedAt) and (isPublished, status, createdAt)
- Uses `usePublicQuestionMeta` hook for statistics and topics/difficulties
- Uses new `useHomePageQuestions` hook for recently added and featured questions
- New service functions: `getRecentlyAddedQuestions`, `getFeaturedQuestions`
- Indexes now built - queries use proper server-side filtering with both isPublished and status fields

### Phase 4B — Public Question Listing

Status: Completed.

Implemented:

- Published question list with server-side pagination
- Search with debounced input (300ms)
- Topic filter (9 predefined topics)
- Category filter (dynamic from loaded questions)
- Difficulty filter (Beginner, Intermediate, Advanced)
- Tag filter (dynamic from loaded questions, clickable badges)
- Sorting (Newest, Oldest, Difficulty asc/desc, Alphabetical, Group by Topic)
- Incremental loading with "Load More" button
- Loading state with skeleton animations
- Empty state with helpful message and clear filters action
- Error state with retry button
- Responsive question cards (1/2/3 columns)
- Clear Filters button (enabled when filters active)
- Uses `getPaginatedPublishedQuestions` service with proper server-side queries
- Tags filtered in memory (Firestore limitation: array-contains-any cannot combine with other where clauses)

Notes:

- Firestore composite indexes created for (isPublished, status, publishedAt, topic/difficulty)
- Uses new `usePaginatedQuestions` hook for pagination and filter management
- Uses new `useQuestionSorting` hook for client-side sorting
- New UI component: `Select` for consistent dropdown styling

---

# TypeScript Standards

- Use TypeScript for all new application files.
- Avoid `any`.
- Use `unknown` for values whose type is not yet known.
- Narrow `unknown` values safely before using them.
- Create reusable interfaces and type aliases.
- Use union types for fixed values.
- Define component props explicitly.
- Keep shared domain types in one clear location.
- Do not create duplicate or conflicting types.
- Use typed Firebase converters or typed mapping utilities.
- Avoid unnecessary type assertions.
- Do not disable TypeScript checks.
- Do not suppress errors without documenting the reason.
- Do not use `@ts-ignore` unless explicitly justified.
- Keep service return types explicit.
- Keep form types separate from persisted Firestore types when necessary.

---

# React Standards

- Use functional components.
- Use React hooks.
- Keep components small and focused.
- Separate presentation, data access, and business logic.
- Create reusable components instead of repeating markup.
- Move reusable stateful logic into custom hooks.
- Avoid unnecessary `useEffect`.
- Clean up listeners, subscriptions, timers, and event handlers.
- Do not use `useMemo`, `useCallback`, or `React.memo` without a clear benefit.
- Use controlled inputs for admin forms.
- Handle loading, empty, success, and error states.
- Prevent duplicate submissions.
- Preserve user-entered values when requests fail.
- Avoid modifying unrelated files.
- Preserve existing working functionality.
- Use route-level lazy loading where appropriate.
- Do not create large page components when functionality can be separated safely.

---

# Project Architecture

Follow the existing feature-based architecture.

```text
src/
├── app/
├── assets/
├── components/
│   └── ui/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
│   ├── questions/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   ├── bookmarks/
│   ├── search/
│   └── admin/
├── hooks/
├── layouts/
├── pages/
├── routes/
├── services/
│   └── firebase/
├── types/
└── utils/
```

Use existing folders and files when equivalent implementations already exist.

Do not create duplicate:

- Firebase application instances
- Firestore instances
- Authentication providers
- Authentication contexts
- Authentication hooks
- Theme providers
- Protected-route components
- Question types
- Firestore services
- Form components
- Slug utilities
- Error-mapping utilities
- Layout components

Firebase configuration must remain inside:

```text
src/services/firebase/
```

Question Firestore operations must remain inside:

```text
src/features/questions/services/
```

Firebase calls must not be placed directly inside presentation components.

---

# Application Routes

## Public routes

```text
/
```

Home page.

```text
/questions
```

Published question listing.

```text
/questions/:slug
```

Published question details.

```text
/topics/:topic
```

Questions filtered by technology.

```text
/bookmarks
```

Locally bookmarked questions.

## Admin routes

```text
/admin/login
/admin/dashboard
/admin/questions
/admin/questions/new
/admin/questions/:id/edit
```

All admin routes except `/admin/login` must remain protected.

Do not expose admin content while Firebase Authentication or admin authorization is loading.

Unauthenticated users must be redirected to:

```text
/admin/login
```

Authorized administrators opening `/admin/login` should be redirected to:

```text
/admin/dashboard
```

Preserve the originally requested admin route when redirecting to login.

---

# Question Domain Model

Use one consistent domain model.

```ts
export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export interface InterviewQuestion {
  id: string;
  question: string;
  slug: string;
  topic: string;
  category: string;
  shortAnswer: string;
  detailedAnswer: string;
  code?: string;
  language?: string;
  importantPoints: string[];
  followUpQuestions: string[];
  tags: string[];
  difficulty: Difficulty;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

Firestore may internally store `createdAt` and `updatedAt` as Firebase `Timestamp` values.

Convert Firestore timestamps into JavaScript `Date` values using a typed converter or mapping utility.

Do not spread unvalidated Firestore data directly into the domain model.

When useful, create separate types for:

- Creating a question
- Updating a question
- Question form values
- Firestore question documents
- Question filters

Do not duplicate the main `InterviewQuestion` interface.

---

# Firestore Collections

## Questions

Use:

```text
questions/{questionId}
```

Each document should contain:

- `question`
- `slug`
- `topic`
- `category`
- `shortAnswer`
- `detailedAnswer`
- `code`
- `language`
- `importantPoints`
- `followUpQuestions`
- `tags`
- `difficulty`
- `isPublished`
- `createdAt`
- `updatedAt`

When creating a question:

- Use `serverTimestamp()` for `createdAt`
- Use `serverTimestamp()` for `updatedAt`

When updating a question:

- Preserve `createdAt`
- Update `updatedAt` using `serverTimestamp()`

## Administrators

Use:

```text
admins/{firebaseUserUid}
```

An administrator document contains:

```ts
{
  email: string;
  role: "admin";
}
```

The frontend must never create, promote, update, or delete administrator documents.

Administrator documents must be created manually through Firebase Console or later through trusted Firebase Admin SDK code.

---

# Firebase Authentication and Authorization

Use the existing Firebase Authentication implementation.

Admin access requires all of the following:

1. Authentication state has finished loading.
2. A Firebase user is authenticated.
3. A Firestore document exists at `admins/{uid}`.
4. The document contains `role: "admin"`.

Never grant admin access based only on:

- A logged-in user
- An email comparison in frontend code
- A hard-coded administrator email
- A localStorage value
- A hidden navigation item
- A route name
- A URL parameter

Admin authorization must also be enforced through Firestore Security Rules.

---

# Firestore Security Rules

Security Rules must ensure:

- Anonymous users can read only published questions.
- Authorized administrators can read published and draft questions.
- Only authorized administrators can create questions.
- Only authorized administrators can update questions.
- Only authorized administrators can delete questions.
- Users cannot add themselves to the `admins` collection.
- Users cannot edit their own role.
- Public users cannot read private administrator data.
- Invalid difficulty values are rejected.
- Invalid document structures are rejected where practical.
- Access is denied unless explicitly allowed.

Never use:

```js
allow read, write: if true;
```

Do not weaken Firestore rules to fix a permission error.

Identify and correct the data, authentication, authorization, or rule mismatch instead.

---

# Question Form Standards

Use one reusable form for both creating and editing questions.

The form must support:

- Question
- Slug
- Topic
- Category
- Difficulty
- Short answer
- Detailed answer
- Optional code example
- Optional code language
- Important points
- Follow-up questions
- Tags
- Publication status

## Slug behaviour

- Generate a slug from the question initially.
- Allow manual slug editing.
- Stop automatic replacement after manual editing.
- Normalize the slug before saving.
- Check slug uniqueness.
- Exclude the current question when checking uniqueness during editing.
- Prevent empty slugs.
- Prevent duplicate slugs.

## Dynamic array fields

For tags, important points, and follow-up questions:

- Allow adding items.
- Allow editing items.
- Allow removing items.
- Prevent blank entries.
- Trim whitespace.
- Avoid duplicate tags.
- Preserve values after failed saves.

## Form behaviour

- Use controlled inputs.
- Display field-specific errors.
- Disable submission while saving.
- Prevent duplicate submissions.
- Preserve form values after failure.
- Support saving as draft.
- Support publishing immediately.
- Display success feedback.
- Display understandable error feedback.
- Warn before leaving when unsaved changes exist.
- Avoid one unnecessarily large form component.
- Split reusable form sections when appropriate.

---

# Validation Rules

Validate:

- Question is required.
- Slug is required.
- Slug format is valid.
- Slug is unique.
- Topic is required.
- Category is required.
- Difficulty is required.
- Difficulty is supported.
- Short answer is required.
- Detailed answer is required.
- Array entries are not blank.
- Tags are normalized.
- Text fields are trimmed.
- Reasonable maximum lengths are applied.

Do not rely only on HTML validation.

Invalid data must not be sent to Firestore.

---

# Error Handling

Handle:

- Authentication errors
- Authorization failures
- Firestore permission errors
- Network failures
- Missing documents
- Invalid Firestore data
- Duplicate slugs
- Create failures
- Update failures
- Delete failures
- Publish failures
- Unpublish failures
- Subscription failures
- Clipboard failures
- LocalStorage failures

Convert Firebase errors into understandable user-facing messages.

Do not display raw Firebase error objects, stack traces, or internal error codes to public users.

Keep useful technical details available for development debugging.

---

# UI and Accessibility Standards

- Use the existing Tailwind CSS setup.
- Support mobile, tablet, and desktop screens.
- Support dark and light themes.
- Use semantic HTML.
- Use correct heading order.
- Use accessible form labels.
- Ensure keyboard navigation works.
- Include visible focus states.
- Do not communicate state through color alone.
- Use understandable button labels.
- Make dialogs keyboard accessible.
- Manage focus correctly in dialogs.
- Provide loading indicators.
- Provide empty states.
- Provide clear error states.
- Avoid distracting animations.
- Reuse existing design tokens and shared components.

---

# Performance Standards

- Avoid unnecessary Firestore reads.
- Avoid duplicate listeners.
- Always unsubscribe from real-time listeners.
- Reuse loaded question data for filters and statistics.
- Avoid a separate query for every UI filter.
- Use pagination or incremental loading when question volume grows.
- Lazy-load routes where appropriate.
- Avoid unnecessary React re-renders.
- Avoid unnecessary dependencies.
- Do not optimize prematurely.
- Use memoization only when there is a clear reason.
- Keep the application bundle reasonable.

---

# Complete Development Roadmap

## Phase 1 — Project Foundation

Status: Completed.

Features:

- Project setup
- React Router
- Tailwind CSS
- Folder architecture
- Public layout
- Admin layout
- Placeholder pages
- Theme foundation
- Shared types
- Firebase configuration
- Environment variables
- Vercel routing configuration
- Build verification

Do not repeat Phase 1.

---

## Phase 2 — Authentication and Admin Authorization

Status: Completed.

Features:

- Firebase email/password login
- Authentication provider
- Authentication hook
- Login form
- Logout
- Authentication loading state
- Protected admin routes
- Admin Firestore authorization
- Session restoration
- Friendly authentication errors
- Firestore security-rule foundation

Do not repeat Phase 2.

---

## Phase 3 — Admin Question Management

Status: Completed.

### Phase 3A — Firestore Question Services

Implemented:

- Firestore question document type with typed converter
- Collection constants (QUESTIONS_COLLECTION, ADMINS_COLLECTION)
- Fetch all admin questions (real-time subscription)
- Subscribe to all admin questions with filters
- Fetch published questions (real-time subscription)
- Fetch question by ID
- Fetch question by slug
- Create question with server timestamps
- Update question with server timestamps
- Delete question
- Publish question (sets isPublished, status, publishedAt)
- Unpublish question (sets isPublished=false, status=draft)
- Slug uniqueness check (with excludeId for editing)
- Service-level error mapping
- Listener cleanup via unsubscribe functions
- Admin statistics (getQuestionStats)
- Paginated queries for admin and public views
- Admin authorization check (isUserAdmin)

### Phase 3B — Add and Edit Question Form

Implemented:

- Reusable QuestionForm component (src/features/questions/components/QuestionForm.tsx)
- Create-question page (src/pages/admin/AdminQuestionFormPage.tsx)
- Edit-question page (src/pages/admin/AdminQuestionEditPage.tsx)
- Controlled inputs for all fields
- Auto slug generation from question text
- Manual slug editing with isSlugManual flag
- Slug uniqueness validation via checkSlugExists
- Topic selection (9 predefined topics)
- Category selection (27 predefined categories)
- Difficulty selection (Beginner, Intermediate, Advanced)
- Short answer (required, min 20 chars)
- Detailed answer (required, min 50 chars)
- Optional code example with language selection
- Dynamic important points array (add/edit/remove)
- Dynamic follow-up questions array (add/edit/remove)
- Dynamic tags array (add/edit/remove)
- Save as draft action
- Publish immediately action
- Form validation (validateQuestionForm utility)
- Unsaved changes protection (beforeunload event)
- Loading, success, and error states
- Field-specific error display
- Duplicate submission prevention

### Phase 3C — Admin Question List

Implemented:

- AdminQuestionList component (src/features/questions/components/QuestionList.tsx)
- AdminQuestionsPage (src/pages/admin/AdminQuestionsPage.tsx)
- Real-time question listing via subscribeToAllQuestions
- Question title, topic, difficulty, status, updated date
- Search (question text and short answer)
- Topic filter (dynamic from loaded questions)
- Difficulty filter (Beginner/Intermediate/Advanced)
- Status filter (All/Published/Draft)
- Edit action (navigate to edit page)
- Preview action (dialog with full question details)
- Publish action (for draft questions)
- Unpublish action (for published questions)
- Delete action with confirmation dialog
- DeleteConfirmationDialog component
- Loading state (PageLoader)
- Empty state (no questions found)
- Error state
- Stats overview cards (total, published, drafts, topics)
- Reuses loaded data for filtering (client-side)

### Phase 3D — Admin Dashboard and Phase Review

Implemented:

- AdminDashboardPage (src/pages/admin/AdminDashboardPage.tsx)
- Total question count
- Published question count
- Draft question count
- Beginner/Intermediate/Advanced question counts
- Questions grouped by topic (count per topic)
- Recently updated questions (last 5)
- Quick actions (Add Question, Manage Questions, View Site)
- Firestore security rules reviewed and enforced
- Phase 3 integration testing ready
- Production build verified

Do not repeat Phase 3 functionality.

---

## Phase 4 — Public Question Website

### Phase 4A — Public Home Page

Status: Completed.

Implemented:

- Hero section with headline, description, and CTA buttons (Browse Questions, Start with JavaScript)
- Website introduction
- Technology cards (Browse by Topic - dynamic from loaded questions)
- Total question statistics (Questions, Topics, Difficulties count cards)
- Recently added questions section (fetches 5 most recent published questions)
- Featured questions section (fetches 3 featured published questions)
- Call-to-action areas (Features section + final CTA card)
- Responsive layout (mobile, tablet, desktop)
- Loading states with skeleton animations
- Error states with user-friendly messages
- Empty states for when no questions exist

Notes:

- Firestore composite indexes created for queries on (isPublished, status, publishedAt) and (isPublished, status, createdAt)
- Uses `usePublicQuestionMeta` hook for statistics and topics/difficulties
- Uses new `useHomePageQuestions` hook for recently added and featured questions
- New service functions: `getRecentlyAddedQuestions`, `getFeaturedQuestions`
- Indexes now built - queries use proper server-side filtering with both isPublished and status fields

### Phase 4B — Public Question Listing

Status: Completed.

Implemented:

- Published question list
- Search
- Topic filter
- Category filter
- Difficulty filter
- Tag filter
- Sorting
- Pagination or incremental loading
- Loading state
- Empty state
- Error state
- Responsive question cards

Only published questions may appear.

### Phase 4C — Question Details

Status: Completed.

Implemented:

- Question title, topic, category, difficulty
- Short answer and detailed explanation
- Code example with syntax highlighting (react-syntax-highlighter, atomDark theme)
- Copy-code action with clipboard feedback
- Important interview points (checkmark list)
- Follow-up questions (numbered list)
- Tags display
- Related questions (by topic, excluding current)
- Previous/Next question navigation (by publishedAt within topic)
- Share action (Web Share API with clipboard fallback)
- Breadcrumb navigation
- Responsive layout
- Draft questions blocked (only published accessible)

Notes:

- New service functions: `getRelatedQuestions`, `getAdjacentQuestions`
- Added `publishedAt` field to `InterviewQuestion` type
- Updated `TopicBadge` and `DifficultyBadge` to support `size` prop
- Uses `react-syntax-highlighter` with Prism/atomDark theme
- Shareable URL via browser address bar (slug-based routing)

---

### Phase 4D — Topic Pages

**Requirements (from roadmap):**

- Implement reusable routes for: HTML, CSS, JavaScript, TypeScript, React, React Native, Next.js, Node.js, Express.js
- Do not create duplicate hard-coded page components for every topic

**Implementation (Completed):**

Status: Completed.

Implemented:

- Reusable `/topics/:topic` route for all 9 topics (HTML, CSS, JavaScript, TypeScript, React, React Native, Next.js, Node.js, Express.js)
- Breadcrumb navigation (Home → Questions → Topic)
- Topic header with topic name and question count
- Question cards with topic badge, difficulty badge, question title, short answer, and tags
- Responsive grid layout (1/2/3 columns)
- Loading state with skeleton animations
- Empty state when no questions exist for the topic
- Links to individual question detail pages
- No duplicate hard-coded page components - single reusable TopicPage component

**What We Done (Technical Details):**

- **TopicPage Component** (`src/pages/public/TopicPage.tsx`): Single reusable component handling `/topics/:topic` route parameter. Uses `useParams()` to get topic, `subscribeToPublishedQuestions` with topic filter for real-time updates. Renders breadcrumb, topic header with count, responsive grid of question cards.
- **Service Function** (`src/features/questions/services/questionService.ts`): `subscribeToPublishedQuestions` now uses proper server-side query with `isPublished`, `status`, `publishedAt` indexes. Accepts `filters.topic` for topic-specific queries. Returns real-time listener via `onSnapshot`.
- **Badge Components** (`src/components/ui/Badge.tsx`): `TopicBadge` and `DifficultyBadge` updated with `size` prop (`sm` | `md` | `lg`) for consistent sizing in topic cards and question cards.
- **Route Configuration**: Single route `/topics/:topic` → `TopicPage` in router. No duplicate components per topic.
- **Home Page Integration**: Dynamic topic cards in "Browse by Topic" section link to `/topics/{topic}` using `encodeURIComponent`.

Notes:

- Uses `subscribeToPublishedQuestions` with topic filter for real-time updates
- Reuses existing `TopicBadge` and `DifficultyBadge` components
- Dynamic topic cards on home page link to these pages
- All 9 topics supported through single route parameter

---

## Phase 5 — Bookmarking and Learning Features

Implement:

- Bookmark question
- Remove bookmark
- Bookmarks page
- localStorage persistence
- Recently viewed questions
- Mark question as completed
- Learning progress
- Completed-question count
- Reset progress
- Random question mode
- Interview practice mode

User accounts are not required for the first bookmarking version.

---

## Phase 6 — Search, SEO, Accessibility, and Performance

Implement:

- Search improvements
- Debounced search where beneficial
- SEO-friendly titles and metadata
- Open Graph metadata
- Sitemap support
- Semantic HTML review
- Keyboard accessibility review
- Color contrast review
- Focus management review
- Bundle analysis
- Route-level lazy loading
- Firestore query optimization
- Pagination review
- Firestore index review
- Error-boundary review
- Loading-state review

Do not add optimization without measuring or identifying a real benefit.

---

## Phase 7 — Testing and Security Review

Implement and verify:

- Utility-function tests
- Slug-generation tests
- Validation tests
- Authentication-flow tests
- Protected-route tests
- Question-form tests
- Search and filter tests
- Bookmark tests
- Loading-state tests
- Empty-state tests
- Error-state tests
- Firestore Security Rules tests where practical
- Draft access restrictions
- Admin authorization
- Invalid-data handling
- Production-build verification

Do not remove valid tests to make new changes pass.

---

## Phase 8 — Deployment

Deploy:

- Frontend to Vercel
- Firebase Authentication configuration
- Firestore production rules
- Firestore indexes
- Vercel environment variables
- Firebase authorized Vercel domain
- SPA rewrite configuration
- Production build
- Production login test
- Production question CRUD test
- Public question test
- Direct-route refresh test
- Mobile responsiveness test

Do not expose `.env`, credentials, tokens, or service-account files.

---

## Phase 9 — Optional Future Enhancements

Do not implement these unless explicitly requested.

Possible future features:

- User registration
- User profiles
- Cloud-synced bookmarks
- Comments
- Likes
- Question ratings
- Interview playlists
- Quiz mode
- Daily question
- Notifications
- Rich-text editor
- Markdown editor
- Bulk JSON import
- Markdown-file import
- Export questions
- Analytics dashboard
- AI-generated draft answers
- AI answer review
- Email notifications
- Content moderation
- Multiple admin roles
- Reviewer and editor roles
- Node.js backend
- Firebase Functions
- Payment features

---

# Required Coding-Agent Workflow

## Before editing

The coding agent must:

1. Read this instruction file.
2. Inspect the current repository.
3. Inspect related files.
4. Read `package.json`.
5. Identify existing dependencies.
6. Identify reusable components.
7. Identify reusable services and hooks.
8. Check whether equivalent functionality already exists.
9. List files that will be created.
10. List files that will be modified.
11. Explain the implementation approach for larger changes.

Do not wait for confirmation unless the user explicitly asks for planning only.

## During implementation

- Implement only the requested phase.
- Make focused changes.
- Do not rewrite unrelated files.
- Do not delete existing content.
- Do not install unnecessary packages.
- Follow existing naming patterns.
- Reuse existing types, hooks, services, and components.
- Keep Firebase logic outside presentation components.
- Do not weaken security.
- Do not create incomplete placeholder logic when full implementation is requested.
- Preserve working code.
- Avoid unrelated refactoring.

## After implementation

The coding agent must:

1. Run TypeScript checking.
2. Run ESLint.
3. Run relevant tests.
4. Run the production build.
5. Fix errors introduced by the changes.
6. Check unused imports.
7. Check duplicate code.
8. Check listener cleanup.
9. Check loading and error states.
10. Check authentication and authorization effects.
11. Report files created.
12. Report files modified.
13. Report commands executed.
14. Report failed commands honestly.
15. Mention Firebase Console steps.
16. Mention Firestore indexes.
17. Mention manual testing requirements.
18. Mention unresolved risks.
19. Stop at the requested phase boundary.

Do not claim that a command passed unless it was actually executed successfully.
