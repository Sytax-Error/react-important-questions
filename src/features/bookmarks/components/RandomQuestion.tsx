import { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TopicBadge, DifficultyBadge } from "@/components/ui/Badge";
import { useLearning } from "../hooks/useLearning";
import { InterviewQuestion } from "@/types/questions";
import { Link } from "react-router-dom";

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
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No questions available
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Random Question
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={handleGetRandom}
            disabled={isLoading}
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
          </Button>
        </div>

        {currentQuestion ? (
          <Link to={`/questions/${currentQuestion.slug}`} className="block">
            <div className="flex items-center gap-2 mb-3">
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
            </div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-2">
              {currentQuestion.question}
            </h4>
          </Link>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">
            {excludeCompleted
              ? "All questions completed!"
              : "No questions available"}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
