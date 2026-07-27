import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardContent } from "../../components/ui/Card";
import { DifficultyBadge, TopicBadge, Badge } from "../../components/ui/Badge";
import { PageLoader } from "../../components/ui/LoadingSpinner";
import { InterviewQuestion } from "../../types/questions";

export function TopicPage() {
  const { topic } = useParams<{ topic: string }>();
  const decodedTopic = topic ? decodeURIComponent(topic) : "";
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!decodedTopic) return;
    setLoading(true);
    // TODO: Fetch questions by topic from Firestore
    setTimeout(() => {
      setQuestions([]);
      setLoading(false);
    }, 500);
  }, [decodedTopic]);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <nav className="mb-4" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <li>
              <a
                href="/"
                className="hover:text-primary-600 dark:hover:text-primary-400"
              >
                Home
              </a>
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
              <a
                href="/questions"
                className="hover:text-primary-600 dark:hover:text-primary-400"
              >
                Questions
              </a>
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
              className="text-gray-900 dark:text-gray-100"
              aria-current="page"
            >
              {decodedTopic}
            </li>
          </ol>
        </nav>
        <div className="flex items-center gap-3 mb-4">
          <TopicBadge topic={decodedTopic} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {decodedTopic} Questions
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {questions.length} question{questions.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Questions List */}
      {questions.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
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
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
              No questions found
            </h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              No published questions available for this topic yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {questions.map((question) => (
            <a
              key={question.id}
              href={`/questions/${question.slug}`}
              className="group"
            >
              <Card hover className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-start gap-2 mb-3">
                    <TopicBadge topic={question.topic} />
                    <DifficultyBadge difficulty={question.difficulty} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                    {question.question}
                  </h3>
                  <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                    {question.shortAnswer}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {question.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" size="sm">
                        {tag}
                      </Badge>
                    ))}
                    {question.tags.length > 3 && (
                      <Badge variant="outline" size="sm">
                        +{question.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
