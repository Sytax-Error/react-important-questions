export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type QuestionStatus = 'draft' | 'published';

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
  status: QuestionStatus;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

export interface QuestionFormData {
  question: string;
  slug: string;
  topic: string;
  category: string;
  difficulty: Difficulty;
  shortAnswer: string;
  detailedAnswer: string;
  code: string;
  language: string;
  importantPoints: string[];
  followUpQuestions: string[];
  tags: string[];
  isPublished: boolean;
}

export interface QuestionFilters {
  topic?: string;
  difficulty?: Difficulty;
  tags?: string[];
  search?: string;
}

export interface PaginatedQuestions {
  questions: InterviewQuestion[];
  lastDoc?: unknown;
  hasMore: boolean;
}

export const TOPICS = [
  'HTML',
  'CSS',
  'JavaScript',
  'TypeScript',
  'React',
  'React Native',
  'Next.js',
  'Node.js',
  'Express.js',
] as const;

export type Topic = (typeof TOPICS)[number];

export const DIFFICULTIES: Difficulty[] = ['Beginner', 'Intermediate', 'Advanced'];

export const QUESTION_STATUS: QuestionStatus[] = ['draft', 'published'];