import { useCallback, useMemo } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { InterviewQuestion } from "@/types/questions";
import {
  RecentlyViewedQuestion,
  CompletedQuestion,
  LearningProgress,
  MAX_RECENTLY_VIEWED,
} from "@/types/learning";

const RECENTLY_VIEWED_KEY = "react-important-questions-recently-viewed";
const COMPLETED_QUESTIONS_KEY = "react-important-questions-completed";

/**
 * Convert an InterviewQuestion to a RecentlyViewedQuestion for storage
 */
function questionToRecentlyViewed(
  question: InterviewQuestion,
): RecentlyViewedQuestion {
  return {
    questionId: question.id,
    questionSlug: question.slug,
    questionTitle: question.question,
    topic: question.topic,
    difficulty: question.difficulty,
    viewedAt: new Date(),
  };
}

/**
 * Convert an InterviewQuestion to a CompletedQuestion for storage
 */
function questionToCompleted(question: InterviewQuestion): CompletedQuestion {
  return {
    questionId: question.id,
    questionSlug: question.slug,
    questionTitle: question.question,
    topic: question.topic,
    difficulty: question.difficulty,
    completedAt: new Date(),
  };
}

/**
 * Hook for managing learning features (recently viewed, completed questions, progress)
 */
export function useLearning() {
  const [storedRecentlyViewed, setStoredRecentlyViewed] = useLocalStorage<
    RecentlyViewedQuestion[]
  >(RECENTLY_VIEWED_KEY, []);

  const [storedCompleted, setStoredCompleted] = useLocalStorage<
    CompletedQuestion[]
  >(COMPLETED_QUESTIONS_KEY, []);

  // Add a question to recently viewed
  const addRecentlyViewed = useCallback(
    (question: InterviewQuestion): void => {
      setStoredRecentlyViewed((prev) => {
        // Remove if already exists
        const filtered = prev.filter((q) => q.questionId !== question.id);
        // Add to front
        const updated = [questionToRecentlyViewed(question), ...filtered];
        // Limit to MAX_RECENTLY_VIEWED
        return updated.slice(0, MAX_RECENTLY_VIEWED);
      });
    },
    [setStoredRecentlyViewed],
  );

  // Get recently viewed questions
  const recentlyViewed = useMemo(
    () =>
      [...storedRecentlyViewed].sort(
        (a, b) =>
          new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime(),
      ),
    [storedRecentlyViewed],
  );

  // Check if a question is completed
  const isCompleted = useCallback(
    (questionId: string): boolean => {
      return storedCompleted.some((q) => q.questionId === questionId);
    },
    [storedCompleted],
  );

  // Mark a question as completed
  const markCompleted = useCallback(
    (question: InterviewQuestion): boolean => {
      if (isCompleted(question.id)) {
        return false; // Already completed
      }
      const completed = questionToCompleted(question);
      setStoredCompleted((prev) => [...prev, completed]);
      return true;
    },
    [isCompleted, setStoredCompleted],
  );

  // Unmark a question as completed
  const unmarkCompleted = useCallback(
    (questionId: string): void => {
      setStoredCompleted((prev) =>
        prev.filter((q) => q.questionId !== questionId),
      );
    },
    [setStoredCompleted],
  );

  // Toggle completed status
  const toggleCompleted = useCallback(
    (question: InterviewQuestion): boolean => {
      if (isCompleted(question.id)) {
        unmarkCompleted(question.id);
        return false; // Unmarked
      } else {
        markCompleted(question);
        return true; // Marked
      }
    },
    [isCompleted, markCompleted, unmarkCompleted],
  );

  // Get completed questions
  const completedQuestions = useMemo(
    () =>
      [...storedCompleted].sort(
        (a, b) =>
          new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
      ),
    [storedCompleted],
  );

  // Get completed count
  const completedCount = useMemo(
    () => storedCompleted.length,
    [storedCompleted],
  );

  // Reset all progress
  const resetProgress = useCallback((): void => {
    setStoredRecentlyViewed([]);
    setStoredCompleted([]);
  }, [setStoredRecentlyViewed, setStoredCompleted]);

  // Get learning progress (requires total questions count from outside)
  const getProgress = useCallback(
    (totalQuestions: number): LearningProgress => {
      return {
        totalQuestions,
        completedCount,
        completionRate:
          totalQuestions > 0 ? (completedCount / totalQuestions) * 100 : 0,
        recentlyViewed,
        completedQuestions,
      };
    },
    [completedCount, recentlyViewed, completedQuestions],
  );

  // Get random question from a list (excluding completed if desired)
  const getRandomQuestion = useCallback(
    (
      questions: InterviewQuestion[],
      excludeCompleted = true,
    ): InterviewQuestion | null => {
      if (questions.length === 0) return null;

      let availableQuestions = questions;
      if (excludeCompleted) {
        availableQuestions = questions.filter((q) => !isCompleted(q.id));
      }

      if (availableQuestions.length === 0) return null;

      const randomIndex = Math.floor(Math.random() * availableQuestions.length);
      return availableQuestions[randomIndex];
    },
    [isCompleted],
  );

  // Get interview practice questions (random selection from different topics/difficulties)
  const getInterviewPracticeQuestions = useCallback(
    (questions: InterviewQuestion[], count = 5): InterviewQuestion[] => {
      if (questions.length === 0) return [];

      // Group by topic and difficulty for variety
      const grouped = new Map<string, InterviewQuestion[]>();

      questions.forEach((q) => {
        const key = `${q.topic}-${q.difficulty}`;
        if (!grouped.has(key)) {
          grouped.set(key, []);
        }
        grouped.get(key)!.push(q);
      });

      // Pick from different groups
      const groups = Array.from(grouped.values());
      const selected: InterviewQuestion[] = [];

      while (selected.length < count && groups.length > 0) {
        const groupIndex = Math.floor(Math.random() * groups.length);
        const group = groups[groupIndex];

        if (group.length > 0) {
          const questionIndex = Math.floor(Math.random() * group.length);
          selected.push(group[questionIndex]);
          group.splice(questionIndex, 1);
        }

        if (group.length === 0) {
          groups.splice(groupIndex, 1);
        }
      }

      return selected;
    },
    [],
  );

  return {
    // Recently viewed
    recentlyViewed,
    addRecentlyViewed,

    // Completed questions
    completedQuestions,
    completedCount,
    isCompleted,
    markCompleted,
    unmarkCompleted,
    toggleCompleted,

    // Progress
    getProgress,
    resetProgress,

    // Random/Interview modes
    getRandomQuestion,
    getInterviewPracticeQuestions,
  };
}
