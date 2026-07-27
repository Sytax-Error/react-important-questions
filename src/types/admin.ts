export interface AdminStats {
  totalQuestions: number;
  publishedQuestions: number;
  draftQuestions: number;
  questionsByTopic: Record<string, number>;
}

export interface AdminQuestionListItem {
  id: string;
  question: string;
  slug: string;
  topic: string;
  category: string;
  difficulty: string;
  isPublished: boolean;
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminDashboardData {
  stats: AdminStats;
  recentQuestions: AdminQuestionListItem[];
}

export interface QuestionFormErrors {
  question?: string;
  slug?: string;
  topic?: string;
  category?: string;
  difficulty?: string;
  shortAnswer?: string;
  detailedAnswer?: string;
  code?: string;
  language?: string;
  importantPoints?: string;
  followUpQuestions?: string;
  tags?: string;
  general?: string;
}