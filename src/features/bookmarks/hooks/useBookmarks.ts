import { useCallback, useMemo } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { InterviewQuestion } from "@/types/questions";
import { Bookmark } from "@/types/bookmarks";

const BOOKMARKS_STORAGE_KEY = "react-important-questions-bookmarks";

/**
 * Convert an InterviewQuestion to a Bookmark for storage
 */
function questionToBookmark(question: InterviewQuestion): Bookmark {
  return {
    questionId: question.id,
    questionSlug: question.slug,
    questionTitle: question.question,
    topic: question.topic,
    difficulty: question.difficulty,
    savedAt: new Date(),
  };
}

/**
 * Hook for managing bookmarks in localStorage
 */
export function useBookmarks() {
  const [storedBookmarks, setStoredBookmarks] = useLocalStorage<Bookmark[]>(
    BOOKMARKS_STORAGE_KEY,
    [],
  );

  // Check if a question is bookmarked
  const isBookmarked = useCallback(
    (questionId: string): boolean => {
      return storedBookmarks.some((b) => b.questionId === questionId);
    },
    [storedBookmarks],
  );

  // Add a bookmark
  const addBookmark = useCallback(
    (question: InterviewQuestion): boolean => {
      if (isBookmarked(question.id)) {
        return false; // Already bookmarked
      }
      const bookmark = questionToBookmark(question);
      setStoredBookmarks((prev) => [...prev, bookmark]);
      return true;
    },
    [isBookmarked, setStoredBookmarks],
  );

  // Remove a bookmark
  const removeBookmark = useCallback(
    (questionId: string): void => {
      setStoredBookmarks((prev) =>
        prev.filter((b) => b.questionId !== questionId),
      );
    },
    [setStoredBookmarks],
  );

  // Toggle bookmark (add if not present, remove if present)
  const toggleBookmark = useCallback(
    (question: InterviewQuestion): boolean => {
      if (isBookmarked(question.id)) {
        removeBookmark(question.id);
        return false; // Removed
      } else {
        addBookmark(question);
        return true; // Added
      }
    },
    [isBookmarked, addBookmark, removeBookmark],
  );

  // Clear all bookmarks
  const clearAllBookmarks = useCallback((): void => {
    setStoredBookmarks([]);
  }, [setStoredBookmarks]);

  // Get bookmark count
  const bookmarkCount = useMemo(
    () => storedBookmarks.length,
    [storedBookmarks],
  );

  // Get bookmarks sorted by most recently saved
  const sortedBookmarks = useMemo(
    () =>
      [...storedBookmarks].sort(
        (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime(),
      ),
    [storedBookmarks],
  );

  return {
    bookmarks: sortedBookmarks,
    bookmarkCount,
    isBookmarked,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    clearAllBookmarks,
  };
}
