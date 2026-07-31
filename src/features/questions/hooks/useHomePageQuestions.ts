import { useState, useEffect } from "react";
import { InterviewQuestion } from "@/types/questions";
import {
  getRecentlyAddedQuestions,
  getFeaturedQuestions,
} from "../services/questionService";

export function useHomePageQuestions() {
  const [recentlyAdded, setRecentlyAdded] = useState<InterviewQuestion[]>([]);
  const [featured, setFeatured] = useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);

        const [recent, featuredQuestions] = await Promise.all([
          getRecentlyAddedQuestions(5),
          getFeaturedQuestions(3),
        ]);

        if (isMounted) {
          setRecentlyAdded(recent);
          setFeatured(featuredQuestions);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load home page questions",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchQuestions();

    return () => {
      isMounted = false;
    };
  }, []);

  return { recentlyAdded, featured, loading, error };
}
