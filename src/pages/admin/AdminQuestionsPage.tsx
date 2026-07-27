import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/Card";
import {
  StatusBadge,
  TopicBadge,
  DifficultyBadge,
} from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { PageLoader } from "../../components/ui/LoadingSpinner";
import {
  getAllQuestionsForAdmin,
  deleteQuestion,
  publishQuestion,
  unpublishQuestion,
} from "../../services/firebase/firestore";
import { InterviewQuestion } from "../../types/questions";
import { useAuth } from "@/features/auth";

export function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [topicFilter, setTopicFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "published" | "draft"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useAuth();

  const PAGE_SIZE = 20;

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const result = await getAllQuestionsForAdmin(PAGE_SIZE);
      setQuestions(result.questions);
      setHasMore(result.hasMore);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const filteredQuestions = questions.filter((q) => {
    if (search) {
      const searchLower = search.toLowerCase();
      const matchesQuestion = q.question.toLowerCase().includes(searchLower);
      const matchesShortAnswer = q.shortAnswer
        .toLowerCase()
        .includes(searchLower);
      if (!matchesQuestion && !matchesShortAnswer) return false;
    }
    if (topicFilter && q.topic !== topicFilter) return false;
    if (statusFilter === "published" && !q.isPublished) return false;
    if (statusFilter === "draft" && q.isPublished) return false;
    return true;
  });

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this question?"))
      return;
    try {
      await deleteQuestion(id);
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    } catch (err) {
      alert("Failed to delete question");
      console.error(err);
    }
  };

  const handlePublish = async (id: string) => {
    if (!user) return;
    try {
      await publishQuestion(id, user.uid);
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === id
            ? { ...q, isPublished: true, status: "published" as const }
            : q,
        ),
      );
    } catch (err) {
      alert("Failed to publish question");
      console.error(err);
    }
  };

  const handleUnpublish = async (id: string) => {
    if (!user) return;
    try {
      await unpublishQuestion(id, user.uid);
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === id
            ? { ...q, isPublished: false, status: "draft" as const }
            : q,
        ),
      );
    } catch (err) {
      alert("Failed to unpublish question");
      console.error(err);
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
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
        <Link to="/admin/questions/new">
          <Button>Add Question</Button>
        </Link>
      </div>

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
                <option value="HTML">HTML</option>
                <option value="CSS">CSS</option>
                <option value="JavaScript">JavaScript</option>
                <option value="TypeScript">TypeScript</option>
                <option value="React">React</option>
                <option value="React Native">React Native</option>
                <option value="Next.js">Next.js</option>
                <option value="Node.js">Node.js</option>
                <option value="Express.js">Express.js</option>
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
          {filteredQuestions.length === 0 ? (
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
                    {filteredQuestions.map((question) => (
                      <tr
                        key={question.id}
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <td className="py-3 px-4">
                          <Link
                            to={`/admin/questions/${question.id}/edit`}
                            className="font-medium text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 max-w-xs truncate block"
                          >
                            {question.question}
                          </Link>
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
                            <Link
                              to={`/admin/questions/${question.id}/edit`}
                              className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                            >
                              Edit
                            </Link>
                            {question.isPublished ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleUnpublish(question.id)}
                                className="text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300"
                              >
                                Unpublish
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handlePublish(question.id)}
                                className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                              >
                                Publish
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(question.id)}
                              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {filteredQuestions.length} of {questions.length}{" "}
                  questions
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!hasMore}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
