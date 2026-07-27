export interface ValidationErrors {
  [key: string]: string;
}

export function validateQuestionForm(data: {
  question: string;
  slug: string;
  topic: string;
  category: string;
  difficulty: string;
  shortAnswer: string;
  detailedAnswer: string;
  importantPoints: string[];
  followUpQuestions: string[];
  tags: string[];
}): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.question.trim()) {
    errors.question = 'Question is required';
  } else if (data.question.trim().length < 10) {
    errors.question = 'Question must be at least 10 characters';
  }

  if (!data.slug.trim()) {
    errors.slug = 'Slug is required';
  } else if (!/^[a-z0-9-]+$/.test(data.slug)) {
    errors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
  } else if (data.slug.length > 100) {
    errors.slug = 'Slug must be 100 characters or less';
  }

  if (!data.topic.trim()) {
    errors.topic = 'Topic is required';
  }

  if (!data.category.trim()) {
    errors.category = 'Category is required';
  }

  if (!data.difficulty) {
    errors.difficulty = 'Difficulty is required';
  }

  if (!data.shortAnswer.trim()) {
    errors.shortAnswer = 'Short answer is required';
  } else if (data.shortAnswer.trim().length < 20) {
    errors.shortAnswer = 'Short answer must be at least 20 characters';
  }

  if (!data.detailedAnswer.trim()) {
    errors.detailedAnswer = 'Detailed answer is required';
  } else if (data.detailedAnswer.trim().length < 50) {
    errors.detailedAnswer = 'Detailed answer must be at least 50 characters';
  }

  const validPoints = data.importantPoints.filter((p) => p.trim());
  if (validPoints.length === 0) {
    errors.importantPoints = 'At least one important point is required';
  }

  const validFollowUps = data.followUpQuestions.filter((q) => q.trim());
  if (validFollowUps.length === 0) {
    errors.followUpQuestions = 'At least one follow-up question is required';
  }

  const validTags = data.tags.filter((t) => t.trim());
  if (validTags.length === 0) {
    errors.tags = 'At least one tag is required';
  }

  return errors;
}

export function validateEmail(email: string): string | null {
  if (!email.trim()) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email format';
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  return null;
}

export function validateRequired(value: string, fieldName: string): string | null {
  if (!value.trim()) return `${fieldName} is required`;
  return null;
}