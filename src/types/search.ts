export interface SearchFilters {
  query?: string;
  topic?: string;
  difficulty?: string;
  tags?: string[];
}

export interface SearchResult {
  questions: import('./questions').InterviewQuestion[];
  totalCount: number;
  hasMore: boolean;
}

export interface SearchState {
  filters: SearchFilters;
  results: SearchResult | null;
  isLoading: boolean;
  error: Error | null;
  recentSearches: string[];
}