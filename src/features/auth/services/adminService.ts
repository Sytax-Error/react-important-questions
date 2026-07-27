import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../services/firebase/config";
import { ADMINS_COLLECTION } from "../../../services/firebase/firestore";

export interface AdminDocument {
  email: string;
  role: string;
  createdAt: Date;
}

export async function isUserAdmin(uid: string): Promise<boolean> {
  try {
    const adminDoc = await getDoc(doc(db, ADMINS_COLLECTION, uid));
    return adminDoc.exists() && adminDoc.data().role === "admin";
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

export async function getAdminDocument(
  uid: string,
): Promise<AdminDocument | null> {
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
}

export function createAdminDocumentData(email: string): {
  email: string;
  role: string;
} {
  return {
    email,
    role: "admin",
  };
}
