import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "../../components/ui/Card";
import { Badge, DifficultyBadge, TopicBadge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { PageLoader } from "../../components/ui/LoadingSpinner";
import { QuestionCard } from "../../components/ui/QuestionCard";
import { Select } from "../../components/ui/Select";
import { QuestionFilters, TOPICS, DIFFICULTIES } from "../../types/questions";
import { usePaginatedQuestions } from "../../features/questions/hooks/usePaginatedQuestions";
import {
  useQuestionSorting,
  SortOption,
} from "../../features/questions/hooks/useQuestionSorting";

const MotionCard = motion(Card);
const MotionDiv = motion.div;
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

const filterVariants = {
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

export function QuestionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [allCategories, setAllCategories] = useState<string[]>([]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Build filters from local state
  const filters: QuestionFilters = useMemo(
    () => ({
      search: debouncedSearch,
      topic: undefined,
      difficulty: undefined,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      category: selectedCategory || undefined,
    }),
    [debouncedSearch, selectedCategory, selectedTags],
  );

  const {
    questions,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    refresh,
    setFilters: setPaginatedFilters,
    filters: paginatedFilters,
  } = usePaginatedQuestions({
    initialFilters: filters,
    pageSize: 12,
    useRealtime: false,
  });

  // Extract unique tags and categories from loaded questions
  useEffect(() => {
    const tags = new Set<string>();
    const categories = new Set<string>();
    questions.forEach((q) => {
      q.tags.forEach((tag) => tags.add(tag));
      if (q.category) categories.add(q.category);
    });
    setAllTags(Array.from(tags).sort());
    setAllCategories(Array.from(categories).sort());
  }, [questions]);

  // Sorting
  const { sortBy, setSortBy, sortedQuestions, sortOptions } =
    useQuestionSorting(questions);
  console.log(sortedQuestions);

  // Handle filter changes with pagination reset
  const handleTopicChange = useCallback(
    (topic: string) => {
      setPaginatedFilters({ ...paginatedFilters, topic: topic || undefined });
    },
    [paginatedFilters, setPaginatedFilters],
  );

  const handleDifficultyChange = useCallback(
    (difficulty: string) => {
      setPaginatedFilters({
        ...paginatedFilters,
        difficulty: difficulty as
          | "Beginner"
          | "Intermediate"
          | "Advanced"
          | undefined,
      });
    },
    [paginatedFilters, setPaginatedFilters],
  );

  const handleCategoryChange = useCallback(
    (category: string) => {
      setSelectedCategory(category);
      setPaginatedFilters({
        ...paginatedFilters,
        category: category || undefined,
      });
    },
    [paginatedFilters, setPaginatedFilters],
  );

  const handleTagToggle = useCallback(
    (tag: string) => {
      setSelectedTags((prevTags) => {
        const newTags = prevTags.includes(tag)
          ? prevTags.filter((t) => t !== tag)
          : [...prevTags, tag];
        setPaginatedFilters({
          ...paginatedFilters,
          tags: newTags.length > 0 ? newTags : undefined,
        });
        return newTags;
      });
    },
    [paginatedFilters, setPaginatedFilters],
  );

  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    setDebouncedSearch("");
    setSelectedCategory("");
    setSelectedTags([]);
    setPaginatedFilters({});
  }, [setPaginatedFilters]);

  const hasActiveFilters =
    searchQuery ||
    paginatedFilters.topic ||
    paginatedFilters.difficulty ||
    selectedCategory ||
    selectedTags.length > 0;

  if (loading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <MotionCard
        variants={sectionVariants}
        className="text-center py-12 bg-semantic-bg-primary border-semantic-border-primary"
      >
        <CardContent>
          <svg
            className="mx-auto h-12 w-12 text-semantic-status-danger"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-semantic-text-primary">
            Failed to load questions
          </h3>
          <p className="mt-2 text-semantic-text-secondary">{error}</p>
          <MotionButton
            onClick={refresh}
            className="mt-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Try Again
          </MotionButton>
        </CardContent>
      </MotionCard>
    );
  }

  return (
    <MotionDiv
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8 px-4 sm:px-6 lg:px-8"
    >
      {/* Header */}
      <MotionDiv variants={sectionVariants}>
        <h1 className="text-3xl font-bold text-semantic-text-primary">
          All Questions
        </h1>
        <p className="mt-2 text-semantic-text-secondary">
          Browse and search through all published interview questions
        </p>
      </MotionDiv>

      {/* Filters */}
      <MotionCard
        variants={sectionVariants}
        className="bg-semantic-bg-primary border-semantic-border-primary"
      >
        <CardContent className="pt-6">
          <MotionDiv variants={filterVariants} className="space-y-6">
            {/* Search */}
            <div>
              <label
                htmlFor="search"
                className="block text-sm font-medium text-semantic-text-secondary mb-2"
              >
                Search
              </label>
              <Input
                id="search"
                type="search"
                placeholder="Search questions, answers, tags, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Topic, Category, Difficulty, Sort Filters */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label
                  htmlFor="topic"
                  className="block text-sm font-medium text-semantic-text-secondary mb-2"
                >
                  Topic
                </label>
                <Select
                  id="topic"
                  value={paginatedFilters.topic || ""}
                  onChange={(e) => handleTopicChange(e.target.value)}
                  options={TOPICS.map((t) => ({ value: t, label: t }))}
                  placeholder="All Topics"
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-semantic-text-secondary mb-2"
                >
                  Category
                </label>
                <Select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  options={allCategories.map((c) => ({ value: c, label: c }))}
                  placeholder="All Categories"
                />
              </div>

              <div>
                <label
                  htmlFor="difficulty"
                  className="block text-sm font-medium text-semantic-text-secondary mb-2"
                >
                  Difficulty
                </label>
                <Select
                  id="difficulty"
                  value={paginatedFilters.difficulty || ""}
                  onChange={(e) => handleDifficultyChange(e.target.value)}
                  options={DIFFICULTIES.map((d) => ({ value: d, label: d }))}
                  placeholder="All Difficulties"
                />
              </div>

              <div>
                <label
                  htmlFor="sort"
                  className="block text-sm font-medium text-semantic-text-secondary mb-2"
                >
                  Sort By
                </label>
                <Select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  options={sortOptions.map((o) => ({
                    value: o.value,
                    label: o.label,
                  }))}
                />
              </div>
            </div>

            {/* Clear Filters */}
            <div className="flex justify-start">
              <MotionButton
                variant="outline"
                onClick={handleClearFilters}
                disabled={!hasActiveFilters}
                className="w-full sm:w-auto"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Clear Filters
              </MotionButton>
            </div>

            {/* Tags Filter */}
            {allTags.length > 0 && (
              <MotionDiv variants={filterVariants}>
                <label className="block text-sm font-medium text-semantic-text-secondary mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <MotionButton
                      key={tag}
                      type="button"
                      onClick={() => handleTagToggle(tag)}
                      variant="outline"
                      size="sm"
                      className={`inline-flex items-center font-medium rounded-full px-2 py-0.5 text-xs cursor-pointer transition-colors ${
                        selectedTags.includes(tag)
                          ? "bg-semantic-interactive-primary/10 text-semantic-interactive-primary border-semantic-interactive-primary"
                          : "border-semantic-border-primary text-semantic-text-secondary hover:bg-semantic-interactive-hover dark:hover:bg-semantic-bg-tertiary"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {tag}
                    </MotionButton>
                  ))}
                </div>
              </MotionDiv>
            )}
          </MotionDiv>
        </CardContent>
      </MotionCard>

      {/* Results Header */}
      <MotionDiv
        variants={sectionVariants}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <p className="text-sm text-semantic-text-tertiary">
          {sortedQuestions.length} question
          {sortedQuestions.length !== 1 ? "s" : ""} found
          {hasMore && (
            <span className="text-semantic-interactive-primary ml-2">
              (+ more available)
            </span>
          )}
        </p>
      </MotionDiv>

      {sortedQuestions.length === 0 ? (
        <MotionCard
          variants={sectionVariants}
          className="text-center py-12 bg-semantic-bg-primary border-semantic-border-primary"
        >
          <CardContent>
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
            <h3 className="mt-4 text-lg font-medium text-semantic-text-primary">
              No questions found
            </h3>
            <p className="mt-2 text-semantic-text-secondary">
              Try adjusting your filters or search terms.
            </p>
            {hasActiveFilters && (
              <MotionButton
                onClick={handleClearFilters}
                className="mt-4"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Clear All Filters
              </MotionButton>
            )}
          </CardContent>
        </MotionCard>
      ) : (
        <>
          <MotionDiv
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {sortedQuestions.map((question) => (
              <MotionDiv key={question.id} variants={itemVariants}>
                <QuestionCard href={`/questions/${question.slug}`}>
                  <div className="flex items-start gap-2 mb-3">
                    <TopicBadge topic={question.topic} />
                    <DifficultyBadge difficulty={question.difficulty} />
                  </div>
                  <h3 className="text-lg font-semibold text-semantic-text-primary group-hover:text-semantic-interactive-primary dark:group-hover:text-semantic-interactive-primary transition-colors line-clamp-2">
                    {question.question}
                  </h3>
                  <p className="mt-3 text-sm text-semantic-text-secondary line-clamp-2">
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
                </QuestionCard>
              </MotionDiv>
            ))}
          </MotionDiv>

          {/* Load More Button */}
          {hasMore && (
            <MotionDiv variants={sectionVariants} className="text-center pt-4">
              <MotionButton
                variant="outline"
                size="lg"
                onClick={loadMore}
                disabled={loadingMore}
                className="w-full sm:w-auto"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loadingMore ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth={4}
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Loading more...
                  </>
                ) : (
                  "Load More Questions"
                )}
              </MotionButton>
            </MotionDiv>
          )}
        </>
      )}
    </MotionDiv>
  );
}
