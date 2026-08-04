import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/Card";
import { DifficultyBadge, TopicBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Bookmark } from "@/types/bookmarks";
import { format } from "date-fns";

interface BookmarkCardProps {
  bookmark: Bookmark;
  onRemove: (questionId: string) => void;
  showRemoveButton?: boolean;
}

/**
 * Individual bookmark card for the bookmarks page
 */
export function BookmarkCard({
  bookmark,
  onRemove,
  showRemoveButton = true,
}: BookmarkCardProps) {
  return (
    <Link to={`/questions/${bookmark.questionSlug}`} className="group block">
      <Card hover className="h-full flex flex-col">
        <CardContent className="p-6 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <TopicBadge topic={bookmark.topic} size="sm" />
              <DifficultyBadge
                difficulty={
                  bookmark.difficulty as
                    | "Beginner"
                    | "Intermediate"
                    | "Advanced"
                }
                size="sm"
              />
            </div>
            {showRemoveButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onRemove(bookmark.questionId);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                aria-label="Remove bookmark"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Button>
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 flex-1">
            {bookmark.questionTitle}
          </h3>
          <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span>
              Saved: {format(new Date(bookmark.savedAt), "MMM d, yyyy")}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
