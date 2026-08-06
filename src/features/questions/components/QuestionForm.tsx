import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import {
  createQuestion,
  updateQuestion,
  checkSlugExists,
} from "@/features/questions/services/questionService";
import {
  QuestionFormData,
  InterviewQuestion,
  TOPICS,
  DIFFICULTIES,
  CATEGORIES,
} from "@/types/questions";
import { useAuth } from "@/features/auth";
import { generateSlug, validateSlug } from "@/utils/slug";
import { validateQuestionForm } from "@/utils/validation";

const MotionCard = motion(Card);
const MotionDiv = motion.div;
const MotionButton = motion(Button);

// Framer Motion variants for consistent animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

const fieldVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

interface QuestionFormProps {
  initialData?: InterviewQuestion;
}

export function QuestionForm({ initialData }: QuestionFormProps) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<QuestionFormData>({
    question: "",
    slug: "",
    topic: "",
    category: "",
    difficulty: "Beginner",
    shortAnswer: "",
    detailedAnswer: "",
    code: "",
    language: "",
    importantPoints: [""],
    followUpQuestions: [""],
    tags: [""],
    isPublished: false,
    status: "draft",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof QuestionFormData, string>>
  >({});
  const [slugError, setSlugError] = useState<string | null>(null);
  const [isSlugManual, setIsSlugManual] = useState(false);
  const unsavedChangesRef = useRef(false);

  // Initialize form with existing question data if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        question: initialData.question,
        slug: initialData.slug,
        topic: initialData.topic,
        category: initialData.category,
        difficulty: initialData.difficulty,
        shortAnswer: initialData.shortAnswer,
        detailedAnswer: initialData.detailedAnswer,
        code: initialData.code || "",
        language: initialData.language || "",
        importantPoints:
          initialData.importantPoints.length > 0
            ? initialData.importantPoints
            : [""],
        followUpQuestions:
          initialData.followUpQuestions.length > 0
            ? initialData.followUpQuestions
            : [""],
        tags: initialData.tags.length > 0 ? initialData.tags : [""],
        isPublished: initialData.isPublished,
        status: initialData.status,
      });
    }
  }, [initialData]);

  // Auto-generate slug from question when not manually edited
  useEffect(() => {
    if (!isSlugManual && formData.question) {
      const slug = generateSlug(formData.question);
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.question, isSlugManual]);

  const handleChange = (
    field: keyof QuestionFormData,
    value: string | string[] | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    // Mark that we have unsaved changes
    unsavedChangesRef.current = true;
    // If we're changing the question and slug hasn't been manually edited, regenerate slug
    if (field === "question" && !isSlugManual) {
      const slug = generateSlug(value as string);
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleArrayChange = (
    field: "importantPoints" | "followUpQuestions" | "tags",
    index: number,
    value: string,
  ) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    handleChange(field, newArray);
    unsavedChangesRef.current = true;
  };

  const handleArrayAdd = (
    field: "importantPoints" | "followUpQuestions" | "tags",
  ) => {
    const newArray = [...formData[field], ""];
    handleChange(field, newArray);
    unsavedChangesRef.current = true;
  };

  const handleArrayRemove = (
    field: "importantPoints" | "followUpQuestions" | "tags",
    index: number,
  ) => {
    if (formData[field].length <= 1) return;
    const newArray = formData[field].filter((_, i) => i !== index);
    handleChange(field, newArray);
    unsavedChangesRef.current = true;
  };

  const handleSlugChange = (value: string) => {
    setIsSlugManual(true);
    const slug = generateSlug(value);
    handleChange("slug", slug);
    if (slug && !validateSlug(slug)) {
      setSlugError(
        "Slug can only contain lowercase letters, numbers, and hyphens",
      );
    } else {
      setSlugError(null);
    }
    unsavedChangesRef.current = true;
  };

  const validateForm = () => {
    const validationErrors = validateQuestionForm(formData);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (action: "save" | "publish") => {
    if (!validateForm()) return;
    if (!user) {
      setErrors({ question: "You must be logged in to save questions" });
      return;
    }

    setSaving(true);
    setErrors({});

    try {
      const slugExists = await checkSlugExists(
        formData.slug,
        id ? id : undefined,
      );
      if (slugExists) {
        setSlugError("A question with this slug already exists");
        setSaving(false);
        return;
      }

      const questionData: Omit<
        InterviewQuestion,
        "id" | "createdAt" | "updatedAt"
      > = {
        ...formData,
        importantPoints: formData.importantPoints.filter((p) => p.trim()),
        followUpQuestions: formData.followUpQuestions.filter((q) => q.trim()),
        tags: formData.tags.filter((t) => t.trim()),
        isPublished: action === "publish",
        status: action === "publish" ? "published" : "draft",
        createdBy: user.uid,
        updatedBy: user.uid,
      };

      let questionId: string;
      if (id) {
        // Editing existing question
        await updateQuestion(id, questionData);
        questionId = id;
      } else {
        // Creating new question
        questionId = await createQuestion(questionData);
      }

      // Reset unsaved changes flag after successful save
      unsavedChangesRef.current = false;

      // Navigate to edit page for the saved question
      navigate(`/admin/questions/${questionId}/edit`, { replace: true });
    } catch (err) {
      setErrors({ question: "Failed to save question. Please try again." });
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // Warn about unsaved changes when navigating away
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (unsavedChangesRef.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  return (
    <MotionDiv
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit("save");
        }}
      >
        {/* Basic Info */}
        <MotionCard variants={cardVariants}>
          <CardHeader>
            <CardTitle className="text-lg text-semantic-text-primary">
              {id ? "Edit Question" : "Create New Question"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <MotionDiv
              variants={containerVariants}
              className="grid gap-4 sm:grid-cols-2"
            >
              <MotionDiv variants={fieldVariants}>
                <label
                  htmlFor="topic"
                  className="block text-sm font-medium text-semantic-text-secondary mb-2"
                >
                  Topic *
                </label>
                <Select
                  id="topic"
                  value={formData.topic}
                  onChange={(e) => handleChange("topic", e.target.value)}
                  error={errors.topic}
                  required
                  options={TOPICS.map((topic) => ({
                    value: topic,
                    label: topic,
                  }))}
                  placeholder="Select a topic"
                />
              </MotionDiv>

              <MotionDiv variants={fieldVariants}>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-semantic-text-secondary mb-2"
                >
                  Category *
                </label>
                <Select
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  error={errors.category}
                  required
                  options={CATEGORIES.map((category) => ({
                    value: category,
                    label: category,
                  }))}
                  placeholder="Select a category"
                />
              </MotionDiv>
            </MotionDiv>

            <MotionDiv
              variants={containerVariants}
              className="grid gap-4 sm:grid-cols-2"
            >
              <MotionDiv variants={fieldVariants}>
                <label
                  htmlFor="difficulty"
                  className="block text-sm font-medium text-semantic-text-secondary mb-2"
                >
                  Difficulty *
                </label>
                <Select
                  id="difficulty"
                  value={formData.difficulty}
                  onChange={(e) =>
                    handleChange(
                      "difficulty",
                      e.target.value as
                        | "Beginner"
                        | "Intermediate"
                        | "Advanced",
                    )
                  }
                  error={errors.difficulty}
                  required
                  options={DIFFICULTIES.map((d) => ({ value: d, label: d }))}
                  placeholder="Select difficulty"
                />
              </MotionDiv>

              <MotionDiv
                variants={fieldVariants}
                className="flex items-center gap-4"
              >
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) =>
                      handleChange("isPublished", e.target.checked)
                    }
                    className="h-4 w-4 rounded border-semantic-border-primary text-semantic-interactive-primary focus:ring-semantic-interactive-primary"
                  />
                  <span className="text-sm text-semantic-text-secondary">
                    Publish immediately
                  </span>
                </label>
              </MotionDiv>
            </MotionDiv>

            <MotionDiv variants={fieldVariants}>
              <label
                htmlFor="question"
                className="block text-sm font-medium text-semantic-text-secondary mb-2"
              >
                Question *
              </label>
              <Textarea
                id="question"
                value={formData.question}
                onChange={(e) => handleChange("question", e.target.value)}
                error={errors.question}
                placeholder="Enter the interview question..."
                rows={3}
                helperText="This will be the main question displayed to users"
              />
            </MotionDiv>

            <MotionDiv variants={fieldVariants}>
              <label
                htmlFor="slug"
                className="block text-sm font-medium text-semantic-text-secondary mb-2"
              >
                URL Slug *
              </label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                error={errors.slug || slugError || undefined}
                placeholder="auto-generated-from-question"
                helperText="Auto-generated from question. Must be unique. Use lowercase, numbers, and hyphens only."
              />
            </MotionDiv>
          </CardContent>
        </MotionCard>

        {/* Answers */}
        <MotionCard variants={cardVariants}>
          <CardHeader>
            <CardTitle className="text-lg text-semantic-text-primary">
              Answers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <MotionDiv variants={fieldVariants}>
              <label
                htmlFor="shortAnswer"
                className="block text-sm font-medium text-semantic-text-secondary mb-2"
              >
                Short Answer *
              </label>
              <Textarea
                id="shortAnswer"
                value={formData.shortAnswer}
                onChange={(e) => handleChange("shortAnswer", e.target.value)}
                error={errors.shortAnswer}
                placeholder="Brief 1-2 sentence answer..."
                rows={3}
                helperText="Concise answer for quick reference"
              />
            </MotionDiv>

            <MotionDiv variants={fieldVariants}>
              <label
                htmlFor="detailedAnswer"
                className="block text-sm font-medium text-semantic-text-secondary mb-2"
              >
                Detailed Answer *
              </label>
              <Textarea
                id="detailedAnswer"
                value={formData.detailedAnswer}
                onChange={(e) => handleChange("detailedAnswer", e.target.value)}
                error={errors.detailedAnswer}
                placeholder="Comprehensive explanation with examples..."
                rows={8}
                helperText="Full detailed explanation. Supports markdown formatting."
              />
            </MotionDiv>
          </CardContent>
        </MotionCard>

        {/* Code Example */}
        <MotionCard variants={cardVariants}>
          <CardHeader>
            <CardTitle className="text-lg text-semantic-text-primary">
              Code Example (Optional)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <MotionDiv
              variants={containerVariants}
              className="grid gap-4 sm:grid-cols-2"
            >
              <MotionDiv variants={fieldVariants}>
                <Input
                  label="Language"
                  value={formData.language}
                  onChange={(e) => handleChange("language", e.target.value)}
                  placeholder="javascript, typescript, python, etc."
                  list="languages"
                />
                <datalist id="languages">
                  <option value="javascript" />
                  <option value="typescript" />
                  <option value="jsx" />
                  <option value="tsx" />
                  <option value="python" />
                  <option value="java" />
                  <option value="go" />
                  <option value="rust" />
                  <option value="html" />
                  <option value="css" />
                  <option value="json" />
                  <option value="bash" />
                </datalist>
              </MotionDiv>
            </MotionDiv>
            <MotionDiv variants={fieldVariants}>
              <label
                htmlFor="code"
                className="block text-sm font-medium text-semantic-text-secondary mb-2"
              >
                Code
              </label>
              <Textarea
                id="code"
                value={formData.code}
                onChange={(e) => handleChange("code", e.target.value)}
                placeholder="// Your code example here"
                rows={10}
                className="font-mono text-sm"
              />
            </MotionDiv>
          </CardContent>
        </MotionCard>

        {/* Important Points */}
        <MotionCard variants={cardVariants}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg text-semantic-text-primary">
              Important Interview Points
            </CardTitle>
            <MotionButton
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleArrayAdd("importantPoints")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Add Point
            </MotionButton>
          </CardHeader>
          <CardContent>
            <MotionDiv variants={containerVariants} className="space-y-3">
              {formData.importantPoints.map((point, index) => (
                <MotionDiv
                  key={index}
                  variants={fieldVariants}
                  className="flex gap-2"
                >
                  <Input
                    value={point}
                    onChange={(e) =>
                      handleArrayChange(
                        "importantPoints",
                        index,
                        e.target.value,
                      )
                    }
                    placeholder={`Point ${index + 1}`}
                    className="flex-1"
                  />
                  {formData.importantPoints.length > 1 && (
                    <MotionButton
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleArrayRemove("importantPoints", index)
                      }
                      className="text-semantic-status-danger-text hover:text-semantic-status-danger-text-hover"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </MotionButton>
                  )}
                </MotionDiv>
              ))}
            </MotionDiv>
            <p className="mt-3 text-sm text-semantic-text-tertiary">
              Key points candidates should mention during the interview
            </p>
          </CardContent>
        </MotionCard>

        {/* Follow-up Questions */}
        <MotionCard variants={cardVariants}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg text-semantic-text-primary">
              Follow-up Questions
            </CardTitle>
            <MotionButton
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleArrayAdd("followUpQuestions")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Add Question
            </MotionButton>
          </CardHeader>
          <CardContent>
            <MotionDiv variants={containerVariants} className="space-y-3">
              {formData.followUpQuestions.map((question, index) => (
                <MotionDiv
                  key={index}
                  variants={fieldVariants}
                  className="flex gap-2"
                >
                  <Input
                    value={question}
                    onChange={(e) =>
                      handleArrayChange(
                        "followUpQuestions",
                        index,
                        e.target.value,
                      )
                    }
                    placeholder={`Follow-up question ${index + 1}`}
                    className="flex-1"
                  />
                  {formData.followUpQuestions.length > 1 && (
                    <MotionButton
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleArrayRemove("followUpQuestions", index)
                      }
                      className="text-semantic-status-danger-text hover:text-semantic-status-danger-text-hover"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </MotionButton>
                  )}
                </MotionDiv>
              ))}
            </MotionDiv>
            <p className="mt-3 text-sm text-semantic-text-tertiary">
              Additional questions interviewers might ask after the main
              question
            </p>
          </CardContent>
        </MotionCard>

        {/* Tags */}
        <MotionCard variants={cardVariants}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg text-semantic-text-primary">
              Tags
            </CardTitle>
            <MotionButton
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleArrayAdd("tags")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Add Tag
            </MotionButton>
          </CardHeader>
          <CardContent>
            <MotionDiv
              variants={containerVariants}
              className="flex flex-wrap gap-2"
            >
              {formData.tags.map((tag, index) => (
                <MotionDiv
                  key={index}
                  variants={fieldVariants}
                  className="flex gap-2"
                >
                  <Input
                    value={tag}
                    onChange={(e) =>
                      handleArrayChange("tags", index, e.target.value)
                    }
                    placeholder={`Tag ${index + 1}`}
                    className="w-48"
                  />
                  {formData.tags.length > 1 && (
                    <MotionButton
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleArrayRemove("tags", index)}
                      className="text-semantic-status-danger-text hover:text-semantic-status-danger-text-hover"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </MotionButton>
                  )}
                </MotionDiv>
              ))}
            </MotionDiv>
            <p className="mt-3 text-sm text-semantic-text-tertiary">
              Keywords for filtering and search (e.g., hooks, async,
              performance, css-grid)
            </p>
          </CardContent>
        </MotionCard>

        {/* Actions */}
        <MotionDiv
          variants={containerVariants}
          className="flex flex-col sm:flex-row gap-4 justify-end mt-6"
        >
          <MotionButton
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/questions")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Cancel
          </MotionButton>
          <MotionButton
            type="button"
            variant="secondary"
            isLoading={saving}
            onClick={() => handleSubmit("save")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Save as Draft
          </MotionButton>
          <MotionButton
            type="submit"
            isLoading={saving}
            onClick={() => handleSubmit("publish")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Publish
          </MotionButton>
        </MotionDiv>
      </form>
    </MotionDiv>
  );
}
