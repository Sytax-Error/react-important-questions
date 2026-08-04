import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { DeleteConfirmationDialog } from "../../components/ui/DeleteConfirmationDialog";
import { BookmarkList } from "../../features/bookmarks";
import { useBookmarks } from "../../features/bookmarks/hooks/useBookmarks";
import { LearningProgress } from "../../features/bookmarks/components/LearningProgress";
import { usePublicQuestionMeta } from "../../features/questions/hooks/usePublicQuestionMeta";

export function BookmarksPage() {
  const { bookmarks, bookmarkCount, removeBookmark, clearAllBookmarks } =
    useBookmarks();
  const { totalQuestions } = usePublicQuestionMeta();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [removeTargetId, setRemoveTargetId] = useState<string | null>(null);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

  const handleRemoveBookmark = (questionId: string) => {
    setRemoveTargetId(questionId);
    setShowRemoveConfirm(true);
  };

  const confirmRemoveBookmark = () => {
    if (removeTargetId) {
      removeBookmark(removeTargetId);
      setRemoveTargetId(null);
    }
    setShowRemoveConfirm(false);
  };

  const confirmClearAll = () => {
    clearAllBookmarks();
    setShowClearConfirm(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Bookmarks
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Your saved interview questions for quick reference
            <span className="ml-2 text-sm font-medium text-primary-600 dark:text-primary-400">
              ({bookmarkCount})
            </span>
          </p>
        </div>
        {bookmarkCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowClearConfirm(true)}
            className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 dark:border-red-800 dark:text-red-400 dark:hover:text-red-300"
          >
            <svg
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Clear All
          </Button>
        )}
      </div>

      {/* Learning Progress */}
      <LearningProgress totalQuestions={totalQuestions} />

      <BookmarkList
        bookmarks={bookmarks}
        onRemoveBookmark={handleRemoveBookmark}
        emptyAction={
          <Link
            to="/questions"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors"
          >
            Browse Questions
          </Link>
        }
      />

      {/* Remove Single Bookmark Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={showRemoveConfirm}
        onClose={() => {
          setShowRemoveConfirm(false);
          setRemoveTargetId(null);
        }}
        onConfirm={confirmRemoveBookmark}
        title="Remove Bookmark"
        message="Are you sure you want to remove this question from your bookmarks?"
        confirmText="Remove"
        variant="destructive"
      />

      {/* Clear All Bookmarks Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={confirmClearAll}
        title="Clear All Bookmarks"
        message="Are you sure you want to remove all bookmarks? This action cannot be undone."
        confirmText="Clear All"
        variant="destructive"
      />
    </div>
  );
}
