import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import {
  createQuestion,
  checkSlugExists,
} from "../../services/firebase/firestore";
import {
  QuestionFormData,
  InterviewQuestion,
  TOPICS,
  DIFFICULTIES,
} from "../../types/questions";
import { useAuth } from "../../features/auth/AuthProvider";
import { generateSlug, validateSlug } from "../../utils/slug";
import { validateQuestionForm } from "../../utils/validation";

export function AdminQuestionFormPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const handleChange = (
    field: keyof QuestionFormData,
    value: string | string[] | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
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
  };

  const handleArrayAdd = (
    field: "importantPoints" | "followUpQuestions" | "tags",
  ) => {
    const newArray = [...formData[field], ""];
    handleChange(field, newArray);
  };

  const handleArrayRemove = (
    field: "importantPoints" | "followUpQuestions" | "tags",
    index: number,
  ) => {
    if (formData[field].length <= 1) return;
    const newArray = formData[field].filter((_, i) => i !== index);
    handleChange(field, newArray);
  };

  const handleSlugChange = (value: string) => {
    const slug = generateSlug(value);
    handleChange("slug", slug);
    if (slug && !validateSlug(slug)) {
      setSlugError(
        "Slug can only contain lowercase letters, numbers, and hyphens",
      );
    } else {
      setSlugError(null);
    }
  };

  const validateForm = () => {
    const validationErrors = validateQuestionForm(formData);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (action: "save" | "publish") => {
    if (!validateForm()) return;
    if (!user) {
      setError("You must be logged in to save questions");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const slugExists = await checkSlugExists(formData.slug);
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

      const id = await createQuestion(questionData);
      navigate(`/admin/questions/${id}/edit`);
    } catch (err) {
      setError("Failed to save question. Please try again.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Create New Question
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Add a new interview question to the database
          </p>
        </div>
      </div>

      {error && (
        <div
          className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400"
          role="alert"
        >
          {error}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit("save");
        }}
      >
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Topic *"
                value={formData.topic}
                onChange={(e) => handleChange("topic", e.target.value)}
                error={errors.topic}
                list="topics"
              />
              <datalist id="topics">
                {TOPICS.map((topic) => (
                  <option key={topic} value={topic} />
                ))}
              </datalist>

              <Input
                label="Category *"
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
                error={errors.category}
                placeholder="e.g., React Hooks, CSS Layout, etc."
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Difficulty *"
                value={formData.difficulty}
                onChange={(e) =>
                  handleChange(
                    "difficulty",
                    e.target.value as "Beginner" | "Intermediate" | "Advanced",
                  )
                }
                error={errors.difficulty}
                list="difficulties"
              />
              <datalist id="difficulties">
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d} />
                ))}
              </datalist>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) =>
                      handleChange("isPublished", e.target.checked)
                    }
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Publish immediately
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label
                htmlFor="question"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
            </div>

            <div>
              <label
                htmlFor="slug"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
            </div>
          </CardContent>
        </Card>

        {/* Answers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Answers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label
                htmlFor="shortAnswer"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
            </div>

            <div>
              <label
                htmlFor="detailedAnswer"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
            </div>
          </CardContent>
        </Card>

        {/* Code Example */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Code Example (Optional)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
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
            </div>
            <div>
              <label
                htmlFor="code"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
            </div>
          </CardContent>
        </Card>

        {/* Important Points */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">
              Important Interview Points
            </CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleArrayAdd("importantPoints")}
            >
              Add Point
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {formData.importantPoints.map((point, index) => (
                <div key={index} className="flex gap-2">
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
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleArrayRemove("importantPoints", index)
                      }
                      className="text-red-600 hover:text-red-700"
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
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              Key points candidates should mention during the interview
            </p>
          </CardContent>
        </Card>

        {/* Follow-up Questions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Follow-up Questions</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleArrayAdd("followUpQuestions")}
            >
              Add Question
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {formData.followUpQuestions.map((question, index) => (
                <div key={index} className="flex gap-2">
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
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleArrayRemove("followUpQuestions", index)
                      }
                      className="text-red-600 hover:text-red-700"
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
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              Additional questions interviewers might ask after the main
              question
            </p>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Tags</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleArrayAdd("tags")}
            >
              Add Tag
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={tag}
                    onChange={(e) =>
                      handleArrayChange("tags", index, e.target.value)
                    }
                    placeholder={`Tag ${index + 1}`}
                    className="w-48"
                  />
                  {formData.tags.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleArrayRemove("tags", index)}
                      className="text-red-600 hover:text-red-700"
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
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              Keywords for filtering and search (e.g., hooks, async,
              performance, css-grid)
            </p>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/questions")}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="secondary"
            isLoading={saving}
            onClick={() => handleSubmit("save")}
          >
            Save as Draft
          </Button>
          <Button
            type="submit"
            isLoading={saving}
            onClick={() => handleSubmit("publish")}
          >
            Publish
          </Button>
        </div>
      </form>
    </div>
  );
}
