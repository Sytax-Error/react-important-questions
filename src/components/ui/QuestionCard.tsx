import { ReactNode } from "react";
import { Card, CardContent } from "./Card";
interface QuestionCardProps {
  children: ReactNode;
  href?: string;
  className?: string;
  hover?: boolean;
}
export function QuestionCard({
  children,
  href,
  className = "",
  hover = false,
}: QuestionCardProps) {
  const cardContent = (
    <Card hover={hover} className={`h-full ${className}`}>
      {" "}
      <CardContent className="p-6"> {children} </CardContent>{" "}
    </Card>
  );
  if (href) {
    return (
      <a href={href} className="group block h-full">
        {" "}
        {cardContent}{" "}
      </a>
    );
  }
  return cardContent;
}
