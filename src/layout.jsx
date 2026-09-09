import { Toast } from "@heroui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { Outlet } from "react-router";
import Header from "./components/Header";
import { useAuthStore } from "./store/authStore";

const queryClient = new QueryClient(); // перенос из App.jsx

export default function Layout() {
  useEffect(() => {
    //  восстановление данных профиля пользователя
    useAuthStore.getState().checkAuth();
  }, []);

  return (
    // перенос из App.jsx
    <QueryClientProvider client={queryClient}>
      {" "}
      <Toast.Provider placement="bottom end" />
      <Header />
      <Outlet />
    </QueryClientProvider>
  );
}
