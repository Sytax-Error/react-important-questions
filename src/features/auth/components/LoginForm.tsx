import { useState, FormEvent, ChangeEvent } from "react";
import { motion } from "framer-motion";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { LoginCredentials, AuthError } from "../../../types/auth";

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

const fieldVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

const errorVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

interface LoginFormProps {
  onSubmit: (credentials: LoginCredentials) => Promise<void>;
  loading?: boolean;
  error?: AuthError | null;
  disabled?: boolean;
}

export function LoginForm({
  onSubmit,
  loading = false,
  error = null,
  disabled = false,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading || disabled) return;

    setSubmitted(true);

    if (!email.trim() || !password) {
      return;
    }

    try {
      await onSubmit({ email: email.trim(), password });
    } catch {
      // Error is handled by parent component
    }
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (submitted && error) {
      // Clear error on new input
    }
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <MotionDiv
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-4"
    >
      <form onSubmit={handleSubmit} noValidate>
        {error && (
          <MotionDiv
            variants={errorVariants}
            className="p-3 text-sm text-semantic-status-danger-text bg-semantic-status-danger-bg border border-semantic-status-danger-border rounded-lg"
            role="alert"
          >
            {error.message}
          </MotionDiv>
        )}

        <MotionDiv variants={fieldVariants}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="admin@example.com"
            required
            autoComplete="email"
            disabled={loading || disabled}
            error={submitted && !email.trim() ? "Email is required" : undefined}
          />
        </MotionDiv>

        <MotionDiv variants={fieldVariants}>
          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              disabled={loading || disabled}
              error={
                submitted && !password ? "Password is required" : undefined
              }
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] text-semantic-text-tertiary hover:text-semantic-text-primary dark:hover:text-semantic-text-secondary"
              aria-label={showPassword ? "Hide password" : "Show password"}
              disabled={loading || disabled}
            >
              {showPassword ? (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
        </MotionDiv>

        <MotionDiv variants={fieldVariants}>
          <MotionButton
            type="submit"
            className="w-full"
            isLoading={loading}
            disabled={disabled}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            Sign In
          </MotionButton>
        </MotionDiv>
      </form>
    </MotionDiv>
  );
}
