import { ReactNode, forwardRef, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "outline";
  size?: "sm" | "md" | "lg";
}

const variantClasses = {
  default: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
  success:
    "bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-400",
  warning:
    "bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-400",
  danger:
    "bg-danger-100 text-danger-800 dark:bg-danger-900/30 dark:text-danger-400",
  info: "bg-info-100 text-info-800 dark:bg-info-900/30 dark:text-info-400",
  outline:
    "border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300",
};

const sizeClasses = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
  lg: "px-3 py-1.5 text-base",
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    { children, variant = "default", size = "md", className = "", ...props },
    ref,
  ) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center font-medium rounded-full",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {children}
      </span>
    );
  },
);

Badge.displayName = "Badge";

export function DifficultyBadge({
  difficulty,
  size = "sm",
  className = "",
}: {
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const variants = {
    Beginner: "success" as const,
    Intermediate: "warning" as const,
    Advanced: "danger" as const,
  };

  return (
    <Badge variant={variants[difficulty]} size={size} className={className}>
      {difficulty}
    </Badge>
  );
}

export function StatusBadge({ status }: { status: "draft" | "published" }) {
  const variants = {
    draft: "outline" as const,
    published: "success" as const,
  };

  return (
    <Badge variant={variants[status]} size="sm">
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

export function TopicBadge({
  topic,
  size = "sm",
  className = "",
}: {
  topic: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <Badge variant="info" size={size} className={className}>
      {topic}
    </Badge>
  );
}
