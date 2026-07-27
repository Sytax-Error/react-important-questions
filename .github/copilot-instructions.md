# React Important Questions — Project Instructions

## Project Purpose

This project is an interview preparation question-and-answer website for
frontend, mobile and full-stack developers.

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

Users can browse, search, filter, bookmark and read interview questions.

An authenticated admin can create, edit, publish, unpublish and delete
questions.

## Technology Stack

Use the following technologies:

- React
- Vite
- TypeScript
- Tailwind CSS
- React Router
- Firebase Authentication
- Cloud Firestore
- Firebase Hosting when deployment is required

Do not replace the selected technology stack unless explicitly requested.

## TypeScript Standards

- Use TypeScript for all new application files.
- Avoid using `any`.
- Create reusable interfaces and types.
- Use union types for fixed values such as difficulty and publication status.
- Define component props using interfaces or type aliases.
- Use typed Firebase converters where practical.

## React Standards

- Use functional components and React hooks.
- Keep components small and focused.
- Separate UI, data access and business logic.
- Create reusable components instead of duplicating markup.
- Move reusable stateful logic into custom hooks.
- Avoid unnecessary `useEffect`.
- Do not use `useMemo`, `useCallback` or `React.memo` without a clear benefit.
- Use controlled components for admin forms.
- Always handle loading, empty, success and error states.

## Suggested Architecture

Use a feature-based folder structure:

src/
├── app/
├── assets/
├── components/
├── features/
│ ├── auth/
│ ├── questions/
│ ├── bookmarks/
│ ├── search/
│ └── admin/
├── hooks/
├── layouts/
├── pages/
├── routes/
├── services/
├── types/
└── utils/

Keep Firebase configuration inside:

src/services/firebase/

Keep question-related Firestore operations inside:

src/features/questions/services/

## Routing

The public application should support routes such as:

- `/`
- `/questions`
- `/questions/:slug`
- `/topics/:topic`
- `/bookmarks`

The admin application should support:

- `/admin/login`
- `/admin/questions`
- `/admin/questions/new`
- `/admin/questions/:id/edit`

Protect all admin routes.

Do not expose admin functionality to unauthenticated users.

## Question Data Model

Use a consistent question structure:

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
