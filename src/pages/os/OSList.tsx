import { useState } from "react";
import { Clock, Play, CheckCircle2, Car, Banknote } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

type OSStatus = "esperando" | "lavando" | "lavado";

interface MockOS {
  id: string;
  plate: string;
  model: string;
  serviceName: string;
  price: number;
  status: OSStatus;
  createdAt: string;
}

const MOCK_DATA: MockOS[] = [
  {
    id: "os-001",
    plate: "ABC-1234",
    model: "Honda Civic",
    serviceName: "Lavagem Completa",
    price: 80,
    status: "esperando",
    createdAt: "10:30",
  },
  {
    id: "os-002",
    plate: "XYZ-9876",
    model: "Toyota Corolla",
    serviceName: "Ducha Simples",
    price: 40,
    status: "lavando",
    createdAt: "10:15",
  },
  {
    id: "os-003",
    plate: "DEF-5678",
    model: "Jeep Compass",
    serviceName: "Lavagem Premium",
    price: 120,
    status: "lavado",
    createdAt: "09:45",
  },
];

export default function OSList() {
  const [activeTab, setActiveTab] = useState<OSStatus | "todas">("todas");

  const filteredOS = MOCK_DATA.filter((os) =>
    activeTab === "todas" ? true : os.status === activeTab
  );

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 p-4 md:p-0">
      {/* Header & Filtros */}
      <div className="mb-6 sticky top-0 bg-slate-50/80 backdrop-blur-md z-10 py-2 -mx-4 px-4 md:mx-0 md:px-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Fila de Lavagem</h1>
            <p className="text-slate-500 text-sm">Gerencie o pátio em tempo real</p>
          </div>
        </div>

        <Tabs defaultValue="todas" onValueChange={(v) => setActiveTab(v as any)} className="w-full">
          <TabsList className="w-full grid grid-cols-4 bg-slate-200/50 p-1 rounded-xl">
            <TabsTrigger value="todas" className="rounded-lg text-xs md:text-sm font-medium">Todas</TabsTrigger>
            <TabsTrigger value="esperando" className="rounded-lg text-xs md:text-sm font-medium">Fila</TabsTrigger>
            <TabsTrigger value="lavando" className="rounded-lg text-xs md:text-sm font-medium">Lavando</TabsTrigger>
            <TabsTrigger value="lavado" className="rounded-lg text-xs md:text-sm font-medium">Prontos</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Lista de Cards */}
      <div className="flex flex-col gap-4 pb-4">
        {filteredOS.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <Car size={48} className="mb-4 opacity-20" />
            <p className="font-medium">Nenhum veículo nesta lista.</p>
          </div>
        ) : (
          filteredOS.map((os) => (
            <OSCard key={os.id} os={os} />
          ))
        )}
      </div>
    </div>
  );
}

function OSCard({ os }: { os: MockOS }) {
  const statusConfig = {
    esperando: {
      color: "bg-amber-100 text-amber-700 border-amber-200",
      icon: <Clock size={14} className="mr-1" />,
      label: "Aguardando",
      actionText: "Iniciar",
      actionIcon: <Play size={16} className="mr-2" />,
      actionColor: "bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/20",
    },
    lavando: {
      color: "bg-blue-100 text-blue-700 border-blue-200",
      icon: <Clock size={14} className="mr-1 animate-pulse" />,
      label: "Lavando",
      actionText: "Finalizar",
      actionIcon: <CheckCircle2 size={16} className="mr-2" />,
      actionColor: "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20",
    },
    lavado: {
      color: "bg-emerald-100 text-emerald-700 border-emerald-200",
      icon: <CheckCircle2 size={14} className="mr-1" />,
      label: "Pronto",
      actionText: "Cobrar",
      actionIcon: <Banknote size={16} className="mr-2" />,
      actionColor: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20",
    },
  };

  const config = statusConfig[os.status];

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 transition-all hover:shadow-md flex flex-col gap-4">
      {/* Topo do Card: Placa e Status */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-bold text-slate-800 font-mono tracking-tight">
              {os.plate}
            </h3>
            <span className="text-sm font-medium text-slate-400">• {os.model}</span>
          </div>
          <p className="text-sm font-medium text-slate-600">{os.serviceName}</p>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <Badge variant="outline" className={cn("px-2.5 py-0.5 rounded-full border font-semibold flex items-center", config.color)}>
            {config.icon}
            {config.label}
          </Badge>
          <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
            Chegada {os.createdAt}
          </span>
        </div>
      </div>

      {/* Separador */}
      <div className="h-px w-full bg-slate-50" />

      {/* Base do Card: Valor e Ação */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Total</p>
          <p className="text-lg font-bold text-slate-900">
            R$ {os.price.toFixed(2).replace(".", ",")}
          </p>
        </div>

        <button
          className={cn(
            "flex items-center justify-center h-11 px-5 rounded-xl font-semibold text-sm transition-all shadow-sm active:scale-95",
            config.actionColor
          )}
        >
          {config.actionIcon}
          {config.actionText}
        </button>
      </div>
    </div>
  );
}
