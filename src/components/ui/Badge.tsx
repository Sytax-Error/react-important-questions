import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const variantClasses = {
  default: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
  success:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  warning:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  danger: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  info: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  outline:
    "border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300",
};

const sizeClasses = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
  lg: "px-3 py-1.5 text-base",
};

export function Badge({
  children,
  variant = "default",
  size = "md",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

export function DifficultyBadge({
  difficulty,
  className = "",
}: {
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  className?: string;
}) {
  const variants = {
    Beginner: "success" as const,
    Intermediate: "warning" as const,
    Advanced: "danger" as const,
  };

  return (
    <Badge variant={variants[difficulty]} size="sm" className={className}>
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

export function TopicBadge({ topic }: { topic: string }) {
  return (
    <Badge variant="info" size="sm">
      {topic}
    </Badge>
  );
}
