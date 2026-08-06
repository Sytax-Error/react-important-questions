import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import { DifficultyBadge, TopicBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Bookmark } from "@/types/bookmarks";
import { format } from "date-fns";

const MotionCard = motion(Card);
const MotionLink = motion(Link);
const MotionDiv = motion.div;
const MotionButton = motion(Button);

// Framer Motion variants for consistent animations
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

const removeButtonVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

interface BookmarkCardProps {
  bookmark: Bookmark;
  onRemove: (questionId: string) => void;
  showRemoveButton?: boolean;
}

/**
 * Individual bookmark card for the bookmarks page
 */
export function BookmarkCard({
  bookmark,
  onRemove,
  showRemoveButton = true,
}: BookmarkCardProps) {
  return (
    <MotionLink
      to={`/questions/${bookmark.questionSlug}`}
      className="group block"
      variants={cardVariants}
      whileHover={{ y: -4 }}
    >
      <MotionCard
        hover
        className="h-full flex flex-col bg-semantic-bg-primary border-semantic-border-primary"
      >
        <CardContent className="p-6 flex flex-col flex-1">
          <MotionDiv className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <TopicBadge topic={bookmark.topic} size="sm" />
              <DifficultyBadge
                difficulty={
                  bookmark.difficulty as
                    | "Beginner"
                    | "Intermediate"
                    | "Advanced"
                }
                size="sm"
              />
            </div>
            {showRemoveButton && (
              <MotionButton
                variants={removeButtonVariants}
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onRemove(bookmark.questionId);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-semantic-text-tertiary hover:text-semantic-status-danger-text"
                aria-label="Remove bookmark"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg
                  className="h-4 w-4"
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
              </MotionButton>
            )}
          </MotionDiv>
          <h3 className="text-lg font-semibold text-semantic-text-primary group-hover:text-semantic-interactive-primary transition-colors line-clamp-2 flex-1">
            {bookmark.questionTitle}
          </h3>
          <MotionDiv className="mt-4 flex items-center gap-2 text-xs text-semantic-text-tertiary">
            <span>
              Saved: {format(new Date(bookmark.savedAt), "MMM d, yyyy")}
            </span>
          </MotionDiv>
        </CardContent>
      </MotionCard>
    </MotionLink>
  );
}
