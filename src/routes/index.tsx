import { createBrowserRouter } from 'react-router-dom';
import Layout from '../layout/Layout';
import LoginPage from '../pages/login';
import ContactPage from '../pages/contact';
import BookPage from '../pages/book';
import Register from '../pages/register';
import Error404 from '../pages/error/Error404';
import AdminPage from '../pages/admin';
import ProtectedRoute from '../components/ProtectedRoute/index.';
import LayoutAdmin from '../layout/LayoutAdmin';
import ManageUserPage from '../pages/admin/user';
import ManageBookPage from '../pages/admin/book';
import Home from '../pages/home';

const isAuthenticated = localStorage.getItem('access_token');
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <Error404 />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'book/:slug',
        element: <BookPage />,
      },
      {
        path: 'contact',
        element: <ContactPage />,
      },
    ],
  },
  {
    path: '/admin',
    element: <LayoutAdmin />,
    errorElement: <Error404 />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'user',
        element: (
          <ProtectedRoute>
            <ManageUserPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'book',
        element: (
          <ProtectedRoute>
            <ManageBookPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'order',
        element: (
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/login', // Change to absolute path
    element: <LoginPage />,
  },
  {
    path: 'register', // Change to absolute path
    element: <Register />,
  },
]);

export default router;
