import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import { Badge } from "../../components/ui/Badge";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import {
  getQuestionById,
  updateQuestion,
  checkSlugExists,
  deleteQuestion,
} from "../../services/firebase/firestore";
import {
  InterviewQuestion,
  QuestionFormData,
  TOPICS,
  DIFFICULTIES,
  CATEGORIES,
} from "../../types/questions";
import { useAuth } from "../../features/auth/AuthProvider";
import { generateSlug, validateSlug } from "../../utils/slug";
import { validateQuestionForm } from "../../utils/validation";

export function AdminQuestionEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [question, setQuestion] = useState<InterviewQuestion | null>(null);
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

  useEffect(() => {
    if (!id) {
      navigate("/admin/questions");
      return;
    }

    const fetchQuestion = async () => {
      try {
        setLoading(true);
        const data = await getQuestionById(id);
        if (!data) {
          setError("Question not found");
          return;
        }
        setQuestion(data);
        setFormData({
          question: data.question,
          slug: data.slug,
          topic: data.topic,
          category: data.category,
          difficulty: data.difficulty,
          shortAnswer: data.shortAnswer,
          detailedAnswer: data.detailedAnswer,
          code: data.code || "",
          language: data.language || "",
          importantPoints:
            data.importantPoints.length > 0 ? data.importantPoints : [""],
          followUpQuestions:
            data.followUpQuestions.length > 0 ? data.followUpQuestions : [""],
          tags: data.tags.length > 0 ? data.tags : [""],
          isPublished: data.isPublished,
          status: data.status,
        });
      } catch (err) {
        setError("Failed to load question");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [id, navigate]);

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

  const handleSubmit = async (action: "save" | "publish" | "unpublish") => {
    if (!validateForm()) return;
    if (!user || !question) return;

    setSaving(true);
    setError(null);

    try {
      if (formData.slug !== question.slug) {
        const slugExists = await checkSlugExists(formData.slug, question.id);
        if (slugExists) {
          setSlugError("A question with this slug already exists");
          setSaving(false);
          return;
        }
      }

      const updateData: Partial<InterviewQuestion> = {
        ...formData,
        importantPoints: formData.importantPoints.filter((p) => p.trim()),
        followUpQuestions: formData.followUpQuestions.filter((q) => q.trim()),
        tags: formData.tags.filter((t) => t.trim()),
        updatedBy: user.uid,
      };

      if (action === "publish") {
        updateData.isPublished = true;
        updateData.status = "published";
      } else if (action === "unpublish") {
        updateData.isPublished = false;
        updateData.status = "draft";
      }

      await updateQuestion(question.id, updateData);
      setQuestion((prev) => (prev ? { ...prev, ...updateData } : null));
    } catch (err) {
      setError(`Failed to ${action} question. Please try again.`);
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!question) return;
    if (
      !window.confirm(
        "Are you sure you want to delete this question? This action cannot be undone.",
      )
    )
      return;

    setDeleting(true);
    try {
      await deleteQuestion(question.id);
      navigate("/admin/questions");
    } catch (err) {
      setError("Failed to delete question");
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" label="Loading question..." />;
  }

  if (error && !question) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <div
          className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400"
          role="alert"
        >
          {error}
        </div>
        <Button
          variant="outline"
          onClick={() => navigate("/admin/questions")}
          className="mt-4"
        >
          Back to Questions
        </Button>
      </div>
    );
  }

  if (!question) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Edit Question
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Update the interview question details
          </p>
        </div>
        <div className="flex gap-2">
          <Badge
            variant={question.isPublished ? "success" : "outline"}
            size="md"
          >
            {question.isPublished ? "Published" : "Draft"}
          </Badge>
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
              <div>
                <label
                  htmlFor="topic"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Topic *
                </label>
                <select
                  id="topic"
                  value={formData.topic}
                  onChange={(e) => handleChange("topic", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-gray-100 bg-white"
                  required
                >
                  <option value="">Select a topic</option>
                  {TOPICS.map((topic) => (
                    <option key={topic} value={topic}>
                      {topic}
                    </option>
                  ))}
                </select>
                {errors.topic && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.topic}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Category *
                </label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-gray-100 bg-white"
                  required
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.category}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="difficulty"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Difficulty *
                </label>
                <select
                  id="difficulty"
                  value={formData.difficulty}
                  onChange={(e) =>
                    handleChange(
                      "difficulty",
                      e.target.value as "Beginner" | "Intermediate" | "Advanced",
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-gray-100 bg-white"
                  required
                >
                  <option value="">Select difficulty</option>
                  {DIFFICULTIES.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                {errors.difficulty && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.difficulty}
                  </p>
                )}
              </div>

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
                    Published
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
              {formData.followUpQuestions.map((q, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={q}
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
            Save Changes
          </Button>
          {question.isPublished ? (
            <Button
              type="button"
              variant="outline"
              isLoading={saving}
              onClick={() => handleSubmit("unpublish")}
              className="text-yellow-600 border-yellow-300 hover:bg-yellow-50 dark:border-yellow-700 dark:hover:bg-yellow-900/20"
            >
              Unpublish
            </Button>
          ) : (
            <Button
              type="button"
              isLoading={saving}
              onClick={() => handleSubmit("publish")}
            >
              Publish
            </Button>
          )}
          <Button
            type="button"
            variant="danger"
            isLoading={deleting}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </form>
    </div>
  );
}
