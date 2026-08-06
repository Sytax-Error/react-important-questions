import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PageLoader } from "@/components/ui/LoadingSpinner";
import {
  getQuestionStats,
  getPaginatedQuestionsAdmin,
} from "@/features/questions/services/questionService";
import { InterviewQuestion, Difficulty } from "@/types/questions";

const MotionCard = motion(Card);
const MotionDiv = motion.div;
const MotionLink = motion(Link);

// Framer Motion variants for consistent animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
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

const rowVariants = {
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

export function AdminDashboardPage() {
  const [stats, setStats] = useState<{
    totalQuestions: number;
    publishedQuestions: number;
    draftQuestions: number;
    questionsByDifficulty: Record<Difficulty, number>;
    questionsByTopic: Record<string, number>;
    recentlyUpdated: InterviewQuestion[];
  } | null>(null);
  const [recentQuestions, setRecentQuestions] = useState<InterviewQuestion[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsData, questionsData] = await Promise.all([
          getQuestionStats(),
          getPaginatedQuestionsAdmin(5),
        ]);
        setStats(statsData);
        setRecentQuestions(questionsData.questions);
      } catch (err) {
        setError("Failed to load dashboard data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <MotionDiv
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        className="text-center py-12"
      >
        <p className="text-semantic-status-danger-text">{error}</p>
      </MotionDiv>
    );
  }

  return (
    <MotionDiv
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8 px-4 sm:px-6 lg:px-8 py-8"
    >
      <MotionDiv variants={cardVariants}>
        <h1 className="text-3xl font-bold text-semantic-text-primary">
          Dashboard
        </h1>
        <p className="mt-2 text-semantic-text-secondary">
          Overview of your interview questions
        </p>
      </MotionDiv>

      {/* Stats Cards */}
      <MotionDiv
        variants={containerVariants}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        <MotionCard variants={statVariants}>
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-semantic-text-secondary">
                  Total Questions
                </p>
                <p className="mt-1 text-3xl font-bold text-semantic-text-primary">
                  {stats?.totalQuestions || 0}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-semantic-interactive-primary/10 text-semantic-interactive-primary">
                <svg
                  className="h-6 w-6"
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
              </div>
            </div>
          </CardContent>
        </MotionCard>

        <MotionCard variants={statVariants}>
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-semantic-text-secondary">
                  Published
                </p>
                <p className="mt-1 text-3xl font-bold text-semantic-status-success-text">
                  {stats?.publishedQuestions || 0}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-semantic-status-success-bg text-semantic-status-success-text">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </CardContent>
        </MotionCard>

        <MotionCard variants={statVariants}>
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-semantic-text-secondary">
                  Drafts
                </p>
                <p className="mt-1 text-3xl font-bold text-semantic-status-warning-text">
                  {stats?.draftQuestions || 0}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-semantic-status-warning-bg text-semantic-status-warning-text">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
          </CardContent>
        </MotionCard>

        <MotionCard variants={statVariants}>
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-semantic-text-secondary">
                  Topics
                </p>
                <p className="mt-1 text-3xl font-bold text-semantic-text-primary">
                  {Object.keys(stats?.questionsByTopic || {}).length}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-semantic-interactive-secondary/10 text-semantic-interactive-secondary">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
              </div>
            </div>
          </CardContent>
        </MotionCard>
      </MotionDiv>

      {/* Difficulty Breakdown */}
      {stats && (
        <MotionCard variants={cardVariants}>
          <CardHeader>
            <CardTitle className="text-lg">Questions by Difficulty</CardTitle>
          </CardHeader>
          <CardContent>
            <MotionDiv
              variants={containerVariants}
              className="grid gap-4 sm:grid-cols-3"
            >
              <MotionDiv
                variants={rowVariants}
                className="flex items-center justify-between p-4 bg-semantic-status-success-bg border border-semantic-status-success-border rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium text-semantic-text-secondary">
                    Beginner
                  </p>
                  <p className="mt-1 text-2xl font-bold text-semantic-status-success-text">
                    {stats.questionsByDifficulty.Beginner || 0}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-semantic-status-success-bg/30 text-semantic-status-success-text">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </MotionDiv>
              <MotionDiv
                variants={rowVariants}
                className="flex items-center justify-between p-4 bg-semantic-status-warning-bg border border-semantic-status-warning-border rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium text-semantic-text-secondary">
                    Intermediate
                  </p>
                  <p className="mt-1 text-2xl font-bold text-semantic-status-warning-text">
                    {stats.questionsByDifficulty.Intermediate || 0}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-semantic-status-warning-bg/30 text-semantic-status-warning-text">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </MotionDiv>
              <MotionDiv
                variants={rowVariants}
                className="flex items-center justify-between p-4 bg-semantic-status-danger-bg border border-semantic-status-danger-border rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium text-semantic-text-secondary">
                    Advanced
                  </p>
                  <p className="mt-1 text-2xl font-bold text-semantic-status-danger-text">
                    {stats.questionsByDifficulty.Advanced || 0}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-semantic-status-danger-bg/30 text-semantic-status-danger-text">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </MotionDiv>
            </MotionDiv>
          </CardContent>
        </MotionCard>
      )}

      {/* Quick Actions */}
      <MotionCard variants={cardVariants}>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <MotionDiv
            variants={containerVariants}
            className="flex flex-wrap gap-4"
          >
            <MotionLink
              to="/admin/questions/new"
              variants={statVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button>Add New Question</Button>
            </MotionLink>
            <MotionLink
              to="/admin/questions"
              variants={statVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button variant="outline">Manage Questions</Button>
            </MotionLink>
            <MotionLink
              to="/"
              variants={statVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button variant="ghost">View Site</Button>
            </MotionLink>
          </MotionDiv>
        </CardContent>
      </MotionCard>

      {/* Recent Questions */}
      <MotionCard variants={cardVariants}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent Questions</CardTitle>
          <MotionLink
            to="/admin/questions"
            className="text-sm font-medium text-semantic-interactive-primary hover:text-semantic-interactive-primary-hover"
            whileHover={{ x: 4 }}
          >
            View All →
          </MotionLink>
        </CardHeader>
        <CardContent>
          {recentQuestions.length === 0 ? (
            <MotionDiv variants={cardVariants} className="text-center py-8">
              <p className="text-semantic-text-secondary">
                No questions yet.{" "}
                <Link
                  to="/admin/questions/new"
                  className="text-semantic-interactive-primary hover:text-semantic-interactive-primary-hover"
                >
                  Create one
                </Link>
              </p>
            </MotionDiv>
          ) : (
            <MotionDiv variants={containerVariants} className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-semantic-border-primary">
                    <th className="text-left py-3 px-4 text-sm font-medium text-semantic-text-secondary">
                      Question
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-semantic-text-secondary">
                      Topic
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-semantic-text-secondary">
                      Difficulty
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-semantic-text-secondary">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-semantic-text-secondary">
                      Updated
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-semantic-text-secondary">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentQuestions.map((question) => (
                    <MotionDiv
                      key={question.id}
                      variants={rowVariants}
                      className="border-b border-semantic-border-tertiary hover:bg-semantic-bg-tertiary/50 transition-colors"
                    >
                      <tr>
                        <td className="py-3 px-4">
                          <Link
                            to={`/admin/questions/${question.id}/edit`}
                            className="font-medium text-semantic-text-primary hover:text-semantic-interactive-primary max-w-xs truncate block"
                          >
                            {question.question}
                          </Link>
                        </td>
                        <td className="py-3 px-4 text-sm text-semantic-text-secondary">
                          {question.topic}
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={
                              question.difficulty === "Beginner"
                                ? "success"
                                : question.difficulty === "Intermediate"
                                  ? "warning"
                                  : "danger"
                            }
                            size="sm"
                          >
                            {question.difficulty}
                          </Badge>
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
                          <Link
                            to={`/admin/questions/${question.id}/edit`}
                            className="text-sm font-medium text-semantic-interactive-primary hover:text-semantic-interactive-primary-hover"
                          >
                            Edit
                          </Link>
                        </td>
                      </tr>
                    </MotionDiv>
                  ))}
                </tbody>
              </table>
            </MotionDiv>
          )}
        </CardContent>
      </MotionCard>
    </MotionDiv>
  );
}
