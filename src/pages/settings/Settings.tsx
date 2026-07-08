import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Store, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const settingsSchema = z.object({
  companyName: z.string().min(2, "Nome da empresa é obrigatório"),
  phone: z.string().min(10, "Telefone inválido"),
  whatsapp: z.string().min(10, "WhatsApp inválido"),
});

type SettingsForm = z.infer<typeof settingsSchema>;

export default function Settings() {
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      companyName: "LavaJato do João",
      phone: "11999999999",
      whatsapp: "11999999999",
    }
  });

  const onSubmit = async (data: SettingsForm) => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    console.log("Configurações salvas:", data);
    setIsSaving(false);
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 p-4 md:p-0 pb-24 md:pb-8 max-w-3xl mx-auto md:mx-0">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Configurações</h1>
        <p className="text-slate-500 text-sm">Gerencie os dados da sua empresa</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Bloco Empresa */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-50">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Store size={20} />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Dados do Lava-Jato</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="companyName" className="text-slate-700 font-medium">Nome da Empresa</Label>
              <Input
                id="companyName"
                {...register("companyName")}
                className={cn(
                  "h-12 px-4 rounded-xl border-slate-200 bg-slate-50 focus-visible:ring-blue-500",
                  errors.companyName && "border-red-500"
                )}
              />
              {errors.companyName && <p className="text-red-500 text-xs">{errors.companyName.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-slate-700 font-medium">Telefone</Label>
                <Input
                  id="phone"
                  {...register("phone")}
                  className={cn(
                    "h-12 px-4 rounded-xl border-slate-200 bg-slate-50 focus-visible:ring-blue-500",
                    errors.phone && "border-red-500"
                  )}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="whatsapp" className="text-slate-700 font-medium">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  {...register("whatsapp")}
                  className={cn(
                    "h-12 px-4 rounded-xl border-slate-200 bg-slate-50 focus-visible:ring-blue-500",
                    errors.whatsapp && "border-red-500"
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bloco Segurança */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 opacity-70">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
              <Shield size={20} />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Segurança</h2>
          </div>
          <p className="text-sm text-slate-500 mb-4">A alteração de senha deve ser feita através do link de recuperação no login.</p>
          <Button type="button" variant="outline" disabled className="rounded-xl font-medium">
            Alterar Senha
          </Button>
        </div>

        {/* Action Bottom */}
        <div className="flex justify-end pt-4">
          <Button 
            type="submit" 
            disabled={isSaving}
            className="w-full md:w-auto h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20 active:scale-95 transition-all"
          >
            <Save size={18} className="mr-2" />
            {isSaving ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      </form>
    </div>
  );
}
