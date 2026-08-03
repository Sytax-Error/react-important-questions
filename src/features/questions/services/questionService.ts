import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  Timestamp,
  QueryDocumentSnapshot,
  DocumentData,
  QueryConstraint,
  onSnapshot,
  Unsubscribe,
} from "firebase/firestore";
import { db } from "@/services/firebase/config";
import {
  InterviewQuestion,
  Difficulty,
  PublicationStatus,
  QuestionFilters,
} from "@/types/questions";

export const QUESTIONS_COLLECTION = "questions";
export const ADMINS_COLLECTION = "admins";

/**
 * Converter for InterviewQuestion to/from Firestore
 * Handles conversion between Firestore DocumentData and InterviewQuestion interface
 */
const questionConverter = {
  toFirestore: (question: InterviewQuestion): DocumentData => {
    return {
      question: question.question,
      slug: question.slug,
      topic: question.topic,
      category: question.category,
      shortAnswer: question.shortAnswer,
      detailedAnswer: question.detailedAnswer,
      code: question.code ?? "",
      language: question.language ?? "",
      importantPoints: question.importantPoints,
      followUpQuestions: question.followUpQuestions,
      tags: question.tags,
      difficulty: question.difficulty,
      isPublished: question.isPublished,
      status: question.status,
      createdAt:
        question.createdAt instanceof Timestamp
          ? question.createdAt
          : question.createdAt instanceof Date
            ? Timestamp.fromDate(question.createdAt)
            : question.createdAt,
      updatedAt:
        question.updatedAt instanceof Timestamp
          ? question.updatedAt
          : question.updatedAt instanceof Date
            ? Timestamp.fromDate(question.updatedAt)
            : question.updatedAt,
      createdBy: question.createdBy,
      updatedBy: question.updatedBy,
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot): InterviewQuestion => {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      question: data.question,
      slug: data.slug,
      topic: data.topic,
      category: data.category,
      shortAnswer: data.shortAnswer,
      detailedAnswer: data.detailedAnswer,
      code: data.code ?? "",
      language: data.language ?? "",
      importantPoints: data.importantPoints ?? [],
      followUpQuestions: data.followUpQuestions ?? [],
      tags: data.tags ?? [],
      difficulty: data.difficulty as Difficulty,
      isPublished: data.isPublished,
      status: data.status as PublicationStatus,
      createdAt: data.createdAt?.toDate() ?? new Date(),
      updatedAt: data.updatedAt?.toDate() ?? new Date(),
      createdBy: data.createdBy,
      updatedBy: data.updatedBy,
    };
  },
};

/**
 * Get all questions with optional filters and pagination
 */
export const subscribeToAllQuestions = (
  onNext: (questions: InterviewQuestion[]) => void,
  onError: (error: Error) => void,
  filters?: QuestionFilters,
): Unsubscribe => {
  const constraints: QueryConstraint[] = [orderBy("createdAt", "desc")];

  if (filters?.topic) {
    constraints.push(where("topic", "==", filters.topic));
  }
  if (filters?.difficulty) {
    constraints.push(where("difficulty", "==", filters.difficulty));
  }
  if (filters?.tags && filters.tags.length > 0) {
    constraints.push(where("tags", "array-contains-any", filters.tags));
  }

  const q = query(
    collection(db, QUESTIONS_COLLECTION).withConverter(questionConverter),
    ...constraints,
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const questions = snapshot.docs.map((doc) => doc.data());
      onNext(questions);
    },
    onError,
  );
};

/**
 * Get published questions with optional filters and pagination
 */
export const subscribeToPublishedQuestions = (
  onNext: (questions: InterviewQuestion[]) => void,
  onError: (error: Error) => void,
  filters?: QuestionFilters,
  pageSize = 10,
): Unsubscribe => {
  // TEMPORARY: Use only isPublished for query (existing indexes) and filter by status in memory
  // Once indexes with status field are built, revert to using both fields in the query
  const constraints: QueryConstraint[] = [
    where("isPublished", "==", true),
    orderBy("publishedAt", "desc"),
    limit(pageSize * 2), // Fetch extra to account for in-memory filtering
  ];

  if (filters?.topic) {
    constraints.push(where("topic", "==", filters.topic));
  }
  if (filters?.difficulty) {
    constraints.push(where("difficulty", "==", filters.difficulty));
  }
  if (filters?.tags && filters.tags.length > 0) {
    constraints.push(where("tags", "array-contains-any", filters.tags));
  }

  const q = query(
    collection(db, QUESTIONS_COLLECTION).withConverter(questionConverter),
    ...constraints,
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const questions = snapshot.docs.map((doc) => doc.data());
      // Filter by status in memory (temporary workaround while indexes build)
      const publishedQuestions = questions.filter(
        (q) => q.status === "published",
      );
      // Apply limit after filtering
      onNext(publishedQuestions.slice(0, pageSize));
    },
    onError,
  );
};

/**
 * Get paginated questions
 */
export const getPaginatedQuestions = async (
  lastVisible: DocumentData | null = null,
  pageSize = 10,
  filters?: QuestionFilters,
): Promise<{
  questions: InterviewQuestion[];
  lastVisible: DocumentData | null;
}> => {
  const constraints: QueryConstraint[] = [orderBy("createdAt", "desc")];

  if (filters?.topic) {
    constraints.push(where("topic", "==", filters.topic));
  }
  if (filters?.difficulty) {
    constraints.push(where("difficulty", "==", filters.difficulty));
  }
  if (filters?.tags && filters.tags.length > 0) {
    constraints.push(where("tags", "array-contains-any", filters.tags));
  }

  if (lastVisible) {
    constraints.push(startAfter(lastVisible));
  }
  constraints.push(limit(pageSize));

  const q = query(
    collection(db, QUESTIONS_COLLECTION).withConverter(questionConverter),
    ...constraints,
  );
  const snapshot = await getDocs(q);
  const questions = snapshot.docs.map((doc) => doc.data());
  const lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1] || null;

  return {
    questions,
    lastVisible: lastVisibleDoc ? lastVisibleDoc : null,
  };
};

/**
 * Get a question by document ID
 */
export const getQuestionById = async (
  id: string,
): Promise<InterviewQuestion | null> => {
  const docRef = doc(db, QUESTIONS_COLLECTION, id).withConverter(
    questionConverter,
  );
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};

/**
 * Get a published question by slug
 */
export const getQuestionBySlug = async (
  slug: string,
): Promise<InterviewQuestion | null> => {
  // TEMPORARY: Use only isPublished for query (existing indexes) and filter by status in memory
  const q = query(
    collection(db, QUESTIONS_COLLECTION).withConverter(questionConverter),
    where("slug", "==", slug),
    where("isPublished", "==", true),
    limit(1),
  );
  const querySnap = await getDocs(q);
  if (querySnap.empty) return null;
  const question = querySnap.docs[0].data();
  // Filter by status in memory (temporary workaround while indexes build)
  return question.status === "published" ? question : null;
};

/**
 * Create a new question
 */
export const createQuestion = async (
  question: Omit<InterviewQuestion, "id" | "createdAt" | "updatedAt">,
): Promise<string> => {
  const questionWithTimestamps = {
    ...question,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    // Set publishedAt if the question is being published
    publishedAt:
      question.isPublished && question.status === "published"
        ? serverTimestamp()
        : null,
  };
  const docRef = await addDoc(
    collection(db, QUESTIONS_COLLECTION),
    questionWithTimestamps as DocumentData,
  );
  return docRef.id;
};

/**
 * Update an existing question
 */
export const updateQuestion = async (
  id: string,
  data: Partial<Omit<InterviewQuestion, "id" | "createdAt" | "updatedAt">>,
): Promise<void> => {
  const docRef = doc(db, QUESTIONS_COLLECTION, id);
  const updateData: Record<string, unknown> = {
    ...data,
    updatedAt: serverTimestamp(),
  };

  // Set publishedAt if the question is being published
  if (data.isPublished === true && data.status === "published") {
    updateData.publishedAt = serverTimestamp();
  }

  await updateDoc(docRef, updateData as DocumentData);
};

/**
 * Delete a question
 */
export const deleteQuestion = async (id: string): Promise<void> => {
  const docRef = doc(db, QUESTIONS_COLLECTION, id);
  await deleteDoc(docRef);
};

/**
 * Check if a slug already exists (excluding current document if editing)
 */
export const checkSlugExists = async (
  slug: string,
  excludeId?: string,
): Promise<boolean> => {
  const q = query(
    collection(db, QUESTIONS_COLLECTION).withConverter(questionConverter),
    where("slug", "==", slug),
    limit(1),
  );
  const querySnap = await getDocs(q);
  if (querySnap.empty) return false;
  if (excludeId && querySnap.docs[0].id === excludeId) return false;
  return true;
};

/**
 * Publish a question
 */
export const publishQuestion = async (
  id: string,
  userId: string,
): Promise<void> => {
  const docRef = doc(db, QUESTIONS_COLLECTION, id);
  await updateDoc(docRef, {
    isPublished: true,
    status: "published",
    publishedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    updatedBy: userId,
  });
};

/**
 * Unpublish a question (set as draft)
 */
export const unpublishQuestion = async (
  id: string,
  userId: string,
): Promise<void> => {
  const docRef = doc(db, QUESTIONS_COLLECTION, id);
  await updateDoc(docRef, {
    isPublished: false,
    status: "draft",
    updatedAt: serverTimestamp(),
    updatedBy: userId,
  });
};

/**
 * Get paginated questions for admin view
 */
export const getPaginatedQuestionsAdmin = async (
  pageSize = 20,
  lastDoc?: QueryDocumentSnapshot<DocumentData>,
): Promise<{
  questions: InterviewQuestion[];
  lastDoc?: QueryDocumentSnapshot<DocumentData>;
  hasMore: boolean;
}> => {
  const constraints: QueryConstraint[] = [
    orderBy("createdAt", "desc"),
    limit(pageSize + 1),
  ];

  if (lastDoc) {
    constraints.push(startAfter(lastDoc));
  }

  const q = query(
    collection(db, QUESTIONS_COLLECTION).withConverter(questionConverter),
    ...constraints,
  );
  const querySnap = await getDocs(q);
  const questions = querySnap.docs.map((doc) => doc.data());
  const hasMore = questions.length > pageSize;
  const results = hasMore ? questions.slice(0, pageSize) : questions;
  const newLastDoc = querySnap.docs[pageSize - 1];

  return { questions: results, lastDoc: newLastDoc, hasMore };
};

/**
 * Get paginated published questions for public view
 */
export const getPaginatedPublishedQuestions = async (
  filters: QuestionFilters = {},
  pageSize = 10,
  lastDoc?: QueryDocumentSnapshot<DocumentData>,
): Promise<{
  questions: InterviewQuestion[];
  lastDoc?: QueryDocumentSnapshot<DocumentData>;
  hasMore: boolean;
}> => {
  const constraints: QueryConstraint[] = [
    where("isPublished", "==", true),
    where("status", "==", "published"),
    orderBy("publishedAt", "desc"),
    limit(pageSize + 1),
  ];

  if (filters.topic) {
    constraints.push(where("topic", "==", filters.topic));
  }
  if (filters.difficulty) {
    constraints.push(where("difficulty", "==", filters.difficulty));
  }
  // Tags filtering done in memory (array-contains-any cannot be combined with other filters)
  if (lastDoc) {
    constraints.push(startAfter(lastDoc));
  }

  const q = query(
    collection(db, QUESTIONS_COLLECTION).withConverter(questionConverter),
    ...constraints,
  );
  const querySnap = await getDocs(q);
  let questions = querySnap.docs.map((doc) => doc.data());

  // Filter by tags in memory (cannot combine array-contains-any with other where clauses)
  if (filters.tags && filters.tags.length > 0) {
    questions = questions.filter((q) =>
      filters.tags!.some((tag) => q.tags.includes(tag)),
    );
  }

  const hasMore = questions.length > pageSize;
  const results = hasMore ? questions.slice(0, pageSize) : questions;
  const newLastDoc = querySnap.docs[pageSize - 1];

  return { questions: results, lastDoc: newLastDoc, hasMore };
};

/**
 * Get question statistics for dashboard
 */
export const getQuestionStats = async (): Promise<{
  totalQuestions: number;
  publishedQuestions: number;
  draftQuestions: number;
  questionsByDifficulty: Record<Difficulty, number>;
  questionsByTopic: Record<string, number>;
  recentlyUpdated: InterviewQuestion[];
}> => {
  const allQuestionsSnap = await getDocs(
    collection(db, QUESTIONS_COLLECTION).withConverter(questionConverter),
  );
  const questions = allQuestionsSnap.docs.map((doc) => doc.data());

  const totalQuestions = questions.length;
  const publishedQuestions = questions.filter((q) => q.isPublished).length;
  const draftQuestions = totalQuestions - publishedQuestions;

  const questionsByDifficulty: Record<Difficulty, number> = {
    Beginner: 0,
    Intermediate: 0,
    Advanced: 0,
  };
  questions.forEach((q) => {
    questionsByDifficulty[q.difficulty] =
      (questionsByDifficulty[q.difficulty] || 0) + 1;
  });

  const questionsByTopic: Record<string, number> = {};
  questions.forEach((q) => {
    questionsByTopic[q.topic] = (questionsByTopic[q.topic] || 0) + 1;
  });

  // Get recently updated questions (last 5)
  const sortedQuestions = [...questions].sort(
    (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime(),
  );
  const recentlyUpdated = sortedQuestions.slice(0, 5);

  return {
    totalQuestions,
    publishedQuestions,
    draftQuestions,
    questionsByDifficulty,
    questionsByTopic,
    recentlyUpdated,
  };
};

/**
 * Check if a user is an admin
 */
export const isUserAdmin = async (uid: string): Promise<boolean> => {
  const adminDoc = await getDoc(doc(db, ADMINS_COLLECTION, uid));
  return adminDoc.exists() && adminDoc.data().role === "admin";
};

/**
 * Get recently added published questions (for home page)
 * TEMPORARY: Use publishedAt for query (existing indexes) and filter by status in memory
 * Once indexes with status field are built, revert to using both fields in the query
 */
export const getRecentlyAddedQuestions = async (
  limitCount = 5,
): Promise<InterviewQuestion[]> => {
  const constraints: QueryConstraint[] = [
    where("isPublished", "==", true),
    orderBy("publishedAt", "desc"),
    limit(limitCount * 2), // Fetch extra to account for in-memory filtering
  ];

  const q = query(
    collection(db, QUESTIONS_COLLECTION).withConverter(questionConverter),
    ...constraints,
  );
  const querySnap = await getDocs(q);
  const questions = querySnap.docs.map((doc) => doc.data());
  // Filter by status in memory (temporary workaround while indexes build)
  const publishedQuestions = questions.filter((q) => q.status === "published");
  return publishedQuestions.slice(0, limitCount);
};

/**
 * Get featured questions (for home page)
 * TEMPORARY: Use publishedAt for query (existing indexes) and filter by status in memory
 * Once indexes with status field are built, revert to using both fields in the query
 */
export const getFeaturedQuestions = async (
  limitCount = 3,
): Promise<InterviewQuestion[]> => {
  const constraints: QueryConstraint[] = [
    where("isPublished", "==", true),
    orderBy("publishedAt", "desc"),
    limit(limitCount * 2), // Fetch extra to account for in-memory filtering
  ];

  const q = query(
    collection(db, QUESTIONS_COLLECTION).withConverter(questionConverter),
    ...constraints,
  );
  const querySnap = await getDocs(q);
  const questions = querySnap.docs.map((doc) => doc.data());
  // Filter by status in memory (temporary workaround while indexes build)
  const publishedQuestions = questions.filter((q) => q.status === "published");
  return publishedQuestions.slice(0, limitCount);
};

/**
 * Get admin document
 */
export const getAdminDocument = async (
  uid: string,
): Promise<{
  email: string;
  role: string;
  createdAt: Date;
} | null> => {
  try {
    const adminDoc = await getDoc(doc(db, ADMINS_COLLECTION, uid));
    if (!adminDoc.exists()) return null;
    const data = adminDoc.data();
    return {
      email: data.email,
      role: data.role,
      createdAt: data.createdAt?.toDate() || new Date(),
    };
  } catch (error) {
    console.error("Error fetching admin document:", error);
    return null;
  }
};

/**
 * Create admin document data
 */
export const createAdminDocumentData = (
  email: string,
): {
  email: string;
  role: string;
} => {
  return {
    email,
    role: "admin",
  };
};

export { db, serverTimestamp, Timestamp };
