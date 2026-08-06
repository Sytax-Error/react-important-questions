import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { useLearning } from "../hooks/useLearning";

const MotionCard = motion(Card);
const MotionDiv = motion.div;
const MotionButton = motion(Button);

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

const statVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

interface LearningProgressProps {
  totalQuestions: number;
  className?: string;
}

/**
 * Learning progress display component
 */
export function LearningProgress({
  totalQuestions,
  className = "",
}: LearningProgressProps) {
  const { getProgress, resetProgress } = useLearning();
  const progress = getProgress(totalQuestions);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleReset = () => {
    resetProgress();
    setShowResetConfirm(false);
  };

  return (
    <MotionCard
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={className}
    >
      <CardHeader>
        <MotionDiv variants={cardVariants}>
          <CardTitle className="text-lg text-semantic-text-primary">
            Learning Progress
          </CardTitle>
        </MotionDiv>
      </CardHeader>
      <CardContent className="space-y-4">
        <MotionDiv
          variants={containerVariants}
          className="flex flex-wrap items-center justify-around gap-6 text-center"
        >
          <MotionDiv variants={statVariants}>
            <p className="text-2xl font-bold text-semantic-text-primary">
              {progress.completedCount}
            </p>
            <p className="text-sm text-semantic-text-secondary">Completed</p>
          </MotionDiv>
          <MotionDiv variants={statVariants}>
            <p className="text-2xl font-bold text-semantic-text-primary">
              {totalQuestions}
            </p>
            <p className="text-sm text-semantic-text-secondary">
              Total Questions
            </p>
          </MotionDiv>
          <MotionDiv variants={statVariants}>
            <p className="text-2xl font-bold text-semantic-interactive-primary">
              {progress.completionRate.toFixed(1)}%
            </p>
            <p className="text-sm text-semantic-text-secondary">
              Completion Rate
            </p>
          </MotionDiv>
        </MotionDiv>

        <MotionDiv variants={cardVariants}>
          <Progress value={progress.completionRate} max={100} className="h-3" />
        </MotionDiv>

        <MotionDiv
          variants={cardVariants}
          className="flex flex-wrap items-center justify-between gap-2"
        >
          <p className="text-sm text-semantic-text-tertiary">
            {progress.recentlyViewed.length} recently viewed •{" "}
            {progress.completedQuestions.length} completed
          </p>
          <MotionButton
            variant="ghost"
            size="sm"
            onClick={() => setShowResetConfirm(true)}
            className="text-semantic-status-danger-text hover:text-semantic-status-danger-text-hover"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Reset Progress
          </MotionButton>
        </MotionDiv>

        {/* Reset Confirmation Dialog */}
        {showResetConfirm && (
          <MotionDiv
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          >
            <MotionDiv
              className="bg-semantic-bg-primary border-semantic-border-primary rounded-lg p-6 max-w-md w-full mx-4"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.2,
                ease: [0.25, 0.46, 0.45, 0.94] as const,
              }}
            >
              <h3 className="text-lg font-semibold text-semantic-text-primary mb-2">
                Reset Progress
              </h3>
              <p className="text-semantic-text-secondary mb-4">
                Are you sure you want to reset all learning progress? This will
                clear your recently viewed questions and completed questions.
                This action cannot be undone.
              </p>
              <MotionDiv
                variants={containerVariants}
                className="flex justify-end gap-3"
              >
                <MotionButton
                  variant="outline"
                  onClick={() => setShowResetConfirm(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </MotionButton>
                <MotionButton
                  variant="destructive"
                  onClick={handleReset}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Reset All
                </MotionButton>
              </MotionDiv>
            </MotionDiv>
          </MotionDiv>
        )}
      </CardContent>
    </MotionCard>
  );
}
