import { useEffect, useState, ReactNode } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/services/firebase/config";
import { isUserAdmin } from "@/features/questions/services/questionService";
import { AuthUser, LoginCredentials, mapFirebaseUser } from "@/types/auth";
import { AuthContext } from "./AuthContextType";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: User | null) => {
        if (firebaseUser) {
          try {
            const adminStatus = await isUserAdmin(firebaseUser.uid);
            setUser(mapFirebaseUser(firebaseUser, adminStatus));
          } catch (err) {
            console.error("Error checking admin status:", err);
            setUser(mapFirebaseUser(firebaseUser, false));
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setError(null);
    try {
      const { signInWithEmailAndPassword } = await import("firebase/auth");
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password,
      );
      const adminStatus = await isUserAdmin(userCredential.user.uid);
      setUser(mapFirebaseUser(userCredential.user, adminStatus));
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const logout = async () => {
    setError(null);
    try {
      const { signOut } = await import("firebase/auth");
      await signOut(auth);
      setUser(null);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const refreshAdminStatus = async () => {
    if (user) {
      try {
        const adminStatus = await isUserAdmin(user.uid);
        setUser((prev: AuthUser | null) =>
          prev ? { ...prev, isAdmin: adminStatus } : null,
        );
      } catch (err) {
        console.error("Error refreshing admin status:", err);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, logout, refreshAdminStatus }}
    >
      {children}
    </AuthContext.Provider>
  );
}
