import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const MotionCard = motion(Card);
const MotionDiv = motion.div;
const MotionButton = motion(Button);

// Framer Motion variants for consistent animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
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

const titleVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

export function NotFoundPage() {
  return (
    <MotionDiv
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-[60vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16"
    >
      <MotionCard
        variants={itemVariants}
        className="text-center max-w-md w-full bg-semantic-bg-primary border-semantic-border-primary"
      >
        <CardContent className="py-12">
          <MotionDiv
            variants={titleVariants}
            className="text-6xl font-bold text-semantic-interactive-primary"
          >
            404
          </MotionDiv>
          <MotionDiv
            variants={itemVariants}
            className="mt-4 text-2xl font-semibold text-semantic-text-primary"
          >
            Page Not Found
          </MotionDiv>
          <MotionDiv
            variants={itemVariants}
            className="mt-2 text-semantic-text-secondary"
          >
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or doesn&apos;t exist.
          </MotionDiv>
          <MotionDiv variants={itemVariants} className="mt-6">
            <MotionButton
              className="w-full sm:w-auto"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to="/"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-semantic-text-inverse bg-semantic-interactive-primary rounded-lg hover:bg-semantic-interactive-primary-hover focus:outline-none focus:ring-2 focus:ring-semantic-interactive-primary focus:ring-offset-2 dark:focus:ring-offset-semantic-bg-primary transition-colors"
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
                Back to Home
              </Link>
            </MotionButton>
          </MotionDiv>
        </CardContent>
      </MotionCard>
    </MotionDiv>
  );
}