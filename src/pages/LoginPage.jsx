import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button, Input, Spinner, toast } from "@heroui/react";
import { Link, useNavigate } from "react-router";
import { useAuthStore } from "../store/authStore";

const loginSchema = z.object({
  email: z.string().email("Введите корректный email"),
  password: z.string().min(1, "Введите пароль"),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const loginUser = useAuthStore((state) => state.login);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });
  const onSubmit = async (data) => {
    try {
      await loginUser(data.email, data.password);

      toast.success("Вход выполнен");
      navigate("/");
    } catch (error) {
      toast.danger(error.message);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-default-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Вход</h2>
          <p className="mt-1 text-sm text-default-500">
            Войдите в свой аккаунт Woofly
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-4"
          noValidate
        >
          <div className="w-full">
            <Input
              className="w-full"
              type="email"
              placeholder="Электронная почта"
              {...register("email")}
            />

            {errors.email && (
              <p className="mt-1 text-sm text-danger">{errors.email.message}</p>
            )}
          </div>

          <div className="w-full">
            <Input
              className="w-full"
              type="password"
              placeholder="Пароль"
              {...register("password")}
            />

            {errors.password && (
              <p className="mt-1 text-sm text-danger">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button type="submit" isDisabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Spinner size="sm" />
                Вход...
              </>
            ) : (
              "Войти"
            )}
          </Button>

          <p className="text-center text-sm">
            Нет аккаунта?{" "}
            <Link to="/register" className="font-medium">
              Зарегистрироваться
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
