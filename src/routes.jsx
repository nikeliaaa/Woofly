import { redirect } from "react-router";
import Layout from "./Layout";
import Feed from "./components/Feed";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import { useAuthStore } from "./store/authStore";

function redirectIfAuthed() {
  const token = useAuthStore.getState().token;

  if (token) {
    throw redirect("/");
  }

  return null;
}

export const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Feed />,
      },
      {
        path: "login",
        element: <LoginPage />,
        loader: redirectIfAuthed,
      },
      {
        path: "register",
        element: <RegisterPage />,
        loader: redirectIfAuthed,
      },
      {
        path: "profile/:id",
        element: <ProfilePage />,
      },
    ],
  },
];
