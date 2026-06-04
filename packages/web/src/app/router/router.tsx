import { createBrowserRouter, Navigate } from "react-router-dom";

import { RootLayout } from "../layouts/RootLayout";
import { PublicLayout } from "../layouts/PublicLayout";
import { LoginPage, SignupPage } from "@/features/auth";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  DASHBOARD: "/dashboard",
} as const;

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <RootLayout />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          {
            index: true,
            element: <Navigate to={ROUTES.LOGIN} replace />,
          },
          {
            path: ROUTES.LOGIN.slice(1),
            element: <LoginPage />,
          },
          {
            path: ROUTES.SIGNUP.slice(1),
            element: <SignupPage />,
          },
        ],
      },
    ],
  },
]);
