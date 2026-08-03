import { useState, useEffect, useCallback } from "react";
import { InterviewQuestion, QuestionFilters } from "@/types/questions";
import {
  getPaginatedPublishedQuestions,
  subscribeToPublishedQuestions,
} from "../services/questionService";
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";

interface UsePaginatedQuestionsOptions {
  initialFilters?: QuestionFilters;
  pageSize?: number;
  useRealtime?: boolean;
}

interface UsePaginatedQuestionsReturn {
  questions: InterviewQuestion[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  setFilters: (filters: QuestionFilters) => void;
  filters: QuestionFilters;
}

export function usePaginatedQuestions({
  initialFilters = {},
  pageSize = 10,
  useRealtime = false,
}: UsePaginatedQuestionsOptions = {}): UsePaginatedQuestionsReturn {
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [filters, setFiltersState] = useState<QuestionFilters>(initialFilters);

  const fetchQuestions = useCallback(
    async (isLoadMore = false) => {
      try {
        if (isLoadMore) {
          setLoadingMore(true);
        } else {
          setLoading(true);
        }
        setError(null);

        const result = await getPaginatedPublishedQuestions(
          filters,
          pageSize,
          isLoadMore ? (lastDoc ?? undefined) : undefined,
        );

        if (isLoadMore) {
          setQuestions((prev) => [...prev, ...result.questions]);
        } else {
          setQuestions(result.questions);
        }

        setLastDoc(result.lastDoc ?? null);
        setHasMore(result.hasMore);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load questions",
        );
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [filters, pageSize, lastDoc],
  );

  const refresh = useCallback(async () => {
    setLastDoc(null);
    setHasMore(true);
    await fetchQuestions(false);
  }, [fetchQuestions]);

  const setFilters = useCallback((newFilters: QuestionFilters) => {
    setFiltersState(newFilters);
    setLastDoc(null);
    setHasMore(true);
  }, []);

  useEffect(() => {
    fetchQuestions(false);
  }, [fetchQuestions]);

  // Optional real-time subscription for live updates
  useEffect(() => {
    if (!useRealtime) return;

    const unsubscribe = subscribeToPublishedQuestions(
      (fetchedQuestions) => {
        // For real-time, we replace the first page
        setQuestions(fetchedQuestions);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
      filters,
      pageSize,
    );

    return () => unsubscribe();
  }, [useRealtime, filters, pageSize]);

  return {
    questions,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore: () => fetchQuestions(true),
    refresh,
    setFilters,
    filters,
  };
}
