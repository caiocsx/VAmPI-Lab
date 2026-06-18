import { createBrowserRouter } from "react-router"
import { DashboardPage } from "./app/dashboard/page"
import { HomePage } from "./app/home/page"
import { LoginPage } from "./app/login/page"
import { SignupPage } from "./app/signup/page"

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
    path: "/dashboard",
    element: <DashboardPage />,
  },
])
