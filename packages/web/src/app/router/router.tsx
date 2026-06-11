import { createBrowserRouter, Navigate } from "react-router-dom";

import { RootLayout } from "../layouts/RootLayout";
import { PublicLayout } from "../layouts/PublicLayout";
import { ProtectedLayout } from "../layouts/ProtectedLayout";
import { AppLayout } from "../layouts/AppLayout";

import { LoginPage, SignupPage } from "@/features/auth";
import { ROUTES } from "./routes";

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <RootLayout />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          { index: true, element: <Navigate to={ROUTES.LOGIN} replace /> },
          { path: "login", element: <LoginPage /> },
          { path: "signup", element: <SignupPage /> },
        ],
      },
      {
        element: <ProtectedLayout />,
        children: [
          {
            element: <AppLayout />,
            children: [],
          },
        ],
      },
    ],
  },
]);
