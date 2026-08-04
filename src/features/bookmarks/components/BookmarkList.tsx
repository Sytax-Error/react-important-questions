import { Card, CardContent } from "@/components/ui/Card";
import { Bookmark } from "@/types/bookmarks";
import { BookmarkCard } from "./BookmarkCard";

interface BookmarkListProps {
  bookmarks: Bookmark[];
  onRemoveBookmark: (questionId: string) => void;
  loading?: boolean;
  emptyMessage?: string;
  emptyAction?: React.ReactNode;
}

/**
 * Bookmark list/grid container for the bookmarks page
 */
export function BookmarkList({
  bookmarks,
  onRemoveBookmark,
  loading = false,
  emptyMessage = "No bookmarks yet",
  emptyAction,
}: BookmarkListProps) {
  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="h-[300px] animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3" />
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
            {emptyMessage}
          </h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Start browsing questions and click the bookmark icon to save them
            for later.
          </p>
          {emptyAction && <div className="mt-6">{emptyAction}</div>}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {bookmarks.map((bookmark) => (
        <BookmarkCard
          key={bookmark.questionId}
          bookmark={bookmark}
          onRemove={onRemoveBookmark}
        />
      ))}
    </div>
  );
}
