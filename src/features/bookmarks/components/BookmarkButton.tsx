import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { useBookmarks } from "../hooks/useBookmarks";
import { InterviewQuestion } from "@/types/questions";

const MotionButton = motion(Button);

// Framer Motion variants for consistent animations
const iconVariants = {
  bookmarked: {
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 20,
    },
  },
  notBookmarked: {
    scale: 0.8,
    rotate: 10,
    transition: {
      duration: 0.2,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

interface BookmarkButtonProps {
  question: InterviewQuestion;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

/**
 * Bookmark toggle button component
 * Shows filled bookmark when saved, outline when not saved
 */
export function BookmarkButton({
  question,
  size = "md",
  showLabel = false,
  className = "",
}: BookmarkButtonProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const [isToggling, setIsToggling] = useState(false);
  const bookmarked = isBookmarked(question.id);

  const handleClick = async () => {
    setIsToggling(true);
    // Small delay for visual feedback
    await new Promise((resolve) => setTimeout(resolve, 150));
    toggleBookmark(question);
    setIsToggling(false);
  };

  const buttonSizeClasses = {
    sm: "p-1.5",
    md: "p-2",
    lg: "p-3",
  };

  const iconSizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <MotionButton
      variant={bookmarked ? "primary" : "outline"}
      size={size}
      onClick={handleClick}
      disabled={isToggling}
      className={`${buttonSizeClasses[size]} ${className}`}
      aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
      aria-pressed={bookmarked}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.svg
        className={`${iconSizeClasses[size]} ${bookmarked ? "fill-current text-semantic-interactive-primary" : ""}`}
        fill={bookmarked ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
        variants={iconVariants}
        animate={bookmarked ? "bookmarked" : "notBookmarked"}
        initial="notBookmarked"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
        />
      </motion.svg>
      {showLabel && (
        <span className="ml-1 text-sm font-medium text-semantic-text-primary">
          {bookmarked ? "Saved" : "Save"}
        </span>
      )}
    </MotionButton>
  );
}
