import { Link } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/Card";
import { TopicBadge, DifficultyBadge } from "../../components/ui/Badge";
import { usePublicQuestionMeta } from "../../features/questions/hooks/usePublicQuestionMeta";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";

export function HomePage() {
  const { totalQuestions, topics, difficulties, loading } =
    usePublicQuestionMeta();

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

  if (loading) {
    return (
      <div className="space-y-12">
        {/* Hero Section */}
        <section className="text-center py-16 sm:py-24">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            Questions for{" "}
            <span className="text-primary-600 dark:text-primary-400">
              Frontend Developers
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Prepare for your next technical interview with curated questions
            covering React, JavaScript, TypeScript, Node.js, and more.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/questions"
              className="w-full sm:w-auto px-8 py-3 text-base font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors"
            >
              Browse Questions
            </Link>
            <Link
              to="/topics/JavaScript"
              className="w-full sm:w-auto px-8 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:text-gray-300 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors"
            >
              Start with JavaScript
            </Link>
          </div>
        </section>

        {/* Stats - Loading */}
        <section aria-labelledby="stats-heading">
          <h2 id="stats-heading" className="sr-only">
            Statistics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {stats.map((stat) => (
              <Card key={stat.label} className="text-center">
                <CardContent className="py-8">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                    {stat.icon}
                  </div>
                  <LoadingSpinner size="lg" />
                  <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Topics - Loading */}
        <section aria-labelledby="topics-heading">
          <div className="flex items-center justify-between mb-8">
            <h2
              id="topics-heading"
              className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100"
            >
              Browse by Topic
            </h2>
            <Link
              to="/questions"
              className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              View all topics →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </Card>
            ))}
          </div>
        </section>

        {/* Difficulties - Loading */}
        <section aria-labelledby="difficulties-heading">
          <div className="flex items-center justify-between mb-8">
            <h2
              id="difficulties-heading"
              className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100"
            >
              Filter by Difficulty
            </h2>
            <Link
              to="/questions"
              className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </Card>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-16 sm:py-24">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
          Questions for{" "}
          <span className="text-primary-600 dark:text-primary-400">
            Frontend Developers
          </span>
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Prepare for your next technical interview with curated questions
          covering React, JavaScript, TypeScript, Node.js, and more.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/questions"
            className="w-full sm:w-auto px-8 py-3 text-base font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors"
          >
            Browse Questions
          </Link>
          <Link
            to="/topics/JavaScript"
            className="w-full sm:w-auto px-8 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:text-gray-300 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors"
          >
            Start with JavaScript
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">
          Statistics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <Card key={stat.label} className="text-center">
              <CardContent className="py-8">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                  {stat.icon}
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Topics */}
      <section aria-labelledby="topics-heading">
        <div className="flex items-center justify-between mb-8">
          <h2
            id="topics-heading"
            className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100"
          >
            Browse by Topic
          </h2>
          <Link
            to="/questions"
            className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            View all topics →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredTopics.map((topic) => (
            <Link
              key={topic}
              to={`/topics/${encodeURIComponent(topic)}`}
              className="group"
            >
              <Card hover className="h-full">
                <CardContent className="py-6">
                  <div className="flex items-center justify-between mb-3">
                    <TopicBadge topic={topic} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {topic}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Explore interview questions about {topic}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Difficulty Levels */}
      <section aria-labelledby="difficulty-heading" className="pt-4">
        <h2
          id="difficulty-heading"
          className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8"
        >
          Filter by Difficulty
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {difficulties.map((difficulty) => (
            <Link
              key={difficulty}
              to={`/questions?difficulty=${difficulty}`}
              className="group"
            >
              <Card hover className="h-full text-center">
                <CardContent className="py-8">
                  <DifficultyBadge
                    difficulty={difficulty}
                    className="mb-3 inline-block"
                  />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {difficulty}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {difficulty === "Beginner" &&
                      "Fundamental concepts and basics"}
                    {difficulty === "Intermediate" &&
                      "Real-world scenarios and patterns"}
                    {difficulty === "Advanced" &&
                      "Complex architectures and optimizations"}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section aria-labelledby="features-heading" className="pt-4">
        <h2
          id="features-heading"
          className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center"
        >
          Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <Card key={feature.title} className="text-center">
              <CardContent className="py-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="pt-4 text-center">
        <Card className="bg-primary-600 dark:bg-primary-700 border-none">
          <CardContent className="py-12 px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Ready to Start Preparing?
            </h2>
            <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
              Browse hundreds of interview questions across all major frontend
              technologies. Free, open-source, and always up to date.
            </p>
            <Link
              to="/questions"
              className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium text-primary-600 bg-white rounded-lg hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600 transition-colors"
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
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
