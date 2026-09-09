import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuthStore } from "../store/authStore";
import { Button, Input, Spinner, toast } from "@heroui/react";
import { Link, useNavigate } from "react-router";

const registerSchema = z.object({
  username: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  email: z.string().email("Введите корректный email"),
  password: z.string().min(4, "Пароль должен содержать минимум 4 символа"),
});

export default function RegisterPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const registerUser = useAuthStore((state) => state.register);

  const onSubmit = async (data) => {
    try {
      await registerUser(data.username, data.email, data.password);

      toast.success("Регистрация прошла успешно");
      navigate("/");
    } catch (error) {
      toast.danger(error.message);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-default-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Регистрация</h2>
          <p className="mt-1 text-sm text-default-500">
            Создайте аккаунт в Woofly
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          noValidate
        >
          <div>
            <Input
              className="w-full"
              placeholder="Имя пользователя"
              {...register("username")}
            />

            {errors.username && (
              <p className="mt-1 text-sm text-danger">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
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

          <div>
            <Input
              className="w-full"
              type="password"
              placeholder="Пароль, минимум 4 символа"
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
                Регистрация...
              </>
            ) : (
              "Зарегистрироваться"
            )}
          </Button>

          <p className="text-center text-sm">
            Уже есть аккаунт?{" "}
            <Link to="/login" className="font-medium">
              Войти
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
