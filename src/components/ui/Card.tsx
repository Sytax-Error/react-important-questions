import { ReactNode, forwardRef, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    { children, className = "", hover = false, padding = "md", ...props },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700",
          "shadow-sm dark:shadow-lg",
          paddingClasses[padding],
          hover &&
            "hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-shadow duration-200 cursor-pointer",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";

export function CardHeader({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("mb-4", className)}>{children}</div>;
}

export function CardTitle({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={cn(
        "text-lg font-semibold text-gray-900 dark:text-gray-100",
        className,
      )}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn("mt-1 text-sm text-gray-500 dark:text-gray-400", className)}
    >
      {children}
    </p>
  );
}

export function CardContent({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn(className)}>{children}</div>;
}

export function CardFooter({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mt-4 pt-4 border-t border-gray-200 dark:border-gray-700",
        className,
      )}
    >
      {children}
    </div>
  );
}
