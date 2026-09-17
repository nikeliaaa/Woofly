import { create } from "zustand"; // для создания хранилища
import { persist } from "zustand/middleware"; // для автоматического сохранения токена
import { API_URL } from "../api";

export const useAuthStore = create(
  // создание хранилища
  persist(
    (set, get) => ({
      // состояние хранилища
      user: null,
      token: null,
      // actions
      login: async (email, password) => {
        const res = await fetch(`${API_URL}/api/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error);
        }

        set({
          user: data.user,
          token: data.token,
        });

        return data;
      },

      register: async (username, email, password) => {
        const res = await fetch(`${API_URL}/api/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error);
        }

        set({
          user: data.user,
          token: data.token,
        });

        return data;
      },

      logout: () => {
        set({
          user: null,
          token: null,
        });
      },

      checkAuth: async () => {
        const token = get().token;

        if (!token) {
          return null;
        }

        try {
          const res = await fetch(`${API_URL}/api/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!res.ok) {
            throw new Error("Ошибка авторизации");
          }

          const user = await res.json();

          set({ user });

          return user;
        } catch {
          set({
            user: null,
            token: null,
          });

          return null;
        }
      },
    }),
    {
      name: "woofly_auth",
      partialize: (state) => ({ token: state.token }), // сохранение только токена
    },
  ),
);
