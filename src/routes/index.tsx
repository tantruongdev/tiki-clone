import { createBrowserRouter } from "react-router-dom";
import Layout from "../layout/Layout";
import LoginPage from "../pages/login";
import ContactPage from "../pages/contact";
import BookPage from "../pages/book";
import App from "../App";
import Home from "../layout/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <div>404 Not Found</div>,
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
    path: "/login", // Change to absolute path
    element: <LoginPage />,
  },
]);

export default router;
