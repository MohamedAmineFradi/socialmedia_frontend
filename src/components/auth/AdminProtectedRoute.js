import { useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { useRouter } from 'next/navigation';

export default function AdminProtectedRoute({ children }) {
  const { isAuthenticated, isSuperAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isSuperAdmin())) {
      router.push('/');
    }
  }, [isAuthenticated, isSuperAdmin, isLoading, router]);

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated || !isSuperAdmin()) return null;

  return children;
} 