import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from './layouts/PublicLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { AdminProtectedRoute } from './routes/AdminProtectedRoute';
import { HomePage } from './pages/public/HomePage';
import { QuestionsPage } from './pages/public/QuestionsPage';
import { QuestionDetailPage } from './pages/public/QuestionDetailPage';
import { TopicPage } from './pages/public/TopicPage';
import { BookmarksPage } from './pages/public/BookmarksPage';
import { NotFoundPage } from './pages/public/NotFoundPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminQuestionsPage } from './pages/admin/AdminQuestionsPage';
import { AdminQuestionFormPage } from './pages/admin/AdminQuestionFormPage';
import { AdminQuestionEditPage } from './pages/admin/AdminQuestionEditPage';
import { ErrorBoundary } from './components/ui/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/questions" element={<QuestionsPage />} />
          <Route path="/questions/:slug" element={<QuestionDetailPage />} />
          <Route path="/topics/:topic" element={<TopicPage />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
        </Route>

        {/* Admin Login (Public) */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Protected Admin Routes */}
        <Route element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/questions" element={<AdminQuestionsPage />} />
          <Route path="/admin/questions/new" element={<AdminQuestionFormPage />} />
          <Route path="/admin/questions/:id/edit" element={<AdminQuestionEditPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;