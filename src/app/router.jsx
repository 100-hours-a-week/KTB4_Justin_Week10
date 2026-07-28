import { createBrowserRouter, Navigate } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout.jsx'
import RequireAuth from '../layouts/RequireAuth.jsx'
import CreatePostPage from '../pages/CreatePostPage.jsx'
import EditPasswordPage from '../pages/EditPasswordPage.jsx'
import EditPostPage from '../pages/EditPostPage.jsx'
import EditProfilePage from '../pages/EditProfilePage.jsx'
import LoginPage from '../pages/LoginPage.jsx'
import NotFoundPage from '../pages/NotFoundPage.jsx'
import PostDetailPage from '../pages/PostDetailPage.jsx'
import PostsPage from '../pages/PostsPage.jsx'
import SignupPage from '../pages/SignupPage.jsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/posts" replace />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'signup',
        element: <SignupPage />,
      },
      {
        path: 'posts',
        element: <PostsPage />,
      },
      {
        path: 'posts/:postId',
        element: <PostDetailPage />,
      },
      {
        element: <RequireAuth />,
        children: [
          {
            path: 'posts/new',
            element: <CreatePostPage />,
          },
          {
            path: 'posts/:postId/edit',
            element: <EditPostPage />,
          },
          {
            path: 'profile/edit',
            element: <EditProfilePage />,
          },
          {
            path: 'password/edit',
            element: <EditPasswordPage />,
          },
        ],
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])
