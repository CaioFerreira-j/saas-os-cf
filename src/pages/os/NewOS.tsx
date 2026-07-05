import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Car, Wrench, Check, ChevronLeft, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const newOsSchema = z.object({
  plate: z.string().min(7, "Placa inválida").max(8),
  model: z.string().min(2, "Modelo é obrigatório"),
  serviceId: z.string().min(1, "Selecione um serviço"),
});

type NewOsForm = z.infer<typeof newOsSchema>;

const MOCK_SERVICES = [
  { id: "s1", name: "Ducha Simples", price: 40, time: "30 min" },
  { id: "s2", name: "Lavagem Completa", price: 80, time: "1 hr" },
  { id: "s3", name: "Lavagem Premium", price: 150, time: "2 hrs" },
];

export default function NewOS() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<NewOsForm>({
    resolver: zodResolver(newOsSchema),
  });

  const selectedService = watch("serviceId");

  const onSubmit = async (data: NewOsForm) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Nova OS criada:", data);
    setIsLoading(false);
    navigate("/app/os");
  };

  // Formatação de Placa simples (uppercase e hífen)
  const handlePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (val.length > 3 && isNaN(Number(val[3]))) {
      // Mercosul format or old format handling could go here. Keeping it simple.
    }
    if (val.length > 3) val = val.slice(0, 3) + "-" + val.slice(3, 7);
    setValue("plate", val, { shouldValidate: true });
  };

  return (
    <div className="flex flex-col h-full animate-in slide-in-from-right-4 duration-300 pb-24 md:pb-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 sticky top-0 bg-slate-50/80 backdrop-blur-md z-10 py-4 -mx-4 px-4 md:mx-0 md:px-0">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors"
        >
          <ChevronLeft size={24} className="text-slate-700" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Nova OS</h1>
          <p className="text-slate-500 text-sm">Entrada de veículo no pátio</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
        {/* Seção Veículo */}
        <section className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-50">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Car size={20} />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Dados do Veículo</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="plate" className="text-slate-700 font-medium">Placa</Label>
              <Input
                id="plate"
                placeholder="ABC-1234"
                className={cn(
                  "h-14 text-lg font-mono uppercase px-4 rounded-xl border-slate-200 bg-slate-50 focus-visible:ring-blue-500",
                  errors.plate && "border-red-500 focus-visible:ring-red-500"
                )}
                {...register("plate")}
                onChange={handlePlateChange}
              />
              {errors.plate && <p className="text-red-500 text-xs font-medium">{errors.plate.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="model" className="text-slate-700 font-medium">Modelo / Cor</Label>
              <Input
                id="model"
                placeholder="Ex: Honda Civic Preto"
                className={cn(
                  "h-12 px-4 rounded-xl border-slate-200 bg-slate-50 focus-visible:ring-blue-500",
                  errors.model && "border-red-500 focus-visible:ring-red-500"
                )}
                {...register("model")}
              />
              {errors.model && <p className="text-red-500 text-xs font-medium">{errors.model.message}</p>}
            </div>
          </div>
        </section>

        {/* Seção Serviço */}
        <section className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-50">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
              <Wrench size={20} />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Tipo de Serviço</h2>
          </div>

          <div className="space-y-3">
            {MOCK_SERVICES.map((service) => (
              <label
                key={service.id}
                className={cn(
                  "flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all",
                  selectedService === service.id
                    ? "border-emerald-500 bg-emerald-50/50"
                    : "border-slate-100 bg-slate-50 hover:bg-slate-100"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center border transition-colors",
                    selectedService === service.id ? "bg-emerald-500 border-emerald-500" : "border-slate-300 bg-white"
                  )}>
                    {selectedService === service.id && <Check size={14} className="text-white" />}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{service.name}</p>
                    <p className="text-xs text-slate-500 font-medium">Duração aprox: {service.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">R$ {service.price.toFixed(2).replace(".", ",")}</p>
                </div>
                {/* Input radio oculto gerido pelo React Hook Form */}
                <input
                  type="radio"
                  value={service.id}
                  className="hidden"
                  {...register("serviceId")}
                />
              </label>
            ))}
            {errors.serviceId && <p className="text-red-500 text-xs font-medium">{errors.serviceId.message}</p>}
          </div>
        </section>

        {/* Botão Fixo (Floating Action) apenas no mobile, ou estático no final */}
        <div className="fixed bottom-[80px] md:bottom-8 left-4 right-4 md:static md:w-full z-20">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 rounded-xl bg-slate-900 hover:bg-slate-800 text-base font-bold text-white shadow-xl shadow-slate-900/20 active:scale-[0.98] transition-all"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            ) : (
              "Confirmar Entrada (Gerar OS)"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
