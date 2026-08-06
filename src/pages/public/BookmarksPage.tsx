import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../../components/ui/Button";
import { DeleteConfirmationDialog } from "../../components/ui/DeleteConfirmationDialog";
import { BookmarkList } from "../../features/bookmarks";
import { useBookmarks } from "../../features/bookmarks/hooks/useBookmarks";
import { LearningProgress } from "../../features/bookmarks/components/LearningProgress";
import { usePublicQuestionMeta } from "../../features/questions/hooks/usePublicQuestionMeta";

const MotionDiv = motion.div;
const MotionLink = motion(Link);
const MotionButton = motion(Button);

// Framer Motion variants for consistent animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

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
    <MotionDiv
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8 px-4 sm:px-6 lg:px-8"
    >
      <MotionDiv variants={headerVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-semantic-text-primary">
            Bookmarks
          </h1>
          <p className="mt-2 text-semantic-text-secondary">
            Your saved interview questions for quick reference
            <span className="ml-2 text-sm font-medium text-semantic-interactive-primary">
              ({bookmarkCount})
            </span>
          </p>
        </div>
        {bookmarkCount > 0 && (
          <MotionButton
            variant="outline"
            size="sm"
            onClick={() => setShowClearConfirm(true)}
            className="text-semantic-status-danger border-semantic-status-danger-border hover:bg-semantic-status-danger-bg dark:hover:bg-semantic-status-danger-bg/20"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
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
          </MotionButton>
        )}
      </MotionDiv>

      {/* Learning Progress */}
      <MotionDiv variants={sectionVariants}>
        <LearningProgress totalQuestions={totalQuestions} />
      </MotionDiv>

      <MotionDiv variants={sectionVariants}>
        <BookmarkList
          bookmarks={bookmarks}
          onRemoveBookmark={handleRemoveBookmark}
          emptyAction={
            <MotionLink
              to="/questions"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-semantic-text-inverse bg-semantic-interactive-primary rounded-lg hover:bg-semantic-interactive-primary-hover focus:outline-none focus:ring-2 focus:ring-semantic-interactive-primary focus:ring-offset-2 dark:focus:ring-offset-semantic-bg-primary transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Browse Questions
            </MotionLink>
          }
        />
      </MotionDiv>

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
    </MotionDiv>
  );
}