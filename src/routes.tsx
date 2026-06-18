import { DashboardPage } from "@/app/dashboard/page";
import { HomePage } from "@/app/home/page";
import { LoginPage } from "@/app/login/page";
import { SignupPage } from "@/app/signup/page";
import { ProtectedRoute } from "@/components/protected-route";
import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
    ],
  },
]);
