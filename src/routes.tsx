import { BooksPage } from "@/app/books/page";
import { DashboardPage } from "@/app/dashboard/page";
import { HomePage } from "@/app/home/page";
import { LoginPage } from "@/app/login/page";
import { ProfilePage } from "@/app/profile/page";
import { SettingsPage } from "@/app/settings/page";
import { SignupPage } from "@/app/signup/page";
import { WritersPage } from "@/app/writers/page";
import { DashboardLayout } from "@/components/dashboard-layout";
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
        element: <DashboardLayout />,
        children: [
          {
            path: "/dashboard",
            element: <DashboardPage />,
          },
          {
            path: "/books",
            element: <BooksPage />,
          },
          {
            path: "/writers",
            element: <WritersPage />,
          },
          {
            path: "/settings",
            element: <SettingsPage />,
          },
          {
            path: "/profile",
            element: <ProfilePage />,
          },
        ],
      },
    ],
  },
]);
