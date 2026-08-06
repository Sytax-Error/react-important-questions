import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import { Bookmark } from "@/types/bookmarks";
import { BookmarkCard } from "./BookmarkCard";

const MotionDiv = motion.div;

// Framer Motion variants for consistent animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

interface BookmarkListProps {
  bookmarks: Bookmark[];
  onRemoveBookmark: (questionId: string) => void;
  loading?: boolean;
  emptyMessage?: string;
  emptyAction?: React.ReactNode;
}

/**
 * Bookmark list/grid container for the bookmarks page
 */
export function BookmarkList({
  bookmarks,
  onRemoveBookmark,
  loading = false,
  emptyMessage = "No bookmarks yet",
  emptyAction,
}: BookmarkListProps) {
  if (loading) {
    return (
      <MotionDiv
        variants={containerVariants}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {[...Array(6)].map((_, i) => (
          <MotionDiv
            key={i}
            variants={cardVariants}
            className="h-[300px] animate-pulse"
          >
            <Card className="h-full bg-semantic-bg-tertiary border-semantic-border-tertiary">
              <CardContent className="p-6">
                <div className="h-4 bg-semantic-border-primary rounded w-3/4 mb-3" />
                <div className="h-6 bg-semantic-border-primary rounded w-full mb-2" />
                <div className="h-4 bg-semantic-border-primary rounded w-1/2" />
              </CardContent>
            </Card>
          </MotionDiv>
        ))}
      </MotionDiv>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <MotionDiv
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        className="text-center py-12"
      >
        <Card className="bg-semantic-bg-primary border-semantic-border-primary">
          <CardContent>
            <svg
              className="mx-auto h-12 w-12 text-semantic-text-tertiary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-semantic-text-primary">
              {emptyMessage}
            </h3>
            <p className="mt-2 text-sm text-semantic-text-secondary">
              Start browsing questions and click the bookmark icon to save them
              for later.
            </p>
            {emptyAction && <div className="mt-6">{emptyAction}</div>}
          </CardContent>
        </Card>
      </MotionDiv>
    );
  }

  return (
    <MotionDiv
      variants={containerVariants}
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {bookmarks.map((bookmark) => (
        <BookmarkCard
          key={bookmark.questionId}
          bookmark={bookmark}
          onRemove={onRemoveBookmark}
        />
      ))}
    </MotionDiv>
  );
}
