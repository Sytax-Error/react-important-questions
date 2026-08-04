import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { useLearning } from "../hooks/useLearning";

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
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Learning Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {progress.completedCount}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Completed
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {totalQuestions}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Questions
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {progress.completionRate.toFixed(1)}%
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Completion Rate
            </p>
          </div>
        </div>

        <Progress value={progress.completionRate} max={100} className="h-3" />

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {progress.recentlyViewed.length} recently viewed •{" "}
            {progress.completedQuestions.length} completed
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowResetConfirm(true)}
            className="text-red-600 hover:text-red-700"
          >
            Reset Progress
          </Button>
        </div>

        {/* Reset Confirmation Dialog */}
        {showResetConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Reset Progress
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Are you sure you want to reset all learning progress? This will
                clear your recently viewed questions and completed questions.
                This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowResetConfirm(false)}
                >
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleReset}>
                  Reset All
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
