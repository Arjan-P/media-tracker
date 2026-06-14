import { createBrowserRouter, Navigate } from "react-router-dom";

import { RootLayout } from "../layouts/RootLayout";
import { PublicLayout } from "../layouts/PublicLayout";
import { ProtectedLayout } from "../layouts/ProtectedLayout";
import { AppLayout } from "../layouts/AppLayout";

import { LoginPage, SignupPage } from "@/features/auth";
import { ROUTES } from "./routes";
import { ExplorePage } from "@/features/explore";
import { LibraryPage } from "@/features/library";
import { HomePage } from "@/features/home";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      // Public auth pages
      {
        element: <PublicLayout />,
        children: [
          {
            index: true,
            element: <Navigate to={ROUTES.EXPLORE_MOVIES} replace />,
          },
          { path: "login", element: <LoginPage /> },
          { path: "signup", element: <SignupPage /> },
        ],
      },
      // AppLayout wraps both public explore + protected library
      {
        element: <AppLayout />,
        children: [
          // Public — no auth needed
          { path: "explore/:type", element: <ExplorePage /> },
          // Protected — auth required
          {
            element: <ProtectedLayout />,
            children: [
              { path: "home", element: <HomePage /> },
              { path: "library", element: <LibraryPage /> },
            ],
          },
        ],
      },
    ],
  },
]);
