import { useEffect, useState } from "react";
import { InterviewQuestion, Difficulty } from "@/types/questions";
import { subscribeToPublishedQuestions } from "../services/questionService";

export interface PublicQuestionMeta {
  totalQuestions: number;
  topics: string[];
  difficulties: Difficulty[];
  loading: boolean;
}

export function usePublicQuestionMeta(): PublicQuestionMeta {
  const [meta, setMeta] = useState<PublicQuestionMeta>({
    totalQuestions: 0,
    topics: [],
    difficulties: [],
    loading: true,
  });

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const load = async () => {
      unsubscribe = subscribeToPublishedQuestions(
        (questions) => {
          const topicSet = new Set<string>();
          const difficultySet = new Set<Difficulty>();

          questions.forEach((question: InterviewQuestion) => {
            if (question.topic) topicSet.add(question.topic);
            if (question.difficulty) difficultySet.add(question.difficulty);
          });

          setMeta({
            totalQuestions: questions.length,
            topics: Array.from(topicSet).sort(),
            difficulties: Array.from(difficultySet).sort(),
            loading: false,
          });
        },
        (error) => {
          console.error("Failed to load public question metadata:", error);
          setMeta({
            totalQuestions: 0,
            topics: [],
            difficulties: [],
            loading: false,
          });
        },
      );
    };

    load();

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, []);

  return meta;
}
