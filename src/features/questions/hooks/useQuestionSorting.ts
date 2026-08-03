import { useState, useMemo } from "react";
import { InterviewQuestion, Difficulty } from "@/types/questions";

export type SortOption =
  | "newest"
  | "oldest"
  | "difficulty-asc"
  | "difficulty-desc"
  | "alphabetical"
  | "topic";

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "difficulty-asc", label: "Difficulty: Beginner → Advanced" },
  { value: "difficulty-desc", label: "Difficulty: Advanced → Beginner" },
  { value: "alphabetical", label: "Alphabetical (A-Z)" },
  { value: "topic", label: "Group by Topic" },
];

const difficultyOrder: Record<Difficulty, number> = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
};

export function useQuestionSorting(
  questions: InterviewQuestion[],
  initialSort: SortOption = "newest",
) {
  const [sortBy, setSortBy] = useState<SortOption>(initialSort);

  const sortedQuestions = useMemo(() => {
    const sorted = [...questions];

    switch (sortBy) {
      case "newest":
        return sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
      case "oldest":
        return sorted.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
      case "difficulty-asc":
        return sorted.sort(
          (a, b) =>
            difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty],
        );
      case "difficulty-desc":
        return sorted.sort(
          (a, b) =>
            difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty],
        );
      case "alphabetical":
        return sorted.sort((a, b) => a.question.localeCompare(b.question));
      case "topic":
        return sorted.sort((a, b) => a.topic.localeCompare(b.topic));
      default:
        return sorted;
    }
  }, [questions, sortBy]);

  return {
    sortBy,
    setSortBy,
    sortedQuestions,
    sortOptions: SORT_OPTIONS,
  };
}
