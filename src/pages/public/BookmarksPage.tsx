import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/Card";
import { PageLoader } from "../../components/ui/LoadingSpinner";
import { InterviewQuestion } from "../../types/questions";

export function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // TODO: Fetch bookmarks from localStorage or Firestore
    const saved = localStorage.getItem("bookmarks");
    if (saved) {
      try {
        setBookmarks(JSON.parse(saved));
      } catch {
        setBookmarks([]);
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Bookmarks
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Your saved interview questions for quick reference
        </p>
      </div>

      {bookmarks.length === 0 ? (
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
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
              No bookmarks yet
            </h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Start browsing questions and click the bookmark icon to save them
              for later.
            </p>
            <div className="mt-6">
              <Link
                to="/questions"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors"
              >
                Browse Questions
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {bookmarks.map((question) => (
            <Link
              key={question.id}
              to={`/questions/${question.slug}`}
              className="group"
            >
              <Card hover className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-start gap-2 mb-3">
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
                      {question.topic}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        question.difficulty === "Beginner"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : question.difficulty === "Intermediate"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {question.difficulty}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                    {question.question}
                  </h3>
                  <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                    {question.shortAnswer}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {question.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-xs font-medium rounded-full border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                    {question.tags.length > 3 && (
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300">
                        +{question.tags.length - 3}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
