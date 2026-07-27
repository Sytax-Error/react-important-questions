import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { useAuth } from "@/features/auth";
import { LoginForm } from "@/features/auth/components/LoginForm";

export function AdminLoginPage() {
  const { login, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from =
    (location.state as { from?: Location })?.from?.pathname ||
    "/admin/dashboard";

  const handleLogin = async (credentials: {
    email: string;
    password: string;
  }) => {
    try {
      await login(credentials);
      navigate(from, { replace: true });
    } catch (err) {
      // Error is handled by LoginForm
    }
  };

  // Redirect authenticated admins away from login page
  if (user?.isAdmin && !authLoading) {
    navigate(from, { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Sign in to access the admin panel
          </p>
        </CardHeader>
        <CardContent>
          <LoginForm onSubmit={handleLogin} disabled={authLoading} />

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              ← Back to Site
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
