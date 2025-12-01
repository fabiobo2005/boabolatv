import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layout';
import { LoginPage } from '../features/auth';
import { VideoLibraryPage } from '../features/video-library';
import { AdminPage } from '../features/admin';
import ProtectedRoute from './ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/videos" replace />,
      },
      {
        path: 'videos',
        element: <VideoLibraryPage />,
      },
      {
        path: 'admin',
        element: (
          <ProtectedRoute requiredRoles={['ADMIN']}>
            <AdminPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
