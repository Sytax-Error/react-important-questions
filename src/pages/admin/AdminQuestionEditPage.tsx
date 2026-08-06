import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { QuestionForm } from "@/features/questions/components/QuestionForm";
import { getQuestionById } from "@/features/questions/services/questionService";
import { useAuth } from "@/features/auth";
import { InterviewQuestion } from "@/types/questions";

const MotionDiv = motion.div;

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

const cardVariants = {
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

export function AdminQuestionEditPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [questionData, setQuestionData] = useState<
    InterviewQuestion | undefined
  >(undefined);

  // Fetch question data if editing an existing question
  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) return;

    // Redirect to login if not authenticated
    if (!user) {
      navigate("/admin/login");
      return;
    }

    if (id) {
      const fetchQuestion = async () => {
        try {
          const question = await getQuestionById(id);
          setQuestionData(question ?? undefined);
        } catch (err) {
          setError("Failed to load question. Please try again.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchQuestion();
    } else {
      // Create mode - no question data needed
      setLoading(false);
    }
  }, [id, user, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <MotionDiv
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        className="flex flex-col items-center justify-center py-12"
      >
        <div className="animate-spin rounded-full border-4 border-semantic-interactive-primary border-t-transparent w-12 h-12"></div>
        <p className="mt-4 text-semantic-text-secondary">Loading...</p>
      </MotionDiv>
    );
  }

  if (error) {
    return (
      <MotionDiv
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        className="p-4 bg-semantic-status-danger-bg border border-semantic-status-danger-border rounded-lg text-semantic-status-danger-text"
      >
        {error}
      </MotionDiv>
    );
  }

  return (
    <MotionDiv
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <QuestionForm initialData={questionData} />
    </MotionDiv>
  );
}
