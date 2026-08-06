import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  StatusBadge,
  TopicBadge,
  DifficultyBadge,
  Badge,
} from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { PageLoader } from "@/components/ui/LoadingSpinner";
import { DeleteConfirmationDialog } from "@/components/ui/DeleteConfirmationDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import {
  subscribeToAllQuestions,
  deleteQuestion,
  publishQuestion,
  unpublishQuestion,
  getQuestionStats,
} from "@/features/questions/services/questionService";
import { InterviewQuestion } from "@/types/questions";
import { useAuth } from "@/features/auth";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const MotionCard = motion(Card);
const MotionDiv = motion.div;
const MotionTr = motion.tr;
const MotionButton = motion.button;

// Framer Motion variants for consistent animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
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

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
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

const fieldVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

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
      <MotionDiv
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="text-center py-12"
      >
        <p className="text-semantic-status-danger-text">{error}</p>
      </MotionDiv>
    );
  }

  const uniqueTopics = [...new Set(questions.map((q) => q.topic))].sort();

  return (
    <>
      <MotionDiv
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-8"
      >
        <MotionDiv variants={cardVariants}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-semantic-text-primary">
                Manage Questions
              </h1>
              <p className="mt-2 text-semantic-text-secondary">
                Create, edit, publish, and manage interview questions
              </p>
            </div>
            <div className="flex items-center gap-4">
              {stats && (
                <div className="text-sm text-semantic-text-tertiary">
                  {stats.totalQuestions} questions • {stats.publishedQuestions}{" "}
                  published • {stats.draftQuestions} drafts
                </div>
              )}
            </div>
          </div>
        </MotionDiv>

        {/* Stats Overview */}
        {stats && (
          <MotionCard variants={cardVariants}>
            <CardContent className="grid gap-6 sm:grid-cols-4 text-center py-6">
              <MotionDiv variants={statVariants}>
                <p className="text-sm font-medium text-semantic-text-tertiary">
                  Total Questions
                </p>
                <p className="mt-1 text-2xl font-bold text-semantic-text-primary">
                  {stats.totalQuestions}
                </p>
              </MotionDiv>
              <MotionDiv variants={statVariants}>
                <p className="text-sm font-medium text-semantic-text-tertiary">
                  Published
                </p>
                <p className="mt-1 text-2xl font-bold text-semantic-status-success-text">
                  {stats.publishedQuestions}
                </p>
              </MotionDiv>
              <MotionDiv variants={statVariants}>
                <p className="text-sm font-medium text-semantic-text-tertiary">
                  Drafts
                </p>
                <p className="mt-1 text-2xl font-bold text-semantic-status-warning-text">
                  {stats.draftQuestions}
                </p>
              </MotionDiv>
              <MotionDiv variants={statVariants}>
                <p className="text-sm font-medium text-semantic-text-tertiary">
                  Topics
                </p>
                <p className="mt-1 text-2xl font-bold text-semantic-text-primary">
                  {Object.keys(stats.questionsByTopic).length}
                </p>
              </MotionDiv>
            </CardContent>
          </MotionCard>
        )}

        {/* Filters */}
        <MotionCard variants={cardVariants}>
          <CardContent className="pt-6">
            <MotionDiv
              variants={containerVariants}
              className="grid gap-4 sm:grid-cols-4"
            >
              <MotionDiv variants={fieldVariants} className="sm:col-span-2">
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
              </MotionDiv>
              <MotionDiv variants={fieldVariants}>
                <label
                  htmlFor="topic-filter"
                  className="block text-sm font-medium text-semantic-text-secondary mb-2"
                >
                  Topic
                </label>
                <Select
                  id="topic-filter"
                  value={topicFilter}
                  onChange={(e) => setTopicFilter(e.target.value)}
                  options={[
                    { value: "", label: "All Topics" },
                    ...uniqueTopics.map((topic) => ({
                      value: topic,
                      label: topic,
                    })),
                  ]}
                  placeholder="All Topics"
                />
              </MotionDiv>
              <MotionDiv variants={fieldVariants}>
                <label
                  htmlFor="difficulty-filter"
                  className="block text-sm font-medium text-semantic-text-secondary mb-2"
                >
                  Difficulty
                </label>
                <Select
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
                  options={[
                    { value: "", label: "All Difficulties" },
                    { value: "Beginner", label: "Beginner" },
                    { value: "Intermediate", label: "Intermediate" },
                    { value: "Advanced", label: "Advanced" },
                  ]}
                  placeholder="All Difficulties"
                />
              </MotionDiv>
              <MotionDiv variants={fieldVariants}>
                <label
                  htmlFor="status-filter"
                  className="block text-sm font-medium text-semantic-text-secondary mb-2"
                >
                  Status
                </label>
                <Select
                  id="status-filter"
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(
                      e.target.value as "all" | "published" | "draft",
                    )
                  }
                  options={[
                    { value: "all", label: "All Status" },
                    { value: "published", label: "Published" },
                    { value: "draft", label: "Draft" },
                  ]}
                  placeholder="All Status"
                />
              </MotionDiv>
            </MotionDiv>
          </CardContent>
        </MotionCard>

        {/* Questions Table */}
        <MotionCard variants={cardVariants}>
          <CardContent>
            {filteredQuestions().length === 0 ? (
              <MotionDiv
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                className="text-center py-12"
              >
                <svg
                  className="mx-auto h-12 w-12 text-semantic-text-tertiary"
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
                <h3 className="mt-4 text-lg font-medium text-semantic-text-primary">
                  No questions found
                </h3>
                <p className="mt-2 text-semantic-text-tertiary">
                  Try adjusting your filters or create a new question.
                </p>
              </MotionDiv>
            ) : (
              <>
                <MotionDiv
                  variants={containerVariants}
                  className="overflow-x-auto"
                >
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-semantic-border-primary">
                        <th className="text-left py-3 px-4 text-sm font-medium text-semantic-text-tertiary">
                          Question
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-semantic-text-tertiary">
                          Topic
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-semantic-text-tertiary">
                          Difficulty
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-semantic-text-tertiary">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-semantic-text-tertiary">
                          Updated
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-semantic-text-tertiary">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredQuestions().map((question) => (
                        <MotionTr
                          key={question.id}
                          variants={rowVariants}
                          className="border-b border-semantic-border-tertiary hover:bg-semantic-bg-tertiary/50 transition-colors"
                          whileHover={{ x: 4 }}
                        >
                          <td className="py-3 px-4">
                            <a
                              href={`/admin/questions/${question.id}/edit`}
                              className="font-medium text-semantic-text-primary hover:text-semantic-interactive-primary transition-colors max-w-xs truncate block"
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
                          <td className="py-3 px-4 text-sm text-semantic-text-tertiary">
                            {question.updatedAt.toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <a
                                href={`/admin/questions/${question.id}/edit`}
                                className="text-sm font-medium text-semantic-interactive-primary hover:text-semantic-interactive-primary-hover transition-colors"
                              >
                                Edit
                              </a>
                              <MotionButton
                                onClick={() => handlePreview(question)}
                                className="text-sm font-medium text-semantic-interactive-secondary hover:text-semantic-interactive-secondary-hover transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                Preview
                              </MotionButton>
                              {question.isPublished ? (
                                <MotionButton
                                  onClick={() => handleUnpublish(question)}
                                  className="text-sm font-medium text-semantic-status-warning-text hover:text-semantic-status-warning-text-hover transition-colors"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  Unpublish
                                </MotionButton>
                              ) : (
                                <MotionButton
                                  onClick={() => handlePublish(question)}
                                  className="text-sm font-medium text-semantic-status-success-text hover:text-semantic-status-success-text-hover transition-colors"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  Publish
                                </MotionButton>
                              )}
                              <MotionButton
                                onClick={() => handleDeleteConfirm(question)}
                                className="text-sm font-medium text-semantic-status-danger-text hover:text-semantic-status-danger-text-hover transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                Delete
                              </MotionButton>
                            </div>
                          </td>
                        </MotionTr>
                      ))}
                    </tbody>
                  </table>
                </MotionDiv>

                {/* Pagination placeholder - would need cursor-based pagination for large datasets */}
                <MotionDiv
                  variants={cardVariants}
                  className="mt-6 flex items-center justify-between"
                >
                  <p className="text-sm text-semantic-text-tertiary">
                    Showing {filteredQuestions().length} of {questions.length}{" "}
                    questions
                  </p>
                </MotionDiv>
              </>
            )}
          </CardContent>
        </MotionCard>
      </MotionDiv>
      <DeleteConfirmationDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog((prev) => ({ ...prev, open: false }))}
        onConfirm={handleDeleteConfirmYes}
      />
      <Dialog
        open={previewDialog.open}
        onOpenChange={(open) => setPreviewDialog((prev) => ({ ...prev, open }))}
      >
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl text-semantic-text-primary">
              {previewDialog.question?.question}
            </DialogTitle>
          </DialogHeader>
          {previewDialog.question && (
            <MotionDiv
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="space-y-6 py-4"
            >
              {/* Badges */}
              <MotionDiv
                variants={fieldVariants}
                className="flex flex-wrap items-center gap-2"
              >
                <TopicBadge topic={previewDialog.question.topic} />
                <DifficultyBadge
                  difficulty={previewDialog.question.difficulty}
                />
                <StatusBadge
                  status={
                    previewDialog.question.isPublished ? "published" : "draft"
                  }
                />
                {previewDialog.question.language && (
                  <Badge variant="outline" size="sm">
                    {previewDialog.question.language}
                  </Badge>
                )}
              </MotionDiv>

              {/* Metadata */}
              <MotionDiv
                variants={fieldVariants}
                className="flex flex-wrap items-center gap-4 text-sm text-semantic-text-tertiary"
              >
                <span>Category: {previewDialog.question.category}</span>
                <span>
                  Created:{" "}
                  {previewDialog.question.createdAt.toLocaleDateString()}
                </span>
                <span>
                  Updated:{" "}
                  {previewDialog.question.updatedAt.toLocaleDateString()}
                </span>
              </MotionDiv>

              {/* Tags */}
              {previewDialog.question.tags.length > 0 && (
                <MotionDiv
                  variants={fieldVariants}
                  className="flex flex-wrap gap-2"
                >
                  {previewDialog.question.tags.map((tag) => (
                    <Badge key={tag} variant="outline" size="sm">
                      {tag}
                    </Badge>
                  ))}
                </MotionDiv>
              )}

              {/* Short Answer */}
              <MotionCard variants={cardVariants}>
                <CardHeader>
                  <CardTitle className="text-lg text-semantic-text-primary">
                    Short Answer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-gray dark:prose-invert max-w-none text-semantic-text-secondary">
                    {previewDialog.question.shortAnswer}
                  </div>
                </CardContent>
              </MotionCard>

              {/* Detailed Answer */}
              <MotionCard variants={cardVariants}>
                <CardHeader>
                  <CardTitle className="text-lg text-semantic-text-primary">
                    Detailed Answer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-gray dark:prose-invert max-w-none text-semantic-text-secondary">
                    {previewDialog.question.detailedAnswer
                      .split("\n")
                      .map((paragraph, i) => (
                        <p key={i}>{paragraph}</p>
                      ))}
                  </div>
                </CardContent>
              </MotionCard>

              {/* Code Example */}
              {previewDialog.question.code && (
                <MotionCard variants={cardVariants}>
                  <CardHeader>
                    <CardTitle className="text-lg text-semantic-text-primary">
                      Code Example
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SyntaxHighlighter
                      language={
                        previewDialog.question.language?.toLowerCase() || "text"
                      }
                      style={atomDark}
                      customStyle={{
                        borderRadius: "0.5rem",
                        fontSize: "0.875rem",
                        lineHeight: "1.6",
                      }}
                      showLineNumbers={true}
                      wrapLongLines={true}
                    >
                      {previewDialog.question.code}
                    </SyntaxHighlighter>
                  </CardContent>
                </MotionCard>
              )}

              {/* Important Points */}
              {previewDialog.question.importantPoints.length > 0 && (
                <MotionCard variants={cardVariants}>
                  <CardHeader>
                    <CardTitle className="text-lg text-semantic-text-primary">
                      Important Interview Points
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {previewDialog.question.importantPoints.map(
                        (point, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 text-semantic-text-secondary"
                          >
                            <svg
                              className="h-5 w-5 text-semantic-interactive-primary flex-shrink-0 mt-0.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <span>{point}</span>
                          </li>
                        ),
                      )}
                    </ul>
                  </CardContent>
                </MotionCard>
              )}

              {/* Follow-up Questions */}
              {previewDialog.question.followUpQuestions.length > 0 && (
                <MotionCard variants={cardVariants}>
                  <CardHeader>
                    <CardTitle className="text-lg text-semantic-text-primary">
                      Follow-up Questions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-2 list-decimal list-inside text-semantic-text-secondary">
                      {previewDialog.question.followUpQuestions.map((q, i) => (
                        <li key={i}>{q}</li>
                      ))}
                    </ol>
                  </CardContent>
                </MotionCard>
              )}
            </MotionDiv>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
