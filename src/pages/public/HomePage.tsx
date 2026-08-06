import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "../../components/ui/Card";
import { QuestionCard } from "../../components/ui/QuestionCard";
import { TopicBadge, DifficultyBadge } from "../../components/ui/Badge";
import { usePublicQuestionMeta } from "../../features/questions/hooks/usePublicQuestionMeta";
import { useHomePageQuestions } from "../../features/questions/hooks/useHomePageQuestions";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { LearningProgress } from "../../features/bookmarks/components/LearningProgress";
import { RandomQuestion } from "../../features/bookmarks/components/RandomQuestion";
import { InterviewPractice } from "../../features/bookmarks/components/InterviewPractice";

const MotionLink = motion(Link);

export function HomePage() {
  const { totalQuestions, topics, difficulties, loading } =
    usePublicQuestionMeta();
  const {
    recentlyAdded,
    featured,
    loading: questionsLoading,
    error,
  } = useHomePageQuestions();

  // Combine recently added and featured questions for learning features (deduplicate by ID)
  const allQuestions = [...recentlyAdded, ...featured].filter(
    (question, index, self) =>
      index === self.findIndex((q) => q.id === question.id),
  );

  const stats = [
    {
      label: "Questions",
      value: totalQuestions.toString(),
      icon: (
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
      ),
    },
    {
      label: "Topics",
      value: topics.length.toString(),
      icon: (
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
      ),
    },
    {
      label: "Difficulties",
      value: difficulties.length.toString(),
      icon: (
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
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
  ];

  const featuredTopics = topics.slice(0, 6);

  // Framer Motion variants for consistent animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  };

  const heroVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  };

  const buttonVariants = (index: number) => ({
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.3 + index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  });

  if (loading) {
    return (
      <div className="space-y-16">
        {/* Hero Section - Loading */}
        <section className="text-center py-16 sm:py-24">
          <div className="max-w-4xl mx-auto px-4">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={heroVariants}
              className="space-y-6"
            >
              <motion.h1
                variants={itemVariants}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-semantic-text-primary tracking-tight"
              >
                Questions for{" "}
                <span className="text-semantic-interactive-primary">
                  Frontend Developers
                </span>
              </motion.h1>
              <motion.p
                variants={itemVariants}
                className="text-lg sm:text-xl text-semantic-text-secondary max-w-3xl mx-auto"
              >
                Prepare for your next technical interview with curated questions
                covering React, JavaScript, TypeScript, Node.js, and more.
              </motion.p>
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <div className="w-full sm:w-auto h-12 bg-semantic-bg-tertiary rounded-lg animate-pulse" />
                <div className="w-full sm:w-auto h-12 bg-semantic-bg-tertiary rounded-lg animate-pulse" />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Stats - Loading */}
        <section
          aria-labelledby="stats-heading"
          className="px-4 sm:px-6 lg:px-8"
        >
          <motion.section
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            className="max-w-7xl mx-auto"
          >
            <h2 id="stats-heading" className="sr-only">
              Statistics
            </h2>
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-3 gap-6"
            >
              {stats.map((stat) => (
                <motion.div key={stat.label} variants={itemVariants}>
                  <Card className="text-center">
                    <CardContent className="py-8">
                      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-semantic-interactive-primary/10 text-semantic-interactive-primary">
                        {stat.icon}
                      </div>
                      <LoadingSpinner size="lg" />
                      <div className="mt-1 text-sm text-semantic-text-tertiary">
                        {stat.label}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>
        </section>

        {/* Topics - Loading */}
        <section
          aria-labelledby="topics-heading"
          className="px-4 sm:px-6 lg:px-8"
        >
          <motion.section
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            className="max-w-7xl mx-auto"
          >
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-between mb-8"
            >
              <h2
                id="topics-heading"
                className="text-2xl sm:text-3xl font-bold text-semantic-text-primary"
              >
                Browse by Topic
              </h2>
              <Link
                to="/questions"
                className="text-sm font-medium text-semantic-interactive-primary hover:text-semantic-interactive-primary-hover"
              >
                View all topics →
              </Link>
            </motion.div>
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {[1, 2, 3].map((i) => (
                <motion.div key={i} variants={itemVariants}>
                  <Card className="p-6">
                    <div className="h-4 bg-semantic-bg-tertiary rounded w-3/4 mb-4 animate-pulse" />
                    <div className="h-4 bg-semantic-bg-tertiary rounded w-1/2 animate-pulse" />
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>
        </section>

        {/* Difficulties - Loading */}
        <section
          aria-labelledby="difficulties-heading"
          className="px-4 sm:px-6 lg:px-8"
        >
          <motion.section
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            className="max-w-7xl mx-auto"
          >
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-between mb-8"
            >
              <h2
                id="difficulties-heading"
                className="text-2xl sm:text-3xl font-bold text-semantic-text-primary"
              >
                Filter by Difficulty
              </h2>
              <Link
                to="/questions"
                className="text-sm font-medium text-semantic-interactive-primary hover:text-semantic-interactive-primary-hover"
              >
                View all →
              </Link>
            </motion.div>
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {[1, 2, 3].map((i) => (
                <motion.div key={i} variants={itemVariants}>
                  <Card className="p-6 text-center">
                    <div className="h-6 bg-semantic-bg-tertiary rounded w-1/4 mx-auto mb-4 animate-pulse" />
                    <div className="h-4 bg-semantic-bg-tertiary rounded w-1/2 mx-auto animate-pulse" />
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>
        </section>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-16"
    >
      {/* Hero Section */}
      <motion.section
        variants={sectionVariants}
        className="text-center py-16 sm:py-24"
      >
        <div className="max-w-4xl mx-auto px-4">
          <motion.div variants={heroVariants} className="space-y-6">
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-semantic-text-primary tracking-tight"
            >
              Questions for{" "}
              <span className="text-semantic-interactive-primary">
                Frontend Developers
              </span>
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-semantic-text-secondary max-w-3xl mx-auto"
            >
              Prepare for your next technical interview with curated questions
              covering React, JavaScript, TypeScript, Node.js, and more.
            </motion.p>
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <MotionLink
                to="/questions"
                variants={buttonVariants(0)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-8 py-3 text-base font-medium text-white bg-semantic-interactive-primary rounded-lg hover:bg-semantic-interactive-primary-hover focus:outline-none focus:ring-2 focus:ring-semantic-interactive-primary focus:ring-offset-2 dark:focus:ring-offset-semantic-bg-primary transition-colors"
              >
                Browse Questions
              </MotionLink>
              <MotionLink
                to="/topics/JavaScript"
                variants={buttonVariants(1)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-8 py-3 text-base font-medium text-semantic-text-primary bg-semantic-bg-primary border border-semantic-border-primary rounded-lg hover:bg-semantic-interactive-hover dark:hover:bg-semantic-bg-tertiary focus:outline-none focus:ring-2 focus:ring-semantic-interactive-primary focus:ring-offset-2 dark:focus:ring-offset-semantic-bg-primary transition-colors"
              >
                Start with JavaScript
              </MotionLink>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats */}
      <motion.section
        variants={sectionVariants}
        aria-labelledby="stats-heading"
        className="px-4 sm:px-6 lg:px-8"
      >
        <h2 id="stats-heading" className="sr-only">
          Statistics
        </h2>
        <motion.div variants={containerVariants} className="max-w-7xl mx-auto">
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {stats.map((stat) => (
              <motion.div key={stat.label} variants={itemVariants}>
                <Card className="text-center">
                  <CardContent className="py-8">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-semantic-interactive-primary/10 text-semantic-interactive-primary">
                      {stat.icon}
                    </div>
                    <div className="text-3xl sm:text-4xl font-bold text-semantic-text-primary">
                      {stat.value}
                    </div>
                    <div className="mt-1 text-sm text-semantic-text-tertiary">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Topics */}
      <motion.section
        variants={sectionVariants}
        aria-labelledby="topics-heading"
        className="px-4 sm:px-6 lg:px-8"
      >
        <motion.div variants={containerVariants} className="max-w-7xl mx-auto">
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-between mb-8"
          >
            <h2
              id="topics-heading"
              className="text-2xl sm:text-3xl font-bold text-semantic-text-primary"
            >
              Browse by Topic
            </h2>
            <Link
              to="/questions"
              className="text-sm font-medium text-semantic-interactive-primary hover:text-semantic-interactive-primary-hover"
            >
              View all topics →
            </Link>
          </motion.div>
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {featuredTopics.map((topic) => (
              <motion.div key={topic} variants={itemVariants}>
                <Link
                  to={`/topics/${encodeURIComponent(topic)}`}
                  className="group block h-full"
                >
                  <Card hover className="h-full">
                    <CardContent className="py-6">
                      <motion.div
                        variants={itemVariants}
                        className="flex items-center justify-between mb-3"
                      >
                        <TopicBadge topic={topic} />
                      </motion.div>
                      <motion.h3
                        variants={itemVariants}
                        className="text-lg font-semibold text-semantic-text-primary group-hover:text-semantic-interactive-primary dark:group-hover:text-semantic-interactive-primary transition-colors line-clamp-2"
                      >
                        {topic}
                      </motion.h3>
                      <motion.p
                        variants={itemVariants}
                        className="mt-2 text-sm text-semantic-text-tertiary line-clamp-2"
                      >
                        Explore interview questions about {topic}
                      </motion.p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Difficulty Levels */}
      <motion.section
        variants={sectionVariants}
        aria-labelledby="difficulty-heading"
        className="px-4 sm:px-6 lg:px-8"
      >
        <motion.div variants={containerVariants} className="max-w-7xl mx-auto">
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-between mb-8"
          >
            <h2
              id="difficulty-heading"
              className="text-2xl sm:text-3xl font-bold text-semantic-text-primary"
            >
              Filter by Difficulty
            </h2>
            <Link
              to="/questions"
              className="text-sm font-medium text-semantic-interactive-primary hover:text-semantic-interactive-primary-hover"
            >
              View all →
            </Link>
          </motion.div>
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {difficulties.map((difficulty) => (
              <motion.div key={difficulty} variants={itemVariants}>
                <Link
                  to={`/questions?difficulty=${difficulty}`}
                  className="group block h-full"
                >
                  <Card hover className="h-full text-center">
                    <CardContent className="py-6">
                      <motion.div variants={itemVariants} className="mb-3">
                        <DifficultyBadge difficulty={difficulty} />
                      </motion.div>
                      <motion.h3
                        variants={itemVariants}
                        className="text-lg font-semibold text-semantic-text-primary"
                      >
                        {difficulty}
                      </motion.h3>
                      <motion.p
                        variants={itemVariants}
                        className="mt-2 text-sm text-semantic-text-tertiary"
                      >
                        {difficulty === "Beginner" &&
                          "Fundamental concepts and basics"}
                        {difficulty === "Intermediate" &&
                          "Real-world scenarios and patterns"}
                        {difficulty === "Advanced" &&
                          "Complex architectures and optimizations"}
                      </motion.p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Recently Added Questions */}
      <motion.section
        variants={sectionVariants}
        aria-labelledby="recently-added-heading"
        className="px-4 sm:px-6 lg:px-8"
      >
        <motion.div variants={containerVariants} className="max-w-7xl mx-auto">
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-between mb-8"
          >
            <h2
              id="recently-added-heading"
              className="text-2xl sm:text-3xl font-bold text-semantic-text-primary"
            >
              Recently Added
            </h2>
            <Link
              to="/questions"
              className="text-sm font-medium text-semantic-interactive-primary hover:text-semantic-interactive-primary-hover"
            >
              View all →
            </Link>
          </motion.div>
          {questionsLoading ? (
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {[1, 2, 3].map((i) => (
                <motion.div key={i} variants={itemVariants}>
                  <Card className="p-6">
                    <div className="h-4 bg-semantic-bg-tertiary rounded w-3/4 mb-4 animate-pulse" />
                    <div className="h-4 bg-semantic-bg-tertiary rounded w-1/2 animate-pulse" />
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : error ? (
            <motion.div variants={itemVariants} className="text-center py-12">
              <motion.p className="text-semantic-status-danger mb-4">
                Failed to load recently added questions
              </motion.p>
              <motion.p className="text-sm text-semantic-text-tertiary">
                {error}
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {recentlyAdded.map((question) => (
                <motion.div key={question.id} variants={itemVariants}>
                  <QuestionCard href={`/questions/${question.slug}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <TopicBadge topic={question.topic} />
                      <DifficultyBadge difficulty={question.difficulty} />
                    </div>
                    <h3 className="text-lg font-semibold text-semantic-text-primary group-hover:text-semantic-interactive-primary dark:group-hover:text-semantic-interactive-primary transition-colors line-clamp-2">
                      {question.question}
                    </h3>
                    <p className="mt-2 text-sm text-semantic-text-tertiary line-clamp-2">
                      {question.shortAnswer}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {question.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-xs bg-semantic-bg-tertiary text-semantic-text-secondary rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {question.tags.length > 3 && (
                        <span className="px-2 py-0.5 text-xs bg-semantic-bg-tertiary text-semantic-text-tertiary rounded">
                          +{question.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </QuestionCard>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </motion.section>

      {/* Featured Questions */}
      <motion.section
        variants={sectionVariants}
        aria-labelledby="featured-heading"
        className="px-4 sm:px-6 lg:px-8"
      >
        <motion.div variants={containerVariants} className="max-w-7xl mx-auto">
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-between mb-8"
          >
            <h2
              id="featured-heading"
              className="text-2xl sm:text-3xl font-bold text-semantic-text-primary"
            >
              Featured Questions
            </h2>
            <Link
              to="/questions"
              className="text-sm font-medium text-semantic-interactive-primary hover:text-semantic-interactive-primary-hover"
            >
              View all →
            </Link>
          </motion.div>
          {questionsLoading ? (
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {[1, 2, 3].map((i) => (
                <motion.div key={i} variants={itemVariants}>
                  <Card className="p-6">
                    <div className="h-4 bg-semantic-bg-tertiary rounded w-3/4 mb-4 animate-pulse" />
                    <div className="h-4 bg-semantic-bg-tertiary rounded w-1/2 animate-pulse" />
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : error ? (
            <motion.div variants={itemVariants} className="text-center py-12">
              <motion.p className="text-semantic-status-danger mb-4">
                Failed to load featured questions
              </motion.p>
              <motion.p className="text-sm text-semantic-text-tertiary">
                {error}
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {featured.map((question) => (
                <motion.div key={question.id} variants={itemVariants}>
                  <QuestionCard href={`/questions/${question.slug}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-0.5 text-xs font-medium bg-semantic-status-warning-bg text-semantic-status-warning-text rounded">
                        Featured
                      </span>
                      <TopicBadge topic={question.topic} />
                      <DifficultyBadge difficulty={question.difficulty} />
                    </div>
                    <h3 className="text-lg font-semibold text-semantic-text-primary group-hover:text-semantic-interactive-primary dark:group-hover:text-semantic-interactive-primary transition-colors line-clamp-2">
                      {question.question}
                    </h3>
                    <p className="mt-2 text-sm text-semantic-text-tertiary line-clamp-2">
                      {question.shortAnswer}
                    </p>
                  </QuestionCard>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </motion.section>

      {/* Learning Progress & Practice */}
      <motion.section
        variants={sectionVariants}
        aria-labelledby="learning-heading"
        className="px-4 sm:px-6 lg:px-8"
      >
        <motion.div variants={containerVariants} className="max-w-7xl mx-auto">
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-between mb-2"
          >
            <h2
              id="learning-heading"
              className="text-2xl sm:text-3xl font-bold text-semantic-text-primary"
            >
              Your Learning Journey
            </h2>
          </motion.div>

          {/* Learning Progress - Full Width */}
          <motion.div variants={itemVariants}>
            <LearningProgress totalQuestions={totalQuestions} />
          </motion.div>

          {/* Random Question & Interview Practice - 2 Columns */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6"
          >
            <motion.div variants={itemVariants}>
              <RandomQuestion questions={allQuestions} />
            </motion.div>
            <motion.div variants={itemVariants}>
              <InterviewPractice questions={allQuestions} />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Features */}
      <motion.section
        variants={sectionVariants}
        aria-labelledby="features-heading"
        className="px-4 sm:px-6 lg:px-8"
      >
        <motion.div variants={containerVariants} className="max-w-7xl mx-auto">
          <motion.h2
            variants={itemVariants}
            id="features-heading"
            className="text-2xl sm:text-3xl font-bold text-semantic-text-primary mb-8 text-center"
          >
            Features
          </motion.h2>
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              {
                title: "Search & Filter",
                description:
                  "Find questions by topic, difficulty, tags, or keyword search across questions and answers.",
              },
              {
                title: "Code Examples",
                description:
                  "Syntax-highlighted code snippets with copy-to-clipboard functionality.",
              },
              {
                title: "Bookmarks",
                description:
                  "Save questions for later review using localStorage - no account required.",
              },
              {
                title: "Dark Mode",
                description:
                  "Beautiful dark/light theme with system preference detection and manual toggle.",
              },
              {
                title: "Admin Panel",
                description:
                  "Secure admin dashboard for managing questions with draft/publish workflow.",
              },
              {
                title: "Responsive",
                description:
                  "Optimized for mobile, tablet, and desktop with Tailwind CSS.",
              },
            ].map((feature) => (
              <motion.div key={feature.title} variants={itemVariants}>
                <Card className="text-center">
                  <CardContent className="py-6">
                    <h3 className="text-lg font-semibold text-semantic-text-primary">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm text-semantic-text-tertiary">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.section>

      {/* CTA */}
      <motion.section
        variants={sectionVariants}
        className="px-4 sm:px-6 lg:px-8 text-center"
      >
        <motion.div variants={itemVariants} className="max-w-3xl mx-auto">
          <Card className="bg-semantic-interactive-primary dark:bg-semantic-interactive-primary-hover border-none">
            <CardContent className="py-12 px-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Ready to Start Preparing?
              </h2>
              <p className="text-semantic-interactive-primary/90 mb-8 max-w-2xl mx-auto">
                Browse hundreds of interview questions across all major frontend
                technologies. Free, open-source, and always up to date.
              </p>
              <MotionLink
                to="/questions"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium text-semantic-interactive-primary bg-white rounded-lg hover:bg-semantic-bg-tertiary focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-semantic-interactive-primary transition-colors"
              >
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
                Browse Questions
              </MotionLink>
            </CardContent>
          </Card>
        </motion.div>
      </motion.section>
    </motion.div>
  );
}
