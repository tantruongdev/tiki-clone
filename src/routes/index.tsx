import { createBrowserRouter } from "react-router-dom";
import Layout from "../layout/Layout";
import LoginPage from "../pages/login";
import ContactPage from "../pages/contact";
import BookPage from "../pages/book";
import Home from "../layout/Home";
import Register from "../pages/register";
import Error404 from "../pages/error/Error404";
import Error403 from "../pages/error/Error403";
import AdminPage from "../pages/admin";
import { useSelector } from "react-redux";
import ProtectedRoute from "../components/ProtectedRoute/index.";
import LayoutAdmin from "../layout/LayoutAdmin";

const isAuthenticated = localStorage.getItem('access_token')
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <Error404 />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "books",
        element: <BookPage />,
      },
      {
        path: "contact",
        element: <ContactPage />,
      },
    ],
  },
  {
    path: "/admin",
    element: <LayoutAdmin />,
    errorElement: <Error404 />,
    children: [
      {
        index: true,
        element: <ProtectedRoute>
          <AdminPage />
        </ProtectedRoute>
      },

    ],
  },
  {
    path: "/login", // Change to absolute path
    element: <LoginPage />,
  },
  {
    path: "register", // Change to absolute path
    element: <Register />,
  },
]);

export default router;
