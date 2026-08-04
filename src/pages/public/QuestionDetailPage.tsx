import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
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
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <Card>
          <CardContent className="py-12">
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
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
              Question Not Found
            </h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              {error || "The question you are looking for does not exist."}
            </p>
            <div className="mt-6">
              <Link
                to="/questions"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 dark:text-primary-400 dark:bg-primary-900/30 dark:hover:bg-primary-900/50"
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
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <li>
              <Link
                to="/"
                className="hover:text-primary-600 dark:hover:text-primary-400"
              >
                Home
              </Link>
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
              <Link
                to="/questions"
                className="hover:text-primary-600 dark:hover:text-primary-400"
              >
                Questions
              </Link>
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
              <Link
                to={`/topics/${question.topic}`}
                className="hover:text-primary-600 dark:hover:text-primary-400"
              >
                {question.topic}
              </Link>
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
              className="text-gray-900 dark:text-gray-100 truncate max-w-[200px]"
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

        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {question.question}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span>Category: {question.category}</span>
          {question.language && <span>Language: {question.language}</span>}
          <span>Created: {format(question.createdAt, "MMM d, yyyy")}</span>
          <span>Updated: {format(question.updatedAt, "MMM d, yyyy")}</span>
        </div>
      </div>

      {/* Tags & Share & Bookmark */}
      <div className="flex flex-wrap items-center justify-between gap-4">
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
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="gap-1"
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
          </Button>
        </div>
      </div>

      {/* Short Answer */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Short Answer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            {question.shortAnswer}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Answer */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Detailed Answer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            {question.detailedAnswer}
          </div>
        </CardContent>
      </Card>

      {/* Code Example */}
      {question.code && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Code Example</CardTitle>
            <div className="flex items-center gap-2">
              {question.language && (
                <Badge variant="outline" size="sm">
                  {question.language}
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyCode}
                className="gap-1"
                aria-label={copied ? "Copied!" : "Copy code"}
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
              </Button>
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
        </Card>
      )}

      {/* Important Points */}
      {question.importantPoints.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Important Interview Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {question.importantPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <svg
                    className="h-5 w-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5"
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
                  <span className="text-gray-700 dark:text-gray-300">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Follow-up Questions */}
      {question.followUpQuestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Follow-up Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2 list-decimal list-inside">
              {question.followUpQuestions.map((q, index) => (
                <li key={index} className="text-gray-700 dark:text-gray-300">
                  {q}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}

      {/* Related Questions */}
      {relatedQuestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Related Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {relatedQuestions.map((q) => (
                <Link
                  key={q.id}
                  to={`/questions/${q.slug}`}
                  className="block p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <TopicBadge topic={q.topic} size="sm" />
                    <DifficultyBadge difficulty={q.difficulty} size="sm" />
                  </div>
                  <p className="font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
                    {q.question}
                  </p>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Previous/Next Navigation */}
      {(adjacentQuestions.previous || adjacentQuestions.next) && (
        <Card>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              {adjacentQuestions.previous && (
                <Link
                  to={`/questions/${adjacentQuestions.previous.slug}`}
                  className="flex-1 pr-4"
                >
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Previous Question
                  </div>
                  <p className="font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
                    {adjacentQuestions.previous.question}
                  </p>
                </Link>
              )}
              {adjacentQuestions.next && (
                <Link
                  to={`/questions/${adjacentQuestions.next.slug}`}
                  className="flex-1 pl-4 text-right"
                >
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Next Question
                  </div>
                  <p className="font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
                    {adjacentQuestions.next.question}
                  </p>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <Link
          to="/questions"
          className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
        >
          ← Back to Questions
        </Link>
        <Link
          to={`/topics/${question.topic}`}
          className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
        >
          Browse {question.topic} →
        </Link>
      </div>
    </div>
  );
}
