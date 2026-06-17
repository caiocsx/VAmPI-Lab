import { createBrowserRouter } from "react-router";
import { App } from "./App";
import { DashboardPage } from "./app/dashboard/page";
import { LoginPage } from "./app/login/page";
import { SignupPage } from "./app/signup/page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
  },
  {
    path: "/login",
    element: <LoginPage/>,
  },
  {
    path: "/signup",
    element: <SignupPage/>,
  },
  {
    path: "/dashboard",
    element: <DashboardPage/>,
  }
]);
