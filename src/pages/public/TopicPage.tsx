import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "../../components/ui/Card";
import { DifficultyBadge, TopicBadge, Badge } from "../../components/ui/Badge";
import { QuestionCard } from "../../components/ui/QuestionCard";
import { PageLoader } from "../../components/ui/LoadingSpinner";
import { InterviewQuestion } from "../../types/questions";
import { subscribeToPublishedQuestions } from "../../features/questions/services/questionService";
import { Link } from "react-router-dom";

const MotionCard = motion(Card);
const MotionDiv = motion.div;
const MotionLink = motion(Link);

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

export function TopicPage() {
  const { topic } = useParams<{ topic: string }>();
  const decodedTopic = topic ? decodeURIComponent(topic) : "";
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!decodedTopic) return;
    setLoading(true);

    const unsubscribe = subscribeToPublishedQuestions(
      (fetchedQuestions) => {
        setQuestions(fetchedQuestions);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching questions by topic:", error);
        setQuestions([]);
        setLoading(false);
      },
      { topic: decodedTopic },
    );

    return () => unsubscribe();
  }, [decodedTopic]);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <MotionDiv
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8 px-4 sm:px-6 lg:px-8"
    >
      {/* Header */}
      <MotionDiv variants={headerVariants}>
        <nav className="mb-4" aria-label="Breadcrumb">
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
            <li className="text-semantic-text-primary" aria-current="page">
              {decodedTopic}
            </li>
          </ol>
        </nav>
        <div className="flex items-center gap-3 mb-4">
          <TopicBadge topic={decodedTopic} />
        </div>
        <h1 className="text-3xl font-bold text-semantic-text-primary">
          {decodedTopic} Questions
        </h1>
        <p className="mt-2 text-semantic-text-secondary">
          {questions.length} question{questions.length !== 1 ? "s" : ""} found
        </p>
      </MotionDiv>

      {/* Questions List */}
      {questions.length === 0 ? (
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
              No published questions available for this topic yet.
            </p>
          </CardContent>
        </MotionCard>
      ) : (
        <MotionDiv
          variants={containerVariants}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {questions.map((question) => (
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
      )}
    </MotionDiv>
  );
}
