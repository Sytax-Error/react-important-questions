import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TopicBadge, DifficultyBadge } from "@/components/ui/Badge";
import { useLearning } from "../hooks/useLearning";
import { InterviewQuestion } from "@/types/questions";
import { Link } from "react-router-dom";

const MotionCard = motion(Card);
const MotionDiv = motion.div;
const MotionLink = motion(Link);
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

const questionVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

interface RandomQuestionProps {
  questions: InterviewQuestion[];
  excludeCompleted?: boolean;
  className?: string;
}

/**
 * Random question picker component
 */
export function RandomQuestion({
  questions,
  excludeCompleted = true,
  className = "",
}: RandomQuestionProps) {
  const { getRandomQuestion } = useLearning();
  const [currentQuestion, setCurrentQuestion] =
    useState<InterviewQuestion | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetRandom = () => {
    setIsLoading(true);
    // Small delay for visual feedback
    setTimeout(() => {
      const question = getRandomQuestion(questions, excludeCompleted);
      setCurrentQuestion(question);
      setIsLoading(false);
    }, 300);
  };

  // Get initial random question
  if (!currentQuestion && !isLoading) {
    handleGetRandom();
  }

  if (questions.length === 0) {
    return (
      <MotionCard
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        className={className}
      >
        <CardContent className="p-6 text-center">
          <p className="text-semantic-text-secondary">No questions available</p>
        </CardContent>
      </MotionCard>
    );
  }

  return (
    <MotionCard
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={className}
    >
      <CardContent className="p-6">
        <MotionDiv
          variants={cardVariants}
          className="flex items-center justify-between mb-4"
        >
          <h3 className="text-lg font-semibold text-semantic-text-primary">
            Random Question
          </h3>
          <MotionButton
            variant="outline"
            size="sm"
            onClick={handleGetRandom}
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <svg
                className="animate-spin h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <>
                <svg
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                New Question
              </>
            )}
          </MotionButton>
        </MotionDiv>

        {currentQuestion ? (
          <MotionLink
            to={`/questions/${currentQuestion.slug}`}
            className="block"
            variants={questionVariants}
            whileHover={{ x: 4 }}
          >
            <MotionDiv className="flex items-center gap-2 mb-3">
              <TopicBadge topic={currentQuestion.topic} size="sm" />
              <DifficultyBadge
                difficulty={
                  currentQuestion.difficulty as
                    | "Beginner"
                    | "Intermediate"
                    | "Advanced"
                }
                size="sm"
              />
            </MotionDiv>
            <h4 className="text-lg font-medium text-semantic-text-primary hover:text-semantic-interactive-primary transition-colors line-clamp-2">
              {currentQuestion.question}
            </h4>
          </MotionLink>
        ) : (
          <MotionDiv
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="text-center py-4"
          >
            <p className="text-semantic-text-secondary">
              {excludeCompleted
                ? "All questions completed!"
                : "No questions available"}
            </p>
          </MotionDiv>
        )}
      </CardContent>
    </MotionCard>
  );
}
