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
    handle: {
      title: "Home",
    },
  },
  {
    path: "/login",
    element: <LoginPage />,
    handle: {
      title: "Login",
    },
  },
  {
    path: "/signup",
    element: <SignupPage />,
    handle: {
      title: "Signup",
    },
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
            handle: {
              title: "Dashboard",
            },
          },
          {
            path: "/books",
            element: <BooksPage />,
            handle: {
              title: "Books",
            },
          },
          {
            path: "/writers",
            element: <WritersPage />,
            handle: {
              title: "Writers",
            },
          },
          {
            path: "/settings",
            element: <SettingsPage />,
            handle: {
              title: "Settings",
            },
          },
          {
            path: "/profile",
            element: <ProfilePage />,
            handle: {
              title: "Profile",
            },
          },
        ],
      },
    ],
  },
]);
