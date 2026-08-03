export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export type PublicationStatus = "draft" | "published";

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
  status: PublicationStatus;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

export interface QuestionFormData {
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
  status: PublicationStatus;
}

export interface QuestionFilters {
  topic?: string;
  difficulty?: Difficulty;
  tags?: string[];
  search?: string;
  category?: string;
}

export interface PaginatedQuestions {
  questions: InterviewQuestion[];
  lastDoc?: unknown;
  hasMore: boolean;
}

export const TOPICS = [
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "React",
  "React Native",
  "Next.js",
  "Node.js",
  "Express.js",
] as const;

export type Topic = (typeof TOPICS)[number];

export const DIFFICULTIES: Difficulty[] = [
  "Beginner",
  "Intermediate",
  "Advanced",
];

export const CATEGORIES = [
  "React Hooks",
  "React Components",
  "React State Management",
  "React Performance",
  "React Router",
  "CSS Layout",
  "CSS Flexbox",
  "CSS Grid",
  "CSS Animations",
  "CSS Responsive Design",
  "JavaScript ES6+",
  "JavaScript Async",
  "JavaScript DOM",
  "JavaScript Events",
  "TypeScript Basics",
  "TypeScript Advanced",
  "TypeScript Generics",
  "TypeScript Utility Types",
  "HTML Semantic",
  "HTML Forms",
  "HTML Accessibility",
  "React Native Components",
  "React Native Navigation",
  "React Native Performance",
  "Next.js App Router",
  "Next.js Server Components",
  "Next.js Data Fetching",
  "Next.js Performance",
  "Node.js Basics",
  "Node.js Express",
  "Node.js Async",
  "Node.js Streams",
  "Express.js Routing",
  "Express.js Middleware",
  "Express.js Validation",
  "Express.js Security",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const QUESTION_STATUS: PublicationStatus[] = ["draft", "published"];
