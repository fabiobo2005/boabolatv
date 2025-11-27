import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layout';
import { LoginPage } from '../features/auth';
import { VideoLibraryPage, LivePage } from '../features/video-library';
import { StatsPage } from '../features/stats';
import { SubscribersPage } from '../features/subscribers';
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
        path: 'live',
        element: <LivePage />,
      },
      {
        path: 'stats',
        element: (
          <ProtectedRoute requiredRoles={['PRESENTER', 'ADMIN']}>
            <StatsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'subscriber',
        element: (
          <ProtectedRoute requiredRoles={['SUBSCRIBER', 'ADMIN']}>
            <SubscribersPage />
          </ProtectedRoute>
        ),
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
