import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader2, Droplets } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/services/supabase";

const loginSchema = z.object({
  email: z.string().email("Insira um e-mail válido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setAuthError(null);
    
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    setIsLoading(false);

    if (error) {
      setAuthError("E-mail ou senha incorretos.");
      return;
    }

    // Redireciona para de onde veio ou app/os
    const from = location.state?.from?.pathname || "/app/os";
    navigate(from, { replace: true });
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-blue-50/50">
          <Droplets className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight text-center">
          Bem-vindo ao LavaJato PRO
        </h1>
        <p className="text-slate-500 text-sm mt-2 text-center max-w-[280px]">
          Acesse sua conta para gerenciar os serviços.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {authError && (
          <div className="bg-red-50 text-red-600 text-sm font-medium p-3 rounded-xl border border-red-100 flex items-center justify-center">
            {authError}
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-slate-700 font-medium ml-1">
            E-mail
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            {...register("email")}
            className={cn(
              "h-12 px-4 rounded-xl border-slate-200 bg-slate-50 focus-visible:bg-white focus-visible:ring-blue-500 transition-all",
              errors.email && "border-red-500 focus-visible:ring-red-500"
            )}
          />
          {errors.email && (
            <p className="text-red-500 text-xs ml-1 font-medium">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between ml-1">
            <Label htmlFor="password" className="text-slate-700 font-medium">
              Senha
            </Label>
            <button
              type="button"
              className="text-blue-600 text-xs font-semibold hover:text-blue-700 transition-colors"
            >
              Esqueceu a senha?
            </button>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register("password")}
            className={cn(
              "h-12 px-4 rounded-xl border-slate-200 bg-slate-50 focus-visible:bg-white focus-visible:ring-blue-500 transition-all",
              errors.password && "border-red-500 focus-visible:ring-red-500"
            )}
          />
          {errors.password && (
            <p className="text-red-500 text-xs ml-1 font-medium">{errors.password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-base font-semibold shadow-md shadow-blue-600/20 transition-all active:scale-[0.98]"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            "Entrar na conta"
          )}
        </Button>
      </form>
    </div>
  );
}
