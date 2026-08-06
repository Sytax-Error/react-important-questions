import {
  ReactNode,
  forwardRef,
  AnchorHTMLAttributes,
  HTMLAttributes,
} from "react";
import { Card, CardContent } from "./Card";
import { cn } from "@/lib/utils";

interface QuestionCardProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  href?: string;
  className?: string;
  hover?: boolean;
}

export const QuestionCard = forwardRef<HTMLAnchorElement, QuestionCardProps>(
  ({ children, href, className = "", hover = false, ...props }, ref) => {
    const cardContent = (
      <Card hover={hover} className={cn("h-full", className)}>
        <CardContent className="p-6"> {children} </CardContent>
      </Card>
    );
    if (href) {
      return (
        <a
          ref={ref}
          href={href}
          className={cn("group block h-full", className)}
          {...props}
        >
          {cardContent}
        </a>
      );
    }
    // When no href, render as div - filter out anchor-specific props
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {
      download,
      hrefLang,
      media,
      ping,
      target,
      rel,
      referrerPolicy,
      ...divProps
    } = props;
    return (
      <div
        className={cn(className)}
        {...(divProps as HTMLAttributes<HTMLDivElement>)}
      >
        {cardContent}
      </div>
    );
  },
);

QuestionCard.displayName = "QuestionCard";
