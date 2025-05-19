import { Route } from "@/constant/route";
import Authentication from "@/features/Authentication";
import ConfirmEmail from "@/features/Authentication/components/ForgotPassword/ConfirmEmail";
import Forgotpassword from "@/features/Authentication/components/ForgotPassword/ForgotPassword";
import ResetPassword from "@/features/Authentication/components/ForgotPassword/PasswordChange";
import Login from "@/features/Authentication/components/Login";
import SignUpForm from "@/features/Authentication/components/SignUp";
import Home from "@/features/Home";
import Layout from "@/layout/mainLayout";

export const publicRoutes = [
  {
    element: <Layout />,
    children: [
      {
        element: <Home />,
        path: Route.Home,
      },
      {
        element: <Forgotpassword />,
        path: Route.ForgotPassword,
      },
      {
        element: <ConfirmEmail />,
        path: `${Route.ConfirmEmail}`,
      },
      {
        element: <ResetPassword />,
        path: Route.ResetPassword,
      },
      {
        element: <Authentication />,
        children: [
          {
            element: <Login />,
            path: Route.Login,
          },
          {
            element: <SignUpForm />,
            path: Route.SignUp,
          },
        ],
      },
    ],
  },
];
