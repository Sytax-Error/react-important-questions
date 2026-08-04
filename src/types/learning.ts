export interface RecentlyViewedQuestion {
  questionId: string;
  questionSlug: string;
  questionTitle: string;
  topic: string;
  difficulty: string;
  viewedAt: Date;
}

export interface CompletedQuestion {
  questionId: string;
  questionSlug: string;
  questionTitle: string;
  topic: string;
  difficulty: string;
  completedAt: Date;
}

export interface LearningProgress {
  totalQuestions: number;
  completedCount: number;
  completionRate: number;
  recentlyViewed: RecentlyViewedQuestion[];
  completedQuestions: CompletedQuestion[];
}

export interface LearningState {
  recentlyViewed: RecentlyViewedQuestion[];
  completedQuestions: CompletedQuestion[];
  isLoading: boolean;
  error: Error | null;
}

export const MAX_RECENTLY_VIEWED = 20;
