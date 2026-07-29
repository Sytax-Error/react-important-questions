import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { QuestionForm } from "@/features/questions/components/QuestionForm";
import { getQuestionById } from "@/features/questions/services/questionService";
import { useAuth } from "@/features/auth";
import { InterviewQuestion } from "@/types/questions";

export function AdminQuestionFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [questionData, setQuestionData] = useState<InterviewQuestion | undefined>(undefined);

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
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full border-4 border-primary-600 border-t-transparent w-12 h-12"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <QuestionForm initialData={questionData} />
    </div>
  );
}
