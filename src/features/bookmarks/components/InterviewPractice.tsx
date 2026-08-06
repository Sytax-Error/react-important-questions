import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
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
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

interface InterviewPracticeProps {
  questions: InterviewQuestion[];
  questionCount?: number;
  className?: string;
}

/**
 * Interview practice mode component - generates a set of varied questions for practice
 */
export function InterviewPractice({
  questions,
  questionCount = 5,
  className = "",
}: InterviewPracticeProps) {
  const { getInterviewPracticeQuestions } = useLearning();
  const [practiceQuestions, setPracticeQuestions] = useState<
    InterviewQuestion[]
  >([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const selected = getInterviewPracticeQuestions(questions, questionCount);
      setPracticeQuestions(selected);
      setCurrentIndex(0);
      setIsGenerating(false);
    }, 300);
  };

  // Generate initial set
  if (practiceQuestions.length === 0 && !isGenerating) {
    handleGenerate();
  }

  const currentQuestion = practiceQuestions[currentIndex];
  const progress =
    practiceQuestions.length > 0
      ? ((currentIndex + 1) / practiceQuestions.length) * 100
      : 0;

  if (questions.length === 0) {
    return (
      <MotionCard
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        className={className}
      >
        <CardContent className="p-6 text-center">
          <p className="text-semantic-text-secondary">
            No questions available for practice
          </p>
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
      <CardHeader>
        <MotionDiv
          variants={cardVariants}
          className="flex items-center justify-between"
        >
          <CardTitle className="text-lg text-semantic-text-primary">
            Interview Practice Mode
          </CardTitle>
          <MotionButton
            variant="outline"
            size="sm"
            onClick={handleGenerate}
            disabled={isGenerating}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isGenerating ? (
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
                New Set
              </>
            )}
          </MotionButton>
        </MotionDiv>
      </CardHeader>
      <CardContent className="space-y-4">
        {practiceQuestions.length > 0 && (
          <MotionDiv
            variants={cardVariants}
            className="flex items-center justify-between text-sm text-semantic-text-tertiary"
          >
            <span>
              Question {currentIndex + 1} of {practiceQuestions.length}
            </span>
            <div className="w-32 h-2 bg-semantic-bg-tertiary rounded-full overflow-hidden">
              <MotionDiv
                className="h-full bg-semantic-interactive-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>
          </MotionDiv>
        )}

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
            <h4 className="text-lg font-medium text-semantic-text-primary hover:text-semantic-interactive-primary transition-colors line-clamp-2 mb-4">
              {currentQuestion.question}
            </h4>
            <MotionDiv
              variants={containerVariants}
              className="flex items-center justify-between"
            >
              <MotionButton
                variant="outline"
                size="sm"
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Previous
              </MotionButton>
              <MotionButton
                variant="primary"
                size="sm"
                onClick={() =>
                  setCurrentIndex((prev) =>
                    Math.min(practiceQuestions.length - 1, prev + 1),
                  )
                }
                disabled={currentIndex === practiceQuestions.length - 1}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Next
              </MotionButton>
            </MotionDiv>
          </MotionLink>
        ) : (
          <MotionDiv
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="text-center py-8"
          >
            <p className="text-semantic-text-secondary mb-4">
              Click "New Set" to generate practice questions
            </p>
            <MotionButton
              onClick={handleGenerate}
              disabled={isGenerating}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Generate Practice Set
            </MotionButton>
          </MotionDiv>
        )}
      </CardContent>
    </MotionCard>
  );
}
