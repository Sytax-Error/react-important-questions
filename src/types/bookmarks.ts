export interface Bookmark {
  questionId: string;
  questionSlug: string;
  questionTitle: string;
  topic: string;
  difficulty: string;
  savedAt: Date;
}

export interface BookmarksState {
  bookmarks: Bookmark[];
  isLoading: boolean;
  error: Error | null;
}