import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import {
  StatusBadge,
  TopicBadge,
  DifficultyBadge,
} from "@/components/ui/Badge";

import { Input } from "@/components/ui/Input";
import { PageLoader } from "@/components/ui/LoadingSpinner";
import { DeleteConfirmationDialog } from "@/components/ui/DeleteConfirmationDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  subscribeToAllQuestions,
  deleteQuestion,
  publishQuestion,
  unpublishQuestion,
  getQuestionStats,
} from "@/features/questions/services/questionService";
import { InterviewQuestion } from "@/types/questions";
import { useAuth } from "@/features/auth";

export function AdminQuestionList() {
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [topicFilter, setTopicFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<
    "Beginner" | "Intermediate" | "Advanced" | ""
  >("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "published" | "draft"
  >("all");
  const [stats, setStats] = useState<{
    totalQuestions: number;
    publishedQuestions: number;
    draftQuestions: number;
    questionsByDifficulty: Record<
      "Beginner" | "Intermediate" | "Advanced",
      number
    >;
    questionsByTopic: Record<string, number>;
    recentlyUpdated: InterviewQuestion[];
  } | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    questionId: string | null;
    questionTitle: string | null;
  }>({ open: false, questionId: null, questionTitle: null });
  const [previewDialog, setPreviewDialog] = useState<{
    open: boolean;
    question: InterviewQuestion | null;
  }>({ open: false, question: null });
  const { user } = useAuth();

  // Subscribe to real-time question updates
  useEffect(() => {
    const unsubscribe = subscribeToAllQuestions(
      (questionsData) => {
        setQuestions(questionsData);
        setLoading(false);
      },
      (error) => {
        setError("Failed to load questions");
        setLoading(false);
        console.error(error);
      },
    );

    // Load initial stats
    const loadStats = async () => {
      try {
        const statsData = await getQuestionStats();
        setStats(statsData);
      } catch (err) {
        console.error("Failed to load stats:", err);
      }
    };

    loadStats();

    return unsubscribe;
  }, []);

  // Filter questions based on search and filters
  const filteredQuestions = useCallback(() => {
    return questions.filter((q) => {
      if (search) {
        const searchLower = search.toLowerCase();
        const matchesQuestion = q.question.toLowerCase().includes(searchLower);
        const matchesShortAnswer = q.shortAnswer
          .toLowerCase()
          .includes(searchLower);
        if (!matchesQuestion && !matchesShortAnswer) return false;
      }
      if (topicFilter && q.topic !== topicFilter) return false;
      if (difficultyFilter && q.difficulty !== difficultyFilter) return false;
      if (statusFilter === "published" && !q.isPublished) return false;
      if (statusFilter === "draft" && q.isPublished) return false;
      return true;
    });
  }, [questions, search, topicFilter, difficultyFilter, statusFilter]);

  const handleDeleteConfirm = (question: InterviewQuestion) => {
    setDeleteDialog({
      open: true,
      questionId: question.id,
      questionTitle: question.question,
    });
  };

  const handleDeleteConfirmYes = async () => {
    if (!deleteDialog.questionId || !user) return;

    try {
      await deleteQuestion(deleteDialog.questionId);
      setDeleteDialog({ open: false, questionId: null, questionTitle: null });
    } catch (err) {
      setError("Failed to delete question");
      console.error(err);
    }
  };

  const handlePublish = async (question: InterviewQuestion) => {
    if (!user) return;
    try {
      await publishQuestion(question.id, user.uid);
    } catch (err) {
      setError("Failed to publish question");
      console.error(err);
    }
  };

  const handleUnpublish = async (question: InterviewQuestion) => {
    if (!user) return;
    try {
      await unpublishQuestion(question.id, user.uid);
    } catch (err) {
      setError("Failed to unpublish question");
      console.error(err);
    }
  };

  const handlePreview = (question: InterviewQuestion) => {
    setPreviewDialog({ open: true, question });
  };

  if (loading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Manage Questions
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Create, edit, publish, and manage interview questions
            </p>
          </div>
          <div className="flex items-center gap-4">
            {stats && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {stats.totalQuestions} questions • {stats.publishedQuestions}{" "}
                published • {stats.draftQuestions} drafts
              </div>
            )}
          </div>
        </div>

        {/* Stats Overview */}
        {stats && (
          <Card>
            <CardContent className="grid gap-6 sm:grid-cols-4 text-center py-6">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Questions
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stats.totalQuestions}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Published
                </p>
                <p className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">
                  {stats.publishedQuestions}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Drafts
                </p>
                <p className="mt-1 text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {stats.draftQuestions}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Topics
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {Object.keys(stats.questionsByTopic).length}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-4 sm:grid-cols-4">
              <div className="sm:col-span-2">
                <Input
                  label="Search"
                  type="search"
                  placeholder="Search questions..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  leftIcon={
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="topic-filter"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Topic
                </label>
                <select
                  id="topic-filter"
                  value={topicFilter}
                  onChange={(e) => setTopicFilter(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">All Topics</option>
                  {[...new Set(questions.map((q) => q.topic))]
                    .sort()
                    .map((topic) => (
                      <option key={topic} value={topic}>
                        {topic}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="difficulty-filter"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Difficulty
                </label>
                <select
                  id="difficulty-filter"
                  value={difficultyFilter}
                  onChange={(e) =>
                    setDifficultyFilter(
                      e.target.value as
                        | "Beginner"
                        | "Intermediate"
                        | "Advanced"
                        | "",
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">All Difficulties</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="status-filter"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Status
                </label>
                <select
                  id="status-filter"
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(
                      e.target.value as "all" | "published" | "draft",
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions Table */}
        <Card>
          <CardContent>
            {filteredQuestions().length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                  No questions found
                </h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  Try adjusting your filters or create a new question.
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                          Question
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                          Topic
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                          Difficulty
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                          Updated
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredQuestions().map((question) => (
                        <tr
                          key={question.id}
                          className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        >
                          <td className="py-3 px-4">
                            <a
                              href={`/admin/questions/${question.id}/edit`}
                              className="font-medium text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 max-w-xs truncate block"
                            >
                              {question.question}
                            </a>
                          </td>
                          <td className="py-3 px-4">
                            <TopicBadge topic={question.topic} />
                          </td>
                          <td className="py-3 px-4">
                            <DifficultyBadge difficulty={question.difficulty} />
                          </td>
                          <td className="py-3 px-4">
                            <StatusBadge
                              status={
                                question.isPublished ? "published" : "draft"
                              }
                            />
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">
                            {question.updatedAt.toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <a
                                href={`/admin/questions/${question.id}/edit`}
                                className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                              >
                                Edit
                              </a>
                              <button
                                onClick={() => handlePreview(question)}
                                className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                              >
                                Preview
                              </button>
                              {question.isPublished ? (
                                <button
                                  onClick={() => handleUnpublish(question)}
                                  className="text-sm font-medium text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300"
                                >
                                  Unpublish
                                </button>
                              ) : (
                                <button
                                  onClick={() => handlePublish(question)}
                                  className="text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                                >
                                  Publish
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteConfirm(question)}
                                className="text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination placeholder - would need cursor-based pagination for large datasets */}
                <div className="mt-6 flex items-center justify-between">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Showing {filteredQuestions().length} of {questions.length}{" "}
                    questions
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      <DeleteConfirmationDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog((prev) => ({ ...prev, open }))}
        onConfirm={handleDeleteConfirmYes}
      />
      <Dialog
        open={previewDialog.open}
        onOpenChange={(open) => setPreviewDialog((prev) => ({ ...prev, open }))}
      >
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Preview: {previewDialog.question?.question}
            </DialogTitle>
          </DialogHeader>
          {previewDialog.question && (
            <div className="space-y-6 py-4">
              <div className="flex items-center gap-2">
                <TopicBadge topic={previewDialog.question.topic} />
                <DifficultyBadge
                  difficulty={previewDialog.question.difficulty}
                />
                <StatusBadge
                  status={
                    previewDialog.question.isPublished ? "published" : "draft"
                  }
                />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Short Answer
                </h4>
                <p className="mt-1 text-gray-900 dark:text-gray-100">
                  {previewDialog.question.shortAnswer}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Detailed Answer
                </h4>
                <div className="mt-1 prose dark:prose-invert max-w-none">
                  {previewDialog.question.detailedAnswer
                    .split("\n")
                    .map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                </div>
              </div>
              {previewDialog.question.code && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Code Example
                  </h4>
                  <pre className="mt-1 rounded-lg bg-gray-100 dark:bg-gray-800 p-4 overflow-x-auto">
                    <code
                      className={`language-${previewDialog.question.language || "text"}`}
                    >
                      {previewDialog.question.code}
                    </code>
                  </pre>
                </div>
              )}
              {previewDialog.question.importantPoints.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Important Points
                  </h4>
                  <ul className="mt-1 list-disc list-inside space-y-1 text-gray-900 dark:text-gray-100">
                    {previewDialog.question.importantPoints.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </div>
              )}
              {previewDialog.question.followUpQuestions.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Follow-up Questions
                  </h4>
                  <ul className="mt-1 list-disc list-inside space-y-1 text-gray-900 dark:text-gray-100">
                    {previewDialog.question.followUpQuestions.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}
              {previewDialog.question.tags.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Tags
                  </h4>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {previewDialog.question.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-primary-100 dark:bg-primary-900/30 px-2.5 py-0.5 text-xs font-medium text-primary-700 dark:text-primary-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
