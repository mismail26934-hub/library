import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useLogin } from "@/features/auth/useAuth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof schema>;

export function LoginPage() {
  const login = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-5 py-10">
      <div className="flex w-full max-w-[400px] flex-col gap-5">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3">
          <img src="/figma/logo.png" alt="Booky" className="size-[33px]" />
          <span className="text-[25px] font-bold leading-none text-[var(--color-ink)]">
            Booky
          </span>
        </Link>

        {/* Heading */}
        <div className="flex flex-col gap-2">
          <h1 className="text-[28px] font-bold leading-[38px] tracking-[-0.56px] text-[var(--color-ink)]">
            Login
          </h1>
          <p className="text-base font-semibold leading-[30px] tracking-[-0.32px] text-[var(--color-ink-muted)]">
            Sign in to manage your library account.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit((v) => login.mutate(v))}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-0.5">
            <label
              htmlFor="email"
              className="text-sm font-bold leading-7 tracking-[-0.28px] text-[var(--color-ink)]"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className={cn(
                "h-12 w-full rounded-xl border border-[#d5d7da] bg-white px-4 py-2 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-subtle)] focus:outline-none focus:ring-2 focus:ring-[#1c65da]/40 focus:border-[#1c65da]",
                errors.email && "border-destructive focus:ring-destructive/30 focus:border-destructive",
              )}
              {...register("email")}
            />
            {errors.email && (
              <p className="mt-0.5 text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-0.5">
            <label
              htmlFor="password"
              className="text-sm font-bold leading-7 tracking-[-0.28px] text-[var(--color-ink)]"
            >
              Password
            </label>
            <div
              className={cn(
                "flex h-12 w-full items-center gap-2 rounded-xl border border-[#d5d7da] bg-white px-4 py-2 focus-within:ring-2 focus-within:ring-[#1c65da]/40 focus-within:border-[#1c65da]",
                errors.password && "border-destructive focus-within:ring-destructive/30 focus-within:border-destructive",
              )}
            >
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="min-w-0 flex-1 bg-transparent text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-subtle)] focus:outline-none"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="shrink-0 text-[var(--color-ink-subtle)] transition-colors hover:text-[var(--color-ink)]"
              >
                {showPassword ? <Eye className="size-5" /> : <EyeOff className="size-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-0.5 text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            loading={login.isPending}
            className="h-12 w-full rounded-full bg-[#1c65da] text-base font-bold tracking-[-0.32px] text-white hover:bg-[#1c65da]/90"
          >
            Login
          </Button>

          <p className="flex items-center justify-center gap-1 text-base tracking-[-0.32px]">
            <span className="font-semibold text-[var(--color-ink)]">
              Don't have an account?
            </span>
            <Link to="/register" className="font-bold text-[#1c65da] hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
