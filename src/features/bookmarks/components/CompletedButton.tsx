import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { useLearning } from "../hooks/useLearning";
import { InterviewQuestion } from "@/types/questions";

const MotionButton = motion(Button);

// Framer Motion variants for consistent animations
const iconVariants = {
  completed: {
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 20,
    },
  },
  incomplete: {
    scale: 0.8,
    rotate: -10,
    transition: {
      duration: 0.2,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

interface CompletedButtonProps {
  question: InterviewQuestion;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

/**
 * Completed toggle button component
 * Shows filled check when completed, outline when not completed
 */
export function CompletedButton({
  question,
  size = "md",
  showLabel = false,
  className = "",
}: CompletedButtonProps) {
  const { isCompleted, toggleCompleted } = useLearning();
  const [isToggling, setIsToggling] = useState(false);
  const completed = isCompleted(question.id);

  const handleClick = async () => {
    setIsToggling(true);
    // Small delay for visual feedback
    await new Promise((resolve) => setTimeout(resolve, 150));
    toggleCompleted(question);
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
      variant={completed ? "primary" : "outline"}
      size={size}
      onClick={handleClick}
      disabled={isToggling}
      className={`${buttonSizeClasses[size]} ${className}`}
      aria-label={completed ? "Mark as incomplete" : "Mark as completed"}
      aria-pressed={completed}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.svg
        className={`${iconSizeClasses[size]} ${completed ? "fill-current text-semantic-status-success-text" : ""}`}
        fill={completed ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
        variants={iconVariants}
        animate={completed ? "completed" : "incomplete"}
        initial="incomplete"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </motion.svg>
      {showLabel && (
        <span className="ml-1 text-sm font-medium text-semantic-text-primary">
          {completed ? "Completed" : "Mark Done"}
        </span>
      )}
    </MotionButton>
  );
}
