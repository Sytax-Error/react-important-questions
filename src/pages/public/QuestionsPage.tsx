import { useState, useEffect } from "react";
import { Card, CardContent } from "../../components/ui/Card";
import { Badge, DifficultyBadge, TopicBadge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { PageLoader } from "../../components/ui/LoadingSpinner";
import { InterviewQuestion, TOPICS, DIFFICULTIES } from "../../types/question";

export function QuestionsPage() {
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    topic: "",
    difficulty: "",
    tags: [] as string[],
  });
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    setLoading(true);
    // TODO: Fetch published questions from Firestore
    setTimeout(() => {
      setQuestions([]);
      setAllTags([]);
      setLoading(false);
    }, 500);
  }, []);

  const handleFilterChange = (key: string, value: string | string[]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredQuestions = questions.filter((q) => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesQuestion = q.question.toLowerCase().includes(searchLower);
      const matchesShortAnswer = q.shortAnswer
        .toLowerCase()
        .includes(searchLower);
      const matchesDetailedAnswer = q.detailedAnswer
        .toLowerCase()
        .includes(searchLower);
      const matchesTags = q.tags.some((tag) =>
        tag.toLowerCase().includes(searchLower),
      );
      const matchesCategory = q.category.toLowerCase().includes(searchLower);
      if (
        !matchesQuestion &&
        !matchesShortAnswer &&
        !matchesDetailedAnswer &&
        !matchesTags &&
        !matchesCategory
      ) {
        return false;
      }
    }
    if (filters.topic && q.topic !== filters.topic) return false;
    if (filters.difficulty && q.difficulty !== filters.difficulty) return false;
    if (
      filters.tags.length > 0 &&
      !filters.tags.some((tag) => q.tags.includes(tag))
    )
      return false;
    return true;
  });

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          All Questions
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Browse and search through all published interview questions
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Search */}
            <div>
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Search
              </label>
              <Input
                id="search"
                type="search"
                placeholder="Search questions, answers, tags, categories..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full"
              />
            </div>

            {/* Topic & Difficulty Filters */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label
                  htmlFor="topic"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Topic
                </label>
                <select
                  id="topic"
                  value={filters.topic}
                  onChange={(e) => handleFilterChange("topic", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">All Topics</option>
                  {TOPICS.map((topic) => (
                    <option key={topic} value={topic}>
                      {topic}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="difficulty"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Difficulty
                </label>
                <select
                  id="difficulty"
                  value={filters.difficulty}
                  onChange={(e) =>
                    handleFilterChange("difficulty", e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">All Difficulties</option>
                  {DIFFICULTIES.map((difficulty) => (
                    <option key={difficulty} value={difficulty}>
                      {difficulty}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="tags"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Tags
                </label>
                <select
                  id="tags"
                  multiple
                  value={filters.tags}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions).map(
                      (opt) => opt.value,
                    );
                    handleFilterChange("tags", selected);
                  }}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[100px]"
                >
                  {allTags.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() =>
                    setFilters({
                      search: "",
                      topic: "",
                      difficulty: "",
                      tags: [],
                    })
                  }
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {filteredQuestions.length} question
          {filteredQuestions.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {filteredQuestions.length === 0 ? (
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
              Try adjusting your filters or search terms.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredQuestions.map((question) => (
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
