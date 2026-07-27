import { Link } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';

export function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <Card className="text-center max-w-md w-full">
        <CardContent className="py-12">
          <h1 className="text-6xl font-bold text-primary-600 dark:text-primary-400">404</h1>
          <h2 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">Page Not Found</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
          </p>
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors"
            >
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}