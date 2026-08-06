import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import {
  DifficultyBadge,
  TopicBadge,
  StatusBadge,
  Badge,
} from "../../components/ui/Badge";
import { PageLoader } from "../../components/ui/LoadingSpinner";
import { Button } from "../../components/ui/Button";
import { InterviewQuestion } from "../../types/questions";
import { format } from "date-fns";
import {
  getQuestionBySlug,
  getRelatedQuestions,
  getAdjacentQuestions,
} from "../../features/questions/services/questionService";
import {
  BookmarkButton,
  CompletedButton,
  useLearning,
} from "../../features/bookmarks";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

/**
 * Promise timeout wrapper to prevent infinite loading
 */
function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  timeoutError: string,
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(timeoutError)), ms),
    ),
  ]);
}

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
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
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

const sectionVariants = {
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

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

export function QuestionDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [question, setQuestion] = useState<InterviewQuestion | null>(null);
  const [relatedQuestions, setRelatedQuestions] = useState<InterviewQuestion[]>(
    [],
  );
  const [adjacentQuestions, setAdjacentQuestions] = useState<{
    previous: InterviewQuestion | null;
    next: InterviewQuestion | null;
  }>({ previous: null, next: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { addRecentlyViewed } = useLearning();

  const fetchQuestion = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    setError(null);

    try {
      console.log("[QuestionDetailPage] Starting fetch for slug:", slug);
      // Add timeout to prevent infinite loading on network issues
      const questionData = await withTimeout(
        getQuestionBySlug(slug),
        10000,
        "Request timed out. Please check your connection and try again.",
      );
      console.log("[QuestionDetailPage] Got question data:", questionData);

      if (questionData && questionData.isPublished) {
        setQuestion(questionData);
        // Track recently viewed
        addRecentlyViewed(questionData);
        // Fetch related and adjacent questions in parallel with timeout
        const [related, adjacent] = await Promise.all([
          withTimeout(
            getRelatedQuestions(questionData.topic, questionData.id, 3),
            8000,
            "Failed to load related questions",
          ),
          withTimeout(
            getAdjacentQuestions(
              questionData.publishedAt ?? questionData.createdAt,
              questionData.topic,
            ),
            8000,
            "Failed to load adjacent questions",
          ),
        ]);
        setRelatedQuestions(related);
        setAdjacentQuestions(adjacent);
      } else {
        setError("Question not found");
      }
    } catch (err) {
      console.error("[QuestionDetailPage] Error fetching question:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load question";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [slug, addRecentlyViewed]);

  useEffect(() => {
    fetchQuestion();
  }, [fetchQuestion]);

  const handleCopyCode = async () => {
    if (!question?.code) return;
    try {
      await navigator.clipboard.writeText(question.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleShare = async () => {
    if (!question) return;
    const url = window.location.href;
    const title = question.question;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Failed to share:", err);
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  if (error || !question) {
    return (
      <MotionDiv
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="max-w-4xl mx-auto px-4 py-12 text-center"
      >
        <MotionCard className="bg-semantic-bg-primary border-semantic-border-primary">
          <CardContent className="py-12">
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
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="mt-4 text-xl font-semibold text-semantic-text-primary">
              Question Not Found
            </h2>
            <p className="mt-2 text-semantic-text-secondary">
              {error || "The question you are looking for does not exist."}
            </p>
            <div className="mt-6">
              <MotionLink
                to="/questions"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-semantic-interactive-primary bg-semantic-interactive-primary/10 rounded-lg hover:bg-semantic-interactive-primary/20 dark:hover:bg-semantic-interactive-primary/30"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg
                  className="mr-2 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Questions
              </MotionLink>
            </div>
          </CardContent>
        </MotionCard>
      </MotionDiv>
    );
  }

  return (
    <MotionDiv
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-4xl mx-auto px-4 py-8 space-y-8"
    >
      {/* Header */}
      <MotionDiv variants={headerVariants}>
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-semantic-text-tertiary">
            <li>
              <MotionLink
                to="/"
                className="hover:text-semantic-interactive-primary"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Home
              </MotionLink>
            </li>
            <li>
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </li>
            <li>
              <MotionLink
                to="/questions"
                className="hover:text-semantic-interactive-primary"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Questions
              </MotionLink>
            </li>
            <li>
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </li>
            <li>
              <MotionLink
                to={`/topics/${question.topic}`}
                className="hover:text-semantic-interactive-primary"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {question.topic}
              </MotionLink>
            </li>
            <li>
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </li>
            <li
              className="text-semantic-text-primary truncate max-w-[200px]"
              aria-current="page"
            >
              {question.question}
            </li>
          </ol>
        </nav>

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <TopicBadge topic={question.topic} />
          <DifficultyBadge difficulty={question.difficulty} />
          <StatusBadge status={question.isPublished ? "published" : "draft"} />
        </div>

        <h1 className="text-3xl font-bold text-semantic-text-primary">
          {question.question}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-semantic-text-tertiary">
          <span>Category: {question.category}</span>
          {question.language && <span>Language: {question.language}</span>}
          <span>Created: {format(question.createdAt, "MMM d, yyyy")}</span>
          <span>Updated: {format(question.updatedAt, "MMM d, yyyy")}</span>
        </div>
      </MotionDiv>

      {/* Tags & Share & Bookmark */}
      <MotionDiv
        variants={sectionVariants}
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <div className="flex flex-wrap gap-2">
          {question.tags.map((tag) => (
            <Badge key={tag} variant="outline" size="sm">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <BookmarkButton question={question} size="sm" showLabel />
          <CompletedButton question={question} size="sm" showLabel />
          <MotionButton
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="gap-1"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
            Share
          </MotionButton>
        </div>
      </MotionDiv>

      {/* Short Answer */}
      <MotionCard
        variants={sectionVariants}
        className="bg-semantic-bg-primary border-semantic-border-primary"
      >
        <CardHeader>
          <CardTitle className="text-lg text-semantic-text-primary">
            Short Answer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-gray dark:prose-invert max-w-none text-semantic-text-secondary">
            {question.shortAnswer}
          </div>
        </CardContent>
      </MotionCard>

      {/* Detailed Answer */}
      <MotionCard
        variants={sectionVariants}
        className="bg-semantic-bg-primary border-semantic-border-primary"
      >
        <CardHeader>
          <CardTitle className="text-lg text-semantic-text-primary">
            Detailed Answer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-gray dark:prose-invert max-w-none text-semantic-text-secondary">
            {question.detailedAnswer}
          </div>
        </CardContent>
      </MotionCard>

      {/* Code Example */}
      {question.code && (
        <MotionCard
          variants={sectionVariants}
          className="bg-semantic-bg-primary border-semantic-border-primary"
        >
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg text-semantic-text-primary">
              Code Example
            </CardTitle>
            <div className="flex items-center gap-2">
              {question.language && (
                <Badge variant="outline" size="sm">
                  {question.language}
                </Badge>
              )}
              <MotionButton
                variant="ghost"
                size="sm"
                onClick={handleCopyCode}
                className="gap-1"
                aria-label={copied ? "Copied!" : "Copy code"}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                  />
                </svg>
                {copied ? "Copied!" : "Copy"}
              </MotionButton>
            </div>
          </CardHeader>
          <CardContent>
            <SyntaxHighlighter
              language={question.language?.toLowerCase() || "text"}
              style={atomDark}
              customStyle={{
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
                lineHeight: "1.6",
              }}
              showLineNumbers={true}
              wrapLongLines={true}
            >
              {question.code}
            </SyntaxHighlighter>
          </CardContent>
        </MotionCard>
      )}

      {/* Important Points */}
      {question.importantPoints.length > 0 && (
        <MotionCard
          variants={sectionVariants}
          className="bg-semantic-bg-primary border-semantic-border-primary"
        >
          <CardHeader>
            <CardTitle className="text-lg text-semantic-text-primary">
              Important Interview Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {question.importantPoints.map((point, index) => (
                <MotionDiv
                  key={index}
                  variants={itemVariants}
                  className="flex items-start gap-3"
                >
                  <svg
                    className="h-5 w-5 text-semantic-status-success flex-shrink-0 mt-0.5"
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
                  <span className="text-semantic-text-secondary">{point}</span>
                </MotionDiv>
              ))}
            </ul>
          </CardContent>
        </MotionCard>
      )}

      {/* Follow-up Questions */}
      {question.followUpQuestions.length > 0 && (
        <MotionCard
          variants={sectionVariants}
          className="bg-semantic-bg-primary border-semantic-border-primary"
        >
          <CardHeader>
            <CardTitle className="text-lg text-semantic-text-primary">
              Follow-up Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2 list-decimal list-inside">
              {question.followUpQuestions.map((q, index) => (
                <MotionDiv
                  key={index}
                  variants={itemVariants}
                  className="text-semantic-text-secondary"
                >
                  {q}
                </MotionDiv>
              ))}
            </ol>
          </CardContent>
        </MotionCard>
      )}

      {/* Related Questions */}
      {relatedQuestions.length > 0 && (
        <MotionCard
          variants={sectionVariants}
          className="bg-semantic-bg-primary border-semantic-border-primary"
        >
          <CardHeader>
            <CardTitle className="text-lg text-semantic-text-primary">
              Related Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MotionDiv variants={containerVariants} className="space-y-3">
              {relatedQuestions.map((q) => (
                <MotionLink
                  key={q.id}
                  to={`/questions/${q.slug}`}
                  variants={itemVariants}
                  className="block p-3 rounded-lg border border-semantic-border-primary hover:bg-semantic-interactive-hover dark:hover:bg-semantic-bg-tertiary transition-colors"
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <TopicBadge topic={q.topic} size="sm" />
                    <DifficultyBadge difficulty={q.difficulty} size="sm" />
                  </div>
                  <p className="font-medium text-semantic-text-primary line-clamp-2">
                    {q.question}
                  </p>
                </MotionLink>
              ))}
            </MotionDiv>
          </CardContent>
        </MotionCard>
      )}

      {/* Previous/Next Navigation */}
      {(adjacentQuestions.previous || adjacentQuestions.next) && (
        <MotionCard
          variants={sectionVariants}
          className="bg-semantic-bg-primary border-semantic-border-primary"
        >
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              {adjacentQuestions.previous && (
                <MotionLink
                  to={`/questions/${adjacentQuestions.previous.slug}`}
                  className="flex-1 pr-4"
                  whileHover={{ x: -4 }}
                >
                  <div className="text-xs text-semantic-text-tertiary mb-1">
                    Previous Question
                  </div>
                  <p className="font-medium text-semantic-text-primary line-clamp-2">
                    {adjacentQuestions.previous.question}
                  </p>
                </MotionLink>
              )}
              {adjacentQuestions.next && (
                <MotionLink
                  to={`/questions/${adjacentQuestions.next.slug}`}
                  className="flex-1 pl-4 text-right"
                  whileHover={{ x: 4 }}
                >
                  <div className="text-xs text-semantic-text-tertiary mb-1">
                    Next Question
                  </div>
                  <p className="font-medium text-semantic-text-primary line-clamp-2">
                    {adjacentQuestions.next.question}
                  </p>
                </MotionLink>
              )}
            </div>
          </CardContent>
        </MotionCard>
      )}

      {/* Footer Navigation */}
      <MotionDiv
        variants={sectionVariants}
        className="flex items-center justify-between pt-4 border-t border-semantic-border-primary"
      >
        <MotionLink
          to="/questions"
          className="text-sm font-medium text-semantic-interactive-primary hover:text-semantic-interactive-primary-hover"
          whileHover={{ x: -4 }}
        >
          ← Back to Questions
        </MotionLink>
        <MotionLink
          to={`/topics/${question.topic}`}
          className="text-sm font-medium text-semantic-interactive-primary hover:text-semantic-interactive-primary-hover"
          whileHover={{ x: 4 }}
        >
          Browse {question.topic} →
        </MotionLink>
      </MotionDiv>
    </MotionDiv>
  );
}
