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
  FirestoreDataConverter,
  WithFieldValue,
} from "firebase/firestore";
import { db } from "./config";
import {
  InterviewQuestion,
  Difficulty,
  PublicationStatus,
} from "../../types/questions";

export const QUESTIONS_COLLECTION = "questions";
export const ADMINS_COLLECTION = "admins";

type QuestionInput = Omit<InterviewQuestion, "id" | "createdAt" | "updatedAt">;

const questionConverter: FirestoreDataConverter<InterviewQuestion> = {
  toFirestore(question: WithFieldValue<QuestionInput>): DocumentData {
    return {
      question: question.question,
      slug: question.slug,
      topic: question.topic,
      category: question.category,
      shortAnswer: question.shortAnswer,
      detailedAnswer: question.detailedAnswer,
      code: question.code || "",
      language: question.language || "",
      importantPoints: question.importantPoints,
      followUpQuestions: question.followUpQuestions,
      tags: question.tags,
      difficulty: question.difficulty,
      isPublished: question.isPublished,
      status: question.status,
      createdBy: question.createdBy,
      updatedBy: question.updatedBy,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot<DocumentData>,
  ): InterviewQuestion {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      question: data.question,
      slug: data.slug,
      topic: data.topic,
      category: data.category,
      shortAnswer: data.shortAnswer,
      detailedAnswer: data.detailedAnswer,
      code: data.code,
      language: data.language,
      importantPoints: data.importantPoints || [],
      followUpQuestions: data.followUpQuestions || [],
      tags: data.tags || [],
      difficulty: data.difficulty as Difficulty,
      isPublished: data.isPublished,
      status: data.status as PublicationStatus,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      createdBy: data.createdBy,
      updatedBy: data.updatedBy,
    };
  },
};

const adminConverter = {
  toFirestore(admin: { role: string; email: string }): DocumentData {
    return {
      role: admin.role,
      email: admin.email,
      createdAt: serverTimestamp(),
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData>): {
    role: string;
    email: string;
    createdAt: Date;
  } {
    const data = snapshot.data();
    return {
      role: data.role,
      email: data.email,
      createdAt: data.createdAt?.toDate() || new Date(),
    };
  },
};

export const questionsCollection = collection(
  db,
  QUESTIONS_COLLECTION,
).withConverter(questionConverter);
export const adminsCollection = collection(db, ADMINS_COLLECTION).withConverter(
  adminConverter,
);

export const createQuestion = async (
  question: Omit<InterviewQuestion, "id" | "createdAt" | "updatedAt">,
): Promise<string> => {
  const docRef = await addDoc(questionsCollection, question);
  return docRef.id;
};

export const updateQuestion = async (
  id: string,
  data: Partial<Omit<InterviewQuestion, "id" | "createdAt" | "updatedAt">>,
): Promise<void> => {
  const docRef = doc(db, QUESTIONS_COLLECTION, id).withConverter(
    questionConverter,
  );
  await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
};

export const deleteQuestion = async (id: string): Promise<void> => {
  const docRef = doc(db, QUESTIONS_COLLECTION, id);
  await deleteDoc(docRef);
};

export const getQuestionById = async (
  id: string,
): Promise<InterviewQuestion | null> => {
  const docRef = doc(db, QUESTIONS_COLLECTION, id).withConverter(
    questionConverter,
  );
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};

export const getQuestionBySlug = async (
  slug: string,
): Promise<InterviewQuestion | null> => {
  const q = query(questionsCollection, where("slug", "==", slug), limit(1));
  const querySnap = await getDocs(q);
  return querySnap.empty ? null : querySnap.docs[0].data();
};

export const getPublishedQuestions = async (
  filters: { topic?: string; difficulty?: Difficulty; tags?: string[] } = {},
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
    orderBy("createdAt", "desc"),
    limit(pageSize + 1),
  ];

  if (filters.topic) {
    constraints.unshift(where("topic", "==", filters.topic));
  }
  if (filters.difficulty) {
    constraints.unshift(where("difficulty", "==", filters.difficulty));
  }
  if (filters.tags && filters.tags.length > 0) {
    constraints.unshift(where("tags", "array-contains-any", filters.tags));
  }
  if (lastDoc) {
    constraints.push(startAfter(lastDoc));
  }

  const q = query(questionsCollection, ...constraints);
  const querySnap = await getDocs(q);
  const questions = querySnap.docs.map((doc) => doc.data());
  const hasMore = questions.length > pageSize;
  const results = hasMore ? questions.slice(0, pageSize) : questions;
  const newLastDoc = querySnap.docs[pageSize - 1];

  return { questions: results, lastDoc: newLastDoc, hasMore };
};

export const getAllQuestionsForAdmin = async (
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

  const q = query(questionsCollection, ...constraints);
  const querySnap = await getDocs(q);
  const questions = querySnap.docs.map((doc) => doc.data());
  const hasMore = questions.length > pageSize;
  const results = hasMore ? questions.slice(0, pageSize) : questions;
  const newLastDoc = querySnap.docs[pageSize - 1];

  return { questions: results, lastDoc: newLastDoc, hasMore };
};

export const checkSlugExists = async (
  slug: string,
  excludeId?: string,
): Promise<boolean> => {
  const q = query(questionsCollection, where("slug", "==", slug), limit(1));
  const querySnap = await getDocs(q);
  if (querySnap.empty) return false;
  if (excludeId && querySnap.docs[0].id === excludeId) return false;
  return true;
};

export const publishQuestion = async (
  id: string,
  userId: string,
): Promise<void> => {
  const docRef = doc(db, QUESTIONS_COLLECTION, id).withConverter(
    questionConverter,
  );
  await updateDoc(docRef, {
    isPublished: true,
    status: "published",
    updatedAt: serverTimestamp(),
    updatedBy: userId,
  });
};

export const unpublishQuestion = async (
  id: string,
  userId: string,
): Promise<void> => {
  const docRef = doc(db, QUESTIONS_COLLECTION, id).withConverter(
    questionConverter,
  );
  await updateDoc(docRef, {
    isPublished: false,
    status: "draft",
    updatedAt: serverTimestamp(),
    updatedBy: userId,
  });
};

export const getAdminStats = async (): Promise<{
  totalQuestions: number;
  publishedQuestions: number;
  draftQuestions: number;
  questionsByTopic: Record<string, number>;
}> => {
  const allQuestionsSnap = await getDocs(query(questionsCollection));
  const questions = allQuestionsSnap.docs.map((doc) => doc.data());

  const totalQuestions = questions.length;
  const publishedQuestions = questions.filter((q) => q.isPublished).length;
  const draftQuestions = totalQuestions - publishedQuestions;

  const questionsByTopic: Record<string, number> = {};
  questions.forEach((q) => {
    questionsByTopic[q.topic] = (questionsByTopic[q.topic] || 0) + 1;
  });

  return {
    totalQuestions,
    publishedQuestions,
    draftQuestions,
    questionsByTopic,
  };
};

export const isUserAdmin = async (uid: string): Promise<boolean> => {
  const adminDoc = await getDoc(doc(db, ADMINS_COLLECTION, uid));
  return adminDoc.exists() && adminDoc.data().role === "admin";
};

export { db, serverTimestamp, Timestamp };
