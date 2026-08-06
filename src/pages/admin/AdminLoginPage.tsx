import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useAuth } from "@/features/auth";
import { LoginForm } from "@/features/auth/components/LoginForm";

const MotionCard = motion(Card);
const MotionDiv = motion.div;
const MotionLink = motion(Link);

// Framer Motion variants for consistent animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

const titleVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

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
    <MotionDiv
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen flex items-center justify-center bg-semantic-bg-secondary px-4 sm:px-6 lg:px-8 py-16"
    >
      <MotionCard
        variants={cardVariants}
        className="w-full max-w-md bg-semantic-bg-primary border-semantic-border-primary"
      >
        <CardHeader className="text-center">
          <MotionDiv variants={titleVariants}>
            <CardTitle className="text-2xl text-semantic-text-primary">
              Admin Login
            </CardTitle>
          </MotionDiv>
          <MotionDiv
            variants={cardVariants}
            className="mt-2 text-sm text-semantic-text-secondary"
          >
            Sign in to access the admin panel
          </MotionDiv>
        </CardHeader>
        <CardContent>
          <MotionDiv variants={cardVariants}>
            <LoginForm onSubmit={handleLogin} disabled={authLoading} />
          </MotionDiv>

          <MotionDiv variants={cardVariants} className="mt-6 text-center">
            <MotionLink
              to="/"
              className="text-sm text-semantic-interactive-primary hover:text-semantic-interactive-primary-hover"
              whileHover={{ x: -4 }}
            >
              ← Back to Site
            </MotionLink>
          </MotionDiv>
        </CardContent>
      </MotionCard>
    </MotionDiv>
  );
}
