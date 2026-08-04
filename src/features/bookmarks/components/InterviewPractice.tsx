import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TopicBadge, DifficultyBadge } from "@/components/ui/Badge";
import { useLearning } from "../hooks/useLearning";
import { InterviewQuestion } from "@/types/questions";
import { Link } from "react-router-dom";

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
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No questions available for practice
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Interview Practice Mode</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerate}
            disabled={isGenerating}
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
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {practiceQuestions.length > 0 && (
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>
              Question {currentIndex + 1} of {practiceQuestions.length}
            </span>
            <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-600 dark:bg-primary-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

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
            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-2 mb-4">
              {currentQuestion.question}
            </h4>
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
              >
                Previous
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() =>
                  setCurrentIndex((prev) =>
                    Math.min(practiceQuestions.length - 1, prev + 1),
                  )
                }
                disabled={currentIndex === practiceQuestions.length - 1}
              >
                Next
              </Button>
            </div>
          </Link>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Click "New Set" to generate practice questions
            </p>
            <Button onClick={handleGenerate} disabled={isGenerating}>
              Generate Practice Set
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
